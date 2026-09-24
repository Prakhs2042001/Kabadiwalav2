// src/scripts/set-passwords.ts
import bcrypt from 'bcryptjs';
import { db } from '../db/index.ts';
import { users } from '../db/schema.ts';

async function main() {
  const hash = await bcrypt.hash('Password@123', 10);
  await db.update(users).set({ passwordHash: hash, emailVerified: true });
  console.log('Successfully hashed and set passwords for all seed accounts to: Password@123');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
