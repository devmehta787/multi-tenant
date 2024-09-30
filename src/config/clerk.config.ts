import { clerkClient } from '@clerk/clerk-sdk-node';
import * as dotenv from 'dotenv';

dotenv.config(); 

console.log('Clerk API Key:', process.env.CLERK_SECRET_KEY);

if (!process.env.CLERK_SECRET_KEY) {
  throw new Error('CLERK_SECRET_KEY is missing from environment variables.');
}

export { clerkClient };
