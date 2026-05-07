import mongoose from 'mongoose';
import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function testUri(uri) {
    console.log(`\nTesting connection...`);
    try {
        await mongoose.connect(uri.trim(), { serverSelectionTimeoutMS: 5000 });
        console.log("✅ SUCCESS: Connected to MongoDB successfully!");
        await mongoose.disconnect();
        return true;
    } catch (err) {
        console.error("❌ FAILED: Connection error.");
        console.error("Error Message:", err.message);
        if (err.message.includes("authentication failed")) {
            console.error("Suggestion: The username or password in your URI is wrong.");
        } else if (err.message.includes("ECONNREFUSED") || err.message.includes("ETIMEDOUT")) {
            console.error("Suggestion: Check your internet connection or IP whitelist in MongoDB Atlas.");
        }
        return false;
    }
}

console.log("=== MongoDB Connection Tester ===");
rl.question("Paste your MONGO_URI here: ", async (uri) => {
    await testUri(uri);
    rl.close();
});
