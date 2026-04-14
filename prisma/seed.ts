import { PrismaClient, Role, Country, OrderStatus } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Start seeding...');

  // 1. Clean the database
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.paymentMethod.deleteMany();
  await prisma.dish.deleteMany();
  await prisma.menu.deleteMany();
  await prisma.restaurant.deleteMany();
  await prisma.user.deleteMany();

  // 2. Seed Users (2 Admins, 1 Manager, 2 Members per Country)
  const countries = [Country.AMERICA, Country.INDIA];
  const roles = [
    { role: Role.ADMIN, count: 2, prefix: 'admin' },
    { role: Role.MANAGER, count: 1, prefix: 'mod' },
    { role: Role.MEMBER, count: 2, prefix: 'user' },
  ];

  for (const country of countries) {
    for (const { role, count, prefix } of roles) {
      for (let i = 1; i <= count; i++) {
        const identifier = `${prefix}_${country.toLowerCase()}_${i}`;
        await prisma.user.create({
          data: {
            email: `${identifier}@example.com`,
            firstName: `${prefix.charAt(0).toUpperCase() + prefix.slice(1)} ${i}`,
            lastName: country,
            role,
            country,
          },
        });
      }
    }
  }

  console.log('Seeded 10 Users (5 per country)');

  // 3. Seed Restaurants, Menus, and Dishes
  const r1 = await prisma.restaurant.create({
    data: {
      name: 'Pizza Haven',
      address: '123 Pepperoni St, New York',
      rating: 4.5,
      country: Country.AMERICA,
      imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1000&auto=format&fit=crop',
      menus: {
        create: [
          {
            name: 'Artisan Pizzas',
            dishes: {
              create: [
                {
                  name: 'Margherita',
                  price: 12.99,
                  description: 'Fresh mozzarella, basil, and tomato sauce.',
                  isAvailable: true,
                  imageUrl: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?q=80&w=1000&auto=format&fit=crop',
                },
                {
                  name: 'Double Pepperoni',
                  price: 15.99,
                  description: 'Crispy pepperoni with extra cheese.',
                  isAvailable: true,
                  imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=1000&auto=format&fit=crop',
                },
              ],
            },
          },
        ],
      },
    },
  });

  const r2 = await prisma.restaurant.create({
    data: {
      name: 'Sushi Zen',
      address: '456 Sakana Way, Tokyo',
      rating: 4.9,
      country: Country.INDIA, // As per enum limitation
      imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1000&auto=format&fit=crop',
      menus: {
        create: [
          {
            name: 'Premium Rolls',
            dishes: {
              create: [
                {
                  name: 'Dragon Roll',
                  price: 18.00,
                  description: 'Eel, cucumber, and topped with avocado.',
                  isAvailable: true,
                  imageUrl: 'https://images.unsplash.com/photo-1617196034183-421b4917c92d?q=80&w=1000&auto=format&fit=crop',
                },
                {
                  name: 'Salmon Nigiri',
                  price: 14.50,
                  description: 'Fresh Atlantic salmon slices over rice.',
                  isAvailable: true,
                  imageUrl: 'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?q=80&w=1000&auto=format&fit=crop',
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log('Seeded Restaurants: ', [r1.name, r2.name]);

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
