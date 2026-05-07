import dotenv from "dotenv";
dotenv.config({});
import fs from "fs";
import mongoose from "mongoose";
import { InterviewCompany } from "../models/interviewCompany.model.js";
import { InterviewQuestion } from "../models/interviewQuestion.model.js";

const QUESTION_TYPES = ['Objective', 'Subjective', 'Coding', 'HR', 'Aptitude', 'Behavioral'];
const QUESTION_DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

const normalizeQuestionType = (type = "Subjective") => {
    const normalized = String(type).trim().toLowerCase();
    return QUESTION_TYPES.find((item) => item.toLowerCase() === normalized || (normalized === "mcq" && item === "Objective")) || "Subjective";
};

const normalizeTags = (tags = [], role, category) => {
    const parsedTags = Array.isArray(tags) ? tags : String(tags).split(",");
    return [...new Set([...parsedTags.map((tag) => String(tag).trim()).filter(Boolean), role, category].filter(Boolean))];
};

const escapeRegExp = (value = "") => String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const parseCsvRows = (csv = "") => {
    const rows = [];
    let row = [];
    let value = "";
    let quoted = false;

    for (let index = 0; index < csv.length; index += 1) {
        const char = csv[index];
        const next = csv[index + 1];
        if (char === '"' && quoted && next === '"') {
            value += '"';
            index += 1;
        } else if (char === '"') {
            quoted = !quoted;
        } else if (char === "," && !quoted) {
            row.push(value.trim());
            value = "";
        } else if ((char === "\n" || char === "\r") && !quoted) {
            if (char === "\r" && next === "\n") index += 1;
            row.push(value.trim());
            if (row.some(Boolean)) rows.push(row);
            row = [];
            value = "";
        } else {
            value += char;
        }
    }

    row.push(value.trim());
    if (row.some(Boolean)) rows.push(row);
    return rows;
};

const detectCompanyName = (item = {}) => {
    if (item.company || item.companyname) return item.company || item.companyname;
    const tags = String(item.tags || "").split(",").map((tag) => tag.trim()).filter(Boolean);
    if (tags[0]) return tags[0];
    const hiringMatch = String(item.hiringupdate || "").match(/^([A-Za-z0-9 .&-]+?)\s+is hiring/i);
    if (hiringMatch?.[1]) return hiringMatch[1].trim();
    const titleMatch = String(item.title || "").match(/^([A-Za-z0-9 .&-]+?)\s+/);
    return titleMatch?.[1]?.trim() || "General";
};

const findOrCreateCompany = async (name, difficulty = "Medium") => {
    return InterviewCompany.findOneAndUpdate(
        { name: { $regex: `^${escapeRegExp(name)}$`, $options: "i" } },
        {
            $setOnInsert: {
                name,
                category: "Interview Prep",
                difficulty: QUESTION_DIFFICULTIES.includes(difficulty) ? difficulty : "Medium",
                rating: 4.5
            }
        },
        { upsert: true, new: true }
    );
};

const importCsv = async (filePath) => {
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI is not configured");
    if (!filePath) throw new Error("Usage: node scripts/importInterviewQuestionsCsv.js /path/to/questions.csv");

    const csv = fs.readFileSync(filePath, "utf8");
    const [headers, ...dataRows] = parseCsvRows(csv);
    if (!headers?.length || !dataRows.length) throw new Error("CSV must include a header row and question rows");

    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 });

    const headerMap = headers.map((header) => header.trim().toLowerCase().replace(/\s+/g, ""));
    const summary = { created: 0, skippedDuplicates: 0, skippedInvalid: 0, companies: {}, categories: {} };

    for (const row of dataRows) {
        const item = headerMap.reduce((acc, key, index) => ({ ...acc, [key]: row[index] || "" }), {});
        if (!item.title) {
            summary.skippedInvalid += 1;
            continue;
        }

        const difficulty = QUESTION_DIFFICULTIES.includes(item.difficulty) ? item.difficulty : "Medium";
        const companyName = detectCompanyName(item);
        const company = await findOrCreateCompany(companyName, difficulty);
        const exists = await InterviewQuestion.exists({ company: company._id, title: item.title });
        if (exists) {
            summary.skippedDuplicates += 1;
            continue;
        }

        await InterviewQuestion.create({
            company: company._id,
            title: item.title,
            description: item.description,
            answer: item.answer,
            questionType: normalizeQuestionType(item.type || item.questiontype),
            difficulty,
            category: item.category || "Technical",
            role: item.role,
            tags: normalizeTags(item.tags, item.role, item.category),
            options: item.options ? item.options.split("|").map((option) => option.trim()).filter(Boolean) : [],
            correctOption: item.correctoption ? Number(item.correctoption) : undefined,
            sampleAnswer: item.answer,
            explanation: item.explanation,
            round: item.round,
            hiringUpdate: item.hiringupdate,
            createdByRole: "system",
            source: "bulk"
        });

        summary.created += 1;
        summary.companies[companyName] = (summary.companies[companyName] || 0) + 1;
        const category = item.category || "Technical";
        summary.categories[category] = (summary.categories[category] || 0) + 1;
    }

    await Promise.all(Object.keys(summary.companies).map(async (companyName) => {
        const company = await InterviewCompany.findOne({ name: { $regex: `^${escapeRegExp(companyName)}$`, $options: "i" } });
        if (!company) return;
        const questionsCount = await InterviewQuestion.countDocuments({ company: company._id });
        await InterviewCompany.findByIdAndUpdate(company._id, { questionsCount });
    }));

    await mongoose.disconnect();
    return summary;
};

importCsv(process.argv[2])
    .then((summary) => {
        console.log(JSON.stringify(summary, null, 2));
        process.exit(0);
    })
    .catch(async (error) => {
        console.error(error.message);
        if (mongoose.connection.readyState) await mongoose.disconnect();
        process.exit(1);
    });
