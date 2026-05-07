import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
    question: String,
    answerText: String,
    transcript: String,
    timeSpent: Number,
    feedback: {
        confidenceScore: Number,
        communicationScore: Number,
        technicalAccuracy: Number,
        grammarScore: Number,
        suggestions: [{ type: String }]
    }
}, { _id: false });

const interviewSessionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    company: String,
    role: String,
    category: String,
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
    numberOfQuestions: { type: Number, default: 5 },
    questions: [{ type: String }],
    answers: [answerSchema],
    scorecard: {
        finalScore: Number,
        confidenceScore: Number,
        communicationScore: Number,
        technicalAccuracy: Number,
        grammarScore: Number,
        weakTopics: [{ type: String }],
        recommendations: [{ type: String }],
        summary: String
    },
    status: { type: String, enum: ['draft', 'in_progress', 'completed'], default: 'draft' },
    duration: Number
}, { timestamps: true });

export const InterviewSession = mongoose.model("InterviewSession", interviewSessionSchema);
