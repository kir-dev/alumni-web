import { Prisma, VerificationTokenType } from '@prisma/client';
import { render } from '@react-email/render';
import { TRPCError } from '@trpc/server';
import { addMinutes } from 'date-fns';
import { z } from 'zod';

import { SITE_URL } from '@/config/environment.config';
import { prismaClient } from '@/config/prisma.config';
import EmailVerification from '@/emails/email-verification';
import PasswordResetEmail from '@/emails/password-reset';
import Welcome from '@/emails/welcome';
import { singleSendEmail } from '@/lib/email';
import { getDomainForHost } from '@/lib/server-utils';
import { generateRandomString, hashPassword } from '@/lib/utils';
import { privateProcedure, publicProcedure, superAdminProcedure } from '@/trpc/trpc';
import {
  ChangePasswordDto,
  ImportUsersDto,
  PasswordResetDto,
  RegisterDto,
  UpdateUserProfileDto,
  UserProfileDto,
  UserQuery,
} from '@/types/user.types';

export const registerUser = publicProcedure.input(RegisterDto).mutation(async (opts): Promise<UserProfileDto> => {
  const { password, ...data } = opts.input;

  const existingUser = await prismaClient.user.findFirst({
    where: {
      email: data.email,
    },
  });

  if (existingUser) {
    throw new TRPCError({ code: 'BAD_REQUEST', message: 'Ez az e-mail cím már regisztrálva van' });
  }

  // Get the root group from the domain
  const domain = await getDomainForHost();
  const rootGroupId = domain?.groupId;

  // Fetch root group details if available
  let rootGroup = null;
  if (rootGroupId) {
    rootGroup = await prismaClient.group.findUnique({
      where: { id: rootGroupId },
      select: {
        name: true,
        icon: true,
        color: true,
      },
    });
  }

  const user = await prismaClient.user.create({
    data: {
      ...data,
      graduationDate: data.graduationDate ? new Date(data.graduationDate) : null,
      password: hashPassword(password),
      rootGroupId, // Set the root group ID
    },
    select: {
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      address: true,
      graduationDate: true,
      id: true,
      rootGroup: {
        select: {
          name: true,
          icon: true,
          color: true,
        },
      },
    },
  });

  const verificationToken = await prismaClient.verificationToken.create({
    data: {
      user: {
        connect: {
          id: user.id,
        },
      },
      token: generateRandomString(32),
      expires: addMinutes(new Date(), 15),
      type: VerificationTokenType.Email,
    },
  });

  await singleSendEmail({
    to: user.email,
    subject: 'Üdvözlünk az Alumni Weben 👋',
    html: render(
      Welcome({
        name: user.firstName,
        verificationLink: `${SITE_URL}/api/verify/${verificationToken.token}`,
        rootGroup,
      })
    ),
  });
  return { ...user, graduationDate: user.graduationDate?.toISOString() ?? null };
});

export const requestEmailVerification = privateProcedure.mutation(async (opts) => {
  if (!opts.ctx.session?.user) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Unauthorized' });

  const user = await prismaClient.user.findUnique({
    where: {
      id: opts.ctx.session.user.id,
    },
  });

  if (!user) throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });

  await createEmailVerificationSession(user.id);
});

export const resetPassword = publicProcedure.input(PasswordResetDto).mutation(async (opts) => {
  const user = await prismaClient.user.findUnique({
    where: {
      email: opts.input.email,
    },
    include: {
      rootGroup: {
        select: {
          name: true,
          icon: true,
          color: true,
        },
      },
    },
  });

  if (!user) return;

  const verificationToken = await prismaClient.verificationToken.create({
    data: {
      user: {
        connect: {
          id: user.id,
        },
      },
      token: generateRandomString(32),
      expires: addMinutes(new Date(), 15),
      type: VerificationTokenType.Password,
    },
  });

  await singleSendEmail({
    to: user.email,
    subject: 'Jelszó visszaállítás',
    html: render(
      PasswordResetEmail({
        name: user.firstName,
        resetLink: `${SITE_URL}/password-reset/${verificationToken.token}`,
        rootGroup: user.rootGroup,
      })
    ),
  });
});

export const newPassword = publicProcedure
  .input(z.object({ token: z.string(), password: z.string() }))
  .mutation(async (opts) => {
    const verificationToken = await prismaClient.verificationToken.findUnique({
      where: {
        token: opts.input.token,
      },
    });

    if (!verificationToken) throw new TRPCError({ code: 'NOT_FOUND', message: 'Invalid token' });

    if (verificationToken.expires < new Date()) {
      await prismaClient.verificationToken.delete({
        where: {
          token: verificationToken.token,
        },
      });
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Token expired' });
    }

    const user = await prismaClient.user.findUnique({
      where: {
        id: verificationToken.userId,
      },
    });

    if (!user) throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });

    await prismaClient.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashPassword(opts.input.password),
      },
    });

    await prismaClient.verificationToken.delete({
      where: {
        token: verificationToken.token,
      },
    });
  });

export const updateProfile = privateProcedure
  .input(UpdateUserProfileDto)
  .mutation(async (opts): Promise<UserProfileDto> => {
    if (!opts.ctx.session?.user) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Unauthorized' });
    const existingUser = await prismaClient.user.findUnique({
      where: {
        id: opts.ctx.session.user.id,
      },
    });

    if (!existingUser) throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });

    const user = await prismaClient.user.update({
      where: {
        id: opts.ctx.session.user.id,
      },
      data: {
        ...opts.input,
        graduationDate: opts.input.graduationDate ? new Date(opts.input.graduationDate) : null,
      },
      select: {
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        address: true,
        graduationDate: true,
      },
    });

    if (existingUser.email !== user.email) {
      await createEmailVerificationSession(opts.ctx.session.user.id);
    }

    return { ...user, graduationDate: user.graduationDate?.toISOString() ?? null };
  });

