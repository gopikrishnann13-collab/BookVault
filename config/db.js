const { MongoClient } = require('mongodb');

let db;

async function connectDB() {
    try {
        const client = await MongoClient.connect(process.env.MONGODB_URI);
        db = client.db('booksDB');
        await db.collection('books').createIndex({title: 1, author: 1}, {unique: true, collation: { locale: "en", strength: 2}});
        console.log("MongoDB connected");
    } catch (err) {
        console.error("MongoDB connection failed: " + err);
        process.exit(1);
    }    
}

function getDB() {
    return db;
}

module.exports = { connectDB, getDB };