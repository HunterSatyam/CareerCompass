import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { User } from "./models/user.model.js";

dotenv.config();

const seedUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB...");

        const demoUsers = [
            {
                fullname: "Test Recruiter",
                email: "mahitoky07@gmail.com",
                phoneNumber: "1234567890",
                password: "password123",
                role: "recruiter"
            },
            {
                fullname: "Satyam Gupta",
                email: "gupta7satyam@gmail.com",
                phoneNumber: "1234567890",
                password: "123",
                role: "applicant"
            }
        ];

        for (const demoUser of demoUsers) {
            const hashedPassword = await bcrypt.hash(demoUser.password, 10);
            const existingUser = await User.findOne({ email: demoUser.email });

            if (existingUser) {
                console.log(`Updating ${demoUser.role}: ${demoUser.email}`);
                existingUser.fullname = demoUser.fullname;
                existingUser.phoneNumber = demoUser.phoneNumber;
                existingUser.password = hashedPassword;
                existingUser.role = demoUser.role;
                existingUser.isVerified = true;
                await existingUser.save();
            } else {
                console.log(`Creating ${demoUser.role}: ${demoUser.email}`);
                await User.create({
                    fullname: demoUser.fullname,
                    email: demoUser.email,
                    phoneNumber: demoUser.phoneNumber,
                    password: hashedPassword,
                    role: demoUser.role,
                    isVerified: true
                });
            }
        }

        console.log("Demo users ready:");
        demoUsers.forEach((demoUser) => {
            console.log(`- ${demoUser.email} / ${demoUser.password} / ${demoUser.role}`);
        });
        
        process.exit(0);
    } catch (error) {
        console.error("Error seeding user:", error);
        process.exit(1);
    }
};

seedUser();
