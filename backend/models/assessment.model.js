import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    questionText: { type: String, required: true },
    questionType: { type: String, enum: ['objective', 'subjective'], required: true },
    options: [{ type: String }], // Used for objective
    correctOption: { type: String } // Optional, used for objective
});

const assessmentSchema = new mongoose.Schema({
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    duration: { type: Number, default: 30 }, // duration in minutes
    questions: [questionSchema]
}, { timestamps: true });

export const Assessment = mongoose.model("Assessment", assessmentSchema);
