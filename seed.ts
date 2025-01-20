import { faker } from '@faker-js/faker/locale/hu';
import { Group, PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

type CreateGroup = Omit<Group, 'createdAt' | 'updatedAt' | 'id' | 'icon' | 'color'>;

async function run() {
  const users: Omit<User, 'createdAt' | 'updatedAt' | 'emailVerified' | 'id'>[] = [];
  for (let i = 0; i < 50; i++) {
    users.push({
      address: faker.location.streetAddress(),
      isSuperAdmin: false,
      nickname: '',
      password: faker.internet.password(),
      email: faker.internet.email(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      phone: faker.phone.number(),
      graduationDate: faker.date.recent({ days: 365 }),
    });
  }
  await prisma.user.createMany({ data: users });

  const schId = await prisma.group.create({
    data: {
      name: 'Schönherz Alumni',
      description: 'Root group',
    },
  });

  const vikId = await prisma.group.create({
    data: {
      name: 'BME Villamosmérnöki és Informatikai Kar',
      description: 'Root group',
    },
  });

  const groups: CreateGroup[] = [];
  for (let i = 0; i < 5; i++) {
    groups.push({
      name: faker.commerce.department(),
      description: faker.lorem.sentence(),
      parentGroupId: schId.id,
    });
    groups.push({
      name: faker.commerce.department(),
      description: faker.lorem.sentence(),
      parentGroupId: vikId.id,
    });
  }
  await prisma.group.createMany({ data: groups });
}

run()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
