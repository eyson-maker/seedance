import 'dotenv/config';
import pg from 'pg';

const { Client } = pg;

async function main() {
  const connectionString = process.env.DATABASE_URL;
  console.log('Connecting to:', connectionString?.replace(/:[^:@]+@/, ':***@'));

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  console.log('Connected!');

  const email = 'eyson.bigfool@gmail.com';

  // Find the user
  const result = await client.query('SELECT id, email, name, role FROM "user" WHERE email = $1', [email]);

  if (result.rows.length === 0) {
    console.log(`User with email ${email} not found`);
    await client.end();
    process.exit(1);
  }

  console.log('Found user:', result.rows[0]);

  // Update role to admin
  await client.query('UPDATE "user" SET role = $1 WHERE email = $2', ['admin', email]);

  // Verify
  const updated = await client.query('SELECT id, email, name, role FROM "user" WHERE email = $1', [email]);
  console.log('Updated user:', updated.rows[0]);

  await client.end();
  process.exit(0);
}

main().catch(console.error);
