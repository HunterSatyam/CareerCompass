import mongoose from "mongoose";

const interviewResourceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    type: { type: String, enum: ['Video', 'PDF', 'Article', 'Practice'], default: 'Article' },
    url: { type: String, required: true },
    company: String,
    role: String,
    category: String,
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
    tags: [{ type: String }]
}, { timestamps: true });

export const InterviewResource = mongoose.model("InterviewResource", interviewResourceSchema);
