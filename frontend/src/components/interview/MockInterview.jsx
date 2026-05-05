import React, { useState, useEffect } from 'react';
import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';
import { Search, Briefcase, ChevronRight, MessageSquare, Star, ArrowRight, Zap, Target, BookOpen, ListTodo, FileText, Code2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { INTERVIEW_API_END_POINT } from '@/utils/constant';

const MockInterview = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const res = await axios.get(`${INTERVIEW_API_END_POINT}/company/get`, { withCredentials: true });
                if (res.data.success) {
                    setCompanies(res.data.companies);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        fetchCompanies();
    }, []);

    const filteredCompanies = companies.filter(company =>
        company.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-zinc-950 transition-colors duration-300'>
            <Navbar />
            
            <main className='max-w-7xl mx-auto px-6 py-12'>
                {/* Hero Section */}
                <div className='text-center mb-16 relative'>
                    <div className='absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-purple-500/10 blur-[120px] rounded-full -z-10 animate-pulse'></div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className='text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-6 tracking-tight'>
                            Master Your <span className='text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600'>Dream Interview</span>
                        </h1>
                        <p className='text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto mb-10 leading-relaxed'>
                            Practice previous interview questions from top tech giants. Real questions, real experiences, and expert solutions to help you ace your next big opportunity.
                        </p>
                    </motion.div>

                    {/* Stats */}
                    <div className='flex flex-wrap justify-center gap-8 mb-12'>
                        {[
                            { icon: <Briefcase className='text-purple-500' />, label: '500+ Companies' },
                            { icon: <MessageSquare className='text-blue-500' />, label: '10k+ Questions' },
                            { icon: <Zap className='text-amber-500' />, label: 'Expert Solutions' }
                        ].map((stat, i) => (
                            <div key={i} className='flex items-center gap-3 bg-white dark:bg-zinc-900 px-6 py-3 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800'>
                                {stat.icon}
                                <span className='font-bold text-sm text-gray-700 dark:text-gray-300'>{stat.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Search Bar */}
                    <div className='max-w-xl mx-auto relative mb-12'>
                        <div className='absolute inset-y-0 left-4 flex items-center pointer-events-none'>
                            <Search className='text-gray-400 h-5 w-5' />
                        </div>
                        <Input
                            type="text"
                            placeholder="Search for a company (e.g., Google, Amazon...)"
                            className='w-full pl-12 pr-4 py-7 bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 rounded-[24px] shadow-xl focus:ring-2 focus:ring-purple-500 transition-all text-lg'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Question Type Navigation */}
                    <div className='flex flex-wrap justify-center gap-4 max-w-2xl mx-auto'>
                        {[
                            { title: 'Objective', icon: <ListTodo size={18}/>, color: 'blue', path: '/objective-questions' },
                            { title: 'Subjective', icon: <FileText size={18}/>, color: 'purple', path: '/subjective-questions' },
                            { title: 'Common Qs', icon: <BookOpen size={18}/>, color: 'amber', path: '/interview/common' }
                        ].map((type, i) => (
                            <button
                                key={i}
                                onClick={() => navigate(type.path)}
                                className={`flex items-center gap-3 px-8 py-4 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group overflow-hidden relative`}
                            >
                                <div className={`absolute inset-0 bg-${type.color}-500/5 opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                                <div className={`p-2 rounded-xl bg-${type.color}-50 dark:bg-${type.color}-900/20 text-${type.color}-600 dark:text-${type.color}-400 group-hover:bg-${type.color}-600 group-hover:text-white transition-all`}>
                                    {type.icon}
                                </div>
                                <span className='font-black text-xs uppercase tracking-widest text-gray-700 dark:text-gray-300'>{type.title}</span>
                                <ChevronRight size={14} className='text-gray-300 group-hover:translate-x-1 transition-transform' />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Company Grid */}
                {loading ? (
                    <div className='flex justify-center py-20'>
                        <div className='w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin'></div>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                        {filteredCompanies.map((company, index) => (
                            <motion.div
                                key={company._id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ y: -10 }}
                                className='group bg-white dark:bg-zinc-900 rounded-[32px] p-8 border border-gray-100 dark:border-zinc-800 hover:border-purple-500/30 dark:hover:border-purple-500/30 transition-all duration-300 shadow-sm hover:shadow-2xl hover:shadow-purple-500/10'
                            >
                                <div className='flex justify-between items-start mb-8'>
                                    <div className='w-16 h-16 rounded-2xl bg-gray-50 dark:bg-zinc-800 p-3 flex items-center justify-center group-hover:scale-110 transition-transform duration-500'>
                                        <img src={company.logo} alt={company.name} className='w-full h-full object-contain' />
                                    </div>
                                    <div className='flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 px-3 py-1 rounded-full border border-amber-100 dark:border-amber-900/30'>
                                        <Star size={14} className='fill-amber-400 text-amber-400' />
                                        <span className='text-xs font-bold text-amber-700 dark:text-amber-400'>{company.rating}</span>
                                    </div>
                                </div>

                                <div className='mb-8'>
                                    <h3 className='text-2xl font-black text-gray-900 dark:text-white mb-2'>{company.name}</h3>
                                    <p className='text-sm text-gray-500 dark:text-gray-400 uppercase tracking-widest font-bold'>{company.category}</p>
                                </div>

                                <div className='grid grid-cols-2 gap-4 mb-8'>
                                    <div className='bg-gray-50 dark:bg-zinc-800/50 p-4 rounded-2xl'>
                                        <div className='flex items-center gap-2 text-gray-400 mb-1'>
                                            <BookOpen size={14} />
                                            <span className='text-[10px] font-bold uppercase tracking-wider'>Questions</span>
                                        </div>
                                        <p className='text-lg font-black text-gray-900 dark:text-white'>{company.questionsCount}+</p>
                                    </div>
                                    <div className='bg-gray-50 dark:bg-zinc-800/50 p-4 rounded-2xl'>
                                        <div className='flex items-center gap-2 text-gray-400 mb-1'>
                                            <Target size={14} />
                                            <span className='text-[10px] font-bold uppercase tracking-wider'>Difficulty</span>
                                        </div>
                                        <p className={`text-lg font-black ${
                                            company.difficulty === 'Hard' ? 'text-rose-500' : 'text-emerald-500'
                                        }`}>{company.difficulty}</p>
                                    </div>
                                </div>

                                <Button 
                                    onClick={() => navigate(`/interview/practice/${company._id}`)}
                                    className='w-full py-6 rounded-2xl bg-zinc-900 dark:bg-zinc-800 hover:bg-purple-600 dark:hover:bg-purple-600 text-white font-bold transition-all flex items-center justify-center gap-2 group/btn'
                                >
                                    Start Practice
                                    <ArrowRight size={18} className='group-hover:translate-x-1 transition-transform' />
                                </Button>
                            </motion.div>
                        ))}
                    </div>
                )}

                {filteredCompanies.length === 0 && (
                    <div className='text-center py-20'>
                        <div className='w-20 h-20 bg-gray-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6'>
                            <Search className='text-gray-400' size={32} />
                        </div>
                        <h3 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>No companies found</h3>
                        <p className='text-gray-500'>Try searching for something else</p>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default MockInterview;
