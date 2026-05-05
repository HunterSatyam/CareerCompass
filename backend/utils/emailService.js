import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
    },
});





export const sendWelcomeEmail = async (fullname, email) => {
    try {
        const mailOptions = {
            from: `"CareerCompass" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "🎉 Welcome to CareerCompass!",
            html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
                <div style="background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
                    <div style="display: inline-block; background: white; width: 50px; height: 50px; border-radius: 12px; line-height: 50px; font-size: 28px; font-weight: 900; color: #7c3aed; margin-bottom: 16px;">C</div>
                    <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 800;">Welcome to CareerCompass!</h1>
                </div>
                <div style="padding: 40px 30px;">
                    <h2 style="color: #1f2937; font-size: 22px; margin-top: 0;">Hey ${fullname} 👋</h2>
                    <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
                        We're thrilled to have you on board! Your account has been successfully created and you're all set to explore amazing career opportunities.
                    </p>
                    <div style="background: #f3f4f6; border-radius: 12px; padding: 24px; margin: 24px 0;">
                        <h3 style="color: #1f2937; margin-top: 0; font-size: 16px;">🚀 Here's what you can do:</h3>
                        <ul style="color: #4b5563; font-size: 14px; line-height: 2; padding-left: 16px;">
                            <li>Browse and apply for <strong>Jobs & Internships</strong></li>
                            <li>Join <strong>Hackathons & Competitions</strong></li>
                            <li>Attend <strong>Webinars & Certifications</strong></li>
                            <li>Build your <strong>Resume</strong> with our builder</li>
                            <li>Scan your resume with <strong>ATS Scanner</strong></li>
                        </ul>
                    </div>
                    <div style="text-align: center; margin: 32px 0;">
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/" style="display: inline-block; background: linear-gradient(135deg, #7c3aed, #3b82f6); color: white; text-decoration: none; padding: 14px 40px; border-radius: 12px; font-weight: 700; font-size: 16px;">
                            Explore CareerCompass
                        </a>
                    </div>
                    <p style="color: #9ca3af; font-size: 13px; text-align: center; margin-top: 32px; border-top: 1px solid #f3f4f6; padding-top: 20px;">
                        © 2026 CareerCompass Inc. All rights reserved.
                    </p>
                </div>
            </div>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Welcome email sent to ${email}`);
    } catch (error) {
        console.error("Failed to send welcome email:", error.message);
    }
};

export const sendResetPasswordEmail = async (fullname, email, resetLink) => {
    try {
        const mailOptions = {
            from: `"CareerCompass" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "🔒 Reset Your Password - CareerCompass",
            html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
                <div style="background: linear-gradient(135deg, #7c3aed 0%, #ef4444 100%); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
                    <div style="display: inline-block; background: white; width: 50px; height: 50px; border-radius: 12px; line-height: 50px; font-size: 28px; font-weight: 900; color: #7c3aed; margin-bottom: 16px;">C</div>
                    <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 800;">Password Reset</h1>
                </div>
                <div style="padding: 40px 30px;">
                    <h2 style="color: #1f2937; font-size: 22px; margin-top: 0;">Hey ${fullname} 👋</h2>
                    <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
                        We received a request to reset your password. Click the button below to set a new password. This link will expire in <strong>15 minutes</strong>.
                    </p>
                    <div style="text-align: center; margin: 32px 0;">
                        <a href="${resetLink}" style="display: inline-block; background: linear-gradient(135deg, #7c3aed, #ef4444); color: white; text-decoration: none; padding: 14px 40px; border-radius: 12px; font-weight: 700; font-size: 16px;">
                            Reset Password
                        </a>
                    </div>
                    <div style="background: #fef3c7; border: 1px solid #fcd34d; border-radius: 12px; padding: 16px; margin: 24px 0;">
                        <p style="color: #92400e; font-size: 13px; margin: 0;">
                            ⚠️ If you didn't request this, you can safely ignore this email. Your password won't change.
                        </p>
                    </div>
                    <p style="color: #9ca3af; font-size: 12px; margin-top: 16px;">
                        If the button doesn't work, copy and paste this link into your browser:<br/>
                        <a href="${resetLink}" style="color: #7c3aed; word-break: break-all;">${resetLink}</a>
                    </p>
                    <p style="color: #9ca3af; font-size: 13px; text-align: center; margin-top: 32px; border-top: 1px solid #f3f4f6; padding-top: 20px;">
                        © 2026 CareerCompass Inc. All rights reserved.
                    </p>
                </div>
            </div>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Reset password email sent to ${email}`);
    } catch (error) {
        console.error("Failed to send reset password email:", error.message);
    }
};

