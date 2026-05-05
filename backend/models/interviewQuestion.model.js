import mongoose from "mongoose";

const interviewQuestionSchema = new mongoose.Schema({
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'InterviewCompany', required: true },
    title: { type: String, required: true },
    description: { type: String },
    questionType: { type: String, enum: ['Objective', 'Subjective', 'Coding'], required: true },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
    category: { type: String },
    frequency: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
    tips: { type: String },
    
    // For Objective
    options: [{ type: String }],
    correctOption: { type: Number },
    
    // For Subjective
    sampleAnswer: { type: String },
    
    // For Coding
    codeSnippet: { type: String },
    solutionCode: { type: String }
}, { timestamps: true });

export const InterviewQuestion = mongoose.model("InterviewQuestion", interviewQuestionSchema);
