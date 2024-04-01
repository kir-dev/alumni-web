import { User } from '@prisma/client';

import { prismaClient } from '@/config/prisma.config';
import { CreateUserProfileDto, UpdateUserProfileDto } from '@/types/user.types';

export async function saveProfile(id: string, profile: UpdateUserProfileDto): Promise<User> {
  return prismaClient.user.update({
    where: { id },
    data: profile,
  });
}

export async function getUserById(id: string): Promise<User | null> {
  return prismaClient.user.findUnique({
    where: { id },
  });
}

export async function getUserByEmail(email: string): Promise<User | null> {
  return prismaClient.user.findUnique({
    where: { email },
  });
}

export async function createUser(user: CreateUserProfileDto): Promise<User> {
  return prismaClient.user.create({
    data: user,
  });
}
