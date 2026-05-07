import mongoose from "mongoose";

const interviewRoleSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    summary: { type: String },
    requiredSkills: [{ type: String }],
    roadmap: [{ type: String }],
    commonTools: [{ type: String }],
    commonQuestions: [{ type: String }],
    companySpecificQuestions: [{
        company: String,
        questions: [{ type: String }]
    }],
    codingChallenges: [{
        title: String,
        difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
        prompt: String
    }],
    miniQuizzes: [{
        question: String,
        options: [{ type: String }],
        answer: String
    }]
}, { timestamps: true });

export const InterviewRole = mongoose.model("InterviewRole", interviewRoleSchema);
