import 'dotenv/config';
import { getDb } from './src/db';
import { user } from './src/db/schema';
import { addCredits } from './src/credits/credits';
import { eq } from 'drizzle-orm';

async function main() {
  console.log('Connecting to DB...');
  const db = await getDb();
  
  const email = 'eyson.bigfool@gmail.com';
  console.log(`Looking for user ${email}...`);
  
  // Use query builder if available, or just select
  const usersFound = await db.select().from(user).where(eq(user.email, email)).limit(1);

  if (!usersFound || usersFound.length === 0) {
    console.error('User not found!');
    process.exit(1);
  }

  const targetUser = usersFound[0];
  console.log(`Found user ${targetUser.id}, adding 200 credits...`);
  
  await addCredits({
    userId: targetUser.id,
    amount: 200,
    type: 'admin_grant',
    description: 'Manual credit grant',
  });
  
  console.log('Done!');
  process.exit(0);
}

main().catch(console.error);
