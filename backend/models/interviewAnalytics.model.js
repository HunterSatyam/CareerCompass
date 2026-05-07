import mongoose from "mongoose";

const interviewAnalyticsSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    streak: { type: Number, default: 0 },
    totalPracticeMinutes: { type: Number, default: 0 },
    accuracyPercentage: { type: Number, default: 0 },
    weakTopics: [{ topic: String, score: Number }],
    recommendedPracticeAreas: [{ type: String }],
    badges: [{ type: String }],
    dailyChallenge: {
        question: String,
        category: String,
        difficulty: String
    },
    chartData: {
        weeklyScores: [{ label: String, score: Number }],
        categoryBreakdown: [{ label: String, value: Number }],
        practiceTime: [{ label: String, minutes: Number }]
    },
    savedQuestions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'InterviewQuestion' }],
    recentlyAttempted: [{ title: String, score: Number, attemptedAt: Date }]
}, { timestamps: true });

export const InterviewAnalytics = mongoose.model("InterviewAnalytics", interviewAnalyticsSchema);
