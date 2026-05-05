import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { createOrUpdateAssessment, getAssessmentByJobId, getAssessmentByApplicationId, submitAssessment, getAssessmentResults, scheduleInterview } from "../controllers/assessment.controller.js";

const router = express.Router();

router.route("/").post(isAuthenticated, createOrUpdateAssessment);
router.route("/results").get(isAuthenticated, getAssessmentResults);
router.route("/schedule-interview").post(isAuthenticated, scheduleInterview);
router.route("/:jobId").get(isAuthenticated, getAssessmentByJobId);
router.route("/application/:applicationId").get(isAuthenticated, getAssessmentByApplicationId);
router.route("/application/:applicationId/submit").post(isAuthenticated, submitAssessment);

export default router;
