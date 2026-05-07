import mongoose from "mongoose";

const interviewExperienceSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'InterviewCompany' },
    companyName: String,
    role: String,
    title: { type: String, required: true },
    content: { type: String, required: true },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'approved' },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    comments: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        message: String,
        createdAt: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

export const InterviewExperience = mongoose.model("InterviewExperience", interviewExperienceSchema);
