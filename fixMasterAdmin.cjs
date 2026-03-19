const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const fixMasterAdmin = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI not found in .env.local');
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('test'); // Default database from previous logs
    const users = db.collection('users');

    const email = 'npmasteradmin@gmail.com';
    const result = await users.updateOne(
      { email: email },
      { $set: { role: 'MASTER_ADMIN' } }
    );

    if (result.matchedCount === 0) {
      console.error(`User ${email} not found in 'test' database!`);
      
      // Try listing all databases to find where the users are
      const dbs = await client.db().admin().listDatabases();
      console.log('Available databases:', dbs.databases.map(d => d.name));
    } else {
      console.log(`Successfully updated ${email} to MASTER_ADMIN role.`);
    }

    process.exit(0);
  } catch (error) {
    console.error('Error fixing Master Admin:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
};

fixMasterAdmin();
