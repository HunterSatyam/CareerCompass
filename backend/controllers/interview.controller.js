import { InterviewCompany } from "../models/interviewCompany.model.js";
import { InterviewQuestion } from "../models/interviewQuestion.model.js";

// Create Company
export const createInterviewCompany = async (req, res) => {
    try {
        const { name, logo, category, difficulty, rating } = req.body;
        if (!name) return res.status(400).json({ message: "Company name is required", success: false });

        const company = await InterviewCompany.create({ name, logo, category, difficulty, rating });
        return res.status(201).json({ message: "Company created successfully", company, success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

// Get All Companies
export const getAllInterviewCompanies = async (req, res) => {
    try {
        const companies = await InterviewCompany.find();
        return res.status(200).json({ companies, success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

// Create Question
export const createInterviewQuestion = async (req, res) => {
    try {
        const { companyId, title, description, questionType, difficulty, category, options, correctOption, sampleAnswer, codeSnippet, solutionCode, tips, frequency } = req.body;
        
        if (!companyId || !title || !questionType) {
            return res.status(400).json({ message: "Missing required fields", success: false });
        }

        const question = await InterviewQuestion.create({
            company: companyId,
            title,
            description,
            questionType,
            difficulty,
            category,
            options,
            correctOption,
            sampleAnswer,
            codeSnippet,
            solutionCode,
            tips,
            frequency
        });

        // Increment questionsCount in company
        await InterviewCompany.findByIdAndUpdate(companyId, { $inc: { questionsCount: 1 } });

        return res.status(201).json({ message: "Question added successfully", question, success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

// Get Questions by Company
export const getQuestionsByCompany = async (req, res) => {
    try {
        const { companyId } = req.params;
        const questions = await InterviewQuestion.find({ company: companyId });
        return res.status(200).json({ questions, success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

// Get All Questions (Global Hub)
export const getAllInterviewQuestions = async (req, res) => {
    try {
        const { type } = req.query;
        const query = type ? { questionType: type } : {};
        const questions = await InterviewQuestion.find(query).populate('company');
        return res.status(200).json({ questions, success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};
