import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { Admin } from "./models/admin.model.js";

dotenv.config();

const createSuperAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB.");

        const existingAdmin = await Admin.findOne({ email: "admin@careercompass.com" });
        if (existingAdmin) {
            console.log("Super Admin already exists.");
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash("admin123", 10);
        await Admin.create({
            fullname: "Admin",
            email: "admin@careercompass.com",
            password: hashedPassword,
            role: "Super Admin",
            permissions: ["all"]
        });

        console.log("Super Admin created successfully. (Email: admin@careercompass.com, Password: admin123)");
        process.exit(0);
    } catch (error) {
        console.error("Error creating Super Admin:", error);
        process.exit(1);
    }
};

createSuperAdmin();