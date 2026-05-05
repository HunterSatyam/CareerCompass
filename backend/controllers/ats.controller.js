import { ATSScan } from "../models/atsScan.model.js";
import { Job } from "../models/job.model.js";
import { Internship } from "../models/internship.model.js";
import { Hackathon } from "../models/hackathon.model.js";
import { Webinar } from "../models/webinar.model.js";
import { Competition } from "../models/competition.model.js";
import { Certification } from "../models/certification.model.js";
import { Application } from "../models/application.model.js";
import { User } from "../models/user.model.js";
import pdf from "pdf-parse";
import mammoth from "mammoth";
import fs from "fs";
import path from "path";
import natural from "natural";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to extract text from file
const extractText = async (file) => {
    if (file.mimetype === 'application/pdf') {
        const dataBuffer = fs.readFileSync(file.path);
        const data = await pdf(dataBuffer);
        return data.text;
    } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const result = await mammoth.extractRawText({ path: file.path });
        return result.value;
    }
    throw new Error("Unsupported file type");
};

// Helper to extract text from remote URL
const extractTextFromUrl = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch resume");
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Try parsing as PDF first based on extension or signature
        if (url.toLowerCase().endsWith('.pdf')) {
            const data = await pdf(buffer);
            return data.text;
        } else if (url.toLowerCase().endsWith('.docx')) {
            const result = await mammoth.extractRawText({ buffer });
            return result.value;
        }

        // Fallback catch-all for parsing
        try {
            const data = await pdf(buffer);
            return data.text;
        } catch (e) {
            try {
                const result = await mammoth.extractRawText({ buffer });
                return result.value;
            } catch (err) {
                console.error("Final extraction fallback failed");
                return "";
            }
        }
    } catch (error) {
        console.error("Remote extraction error:", error);
        return "";
    }
};

