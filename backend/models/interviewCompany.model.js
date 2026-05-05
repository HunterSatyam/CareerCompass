import mongoose from "mongoose";

const interviewCompanySchema = new mongoose.Schema({
    name: { type: String, required: true },
    logo: { type: String },
    questionsCount: { type: Number, default: 0 },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
    rating: { type: Number, default: 4.5 },
    category: { type: String }
}, { timestamps: true });

export const InterviewCompany = mongoose.model("InterviewCompany", interviewCompanySchema);
