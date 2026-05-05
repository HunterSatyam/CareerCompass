import React, { useState, useEffect } from 'react';
import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';
import { Search, FileText, MessageSquare, Briefcase, Zap, ArrowRight, BookOpen, Star, Filter } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { INTERVIEW_API_END_POINT } from '@/utils/constant';

const SubjectiveQuestions = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All'); 
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSubjectiveQuestions = async () => {
            try {
                const res = await axios.get(`${INTERVIEW_API_END_POINT}/questions/all?type=Subjective`, { withCredentials: true });
                if (res.data.success) {
                    const subjectiveQs = res.data.questions.map(q => ({
                        ...q,
                        companyName: q.company?.name || 'Unknown',
                        companyLogo: q.company?.logo || ''
                    }));
                    setQuestions(subjectiveQs);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        fetchSubjectiveQuestions();
    }, []);

    const filteredQuestions = questions.filter(q => {
        const matchesSearch = q.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             q.companyName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'All' || q.difficulty === filter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-zinc-950 transition-colors duration-300'>
            <Navbar />
            
            <main className='max-w-7xl mx-auto px-6 py-12'>
                <div className='flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8'>
                    <div className='max-w-2xl'>
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6'
                        >
                            <FileText size={14} className='text-purple-500' />
                            <span className='text-[10px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-[0.2em]'>Theory & HR Arena</span>
                        </motion.div>
                        <h1 className='text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-6 tracking-tight'>
                            Ace the <br />
                            <span className='text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-rose-600'>Theoretical Rounds</span>
                        </h1>
                        <p className='text-gray-600 dark:text-gray-400 text-lg leading-relaxed'>
                            Practice deep-dive technical and behavioral questions asked during the core rounds of top companies.
                        </p>
                    </div>

                    <div className='flex flex-col gap-4 min-w-[300px]'>
                        <div className='relative'>
                            <Search className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5' />
                            <Input 
                                placeholder='Search theory or companies...'
                                className='pl-12 py-7 rounded-2xl bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 shadow-sm focus:ring-purple-500'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className='flex gap-2 overflow-x-auto pb-2 scrollbar-hide'>
                            {['All', 'Easy', 'Medium', 'Hard'].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                                        filter === f 
                                            ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' 
                                            : 'bg-white dark:bg-zinc-900 text-gray-400 border border-gray-100 dark:border-zinc-800'
                                    }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className='h-64 bg-white dark:bg-zinc-900 rounded-[32px] animate-pulse border border-gray-100 dark:border-zinc-800'></div>
                        ))}
                    </div>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                        {filteredQuestions.map((q, index) => (
                            <motion.div
                                key={q._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ y: -10 }}
                                className='group bg-white dark:bg-zinc-900 rounded-[32px] p-8 border border-gray-100 dark:border-zinc-800 hover:border-purple-500/30 transition-all duration-300 shadow-sm hover:shadow-2xl hover:shadow-purple-500/10'
                            >
                                <div className='flex justify-between items-start mb-8'>
                                    <div className='flex items-center gap-3'>
                                        <div className='w-12 h-12 rounded-2xl bg-gray-50 dark:bg-zinc-800 p-2.5 flex items-center justify-center'>
                                            <img src={q.companyLogo} alt={q.companyName} className='w-full h-full object-contain' />
                                        </div>
                                        <div>
                                            <h4 className='font-black text-gray-900 dark:text-white text-sm'>{q.companyName}</h4>
                                            <p className='text-[10px] text-gray-400 uppercase tracking-widest font-bold'>{q.category}</p>
                                        </div>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                        q.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-600' :
                                        q.difficulty === 'Medium' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                                    }`}>
                                        {q.difficulty}
                                    </div>
                                </div>

                                <h3 className='text-xl font-black text-gray-900 dark:text-white mb-4 line-clamp-2 min-h-[3.5rem]'>
                                    {q.title}
                                </h3>

                                <div className='flex items-center gap-6 mb-8 text-gray-400'>
                                    <div className='flex items-center gap-2'>
                                        <MessageSquare size={14} className='text-purple-500' />
                                        <span className='text-[10px] font-bold uppercase tracking-widest'>Core Rounds</span>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <Zap size={14} className='text-amber-500' />
                                        <span className='text-[10px] font-bold uppercase tracking-widest'>{q.frequency}</span>
                                    </div>
                                </div>

                                <Button 
                                    onClick={() => navigate(`/interview/practice/${q.company?._id || q.company}`)}
                                    className='w-full py-6 rounded-2xl bg-zinc-900 dark:bg-zinc-800 hover:bg-purple-600 dark:hover:bg-purple-600 text-white font-bold transition-all flex items-center justify-center gap-2 group/btn'
                                >
                                    View Question
                                    <ArrowRight size={18} className='group-hover:translate-x-1 transition-transform' />
                                </Button>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default SubjectiveQuestions;
