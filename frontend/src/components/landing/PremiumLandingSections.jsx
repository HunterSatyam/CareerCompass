import React from 'react';
import * as Motion from 'framer-motion';
import {
    ArrowRight,
    BarChart3,
    Bot,
    BrainCircuit,
    CheckCircle2,
    Code2,
    FileCheck2,
    Gauge,
    LineChart,
    Map,
    MessageSquareText,
    Mic,
    Play,
    Rocket,
    Sparkles,
    Star,
    Trophy,
    Users,
    WandSparkles
} from 'lucide-react';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';

const reveal = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 }
};

const SectionHeader = ({ eyebrow, title, copy }) => (
    <Motion.motion.div
        variants={reveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.55 }}
        className="mx-auto mb-10 max-w-3xl text-center"
    >
        <p className="text-[11px] font-black uppercase tracking-[0.24em] text-indigo-500">{eyebrow}</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-gray-950 dark:text-white sm:text-5xl">{title}</h2>
        {copy && <p className="mt-4 text-base leading-7 text-gray-600 dark:text-zinc-400">{copy}</p>}
    </Motion.motion.div>
);

const GlassCard = ({ children, className = '', onClick }) => (
    <Motion.motion.div
        variants={reveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.55 }}
        whileHover={{ y: -6 }}
        onClick={onClick}
        onKeyDown={(event) => {
            if (onClick && (event.key === 'Enter' || event.key === ' ')) onClick(event);
        }}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        className={`group relative overflow-hidden rounded-3xl border border-white/70 bg-white/75 shadow-xl shadow-indigo-500/6 backdrop-blur-xl transition-all dark:border-white/10 dark:bg-white/7 ${className}`}
    >
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-400 to-transparent" />
            <div className="absolute -inset-20 bg-[radial-gradient(circle_at_var(--x,50%)_var(--y,50%),rgba(99,102,241,0.18),transparent_28%)]" />
        </div>
        <div className="relative">{children}</div>
    </Motion.motion.div>
);

const aiFeatures = [
    { title: 'AI Resume Builder', copy: 'Build role-targeted resumes with bullet rewrites, impact scoring, and ATS-aware formatting.', icon: WandSparkles, path: '/resume/builder' },
    { title: 'AI Mock Interviews', copy: 'Practice company-specific interviews with voice answers, scorecards, and next-step coaching.', icon: Mic, path: '/interview/mock' },
    { title: 'AI Career Roadmap', copy: 'Generate a weekly roadmap based on your target role, current skills, and hiring trends.', icon: Map, path: '/interview/mock' },
    { title: 'AI ATS Checker', copy: 'Scan resumes against job descriptions and fix missing keywords before applying.', icon: FileCheck2, path: '/resume/ats' },
    { title: 'AI Skill Analyzer', copy: 'Map weak skills to projects, certifications, and practice challenges.', icon: BrainCircuit, path: '/profile' },
    { title: 'AI Feedback Loop', copy: 'Convert applications, interviews, and outcomes into personalized recommendations.', icon: Bot, path: '/interview/mock' }
];

const opportunities = [
    ['Microsoft', 'Frontend Internship', '12 new roles', 'Bengaluru'],
    ['Google', 'SWE Mock Interview', 'Hard DSA', 'Remote'],
    ['Amazon', 'Backend Developer', 'OA active', 'Hyderabad'],
    ['Adobe', 'Design Challenge', 'Portfolio round', 'Noida']
];

const roadmaps = [
    ['Frontend Pro', 82, 'React, UI systems, testing'],
    ['Backend Scale', 68, 'APIs, queues, caching'],
    ['Data Analyst', 74, 'SQL, dashboards, statistics']
];

