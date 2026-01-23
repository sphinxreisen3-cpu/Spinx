/**
 * Test MongoDB Atlas Connection
 * Run with: npm run db:test
 */

// Load environment variables from .env.local
import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env.local file
config({ path: resolve(process.cwd(), '.env.local') });

import { connectDB } from '../lib/db/mongoose';
import mongoose from 'mongoose';

async function testConnection() {
  console.log('🔄 Testing MongoDB Atlas connection...\n');

  // Debug: Show connection string (masked)
  const uri = process.env.MONGODB_URI || 'not set';
  const maskedUri = uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');
  console.log(`🔗 Connection URI: ${maskedUri}\n`);

  try {
    // Attempt to connect
    const conn = await connectDB();

    console.log('✅ Successfully connected to MongoDB Atlas!');
    console.log(`📦 Database: ${conn.connection.db?.databaseName ?? conn.connection.name}`);
    console.log(`🌐 Host: ${conn.connection.host}`);
    console.log(
      `📊 Ready state: ${conn.connection.readyState === 1 ? 'Connected' : 'Not connected'}`
    );

    // List existing collections (will be empty for new database)
    const db = conn.connection.db;
    const collections = db ? await db.listCollections().toArray() : [];
    console.log(`\n📁 Collections in database (${collections.length}):`);

    if (collections.length === 0) {
      console.log('   → No collections yet (this is normal for a new database)');
      console.log('   → Collections will be created automatically when you insert data');
    } else {
      collections.forEach((col) => {
        console.log(`   → ${col.name}`);
      });
    }

    console.log('\n✨ Database is ready for backend implementation!');
    console.log('\n📋 Next steps:');
    console.log('   1. Implement API route handlers in app/api/');
    console.log('   2. Test with: npm run dev');
    console.log('   3. First API call will create collections automatically\n');
  } catch (error) {
    console.error('❌ Connection failed!');
    console.error('Error:', error instanceof Error ? error.message : error);

    if (error instanceof Error && error.message.includes('authentication')) {
      console.log('\n💡 Tip: Check your MongoDB Atlas credentials');
      console.log('   - Username: mohamed');
      console.log('   - Password: Check if correct in .env.local');
      console.log('   - Ensure user has read/write permissions');
    }

    if (error instanceof Error && error.message.includes('network')) {
      console.log('\n💡 Tip: Check network/firewall settings');
      console.log('   - MongoDB Atlas IP whitelist (allow 0.0.0.0/0 for testing)');
      console.log('   - Check if your internet connection is working');
    }

    process.exit(1);
  } finally {
    // Close connection
    await mongoose.disconnect();
    console.log('🔌 Connection closed.');
  }
}

// Run test
testConnection();
