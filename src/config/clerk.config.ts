import { clerkClient } from '@clerk/clerk-sdk-node';
import *as dotenv from 'dotenv';

dotenv.config();

if (!process.env.CLERK_API_KEY) {
  throw new Error('CLERK_API_KEY is missing from environment variables.');
}

export { clerkClient };
