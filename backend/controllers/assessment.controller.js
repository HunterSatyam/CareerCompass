import { Assessment } from "../models/assessment.model.js";
import { Job } from "../models/job.model.js";
import { sendInterviewEmail } from "../utils/emailService.js";

export const createOrUpdateAssessment = async (req, res) => {
    try {
        const { jobId, questions, duration } = req.body;
        const userId = req.id;

        if (!jobId || !questions || !Array.isArray(questions)) {
            return res.status(400).json({
                message: "jobId and an array of questions are required.",
                success: false
            });
        }

        // Verify the job exists and belongs to the recruiter
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            });
        }
        if (job.created_by.toString() !== userId) {
            return res.status(403).json({
                message: "You are not authorized to create an assessment for this job.",
                success: false
            });
        }

        // Validate questions
        for (let q of questions) {
            if (!q.questionText || !q.questionType) {
                return res.status(400).json({
                    message: "Each question must have questionText and questionType.",
                    success: false
                });
            }
            if (q.questionType === 'objective' && (!q.options || q.options.length < 2)) {
                return res.status(400).json({
                    message: "Objective questions must have at least 2 options.",
                    success: false
                });
            }
        }

        // Find existing assessment
        let assessment = await Assessment.findOne({ jobId });

        if (assessment) {
            // Update
            assessment.questions = questions;
            if (duration) assessment.duration = duration;
            await assessment.save();
            return res.status(200).json({
                message: "Assessment updated successfully.",
                assessment,
                success: true
            });
        } else {
            // Create
            assessment = await Assessment.create({
                jobId,
                created_by: userId,
                duration: duration || 30,
                questions
            });
            return res.status(201).json({
                message: "Assessment created successfully.",
                assessment,
                success: true
            });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error: error.message
        });
    }
};

export const getAssessmentByJobId = async (req, res) => {
    try {
        const { jobId } = req.params;
        const assessment = await Assessment.findOne({ jobId });

        if (!assessment) {
            return res.status(404).json({
                message: "Assessment not found for this job.",
                success: false
            });
        }

        return res.status(200).json({
            assessment,
            success: true
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error: error.message
        });
    }
};

import { Application } from "../models/application.model.js";
import { AssessmentResult } from "../models/assessmentResult.model.js";

export const getAssessmentByApplicationId = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const application = await Application.findById(applicationId);
        
        if (!application) {
            return res.status(404).json({
                message: "Application not found.",
                success: false
            });
        }

        const assessment = await Assessment.findOne({ jobId: application.job });

        if (!assessment) {
            return res.status(404).json({
                message: "Assessment not found for this application.",
                success: false
            });
        }

        // Check if already submitted
        const existingResult = await AssessmentResult.findOne({ applicationId });
        if (existingResult) {
            return res.status(400).json({
                message: "You have already submitted the assessment.",
                success: false
            });
        }

        // Send questions without correctOption so applicant doesn't cheat
        const safeQuestions = assessment.questions.map(q => ({
            questionText: q.questionText,
            questionType: q.questionType,
            options: q.options
        }));

        return res.status(200).json({
            assessment: { ...assessment._doc, questions: safeQuestions },
            success: true
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error: error.message
        });
    }
};

export const submitAssessment = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { answers } = req.body;
        const userId = req.id;
        
        const application = await Application.findById(applicationId);
        if (!application) {
            return res.status(404).json({ message: "Application not found.", success: false });
        }

        const assessment = await Assessment.findOne({ jobId: application.job });
        if (!assessment) {
            return res.status(404).json({ message: "Assessment not found.", success: false });
        }

        const existingResult = await AssessmentResult.findOne({ applicationId });
        if (existingResult) {
            return res.status(400).json({ message: "You have already submitted the assessment.", success: false });
        }

        // Grade assessment
        let score = 0;
        let maxScore = 0;

        assessment.questions.forEach((q, idx) => {
            if (q.questionType === 'objective') {
                maxScore++;
                if (answers[idx] === q.correctOption) {
                    score++;
                }
            } else {
                // subjective questions are not automatically graded
            }
        });

        const result = await AssessmentResult.create({
            jobId: application.job,
            applicationId,
            applicantId: userId,
            assessmentId: assessment._id,
            answers,
            score,
            maxScore
        });
        
        return res.status(200).json({
            message: "Assessment submitted successfully.",
            success: true
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error: error.message
        });
    }
};

export const getAssessmentResults = async (req, res) => {
    try {
        const userId = req.id;

        // Find all jobs created by this recruiter
        const jobs = await Job.find({ created_by: userId }).select('_id');
        const jobIds = jobs.map(j => j._id);

        // Find all assessment results for these jobs
        const results = await AssessmentResult.find({ jobId: { $in: jobIds } })
            .populate({ path: 'applicantId', select: 'fullname email profile.profilePhoto' })
            .populate({ path: 'jobId', select: 'title company' })
            .populate({ path: 'jobId', populate: { path: 'company', select: 'name logo' } })
            .sort({ score: -1, createdAt: -1 });

        return res.status(200).json({
            results,
            success: true
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error: error.message
        });
    }
};

export const scheduleInterview = async (req, res) => {
    try {
        const { applicantEmail, applicantName, jobTitle, interviewDate, interviewTime, meetingLink, notes } = req.body;

        if (!applicantEmail || !applicantName || !jobTitle || !interviewDate || !interviewTime) {
            return res.status(400).json({
                message: "Email, name, job title, date, and time are required.",
                success: false
            });
        }

        await sendInterviewEmail(applicantEmail, applicantName, jobTitle, interviewDate, interviewTime, meetingLink, notes);

        return res.status(200).json({
            message: "Interview invitation sent successfully!",
            success: true
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Failed to schedule interview.",
            success: false,
            error: error.message
        });
    }
};