const analyzeResume = (resumeText, jobDescription) => {
    const tokenizer = new natural.WordTokenizer();
    const stemmer = natural.PorterStemmer;
    const TfIdf = natural.TfIdf;
    const tfidf = new TfIdf();

    const resumeLower = resumeText.toLowerCase();
    const jobLower = jobDescription.toLowerCase();

    // 1. NLP Keyword Analysis using TF-IDF and Stemming
    tfidf.addDocument(resumeLower);
    tfidf.addDocument(jobLower);

    const stopWords = ["the", "and", "is", "in", "to", "for", "with", "content", "application", "resume", "description", "experience", "years", "work", "job", "will", "have", "that", "this", "from", "are", "you", "we", "our", "their", "as", "by", "on", "of", "an", "a", "or", "your", "be", "at"];
    
    // Extract keywords from JD using tokenizer
    const jobTokens = tokenizer.tokenize(jobLower) || [];
    const uniqueJobKeywords = [...new Set(jobTokens.filter(w => w.length > 3 && !stopWords.includes(w)))];

    const matchedKeywords = [];
    const missingKeywords = [];

    // Use stemming for fuzzy matching
    const resumeTokens = tokenizer.tokenize(resumeLower) || [];
    const stemmedResumeTokens = resumeTokens.map(t => stemmer.stem(t));

    let keywordScoreWeight = 0;
    let maxKeywordScoreWeight = uniqueJobKeywords.length;

    uniqueJobKeywords.forEach(keyword => {
        const stemmedKeyword = stemmer.stem(keyword);
        
        // Exact Stem Match
        if (stemmedResumeTokens.includes(stemmedKeyword)) {
            matchedKeywords.push(keyword);
            keywordScoreWeight += 1;
        } else {
            // Fallback: JaroWinkler for typos (high threshold)
            const hasTypoMatch = resumeTokens.some(rt => natural.JaroWinklerDistance(rt, keyword) > 0.90);
            if (hasTypoMatch) {
                matchedKeywords.push(keyword);
                keywordScoreWeight += 1;
            } else {
                missingKeywords.push(keyword);
            }
        }
    });

    const keywordMatchRate = maxKeywordScoreWeight > 0 ? (keywordScoreWeight / maxKeywordScoreWeight) : 0;

    // 2. Advanced Section Analysis (Enhanced Regex)
    const sections = {
        education: /education|academic|degree|university|college|bachelor|master/i.test(resumeLower),
        experience: /experience|employment|work history|professional background/i.test(resumeLower),
        skills: /skills|technologies|proficiencies|expertise|competencies/i.test(resumeLower),
        projects: /projects|portfolio|personal work/i.test(resumeLower),
        certifications: /certifications|certificates|licenses|courses/i.test(resumeLower)
    };

    // 3. Contact Info Check (Enhanced Regex)
    const contactInfo = {
        email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(resumeText),
        phone: /(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(resumeText),
        linkedin: /linkedin\.com\/(in|profile)\//i.test(resumeText),
        github: /github\.com\//i.test(resumeText)
    };

    // 4. Action Verbs Check with Stemming
    const actionVerbs = ["led", "developed", "created", "managed", "designed", "implemented", "optimized", "achieved", "improved", "launched", "collaborated", "mentored", "orchestrated", "spearheaded", "engineered", "architected"];
    const stemmedActionVerbs = actionVerbs.map(v => stemmer.stem(v));
    
    const foundVerbs = actionVerbs.filter((verb, idx) => stemmedResumeTokens.includes(stemmedActionVerbs[idx]));
    const verbScore = Math.min(foundVerbs.length / 5, 1); // Cap at 1 if 5+ verbs found

    // 5. Scoring Logic (Weighted Precision)
    // Keywords: 45%, Sections: 25%, Contact: 15%, Verbs: 15%
    const sectionScore = (Object.values(sections).filter(Boolean).length / Object.keys(sections).length) * 100;
    const contactScore = (Object.values(contactInfo).filter(Boolean).length / Object.keys(contactInfo).length) * 100;

    let totalScore = Math.round(
        (keywordMatchRate * 45) +
        (sectionScore * 0.25) +
        (contactScore * 0.15) +
        (verbScore * 15)
    );

    // Cap score at 100
    if (totalScore > 100) totalScore = 100;

    // 6. Generate detailed AI-like feedback
    const suggestions = [];

    // Critical Issues
    if (!contactInfo.email) suggestions.push({ type: "Critical", text: "Missing an email address. Essential for recruiter contact." });
    if (!contactInfo.phone) suggestions.push({ type: "Critical", text: "Missing phone number." });
    if (!sections.education) suggestions.push({ type: "Critical", text: "Education section not detected. Use standard headers like 'Education' or 'Academic Profile'." });
    if (!sections.experience) suggestions.push({ type: "Critical", text: "Experience section not detected. Ensure you use 'Experience' or 'Work History'." });

    // Improvements
    if (!contactInfo.linkedin) suggestions.push({ type: "Improvement", text: "Adding a LinkedIn profile URL increases professional credibility." });
    if (!sections.projects) suggestions.push({ type: "Improvement", text: "Projects section is missing. Showcasing projects is crucial for technical/creative roles." });
    if (keywordMatchRate < 0.5) suggestions.push({ type: "Improvement", text: `Low semantic keyword match (${Math.round(keywordMatchRate * 100)}%). Incorporate more domain-specific terms from the job description.` });
    if (foundVerbs.length < 3) suggestions.push({ type: "Improvement", text: "Use more strong action verbs (e.g., Spearheaded, Engineered, Optimized) to describe your impact." });

    // Formatting
    if (resumeTokens.length < 250) suggestions.push({ type: "Formatting", text: "Resume is too brief. Aim for at least 300-400 words to properly convey your skills." });
    if (resumeTokens.length > 1500) suggestions.push({ type: "Formatting", text: "Resume might be too long. Keep it concise (1-2 pages)." });

    return {
        score: totalScore,
        matchedKeywords,
        missingKeywords,
        suggestions,
        details: {
            contactInfo,
            sections,
            foundVerbs
        }
    };
};

export const checkATSScore = async (req, res) => {
    try {
        const { jobDescription } = req.body;
        const file = req.file;

        if (!file || !jobDescription) {
            return res.status(400).json({ message: "Resume file and Job Description are required.", success: false });
        }

        let resumeText;
        try {
            resumeText = await extractText(file);
        } finally {
            // Always clean up uploaded file
            if (fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            }
        }

        const analysis = analyzeResume(resumeText, jobDescription);

        // Save scan result (Simplified for MongoDB size, or detailed if needed)
        // Here we just return the full detailed analysis to frontend
        const atsScan = await ATSScan.create({
            userId: req.id,
            jobDescription,
            score: analysis.score,
            matchedKeywords: analysis.matchedKeywords,
            missingKeywords: analysis.missingKeywords,
            suggestions: analysis.suggestions.map(s => s.text), // Store just text for historical simple array
            fileName: file.originalname
        });

        // Return rich response
        return res.status(200).json({
            message: "ATS check completed successfully.",
            success: true,
            data: {
                ...atsScan.toObject(),
                detailedAnalysis: analysis // pass full detailed object for UI
            }
        });

    } catch (error) {
        console.error("ATS Check Error:", error);
        return res.status(500).json({ message: "Server error during ATS check.", success: false });
    }
};

export const getMyScans = async (req, res) => {
    try {
        const scans = await ATSScan.find({ userId: req.id }).sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            scans
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error fetching scans.", success: false });
    }
};

export const rankApplicants = async (req, res) => {
    const logPath = path.resolve(__dirname, "../debug.log");
    const log = (msg) => fs.appendFileSync(logPath, `[${new Date().toISOString()}] ${msg}\n`);

    try {
        const jobId = req.params.jobId;
        log(`Requested ranking for Event ID: ${jobId}`);

        const models = [Job, Internship, Hackathon, Webinar, Competition, Certification];
        let event = null;
        let eventTypeFound = "";

        for (const Model of models) {
            try {
                event = await Model.findById(jobId).populate({
                    path: 'applications',
                    populate: {
                        path: 'applicant',
                        select: 'fullname email profile'
                    }
                });
                if (event) {
                    eventTypeFound = Model.modelName;
                    break;
                }
            } catch (err) {
                // Continue if not found in this model
                continue;
            }
        }

        if (!event) {
            log(`Event not found in any collection for ID: ${jobId}`);
            return res.status(404).json({ message: "Post not found.", success: false });
        }

        log(`Successfully fetched ${eventTypeFound}: ${event.title} with ${event.applications?.length || 0} applications`);

        const jobType = event.jobType || eventTypeFound || "Post";
        const requirementsText = Array.isArray(event.requirements) ? event.requirements.join(" ") : "";
        const jobDescription = `${event.title} ${event.description} ${requirementsText}`;

        const rankedApplicants = await Promise.all(event.applications.map(async (app) => {
            try {
                if (!app) return null;
                const applicant = app.applicant;
                const resumeUrl = applicant?.profile?.resume;

                let score = 0;
                let matchedKeywords = [];
                if (resumeUrl) {
                    try {
                        const resumeText = await extractTextFromUrl(resumeUrl);
                        if (resumeText) {
                            const analysis = analyzeResume(resumeText, jobDescription);
                            score = analysis.score;
                            matchedKeywords = analysis.matchedKeywords;
                        }
                    } catch (resumeError) {
                        console.error(`Error processing resume for ${applicant?.fullname}:`, resumeError.message);
                    }
                }

                return {
                    applicationId: app._id,
                    applicantId: applicant?._id,
                    fullname: applicant?.fullname,
                    email: applicant?.email,
                    resume: resumeUrl,
                    score: score,
                    matchedKeywords: matchedKeywords,
                    skills: applicant?.profile?.skills || [],
                    status: app.status,
                    appliedDate: app.createdAt
                };
            } catch (err) {
                console.error("Error mapping applicant:", err);
                return null;
            }
        }));

        // Filter out any nulls from failed individual processing
        const finalApplicants = rankedApplicants.filter(app => app !== null);

        // Sort by score descending
        finalApplicants.sort((a, b) => b.score - a.score);

        return res.status(200).json({
            success: true,
            jobTitle: event.title,
            jobType: jobType,
            applicants: finalApplicants
        });

    } catch (error) {
        log(`CRITICAL RANKING ERROR: ${error.message}\nStack: ${error.stack}`);
        console.error("Ranking error:", error);
        return res.status(500).json({ message: "Server error during ranking.", success: false });
    }
};