export const sendVerificationEmail = async (email, verificationCode) => {
    try {
        const mailOptions = {
            from: `"CareerCompass" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Verify your email - CareerCompass",
            html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
                <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
                    <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 800;">Verify Your Email</h1>
                </div>
                <div style="padding: 40px 30px; text-align: center;">
                    <p style="color: #4b5563; font-size: 16px;">Use the code below to verify your email address. This code expires in 15 minutes.</p>
                    <div style="background: #f3f4f6; padding: 20px; border-radius: 12px; margin: 20px 0; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1f2937;">
                        ${verificationCode}
                    </div>
                    <p style="color: #9ca3af; font-size: 13px;">If you didn't create an account, you can safely ignore this email.</p>
                </div>
            </div>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Verification email sent to ${email}`);
    } catch (error) {
        console.error("Failed to send verification email:", error.message);
        console.log(`\n-----------------------------------------`);
        console.log(`📧 LOCAL FALLBACK - VERIFICATION CODE: ${verificationCode}`);
        console.log(`For user: ${email}`);
        console.log(`-----------------------------------------\n`);
    }
};



export const sendJobNotificationEmail = async (emails, jobDetails) => {
    try {
        const mailOptions = {
            from: `"CareerCompass Job Alerts" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER, // Send to self to avoid exposing all emails in TO field
            bcc: emails, // Use BCC for mass email
            subject: `🆕 New Job Alert: ${jobDetails.title} at ${jobDetails.company}`,
            html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
                <div style="background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
                    <h1 style="color: white; margin: 0; font-size: 24px;">New Opportunity Alert! 🚀</h1>
                </div>
                <div style="padding: 30px;">
                    <h2 style="color: #1f2937; margin: 0;">${jobDetails.title}</h2>
                    <p style="color: #6b7280; font-size: 16px; margin-top: 5px;">${jobDetails.company} • ${jobDetails.location}</p>
                    
                    <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 5px 0;"><strong>💰 Salary:</strong> ${jobDetails.salary} LPA</p>
                        <p style="margin: 5px 0;"><strong>📅 Type:</strong> ${jobDetails.jobType}</p>
                        <p style="margin: 5px 0;"><strong>🎓 Experience:</strong> ${jobDetails.experience} Years</p>
                    </div>

                    <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/description/job/${jobDetails.id}" style="display: block; width: 100%; background: #4f46e5; color: white; text-align: center; padding: 12px 0; border-radius: 8px; text-decoration: none; font-weight: bold;">View Job & Apply</a>
                </div>
            </div>
            `,
        };
        await transporter.sendMail(mailOptions);
        console.log(`Job notification sent to ${emails.length} applicants`);
    } catch (error) {
        console.error("Failed to send job notification email:", error.message);
    }
};

export const sendAssessmentEmail = async (email, applicantName, jobTitle, assessmentLink) => {
    try {
        const mailOptions = {
            from: `"CareerCompass" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: `🎯 Assessment Test Invitation: ${jobTitle}`,
            html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
                <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
                    <h1 style="color: white; margin: 0; font-size: 24px;">Assessment Test Invitation 📝</h1>
                </div>
                <div style="padding: 30px;">
                    <h2 style="color: #1f2937; margin: 0;">Hi ${applicantName},</h2>
                    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-top: 15px;">
                        Congratulations! Your application for the <strong>${jobTitle}</strong> position has been accepted by the recruiter.
                    </p>
                    <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
                        The next step in the hiring process is an assessment test. Please click the button below to start your test.
                    </p>
                    
                    <div style="text-align: center; margin: 32px 0;">
                        <a href="${assessmentLink}" style="display: inline-block; background: #10b981; color: white; text-decoration: none; padding: 14px 40px; border-radius: 12px; font-weight: 700; font-size: 16px;">
                            Start Assessment Test
                        </a>
                    </div>
                    
                    <p style="color: #9ca3af; font-size: 12px; margin-top: 16px;">
                        If the button doesn't work, copy and paste this link into your browser:<br/>
                        <a href="${assessmentLink}" style="color: #10b981; word-break: break-all;">${assessmentLink}</a>
                    </p>
                    <p style="color: #9ca3af; font-size: 13px; text-align: center; margin-top: 32px; border-top: 1px solid #f3f4f6; padding-top: 20px;">
                        © 2026 CareerCompass Inc. All rights reserved.
                    </p>
                </div>
            </div>
            `,
        };
        await transporter.sendMail(mailOptions);
        console.log(`Assessment email sent to ${email}`);
    } catch (error) {
        console.error("Failed to send assessment email:", error.message);
    }
};

