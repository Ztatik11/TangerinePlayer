import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client'
dotenv.config({path: './.env'})

const prisma = new PrismaClient();

export default prisma;