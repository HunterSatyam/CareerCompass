import React from 'react'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { Building2, MapPin, Briefcase, IndianRupee, Clock, Heart, Share2, Users, Sparkles } from 'lucide-react'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'

const JobCard = ({ job }) => {
    const navigate = useNavigate();
    const { user } = useSelector(store => store.auth);

    if (!job) return null;

    const salary = job?.salary ? `₹${job.salary} LPA` : 'Competitive';
    const experience = job?.experienceLevel === 0 ? 'Fresher' : `${job?.experienceLevel}+ Years`;

    const getTimeAgo = (date) => {
        if (!date) return 'Recently';
        const now = new Date();
        const posted = new Date(date);
        const diffTime = Math.abs(now - posted);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        return `${Math.floor(diffDays / 30)} months ago`;
    };

    const extractSkills = (description) => {
        if (!description) return [];
        const commonSkills = ['React', 'Node.js', 'Python', 'Java', 'JavaScript', 'TypeScript', 'AWS', 'Docker', 'MongoDB', 'SQL', 'Angular', 'Vue', 'Express', 'Django', 'Flask', 'Machine Learning', 'AI'];
        const found = commonSkills.filter(skill =>
            description.toLowerCase().includes(skill.toLowerCase())
        );
        return found.slice(0, 3);
    };

    const skills = extractSkills(job?.description);
    const timeAgo = getTimeAgo(job?.createdAt);

    const isApplied = job?.applications?.some(app => (app.applicant?._id || app.applicant) === user?._id || app === user?._id);

    return (
        <motion.div
            whileHover={{ y: -8 }}
            onClick={() => navigate(`/description/job/${job._id}`)}
            className='bg-white dark:bg-zinc-900 rounded-[32px] shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-zinc-800 hover:border-purple-200 dark:hover:border-purple-800/60 overflow-hidden cursor-pointer flex flex-col h-full group relative'
        >
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-purple-500/0 to-transparent group-hover:via-purple-500 transition-all duration-700"></div>

            <div className="p-8 pb-4">
                <div className="flex items-start justify-between gap-6 mb-6">
                    <Avatar className="h-16 w-16 rounded-[22px] border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-800 shadow-sm overflow-hidden p-2 transition-transform group-hover:scale-110 duration-500">
                        <AvatarImage src={job?.logo || job?.company?.logo} className="object-contain" />
                        <AvatarFallback className="rounded-xl text-lg bg-purple-50 dark:bg-purple-900/20 font-black text-purple-600 dark:text-purple-400">{job?.company?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>

                    <div className='flex flex-col items-end gap-2'>
                        <div className='flex gap-1.5'>
                            <button className='p-2 bg-gray-50 dark:bg-zinc-800 rounded-xl text-gray-400 dark:text-zinc-500 hover:text-purple-600 dark:hover:text-purple-400 transition-all active:scale-90'>
                                <Share2 size={16} />
                            </button>
                            <button className='p-2 bg-gray-50 dark:bg-zinc-800 rounded-xl text-gray-400 dark:text-zinc-500 hover:text-rose-500 dark:hover:text-rose-400 transition-all active:scale-90'>
                                <Heart size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="text-xl font-black text-gray-900 dark:text-white leading-tight group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2 mb-2 uppercase tracking-tight">{job?.title}</h3>
                    <div className='flex items-center gap-2'>
                        <p className="text-xs text-gray-500 dark:text-zinc-400 font-black uppercase tracking-widest flex items-center gap-1.5">
                            <Building2 size={12} className="text-purple-500" />
                            {job?.company?.name}
                        </p>
                        <span className='w-1 h-1 bg-gray-200 dark:bg-zinc-700 rounded-full'></span>
                        <p className="text-[10px] text-gray-400 dark:text-zinc-500 font-bold uppercase tracking-widest flex items-center gap-1">
                            <Clock size={10} />
                            {timeAgo}
                        </p>
                    </div>
                </div>

                <div className='flex flex-wrap gap-2 mb-6'>
                    <Badge className="bg-purple-50 dark:bg-purple-900/10 text-purple-600 dark:text-purple-400 border border-purple-100/50 dark:border-purple-900/30 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-none">
                        {job?.jobType || 'Full-time'}
                    </Badge>
                    {skills.map((skill, index) => (
                        <span key={index} className='bg-gray-50 dark:bg-zinc-800/50 text-gray-500 dark:text-zinc-400 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-gray-100/50 dark:border-zinc-800 shadow-sm'>
                            {skill}
                        </span>
                    ))}
                </div>

                <div className='grid grid-cols-2 gap-3 mb-6'>
                    <div className='flex flex-col gap-1 p-3 bg-gray-50/50 dark:bg-zinc-800/30 rounded-2xl border border-gray-100/50 dark:border-zinc-800'>
                        <span className='text-[8px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest'>Experience Level</span>
                        <div className='flex items-center gap-2 text-[11px] font-black text-gray-700 dark:text-zinc-300'>
                            <Briefcase size={12} className='text-purple-500' />
                            {experience}
                        </div>
                    </div>
                    <div className='flex flex-col gap-1 p-3 bg-gray-50/50 dark:bg-zinc-800/30 rounded-2xl border border-gray-100/50 dark:border-zinc-800'>
                        <span className='text-[8px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest'>Operational Base</span>
                        <div className='flex items-center gap-2 text-[11px] font-black text-gray-700 dark:text-zinc-300'>
                            <MapPin size={12} className='text-purple-500' />
                            <span className="truncate">{job?.location || "Global"}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-8 pb-8 flex flex-col flex-1">
                <p className="text-sm text-gray-500 dark:text-zinc-500 line-clamp-3 leading-relaxed font-medium mb-8">
                    {job?.description || "Join our team and work on exciting projects that define the future."}
                </p>

                <div className="mt-auto flex flex-col gap-5">
                    <div className='flex items-center justify-between'>
                        <div className='flex flex-col'>
                            <span className='text-[8px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-1'>Annual Protocol Compensation</span>
                            <div className='flex items-center gap-2'>
                                <IndianRupee size={18} className='text-emerald-500' />
                                <span className='text-xl font-black text-gray-900 dark:text-white'>{salary}</span>
                            </div>
                        </div>
                        <div className='p-3 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl'>
                            <div className='flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-black text-[10px] uppercase tracking-widest'>
                                <Users size={12} />
                                {job?.applications?.length || 0} Candidates
                            </div>
                        </div>
                    </div>

                    {user?.role !== 'recruiter' && (
                        <button
                            disabled={isApplied}
                            className={`w-full py-5 rounded-[22px] text-[10px] font-black uppercase tracking-[0.25em] transition-all active:scale-[0.98] ${isApplied
                                ? 'bg-emerald-500 text-white cursor-not-allowed shadow-none'
                                : 'bg-black dark:bg-white text-white dark:text-black hover:opacity-90 shadow-xl shadow-purple-200/50 dark:shadow-none'
                                }`}
                        >
                            {isApplied ? (
                                <span className='flex items-center justify-center gap-2'>
                                    Protocol Initiated
                                    <Sparkles size={12} />
                                </span>
                            ) : 'Initialize Application'}
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    )
}

export default JobCard
