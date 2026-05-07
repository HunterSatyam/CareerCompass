import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import Navbar from '../../shared/Navbar';
import Footer from '../../shared/Footer';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { INTERVIEW_API_END_POINT } from '@/utils/constant';
import {
    Bot,
    Briefcase,
    Building2,
    ChevronLeft,
    ChevronRight,
    Code2,
    FileUp,
    Filter,
    Loader2,
    Pencil,
    Plus,
    Save,
    Search,
    Sparkles,
    Tags,
    Trash2,
    X
} from 'lucide-react';

const blankQuestion = {
    companyId: '',
    title: '',
    description: '',
    answer: '',
    questionType: 'Subjective',
    category: 'Technical',
    difficulty: 'Medium',
    role: '',
    tags: '',
    options: '',
    correctOption: 0,
    codeSnippet: '',
    solutionCode: '',
    round: '',
    hiringUpdate: ''
};

const questionTypes = ['Objective', 'Subjective', 'Coding', 'HR', 'Aptitude', 'Behavioral'];
const categories = ['Technical', 'System Design', 'HR', 'Aptitude', 'Behavioral', 'Database', 'Frontend', 'Backend', 'Analytics'];
const difficulties = ['Easy', 'Medium', 'Hard'];
const requiredCsvFields = ['title', 'description', 'answer', 'type'];
const csvChunkSize = 50;
const sampleCsv = `title,description,answer,type,role,category,difficulty,tags,options,correctOption,round,hiringUpdate,company
"What is database indexing?","Explain why indexes are used in databases.","Indexes speed up selected read queries, with storage and write overhead.","Objective","Backend Developer","Database","Medium","SQL,Database","Improve read speed|Encrypt all rows|Replace backups|Make every write faster",0,"Technical Round","Backend hiring active","Google"
"Tell me about a conflict you handled.","Answer using STAR with a clear outcome.","Use Situation, Task, Action, Result and focus on ownership.","Subjective","Full Stack Developer","Behavioral","Medium","Amazon,Communication,Ownership","",,"HR Round","Leadership evaluation",""
"Find the first non-repeating character.","Return the first character with frequency one, or null.","Use a hashmap for frequencies, then scan the string again.","Coding","Backend Developer","Coding","Easy","DSA,Hashmap","",,"Online Assessment","Microsoft is hiring backend developers",""`;

const parseCsvRows = (csv = '') => {
    const rows = [];
    let row = [];
    let value = '';
    let quoted = false;

    for (let index = 0; index < csv.length; index += 1) {
        const char = csv[index];
        const next = csv[index + 1];
        if (char === '"' && quoted && next === '"') {
            value += '"';
            index += 1;
        } else if (char === '"') {
            quoted = !quoted;
        } else if (char === ',' && !quoted) {
            row.push(value.trim());
            value = '';
        } else if ((char === '\n' || char === '\r') && !quoted) {
            if (char === '\r' && next === '\n') index += 1;
            row.push(value.trim());
            if (row.some(Boolean)) rows.push(row);
            row = [];
            value = '';
        } else {
            value += char;
        }
    }

    row.push(value.trim());
    if (row.some(Boolean)) rows.push(row);
    return rows;
};

const normalizeCsvHeader = (header = '') => header.trim().toLowerCase().replace(/[\s_-]+/g, '');

