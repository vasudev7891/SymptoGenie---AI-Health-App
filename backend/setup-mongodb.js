#!/usr/bin/env node

/**
 * MongoDB Setup Helper for SymptoGenie
 * This script helps configure MongoDB Atlas
 * Usage: node setup-mongodb.js
 */

import readline from 'readline';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const questions = {
  choice: 'Would you like to use MongoDB Atlas (cloud) or local MongoDB? (atlas/local): ',
  username: 'MongoDB Atlas username: ',
  password: 'MongoDB Atlas password: ',
  cluster: 'MongoDB Atlas cluster name (e.g., cluster0): ',
  database: 'Database name (default: symptogenie): '
};

console.log(`
╔════════════════════════════════════════════════════════════╗
║       SymptoGenie - MongoDB Setup Helper                  ║
║                                                            ║
║  This tool will help you configure MongoDB for the app    ║
╚════════════════════════════════════════════════════════════╝
`);

function question(prompt) {
  return new Promise(resolve => {
    rl.question(prompt, resolve);
  });
}

async function main() {
  try {
    const choice = await question(questions.choice);

    let mongoUri;
    let envContent;

    if (choice.toLowerCase() === 'atlas') {
      console.log(`
📚 MongoDB Atlas Setup:
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster (free tier M0)
4. Create database user in "Database Access"
5. Get connection string from "Connect" button
      `);

      const username = await question(questions.username);
      const password = await question(questions.password);
      const cluster = await question(questions.cluster);
      const database = await question(questions.database) || 'symptogenie';

      mongoUri = `mongodb+srv://${username}:${encodeURIComponent(password)}@${cluster}.mongodb.net/${database}?retryWrites=true&w=majority`;

      console.log('\n✅ MongoDB Atlas URI generated!');
    } else if (choice.toLowerCase() === 'local') {
      mongoUri = 'mongodb://localhost:27017/symptogenie';
      console.log('\n⚠️  Make sure MongoDB is running locally on port 27017');
    } else {
      console.log('Invalid choice. Defaulting to local MongoDB.');
      mongoUri = 'mongodb://localhost:27017/symptogenie';
    }

    // Read existing .env
    const envPath = path.join(__dirname, '.env');
    let existingEnv = '';

    if (fs.existsSync(envPath)) {
      existingEnv = fs.readFileSync(envPath, 'utf-8');
    }

    // Replace or add MONGODB_URI
    if (existingEnv.includes('MONGODB_URI=')) {
      envContent = existingEnv.replace(
        /MONGODB_URI=.*/,
        `MONGODB_URI=${mongoUri}`
      );
    } else {
      envContent = `MONGODB_URI=${mongoUri}\n${existingEnv}`;
    }

    // Write to .env
    fs.writeFileSync(envPath, envContent);

    console.log(`
✅ Configuration saved to .env

Next steps:
1. Stop the backend server (Ctrl+C)
2. Start it again: npm start
3. You should see: ✅ MongoDB connected
4. Then test registration in the app

If you still get errors:
- Check your MongoDB credentials
- For Atlas: Whitelist your IP in Network Access
- Check that database user has proper permissions

    `);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    rl.close();
  }
}

main();
