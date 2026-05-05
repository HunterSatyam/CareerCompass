import React from 'react'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { Award, CheckCircle, BookOpen, Clock, Users, Share2, Heart, ArrowRight } from 'lucide-react'
import { useSelector } from 'react-redux'
import LikeButton from './shared/LikeButton'

const CertificationCard = ({ job }) => {
    const navigate = useNavigate();
    const { user } = useSelector(store => store.auth);

    if (!job) return null;

    // Assuming cost is stored in salary, 0 means Free
    const cost = job?.salary === 0 ? "Free" : `₹${job?.salary}`;

    return (
        <div onClick={() => navigate(`/description/certification/${job._id}`)} className='group bg-white dark:bg-zinc-900 rounded-[28px] p-0 shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-zinc-800 hover:border-emerald-200/50 flex flex-col h-full relative overflow-hidden cursor-pointer'>
            {/* Header */}
            <div className="absolute top-4 right-4 z-20">
                <LikeButton eventId={job._id} eventType="Certification" />
            </div>
            <div className="h-28 bg-emerald-500 dark:bg-emerald-600/80 relative p-6 flex justify-between items-start overflow-hidden text-white">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-2xl -ml-10 -mb-10"></div>

                <Badge className="bg-emerald-950/20 text-white backdrop-blur-md border-none px-3 py-1.5 rounded-xl font-bold text-[10px] uppercase tracking-wider shadow-sm z-10 transition-all">
                    <div className='flex items-center gap-1.5'>
                        <Award size={12} />
                        Certification
                    </div>
                </Badge>
                <Badge className={`${job?.salary === 0 ? 'bg-white dark:bg-zinc-100 text-emerald-600' : 'bg-blue-500 text-white'} border-none px-3 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-wider shadow-sm z-10 transition-all`}>
                    {cost}
                </Badge>
            </div>

            <div className="p-6 flex flex-col flex-1 gap-4">
                {/* Logo & Content */}
                <div className="flex gap-5 -mt-12 relative z-20">
                    <div className="p-1 rounded-[16px] bg-white dark:bg-zinc-800 shadow-lg border border-gray-100 dark:border-zinc-700 transition-transform group-hover:scale-105 duration-300">
                        <Avatar className="h-16 w-16 rounded-[12px]">
                            <AvatarImage src={job?.logo || job?.company?.logo} alt={job?.company?.name} className="object-cover" />
                            <AvatarFallback className="rounded-[12px] bg-emerald-50 dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 font-black text-xl">
                                {job?.company?.name?.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                    <div className='pt-12 min-w-0 flex-1'>
                        <h1 className="font-black text-xl text-gray-900 dark:text-white leading-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                            {job?.title}
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-zinc-400 font-medium mt-1 line-clamp-1 flex items-center gap-1">
                            Provided by <span className='text-gray-900 dark:text-zinc-200 font-bold ml-1'>{job?.company?.name}</span>
                            <CheckCircle size={14} className="text-blue-500 fill-white dark:fill-zinc-900" />
                        </p>
                    </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-3 mt-2">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-2xl border border-gray-100 dark:border-zinc-800 transition-colors group/info">
                        <div className='p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl text-purple-600 dark:text-purple-400'>
                            <Clock size={16} />
                        </div>
                        <div>
                            <p className='text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest'>Duration</p>
                            <p className='text-xs font-bold text-gray-900 dark:text-zinc-100'>{job?.experience ? `${job.experience} Weeks` : 'Self-Paced'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-2xl border border-gray-100 dark:border-zinc-800 transition-colors group/info">
                        <div className='p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl text-emerald-600 dark:text-emerald-400'>
                            <BookOpen size={16} />
                        </div>
                        <div>
                            <p className='text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest'>Mode</p>
                            <p className='text-xs font-bold text-gray-900 dark:text-zinc-100 truncate max-w-[80px]'>{job?.location || 'Online'}</p>
                        </div>
                    </div>
                </div>

                {/* Footer Section */}
                {user?.role !== 'recruiter' && (
                    <div className="mt-auto pt-4 border-t border-gray-50 dark:border-zinc-800/50">
                        <button className={`w-full h-14 rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all shadow-lg flex items-center justify-center gap-2 group/btn active:scale-95 ${(job?.applications?.some(app => (app.applicant?._id || app.applicant) === user?._id || app === user?._id) ||
                            job?.enrollments?.some(app => (app.applicant?._id || app.applicant) === user?._id || app === user?._id))
                            ? 'bg-emerald-500 text-white cursor-not-allowed border-none'
                            : 'bg-black dark:bg-white text-white dark:text-black hover:bg-gray-900 dark:hover:bg-gray-100 shadow-emerald-100 dark:shadow-none font-black tracking-widest'
                            }`}>
                            <span>{(job?.applications?.some(app => (app.applicant?._id || app.applicant) === user?._id || app === user?._id) ||
                                job?.enrollments?.some(app => (app.applicant?._id || app.applicant) === user?._id || app === user?._id)) ? 'Enrolled Successfully' : 'Access Certificate'}</span>
                            {!((job?.applications?.some(app => (app.applicant?._id || app.applicant) === user?._id || app === user?._id) ||
                                job?.enrollments?.some(app => (app.applicant?._id || app.applicant) === user?._id || app === user?._id))) && <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CertificationCard