const escapeCsvCell = (value = '') => {
    const text = String(value ?? '');
    return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

const rowsToCsv = (headers, rows) => [
    [...headers, '__sourceRow'].map(escapeCsvCell).join(','),
    ...rows.map(({ row, rowNumber }) => [...headers.map((_, index) => escapeCsvCell(row[index] || '')), rowNumber].join(','))
].join('\n');

const getApiErrorMessage = (error, fallback = 'Request failed') => {
    const status = error.response?.status;
    const apiMessage = error.response?.data?.message;
    const rowMessage = error.response?.data?.failedRows?.[0]?.errors?.join(', ');
    const url = error.config?.url;
    if (apiMessage) return apiMessage;
    if (rowMessage) return rowMessage;
    if (status) return `${fallback}: HTTP ${status}${url ? ` (${url})` : ''}`;
    return error.message || fallback;
};

const postBulkUploadChunk = async (payload) => {
    const uploadPaths = [
        '/bulk-upload-csv',
        '/questions/bulk-upload'
    ];
    let lastError = null;

    for (const path of uploadPaths) {
        try {
            return await axios.post(`${INTERVIEW_API_END_POINT}${path}`, payload, { withCredentials: true });
        } catch (error) {
            lastError = error;
            if (error.response?.status !== 404) throw error;
        }
    }

    throw lastError;
};

const validateCsvRows = (csv = '') => {
    const rows = parseCsvRows(csv);
    const [headers = [], ...dataRows] = rows;
    const headerMap = headers.map(normalizeCsvHeader);
    const missingHeaders = requiredCsvFields.filter((field) => !headerMap.includes(field));
    const errors = [];
    const validRows = [];
    const previewRows = [];

    if (!headers.length) {
        return { headers: [], rows: [], validRows: [], errors: [{ row: 1, errors: ['CSV header row is required'] }], missingHeaders: requiredCsvFields };
    }

    if (missingHeaders.length) {
        errors.push({ row: 1, errors: [`Missing required columns: ${missingHeaders.join(', ')}`] });
    }

    dataRows.forEach((row, index) => {
        const rowNumber = index + 2;
        if (!row.some((value) => String(value || '').trim())) return;

        const item = headerMap.reduce((acc, key, cellIndex) => {
            acc[key] = row[cellIndex] || '';
            return acc;
        }, {});
        const rowErrors = requiredCsvFields
            .filter((field) => !String(item[field] || '').trim())
            .map((field) => `${field} is required`);

        const type = String(item.type || '').trim().toLowerCase();
        if (type && !questionTypes.some((questionType) => questionType.toLowerCase() === type) && type !== 'mcq') {
            rowErrors.push(`type must be one of ${questionTypes.join(', ')}`);
        }

        const preview = {
            row: rowNumber,
            title: item.title || '',
            type: item.type || '',
            company: item.company || item.companyname || 'Auto-detect',
            role: item.role || '',
            category: item.category || '',
            difficulty: item.difficulty || ''
        };
        previewRows.push(preview);

        if (rowErrors.length) {
            errors.push({ row: rowNumber, errors: rowErrors });
        } else {
            validRows.push({ rowNumber, row });
        }
    });

    return { headers, rows: previewRows, validRows, errors, missingHeaders };
};

const SkeletonRows = () => (
    <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-24 animate-pulse rounded-2xl bg-gray-100 dark:bg-zinc-800" />
        ))}
    </div>
);

