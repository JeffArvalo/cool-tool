import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const roles = [{ name: 'manager' }, { name: 'client' }];
  let createdRoles: any = [];
  let createdUsers: any = [];
  let createdVendors: any = [];
  let createdCategories: any = [];

  for (const role of roles) {
    createdRoles.push(
      await prisma.role.upsert({
        where: { name: role.name },
        update: {},
        create: role,
      }),
    );
  }

  const users = [
    {
      firstName: 'Harry',
      lastName: 'Potter',
      email: 'harry.potter@test.com',
      password: '$2a$10$6fB5UukWkIP/btQbAgE4JuEJrifSUVaa0rS7d/KxrHiBDTjLl6TOq',
      phone: '1234-5678',
      roleId: createdRoles.find((x) => x.name === 'client').id,
    },
    {
      firstName: 'Chris',
      lastName: 'Smith',
      email: 'chris.smith@test.com',
      password: '$2a$10$KI7EzCKzZY5MKHxv956HceGVTfnL7Xp2D4KD4gtHWPoxv6z/I5.HG',
      phone: '1234-5678',
      roleId: createdRoles.find((x) => x.name === 'manager').id,
    },
  ];

  for (const user of users) {
    createdUsers.push(
      await prisma.userAccount.upsert({
        where: { email: user.email },
        update: {},
        create: user,
      }),
    );
  }

  const vendors = [{ name: 'Vendor 1' }, { name: 'Vendor 2' }];

  for (const vendor of vendors) {
    createdVendors.push(
      await prisma.vendor.upsert({
        where: { name: vendor.name },
        update: {},
        create: vendor,
      }),
    );
  }

  const categories = [{ name: 'Category 1' }, { name: 'Category 2' }];

  for (const cat of categories) {
    createdCategories.push(
      await prisma.category.upsert({
        where: { name: cat.name },
        update: {},
        create: cat,
      }),
    );
  }
}
main()
  .then(() => {
    console.log('Roles seeded');
    console.log('Users seeded');
    console.log('Vendors seeded');
    console.log('Categories seeded');
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
