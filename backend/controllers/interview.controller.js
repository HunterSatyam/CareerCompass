import { InterviewCompany } from "../models/interviewCompany.model.js";
import { InterviewQuestion } from "../models/interviewQuestion.model.js";
import { InterviewRole } from "../models/interviewRole.model.js";
import { InterviewSession } from "../models/interviewSession.model.js";
import { InterviewExperience } from "../models/interviewExperience.model.js";
import { InterviewResource } from "../models/interviewResource.model.js";
import { InterviewAnalytics } from "../models/interviewAnalytics.model.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";

const QUESTION_TYPES = ['Objective', 'Subjective', 'Coding', 'HR', 'Aptitude', 'Behavioral'];
const QUESTION_DIFFICULTIES = ['Easy', 'Medium', 'Hard'];
const BULK_INSERT_BATCH_SIZE = 500;
const REQUIRED_CSV_FIELDS = ["title", "description", "answer", "type"];

const normalizeQuestionType = (type = "Subjective") => {
    const normalized = String(type).trim().toLowerCase();
    const match = QUESTION_TYPES.find((item) => item.toLowerCase() === normalized || (normalized === "mcq" && item === "Objective"));
    return match || "Subjective";
};

const normalizeTags = (tags = [], role, category) => {
    const parsedTags = Array.isArray(tags) ? tags : String(tags).split(",");
    return [...new Set([...parsedTags.map((tag) => String(tag).trim()).filter(Boolean), role, category].filter(Boolean))];
};

const escapeRegExp = (value = "") => String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const normalizeLookupValue = (value = "") => String(value).trim().toLowerCase();

const normalizeDifficulty = (difficulty = "Medium") => {
    const normalized = String(difficulty || "").trim().toLowerCase();
    return QUESTION_DIFFICULTIES.find((item) => item.toLowerCase() === normalized) || "Medium";
};

const isEmptyCsvRow = (row = []) => !row.some((value) => String(value || "").trim());

const parseDelimitedList = (value = "") => {
    if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
    const text = String(value || "").trim();
    if (!text) return [];
    const delimiter = text.includes("|") ? "|" : ",";
    return text.split(delimiter).map((item) => item.trim()).filter(Boolean);
};

const detectCompanyName = (item = {}, fallbackCompanyName = "", knownCompanyNames = []) => {
    const explicitCompany = String(item.company || item.companyname || "").trim();
    if (explicitCompany) return explicitCompany;

    const knownNames = [...new Set([...knownCompanyNames, ...companiesSeed.map((company) => company.name)])]
        .map((name) => String(name || "").trim())
        .filter(Boolean);

    const fields = [
        ...parseDelimitedList(item.tags),
        item.title,
        item.hiringupdate || item.hiringUpdate
    ].map((value) => String(value || "").trim()).filter(Boolean);

    const exactMatch = fields.find((value) => knownNames.some((name) => name.toLowerCase() === value.toLowerCase()));
    if (exactMatch) return knownNames.find((name) => name.toLowerCase() === exactMatch.toLowerCase()) || exactMatch;

    const containedMatch = knownNames.find((name) => {
        const pattern = new RegExp(`(^|[^a-z0-9])${escapeRegExp(name)}([^a-z0-9]|$)`, "i");
        return fields.some((value) => pattern.test(value));
    });
    if (containedMatch) return containedMatch;

    const titleMatch = String(item.title || "").match(/(?:^|\b)([A-Z][A-Za-z0-9 .&-]{1,40})\s*(?:[:|-]|\binterview\b|\bquestion\b|\bhiring\b)/);
    if (titleMatch?.[1] && !/^(what|why|how|when|where|which|explain|describe|find|write|implement|design)$/i.test(titleMatch[1])) {
        return titleMatch[1].trim();
    }

    const hiringMatch = String(item.hiringupdate || item.hiringUpdate || "").match(/^([A-Za-z0-9 .&-]+?)\s+(?:is\s+)?(?:hiring|recruiting|opening|openings)/i);
    if (hiringMatch?.[1]) return hiringMatch[1].trim();

    return fallbackCompanyName || "General";
};

