import mongoose from "mongoose";

const interviewCompanySchema = new mongoose.Schema({
    name: { type: String, required: true },
    logo: { type: String },
    questionsCount: { type: Number, default: 0 },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
    rating: { type: Number, default: 4.5 },
    category: { type: String },
    hiringProcess: [{ type: String }],
    eligibilityCriteria: [{ type: String }],
    packageRange: { type: String },
    hiringFrequency: { type: String },
    jobLocations: [{ type: String }],
    interviewRounds: [{ type: String }],
    hiringDetails: { type: String },
    preparationLinks: [{
        title: String,
        type: { type: String, enum: ['Video', 'PDF', 'Article', 'Practice'], default: 'Article' },
        url: String
    }]
}, { timestamps: true });

export const InterviewCompany = mongoose.model("InterviewCompany", interviewCompanySchema);