export const getUserById = privateProcedure.input(z.string()).query(async (opts) => {
  return prismaClient.user.findUnique({
    where: {
      id: opts.input,
    },
  });
});

export const getMyUser = privateProcedure.query(async (opts) => {
  if (!opts.ctx.session?.user) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Unauthorized' });

  return prismaClient.user.findUnique({
    where: {
      id: opts.ctx.session.user.id,
    },
  });
});

async function createEmailVerificationSession(userId: string) {
  // Find the user with root group info
  const user = await prismaClient.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      rootGroup: {
        select: {
          name: true,
          icon: true,
          color: true,
        },
      },
    },
  });

  if (!user) throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });

  // Reset the emailVerified field
  await prismaClient.user.update({
    where: {
      id: userId,
    },
    data: {
      emailVerified: null,
    },
  });

  // Delete any existing email verification tokens
  await prismaClient.verificationToken.deleteMany({
    where: {
      userId: user.id,
      type: VerificationTokenType.Email,
    },
  });

  // Create a new verification token
  const verificationToken = await prismaClient.verificationToken.create({
    data: {
      user: {
        connect: {
          id: user.id,
        },
      },
      token: generateRandomString(32),
      expires: addMinutes(new Date(), 15),
      type: VerificationTokenType.Email,
    },
  });

  await singleSendEmail({
    to: user.email,
    subject: 'E-mail cím megerősítése',
    html: render(
      EmailVerification({
        name: user.firstName,
        verificationLink: `${SITE_URL}/api/verify/${verificationToken.token}`,
        rootGroup: user.rootGroup,
      })
    ),
  });
}

export const toggleSuperAdmin = privateProcedure.input(z.string()).mutation(async (opts) => {
  if (!opts.ctx.session?.user) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Unauthorized' });

  const user = await prismaClient.user.findUnique({
    where: {
      id: opts.input,
    },
  });

  if (!user) throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });

  await prismaClient.user.update({
    where: {
      id: user.id,
    },
    data: {
      isSuperAdmin: !user.isSuperAdmin,
    },
  });
});

export const deleteMyUser = privateProcedure.mutation(async (opts) => {
  if (!opts.ctx.session?.user.id) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Unauthorized' });

  await prismaClient.user.delete({
    where: {
      id: opts.ctx.session.user.id,
    },
  });
});

export const changePassword = privateProcedure.input(ChangePasswordDto).mutation(async (opts) => {
  if (!opts.ctx.session?.user) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Unauthorized' });

  const user = await prismaClient.user.findUnique({
    where: {
      id: opts.ctx.session.user.id,
    },
  });

  if (!user) throw new TRPCError({ code: 'NOT_FOUND', message: 'Felhasználó nem található' });

  if (user.password !== hashPassword(opts.input.oldPassword)) {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Hibás jelszó' });
  }

  await prismaClient.user.update({
    where: {
      id: user.id,
    },
    data: {
      password: hashPassword(opts.input.newPassword),
    },
  });
});

export const getUsers = superAdminProcedure.input(UserQuery).query(async ({ input }) => {
  const query: Prisma.UserWhereInput = {
    OR: [
      {
        firstName: {
          contains: input.name,
        },
      },
      {
        lastName: {
          contains: input.name,
        },
      },
      {
        email: {
          contains: input.name,
        },
      },
    ],
    isSuperAdmin: input.isAdministrator ? true : undefined,
  };

  const result = await prismaClient.user.findMany({
    skip: (input.page - 1) * input.limit,
    take: input.limit,
    orderBy: input.sort ? { [input.sort.field]: input.sort.order } : undefined,
    where: query,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      nickname: true,
      email: true,
      emailVerified: true,
      phone: true,
      isSuperAdmin: true,
    },
  });

  const totalCount = await prismaClient.user.count({
    where: query,
  });

  const maxPage = Math.max(Math.ceil(totalCount / input.limit), 1);
  const page = Math.min(input.page, maxPage);

  return {
    result,
    totalCount,
    maxPage,
    page,
  };
});

export const importUsers = superAdminProcedure.input(ImportUsersDto).mutation(async ({ input }) => {
  const existingUsers = await prismaClient.user.findMany({
    where: {
      email: {
        in: input.map((user) => user.email),
      },
    },
  });

  const existingEmails = new Set(existingUsers.map((user) => user.email));

  if (existingEmails.size > 0) {
    return existingUsers.map((user) => user.email);
  }

  const usersWithPassword = input.map((user) => ({
    ...user,
    password: hashPassword(generateRandomString(16)),
  }));

  await prismaClient.user.createMany({
    data: usersWithPassword,
  });

  return [];
});

export const updateRootGroup = privateProcedure
  .input(z.object({ rootGroupId: z.string().nullable() }))
  .mutation(async (opts) => {
    if (!opts.ctx.session?.user) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Unauthorized' });

    // If rootGroupId is null, set it to null in the database
    // Otherwise, verify that the group exists
    if (opts.input.rootGroupId) {
      const group = await prismaClient.group.findUnique({
        where: {
          id: opts.input.rootGroupId,
        },
      });

      if (!group) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'A megadott csoport nem létezik',
        });
      }
    }

    // Update the user's root group
    const user = await prismaClient.user.update({
      where: {
        id: opts.ctx.session.user.id,
      },
      data: {
        rootGroupId: opts.input.rootGroupId,
      },
      include: {
        rootGroup: {
          select: {
            name: true,
            icon: true,
            color: true,
          },
        },
      },
    });

    return user;
  });
