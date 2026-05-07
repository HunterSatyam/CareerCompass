import React, { useEffect, useMemo, useRef, useState } from 'react';
import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { INTERVIEW_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import html2pdf from 'html2pdf.js';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AddQuestionModal from './AddQuestionModal';
import {
    Activity,
    BarChart3,
    Bell,
    Bookmark,
    Bot,
    Briefcase,
    Building2,
    CalendarClock,
    CheckCircle2,
    Code2,
    Download,
    FileText,
    Filter,
    Gauge,
    History,
    LayoutDashboard,
    LineChart,
    Mic,
    Moon,
    Play,
    Plus,
    Search,
    Send,
    Sparkles,
    Star,
    Sun,
    Target,
    Timer,
    Trophy,
    Video
} from 'lucide-react';

const categories = ['Technical', 'HR', 'Behavioral', 'Aptitude', 'System Design', 'Communication'];
const difficulties = ['Easy', 'Medium', 'Hard'];
const questionTypes = ['MCQ', 'Subjective', 'Coding', 'Timed'];

const scoreColor = (score) => score >= 80 ? 'text-emerald-500' : score >= 65 ? 'text-amber-500' : 'text-rose-500';

const Card = ({ children, className = '' }) => (
    <div className={`rounded-2xl border border-border bg-white/82 dark:bg-zinc-900/82 shadow-sm backdrop-blur-xl ${className}`}>
        {children}
    </div>
);

const SectionTitle = ({ eyebrow, title, action }) => (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-indigo-500">{eyebrow}</p>
            <h2 className="text-2xl font-black tracking-tight text-gray-950 dark:text-white">{title}</h2>
        </div>
        {action}
    </div>
);

const BarChart = ({ data, valueKey = 'score' }) => (
    <div className="flex h-44 items-end gap-3 rounded-2xl bg-gray-50 p-4 dark:bg-zinc-950">
        {data?.map((item) => (
            <div key={item.label} className="flex flex-1 flex-col items-center gap-2">
                <div className="w-full rounded-t-xl bg-gradient-to-t from-indigo-600 to-cyan-400" style={{ height: `${Math.max(item[valueKey], 12)}%` }} />
                <span className="text-[10px] font-bold uppercase text-gray-500">{item.label}</span>
            </div>
        ))}
    </div>
);

const DonutChart = ({ data }) => {
    if (!data?.length) {
        return <div className="rounded-2xl bg-gray-50 p-6 text-sm text-gray-500 dark:bg-zinc-950">No category breakdown data yet.</div>;
    }
    const total = data.reduce((sum, item) => sum + item.value, 0);
    return (
        <div className="grid gap-4 sm:grid-cols-[160px_1fr] sm:items-center">
            <div className="relative mx-auto h-36 w-36 rounded-full bg-[conic-gradient(#4f46e5_0_35%,#06b6d4_35%_57%,#f59e0b_57%_82%,#10b981_82%_100%)]">
                <div className="absolute inset-5 rounded-full bg-white dark:bg-zinc-900" />
                <div className="absolute inset-0 flex items-center justify-center text-lg font-black">{total}</div>
            </div>
            <div className="space-y-2">
                {data?.map((item, index) => (
                    <div key={item.label} className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 text-gray-600 dark:text-gray-300"><span className={['bg-indigo-600', 'bg-cyan-500', 'bg-amber-500', 'bg-emerald-500'][index % 4] + ' h-2.5 w-2.5 rounded-full'} />{item.label}</span>
                        <span className="font-bold">{item.value}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const MockInterview = () => {
    const navigate = useNavigate();
    const [activeView, setActiveView] = useState('mock');
    const [companies, setCompanies] = useState([]);
    const [roles, setRoles] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [history, setHistory] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [experiences, setExperiences] = useState([]);
    const [resources, setResources] = useState([]);
    const [filters, setFilters] = useState({ search: '', company: '', role: '', category: 'Technical', difficulty: '', sort: 'recent' });
    const [form, setForm] = useState({ company: '', role: '', category: 'Technical', difficulty: 'Medium', numberOfQuestions: 5 });
    const [session, setSession] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(120);
    const [scorecard, setScorecard] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [code, setCode] = useState('function solution(input) {\n  // Write your answer\n  return input;\n}');
    const [codeReview, setCodeReview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isAddQuestionOpen, setIsAddQuestionOpen] = useState(false);
    const reportRef = useRef(null);
    const recognitionRef = useRef(null);

    useEffect(() => {
        const loadModule = async () => {
            const companyReq = axios.get(`${INTERVIEW_API_END_POINT}/company/get`, { withCredentials: true });
            const roleReq = axios.get(`${INTERVIEW_API_END_POINT}/roles`, { withCredentials: true });
            const questionReq = axios.get(`${INTERVIEW_API_END_POINT}/questions/all?limit=60`, { withCredentials: true });
            const experienceReq = axios.get(`${INTERVIEW_API_END_POINT}/experiences`, { withCredentials: true });
            const resourceReq = axios.get(`${INTERVIEW_API_END_POINT}/resources`, { withCredentials: true });
            const analyticsReq = axios.get(`${INTERVIEW_API_END_POINT}/analytics`, { withCredentials: true });
            const historyReq = axios.get(`${INTERVIEW_API_END_POINT}/history`, { withCredentials: true });

            const [companyRes, roleRes, questionRes, experienceRes, resourceRes, analyticsRes, historyRes] = await Promise.allSettled([companyReq, roleReq, questionReq, experienceReq, resourceReq, analyticsReq, historyReq]);
            if (companyRes.status === 'fulfilled' && companyRes.value.data?.companies?.length) setCompanies(companyRes.value.data.companies);
            if (roleRes.status === 'fulfilled' && roleRes.value.data?.roles?.length) setRoles(roleRes.value.data.roles);
            if (questionRes.status === 'fulfilled' && questionRes.value.data?.questions?.length) {
                setQuestions(questionRes.value.data.questions.map((q) => ({
                    title: q.title,
                    type: q.questionType,
                    category: q.category,
                    difficulty: q.difficulty,
                    company: q.company?.name,
                    role: q.role,
                    explanation: q.explanation || q.tips || q.sampleAnswer
                })));
            }
            if (experienceRes.status === 'fulfilled' && experienceRes.value.data?.experiences?.length) setExperiences(experienceRes.value.data.experiences);
            if (resourceRes.status === 'fulfilled' && resourceRes.value.data?.resources?.length) setResources(resourceRes.value.data.resources);
            if (analyticsRes.status === 'fulfilled') setAnalytics(analyticsRes.value.data?.analytics || null);
            if (historyRes.status === 'fulfilled' && historyRes.value.data?.sessions) setHistory(historyRes.value.data.sessions);
        };
        loadModule().catch(() => {});
    }, []);

    useEffect(() => {
        if (!session || scorecard) return;
        const timer = setInterval(() => setTimeLeft((value) => Math.max(value - 1, 0)), 1000);
        return () => clearInterval(timer);
    }, [session, scorecard]);

    const filteredQuestions = useMemo(() => questions.filter((question) => {
        const search = filters.search.toLowerCase();
        return (!search || question.title?.toLowerCase().includes(search))
            && (!filters.company || question.company === filters.company)
            && (!filters.role || question.role === filters.role)
            && (!filters.category || question.category === filters.category)
            && (!filters.difficulty || question.difficulty === filters.difficulty);
    }), [questions, filters]);

    const selectedCompany = companies.find((company) => company.name === form.company) || companies[0] || null;
    const selectedRole = roles.find((role) => role.name === form.role) || roles[0] || null;
    const currentQuestion = session?.questions?.[currentIndex];

    const startInterview = async () => {
        setLoading(true);
        setScorecard(null);
        setCurrentIndex(0);
        setAnswers([]);
        setTimeLeft(120);
        try {
            const res = await axios.post(`${INTERVIEW_API_END_POINT}/mock/start`, form, { withCredentials: true });
            setSession(res.data.session || { questions: res.data.questions });
            toast.success('Mock interview started');
        } catch (error) {
            toast.error(error.response?.data?.message || 'No real interview questions found for these filters');
        } finally {
            setLoading(false);
        }
    };

    const updateAnswer = (value) => {
        const next = [...answers];
        next[currentIndex] = { ...(next[currentIndex] || {}), question: currentQuestion, answerText: value, timeSpent: 120 - timeLeft };
        setAnswers(next);
    };

    const nextQuestion = () => {
        if (currentIndex < session.questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setTimeLeft(120);
        } else {
            submitInterview();
        }
    };

    const submitInterview = async () => {
        setLoading(true);
        const payload = { sessionId: session?._id, answers, duration: answers.reduce((sum, item) => sum + (item?.timeSpent || 0), 0) };
        try {
            const res = await axios.post(`${INTERVIEW_API_END_POINT}/mock/evaluate`, payload, { withCredentials: true });
            setScorecard(res.data.scorecard);
            setHistory((items) => [res.data.session, ...items].filter(Boolean));
            toast.success('AI feedback generated');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to evaluate interview');
        } finally {
            setLoading(false);
        }
    };

    const startVoiceInput = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            toast.error('Voice-to-text is not supported in this browser');
            return;
        }
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        recognition.onresult = (event) => {
            const transcript = Array.from(event.results).map((result) => result[0].transcript).join(' ');
            updateAnswer(transcript);
        };
        recognition.onend = () => setIsRecording(false);
        recognition.start();
        recognitionRef.current = recognition;
        setIsRecording(true);
    };

    const stopVoiceInput = () => {
        recognitionRef.current?.stop();
        setIsRecording(false);
    };

    const downloadReport = () => {
        if (!reportRef.current) return;
        html2pdf().set({ margin: 0.4, filename: 'ai-mock-interview-scorecard.pdf', html2canvas: { scale: 2 }, jsPDF: { unit: 'in', format: 'a4' } }).from(reportRef.current).save();
    };

    const runCodeReview = async () => {
        try {
            const res = await axios.post(`${INTERVIEW_API_END_POINT}/code-review`, { code, language: 'JavaScript' }, { withCredentials: true });
            setCodeReview(res.data.review);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to review code');
        }
    };

    const navItems = [
        ['mock', Sparkles, 'Mock'],
        ['companies', Building2, 'Companies'],
        ['roles', Briefcase, 'Roles'],
        ['categories', Filter, 'Categories'],
        ['dashboard', LayoutDashboard, 'Dashboard'],
        ['coding', Code2, 'Coding']
    ];

    const handleQuestionAdded = (question) => {
        const companyName = question.companyName || question.company?.name || companies.find((company) => company._id === question.companyId)?.name;
        setQuestions((items) => [
            {
                title: question.title,
                type: question.questionType || question.type,
                category: question.category,
                difficulty: question.difficulty,
                company: companyName,
                role: question.role,
                explanation: question.explanation || question.sampleAnswer || question.solutionCode || question.tips || question.description
            },
            ...items
        ]);
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-950 transition-colors dark:bg-zinc-950 dark:text-white">
            <Navbar />
            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <section className="mb-8 overflow-hidden rounded-[2rem] border border-border bg-white dark:bg-zinc-900">
                    <div className="grid gap-8 p-6 lg:grid-cols-[1.15fr_0.85fr] lg:p-10">
                        <div className="flex flex-col justify-center">
                            <div className="mb-5 flex flex-wrap gap-2">
                                {['AI Feedback', 'Voice-to-text', 'PDF Reports', 'Role Based'].map((tag) => (
                                    <span key={tag} className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-200">{tag}</span>
                                ))}
                            </div>
                            <h1 className="max-w-3xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                                AI Mock Interview & Preparation Hub
                            </h1>
                            <p className="mt-5 max-w-2xl text-base leading-7 text-gray-600 dark:text-gray-300">
                                Practice company rounds, role roadmaps, timed questions, coding interviews, resume-ready feedback, and analytics from one responsive preparation workspace.
                            </p>
                            <div className="mt-7 flex flex-wrap gap-3">
                                <Button onClick={() => setActiveView('mock')} className="rounded-xl bg-indigo-600 px-5 py-6 font-bold text-white hover:bg-indigo-700"><Play className="mr-2 h-4 w-4" />Start Mock Interview</Button>
                                <Button onClick={() => setActiveView('dashboard')} variant="outline" className="rounded-xl px-5 py-6 font-bold"><BarChart3 className="mr-2 h-4 w-4" />View Analytics</Button>
                            </div>
                        </div>
                        <Card className="p-5">
                            {analytics ? (
                                <>
                                    <div className="mb-5 flex items-center justify-between">
                                        <div>
                                            <p className="text-xs font-black uppercase tracking-widest text-gray-500">Readiness Score</p>
                                            <p className={`text-5xl font-black ${scoreColor(analytics.accuracyPercentage)}`}>{analytics.accuracyPercentage}%</p>
                                        </div>
                                        <div className="rounded-2xl bg-amber-50 p-4 text-amber-600 dark:bg-amber-500/10"><Trophy /></div>
                                    </div>
                                    <BarChart data={analytics.chartData?.weeklyScores || []} />
                                    <div className="mt-4 grid grid-cols-3 gap-3">
                                        <div className="rounded-xl bg-gray-50 p-3 dark:bg-zinc-950"><p className="text-xs text-gray-500">Streak</p><p className="font-black">{analytics.streak} days</p></div>
                                        <div className="rounded-xl bg-gray-50 p-3 dark:bg-zinc-950"><p className="text-xs text-gray-500">Minutes</p><p className="font-black">{analytics.totalPracticeMinutes}</p></div>
                                        <div className="rounded-xl bg-gray-50 p-3 dark:bg-zinc-950"><p className="text-xs text-gray-500">Badges</p><p className="font-black">{analytics.badges?.length || 0}</p></div>
                                    </div>
                                </>
                            ) : (
                                <div className="flex min-h-80 flex-col items-center justify-center text-center">
                                    <Trophy className="mb-4 h-12 w-12 text-gray-400" />
                                    <h3 className="text-xl font-black">No interview analytics yet</h3>
                                    <p className="mt-2 text-sm text-gray-500">Complete a real mock interview to generate performance data.</p>
                                </div>
                            )}
                        </Card>
                    </div>
                </section>

                <div className="mb-8 flex gap-2 overflow-x-auto rounded-2xl border border-border bg-white p-2 dark:bg-zinc-900">
                    {navItems.map(([id, Icon, label]) => (
                        <button key={id} onClick={() => setActiveView(id)} className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-3 text-sm font-black uppercase tracking-wider ${activeView === id ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-800'}`}>
                            <Icon className="h-4 w-4" />{label}
                        </button>
                    ))}
                </div>

                <div className="mb-6 flex justify-end">
                    <Button onClick={() => setIsAddQuestionOpen(true)} className="rounded-xl bg-indigo-600 text-white hover:bg-indigo-700">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Question
                    </Button>
                </div>

                {activeView === 'mock' && (
                    <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
                        <Card className="p-6">
                            <SectionTitle eyebrow="Interview setup" title="Generate a timed AI session" />
                            <div className="space-y-4">
                                <select className="h-12 w-full rounded-xl border border-border bg-background px-3" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })}><option value="">Select company</option>{companies.map((c) => <option key={c.name}>{c.name}</option>)}</select>
                                <select className="h-12 w-full rounded-xl border border-border bg-background px-3" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}><option value="">Select role</option>{roles.map((r) => <option key={r.name}>{r.name}</option>)}</select>
                                <select className="h-12 w-full rounded-xl border border-border bg-background px-3" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>{categories.map((c) => <option key={c}>{c}</option>)}</select>
                                <div className="grid grid-cols-2 gap-3">
                                    <select className="h-12 rounded-xl border border-border bg-background px-3" value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })}>{difficulties.map((d) => <option key={d}>{d}</option>)}</select>
                                    <Input type="number" min="1" max="15" value={form.numberOfQuestions} onChange={(e) => setForm({ ...form, numberOfQuestions: Number(e.target.value) })} className="h-12 rounded-xl" />
                                </div>
                                <Button disabled={loading} onClick={startInterview} className="h-12 w-full rounded-xl bg-indigo-600 font-bold text-white hover:bg-indigo-700"><Sparkles className="mr-2 h-4 w-4" />Start Mock Interview</Button>
                            </div>
                        </Card>

                        <Card className="p-6">
                            {!session ? (
                                <div className="flex min-h-[430px] flex-col items-center justify-center text-center">
                                    <Bot className="mb-4 h-14 w-14 text-indigo-500" />
                                    <h3 className="text-2xl font-black">Your AI interviewer is ready</h3>
                                    <p className="mt-2 max-w-md text-gray-500">Choose a company, role, category, difficulty, and question count to begin a realistic interview session.</p>
                                </div>
                            ) : scorecard ? (
                                <div ref={reportRef} className="space-y-5 bg-white p-2 text-gray-950 dark:bg-zinc-900 dark:text-white">
                                    <div className="flex items-center justify-between gap-4">
                                        <div><p className="text-xs font-black uppercase tracking-widest text-indigo-500">Final Scorecard</p><h3 className="text-3xl font-black">{scorecard.finalScore}/100</h3></div>
                                        <Button onClick={downloadReport} className="rounded-xl bg-gray-950 text-white dark:bg-white dark:text-gray-950"><Download className="mr-2 h-4 w-4" />PDF</Button>
                                    </div>
                                    <div className="grid gap-3 sm:grid-cols-4">
                                        {['confidenceScore', 'communicationScore', 'technicalAccuracy', 'grammarScore'].map((key) => (
                                            <div key={key} className="rounded-xl border border-border p-4">
                                                <p className="text-xs capitalize text-gray-500">{key.replace(/([A-Z])/g, ' $1')}</p>
                                                <p className={`text-2xl font-black ${scoreColor(scorecard[key])}`}>{scorecard[key]}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="rounded-xl bg-gray-50 p-4 text-sm leading-6 dark:bg-zinc-950">{scorecard.summary}</p>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div><h4 className="mb-2 font-black">Weak Topics</h4>{scorecard.weakTopics?.map((item) => <p key={item} className="mb-2 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-200">{item}</p>)}</div>
                                        <div><h4 className="mb-2 font-black">Recommendations</h4>{scorecard.recommendations?.map((item) => <p key={item} className="mb-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200">{item}</p>)}</div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-5">
                                    <div className="flex items-center justify-between">
                                        <div><p className="text-xs font-black uppercase tracking-widest text-gray-500">Question {currentIndex + 1} of {session.questions.length}</p><h3 className="mt-1 text-xl font-black">{currentQuestion}</h3></div>
                                        <div className={`flex items-center gap-2 rounded-xl px-3 py-2 font-black ${timeLeft < 20 ? 'bg-rose-50 text-rose-600 dark:bg-rose-500/10' : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10'}`}><Timer className="h-4 w-4" />{timeLeft}s</div>
                                    </div>
                                    <textarea value={answers[currentIndex]?.answerText || ''} onChange={(e) => updateAnswer(e.target.value)} className="min-h-56 w-full rounded-2xl border border-border bg-background p-4 leading-7" placeholder="Type your answer or use voice-to-text..." />
                                    <div className="flex flex-wrap gap-3">
                                        <Button type="button" variant="outline" onClick={isRecording ? stopVoiceInput : startVoiceInput} className="rounded-xl font-bold"><Mic className="mr-2 h-4 w-4" />{isRecording ? 'Stop Recording' : 'Record Answer'}</Button>
                                        <Button type="button" onClick={nextQuestion} className="rounded-xl bg-indigo-600 font-bold text-white hover:bg-indigo-700"><Send className="mr-2 h-4 w-4" />{currentIndex === session.questions.length - 1 ? 'Generate Feedback' : 'Next Question'}</Button>
                                    </div>
                                </div>
                            )}
                        </Card>
                    </div>
                )}

                {activeView === 'companies' && (
                    <div>
                        <SectionTitle eyebrow="Company preparation" title="Company-based interview system" action={<Input placeholder="Search companies..." className="max-w-xs rounded-xl" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />} />
                        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                            {companies.filter((company) => company.name.toLowerCase().includes(filters.search.toLowerCase())).map((company) => (
                                <button
                                    key={company._id || company.name}
                                    type="button"
                                    onClick={() => navigate(`/interview/company/${company._id || encodeURIComponent(company.name)}`)}
                                    className="block text-left"
                                >
                                <Card className="h-full p-5 transition-all hover:-translate-y-1 hover:border-indigo-400 hover:shadow-md focus-within:border-indigo-500">
                                    <div className="mb-5 flex items-start justify-between">
                                        <div className="flex items-center gap-3"><img src={company.logo} alt={company.name} className="h-12 w-12 rounded-xl bg-gray-50 p-2 dark:bg-zinc-800" /><div><h3 className="text-xl font-black">{company.name}</h3><p className="text-xs font-bold uppercase text-gray-500">{company.category}</p></div></div>
                                        <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-xs font-bold text-amber-700 dark:bg-amber-500/10 dark:text-amber-300"><Star className="h-3 w-3 fill-current" />{company.rating}</span>
                                    </div>
                                    <div className="mb-5 grid grid-cols-2 gap-3 text-sm">
                                        <div className="rounded-xl bg-gray-50 p-3 dark:bg-zinc-950"><p className="text-gray-500">Package</p><p className="font-bold">{company.packageRange}</p></div>
                                        <div className="rounded-xl bg-gray-50 p-3 dark:bg-zinc-950"><p className="text-gray-500">Difficulty</p><p className={`font-bold ${company.difficulty === 'Hard' ? 'text-rose-500' : 'text-amber-500'}`}>{company.difficulty}</p></div>
                                    </div>
                                    <p className="mb-3 text-sm font-black uppercase tracking-widest text-gray-500">Rounds</p>
                                    <div className="mb-4 flex flex-wrap gap-2">{(company.interviewRounds || company.hiringProcess || []).map((round) => <span key={round} className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-200">{round}</span>)}</div>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">Locations: {(company.jobLocations || []).join(', ') || 'Multiple locations'}</p>
                                </Card>
                                </button>
                            ))}
                        </div>
                        <SectionTitle eyebrow="Experiences" title="Latest interview experiences" action={<Button className="rounded-xl bg-indigo-600 text-white"><Plus className="mr-2 h-4 w-4" />Add Experience</Button>} />
                        <div className="grid gap-4 md:grid-cols-2">{experiences.map((item) => <Card key={item.title} className="p-5"><div className="mb-2 flex items-center justify-between"><h3 className="font-black">{item.title}</h3><span className="text-xs font-bold text-gray-500">{item.difficulty}</span></div><p className="mb-3 text-sm text-gray-500">{item.companyName || item.company?.name} - {item.role}</p><p className="text-sm leading-6 text-gray-600 dark:text-gray-300">{item.content}</p><div className="mt-4 flex gap-4 text-xs font-bold text-gray-500"><span>{item.likes || 0} likes</span><span>{item.dislikes || 0} dislikes</span><span>{item.comments?.length || 0} comments</span></div></Card>)}</div>
                    </div>
                )}

                {activeView === 'roles' && (
                    <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
                        <Card className="p-5">
                            {selectedRole ? (
                                <><SectionTitle eyebrow="Selected role" title={selectedRole.name} /><div className="space-y-4">{['requiredSkills', 'roadmap', 'commonTools'].map((key) => <div key={key}><h4 className="mb-2 text-sm font-black uppercase tracking-widest text-gray-500">{key.replace(/([A-Z])/g, ' $1')}</h4><div className="flex flex-wrap gap-2">{selectedRole[key]?.map((item) => <span key={item} className="rounded-lg bg-gray-100 px-3 py-1 text-sm font-bold dark:bg-zinc-800">{item}</span>)}</div></div>)}</div></>
                            ) : (
                                <div className="flex min-h-64 flex-col items-center justify-center text-center">
                                    <Briefcase className="mb-4 h-10 w-10 text-gray-400" />
                                    <h3 className="text-xl font-black">No roles available</h3>
                                    <p className="mt-2 text-sm text-gray-500">Add real roles from the backend before using role-based preparation.</p>
                                </div>
                            )}
                        </Card>
                        <div className="grid gap-4 md:grid-cols-2">{roles.map((role) => (
                            <button
                                key={role.name}
                                type="button"
                                onClick={() => navigate(`/interview/role/${encodeURIComponent(role.name)}`)}
                                className="block text-left"
                            >
                                <Card className="h-full p-5 transition-all hover:-translate-y-1 hover:border-indigo-400 hover:shadow-md">
                                    <Briefcase className="mb-3 text-indigo-500" />
                                    <h3 className="text-lg font-black">{role.name}</h3>
                                    <p className="mt-2 text-sm text-gray-500">{role.summary || 'Role roadmap with questions, tools, coding challenges, quizzes, and AI practice.'}</p>
                                    <div className="mt-4 space-y-2">{role.commonQuestions?.slice(0, 3).map((q) => <p key={q} className="rounded-lg bg-gray-50 p-2 text-sm dark:bg-zinc-950">{q}</p>)}</div>
                                </Card>
                            </button>
                        ))}</div>
                    </div>
                )}

                {activeView === 'categories' && (
                    <div>
                        <SectionTitle eyebrow="Question bank" title="Category tabs with advanced filters" />
                        <Card className="mb-5 p-4">
                            <div className="grid gap-3 md:grid-cols-5">
                                <Input placeholder="Search questions..." value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} className="rounded-xl md:col-span-2" />
                                <select className="h-10 rounded-xl border border-border bg-background px-3" value={filters.company} onChange={(e) => setFilters({ ...filters, company: e.target.value })}><option value="">All companies</option>{companies.map((c) => <option key={c.name}>{c.name}</option>)}</select>
                                <select className="h-10 rounded-xl border border-border bg-background px-3" value={filters.role} onChange={(e) => setFilters({ ...filters, role: e.target.value })}><option value="">All roles</option>{roles.map((r) => <option key={r.name}>{r.name}</option>)}</select>
                                <select className="h-10 rounded-xl border border-border bg-background px-3" value={filters.difficulty} onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}><option value="">All difficulty</option>{difficulties.map((d) => <option key={d}>{d}</option>)}</select>
                            </div>
                        </Card>
                        <div className="mb-5 flex gap-2 overflow-x-auto">{categories.map((category) => <button key={category} onClick={() => setFilters({ ...filters, category })} className={`rounded-xl px-4 py-2 text-sm font-black ${filters.category === category ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 dark:bg-zinc-900 dark:text-gray-300'}`}>{category}</button>)}</div>
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{filteredQuestions.map((question) => <Card key={question.title} className="p-5"><div className="mb-3 flex items-center justify-between"><span className="rounded-lg bg-gray-100 px-2 py-1 text-xs font-bold dark:bg-zinc-800">{question.type}</span><Bookmark className="h-4 w-4 text-gray-400" /></div><h3 className="font-black">{question.title}</h3><p className="mt-2 text-sm text-gray-500">{question.company} - {question.role}</p><p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">{question.explanation}</p><div className="mt-4 flex gap-2">{questionTypes.slice(0, 3).map((type) => <span key={type} className="rounded-lg bg-indigo-50 px-2 py-1 text-[10px] font-bold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-200">{type}</span>)}</div></Card>)}</div>
                    </div>
                )}

                {activeView === 'dashboard' && (
                    analytics ? (
                        <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
                            <Card className="p-6"><SectionTitle eyebrow="Analytics" title="Interview performance tracking" /><BarChart data={analytics.chartData?.weeklyScores || []} /><div className="mt-5 grid gap-3 sm:grid-cols-3"><div className="rounded-xl bg-gray-50 p-4 dark:bg-zinc-950"><Gauge className="mb-2 text-indigo-500" /><p className="text-sm text-gray-500">Accuracy</p><p className="text-2xl font-black">{analytics.accuracyPercentage}%</p></div><div className="rounded-xl bg-gray-50 p-4 dark:bg-zinc-950"><CalendarClock className="mb-2 text-cyan-500" /><p className="text-sm text-gray-500">Practice time</p><p className="text-2xl font-black">{analytics.totalPracticeMinutes}m</p></div><div className="rounded-xl bg-gray-50 p-4 dark:bg-zinc-950"><Activity className="mb-2 text-emerald-500" /><p className="text-sm text-gray-500">Streak</p><p className="text-2xl font-black">{analytics.streak}</p></div></div></Card>
                            <Card className="p-6"><SectionTitle eyebrow="Breakdown" title="Category mix" /><DonutChart data={analytics.chartData?.categoryBreakdown || []} /></Card>
                            <Card className="p-6"><SectionTitle eyebrow="Recommendations" title="Weak topic analysis" />{analytics.weakTopics?.length ? analytics.weakTopics.map((item) => <div key={item.topic} className="mb-4"><div className="mb-1 flex justify-between text-sm font-bold"><span>{item.topic}</span><span>{item.score}%</span></div><div className="h-2 rounded-full bg-gray-100 dark:bg-zinc-800"><div className="h-2 rounded-full bg-rose-500" style={{ width: `${item.score}%` }} /></div></div>) : <p className="text-sm text-gray-500">No weak-topic data yet.</p>}</Card>
                            <Card className="p-6"><SectionTitle eyebrow="Today" title="Daily challenge" />{analytics.dailyChallenge?.question ? <p className="rounded-xl bg-indigo-50 p-4 font-bold text-indigo-800 dark:bg-indigo-500/10 dark:text-indigo-100">{analytics.dailyChallenge.question}</p> : <p className="text-sm text-gray-500">No daily challenge assigned from real data.</p>}<div className="mt-4 flex flex-wrap gap-2">{analytics.badges?.map((badge) => <span key={badge} className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 dark:bg-amber-500/10 dark:text-amber-200">{badge}</span>)}</div></Card>
                        </div>
                    ) : (
                        <Card className="p-10 text-center"><Gauge className="mx-auto mb-4 h-12 w-12 text-gray-400" /><h3 className="text-2xl font-black">No real analytics yet</h3><p className="mt-2 text-gray-500">Analytics will appear after users complete real mock interviews.</p></Card>
                    )
                )}

                {activeView === 'coding' && (
                    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                        <Card className="p-5"><SectionTitle eyebrow="Coding interview" title="Editor, test cases, AI review" action={<select className="rounded-xl border border-border bg-background px-3 py-2"><option>JavaScript</option><option>Python</option><option>Java</option><option>C++</option></select>} /><textarea value={code} onChange={(e) => setCode(e.target.value)} className="min-h-80 w-full rounded-2xl bg-zinc-950 p-4 font-mono text-sm text-emerald-300" /><Button onClick={runCodeReview} className="mt-4 rounded-xl bg-indigo-600 text-white"><Bot className="mr-2 h-4 w-4" />AI Code Review</Button></Card>
                        <Card className="p-5"><SectionTitle eyebrow="Review" title="Complexity analysis" />{codeReview ? <div className="space-y-4"><p className={`text-4xl font-black ${scoreColor(codeReview.score)}`}>{codeReview.score}/100</p><p className="rounded-xl bg-gray-50 p-3 text-sm dark:bg-zinc-950">{codeReview.complexity}</p>{codeReview.issues?.map((issue) => <p key={issue} className="flex gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-amber-500" />{issue}</p>)}<p className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200">{codeReview.suggestion}</p></div> : <p className="text-gray-500">Run AI review to get code quality, complexity, and improvement suggestions.</p>}</Card>
                    </div>
                )}

                <section className="mt-8 grid gap-5 lg:grid-cols-3">
                    <Card className="p-5"><Bot className="mb-3 text-indigo-500" /><h3 className="font-black">AI Assistant</h3><p className="mt-2 text-sm text-gray-500">Question generation, answer evaluation, resume scoring, weak-topic prediction, and personalized roadmaps are exposed through backend hooks.</p></Card>
                    <Card className="p-5"><Bell className="mb-3 text-amber-500" /><h3 className="font-black">Smart Notifications</h3><p className="mt-2 text-sm text-gray-500">Practice reminders, company hiring alerts, daily challenges, and streak prompts are ready for scheduler integration.</p></Card>
                    <Card className="p-5"><LineChart className="mb-3 text-emerald-500" /><h3 className="font-black">Resources</h3><div className="mt-3 space-y-2">{resources.length ? resources.map((resource) => <a key={resource._id || resource.title} href={resource.url} className="flex items-center gap-2 rounded-lg bg-gray-50 p-2 text-sm font-bold dark:bg-zinc-950"><FileText className="h-4 w-4" />{resource.title}</a>) : <p className="text-sm text-gray-500">No real resources added yet.</p>}</div></Card>
                </section>
            </main>
            <AddQuestionModal
                open={isAddQuestionOpen}
                onClose={() => setIsAddQuestionOpen(false)}
                companies={companies}
                roles={roles}
                defaults={{ companyId: selectedCompany?._id || '', role: selectedRole?.name || '', category: filters.category || form.category }}
                onQuestionAdded={handleQuestionAdded}
            />
            <Footer />
        </div>
    );
};

export default MockInterview;
