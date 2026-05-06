import dotenv from "dotenv";
dotenv.config({});
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
import session from "express-session";
import passport from "passport";
import "./utils/passport.js";



const app = express();

// middleware
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET || "your_secret_key",
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

const corsOptions = {
    origin: (origin, callback) => {
        const allowedOrigins = [
            process.env.FRONTEND_URL,
            'http://localhost:5173',
            'http://localhost:5174',
            'http://127.0.0.1:5173',
            'http://127.0.0.1:5174',
        ].filter(Boolean);
        // Allow requests with no origin (mobile apps, curl, etc.)
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
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

const PORT = process.env.PORT || 3000;


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

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server running at port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server because MongoDB is unavailable.");
        console.error(error.message);
        process.exit(1);
    }
};

startServer();
