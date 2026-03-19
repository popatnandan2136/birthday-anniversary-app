import { Storage } from '@google-cloud/storage';
import fs from 'fs';

const keyFilename = './service-account.json';
const bucketName = 'birthday-anniversary-app-2136.firebasestorage.app';

if (!fs.existsSync(keyFilename)) {
  console.error('Error: service-account.json not found.');
  process.exit(1);
}

const storage = new Storage({ keyFilename });

async function checkBucket() {
  try {
    const keyFile = JSON.parse(fs.readFileSync(keyFilename, 'utf8'));
    console.log('Project ID:', keyFile.project_id);
    console.log('Client Email:', keyFile.client_email);
    console.log('Private Key length:', keyFile.private_key?.length);
    
    const [exists] = await storage.bucket(bucketName).exists();
    console.log(`Bucket ${bucketName} exists: ${exists}`);
    
    if (exists) {
        const corsConfiguration = JSON.parse(fs.readFileSync('./cors.json', 'utf8'));
        await storage.bucket(bucketName).setCorsConfiguration(corsConfiguration);
        console.log('✅ CORS applied successfully!');
    } else {
        // Try the .appspot.com one just in case
        const altBucket = 'birthday-anniversary-app-2136.appspot.com';
        const [existsAlt] = await storage.bucket(altBucket).exists();
        console.log(`Bucket ${altBucket} exists: ${existsAlt}`);
        if (existsAlt) {
            const corsConfiguration = JSON.parse(fs.readFileSync('./cors.json', 'utf8'));
            await storage.bucket(altBucket).setCorsConfiguration(corsConfiguration);
            console.log('✅ CORS applied to .appspot.com successfully!');
        }
    }
  } catch (error) {
    console.error('ERROR:', error.message);
  }
}

checkBucket();
