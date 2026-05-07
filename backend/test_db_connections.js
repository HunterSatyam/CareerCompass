import mongoose from 'mongoose';

const uris = [
    "mongodb+srv://satyamkochas_db_user:Satyam%403201@cluster0.gczxzbn.mongodb.net/?appName=Cluster0",
    "mongodb+srv://satyamkochas_db_user:FIpGgs9CwGkxeBT0@cluster0.gczxzbn.mongodb.net/event_aggregator?retryWrites=true&w=majority&appName=Cluster0"
];

async function testConnections() {
    for (const uri of uris) {
        console.log(`Testing URI: ${uri.replace(/:[^@]+@/, ':****@')}`);
        try {
            await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
            console.log("✅ SUCCESS");
            await mongoose.disconnect();
        } catch (err) {
            console.error("❌ FAILED:", err.message);
        }
        console.log("-------------------");
    }
}

testConnections();
