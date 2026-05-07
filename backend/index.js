import dotenv from "dotenv";
dotenv.config({});
console.log("[DEBUG] Environment Variables Checked:");
console.log("- MONGO_URI:", process.env.MONGO_URI ? "Present (Length: " + process.env.MONGO_URI.length + ")" : "MISSING");
console.log("- PORT:", process.env.PORT || "3000 (default)");
console.log("- FRONTEND_URL:", process.env.FRONTEND_URL || "NOT SET");

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
import internshipRoute from "./routes/internship.route.js";
import hackathonRoute from "./routes/hackathon.route.js";
import webinarRoute from "./routes/webinar.route.js";
import competitionRoute from "./routes/competition.route.js";
import certificationRoute from "./routes/certification.route.js";
import notificationRoute from "./routes/notification.route.js";
import resumeRoute from "./routes/resume.route.js";
import atsRoute from "./routes/ats.route.js";
import adminRoute from "./routes/admin.route.js";
import messageRoute from "./routes/message.route.js";
import assessmentRoute from "./routes/assessment.route.js";
import interviewRoute from "./routes/interview.route.js";
import isInterviewManagerAuthenticated from "./middlewares/isInterviewManagerAuthenticated.js";
import { bulkUploadInterviewQuestions } from "./controllers/interview.controller.js";
import session from "express-session";
import passport from "passport";
import "./utils/passport.js";



const app = express();

// middleware
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const corsOptions = {
    origin: (origin, callback) => {
        const allowedOrigins = [
            process.env.FRONTEND_URL,
            'http://localhost:5173',
            'http://localhost:5174',
            'http://127.0.0.1:5173',
            'http://127.0.0.1:5174',
        ].filter(Boolean);
        const isLocalDevOrigin = /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin || "");
        // Allow requests with no origin (mobile apps, curl, etc.)
        if (!origin || allowedOrigins.indexOf(origin) !== -1 || isLocalDevOrigin) {
            callback(null, true);
        } else {
            console.warn(`CORS blocked request from origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    exposedHeaders: ['Set-Cookie']
}

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));
app.use((error, req, res, next) => {
    if (error?.type === "entity.too.large") {
        return res.status(413).json({
            message: "Upload chunk is too large. Please retry; the uploader will send smaller chunks.",
            success: false
        });
    }
    if (error instanceof SyntaxError && "body" in error) {
        return res.status(400).json({ message: "Invalid JSON payload", success: false });
    }
    return next(error);
});
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET || "your_secret_key",
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

const PORT = process.env.PORT || 3000;

app.post("/api/v1/interview/bulk-upload-csv", isInterviewManagerAuthenticated, bulkUploadInterviewQuestions);

// api's
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);
app.use("/api/v1/internship", internshipRoute);
app.use("/api/v1/hackathon", hackathonRoute);
app.use("/api/v1/webinar", webinarRoute);
app.use("/api/v1/competition", competitionRoute);
app.use("/api/v1/certification", certificationRoute);
app.use("/api/v1/notification", notificationRoute);
app.use("/api/v1/resume", resumeRoute);
app.use("/api/v1/ats", atsRoute);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/message", messageRoute);
app.use("/api/v1/assessment", assessmentRoute);
app.use("/api/v1/interview", interviewRoute);

// Health check endpoint
app.get("/api/v1/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use((req, res) => {
    return res.status(404).json({
        message: `API route not found: ${req.method} ${req.originalUrl}`,
        success: false
    });
});

app.use((error, req, res, next) => {
    console.error(error);
    if (res.headersSent) return next(error);
    return res.status(error.status || 500).json({
        message: error.message || "Internal server error",
        success: false
    });
});

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server running at port ${PORT}`);
        });
    } catch (error) {
        console.error("CRITICAL: Failed to start server because MongoDB is unavailable.");
        console.error("Error Message:", error.message);
        if (error.message.includes("authentication failed")) {
            console.error("TIP: Your MONGO_URI password or username is likely incorrect. Check your Render Dashboard.");
        }
        process.exit(1);
    }
};

startServer();
