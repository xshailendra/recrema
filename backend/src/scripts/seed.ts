import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { connectDatabase } from '../config/database';

const runSeed = async () => {
  try {
    console.log('Connecting to database...');
    await connectDatabase();
    
    console.log('Starting seed...');

    const adminEmail = process.env.SEED_ADMIN_EMAIL;
    const adminPassword = process.env.SEED_ADMIN_PASSWORD;

    const client1Email = process.env.SEED_CLIENT1_EMAIL;
    const client1Password = process.env.SEED_CLIENT1_PASSWORD;
    const client1Code = process.env.SEED_CLIENT1_CODE;

    const client2Email = process.env.SEED_CLIENT2_EMAIL;
    const client2Password = process.env.SEED_CLIENT2_PASSWORD;
    const client2Code = process.env.SEED_CLIENT2_CODE;

    if (!adminEmail || !adminPassword || !client1Email || !client1Password || !client1Code || !client2Email || !client2Password || !client2Code) {
      throw new Error('Missing seed environment variables. Please check .env file.');
    }

    const saltRounds = 10;

    // 1. Seed Admin
    const adminHash = await bcrypt.hash(adminPassword, saltRounds);
    await User.findOneAndUpdate(
      { email: adminEmail },
      {
        name: 'Admin User',
        email: adminEmail,
        passwordHash: adminHash,
        role: 'admin',
        isActive: true,
      },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    );
    console.log(`Admin user seeded: ${adminEmail}`);

    // 2. Seed Client 1
    const client1Hash = await bcrypt.hash(client1Password, saltRounds);
    await User.findOneAndUpdate(
      { email: client1Email },
      {
        name: 'Client One',
        email: client1Email,
        passwordHash: client1Hash,
        role: 'client',
        clientCode: client1Code,
        isActive: true,
      },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    );
    console.log(`Client 1 seeded: ${client1Email}`);

    // 3. Seed Client 2
    const client2Hash = await bcrypt.hash(client2Password, saltRounds);
    await User.findOneAndUpdate(
      { email: client2Email },
      {
        name: 'Client Two',
        email: client2Email,
        passwordHash: client2Hash,
        role: 'client',
        clientCode: client2Code,
        isActive: true,
      },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    );
    console.log(`Client 2 seeded: ${client2Email}`);

    console.log('Seeding completed successfully!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

runSeed();
