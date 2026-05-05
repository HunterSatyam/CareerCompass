import React from 'react'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { Briefcase, MapPin, Clock, IndianRupee, GraduationCap, Share2, Heart, ArrowRight } from 'lucide-react'
import { useSelector } from 'react-redux'
import LikeButton from './shared/LikeButton'

const InternshipCard = ({ job }) => {
    const navigate = useNavigate();
    const { user } = useSelector(store => store.auth);

    if (!job) return null;

    // Calculate duration - using duration field from internship model
    const duration = job?.duration ? `${job.duration} Months` : (job?.experience ? `${job.experience} Months` : '3-6 Months');
    const stipend = job?.stipend ? `₹${job.stipend}k/month` : (job?.salary ? `₹${job.salary}k/month` : 'Unpaid');

    return (
        <div onClick={() => navigate(`/description/internship/${job._id}`)} className='group bg-white dark:bg-zinc-900 rounded-[28px] p-0 shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-zinc-800 hover:border-cyan-200/50 flex flex-col h-full relative overflow-hidden cursor-pointer'>
            {/* Header */}
            <div className="absolute top-4 right-4 z-20">
                <LikeButton eventId={job._id} eventType="Internship" />
            </div>
            <div className="h-28 bg-gradient-to-r from-cyan-500 to-blue-600 dark:from-cyan-800 dark:to-blue-900 relative p-6 flex justify-between items-start overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-2xl -ml-10 -mb-10"></div>

                <Badge className="bg-white/20 text-white backdrop-blur-md border-none px-3 py-1.5 rounded-xl font-bold text-[10px] uppercase tracking-wider shadow-sm z-10">
                    <div className='flex items-center gap-1.5'>
                        <Briefcase size={12} />
                        Internship
                    </div>
                </Badge>
            </div>

            <div className="p-6 flex flex-col flex-1 gap-4">
                {/* Logo & Content */}
                <div className="flex gap-5 -mt-12 relative z-20">
                    <div className="p-1 rounded-[16px] bg-white dark:bg-zinc-800 shadow-lg border border-gray-100 dark:border-zinc-700 transition-transform group-hover:scale-105 duration-300">
                        <Avatar className="h-16 w-16 rounded-[12px]">
                            <AvatarImage src={job?.logo || job?.company?.logo} alt={job?.company?.name} className="object-cover" />
                            <AvatarFallback className="rounded-[12px] bg-cyan-50 dark:bg-zinc-800 text-cyan-600 dark:text-cyan-400 font-black text-xl">
                                {job?.company?.name?.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                    <div className='pt-12 min-w-0 flex-1'>
                        <h1 className="font-black text-xl text-gray-900 dark:text-white leading-tight group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-2">
                            {job?.title}
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-zinc-400 font-medium mt-1 line-clamp-1">{job?.company?.name}</p>
                    </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-3 mt-2">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-2xl border border-gray-100 dark:border-zinc-800 transition-colors group/info">
                        <div className='p-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600 dark:text-blue-400'>
                            <MapPin size={16} />
                        </div>
                        <div>
                            <p className='text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest'>Location</p>
                            <p className='text-xs font-bold text-gray-900 dark:text-zinc-200 truncate max-w-[80px]'>{job?.location || "Remote"}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-2xl border border-gray-100 dark:border-zinc-800 transition-colors group/info">
                        <div className='p-2 bg-cyan-50 dark:bg-cyan-900/20 rounded-xl text-cyan-600 dark:text-cyan-400'>
                            <IndianRupee size={16} />
                        </div>
                        <div>
                            <p className='text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest'>Stipend</p>
                            <p className='text-xs font-bold text-gray-900 dark:text-zinc-200'>{stipend}</p>
                        </div>
                    </div>
                </div>

                {/* Footer Section */}
                {user?.role !== 'recruiter' && (
                    <div className="mt-auto pt-4 border-t border-gray-50 dark:border-zinc-800/50">
                        <button className={`w-full h-14 rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all shadow-lg flex items-center justify-center gap-2 group/btn active:scale-95 ${job?.applications?.some(app => (app.applicant?._id || app.applicant) === user?._id || app === user?._id)
                            ? 'bg-emerald-500 text-white cursor-not-allowed shadow-none'
                            : 'bg-black dark:bg-white text-white dark:text-black hover:bg-gray-900 dark:hover:bg-gray-100 shadow-cyan-100 dark:shadow-none'
                            }`}>
                            <span>{job?.applications?.some(app => (app.applicant?._id || app.applicant) === user?._id || app === user?._id) ? 'Applied Successfully' : 'Quick Apply'}</span>
                            {!job?.applications?.some(app => (app.applicant?._id || app.applicant) === user?._id || app === user?._id) && <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default InternshipCard
