import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import JobCard from './JobCard';
import { useNavigate } from 'react-router-dom';
import { setFilters } from '@/redux/jobSlice';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Briefcase, PlusCircle } from 'lucide-react';

const LatestJobs = () => {
    const { allJobs } = useSelector(store => store.job);
    const { user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    return (
        <div className='max-w-7xl mx-auto my-32 px-4 transition-colors duration-300'>
            <div className='flex flex-col md:flex-row justify-between items-end gap-10 mb-16'>
                <div className='space-y-6'>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className='inline-flex items-center gap-2 px-5 py-2 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900/40 uppercase tracking-[0.2em] text-[10px] font-black shadow-sm'
                    >
                        <Sparkles size={14} />
                        Prime opportunities
                    </motion.div>
                    <h1 className='text-5xl md:text-6xl font-black text-gray-900 dark:text-white leading-tight uppercase tracking-tight'>
                        Featured <span className='text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400'>Career Pathing</span>
                    </h1>
                    <p className='text-gray-500 dark:text-zinc-500 font-medium max-w-lg text-lg'>
                        Curated high-impact roles from industry titans and rapid-growth innovators.
                    </p>
                </div>

                <div className='flex items-center gap-4'>
                    {user?.role === 'recruiter' && (
                        <button
                            onClick={() => navigate("/admin/create")}
                            className='bg-white dark:bg-zinc-900 text-gray-900 dark:text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest border border-gray-100 dark:border-zinc-800 hover:border-purple-500 transition-all active:scale-95 flex items-center gap-2 shadow-xl dark:shadow-none'
                        >
                            <PlusCircle size={18} /> Transmit Post
                        </button>
                    )}
                    <button
                        onClick={() => {
                            dispatch(setFilters({ type: 'Jobs' }));
                            navigate("/events");
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className='bg-black dark:bg-white text-white dark:text-black px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-900 dark:hover:bg-gray-100 shadow-xl transition-all active:scale-95 flex items-center gap-2 border-none'
                    >
                        The Job Matrix <ArrowRight size={18} />
                    </button>
                </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 my-8'>
                {
                    !allJobs || allJobs.length <= 0 ? (
                        <div className="col-span-full py-32 text-center border-2 border-dashed border-gray-100 dark:border-zinc-800 rounded-[48px] bg-white/50 dark:bg-zinc-900/50">
                            <Briefcase size={48} className='mx-auto text-gray-300 dark:text-zinc-700 mb-6' />
                            <h3 className='text-xl font-black text-gray-400 dark:text-zinc-600 uppercase tracking-widest'>No active transmissions</h3>
                            <p className='text-gray-400 dark:text-zinc-600 font-bold text-xs mt-2'>Stay synchronized for the next upload</p>
                        </div>
                    ) : (
                        allJobs?.filter(job => job.jobType === 'Job').slice(0, 6).map((job, index) => (
                            <motion.div
                                key={job._id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                            >
                                <JobCard job={job} />
                            </motion.div>
                        ))
                    )
                }
            </div>
        </div>
    )
}

export default LatestJobs