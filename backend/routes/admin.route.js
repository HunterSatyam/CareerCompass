import express from "express";
import { login, logout, getDashboardStats, getAllUsers, getAllJobs, getAdminProfile, deleteUser, toggleSuspendUser, updateUser, getAllInternships, getAllHackathons, getAllCompetitions, getAllWebinars, getAllCertifications, getAnalyticsData } from "../controllers/admin.controller.js";
import isAdminAuthenticated from "../middlewares/isAdminAuthenticated.js";

const router = express.Router();

router.post("/login", login);
router.get("/logout", isAdminAuthenticated, logout);
router.get("/me", isAdminAuthenticated, getAdminProfile);
router.get("/dashboard/stats", isAdminAuthenticated, getDashboardStats);
router.get("/users", isAdminAuthenticated, getAllUsers);
router.delete("/users/:id", isAdminAuthenticated, deleteUser);
router.put("/users/:id/suspend", isAdminAuthenticated, toggleSuspendUser);
router.put("/users/:id", isAdminAuthenticated, updateUser);
router.get("/jobs", isAdminAuthenticated, getAllJobs);
router.get("/internships", isAdminAuthenticated, getAllInternships);
router.get("/hackathons", isAdminAuthenticated, getAllHackathons);
router.get("/competitions", isAdminAuthenticated, getAllCompetitions);
router.get("/webinars", isAdminAuthenticated, getAllWebinars);
router.get("/certifications", isAdminAuthenticated, getAllCertifications);
router.get("/analytics", isAdminAuthenticated, getAnalyticsData);

export default router;
