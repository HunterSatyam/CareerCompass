import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import fs from "fs";
import path from "path";
import { sendWelcomeEmail, sendResetPasswordEmail, sendVerificationEmail } from "../utils/emailService.js";

export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;

        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };
        const profilePhotoFile = req.files?.profilePhoto?.[0];
        const resumeFile = req.files?.resume?.[0];

        // Check if Cloudinary is configured
        const isCloudinaryConfigured = process.env.CLOUD_NAME !== 'your_cloud_name' && process.env.API_KEY !== 'your_api_key';

        const uploadFile = async (file, type) => {
            if (!file) return null;
            let result = null;
            if (isCloudinaryConfigured) {
                try {
                    const fileUri = getDataUri(file);
                    result = await cloudinary.uploader.upload(fileUri.content);
                } catch (error) {
                    console.log(`Cloudinary ${type} upload failed, falling back to local:`, error);
                }
            }
            if (!result) {
                try {
                    const fileName = `${type}-${Date.now()}-${file.originalname}`;
                    const uploadsDir = path.resolve("public/uploads");
                    if (!fs.existsSync(uploadsDir)) {
                        fs.mkdirSync(uploadsDir, { recursive: true });
                    }
                    const filePath = path.join(uploadsDir, fileName);
                    fs.writeFileSync(filePath, file.buffer);
                    result = { secure_url: `${req.protocol}://${req.get('host')}/uploads/${fileName}` };
                } catch (localError) {
                    console.error(`Local ${type} save failed:`, localError);
                }
            }
            return result;
        };

        const profilePhotoResponse = await uploadFile(profilePhotoFile, "profile");
        const resumeResponse = await uploadFile(resumeFile, "resume");

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: 'User already exist with this email.',
                success: false,
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const verificationCodeExpires = Date.now() + 15 * 60 * 1000; // 15 minutes

        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile: {
                profilePhoto: profilePhotoResponse ? profilePhotoResponse.secure_url : "",
                resume: resumeResponse ? resumeResponse.secure_url : "",
                resumeOriginalName: resumeFile ? resumeFile.originalname : ""
            },
            verificationCode,
            verificationCodeExpires
        });

        // Send verification email
        await sendVerificationEmail(email, verificationCode);

        return res.status(201).json({
            message: "Account created successfully. Please check your email for verification code.",
            success: true
        });

    } catch (error) {
        console.error("Signup Error:", error);
        return res.status(500).json({
            message: `Internal server error: ${error.message}`,
            error: error.message,
            success: false
        });
    }
}
export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        };
        // check role is correct or not
        if (role !== user.role) {
            return res.status(400).json({
                message: "Account doesn't exist with current role.",
                success: false
            })
        };

        // check if email is verified
        if (!user.isVerified) {
            return res.status(401).json({
                message: "Please verify your email before logging in.",
                success: false,
                notVerified: true // Flag for frontend to handle redirect
            })
        };

        const tokenData = {
            userId: user._id
        }
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });


        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).cookie("token", token, { 
            maxAge: 1 * 24 * 60 * 60 * 1000, 
            httpOnly: true, 
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', 
            secure: process.env.NODE_ENV === 'production' 
        }).json({
            message: `Welcome back ${user.fullname}`,
            user,
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

export const verifyEmail = async (req, res) => {
    try {
        const { email, code } = req.body;

        if (!email || !code) {
            return res.status(400).json({
                message: "Email and verification code are required.",
                success: false
            });
        }

        const user = await User.findOne({
            email,
            verificationCode: code,
            verificationCodeExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                message: "Invalid or expired verification code.",
                success: false
            });
        }

        user.isVerified = true;
        user.verificationCode = undefined;
        user.verificationCodeExpires = undefined;
        await user.save();

        // Send welcome email after successful verification
        sendWelcomeEmail(user.fullname, user.email);

        return res.status(200).json({
            message: "Email verified successfully. You can now login.",
            success: true
        });
    } catch (error) {
        console.error("Verification Error:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

export const resendVerificationCode = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: "Email is required.",
                success: false
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found.",
                success: false
            });
        }

        if (user.isVerified) {
            return res.status(400).json({
                message: "Email is already verified.",
                success: false
            });
        }

        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const verificationCodeExpires = Date.now() + 15 * 60 * 1000; // 15 minutes

        user.verificationCode = verificationCode;
        user.verificationCodeExpires = verificationCodeExpires;
        await user.save();

        // Send verification email
        await sendVerificationEmail(email, verificationCode);

        return res.status(200).json({
            message: "Verification code resent successfully.",
            success: true
        });
    } catch (error) {
        console.error("Resend OTP Error:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { 
            maxAge: 0,
            httpOnly: true,
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            secure: process.env.NODE_ENV === 'production'
        }).json({
            message: "Logged out successfully.",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills, education, experience, projects, socialLinks } = req.body;

        const file = req.files?.['file'] ? req.files['file'][0] : null;
        const profilePhoto = req.files?.['profilePhoto'] ? req.files['profilePhoto'][0] : null;

        // Upload Resume if present
        let cloudResponseResume = null;
        if (file) {
            try {
                const fileUri = getDataUri(file);
                cloudResponseResume = await cloudinary.uploader.upload(fileUri.content);
            } catch (error) {
                console.log("Cloudinary upload (resume) failed:", error);
                const fileName = `resume-${Date.now()}-${file.originalname}`;
                const uploadsDir = path.resolve("public/uploads");
                if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
                const filePath = path.join(uploadsDir, fileName);
                try {
                    fs.writeFileSync(filePath, file.buffer);
                    cloudResponseResume = { secure_url: `${req.protocol}://${req.get('host')}/uploads/${fileName}` };
                } catch (err) { console.error("Local save failed", err) }
            }
        }

        // Upload Profile Photo if present
        let cloudResponsePhoto = null;
        if (profilePhoto) {
            try {
                const fileUri = getDataUri(profilePhoto);
                cloudResponsePhoto = await cloudinary.uploader.upload(fileUri.content);
            } catch (error) {
                console.log("Cloudinary upload (photo) failed:", error);
                const fileName = `photo-${Date.now()}-${profilePhoto.originalname}`;
                const uploadsDir = path.resolve("public/uploads");
                if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
                const filePath = path.join(uploadsDir, fileName);
                try {
                    fs.writeFileSync(filePath, profilePhoto.buffer);
                    cloudResponsePhoto = { secure_url: `${req.protocol}://${req.get('host')}/uploads/${fileName}` };
                } catch (err) { console.error("Local save failed", err) }
            }
        }

        let skillsArray;
        if (skills) {
            skillsArray = skills.split(",");
        }
        const userId = req.id;
        let user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({
                message: "User not found.",
                success: false
            })
        }

        // Updating basic data
        if (fullname) user.fullname = fullname;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (bio) user.profile.bio = bio;
        if (skills) user.profile.skills = skillsArray;

        // Updating detailed profile sections
        if (education) {
            user.profile.education = typeof education === 'string' ? JSON.parse(education) : education;
        }
        if (experience) {
            user.profile.experience = typeof experience === 'string' ? JSON.parse(experience) : experience;
        }
        if (projects) {
            user.profile.projects = typeof projects === 'string' ? JSON.parse(projects) : projects;
        }
        if (socialLinks) {
            user.profile.socialLinks = typeof socialLinks === 'string' ? JSON.parse(socialLinks) : socialLinks;
        }

        // Update resume info
        if (cloudResponseResume) {
            user.profile.resume = cloudResponseResume.secure_url;
            if (file && file.originalname) user.profile.resumeOriginalName = file.originalname;
        }

        // Update profile photo info
        if (cloudResponsePhoto) {
            user.profile.profilePhoto = cloudResponsePhoto.secure_url;
        }

        await user.save();

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).json({
            message: "Profile updated successfully.",
            user,
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

export const socialLogin = async (req, res) => {
    try {
        const user = req.user;
        const tokenData = {
            userId: user._id
        }
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        return res.status(200)
            .cookie("token", token, { 
                maxAge: 1 * 24 * 60 * 60 * 1000, 
                httpOnly: true, 
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', 
                secure: process.env.NODE_ENV === 'production' 
            })
            .redirect(process.env.FRONTEND_URL || "http://localhost:5173/");

    } catch (error) {
        console.log(error);
        return res.redirect(`${process.env.FRONTEND_URL || "http://localhost:5173"}/login`);
    }
}

export const getMyProfile = async (req, res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({
                message: "User not found.",
                success: false
            })
        };
        return res.status(200).json({
            user,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        })
    }
}

