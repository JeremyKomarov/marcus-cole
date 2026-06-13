import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();
const db = client.db(process.env.MONGODB_DB_NAME || 'dreamrise');

// dreamrise_dev — full access to all projects
await db.collection('users').updateOne(
  { email: 'dev@dreamrise.co' },
  { $setOnInsert: {
    email: 'dev@dreamrise.co',
    passwordHash: await bcrypt.hash('CHANGE_ME_STRONG_PASSWORD', 12),
    role: 'dreamrise_dev',
    projects: [],
    createdAt: new Date(),
  }},
  { upsert: true }
);

// company_admin — client access to marcus-cole only
await db.collection('users').updateOne(
  { email: 'marcus@marcuscolegroup.com' },
  { $setOnInsert: {
    email: 'marcus@marcuscolegroup.com',
    passwordHash: await bcrypt.hash('CHANGE_ME_CLIENT_PASSWORD', 12),
    role: 'company_admin',
    projects: ['marcus-cole'],
    createdAt: new Date(),
  }},
  { upsert: true }
);

await client.close();
console.log('Users seeded. Delete this file now.');