export const sendInterviewEmail = async (email, applicantName, jobTitle, interviewDate, interviewTime, meetingLink, notes) => {
    try {
        const mailOptions = {
            from: `"CareerCompass" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: `🎤 Interview Invitation: ${jobTitle}`,
            html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
                <div style="background: linear-gradient(135deg, #7c3aed 0%, #6366f1 100%); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
                    <div style="display: inline-block; background: white; width: 50px; height: 50px; border-radius: 12px; line-height: 50px; font-size: 28px; font-weight: 900; color: #7c3aed; margin-bottom: 16px;">C</div>
                    <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 800;">Interview Invitation 🎤</h1>
                </div>
                <div style="padding: 40px 30px;">
                    <h2 style="color: #1f2937; font-size: 22px; margin-top: 0;">Hi ${applicantName} 👋</h2>
                    <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
                        Great news! Based on your assessment performance for the <strong>${jobTitle}</strong> position, you've been shortlisted for a <strong>face-to-face interview</strong>.
                    </p>
                    <div style="background: #f3f4f6; border-radius: 12px; padding: 24px; margin: 24px 0;">
                        <h3 style="color: #1f2937; margin-top: 0; font-size: 16px;">📋 Interview Details</h3>
                        <p style="color: #4b5563; font-size: 14px; line-height: 2; margin: 0;">📅 <strong>Date:</strong> ${interviewDate}</p>
                        <p style="color: #4b5563; font-size: 14px; line-height: 2; margin: 0;">🕐 <strong>Time:</strong> ${interviewTime}</p>
                        ${meetingLink ? `<p style="color: #4b5563; font-size: 14px; line-height: 2; margin: 0;">🔗 <strong>Meeting Link:</strong> <a href="${meetingLink}" style="color: #7c3aed;">${meetingLink}</a></p>` : ''}
                        ${notes ? `<p style="color: #4b5563; font-size: 14px; line-height: 2; margin: 0;">📝 <strong>Notes:</strong> ${notes}</p>` : ''}
                    </div>
                    ${meetingLink ? `
                    <div style="text-align: center; margin: 32px 0;">
                        <a href="${meetingLink}" style="display: inline-block; background: linear-gradient(135deg, #7c3aed, #6366f1); color: white; text-decoration: none; padding: 14px 40px; border-radius: 12px; font-weight: 700; font-size: 16px;">
                            Join Interview
                        </a>
                    </div>
                    ` : ''}
                    <div style="background: #eef2ff; border: 1px solid #c7d2fe; border-radius: 12px; padding: 16px; margin: 24px 0;">
                        <p style="color: #4338ca; font-size: 13px; margin: 0;">
                            💡 <strong>Tips:</strong> Please be ready 5 minutes before the scheduled time. Ensure your camera and microphone are working properly. Dress professionally and have a copy of your resume handy.
                        </p>
                    </div>
                    <p style="color: #9ca3af; font-size: 13px; text-align: center; margin-top: 32px; border-top: 1px solid #f3f4f6; padding-top: 20px;">
                        © 2026 CareerCompass Inc. All rights reserved.
                    </p>
                </div>
            </div>
            `,
        };
        await transporter.sendMail(mailOptions);
        console.log(`Interview email sent to ${email}`);
    } catch (error) {
        console.error("Failed to send interview email:", error.message);
    }
};
