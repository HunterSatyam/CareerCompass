import jwt from "jsonwebtoken";
import { Admin } from "../models/admin.model.js";
import { User } from "../models/user.model.js";

const isInterviewManagerAuthenticated = async (req, res, next) => {
    try {
        const adminToken = req.cookies.adminToken || req.headers["x-admin-token"];
        if (adminToken) {
            const decodedAdmin = jwt.verify(adminToken, process.env.SECRET_KEY);
            const admin = await Admin.findById(decodedAdmin.adminId).select("_id role isActive");
            if (admin?.isActive) {
                req.admin = admin;
                req.interviewManager = {
                    id: admin._id,
                    role: "admin",
                    source: "admin"
                };
                return next();
            }
        }

        const userToken = req.cookies.token || req.headers.authorization?.split(" ")[1];
        if (!userToken) {
            return res.status(401).json({
                message: "Please login as an admin or recruiter to manage interview questions.",
                success: false
            });
        }

        const decodedUser = jwt.verify(userToken, process.env.SECRET_KEY);
        const user = await User.findById(decodedUser.userId).select("_id role");
        if (user?.role === "recruiter") {
            req.id = user._id;
            req.interviewManager = {
                id: user._id,
                role: "recruiter",
                source: "user"
            };
            return next();
        }

        return res.status(403).json({
            message: "Only admins and recruiters can manage interview questions.",
            success: false
        });
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            message: "Interview manager authentication failed. Please login again.",
            success: false
        });
    }
};

export default isInterviewManagerAuthenticated;
