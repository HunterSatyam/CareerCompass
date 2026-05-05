import React from 'react'
import Navbar from './shared/Navbar'
import AppliedJobTable from './AppliedJobTable'
import { motion } from 'framer-motion'
import { Briefcase } from 'lucide-react'
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs'

const MyApplications = () => {
    useGetAppliedJobs();

    return (
        <div className='min-h-screen bg-[#F8F9FF] dark:bg-black transition-colors duration-300'>
            <Navbar />
            <div className='max-w-7xl mx-auto py-12 px-4'>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='bg-white dark:bg-zinc-900 rounded-[32px] p-8 md:p-12 shadow-xl dark:shadow-none border border-white/50 dark:border-zinc-800 overflow-hidden'
                >
                    <div className='flex items-center gap-4 mb-10'>
                        <div className='p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl text-emerald-600 dark:text-emerald-400'>
                            <Briefcase size={28} />
                        </div>
                        <div>
                            <h1 className='text-3xl font-black text-gray-900 dark:text-white tracking-tight uppercase'>My Applications</h1>
                            <p className='text-sm text-gray-400 dark:text-zinc-500 font-medium uppercase tracking-[0.2em]'>Track your professional journey</p>
                        </div>
                    </div>
                    <AppliedJobTable />
                </motion.div>
            </div>
        </div>
    )
}

export default MyApplications
