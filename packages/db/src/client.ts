import 'dotenv/config';

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const databaseUrl = process.env.DATABASE_URL;


const adapter = new PrismaPg({
  connectionString: databaseUrl!,
});

export const prisma = new PrismaClient({
  adapter,
});