const findOrCreateInterviewCompany = async ({ companyId, companyName, difficulty = "Medium" }) => {
    if (companyId) {
        const existingCompany = await InterviewCompany.findById(companyId);
        if (existingCompany) return existingCompany;
    }

    const name = String(companyName || "General").trim();
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

const normalizeCsvHeader = (header = "") => String(header || "").trim().toLowerCase().replace(/[\s_-]+/g, "");

const mapCsvRowToItem = (headerMap = [], row = []) => headerMap.reduce((acc, key, index) => {
    acc[key] = row[index] || "";
    return acc;
}, {});

const parseCorrectOption = (value) => {
    if (value === undefined || value === null || value === "") return undefined;
    const numberValue = Number(value);
    return Number.isFinite(numberValue) ? numberValue : undefined;
};

const buildQuestionDuplicateKey = ({ company, title, questionType }) => `${company?.toString?.() || company}::${normalizeLookupValue(title)}::${normalizeLookupValue(questionType)}`;

const ensureInterviewRolesByName = async (roleNames = []) => {
    const uniqueNames = [...new Set(roleNames.map((role) => String(role || "").trim()).filter(Boolean))];
    if (!uniqueNames.length) return 0;

    const existingRoles = await InterviewRole.find({ name: { $in: uniqueNames } }).select("name").lean();
    const existingSet = new Set(existingRoles.map((role) => normalizeLookupValue(role.name)));
    const missingRoles = uniqueNames
        .filter((name) => !existingSet.has(normalizeLookupValue(name)))
        .map((name) => ({
            name,
            summary: `${name} interview preparation role.`,
            requiredSkills: [],
            roadmap: [],
            commonTools: [],
            commonQuestions: []
        }));

    if (missingRoles.length) {
        await InterviewRole.insertMany(missingRoles, { ordered: false });
    }
    return missingRoles.length;
};

const loadInterviewCompanyMap = async () => {
    const companies = await InterviewCompany.find().select("_id name").lean();
    return new Map(companies.map((company) => [normalizeLookupValue(company.name), company]));
};

const getOrCreateCompanyFromMap = async ({ companyName, difficulty, companyMap }) => {
    const safeName = String(companyName || "General").trim() || "General";
    const key = normalizeLookupValue(safeName);
    if (companyMap.has(key)) return companyMap.get(key);

    const company = await findOrCreateInterviewCompany({ companyName: safeName, difficulty });
    const plainCompany = { _id: company._id, name: company.name };
    companyMap.set(key, plainCompany);
    return plainCompany;
};

const validateCsvItem = (item = {}, rowNumber) => {
    const errors = [];
    REQUIRED_CSV_FIELDS.forEach((field) => {
        if (!String(item[field] || "").trim()) errors.push(`${field} is required`);
    });

    const rawType = String(item.type || item.questiontype || "").trim();
    if (rawType && !QUESTION_TYPES.some((type) => type.toLowerCase() === rawType.toLowerCase()) && rawType.toLowerCase() !== "mcq") {
        errors.push(`type must be one of ${QUESTION_TYPES.join(", ")}`);
    }

    return errors.length ? { row: rowNumber, errors } : null;
};

const buildBulkQuestionFromItem = ({ item, company, manager, userId }) => {
    const type = normalizeQuestionType(item.type || item.questiontype);
    const answer = String(item.answer || "").trim();
    const _id = new mongoose.Types.ObjectId();

    return {
        _id,
        questionId: _id.toString(),
        company: company._id,
        title: String(item.title || "").trim(),
        description: String(item.description || "").trim(),
        answer,
        questionType: type,
        difficulty: normalizeDifficulty(item.difficulty),
        category: String(item.category || "Technical").trim() || "Technical",
        role: String(item.role || "").trim(),
        tags: normalizeTags(item.tags, item.role, item.category),
        options: type === "Objective" ? parseDelimitedList(item.options) : [],
        correctOption: parseCorrectOption(item.correctoption),
        sampleAnswer: type === "Subjective" ? answer : undefined,
        explanation: item.explanation || (type === "Objective" ? answer : undefined),
        codeSnippet: item.codesnippet,
        solutionCode: type === "Coding" ? (item.solutioncode || answer) : item.solutioncode,
        round: item.round,
        hiringUpdate: item.hiringupdate,
        createdBy: userId,
        createdByRole: manager.role,
        source: "bulk"
    };
};

const requireQuestionManager = async (req, res) => {
    if (req.interviewManager) return req.interviewManager;
    if (req.admin) {
        return {
            id: req.admin._id,
            role: "admin",
            source: "admin"
        };
    }

    const user = await User.findById(req.id).select("role");
    if (!user || user.role !== "recruiter") {
        res.status(403).json({ message: "Only admins and recruiters can manage interview questions.", success: false });
        return null;
    }
    return {
        id: user._id,
        role: "recruiter",
        source: "user"
    };
};

const companiesSeed = [
    { name: "Google", logo: "https://www.google.com/favicon.ico", category: "Product Based", difficulty: "Hard", rating: 4.9, packageRange: "18 LPA - 60 LPA+", hiringFrequency: "Quarterly", jobLocations: ["Bengaluru", "Hyderabad", "Gurugram"], interviewRounds: ["Online Assessment", "Technical Round", "System Design", "HR Round"], hiringProcess: ["Online Assessment", "Technical Round", "System Design", "HR Round"], eligibilityCriteria: ["DSA", "CS fundamentals", "Projects"] },
    { name: "Amazon", logo: "https://www.amazon.com/favicon.ico", category: "Product Based", difficulty: "Hard", rating: 4.8, packageRange: "12 LPA - 45 LPA+", hiringFrequency: "Monthly", jobLocations: ["Bengaluru", "Hyderabad", "Chennai"], interviewRounds: ["Online Assessment", "Technical Round", "Managerial Round", "HR Round"], hiringProcess: ["OA", "Technical Rounds", "Bar Raiser", "HR"], eligibilityCriteria: ["DSA", "Leadership principles", "System thinking"] },
    { name: "Microsoft", logo: "https://www.microsoft.com/favicon.ico", category: "Product Based", difficulty: "Hard", rating: 4.8, packageRange: "15 LPA - 50 LPA+", hiringFrequency: "Quarterly", jobLocations: ["Hyderabad", "Bengaluru", "Noida"], interviewRounds: ["Online Assessment", "Technical Round", "System Design", "HR Round"], hiringProcess: ["OA", "Technical", "Design", "HR"], eligibilityCriteria: ["DSA", "OOP", "Projects"] },
    { name: "TCS", logo: "https://www.tcs.com/favicon.ico", category: "Service Based", difficulty: "Medium", rating: 4.3, packageRange: "3.5 LPA - 9 LPA", hiringFrequency: "Annual high-volume", jobLocations: ["Pan India"], interviewRounds: ["Aptitude", "Technical Round", "HR Round"], hiringProcess: ["NQT", "Technical", "HR"], eligibilityCriteria: ["60% academics", "Aptitude", "Programming basics"] },
    { name: "Infosys", logo: "https://www.infosys.com/favicon.ico", category: "Service Based", difficulty: "Medium", rating: 4.2, packageRange: "3.6 LPA - 8 LPA", hiringFrequency: "Frequent", jobLocations: ["Mysuru", "Bengaluru", "Pune"], interviewRounds: ["Aptitude", "Technical Round", "HR Round"], hiringProcess: ["Online Test", "Technical", "HR"], eligibilityCriteria: ["Logical ability", "Programming basics", "Communication"] },
    { name: "Wipro", logo: "https://www.wipro.com/favicon.ico", category: "Service Based", difficulty: "Medium", rating: 4.1, packageRange: "3.5 LPA - 7 LPA", hiringFrequency: "Frequent", jobLocations: ["Pan India"], interviewRounds: ["Aptitude", "Coding", "Technical", "HR"], hiringProcess: ["NLTH", "Technical", "HR"], eligibilityCriteria: ["60% academics", "Coding basics"] },
    { name: "Accenture", logo: "https://www.accenture.com/favicon.ico", category: "Consulting / Service", difficulty: "Medium", rating: 4.2, packageRange: "4.5 LPA - 12 LPA", hiringFrequency: "Frequent", jobLocations: ["Bengaluru", "Mumbai", "Pune", "Hyderabad"], interviewRounds: ["Cognitive Assessment", "Coding", "Communication", "HR"], hiringProcess: ["Assessment", "Communication", "Interview"], eligibilityCriteria: ["Aptitude", "Communication", "Problem solving"] }
];

const rolesSeed = [
    { name: "Frontend Developer", summary: "Build responsive, accessible, high-performance user interfaces.", requiredSkills: ["React", "JavaScript", "CSS", "Accessibility", "Testing"], roadmap: ["HTML/CSS depth", "JavaScript", "React", "State management", "Performance"], commonTools: ["React", "Next.js", "Redux", "Jest"], commonQuestions: ["Explain reconciliation.", "How do hooks work?", "How do you optimize Core Web Vitals?"] },
    { name: "Backend Developer", summary: "Design APIs, data models, auth, and reliable server systems.", requiredSkills: ["Node.js", "Databases", "REST APIs", "Auth", "Caching"], roadmap: ["HTTP", "Express", "MongoDB/SQL", "Auth", "Queues"], commonTools: ["Node.js", "Express", "MongoDB", "Redis"], commonQuestions: ["How does JWT auth work?", "Explain indexing.", "Design a rate limiter."] },
    { name: "Full Stack Developer", summary: "Own product features across frontend, backend, and deployment.", requiredSkills: ["React", "Node.js", "Databases", "Deployment"], roadmap: ["Frontend", "API design", "Database modeling", "Auth", "Cloud"], commonTools: ["React", "Express", "MongoDB", "Docker"], commonQuestions: ["Explain SSR vs CSR.", "Design a dashboard feature."] },
    { name: "Data Analyst", summary: "Turn data into insight using SQL, statistics, dashboards, and storytelling.", requiredSkills: ["SQL", "Excel", "Python", "Statistics", "BI"], roadmap: ["SQL", "Cleaning", "EDA", "Dashboards", "Storytelling"], commonTools: ["SQL", "Python", "Power BI", "Tableau"], commonQuestions: ["Explain joins.", "How do you handle missing data?"] },
    { name: "Business Analyst", summary: "Translate business goals into requirements, metrics, and execution plans.", requiredSkills: ["Requirements", "SQL basics", "Stakeholder management"], roadmap: ["Domain study", "Requirements", "Process maps", "Metrics", "UAT"], commonTools: ["Jira", "Confluence", "Excel"], commonQuestions: ["Write a user story.", "Handle conflicting stakeholders."] },
    { name: "UI/UX Designer", summary: "Design usable, accessible, research-backed product experiences.", requiredSkills: ["Figma", "Research", "Wireframing", "Prototyping"], roadmap: ["UX basics", "Research", "IA", "Visual design", "Portfolio"], commonTools: ["Figma", "FigJam", "Maze"], commonQuestions: ["Explain your process.", "How do you validate a design?"] },
    { name: "Sales Executive", summary: "Drive pipeline, discovery, negotiation, and customer relationships.", requiredSkills: ["Communication", "CRM", "Prospecting", "Negotiation"], roadmap: ["Product knowledge", "Prospecting", "Discovery", "Objections", "Closing"], commonTools: ["Salesforce", "HubSpot", "LinkedIn"], commonQuestions: ["Sell me this product.", "How do you handle rejection?"] }
];

const companyRoleQuestionProfiles = {
    Google: [
        { role: "Frontend Developer", focus: "performance, accessibility, and clean abstraction", system: "collaborative document editor", behavior: "ambiguous product requirements", coding: "Find the longest substring without repeating characters", category: "Frontend Architecture" },
        { role: "Backend Developer", focus: "distributed systems, API design, and reliability", system: "search suggestion service", behavior: "debugging a high-impact latency issue", coding: "Merge overlapping intervals", category: "Distributed Systems" },
        { role: "Data Analyst", focus: "experimentation, SQL depth, and product metrics", system: "A/B experiment dashboard", behavior: "challenging a metric assumption", coding: "Calculate a moving average from event data", category: "Analytics" }
    ],
    Amazon: [
        { role: "Backend Developer", focus: "ownership, scale, and operational excellence", system: "order notification pipeline", behavior: "customer-impacting production incident", coding: "Implement an LRU cache", category: "Backend Systems" },
        { role: "Full Stack Developer", focus: "customer obsession, end-to-end delivery, and maintainability", system: "seller inventory portal", behavior: "delivering under a tight deadline", coding: "Validate balanced brackets", category: "Full Stack" },
        { role: "Business Analyst", focus: "requirements clarity, metrics, and stakeholder trade-offs", system: "returns performance dashboard", behavior: "handling conflicting stakeholder priorities", coding: "Group orders by status and total revenue", category: "Business Analysis" }
    ],
    Microsoft: [
        { role: "Full Stack Developer", focus: "maintainability, API design, and collaboration", system: "Teams-like chat service", behavior: "cross-team technical disagreement", coding: "Debounce a search input and cache results", category: "Product Engineering" },
        { role: "Frontend Developer", focus: "inclusive design, state management, and component quality", system: "Office-style realtime editor", behavior: "improving accessibility after feedback", coding: "Flatten a nested navigation tree", category: "Frontend" },
        { role: "Backend Developer", focus: "cloud APIs, authentication, and data consistency", system: "calendar scheduling API", behavior: "resolving a production bug responsibly", coding: "Find duplicate meeting slots", category: "Cloud Backend" }
    ],
    TCS: [
        { role: "Full Stack Developer", focus: "programming basics, database queries, and project clarity", system: "employee leave management portal", behavior: "learning a new technology quickly", coding: "Reverse words in a sentence", category: "Programming Fundamentals" },
        { role: "Backend Developer", focus: "REST APIs, SQL basics, and debugging", system: "payroll processing API", behavior: "fixing a defect before release", coding: "Count word frequency in a paragraph", category: "Backend Basics" },
        { role: "Business Analyst", focus: "process mapping, documentation, and communication", system: "attendance tracking workflow", behavior: "clarifying incomplete client requirements", coding: "Create a simple status summary from records", category: "Business Process" }
    ],
    Infosys: [
        { role: "Data Analyst", focus: "SQL, data cleaning, and business interpretation", system: "sales analytics dashboard", behavior: "explaining insight to non-technical stakeholders", coding: "Find the second highest value in an array", category: "Data Analysis" },
        { role: "Full Stack Developer", focus: "clean code, database operations, and client communication", system: "training management portal", behavior: "handling changing requirements", coding: "Paginate an array of records", category: "Application Development" },
        { role: "Backend Developer", focus: "API validation, database joins, and error handling", system: "support ticket API", behavior: "improving a slow database query", coding: "Remove duplicates from a sorted array", category: "Backend" }
    ],
    Wipro: [
        { role: "Backend Developer", focus: "coding fundamentals, APIs, and debugging", system: "ticket assignment service", behavior: "handling a tight delivery deadline", coding: "Find the first non-repeating character in a string", category: "Backend Development" },
        { role: "Frontend Developer", focus: "React basics, forms, and reusable components", system: "customer support dashboard", behavior: "responding to UI feedback from QA", coding: "Build a function to filter visible table rows", category: "Frontend Development" },
        { role: "Full Stack Developer", focus: "CRUD flows, auth basics, and deployment readiness", system: "asset management app", behavior: "coordinating with testers before launch", coding: "Implement simple input validation", category: "Full Stack" }
    ],
    Accenture: [
        { role: "Business Analyst", focus: "requirements, communication, and structured problem solving", system: "client onboarding workflow", behavior: "resolving stakeholder conflict", coding: "Prioritize tasks by urgency and impact", category: "Consulting" },
        { role: "Data Analyst", focus: "dashboarding, KPI design, and insight communication", system: "client revenue dashboard", behavior: "presenting a data-backed recommendation", coding: "Summarize monthly revenue by client", category: "Analytics Consulting" },
        { role: "UI/UX Designer", focus: "research, wireframes, and usability trade-offs", system: "mobile onboarding redesign", behavior: "defending design decisions with evidence", coding: "Map user actions to funnel drop-off counts", category: "Experience Design" }
    ]
};

const buildCompanyQuestions = (company) => {
    const profiles = companyRoleQuestionProfiles[company.name] || [{
        role: "Full Stack Developer",
        focus: "technical fundamentals and communication",
        system: "interview preparation platform",
        behavior: "complex project challenge",
        coding: "Solve a practical data transformation problem",
        category: "Technical"
    }];

    return profiles.flatMap((profile) => {
        const common = {
            company: company._id,
            role: profile.role,
            frequency: "High",
            isImportant: true
        };
        const difficulty = company.difficulty === "Hard" ? "Hard" : "Medium";
        const baseTags = [company.name, profile.role, profile.category];

        return [
            {
                ...common,
                title: `${company.name} ${profile.role}: Explain a project that demonstrates ${profile.focus}.`,
                description: `Discuss one project as if this is a ${company.name} ${profile.role} interview. Cover problem, ownership, design decisions, trade-offs, testing, and final impact.`,
                questionType: "Subjective",
                difficulty,
                category: profile.category,
                tags: [...baseTags, "project", "technical"],
                sampleAnswer: "Use a concise structure: context, constraints, your decisions, trade-offs, measurable result, and what you would improve.",
                tips: "Interviewers look for role-specific depth, not a list of technologies."
            },
            {
                ...common,
                title: `${company.name} ${profile.role}: Tell me about a time you handled ${profile.behavior}.`,
                description: "Answer with a real situation, your action, and the business or team outcome.",
                questionType: "Subjective",
                difficulty: "Medium",
                category: "Behavioral",
                tags: [...baseTags, "behavioral", "communication"],
                sampleAnswer: "Use STAR: situation, task, action, result. Keep the conflict professional and focus on your ownership.",
                tips: "Avoid blaming others. Close with what changed after your intervention."
            },
            {
                ...common,
                title: `${company.name} ${profile.role}: Which practice best supports ${profile.focus}?`,
                description: "Choose the strongest interview answer for this company and role.",
                questionType: "Objective",
                difficulty: "Medium",
                category: profile.category,
                tags: [...baseTags, "objective", "fundamentals"],
                options: [
                    "Make changes quickly without measuring impact",
                    "Clarify constraints, choose a simple design, test it, and measure the result",
                    "Skip documentation because the code is self-explanatory",
                    "Prioritize only the newest tool in the stack"
                ],
                correctOption: 1,
                explanation: "Strong role answers combine constraints, design choices, validation, and measurable impact.",
                tips: "Tie your answer to the role tag and the company's interview style."
            },
            {
                ...common,
                title: `${company.name} ${profile.role}: What is the best first step when designing a ${profile.system}?`,
                description: "Pick the option that shows structured system thinking.",
                questionType: "Objective",
                difficulty,
                category: "System Design",
                tags: [...baseTags, "system-design", "objective"],
                options: [
                    "Start coding immediately",
                    "Define users, core flows, scale, data, and failure cases",
                    "Select a database before understanding requirements",
                    "Avoid trade-offs until the end"
                ],
                correctOption: 1,
                explanation: "Good design interviews start with requirements and constraints before implementation details.",
                tips: "Mention assumptions, bottlenecks, and trade-offs before deep-diving."
            },
            {
                ...common,
                title: `${company.name} ${profile.role}: ${profile.coding}.`,
                description: "Write a clean solution, handle edge cases, and explain time and space complexity.",
                questionType: "Coding",
                difficulty,
                category: "Coding",
                tags: [...baseTags, "coding", "dsa"],
                codeSnippet: "function solve(input) {\n  // Write your solution here\n}",
                solutionCode: "A strong solution validates input, uses an appropriate data structure, handles empty and duplicate cases, and states time and space complexity.",
                testCases: [{ input: "sample input", expectedOutput: "expected result" }, { input: "edge case", expectedOutput: "safe result" }],
                tips: "Explain the approach before coding, then dry-run one normal case and one edge case."
            },
            {
                ...common,
                title: `${company.name} ${profile.role}: Design core logic for a ${profile.system}.`,
                description: "Write pseudocode or JavaScript for the core operation and explain data structures, edge cases, and complexity.",
                questionType: "Coding",
                difficulty,
                category: "System Design",
                tags: [...baseTags, "system-design", "coding"],
                codeSnippet: "function handleCoreOperation(input) {\n  // Validate input\n  // Update state safely\n  // Return a deterministic result\n}",
                solutionCode: "A strong solution defines inputs, validates edge cases, chooses a data structure, keeps operations idempotent where needed, and explains complexity plus failure handling.",
                testCases: [{ input: "valid request", expectedOutput: "updated state" }, { input: "duplicate request", expectedOutput: "safe no-op or idempotent response" }],
                tips: "Combine coding clarity with system trade-offs: consistency, retries, storage, and monitoring."
            }
        ];
    });
};

const ensureInterviewSeedData = async () => {
    const companies = [];
    for (const companySeed of companiesSeed) {
        const company = await InterviewCompany.findOneAndUpdate(
            { name: companySeed.name },
            { $setOnInsert: companySeed },
            { upsert: true, new: true }
        );
        companies.push(company);
    }

    for (const roleSeed of rolesSeed) {
        await InterviewRole.findOneAndUpdate(
            { name: roleSeed.name },
            { $setOnInsert: roleSeed },
            { upsert: true, new: true }
        );
    }

    let questionsCreated = 0;
    for (const company of companies) {
        const questions = buildCompanyQuestions(company);
        for (const question of questions) {
            const exists = await InterviewQuestion.exists({
                company: company._id,
                title: question.title,
                questionType: question.questionType
            });
            if (!exists) {
                await InterviewQuestion.create(question);
                questionsCreated += 1;
            }
        }
        const questionsCount = await InterviewQuestion.countDocuments({ company: company._id });
        await InterviewCompany.findByIdAndUpdate(company._id, { questionsCount });
    }

    return {
        companiesCount: companies.length,
        rolesCount: rolesSeed.length,
        questionsCreated,
        totalQuestions: await InterviewQuestion.countDocuments()
    };
};

const buildFeedback = (answer = "", question = "") => {
    const words = answer.trim().split(/\s+/).filter(Boolean).length;
    const hasStructure = /because|first|second|finally|trade[- ]?off|example/i.test(answer);
    const confidenceScore = Math.min(95, Math.max(45, 50 + words * 2 + (hasStructure ? 10 : 0)));
    const communicationScore = Math.min(95, Math.max(40, 55 + (hasStructure ? 18 : 0) + Math.min(words, 25)));
    const technicalAccuracy = Math.min(96, Math.max(42, 58 + (answer.toLowerCase().includes("complexity") || answer.toLowerCase().includes("scale") ? 15 : 0) + Math.min(words, 20)));
    const grammarScore = Math.min(95, Math.max(50, 70 - ((answer.match(/\bi\b/g) || []).length * 2) + (answer.endsWith(".") ? 5 : 0)));

    return {
        confidenceScore,
        communicationScore,
        technicalAccuracy,
        grammarScore,
        suggestions: [
            words < 40 ? "Add a concrete example and explain the impact in measurable terms." : "Keep the structure concise and close with a clear outcome.",
            hasStructure ? "Good structure. Add trade-offs where relevant." : "Use a simple framework: context, action, result, trade-off.",
            question.toLowerCase().includes("design") ? "Mention scale, data model, bottlenecks, and failure handling." : "Include assumptions before jumping into the solution."
        ]
    };
};

// Create Company
export const createInterviewCompany = async (req, res) => {
    try {
        const { name, logo, category, difficulty, rating, hiringProcess, eligibilityCriteria, packageRange, hiringFrequency, jobLocations, interviewRounds, hiringDetails, preparationLinks } = req.body;
        if (!name) return res.status(400).json({ message: "Company name is required", success: false });

        const company = await InterviewCompany.create({ name, logo, category, difficulty, rating, hiringProcess, eligibilityCriteria, packageRange, hiringFrequency, jobLocations, interviewRounds, hiringDetails, preparationLinks });
        return res.status(201).json({ message: "Company created successfully", company, success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

// Get All Companies
export const getAllInterviewCompanies = async (req, res) => {
    try {
        let companies = await InterviewCompany.find().sort({ rating: -1, name: 1 });
        if (!companies.length) {
            await ensureInterviewSeedData();
            companies = await InterviewCompany.find().sort({ rating: -1, name: 1 });
        }
        return res.status(200).json({ companies, success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

// Create Question
export const createInterviewQuestion = async (req, res) => {
    try {
        const manager = await requireQuestionManager(req, res);
        if (!manager) return;

        const incomingQuestions = Array.isArray(req.body.questions) ? req.body.questions : [req.body];
        const normalizedQuestions = incomingQuestions.map((item) => {
            const {
                companyId,
                title,
                description,
                answer,
                questionType,
                type,
                difficulty,
                category,
                role,
                tags = [],
                explanation,
                timeLimit,
                options,
                correctOption,
                sampleAnswer,
                codeSnippet,
                solutionCode,
                testCases,
                tips,
                frequency,
                isImportant,
                round,
                hiringUpdate,
                status
            } = item;

            return {
                company: companyId || req.body.companyId,
                title: String(title || "").trim(),
                description,
                answer: answer || sampleAnswer || solutionCode || explanation || "",
                questionType: normalizeQuestionType(type || questionType),
                difficulty: QUESTION_DIFFICULTIES.includes(difficulty) ? difficulty : "Medium",
                category,
                role,
                tags: normalizeTags(tags, role, category),
                createdBy: manager.id,
                createdByRole: manager.role,
                round,
                hiringUpdate,
                status,
                source: "manual",
                explanation,
                timeLimit,
                options,
                correctOption,
                sampleAnswer,
                codeSnippet,
                solutionCode,
                testCases,
                tips,
                frequency,
                isImportant
            };
        });

        if (normalizedQuestions.some((question) => !question.company || !question.title || !question.questionType)) {
            return res.status(400).json({ message: "Missing required fields", success: false });
        }

        const questions = await InterviewQuestion.insertMany(normalizedQuestions, { ordered: true });

        const companyQuestionCounts = questions.reduce((acc, question) => {
            const companyId = question.company.toString();
            acc[companyId] = (acc[companyId] || 0) + 1;
            return acc;
        }, {});
        await Promise.all(Object.entries(companyQuestionCounts).map(([companyId, count]) => (
            InterviewCompany.findByIdAndUpdate(companyId, { $inc: { questionsCount: count } })
        )));

        return res.status(201).json({
            message: questions.length > 1 ? "Questions added successfully" : "Question added successfully",
            question: questions[0],
            questions,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

export const updateInterviewQuestion = async (req, res) => {
    try {
        const manager = await requireQuestionManager(req, res);
        if (!manager) return;

        const { id } = req.params;
        const updates = { ...req.body };
        if (updates.type || updates.questionType) updates.questionType = normalizeQuestionType(updates.type || updates.questionType);
        if (updates.tags !== undefined) updates.tags = normalizeTags(updates.tags, updates.role, updates.category);
        if (updates.difficulty && !QUESTION_DIFFICULTIES.includes(updates.difficulty)) updates.difficulty = "Medium";
        if (updates.answer === undefined) updates.answer = updates.sampleAnswer || updates.solutionCode || updates.explanation;
        delete updates._id;
        delete updates.questionId;
        delete updates.createdBy;
        delete updates.createdByRole;

        const question = await InterviewQuestion.findByIdAndUpdate(id, updates, { new: true, runValidators: true }).populate("company", "name logo");
        if (!question) return res.status(404).json({ message: "Question not found", success: false });
        return res.status(200).json({ message: "Question updated successfully", question, success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

export const deleteInterviewQuestion = async (req, res) => {
    try {
        const manager = await requireQuestionManager(req, res);
        if (!manager) return;

        const { id } = req.params;
        const question = await InterviewQuestion.findByIdAndDelete(id);
        if (!question) return res.status(404).json({ message: "Question not found", success: false });
        await InterviewCompany.findByIdAndUpdate(question.company, { $inc: { questionsCount: -1 } });
        return res.status(200).json({ message: "Question deleted successfully", success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

export const bulkUploadInterviewQuestions = async (req, res) => {
    try {
        const manager = await requireQuestionManager(req, res);
        if (!manager) return;

        const { csv, companyId, companyName } = req.body;
        if (!csv) {
            return res.status(400).json({ message: "CSV content is required", success: false });
        }

        const rows = parseCsvRows(csv);
        const [headers, ...dataRows] = rows;
        if (!headers?.length || !dataRows.length) {
            return res.status(400).json({ message: "CSV must include a header row and question rows", success: false });
        }

        const headerMap = headers.map(normalizeCsvHeader);
        const missingHeaders = REQUIRED_CSV_FIELDS.filter((field) => !headerMap.includes(field));
        if (missingHeaders.length) {
            return res.status(400).json({
                message: `Missing required CSV columns: ${missingHeaders.join(", ")}`,
                failedRows: [{ row: 1, errors: [`Missing required CSV columns: ${missingHeaders.join(", ")}`] }],
                success: false
            });
        }

        const fallbackCompany = companyId ? await InterviewCompany.findById(companyId).select("_id name") : null;
        const companyMap = await loadInterviewCompanyMap();
        const knownCompanyNames = [...companyMap.values()].map((company) => company.name);
        const failedRows = [];
        const validItems = [];

        dataRows.forEach((row, index) => {
            let rowNumber = index + 2;
            if (isEmptyCsvRow(row)) return;

            try {
                const item = mapCsvRowToItem(headerMap, row);
                rowNumber = Number(item.sourcerow) || rowNumber;
                const validationError = validateCsvItem(item, rowNumber);
                if (validationError) {
                    failedRows.push(validationError);
                    return;
                }
                validItems.push({ item, rowNumber });
            } catch (error) {
                failedRows.push({ row: rowNumber, errors: [error.message || "Unable to parse row"] });
            }
        });

        if (!validItems.length) {
            return res.status(400).json({
                message: "No valid question rows found",
                summary: {
                    totalRows: dataRows.length,
                    uploaded: 0,
                    failed: failedRows.length,
                    duplicatesSkipped: 0
                },
                failedRows,
                success: false
            });
        }

        await ensureInterviewRolesByName(validItems.map(({ item }) => item.role));

        const questions = [];
        for (const { item, rowNumber } of validItems) {
            try {
                const difficulty = normalizeDifficulty(item.difficulty);
                const detectedCompanyName = detectCompanyName(item, companyName || fallbackCompany?.name || "", knownCompanyNames);
                const company = item.companyid
                    ? await findOrCreateInterviewCompany({ companyId: item.companyid, companyName: detectedCompanyName, difficulty })
                    : (!item.company && !item.companyname && companyId)
                        ? await getOrCreateCompanyFromMap({ companyName: fallbackCompany?.name || detectedCompanyName, difficulty, companyMap })
                        : await getOrCreateCompanyFromMap({ companyName: detectedCompanyName, difficulty, companyMap });
                questions.push({ ...buildBulkQuestionFromItem({ item, company, manager, userId: manager.id }), rowNumber });
            } catch (error) {
                failedRows.push({ row: rowNumber, errors: [error.message || "Failed to normalize row"] });
            }
        }

        const seenKeys = new Set();
        const duplicateRows = [];
        const dedupedQuestions = [];
        for (const question of questions) {
            const key = buildQuestionDuplicateKey(question);
            if (seenKeys.has(key)) {
                duplicateRows.push(question.rowNumber);
                continue;
            }
            seenKeys.add(key);
            dedupedQuestions.push(question);
        }

        const existingQuestions = dedupedQuestions.length
            ? await InterviewQuestion.find({
                $or: dedupedQuestions.map((question) => ({
                    company: question.company,
                    title: question.title,
                    questionType: question.questionType
                }))
            }).select("company title questionType").lean()
            : [];
        const existingKeys = new Set(existingQuestions.map(buildQuestionDuplicateKey));
        const insertableQuestions = dedupedQuestions
            .filter((question) => {
                const duplicate = existingKeys.has(buildQuestionDuplicateKey(question));
                if (duplicate) duplicateRows.push(question.rowNumber);
                return !duplicate;
            })
            .map(({ rowNumber, ...question }) => question);
        const sourceRowByKey = new Map(questions.map((question) => [buildQuestionDuplicateKey(question), question.rowNumber]));

        let createdQuestions = [];
        for (let index = 0; index < insertableQuestions.length; index += BULK_INSERT_BATCH_SIZE) {
            const batch = insertableQuestions.slice(index, index + BULK_INSERT_BATCH_SIZE);
            try {
                const inserted = await InterviewQuestion.insertMany(batch, { ordered: false });
                createdQuestions = createdQuestions.concat(inserted);
            } catch (error) {
                if (error?.insertedDocs?.length) createdQuestions = createdQuestions.concat(error.insertedDocs);
                const writeErrors = Array.isArray(error?.writeErrors)
                    ? error.writeErrors
                    : Array.isArray(error?.result?.result?.writeErrors)
                        ? error.result.result.writeErrors
                        : [];
                writeErrors.forEach((writeError) => {
                    const failedQuestion = batch[writeError.index];
                    failedRows.push({
                        row: sourceRowByKey.get(buildQuestionDuplicateKey(failedQuestion)) || "unknown",
                        errors: [writeError.errmsg || writeError.err?.errmsg || writeError.message || "Database insert failed"]
                    });
                });
                if (!writeErrors.length && !error?.insertedDocs?.length) {
                    throw error;
                }
            }
        }

        const companyQuestionCounts = createdQuestions.reduce((acc, question) => {
            const key = question.company.toString();
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {});
        await Promise.all(Object.entries(companyQuestionCounts).map(([id, count]) => (
            InterviewCompany.findByIdAndUpdate(id, { $inc: { questionsCount: count } })
        )));

        return res.status(201).json({
            message: "CSV processed successfully",
            createdCount: createdQuestions.length,
            totalUploaded: createdQuestions.length,
            failedRows,
            duplicateRows,
            duplicateSkipped: duplicateRows.length,
            summary: {
                totalRows: dataRows.filter((row) => !isEmptyCsvRow(row)).length,
                uploaded: createdQuestions.length,
                failed: failedRows.length,
                duplicatesSkipped: duplicateRows.length
            },
            companiesUpdated: Object.keys(companyQuestionCounts).length,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error?.message ? `Bulk upload failed: ${error.message}` : "Bulk upload failed",
            failedRows: [],
            success: false
        });
    }
};

// Get Questions by Company
export const getQuestionsByCompany = async (req, res) => {
    try {
        const { companyId } = req.params;
        const { role, type, category, difficulty, page = 1, limit = 30 } = req.query;
        const query = {
            company: companyId,
            ...(role ? { role } : {}),
            ...(type ? { questionType: type } : {}),
            ...(category ? { category } : {}),
            ...(difficulty ? { difficulty } : {})
        };
        const safePage = Math.max(Number(page) || 1, 1);
        const safeLimit = Math.min(Math.max(Number(limit) || 30, 1), 100);
        let [questions, total] = await Promise.all([
            InterviewQuestion.find(query).sort({ role: 1, questionType: 1, category: 1, createdAt: -1 }).skip((safePage - 1) * safeLimit).limit(safeLimit),
            InterviewQuestion.countDocuments(query)
        ]);
        if (!questions.length) {
            await ensureInterviewSeedData();
            [questions, total] = await Promise.all([
                InterviewQuestion.find(query).sort({ role: 1, questionType: 1, category: 1, createdAt: -1 }).skip((safePage - 1) * safeLimit).limit(safeLimit),
                InterviewQuestion.countDocuments(query)
            ]);
        }
        return res.status(200).json({
            questions,
            pagination: {
                total,
                page: safePage,
                limit: safeLimit,
                pages: Math.max(Math.ceil(total / safeLimit), 1)
            },
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

// Get All Questions (Global Hub)
export const getAllInterviewQuestions = async (req, res) => {
    try {
        const { type, company, role, category, difficulty, search, important, sort = "recent", page = 1, limit = 30 } = req.query;
        const query = {};
        if (type) query.questionType = normalizeQuestionType(type);
        if (company) query.company = company;
        if (role) query.role = role;
        if (category) query.category = category;
        if (difficulty) query.difficulty = difficulty;
        if (important === "true") query.isImportant = true;
        if (search) query.$or = [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
            { tags: { $regex: search, $options: "i" } }
        ];
        const sortMap = {
            recent: { createdAt: -1 },
            attempted: { attemptedCount: -1 },
            important: { isImportant: -1, frequency: -1 }
        };
        const safePage = Math.max(Number(page) || 1, 1);
        const safeLimit = Math.min(Math.max(Number(limit) || 30, 1), 100);
        const skip = (safePage - 1) * safeLimit;
        const [questions, total] = await Promise.all([
            InterviewQuestion.find(query).populate('company').sort(sortMap[sort] || sortMap.recent).skip(skip).limit(safeLimit),
            InterviewQuestion.countDocuments(query)
        ]);
        return res.status(200).json({
            questions,
            pagination: {
                total,
                page: safePage,
                limit: safeLimit,
                pages: Math.max(Math.ceil(total / safeLimit), 1)
            },
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

export const getInterviewRoles = async (req, res) => {
    try {
        let roles = await InterviewRole.find().sort({ name: 1 });
        if (!roles.length) {
            await ensureInterviewSeedData();
            roles = await InterviewRole.find().sort({ name: 1 });
        }
        return res.status(200).json({ roles, success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

export const createInterviewRole = async (req, res) => {
    try {
        const role = await InterviewRole.create(req.body);
        return res.status(201).json({ role, message: "Role created successfully", success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

export const startMockInterview = async (req, res) => {
    try {
        const { company, role, category, difficulty, numberOfQuestions } = req.body;
        if (!await InterviewQuestion.exists({})) await ensureInterviewSeedData();

        const selectedCompany = company
            ? await InterviewCompany.findOne({ name: { $regex: `^${company}$`, $options: "i" } })
            : null;

        const query = {
            ...(selectedCompany ? { company: selectedCompany._id } : {}),
            ...(category ? { category } : {}),
            ...(difficulty ? { difficulty } : {}),
            ...(role ? { role } : {})
        };

        let dbQuestions = await InterviewQuestion.find(query).populate("company", "name").limit(Number(numberOfQuestions) || 5);

        if (!dbQuestions.length && selectedCompany) {
            dbQuestions = await InterviewQuestion.find({
                company: selectedCompany._id,
                ...(role ? { role } : {})
            }).populate("company", "name").limit(Number(numberOfQuestions) || 5);
        }

        if (!dbQuestions.length && role) {
            dbQuestions = await InterviewQuestion.find({ role }).populate("company", "name").limit(Number(numberOfQuestions) || 5);
        }

        if (!dbQuestions.length) {
            return res.status(404).json({ message: "No real interview questions found for the selected filters.", questions: [], success: false });
        }

        const questionDetails = dbQuestions.map((q) => ({
            _id: q._id,
            title: q.title,
            questionType: q.questionType,
            category: q.category,
            difficulty: q.difficulty,
            role: q.role,
            company: q.company?.name,
            description: q.description,
            options: q.options,
            codeSnippet: q.codeSnippet,
            tips: q.tips
        }));
        const questions = questionDetails.map((q) => q.title);

        const session = await InterviewSession.create({
            user: req.id,
            company,
            role,
            category,
            difficulty,
            numberOfQuestions: questions.length,
            questions,
            status: "in_progress"
        });

        return res.status(201).json({ session, questions, questionDetails, success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

export const evaluateMockInterview = async (req, res) => {
    try {
        const { sessionId, answers = [], duration = 0 } = req.body;
        const evaluatedAnswers = answers.map((item) => ({
            ...item,
            feedback: buildFeedback(item.answerText || item.transcript || "", item.question || "")
        }));

        const average = (key) => Math.round(evaluatedAnswers.reduce((sum, item) => sum + (item.feedback?.[key] || 0), 0) / Math.max(evaluatedAnswers.length, 1));
        const scorecard = {
            confidenceScore: average("confidenceScore"),
            communicationScore: average("communicationScore"),
            technicalAccuracy: average("technicalAccuracy"),
            grammarScore: average("grammarScore"),
            weakTopics: [],
            recommendations: [],
            summary: evaluatedAnswers.length ? "Score generated from your submitted interview answers." : "No submitted answers were available for scoring."
        };
        scorecard.finalScore = Math.round((scorecard.confidenceScore + scorecard.communicationScore + scorecard.technicalAccuracy + scorecard.grammarScore) / 4);

        const session = sessionId
            ? await InterviewSession.findByIdAndUpdate(sessionId, { answers: evaluatedAnswers, scorecard, status: "completed", duration }, { new: true })
            : await InterviewSession.create({ user: req.id, answers: evaluatedAnswers, scorecard, status: "completed", duration });

        await InterviewAnalytics.findOneAndUpdate(
            { user: req.id },
            {
                $inc: { streak: 1, totalPracticeMinutes: Math.ceil(duration / 60) || 5 },
                $set: {
                    accuracyPercentage: scorecard.finalScore,
                    weakTopics: [],
                    recommendedPracticeAreas: scorecard.recommendations
                },
                $unset: { dailyChallenge: "" },
                $push: { recentlyAttempted: { title: session?.company || "Mock Interview", score: scorecard.finalScore, attemptedAt: new Date() } }
            },
            { upsert: true, new: true }
        );

        return res.status(200).json({ session, scorecard, answers: evaluatedAnswers, success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

export const getInterviewHistory = async (req, res) => {
    try {
        const sessions = await InterviewSession.find({ user: req.id }).sort({ createdAt: -1 }).limit(30);
        return res.status(200).json({ sessions, success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

export const getInterviewAnalytics = async (req, res) => {
    try {
        const analytics = await InterviewAnalytics.findOne({ user: req.id });
        return res.status(200).json({ analytics, success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

export const getExperiences = async (req, res) => {
    try {
        const { company } = req.query;
        const query = { status: "approved", ...(company ? { company } : {}) };
        const experiences = await InterviewExperience.find(query).sort({ createdAt: -1 }).limit(50).populate("company", "name logo");
        return res.status(200).json({ experiences, success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

export const createExperience = async (req, res) => {
    try {
        const experience = await InterviewExperience.create({ ...req.body, user: req.id });
        return res.status(201).json({ experience, message: "Experience submitted successfully", success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

export const getResources = async (req, res) => {
    try {
        const { company, role, category } = req.query;
        const resources = await InterviewResource.find({
            ...(company ? { company } : {}),
            ...(role ? { role } : {}),
            ...(category ? { category } : {})
        }).sort({ createdAt: -1 }).limit(50);
        return res.status(200).json({ resources, success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

export const createResource = async (req, res) => {
    try {
        const resource = await InterviewResource.create(req.body);
        return res.status(201).json({ resource, message: "Resource added successfully", success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

export const runCodeReview = async (req, res) => {
    try {
        const { code = "", language = "JavaScript" } = req.body;
        const review = {
            language,
            complexity: code.includes("for") || code.includes("while") ? "Likely O(n) or higher. State the exact loop bounds in the interview." : "Could be O(1), verify based on data structure operations.",
            issues: code.length < 40 ? ["Solution is too short to evaluate thoroughly."] : ["Add edge-case handling.", "Explain why the chosen data structure is appropriate."],
            score: Math.min(92, Math.max(50, 60 + Math.floor(code.length / 20))),
            suggestion: "Mention time complexity, space complexity, and at least two test cases before finalizing."
        };
        return res.status(200).json({ review, success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

export const generateInterviewQuestions = async (req, res) => {
    try {
        const manager = await requireQuestionManager(req, res);
        if (!manager) return;

        const {
            companyId,
            companyName = "Target Company",
            role = "Full Stack Developer",
            category = "Technical",
            difficulty = "Medium",
            type = "Subjective",
            count = 5,
            save = false
        } = req.body;

        const normalizedType = normalizeQuestionType(type);
        const safeCount = Math.min(Math.max(Number(count) || 5, 1), 20);
        const generated = Array.from({ length: safeCount }).map((_, index) => {
            const sequence = index + 1;
            const base = `${companyName} ${role}`;
            const titleByType = {
                Objective: `${base}: Choose the best approach for ${category} scenario ${sequence}`,
                Subjective: `${base}: Explain your approach to a ${category} challenge ${sequence}`,
                Coding: `${base}: Solve a ${category} coding challenge ${sequence}`,
                HR: `${base}: Describe a workplace situation related to ownership ${sequence}`,
                Aptitude: `${base}: Solve this aptitude reasoning problem ${sequence}`,
                Behavioral: `${base}: Tell me about a time you demonstrated collaboration ${sequence}`
            };
            return {
                company: companyId,
                title: titleByType[normalizedType],
                description: `AI-generated ${difficulty} ${normalizedType} prompt for ${role}. Include assumptions, edge cases, and measurable outcomes where relevant.`,
                answer: normalizedType === "Coding" ? "Provide an optimal solution, dry run, and complexity analysis." : "Use a structured answer with context, action, result, and trade-offs.",
                questionType: normalizedType,
                difficulty,
                category,
                role,
                tags: normalizeTags(["ai-generated", companyName, role, category], role, category),
                options: normalizedType === "Objective" ? ["Clarify requirements and validate with tests", "Start coding without assumptions", "Ignore edge cases", "Skip feedback"] : [],
                correctOption: normalizedType === "Objective" ? 0 : undefined,
                sampleAnswer: normalizedType !== "Coding" ? "Start with the goal, state constraints, explain your action, quantify the result, and close with what you learned." : undefined,
                codeSnippet: normalizedType === "Coding" ? "function solution(input) {\n  // implement here\n}" : undefined,
                solutionCode: normalizedType === "Coding" ? "Validate input, choose the right data structure, implement clearly, and state complexity." : undefined,
                source: "ai",
                createdBy: manager.id,
                createdByRole: manager.role
            };
        });

        if (save) {
            if (!companyId) return res.status(400).json({ message: "companyId is required when save is true", success: false });
            const questions = await InterviewQuestion.insertMany(generated);
            await InterviewCompany.findByIdAndUpdate(companyId, { $inc: { questionsCount: questions.length } });
            return res.status(201).json({ message: "AI questions generated and saved", questions, success: true });
        }

        return res.status(200).json({ message: "AI questions generated", questions: generated, success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "AI generation failed", success: false });
    }
};

export const checkInterviewAnswer = async (req, res) => {
    try {
        const { questionId, question = "", answer = "" } = req.body;
        const dbQuestion = questionId ? await InterviewQuestion.findById(questionId) : null;
        const expected = dbQuestion?.answer || dbQuestion?.sampleAnswer || dbQuestion?.solutionCode || "";
        const submitted = String(answer);
        const targetQuestion = dbQuestion?.title || question;
        const submittedWords = new Set(submitted.toLowerCase().split(/\W+/).filter(Boolean));
        const expectedWords = expected.toLowerCase().split(/\W+/).filter((word) => word.length > 4);
        const overlap = expectedWords.filter((word) => submittedWords.has(word)).length;
        const structureBonus = /because|first|second|finally|trade|complexity|impact|example/i.test(submitted) ? 15 : 0;
        const score = Math.min(96, Math.max(35, 45 + overlap * 4 + structureBonus));
        const weakTopics = [
            !/complexity|scale|performance/i.test(submitted) ? "Complexity and scalability" : null,
            !/test|edge|case/i.test(submitted) ? "Edge cases and testing" : null,
            submitted.trim().split(/\s+/).length < 50 ? "Answer depth" : null
        ].filter(Boolean);

        return res.status(200).json({
            feedback: {
                question: targetQuestion,
                score,
                weakTopics,
                strengths: score >= 70 ? ["Relevant coverage", "Clear structure"] : ["Attempt submitted"],
                suggestions: weakTopics.length ? weakTopics.map((topic) => `Improve ${topic.toLowerCase()} in your answer.`) : ["Good coverage. Tighten the final summary."],
                sampleAnswer: expected
            },
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Answer checking failed", success: false });
    }
};

export const seedInterviewModule = async (req, res) => {
    try {
        const result = await ensureInterviewSeedData();
        return res.status(200).json({
            message: "Interview companies, roles, and tagged question bank seeded successfully.",
            ...result,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};