// Toggle save event
export const toggleSavedEvent = async (req, res) => {
    try {
        const userId = req.id;
        const { eventType, eventId } = req.body;

        if (!eventType || !eventId) {
            return res.status(400).json({
                message: "Event type and ID are required.",
                success: false
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found.",
                success: false
            });
        }

        // Check if event is already saved
        const isSavedIndex = user.savedEvents.findIndex(
            item => item.eventId.toString() === eventId && item.eventType === eventType
        );

        if (isSavedIndex > -1) {
            // Unsave
            user.savedEvents.splice(isSavedIndex, 1);
            await user.save();
            return res.status(200).json({
                message: "Event removed from saved list.",
                success: true,
                isSaved: false
            });
        } else {
            // Save
            user.savedEvents.push({ eventType, eventId });
            await user.save();
            return res.status(200).json({
                message: "Event saved successfully.",
                success: true,
                isSaved: true
            });
        }
    } catch (error) {
        console.error("Toggle Saved Event Error:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

// Get saved events
export const getSavedEvents = async (req, res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId).populate({
            path: 'savedEvents.eventId',
            select: 'title company location salary stipend prize date logo description jobType createdAt position experienceLevel duration experience',
            populate: { path: 'company' }
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found.",
                success: false
            });
        }

        return res.status(200).json({
            savedEvents: user.savedEvents,
            success: true
        });
    } catch (error) {
        console.error("Get Saved Events Error:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

// Forgot Password - sends reset link via email
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: "Please provide your email address.",
                success: false
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "No account found with this email.",
                success: false
            });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString("hex");
        user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
        await user.save();

        // Send reset email
        const frontendUrl = process.env.FRONTEND_URL || req.get('origin') || 'http://localhost:5173';
        const resetLink = `${frontendUrl}/reset-password/${resetToken}`;
        await sendResetPasswordEmail(user.fullname, user.email, resetLink);

        return res.status(200).json({
            message: "Password reset link sent to your email.",
            success: true
        });
    } catch (error) {
        console.error("Forgot Password Error:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

// Reset Password - validates token and updates password
export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({
                message: "Please provide a new password.",
                success: false
            });
        }

        // Hash the token from the URL to compare with stored hash
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({
                message: "Invalid or expired reset token. Please request a new one.",
                success: false
            });
        }

        // Update password
        user.password = await bcrypt.hash(password, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        return res.status(200).json({
            message: "Password reset successfully. You can now login.",
            success: true
        });
    } catch (error) {
        console.error("Reset Password Error:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};