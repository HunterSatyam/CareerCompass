import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import isInterviewManagerAuthenticated from "../middlewares/isInterviewManagerAuthenticated.js";
import { 
    createInterviewCompany, 
    getAllInterviewCompanies, 
    createInterviewQuestion, 
    updateInterviewQuestion,
    deleteInterviewQuestion,
    bulkUploadInterviewQuestions,
    getQuestionsByCompany,
    getAllInterviewQuestions,
    getInterviewRoles,
    createInterviewRole,
    startMockInterview,
    evaluateMockInterview,
    getInterviewHistory,
    getInterviewAnalytics,
    getExperiences,
    createExperience,
    getResources,
    createResource,
    runCodeReview,
    generateInterviewQuestions,
    checkInterviewAnswer,
    seedInterviewModule
} from "../controllers/interview.controller.js";

const router = express.Router();

router.route("/company/create").post(isInterviewManagerAuthenticated, createInterviewCompany);
router.route("/company/get").get(getAllInterviewCompanies);
router.route("/question/create").post(isInterviewManagerAuthenticated, createInterviewQuestion);
router.route("/question/:id").put(isInterviewManagerAuthenticated, updateInterviewQuestion).delete(isInterviewManagerAuthenticated, deleteInterviewQuestion);
router.route("/question/get/:companyId").get(getQuestionsByCompany);
router.route("/questions/all").get(getAllInterviewQuestions);
router.route("/questions/bulk-upload").post(isInterviewManagerAuthenticated, bulkUploadInterviewQuestions);
router.route("/question/bulk-upload").post(isInterviewManagerAuthenticated, bulkUploadInterviewQuestions);
router.route("/bulk-upload").post(isInterviewManagerAuthenticated, bulkUploadInterviewQuestions);
router.route("/questions/upload-csv").post(isInterviewManagerAuthenticated, bulkUploadInterviewQuestions);
router.route("/roles").get(getInterviewRoles).post(isInterviewManagerAuthenticated, createInterviewRole);
router.route("/mock/start").post(isAuthenticated, startMockInterview);
router.route("/mock/evaluate").post(isAuthenticated, evaluateMockInterview);
router.route("/history").get(isAuthenticated, getInterviewHistory);
router.route("/analytics").get(isAuthenticated, getInterviewAnalytics);
router.route("/experiences").get(getExperiences).post(isAuthenticated, createExperience);
router.route("/resources").get(getResources).post(isAuthenticated, createResource);
router.route("/code-review").post(isAuthenticated, runCodeReview);
router.route("/ai/generate-questions").post(isInterviewManagerAuthenticated, generateInterviewQuestions);
router.route("/ai/check-answer").post(isAuthenticated, checkInterviewAnswer);
router.route("/seed").post(isAuthenticated, seedInterviewModule);

export default router;
