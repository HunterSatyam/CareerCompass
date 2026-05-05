import { Job } from "../models/job.model.js";
import { Company } from "../models/company.model.js";
import { User } from "../models/user.model.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/datauri.js";
import { notifyMatchingApplicants } from "../utils/notificationHelper.js";
import { sendJobNotificationEmail } from "../utils/emailService.js";

// admin post krega job
export const postJob = async (req, res) => {
    try {
        const { title, description, requirements, salary, location, jobType, experience, position, companyId, companyName, date, prize } = req.body;
        const userId = req.id;

        if (!title || !description || !requirements || salary === undefined || !location || !jobType || experience === undefined || !position || (!companyId && !companyName)) {
            return res.status(400).json({
                message: "Something is missing.",
                success: false
            })
        };

        let finalCompanyId = companyId;

        // If companyId is not provided but companyName is, find or create the company
        if (!finalCompanyId && companyName) {
            let company = await Company.findOne({ name: { $regex: new RegExp(`^${companyName}$`, 'i') } });
            if (!company) {
                company = await Company.create({
                    name: companyName,
                    userId: userId,
                    location: location || "Unknown" // Optional: use job location as default company location
                });
            }
            finalCompanyId = company._id;
        }

        // ensure the referenced company exists
        if (finalCompanyId) {
            const companyExists = await Company.findById(finalCompanyId);
            if (!companyExists) {
                return res.status(400).json({
                    message: "Referenced company not found.",
                    success: false
                });
            }
        }

        let logo = "";
        const file = req.file;
        if (file) {
            try {
                const fileUri = getDataUri(file);
                const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
                logo = cloudResponse.secure_url;
            } catch (error) {
                console.error("Cloudinary upload failed (likely due to missing credentials). Proceeding without logo.", error);
                // Continue without logo
            }
        }

        const job = await Job.create({
            title,
            description,
            requirements: requirements.split(","),
            salary: Number(salary),
            location,
            jobType,
            experienceLevel: experience,
            position,
            company: finalCompanyId,
            created_by: userId,
            date,
            prize,
            logo
        });

        await job.populate('company');

        // matches all logic
        try {
            notifyMatchingApplicants(job, jobType || 'Job');

            // Send email notification to all applicants
            const applicants = await User.find({ role: 'applicant' }).select('email');
            const applicantEmails = applicants.map(applicant => applicant.email);

            if (applicantEmails.length > 0) {
                const jobDetails = {
                    title: job.title,
                    company: companyName || "Unknown Company",
                    location: job.location,
                    salary: job.salary,
                    jobType: job.jobType,
                    experience: job.experienceLevel,
                    id: job._id
                };
                sendJobNotificationEmail(applicantEmails, jobDetails);
            }
        } catch (error) {
            console.error("Error triggering notifications:", error);
        }


        return res.status(201).json({
            message: "New job created successfully.",
            job,
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message,
        });
    }
}
// applicant k liye
export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ]
        };
        const jobs = await Job.find(query)
            .populate({ path: 'company' })
            .sort({ createdAt: -1 });

        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message,
        });
    }
}
// applicant
export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        // populate company and applications -> applicant
        const job = await Job.findById(jobId)
            .populate({ path: 'company' })
            .populate({
                path: 'applications',
                populate: { path: 'applicant' },
                options: { sort: { createdAt: -1 } }
            });
        if (!job) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({ job, success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message,
        });
    }
}
// admin kitne job create kiya hai abhi tk
export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const jobs = await Job.find({ created_by: adminId })
            .populate({ path: 'company' })
            .sort({ createdAt: -1 });
        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message,
        });
    }
}

// update job
export const updateJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const { title, description, requirements, salary, location, jobType, experienceLevel, position, prize, date } = req.body;
        const userId = req.id;

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            });
        }

        // Verify owner
        if (job.created_by.toString() !== userId) {
            return res.status(403).json({
                message: "You do not have permission to update this job.",
                success: false
            });
        }

        let logo = job.logo;
        const file = req.file;
        if (file) {
            try {
                const fileUri = getDataUri(file);
                const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
                logo = cloudResponse.secure_url;
            } catch (error) {
                console.error("Cloudinary upload failed (likely due to missing credentials). Proceeding without new logo.", error);
            }
        }

        // Update fields
        if (title) job.title = title;
        if (description) job.description = description;
        if (requirements) {
            job.requirements = typeof requirements === 'string' ? requirements.split(",") : requirements;
        }
        if (salary !== undefined) job.salary = Number(salary);
        if (location) job.location = location;
        if (jobType) job.jobType = jobType;
        if (experienceLevel !== undefined) job.experienceLevel = experienceLevel;
        if (position !== undefined) job.position = position;
        if (prize !== undefined) job.prize = prize;
        if (date !== undefined) job.date = date;
        job.logo = logo;

        await job.save();

        return res.status(200).json({
            message: "Job updated successfully.",
            job,
            success: true
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message,
        });
    }
};

// delete job
export const deleteJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const userId = req.id;

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            });
        }

        // Verify owner
        if (job.created_by.toString() !== userId) {
            return res.status(403).json({
                message: "You do not have permission to delete this job.",
                success: false
            });
        }

        await Job.findByIdAndDelete(jobId);

        return res.status(200).json({
            message: "Job deleted successfully.",
            success: true
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message,
        });
    }
};