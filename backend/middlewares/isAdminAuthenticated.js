import jwt from 'jsonwebtoken';
import { Admin } from '../models/admin.model.js';

const isAdminAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.adminToken || req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({
                message: "Admin authentication required.",
                success: false
            });
        }
        const decode = await jwt.verify(token, process.env.SECRET_KEY);
        if (!decode) {
            return res.status(401).json({
                message: "Invalid token.",
                success: false
            });
        }
        const admin = await Admin.findById(decode.adminId);
        if (!admin) {
            return res.status(401).json({ message: "Admin not found", success: false })
        }
        req.admin = admin; // To be used in controllers
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            message: "Authentication failed",
            success: false,
            error: error.message
        });
    }
}
export default isAdminAuthenticated;
