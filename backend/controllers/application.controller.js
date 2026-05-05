import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { Internship } from "../models/internship.model.js";
import { Hackathon } from "../models/hackathon.model.js";
import { Webinar } from "../models/webinar.model.js";
import { Competition } from "../models/competition.model.js";
import { Certification } from "../models/certification.model.js";
import { Notification } from "../models/notification.model.js";
import { AssessmentResult } from "../models/assessmentResult.model.js";
import { User } from "../models/user.model.js";
import { sendAssessmentEmail } from "../utils/emailService.js";

export const applyJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id; // This is the entity ID (Job, Internship, etc.)
        const type = req.query.type || 'job'; // Default to 'job' if not provided

        if (!jobId) {
            return res.status(400).json({
                message: "ID is required.",
                success: false
            })
        };

        // Check if user profile is complete
        const user = await User.findById(userId);
        if (!user.phoneNumber || !user.profile?.bio || !user.profile?.skills?.length || !user.profile?.resume) {
            return res.status(400).json({
                message: "Please complete your profile first. Phone number, bio, skills, and resume are required to apply.",
                success: false
            });
        }

        // Determine the model based on type
        let Model;
        let modelName;

        switch (type.toLowerCase()) {
            case 'job':
                Model = Job;
                modelName = 'Job';
                break;
            case 'internship':
                Model = Internship;
                modelName = 'Internship';
                break;
            case 'hackathon':
                Model = Hackathon;
                modelName = 'Hackathon';
                break;
            case 'webinar':
                Model = Webinar;
                modelName = 'Webinar';
                break;
            case 'competition':
                Model = Competition;
                modelName = 'Competition';
                break;
            case 'certification':
                Model = Certification;
                modelName = 'Certification';
                break;
            default:
                return res.status(400).json({
                    message: "Invalid application type.",
                    success: false
                });
        }

        // check if the user has already applied for the entity
        const existingApplication = await Application.findOne({ job: jobId, applicant: userId });

        if (existingApplication) {
            return res.status(400).json({
                message: `You have already applied for this ${modelName.toLowerCase()}`,
                success: false
            });
        }

        // check if the entity exists
        const entity = await Model.findById(jobId);
        if (!entity) {
            return res.status(404).json({
                message: `${modelName} not found`,
                success: false
            })
        }

        // Create a new application
        const newApplication = await Application.create({
            job: jobId,
            applicant: userId,
            applicationType: modelName,
            status: 'pending'
        });

        // Add application to the entity's specific array
        if (modelName === 'Webinar') {
            entity.registrations.push(newApplication._id);
        } else if (modelName === 'Competition') {
            entity.participants.push(newApplication._id);
        } else if (modelName === 'Certification') {
            entity.enrollments.push(newApplication._id);
        } else {
            // Job, Internship, Hackathon use 'applications'
            if (entity.applications) {
                entity.applications.push(newApplication._id);
            }
        }
        await entity.save();

        return res.status(201).json({
            message: "Applied successfully.",
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        })
    }
};
export const getAppliedJobs = async (req, res) => {
    try {
        const userId = req.id;
        const application = await Application.find({ applicant: userId }).sort({ createdAt: -1 }).populate({
            path: 'job',
            options: { sort: { createdAt: -1 } },
            populate: {
                path: 'company',
                options: { sort: { createdAt: -1 } },
            }
        });
        if (!application) {
            return res.status(404).json({
                message: "No Applications",
                success: false
            })
        };
        return res.status(200).json({
            application,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
// admin dekhega kitna user ne apply kiya hai
export const getApplicants = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path: 'applications',
            options: { sort: { createdAt: -1 } },
            populate: {
                path: 'applicant'
            }
        });
        if (!job) {
            return res.status(404).json({
                message: 'Job not found.',
                success: false
            })
        };
        return res.status(200).json({
            job,
            succees: true
        });
    } catch (error) {
        console.log(error);
    }
}
export const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const applicationId = req.params.id;
        if (!status) {
            return res.status(400).json({
                message: 'status is required',
                success: false
            })
        };

        // find the application by applicantion id
        const application = await Application.findOne({ _id: applicationId })
            .populate('applicant', 'fullname email')
            .populate('job', 'title');

        if (!application) {
            return res.status(404).json({
                message: "Application not found.",
                success: false
            })
        };

        // update the status
        application.status = status.toLowerCase();
        await application.save();

        if (status.toLowerCase() === 'accepted') {
            const assessmentLink = `http://localhost:5173/assessment/${applicationId}`;
            
            await sendAssessmentEmail(
                application.applicant.email,
                application.applicant.fullname,
                application.job.title,
                assessmentLink
            );

            await Notification.create({
                userId: application.applicant._id,
                title: `Assessment Required! 📝`,
                message: `Your application for ${application.job.title} has been accepted. Click here to take your assessment test.`,
                type: application.applicationType || 'Job',
                eventId: application.job._id,
                actionUrl: `/assessment/${applicationId}`
            });
        }

        return res.status(200).json({
            message: "Status updated successfully.",
            success: true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        })
    }
}

