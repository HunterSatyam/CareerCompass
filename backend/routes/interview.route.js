import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { 
    createInterviewCompany, 
    getAllInterviewCompanies, 
    createInterviewQuestion, 
    getQuestionsByCompany,
    getAllInterviewQuestions
} from "../controllers/interview.controller.js";

const router = express.Router();

router.route("/company/create").post(isAuthenticated, createInterviewCompany);
router.route("/company/get").get(getAllInterviewCompanies);
router.route("/question/create").post(isAuthenticated, createInterviewQuestion);
router.route("/question/get/:companyId").get(getQuestionsByCompany);
router.route("/questions/all").get(getAllInterviewQuestions);

export default router;
