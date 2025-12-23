// Run this with: node test-db-connection.js
// This will test if your MongoDB connection is working

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

async function testConnection() {
    console.log('Testing MongoDB connection...');
    console.log('MONGODB_URI exists:', !!MONGODB_URI);
    console.log('MONGODB_URI (first 20 chars):', MONGODB_URI?.substring(0, 20) + '...');

    try {
        await mongoose.connect(MONGODB_URI, {
            dbName: 'evently',
        });
        console.log('✅ Successfully connected to MongoDB!');

        // Test if we can query the database
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Available collections:', collections.map(c => c.name));

        await mongoose.disconnect();
        console.log('✅ Test completed successfully!');
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        process.exit(1);
    }
}

testConnection();
