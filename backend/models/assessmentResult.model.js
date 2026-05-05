import mongoose from "mongoose";

const assessmentResultSchema = new mongoose.Schema({
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true },
    applicantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assessmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assessment', required: true },
    answers: { type: Map, of: String, default: {} },
    score: { type: Number, default: 0 },
    maxScore: { type: Number, default: 0 }
}, { timestamps: true });

export const AssessmentResult = mongoose.model("AssessmentResult", assessmentResultSchema);