const QuestionManagementSystem = ({ embedded = false }) => {
    const [companies, setCompanies] = useState([]);
    const [roles, setRoles] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, limit: 10 });
    const [filters, setFilters] = useState({ search: '', company: '', role: '', category: '', difficulty: '', type: '' });
    const [form, setForm] = useState(blankQuestion);
    const [editingId, setEditingId] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [bulkCsv, setBulkCsv] = useState('');
    const [bulkCompanyId, setBulkCompanyId] = useState('');
    const [csvPreview, setCsvPreview] = useState({ headers: [], rows: [], validRows: [], errors: [], missingHeaders: [] });
    const [bulkUploading, setBulkUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadSummary, setUploadSummary] = useState(null);
    const [aiLoading, setAiLoading] = useState(false);

    const selectedCompany = useMemo(() => companies.find((company) => company._id === form.companyId), [companies, form.companyId]);

    const loadQuestions = async (page = pagination.page) => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.set('page', page);
            params.set('limit', pagination.limit);
            Object.entries(filters).forEach(([key, value]) => {
                if (value) params.set(key, value);
            });
            const res = await axios.get(`${INTERVIEW_API_END_POINT}/questions/all?${params.toString()}`, { withCredentials: true });
            setQuestions(res.data.questions || []);
            setPagination(res.data.pagination || { page, pages: 1, total: res.data.questions?.length || 0, limit: pagination.limit });
        } catch (error) {
            toast.error(getApiErrorMessage(error, 'Failed to load questions'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const loadBaseData = async () => {
            const [companyRes, roleRes] = await Promise.all([
                axios.get(`${INTERVIEW_API_END_POINT}/company/get`, { withCredentials: true }),
                axios.get(`${INTERVIEW_API_END_POINT}/roles`, { withCredentials: true })
            ]);
            setCompanies(companyRes.data.companies || []);
            setRoles(roleRes.data.roles || []);
        };
        loadBaseData().catch((error) => toast.error(getApiErrorMessage(error, 'Failed to load companies and roles')));
    }, []);

    useEffect(() => {
        loadQuestions(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters]);

    useEffect(() => {
        if (!bulkCsv.trim()) {
            setCsvPreview({ headers: [], rows: [], validRows: [], errors: [], missingHeaders: [] });
            setUploadSummary(null);
            setUploadProgress(0);
            return;
        }

        try {
            setCsvPreview(validateCsvRows(bulkCsv));
        } catch (error) {
            setCsvPreview({
                headers: [],
                rows: [],
                validRows: [],
                errors: [{ row: 1, errors: [error.message || 'CSV could not be parsed'] }],
                missingHeaders: []
            });
        }
    }, [bulkCsv]);

    const updateForm = (key, value) => setForm((current) => ({ ...current, [key]: value }));

    const buildPayload = () => ({
        ...form,
        tags: form.tags,
        options: form.options.split('\n').map((option) => option.trim()).filter(Boolean),
        correctOption: Number(form.correctOption) || 0,
        companyId: form.companyId
    });

    const resetForm = () => {
        setForm(blankQuestion);
        setEditingId('');
    };

    const saveQuestion = async (event) => {
        event.preventDefault();
        if (!form.companyId || !form.title.trim()) {
            toast.error('Company and title are required');
            return;
        }

        setSaving(true);
        try {
            if (editingId) {
                await axios.put(`${INTERVIEW_API_END_POINT}/question/${editingId}`, buildPayload(), { withCredentials: true });
                toast.success('Question updated');
            } else {
                await axios.post(`${INTERVIEW_API_END_POINT}/question/create`, buildPayload(), { withCredentials: true });
                toast.success('Question added');
            }
            resetForm();
            loadQuestions();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save question');
        } finally {
            setSaving(false);
        }
    };

    const editQuestion = (question) => {
        setEditingId(question._id);
        setForm({
            companyId: question.company?._id || question.company || '',
            title: question.title || '',
            description: question.description || '',
            answer: question.answer || question.sampleAnswer || question.solutionCode || '',
            questionType: question.questionType || 'Subjective',
            category: question.category || 'Technical',
            difficulty: question.difficulty || 'Medium',
            role: question.role || '',
            tags: question.tags?.join(', ') || '',
            options: question.options?.join('\n') || '',
            correctOption: question.correctOption || 0,
            codeSnippet: question.codeSnippet || '',
            solutionCode: question.solutionCode || '',
            round: question.round || '',
            hiringUpdate: question.hiringUpdate || ''
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const deleteQuestion = async (id) => {
        if (!window.confirm('Delete this question?')) return;
        try {
            await axios.delete(`${INTERVIEW_API_END_POINT}/question/${id}`, { withCredentials: true });
            toast.success('Question deleted');
            loadQuestions();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete question');
        }
    };

    const uploadCsv = async () => {
        if (!bulkCsv.trim()) {
            toast.error('Choose a CSV file or paste CSV content');
            return;
        }
        const preview = validateCsvRows(bulkCsv);
        setCsvPreview(preview);
        if (preview.missingHeaders.length) {
            toast.error(`Missing required columns: ${preview.missingHeaders.join(', ')}`);
            return;
        }
        if (!preview.validRows.length) {
            toast.error('No valid rows to upload');
            return;
        }

        setBulkUploading(true);
        setUploadProgress(0);
        setUploadSummary(null);
        try {
            const uploadCompanyId = bulkCompanyId || filters.company || form.companyId;
            const totalChunks = Math.ceil(preview.validRows.length / csvChunkSize);
            const aggregate = {
                totalRows: preview.rows.length,
                uploaded: 0,
                failed: preview.errors.length,
                duplicatesSkipped: 0,
                failedRows: [...preview.errors],
                duplicateRows: [],
                companiesUpdated: 0
            };

            for (let index = 0; index < preview.validRows.length; index += csvChunkSize) {
                const chunkRows = preview.validRows.slice(index, index + csvChunkSize);
                const chunkCsv = rowsToCsv(preview.headers, chunkRows);
                const res = await postBulkUploadChunk({ csv: chunkCsv, companyId: uploadCompanyId });

                const summary = res.data.summary || {};
                aggregate.uploaded += res.data.totalUploaded || res.data.createdCount || summary.uploaded || 0;
                aggregate.duplicatesSkipped += res.data.duplicateSkipped || summary.duplicatesSkipped || 0;
                aggregate.failed += res.data.failedRows?.length || 0;
                aggregate.failedRows.push(...(res.data.failedRows || []));
                aggregate.duplicateRows.push(...(res.data.duplicateRows || []));
                aggregate.companiesUpdated += res.data.companiesUpdated || 0;
                setUploadProgress(Math.round(((Math.floor(index / csvChunkSize) + 1) / totalChunks) * 100));
            }

            setUploadSummary(aggregate);
            toast.success(`${aggregate.uploaded} uploaded, ${aggregate.duplicatesSkipped} duplicates skipped, ${aggregate.failed} failed`);
            loadQuestions();
        } catch (error) {
            toast.error(getApiErrorMessage(error, 'Bulk upload failed'));
            setUploadSummary((current) => current || {
                totalRows: preview.rows.length,
                uploaded: 0,
                failed: (error.response?.data?.failedRows?.length || preview.errors.length),
                duplicatesSkipped: 0,
                failedRows: error.response?.data?.failedRows?.length ? error.response.data.failedRows : preview.errors,
                duplicateRows: [],
                companiesUpdated: 0
            });
        } finally {
            setBulkUploading(false);
        }
    };

    const handleFile = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (!file.name.toLowerCase().endsWith('.csv') && !file.name.toLowerCase().endsWith('.txt')) {
            toast.error('Please upload a .csv file. Excel files must be exported as CSV first.');
            event.target.value = '';
            return;
        }
        const text = await file.text();
        setBulkCsv(text);
        setUploadSummary(null);
        setUploadProgress(0);
    };

    const generateAiQuestions = async () => {
        if (!form.companyId) {
            toast.error('Select company before AI generation');
            return;
        }
        setAiLoading(true);
        try {
            const res = await axios.post(`${INTERVIEW_API_END_POINT}/ai/generate-questions`, {
                companyId: form.companyId,
                companyName: selectedCompany?.name,
                role: form.role || 'Full Stack Developer',
                category: form.category,
                difficulty: form.difficulty,
                type: form.questionType,
                count: 5,
                save: true
            }, { withCredentials: true });
            toast.success(`${res.data.questions?.length || 0} AI questions generated`);
            loadQuestions();
        } catch (error) {
            toast.error(error.response?.data?.message || 'AI generation failed');
        } finally {
            setAiLoading(false);
        }
    };

    return (
        <div className={embedded ? "text-gray-950 dark:text-white" : "min-h-screen bg-gray-50 text-gray-950 dark:bg-zinc-950 dark:text-white"}>
            {!embedded && <Navbar />}
            <main className={embedded ? "mx-auto max-w-7xl" : "mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"}>
                <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="text-[11px] font-black uppercase tracking-[0.22em] text-indigo-500">Interview question bank</p>
                        <h1 className="text-3xl font-black tracking-tight">Question Management System</h1>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Admin and recruiter workflow for company, role, round, coding, and AI-assisted questions.</p>
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={generateAiQuestions} disabled={aiLoading} className="rounded-xl bg-indigo-600 text-white hover:bg-indigo-700">
                            {aiLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                            AI Generate
                        </Button>
                        <Button onClick={resetForm} variant="outline" className="rounded-xl">
                            <Plus className="mr-2 h-4 w-4" />
                            New
                        </Button>
                    </div>
                </div>

                <section className="mb-8 grid gap-6 xl:grid-cols-[420px_1fr]">
                    <form onSubmit={saveQuestion} className="rounded-2xl border border-border bg-white p-5 shadow-sm dark:bg-zinc-900">
                        <div className="mb-5 flex items-center justify-between">
                            <h2 className="text-lg font-black">{editingId ? 'Edit question' : 'Add question'}</h2>
                            {editingId && <Button type="button" variant="ghost" size="icon" onClick={resetForm}><X className="h-4 w-4" /></Button>}
                        </div>

                        <div className="grid gap-3">
                            <select value={form.companyId} onChange={(event) => updateForm('companyId', event.target.value)} className="h-11 rounded-xl border border-border bg-background px-3 text-sm">
                                <option value="">Select company</option>
                                {companies.map((company) => <option key={company._id} value={company._id}>{company.name}</option>)}
                            </select>
                            <Input value={form.title} onChange={(event) => updateForm('title', event.target.value)} placeholder="Question title" className="rounded-xl" />
                            <div contentEditable suppressContentEditableWarning onInput={(event) => updateForm('description', event.currentTarget.innerHTML)} className="min-h-24 rounded-xl border border-border bg-background p-3 text-sm outline-none" dangerouslySetInnerHTML={{ __html: form.description || 'Rich description...' }} />
                            <textarea value={form.answer} onChange={(event) => updateForm('answer', event.target.value)} placeholder="Answer / rubric / explanation" className="min-h-24 rounded-xl border border-border bg-background p-3 text-sm" />
                            <div className="grid gap-3 sm:grid-cols-2">
                                <select value={form.questionType} onChange={(event) => updateForm('questionType', event.target.value)} className="h-11 rounded-xl border border-border bg-background px-3 text-sm">
                                    {questionTypes.map((type) => <option key={type}>{type}</option>)}
                                </select>
                                <select value={form.difficulty} onChange={(event) => updateForm('difficulty', event.target.value)} className="h-11 rounded-xl border border-border bg-background px-3 text-sm">
                                    {difficulties.map((difficulty) => <option key={difficulty}>{difficulty}</option>)}
                                </select>
                                <select value={form.category} onChange={(event) => updateForm('category', event.target.value)} className="h-11 rounded-xl border border-border bg-background px-3 text-sm">
                                    {categories.map((category) => <option key={category}>{category}</option>)}
                                </select>
                                <select value={form.role} onChange={(event) => updateForm('role', event.target.value)} className="h-11 rounded-xl border border-border bg-background px-3 text-sm">
                                    <option value="">Any role</option>
                                    {roles.map((role) => <option key={role._id || role.name} value={role.name}>{role.name}</option>)}
                                </select>
                            </div>
                            <Input value={form.tags} onChange={(event) => updateForm('tags', event.target.value)} placeholder="Tags: DSA, API, SQL" className="rounded-xl" />
                            <Input value={form.round} onChange={(event) => updateForm('round', event.target.value)} placeholder="Interview round: OA, Technical, HR" className="rounded-xl" />
                            <textarea value={form.hiringUpdate} onChange={(event) => updateForm('hiringUpdate', event.target.value)} placeholder="Hiring update for recruiter panel" className="min-h-16 rounded-xl border border-border bg-background p-3 text-sm" />
                            {form.questionType === 'Objective' && (
                                <div className="grid gap-3">
                                    <textarea value={form.options} onChange={(event) => updateForm('options', event.target.value)} placeholder="MCQ options, one per line" className="min-h-24 rounded-xl border border-border bg-background p-3 text-sm" />
                                    <Input type="number" min="0" value={form.correctOption} onChange={(event) => updateForm('correctOption', event.target.value)} placeholder="Correct option index" className="rounded-xl" />
                                </div>
                            )}
                            {form.questionType === 'Coding' && (
                                <div className="grid gap-3">
                                    <textarea value={form.codeSnippet} onChange={(event) => updateForm('codeSnippet', event.target.value)} placeholder="Starter code" className="min-h-24 rounded-xl border border-border bg-zinc-950 p-3 font-mono text-sm text-emerald-300" />
                                    <textarea value={form.solutionCode} onChange={(event) => updateForm('solutionCode', event.target.value)} placeholder="Solution code" className="min-h-24 rounded-xl border border-border bg-zinc-950 p-3 font-mono text-sm text-amber-300" />
                                </div>
                            )}
                            <Button disabled={saving} className="rounded-xl bg-purple-600 text-white hover:bg-purple-700">
                                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                {editingId ? 'Update question' : 'Save question'}
                            </Button>
                        </div>
                    </form>

                    <div className="rounded-2xl border border-border bg-white p-5 shadow-sm dark:bg-zinc-900">
                        <div className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-widest text-gray-500">
                            <Filter className="h-4 w-4" />
                            Filters
                        </div>
                        <div className="grid gap-3 lg:grid-cols-3">
                            <div className="relative lg:col-span-2">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <Input value={filters.search} onChange={(event) => setFilters({ ...filters, search: event.target.value })} placeholder="Search title, description, tags..." className="rounded-xl pl-10" />
                            </div>
                            <select value={filters.company} onChange={(event) => setFilters({ ...filters, company: event.target.value })} className="h-11 rounded-xl border border-border bg-background px-3 text-sm">
                                <option value="">All companies</option>
                                {companies.map((company) => <option key={company._id} value={company._id}>{company.name}</option>)}
                            </select>
                            <select value={filters.role} onChange={(event) => setFilters({ ...filters, role: event.target.value })} className="h-11 rounded-xl border border-border bg-background px-3 text-sm">
                                <option value="">All roles</option>
                                {roles.map((role) => <option key={role._id || role.name} value={role.name}>{role.name}</option>)}
                            </select>
                            <select value={filters.type} onChange={(event) => setFilters({ ...filters, type: event.target.value })} className="h-11 rounded-xl border border-border bg-background px-3 text-sm">
                                <option value="">All types</option>
                                {questionTypes.map((type) => <option key={type}>{type}</option>)}
                            </select>
                            <select value={filters.difficulty} onChange={(event) => setFilters({ ...filters, difficulty: event.target.value })} className="h-11 rounded-xl border border-border bg-background px-3 text-sm">
                                <option value="">All difficulty</option>
                                {difficulties.map((difficulty) => <option key={difficulty}>{difficulty}</option>)}
                            </select>
                            <select value={filters.category} onChange={(event) => setFilters({ ...filters, category: event.target.value })} className="h-11 rounded-xl border border-border bg-background px-3 text-sm">
                                <option value="">All categories</option>
                                {categories.map((category) => <option key={category}>{category}</option>)}
                            </select>
                        </div>

                        <div className="mt-5 rounded-2xl bg-gray-50 p-4 dark:bg-zinc-950">
                            <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center gap-2 text-sm font-black">
                                    <FileUp className="h-4 w-4 text-indigo-500" />
                                    Bulk upload CSV
                                </div>
                                <Button type="button" variant="outline" onClick={() => setBulkCsv(sampleCsv)} className="h-9 rounded-xl text-xs font-bold">
                                    Use sample CSV
                                </Button>
                            </div>
                            <select
                                value={bulkCompanyId || filters.company || form.companyId}
                                onChange={(event) => setBulkCompanyId(event.target.value)}
                                className="mb-3 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm"
                            >
                                <option value="">Auto-detect company from CSV tags/title</option>
                                {companies.map((company) => <option key={company._id} value={company._id}>{company.name}</option>)}
                            </select>
                            <p className="mb-3 text-xs leading-5 text-gray-500 dark:text-gray-400">
                                Upload a CSV exported from Excel/Sheets. Required columns: title, description, answer, and type. Company is auto-detected from company, tags, title, or hiring update when a row does not specify one.
                            </p>
                            <input type="file" accept=".csv,.txt" onChange={handleFile} className="mb-3 text-sm" />
                            <textarea value={bulkCsv} onChange={(event) => setBulkCsv(event.target.value)} placeholder="title,description,answer,type,role,category,difficulty,tags,options,correctOption,round,hiringUpdate" className="min-h-20 w-full rounded-xl border border-border bg-background p-3 text-xs" />
                            {bulkCsv.trim() && (
                                <div className="mt-3 rounded-xl border border-border bg-background p-3">
                                    <div className="mb-3 grid gap-2 text-xs font-bold sm:grid-cols-4">
                                        <span>Total rows: {csvPreview.rows.length}</span>
                                        <span className="text-emerald-600 dark:text-emerald-400">Valid: {csvPreview.validRows.length}</span>
                                        <span className="text-rose-600 dark:text-rose-400">Failed: {csvPreview.errors.length}</span>
                                        <span>Chunks: {Math.max(Math.ceil(csvPreview.validRows.length / csvChunkSize), 0)}</span>
                                    </div>
                                    {!!csvPreview.rows.length && (
                                        <div className="max-h-44 overflow-auto rounded-lg border border-border">
                                            <table className="w-full text-left text-xs">
                                                <thead className="sticky top-0 bg-gray-100 dark:bg-zinc-900">
                                                    <tr>
                                                        {['Row', 'Title', 'Type', 'Company', 'Role', 'Difficulty'].map((heading) => (
                                                            <th key={heading} className="px-3 py-2 font-black">{heading}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {csvPreview.rows.slice(0, 25).map((row) => (
                                                        <tr key={row.row} className="border-t border-border">
                                                            <td className="px-3 py-2">{row.row}</td>
                                                            <td className="max-w-56 truncate px-3 py-2">{row.title}</td>
                                                            <td className="px-3 py-2">{row.type}</td>
                                                            <td className="px-3 py-2">{row.company}</td>
                                                            <td className="px-3 py-2">{row.role}</td>
                                                            <td className="px-3 py-2">{row.difficulty}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                    {!!csvPreview.errors.length && (
                                        <div className="mt-3 max-h-32 overflow-auto rounded-lg bg-rose-50 p-3 text-xs text-rose-700 dark:bg-rose-500/10 dark:text-rose-200">
                                            {csvPreview.errors.slice(0, 20).map((error) => (
                                                <p key={`${error.row}-${error.errors.join('|')}`}>Row {error.row}: {error.errors.join(', ')}</p>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                            {bulkUploading && (
                                <div className="mt-3">
                                    <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-zinc-800">
                                        <div className="h-full bg-indigo-600 transition-all" style={{ width: `${uploadProgress}%` }} />
                                    </div>
                                    <p className="mt-2 text-xs font-bold text-gray-500">{uploadProgress}% uploaded</p>
                                </div>
                            )}
                            {uploadSummary && (
                                <div className="mt-3 rounded-xl border border-border bg-background p-3 text-xs">
                                    <div className="grid gap-2 font-bold sm:grid-cols-4">
                                        <span>Total: {uploadSummary.totalRows}</span>
                                        <span className="text-emerald-600 dark:text-emerald-400">Uploaded: {uploadSummary.uploaded}</span>
                                        <span>Duplicates: {uploadSummary.duplicatesSkipped}</span>
                                        <span className="text-rose-600 dark:text-rose-400">Failed: {uploadSummary.failed}</span>
                                    </div>
                                    {!!uploadSummary.failedRows?.length && (
                                        <div className="mt-2 max-h-24 overflow-auto text-rose-600 dark:text-rose-300">
                                            {uploadSummary.failedRows.slice(0, 20).map((error, index) => (
                                                <p key={`${error.row}-${index}`}>Row {error.row}: {error.errors?.join(', ') || 'Failed'}</p>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                            <Button onClick={uploadCsv} type="button" variant="outline" disabled={bulkUploading || !csvPreview.validRows.length} className="mt-3 rounded-xl">
                                {bulkUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileUp className="mr-2 h-4 w-4" />}
                                Upload valid rows
                            </Button>
                        </div>

                        <div className="mt-5">
                            {loading ? <SkeletonRows /> : (
                                <div className="space-y-3">
                                    {questions.map((question) => (
                                        <article key={question._id} className="rounded-2xl border border-border p-4">
                                            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                                <div>
                                                    <div className="mb-2 flex flex-wrap gap-2 text-[11px] font-black uppercase tracking-widest">
                                                        <span className="rounded-lg bg-indigo-50 px-2 py-1 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-200">{question.questionType}</span>
                                                        <span className="rounded-lg bg-gray-100 px-2 py-1 dark:bg-zinc-800">{question.difficulty}</span>
                                                        {question.company?.name && <span className="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-2 py-1 dark:bg-zinc-800"><Building2 className="h-3 w-3" />{question.company.name}</span>}
                                                    </div>
                                                    <h3 className="font-black">{question.title}</h3>
                                                    <p className="mt-1 line-clamp-2 text-sm text-gray-500 dark:text-gray-400" dangerouslySetInnerHTML={{ __html: question.description || '' }} />
                                                    <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold text-gray-500">
                                                        {question.role && <span className="inline-flex items-center gap-1"><Briefcase className="h-3 w-3" />{question.role}</span>}
                                                        {question.category && <span className="inline-flex items-center gap-1"><Code2 className="h-3 w-3" />{question.category}</span>}
                                                        {question.tags?.slice(0, 4).map((tag) => <span key={tag} className="inline-flex items-center gap-1"><Tags className="h-3 w-3" />{tag}</span>)}
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button type="button" size="icon" variant="outline" className="rounded-xl" onClick={() => editQuestion(question)}><Pencil className="h-4 w-4" /></Button>
                                                    <Button type="button" size="icon" variant="outline" className="rounded-xl text-rose-500" onClick={() => deleteQuestion(question._id)}><Trash2 className="h-4 w-4" /></Button>
                                                </div>
                                            </div>
                                        </article>
                                    ))}
                                    {!questions.length && <div className="rounded-2xl border border-dashed border-border p-10 text-center text-gray-500">No questions found.</div>}
                                </div>
                            )}
                        </div>

                        <div className="mt-5 flex items-center justify-between">
                            <p className="text-sm text-gray-500">{pagination.total} questions</p>
                            <div className="flex items-center gap-2">
                                <Button type="button" variant="outline" size="icon" disabled={pagination.page <= 1} onClick={() => loadQuestions(pagination.page - 1)} className="rounded-xl"><ChevronLeft className="h-4 w-4" /></Button>
                                <span className="text-sm font-bold">Page {pagination.page} / {pagination.pages || 1}</span>
                                <Button type="button" variant="outline" size="icon" disabled={pagination.page >= pagination.pages} onClick={() => loadQuestions(pagination.page + 1)} className="rounded-xl"><ChevronRight className="h-4 w-4" /></Button>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="grid gap-4 md:grid-cols-3">
                    {[
                        ['AI answer checking', 'Use /ai/check-answer for score, feedback, weak topics, and sample answer comparison.', Bot],
                        ['Mock integration', 'Mock interviews already pull dynamically from /mock/start using company, role, category, and difficulty.', Sparkles],
                        ['Security', 'Mutation APIs require authenticated recruiter accounts and validate required fields server-side.', ShieldIcon]
                    ].map(([title, copy, Icon]) => {
                        const iconElement = React.createElement(Icon, { className: "mb-3 h-5 w-5 text-indigo-500" });
                        return (
                            <div key={title} className="rounded-2xl border border-border bg-white p-5 dark:bg-zinc-900">
                                {iconElement}
                                <h3 className="font-black">{title}</h3>
                                <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">{copy}</p>
                            </div>
                        );
                    })}
                </section>
            </main>
            {!embedded && <Footer />}
        </div>
    );
};

const ShieldIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
        <path d="m9 12 2 2 4-4" />
    </svg>
);

export default QuestionManagementSystem;
