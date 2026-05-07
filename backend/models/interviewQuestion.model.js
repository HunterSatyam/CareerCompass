import mongoose from "mongoose";

const interviewQuestionSchema = new mongoose.Schema({
    questionId: { type: String, unique: true, index: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'InterviewCompany', required: true },
    title: { type: String, required: true },
    description: { type: String },
    answer: { type: String },
    questionType: { type: String, enum: ['Objective', 'Subjective', 'Coding', 'HR', 'Aptitude', 'Behavioral'], required: true },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
    category: { type: String },
    role: { type: String },
    tags: [{ type: String }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdByRole: { type: String, enum: ['admin', 'recruiter', 'applicant', 'system'], default: 'system' },
    round: { type: String },
    hiringUpdate: { type: String },
    source: { type: String, enum: ['manual', 'bulk', 'ai', 'seed'], default: 'manual' },
    status: { type: String, enum: ['draft', 'published', 'archived'], default: 'published' },
    explanation: { type: String },
    timeLimit: { type: Number, default: 120 },
    attemptedCount: { type: Number, default: 0 },
    isImportant: { type: Boolean, default: false },
    frequency: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
    tips: { type: String },
    
    // For Objective
    options: [{ type: String }],
    correctOption: { type: Number },
    
    // For Subjective
    sampleAnswer: { type: String },
    
    // For Coding
    codeSnippet: { type: String },
    solutionCode: { type: String },
    testCases: [{
        input: String,
        expectedOutput: String
    }]
}, { timestamps: true });

interviewQuestionSchema.pre('validate', function () {
    if (!this.questionId) this.questionId = this._id.toString();
    if (!this.answer) this.answer = this.sampleAnswer || this.solutionCode || this.explanation || "";
});

export const InterviewQuestion = mongoose.model("InterviewQuestion", interviewQuestionSchema);