// Get all applications for recruiter's jobs
export const getRecruiterApplications = async (req, res) => {
    try {
        const recruiterId = req.id;

        // Find all jobs posted by this recruiter
        const jobs = await Job.find({ created_by: recruiterId })
            .populate({
                path: 'applications',
                options: { sort: { createdAt: -1 } },
                populate: {
                    path: 'applicant',
                    select: 'fullname email phoneNumber profile'
                }
            })
            .sort({ createdAt: -1 });

        if (!jobs || jobs.length === 0) {
            return res.status(404).json({
                message: 'No jobs found',
                success: false
            });
        }

        // Flatten all applications from all jobs
        const allApplications = jobs.reduce((acc, job) => {
            const jobApplications = job.applications.map(app => ({
                ...app.toObject(),
                jobTitle: job.title,
                jobType: job.jobType,
                jobId: job._id
            }));
            return [...acc, ...jobApplications];
        }, []);

        return res.status(200).json({
            applications: allApplications,
            success: true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Server error',
            success: false
        });
    }
}

// Withdraw application
export const withdrawApplication = async (req, res) => {
    try {
        const applicationId = req.params.id;
        const userId = req.id;

        const application = await Application.findById(applicationId);
        
        if (!application) {
            return res.status(404).json({
                message: "Application not found.",
                success: false
            });
        }

        if (application.applicant.toString() !== userId) {
            return res.status(403).json({
                message: "You can only withdraw your own applications.",
                success: false
            });
        }

        const modelName = application.applicationType || 'Job';
        let Model;

        switch (modelName.toLowerCase()) {
            case 'job': Model = Job; break;
            case 'internship': Model = Internship; break;
            case 'hackathon': Model = Hackathon; break;
            case 'webinar': Model = Webinar; break;
            case 'competition': Model = Competition; break;
            case 'certification': Model = Certification; break;
            default: Model = Job;
        }

        const entity = await Model.findById(application.job);

        if (entity) {
            if (modelName === 'Webinar') {
                entity.registrations = entity.registrations.filter(id => id.toString() !== applicationId);
            } else if (modelName === 'Competition') {
                entity.participants = entity.participants.filter(id => id.toString() !== applicationId);
            } else if (modelName === 'Certification') {
                entity.enrollments = entity.enrollments.filter(id => id.toString() !== applicationId);
            } else {
                if (entity.applications) {
                    entity.applications = entity.applications.filter(id => id.toString() !== applicationId);
                }
            }
            await entity.save();
        }

        await Application.findByIdAndDelete(applicationId);
        
        // Also delete any associated assessment result
        await AssessmentResult.deleteMany({ applicationId: applicationId });

        return res.status(200).json({
            message: "Application withdrawn successfully.",
            success: true
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false,
            error: error.message
        });
    }
};