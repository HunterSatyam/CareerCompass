import { Admin } from "../models/admin.model.js";
import { ActivityLog } from "../models/activityLog.model.js";
import { User } from "../models/user.model.js";
import { Job } from "../models/job.model.js";
import { Application } from "../models/application.model.js";
import { Internship } from "../models/internship.model.js";
import { Hackathon } from "../models/hackathon.model.js";
import { Competition } from "../models/competition.model.js";
import { Webinar } from "../models/webinar.model.js";
import { Certification } from "../models/certification.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Internal helper for logging
const logActivity = async (adminId, action, details, ipAddress) => {
    await ActivityLog.create({ adminId, action, details, ipAddress });
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required.", success: false });
        }

        let admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(400).json({ message: "Incorrect email or password.", success: false });
        }

        const isPasswordMatch = await bcrypt.compare(password, admin.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: "Incorrect email or password.", success: false });
        }

        if (!admin.isActive) {
            return res.status(403).json({ message: "Admin account is disabled.", success: false });
        }

        const tokenData = { adminId: admin._id, role: admin.role };
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        admin.lastLogin = new Date();
        await admin.save();

        await logActivity(admin._id, "LOGIN", "Admin logged in", req.ip);

        return res.status(200).cookie("adminToken", token, {
            maxAge: 1 * 24 * 60 * 60 * 1000,
            httpsOnly: true,
            sameSite: 'strict'
        }).json({
            message: `Welcome back admin ${admin.fullname}`,
            admin: {
                _id: admin._id,
                fullname: admin.fullname,
                email: admin.email,
                role: admin.role
            },
            success: true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error.", success: false });
    }
};

export const logout = async (req, res) => {
    try {
        await logActivity(req.admin._id, "LOGOUT", "Admin logged out", req.ip);
        return res.status(200).cookie("adminToken", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error.", success: false });
    }
};

export const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalJobs = await Job.countDocuments();
        const totalApplications = await Application.countDocuments();

        // Real-world would have granular stats over time
        return res.status(200).json({
            stats: {
                totalUsers,
                totalJobs,
                totalApplications
            },
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error.", success: false });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        return res.status(200).json({ users, success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error.", success: false });
    }
};

export const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find().populate("company");
        return res.status(200).json({ jobs, success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error.", success: false });
    }
};

export const getAllInternships = async (req, res) => {
    try {
        const internships = await Internship.find().populate("company");
        return res.status(200).json({ internships, success: true });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error.", success: false });
    }
};

export const getAllHackathons = async (req, res) => {
    try {
        const hackathons = await Hackathon.find().populate("company");
        return res.status(200).json({ hackathons, success: true });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error.", success: false });
    }
};

export const getAllCompetitions = async (req, res) => {
    try {
        const competitions = await Competition.find().populate("company");
        return res.status(200).json({ competitions, success: true });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error.", success: false });
    }
};

export const getAllWebinars = async (req, res) => {
    try {
        const webinars = await Webinar.find();
        return res.status(200).json({ webinars, success: true });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error.", success: false });
    }
};

export const getAllCertifications = async (req, res) => {
    try {
        const certifications = await Certification.find();
        return res.status(200).json({ certifications, success: true });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error.", success: false });
    }
};

export const getAdminProfile = async (req, res) => {
    try {
        const admin = await Admin.findById(req.admin._id).select("-password");
        return res.status(200).json({ admin, success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error.", success: false });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found.", success: false });
        }
        await logActivity(req.admin._id, "DELETE_USER", `Deleted user ${user.email}`, req.ip);
        return res.status(200).json({ message: "User deleted successfully.", success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error.", success: false });
    }
};

export const toggleSuspendUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found.", success: false });
        }
        user.isSuspended = !user.isSuspended;
        await user.save();
        await logActivity(req.admin._id, "TOGGLE_SUSPEND_USER", `${user.isSuspended ? 'Suspended' : 'Unsuspended'} user ${user.email}`, req.ip);
        return res.status(200).json({ message: `User ${user.isSuspended ? 'suspended' : 'unsuspended'} successfully.`, user, success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error.", success: false });
    }
};

export const getAnalyticsData = async (req, res) => {
    try {
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
        const sixtyDaysAgo = new Date(now.getTime() - (60 * 24 * 60 * 60 * 1000));

        // 1. New Registrations & Trend
        const currentMonthUsers = await User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
        const lastMonthUsers = await User.countDocuments({ createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } });
        const userTrend = lastMonthUsers === 0 ? 100 : (((currentMonthUsers - lastMonthUsers) / lastMonthUsers) * 100).toFixed(1);

        // 2. Application Success Rate
        const totalApps = await Application.countDocuments();
        const acceptedApps = await Application.countDocuments({ status: "accepted" });
        const successRate = totalApps === 0 ? 0 : ((acceptedApps / totalApps) * 100).toFixed(1);

        // 3. Application Trends (Breakdown)
        const jobApps = await Application.countDocuments({ applicationType: "Job" });
        const internshipApps = await Application.countDocuments({ applicationType: "Internship" });
        const hackathonApps = await Application.countDocuments({ applicationType: "Hackathon" });

        const totalCategorized = jobApps + internshipApps + hackathonApps || 1;
        const trends = {
            jobs: Math.round((jobApps / totalCategorized) * 100),
            internships: Math.round((internshipApps / totalCategorized) * 100),
            hackathons: Math.round((hackathonApps / totalCategorized) * 100)
        };

        // 4. Simple "ML" Projection (Linear Growth)
        // We calculate user growth over last 4 weeks to predict next week
        const weeklyData = [];
        for (let i = 0; i < 4; i++) {
            const start = new Date(now.getTime() - ((i + 1) * 7 * 24 * 60 * 60 * 1000));
            const end = new Date(now.getTime() - (i * 7 * 24 * 60 * 60 * 1000));
            const count = await User.countDocuments({ createdAt: { $gte: start, $lt: end } });
            weeklyData.push(count);
        }
        // Simple Average Growth
        const avgWeeklyGrowth = weeklyData.reduce((a, b) => a + b, 0) / 4;
        const predictedNextWeek = Math.round(avgWeeklyGrowth * 1.05); // Assume 5% optimization

        return res.status(200).json({
            analytics: {
                newRegistrations: currentMonthUsers,
                userTrend: parseFloat(userTrend),
                successRate: parseFloat(successRate),
                trends,
                revenue: "0.00", // Reset to 0 until Checkout/Payment system is implemented
                predictedNextWeek
            },
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error.", success: false });
    }
};

export const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const { fullname, email, role } = req.body;

        const user = await User.findByIdAndUpdate(userId, { fullname, email, role }, { new: true }).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found.", success: false });
        }
        await logActivity(req.admin._id, "UPDATE_USER", `Updated user ${user.email}`, req.ip);
        return res.status(200).json({ message: "User updated successfully.", user, success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error.", success: false });
    }
};
