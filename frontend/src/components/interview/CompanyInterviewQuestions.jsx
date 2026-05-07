import React, { useEffect, useMemo, useState } from 'react';
import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { INTERVIEW_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft,
    Briefcase,
    Building2,
    CheckCircle2,
    Code2,
    FileText,
    ListTodo,
    Search,
    Star,
    Target,
    Timer
} from 'lucide-react';

const typeMeta = {
    Subjective: { icon: FileText, label: 'Subjective', tone: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 dark:text-indigo-200' },
    Objective: { icon: ListTodo, label: 'Objective', tone: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-200' },
    Coding: { icon: Code2, label: 'Coding', tone: 'text-amber-600 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-200' }
};

const CompanyInterviewQuestions = () => {
    const { companyId } = useParams();
    const navigate = useNavigate();
    const [company, setCompany] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [activeType, setActiveType] = useState('All');
    const [activeRole, setActiveRole] = useState('All');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCompanyQuestions = async () => {
            const decodedCompanyId = decodeURIComponent(companyId);
            const [companyRes, questionRes] = await Promise.allSettled([
                axios.get(`${INTERVIEW_API_END_POINT}/company/get`, { withCredentials: true }),
                axios.get(`${INTERVIEW_API_END_POINT}/question/get/${companyId}`, { withCredentials: true })
            ]);
            const companies = companyRes.status === 'fulfilled' ? companyRes.value.data?.companies || [] : [];
            const selectedCompany = companies.find((item) => (
                item._id === companyId || item.name?.toLowerCase() === decodedCompanyId.toLowerCase()
            ));
            const loadedQuestions = questionRes.status === 'fulfilled' ? questionRes.value.data?.questions || [] : [];
            setCompany(selectedCompany || { name: decodedCompanyId });
            setQuestions(loadedQuestions);
            setLoading(false);
        };
        loadCompanyQuestions();
    }, [companyId]);

    const groupedCounts = useMemo(() => {
        return ['Subjective', 'Objective', 'Coding'].reduce((acc, type) => {
            acc[type] = questions.filter((question) => question.questionType === type).length;
            return acc;
        }, {});
    }, [questions]);

    const roleOptions = useMemo(() => {
        return ['All', ...new Set(questions.map((question) => question.role).filter(Boolean))];
    }, [questions]);

    const filteredQuestions = useMemo(() => {
        const term = search.toLowerCase();
        return questions.filter((question) => {
            const matchesType = activeType === 'All' || question.questionType === activeType;
            const matchesRole = activeRole === 'All' || question.role === activeRole;
            const matchesSearch = !term
                || question.title?.toLowerCase().includes(term)
                || question.category?.toLowerCase().includes(term)
                || question.role?.toLowerCase().includes(term)
                || question.tags?.some((tag) => tag.toLowerCase().includes(term));
            return matchesType && matchesRole && matchesSearch;
        });
    }, [questions, activeType, activeRole, search]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-zinc-950">
                <Navbar />
                <div className="flex min-h-[60vh] items-center justify-center">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 text-gray-950 dark:bg-zinc-950 dark:text-white">
            <Navbar />
            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <button
                    onClick={() => navigate('/interview/mock')}
                    className="mb-6 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-500 transition-colors hover:text-indigo-600"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to companies
                </button>

                <section className="mb-8 rounded-3xl border border-border bg-white p-6 shadow-sm dark:bg-zinc-900">
                    <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr] lg:items-center">
                        <div className="flex items-start gap-4">
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gray-50 p-3 dark:bg-zinc-800">
                                {company?.logo ? <img src={company.logo} alt={company.name} className="h-full w-full object-contain" /> : <Building2 className="text-gray-400" />}
                            </div>
                            <div>
                                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-indigo-500">Company interview questions</p>
                                <h1 className="mt-1 text-4xl font-black tracking-tight">{company?.name || 'Company'} preparation</h1>
                                <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold">
                                    <span className="rounded-full bg-gray-100 px-3 py-1 dark:bg-zinc-800">{company?.category || 'Interview prep'}</span>
                                    <span className="flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-amber-700 dark:bg-amber-500/10 dark:text-amber-200"><Star className="h-3 w-3 fill-current" />{company?.rating || '4.5'}</span>
                                    <span className="rounded-full bg-rose-50 px-3 py-1 text-rose-700 dark:bg-rose-500/10 dark:text-rose-200">{company?.difficulty || 'Mixed'} difficulty</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-3">
                            {['Subjective', 'Objective', 'Coding'].map((type) => {
                                const Icon = typeMeta[type].icon;
                                return (
                                    <div key={type} className="rounded-2xl bg-gray-50 p-4 dark:bg-zinc-950">
                                        <Icon className="mb-2 h-5 w-5 text-indigo-500" />
                                        <p className="text-sm text-gray-500">{type}</p>
                                        <p className="text-2xl font-black">{groupedCounts[type] || 0}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                <div className="mb-6 grid gap-3 xl:grid-cols-[1fr_280px_320px]">
                    <div className="flex gap-2 overflow-x-auto rounded-2xl border border-border bg-white p-2 dark:bg-zinc-900">
                        {['All', 'Subjective', 'Objective', 'Coding'].map((type) => (
                            <button
                                key={type}
                                onClick={() => setActiveType(type)}
                                className={`shrink-0 rounded-xl px-4 py-3 text-sm font-black uppercase tracking-wider ${activeType === type ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-800'}`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                    <select
                        value={activeRole}
                        onChange={(event) => setActiveRole(event.target.value)}
                        className="min-h-14 rounded-2xl border border-border bg-white px-4 text-sm font-bold text-gray-700 dark:bg-zinc-900 dark:text-gray-200"
                    >
                        {roleOptions.map((role) => <option key={role} value={role}>{role === 'All' ? 'All roles' : role}</option>)}
                    </select>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search questions..."
                            className="h-full min-h-14 rounded-2xl pl-11"
                        />
                    </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {filteredQuestions.map((question) => {
                        const meta = typeMeta[question.questionType] || typeMeta.Subjective;
                        const Icon = meta.icon;
                        return (
                            <article key={question._id || question.title} className="rounded-3xl border border-border bg-white p-5 shadow-sm dark:bg-zinc-900">
                                <div className="mb-4 flex items-start justify-between gap-3">
                                    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-black uppercase tracking-wider ${meta.tone}`}>
                                        <Icon className="h-3.5 w-3.5" />
                                        {meta.label}
                                    </span>
                                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-600 dark:bg-zinc-800 dark:text-gray-300">{question.difficulty || 'Medium'}</span>
                                </div>

                                <h2 className="text-xl font-black leading-tight">{question.title}</h2>
                                <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600 dark:text-gray-300">{question.description || question.explanation || question.tips || 'Practice this question with a structured interview answer.'}</p>

                                <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold">
                                    {question.category && <span className="inline-flex items-center gap-1 rounded-lg bg-gray-50 px-2.5 py-1 dark:bg-zinc-950"><Target className="h-3 w-3" />{question.category}</span>}
                                    {question.role && <span className="inline-flex items-center gap-1 rounded-lg bg-gray-50 px-2.5 py-1 dark:bg-zinc-950"><Briefcase className="h-3 w-3" />{question.role}</span>}
                                    {question.timeLimit && <span className="inline-flex items-center gap-1 rounded-lg bg-gray-50 px-2.5 py-1 dark:bg-zinc-950"><Timer className="h-3 w-3" />{question.timeLimit}s</span>}
                                </div>

                                {question.tags?.length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-1.5">
                                        {question.tags.slice(0, 4).map((tag) => (
                                            <span key={tag} className="rounded-md bg-indigo-50 px-2 py-1 text-[11px] font-bold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-200">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {question.questionType === 'Objective' && question.options?.length > 0 && (
                                    <div className="mt-5 space-y-2">
                                        {question.options.slice(0, 4).map((option, index) => (
                                            <div key={option} className="flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2 text-sm dark:bg-zinc-950">
                                                {index === question.correctOption ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <span className="h-4 w-4 rounded-full border border-gray-300 dark:border-zinc-700" />}
                                                {option}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {question.questionType === 'Coding' && (
                                    <pre className="mt-5 max-h-44 overflow-auto rounded-2xl bg-zinc-950 p-4 text-xs leading-5 text-emerald-300">{question.codeSnippet || '// Write your solution here'}</pre>
                                )}

                                {question.questionType === 'Subjective' && (question.sampleAnswer || question.tips) && (
                                    <div className="mt-5 rounded-2xl bg-indigo-50 p-4 text-sm leading-6 text-indigo-900 dark:bg-indigo-500/10 dark:text-indigo-100">
                                        {question.sampleAnswer || question.tips}
                                    </div>
                                )}
                            </article>
                        );
                    })}
                </div>

                {filteredQuestions.length === 0 && (
                    <div className="rounded-3xl border border-dashed border-border bg-white p-12 text-center dark:bg-zinc-900">
                        <h2 className="text-2xl font-black">No questions found</h2>
                        <p className="mt-2 text-gray-500">Try a different question type or search term.</p>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default CompanyInterviewQuestions;
