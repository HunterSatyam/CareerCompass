import React, { useEffect, useMemo, useState } from 'react';
import { Button } from './ui/button';
import {
    ArrowRight,
    Bot,
    Briefcase,
    Building2,
    Code2,
    GraduationCap,
    Mic,
    Search,
    ShieldCheck,
    Sparkles,
    Trophy,
    Video,
    Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import * as Motion from 'framer-motion';
import { useMotionValue, useSpring, useTransform } from 'framer-motion';

const prompts = [
    'Search Google internships...',
    'Search frontend jobs...',
    'Search mock interviews...',
    'Search hackathons...',
    'Search AI resume feedback...'
];

const categories = [
    { title: 'Internships', count: '2.5K+', icon: GraduationCap, query: 'Internship', tone: 'from-blue-500/16 to-cyan-400/8' },
    { title: 'Jobs', count: '8.4K+', icon: Briefcase, query: 'Job', tone: 'from-purple-500/16 to-indigo-400/8' },
    { title: 'Hackathons', count: '620+', icon: Code2, query: 'Hackathon', tone: 'from-emerald-500/16 to-teal-400/8' },
    { title: 'Interviews', count: '14K+', icon: Sparkles, path: '/interview/mock', tone: 'from-indigo-500/16 to-violet-400/8' },
    { title: 'Competitions', count: '980+', icon: Trophy, query: 'Competition', tone: 'from-amber-500/16 to-orange-400/8' },
    { title: 'Webinars', count: '430+', icon: Video, query: 'Webinar', tone: 'from-rose-500/16 to-pink-400/8' },
    { title: 'Companies', count: '1.2K+', icon: Building2, query: 'Company', tone: 'from-sky-500/16 to-blue-400/8' }
];

const companyCloud = ['Google', 'Microsoft', 'Amazon', 'TCS', 'Infosys', 'Wipro', 'Accenture', 'Adobe'];
const recentSearches = ['React internships', 'Data analyst jobs', 'Amazon OA', 'Resume ATS', 'Hackathon prizes'];
const trendingSearches = ['AI Engineer', 'Backend Node.js', 'Product Analyst', 'System Design'];

const HeroSection = () => {
    const [query, setQuery] = useState('');
    const [promptIndex, setPromptIndex] = useState(0);
    const [focused, setFocused] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const smoothX = useSpring(mouseX, { stiffness: 80, damping: 22 });
    const smoothY = useSpring(mouseY, { stiffness: 80, damping: 22 });
    const rotateX = useTransform(smoothY, [0, 500], [8, -8]);
    const rotateY = useTransform(smoothX, [0, 900], [-8, 8]);

    useEffect(() => {
        const interval = setInterval(() => setPromptIndex((index) => (index + 1) % prompts.length), 2200);
        return () => clearInterval(interval);
    }, []);

    const particles = useMemo(() => Array.from({ length: 26 }).map((_, index) => ({
        id: index,
        left: `${(index * 37) % 100}%`,
        top: `${(index * 19) % 88}%`,
        delay: `${(index % 7) * 0.35}s`,
        size: `${3 + (index % 4)}px`
    })), []);

    const searchHandler = (value = query) => {
        const nextQuery = value.trim();
        if (!nextQuery) return;
        dispatch(setSearchedQuery(nextQuery));
        navigate(`/browse?query=${encodeURIComponent(nextQuery)}`);
    };

    const handleCategory = (category) => {
        if (category.path) {
            navigate(category.path);
            return;
        }
        dispatch(setSearchedQuery(category.query));
        navigate(`/browse?query=${encodeURIComponent(category.query)}`);
    };

    return (
        <section
            className="relative isolate min-h-[calc(100vh-4rem)] overflow-hidden bg-white pt-20 text-gray-950 dark:bg-[#09090B] dark:text-white"
            onMouseMove={(event) => {
                const rect = event.currentTarget.getBoundingClientRect();
                mouseX.set(event.clientX - rect.left);
                mouseY.set(event.clientY - rect.top);
            }}
        >
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="premium-mesh absolute inset-0 opacity-95" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(99,102,241,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(99,102,241,0.07)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)]" />
                <div className="noise-layer absolute inset-0 opacity-[0.09]" />
                <Motion.motion.div
                    className="absolute h-72 w-72 rounded-full bg-indigo-500/18 blur-3xl"
                    style={{ x: smoothX, y: smoothY, translateX: '-50%', translateY: '-50%' }}
                />
                {particles.map((particle) => (
                    <span
                        key={particle.id}
                        className="landing-particle absolute rounded-full bg-indigo-500/35 dark:bg-cyan-300/35"
                        style={{ left: particle.left, top: particle.top, width: particle.size, height: particle.size, animationDelay: particle.delay }}
                    />
                ))}
            </div>

            <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-12 px-4 py-12 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-8">
                <Motion.motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                    <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-white/70 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-indigo-700 shadow-lg shadow-indigo-500/8 backdrop-blur-xl dark:bg-white/8 dark:text-indigo-200">
                        <Sparkles className="h-3.5 w-3.5" />
                        AI-powered career operating system
                    </div>

                    <h1 className="max-w-5xl text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl xl:text-8xl">
                        Your AI-Powered
                        <span className="block bg-gradient-to-r from-purple-600 via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
                            Career Universe
                        </span>
                    </h1>

                    <p className="mt-7 max-w-2xl text-lg leading-8 text-gray-600 dark:text-zinc-300">
                        Discover jobs, internships, hackathons, interviews, and career opportunities with intelligent AI assistance, real-time recommendations, and skill-aware guidance.
                    </p>

                    <div className="mt-8 max-w-3xl">
                        <div className={`relative rounded-[28px] border bg-white/82 p-2 shadow-2xl backdrop-blur-xl transition-all dark:bg-zinc-950/75 ${focused ? 'border-indigo-400 shadow-indigo-500/20 dark:shadow-indigo-500/18' : 'border-white/70 dark:border-white/10'}`}>
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                <div className="flex min-h-14 flex-1 items-center gap-3 px-4">
                                    <Search className="h-5 w-5 text-indigo-500" />
                                    <input
                                        value={query}
                                        onChange={(event) => setQuery(event.target.value)}
                                        onFocus={() => setFocused(true)}
                                        onBlur={() => setFocused(false)}
                                        onKeyDown={(event) => event.key === 'Enter' && searchHandler()}
                                        placeholder={prompts[promptIndex]}
                                        className="w-full bg-transparent text-base font-bold outline-none placeholder:text-gray-400 dark:placeholder:text-zinc-500"
                                    />
                                    <button type="button" aria-label="Voice search" className="rounded-2xl border border-border p-3 text-gray-500 hover:border-indigo-400 hover:text-indigo-600 dark:text-zinc-400">
                                        <Mic className="h-4 w-4" />
                                    </button>
                                </div>
                                <Button onClick={() => searchHandler()} className="h-14 rounded-2xl bg-gray-950 px-7 font-black text-white hover:bg-indigo-600 dark:bg-white dark:text-gray-950 dark:hover:bg-indigo-100">
                                    Explore
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                            <div className="mt-3 flex flex-wrap gap-2 px-2 pb-1">
                                {[...recentSearches.slice(0, 3), ...trendingSearches.slice(0, 2)].map((item) => (
                                    <button key={item} onClick={() => searchHandler(item)} className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-bold text-gray-600 hover:bg-indigo-50 hover:text-indigo-700 dark:bg-white/7 dark:text-zinc-300 dark:hover:bg-indigo-500/15">
                                        {item}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 grid max-w-2xl grid-cols-3 gap-3">
                        {[
                            ['50K+', 'Students'],
                            ['1.2K+', 'Companies'],
                            ['95%', 'Career match']
                        ].map(([value, label]) => (
                            <div key={label} className="rounded-3xl border border-white/70 bg-white/70 p-4 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/7">
                                <p className="text-2xl font-black">{value}</p>
                                <p className="mt-1 text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-zinc-400">{label}</p>
                            </div>
                        ))}
                    </div>
                </Motion.motion.div>

                <Motion.motion.div
                    initial={{ opacity: 0, scale: 0.96, y: 24 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.75, delay: 0.12 }}
                    style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
                    className="relative"
                >
                    <div className="rounded-[36px] border border-white/60 bg-white/72 p-4 shadow-2xl shadow-indigo-500/12 backdrop-blur-2xl dark:border-white/10 dark:bg-white/8">
                        <div className="rounded-[28px] border border-border bg-gray-950 p-5 text-white shadow-inner dark:border-white/10">
                            <div className="mb-5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500">
                                        <Bot className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black">CareerCompass AI</p>
                                        <p className="text-xs text-zinc-400">Live recommendation engine</p>
                                    </div>
                                </div>
                                <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-black text-emerald-300">Online</span>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2">
                                {categories.slice(0, 4).map((category, index) => {
                                    const categoryIcon = React.createElement(category.icon, {
                                        className: 'mb-4 h-6 w-6 text-indigo-200 transition-transform group-hover:rotate-6 group-hover:scale-110'
                                    });
                                    return (
                                        <Motion.motion.button
                                            key={category.title}
                                            onClick={() => handleCategory(category)}
                                            whileHover={{ y: -5, scale: 1.015 }}
                                            className={`group rounded-3xl border border-white/10 bg-gradient-to-br ${category.tone} p-4 text-left transition-all hover:border-indigo-300/40`}
                                        >
                                            {categoryIcon}
                                            <p className="text-lg font-black">{category.title}</p>
                                            <p className="mt-1 text-xs font-bold uppercase tracking-widest text-zinc-400">{category.count} active</p>
                                            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
                                                <Motion.motion.div
                                                    className="h-full rounded-full bg-gradient-to-r from-indigo-300 to-cyan-300"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${58 + index * 9}%` }}
                                                    transition={{ duration: 1, delay: 0.3 + index * 0.08 }}
                                                />
                                            </div>
                                        </Motion.motion.button>
                                    );
                                })}
                            </div>

                            <div className="mt-4 rounded-3xl border border-white/10 bg-white/6 p-4">
                                <div className="mb-3 flex items-center justify-between">
                                    <p className="text-sm font-black">Interview readiness</p>
                                    <ShieldCheck className="h-4 w-4 text-cyan-300" />
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    {['Resume', 'Skills', 'Mock AI'].map((item, index) => (
                                        <div key={item} className="rounded-2xl bg-black/20 p-3">
                                            <p className="text-xl font-black">{[92, 78, 86][index]}%</p>
                                            <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500">{item}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="absolute -left-5 top-12 hidden rounded-2xl border border-white/70 bg-white/80 p-3 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/80 sm:block">
                        <div className="flex items-center gap-2 text-xs font-black">
                            <Zap className="h-4 w-4 text-amber-500" />
                            250 students applied today
                        </div>
                    </div>
                    <div className="absolute -right-4 bottom-16 hidden rounded-2xl border border-white/70 bg-white/80 p-3 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/80 md:block">
                        <div className="flex items-center gap-2 text-xs font-black">
                            <Sparkles className="h-4 w-4 text-indigo-500" />
                            Microsoft posted 12 internships
                        </div>
                    </div>
                </Motion.motion.div>
            </div>

            <div className="relative z-10 border-y border-border/60 bg-white/60 py-3 backdrop-blur-xl dark:bg-white/5">
                <div className="ticker-track flex gap-8 whitespace-nowrap text-xs font-black uppercase tracking-[0.18em] text-gray-500 dark:text-zinc-400">
                    {[...companyCloud, ...companyCloud].map((company, index) => (
                        <span key={`${company}-${index}`} className="inline-flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                            {company} hiring now
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
