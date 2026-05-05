import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        default: ""
    },
    password: {
        type: String,
    },
    googleId: {
        type: String
    },
    linkedinId: {
        type: String
    },
    githubId: {
        type: String
    },
    role: {
        type: String,
        enum: ['applicant', 'recruiter'],
        required: true
    },
    profile: {
        bio: { type: String },
        skills: [{ type: String }],
        resume: { type: String }, // URL to resume file
        resumeOriginalName: { type: String },
        company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
        profilePhoto: {
            type: String,
            default: ""
        },
        education: [{
            college: { type: String },
            degree: { type: String },
            branch: { type: String },
            year: { type: String },
            cgpa: { type: String }
        }],
        experience: [{
            company: { type: String },
            role: { type: String },
            duration: { type: String },
            description: { type: String }
        }],
        projects: [{
            title: { type: String },
            description: { type: String },
            link: { type: String }
        }],
        socialLinks: {
            linkedin: { type: String },
            github: { type: String },
            portfolio: { type: String }
        }
    },
    savedEvents: [{
        eventType: {
            type: String,
            enum: ['Job', 'Internship', 'Hackathon', 'Competition', 'Webinar', 'Certification'],
            required: true
        },
        eventId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: 'savedEvents.eventType'
        }
    }],
    resetPasswordToken: {
        type: String,
    },
    resetPasswordExpires: {
        type: Date,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isSuspended: {
        type: Boolean,
        default: false
    },
    verificationCode: {
        type: String,
    },
    verificationCodeExpires: {
        type: Date,
    },
}, { timestamps: true });
export const User = mongoose.model('User', userSchema);