const PremiumLandingSections = () => {
    const navigate = useNavigate();

    return (
        <div className="relative overflow-hidden bg-white text-gray-950 dark:bg-[#09090B] dark:text-white">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(99,102,241,0.05),transparent)]" />
                <div className="noise-layer absolute inset-0 opacity-[0.06]" />
            </div>

            <section className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
                <SectionHeader
                    eyebrow="Live opportunity intelligence"
                    title="A career cockpit that updates as fast as hiring moves"
                    copy="Track hiring signals, trending events, interview rounds, applications, and AI recommendations from one responsive command center."
                />

                <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
                    <GlassCard className="p-5">
                        <div className="mb-5 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-black">Trending opportunities</p>
                                <p className="text-xs text-gray-500 dark:text-zinc-400">Live hiring ticker and smart matching</p>
                            </div>
                            <Button variant="outline" className="rounded-2xl" onClick={() => navigate('/events')}>View all</Button>
                        </div>
                        <div className="space-y-3">
                            {opportunities.map(([company, title, signal, location]) => (
                                <div key={title} className="flex items-center justify-between rounded-2xl border border-border bg-white/65 p-4 dark:bg-black/20">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-200">
                                            {company.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-black">{title}</p>
                                            <p className="text-xs font-bold text-gray-500 dark:text-zinc-400">{company} • {location}</p>
                                        </div>
                                    </div>
                                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">{signal}</span>
                                </div>
                            ))}
                        </div>
                    </GlassCard>

                    <GlassCard className="p-5">
                        <div className="mb-5 flex items-center justify-between">
                            <p className="text-sm font-black">Student activity</p>
                            <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-black text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-200">Live</span>
                        </div>
                        {[
                            ['Aarav improved ATS score to 91%', FileCheck2],
                            ['Neha completed Amazon mock round', Mic],
                            ['250 students applied today', Users],
                            ['18 new community answers posted', MessageSquareText]
                        ].map(([text, Icon]) => {
                            const activityIcon = React.createElement(Icon, { className: 'h-4 w-4 text-indigo-500' });
                            return (
                                <div key={text} className="mb-3 flex items-center gap-3 rounded-2xl bg-gray-50 p-3 dark:bg-white/5">
                                    {activityIcon}
                                    <p className="text-sm font-bold text-gray-700 dark:text-zinc-300">{text}</p>
                                </div>
                            );
                        })}
                    </GlassCard>
                </div>
            </section>

            <section className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
                <SectionHeader
                    eyebrow="AI career intelligence"
                    title="Every tool learns from your goals"
                    copy="Resume, interview, roadmap, ATS, and skills data work together to recommend what to do next."
                />
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {aiFeatures.map(({ title, copy, icon, path }) => {
                        const featureIcon = React.createElement(icon, { className: 'h-5 w-5' });
                        return (
                            <GlassCard key={title} className="cursor-pointer p-6" onClick={() => navigate(path)}>
                                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-white shadow-lg shadow-indigo-500/20">
                                    {featureIcon}
                                </div>
                                <h3 className="text-xl font-black">{title}</h3>
                                <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-zinc-400">{copy}</p>
                                <button
                                    type="button"
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        navigate(path);
                                    }}
                                    className="mt-5 inline-flex items-center gap-2 text-sm font-black text-indigo-600 dark:text-indigo-300"
                                >
                                    Explore
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </button>
                            </GlassCard>
                        );
                    })}
                </div>
            </section>

            <section className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
                <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
                    <SectionHeader
                        eyebrow="Dashboard preview"
                        title="A realistic command center for career progress"
                        copy="Application tracking, resume health, interview analytics, and skill growth are presented as one intelligent dashboard."
                    />
                    <GlassCard className="p-5">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="rounded-3xl bg-gray-950 p-5 text-white">
                                <div className="mb-4 flex items-center justify-between">
                                    <p className="font-black">Resume score</p>
                                    <Gauge className="h-5 w-5 text-cyan-300" />
                                </div>
                                <div className="relative h-36 rounded-full bg-[conic-gradient(#22d3ee_0_82%,rgba(255,255,255,0.12)_82%_100%)]">
                                    <div className="absolute inset-5 rounded-full bg-gray-950" />
                                    <div className="absolute inset-0 flex items-center justify-center text-4xl font-black">82</div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                {roadmaps.map(([title, value, copy]) => (
                                    <div key={title} className="rounded-3xl bg-gray-50 p-4 dark:bg-black/20">
                                        <div className="mb-2 flex items-center justify-between">
                                            <p className="font-black">{title}</p>
                                            <p className="text-sm font-black text-indigo-500">{value}%</p>
                                        </div>
                                        <div className="h-2 rounded-full bg-gray-200 dark:bg-white/10">
                                            <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400" style={{ width: `${value}%` }} />
                                        </div>
                                        <p className="mt-2 text-xs text-gray-500 dark:text-zinc-400">{copy}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="mt-4 grid gap-4 md:grid-cols-3">
                            {[
                                ['Applications', '34', LineChart],
                                ['Interviews', '12', BarChart3],
                                ['Skill goals', '8', Trophy]
                            ].map(([label, value, Icon]) => {
                                const chartIcon = React.createElement(Icon, { className: 'mb-3 h-5 w-5 text-indigo-500' });
                                return (
                                    <div key={label} className="rounded-3xl border border-border p-4">
                                        {chartIcon}
                                        <p className="text-2xl font-black">{value}</p>
                                        <p className="text-xs font-bold uppercase tracking-widest text-gray-500">{label}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </GlassCard>
                </div>
            </section>

            <section className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
                <SectionHeader
                    eyebrow="Mock interview preview"
                    title="Practice with an AI interviewer before the real round"
                    copy="Company-specific questions, voice answers, coding prompts, and explainable feedback help students improve faster."
                />
                <div className="grid gap-6 lg:grid-cols-[1fr_0.82fr]">
                    <GlassCard className="p-5">
                        <div className="rounded-3xl bg-gray-950 p-5 text-white">
                            <div className="mb-5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500">
                                        <Bot className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-black">AI Interviewer</p>
                                        <p className="text-xs text-zinc-400">Backend Developer • Amazon</p>
                                    </div>
                                </div>
                                <Button onClick={() => navigate('/interview/mock')} className="rounded-2xl bg-white text-gray-950 hover:bg-indigo-100">
                                    <Play className="mr-2 h-4 w-4" />
                                    Practice
                                </Button>
                            </div>
                            <div className="space-y-3">
                                <div className="max-w-[82%] rounded-3xl rounded-tl-md bg-white/10 p-4 text-sm leading-6">Explain how you would design an order notification pipeline with retries and idempotency.</div>
                                <div className="ml-auto max-w-[82%] rounded-3xl rounded-tr-md bg-indigo-500 p-4 text-sm leading-6">I would start by defining events, retry policies, idempotency keys, and failure queues...</div>
                                <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-4">
                                    <div className="mb-2 flex items-center gap-2 text-sm font-black text-emerald-300">
                                        <CheckCircle2 className="h-4 w-4" />
                                        AI feedback score: 86%
                                    </div>
                                    <p className="text-sm text-zinc-300">Strong architecture. Add concrete metrics, monitoring, and edge-case handling.</p>
                                </div>
                            </div>
                        </div>
                    </GlassCard>
                    <GlassCard className="p-5">
                        <p className="mb-4 text-sm font-black">Weak topic analysis</p>
                        {[
                            ['System design trade-offs', 72],
                            ['Complexity explanation', 58],
                            ['Behavioral structure', 88],
                            ['Communication clarity', 81]
                        ].map(([topic, value]) => (
                            <div key={topic} className="mb-4">
                                <div className="mb-2 flex justify-between text-sm">
                                    <span className="font-bold">{topic}</span>
                                    <span className="font-black text-indigo-500">{value}%</span>
                                </div>
                                <div className="h-2 rounded-full bg-gray-100 dark:bg-white/10">
                                    <div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-400" style={{ width: `${value}%` }} />
                                </div>
                            </div>
                        ))}
                    </GlassCard>
                </div>
            </section>

            <section className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
                <div className="grid gap-5 md:grid-cols-4">
                    {[
                        ['50K+', 'Students guided', Users],
                        ['1.2K+', 'Hiring partners', Rocket],
                        ['95%', 'Success confidence', Star],
                        ['24/7', 'AI assistance', Sparkles]
                    ].map(([value, label, Icon]) => {
                        const proofIcon = React.createElement(Icon, { className: 'mx-auto mb-4 h-6 w-6 text-indigo-500' });
                        return (
                            <GlassCard key={label} className="p-6 text-center">
                                {proofIcon}
                                <p className="text-4xl font-black">{value}</p>
                                <p className="mt-2 text-xs font-black uppercase tracking-widest text-gray-500 dark:text-zinc-400">{label}</p>
                            </GlassCard>
                        );
                    })}
                </div>
            </section>

            <section className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
                <GlassCard className="overflow-hidden p-8 md:p-10">
                    <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
                        <div>
                            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-indigo-500">CareerCompass AI</p>
                            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">Start with a smarter search, finish with a stronger career plan.</h2>
                            <p className="mt-4 max-w-2xl text-gray-600 dark:text-zinc-400">Use AI-powered discovery, resume scoring, interview practice, and community learning to move from confusion to clear action.</p>
                        </div>
                        <Button onClick={() => navigate('/interview/mock')} className="h-14 rounded-2xl bg-gray-950 px-8 font-black text-white hover:bg-indigo-600 dark:bg-white dark:text-gray-950">
                            Launch AI Interview
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </GlassCard>
            </section>
        </div>
    );
};

export default PremiumLandingSections;
