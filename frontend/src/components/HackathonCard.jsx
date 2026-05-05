import React from 'react'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { Code2, Calendar, MapPin, Trophy, Zap, Share2, Heart, Users, ArrowRight } from 'lucide-react'
import { useSelector } from 'react-redux'
import LikeButton from './shared/LikeButton'

const HackathonCard = ({ job }) => {
    const navigate = useNavigate();
    const { user } = useSelector(store => store.auth);

    if (!job) return null;

    // Format date
    const hackathonDate = job?.date ? new Date(job.date) : null;
    const dateString = hackathonDate ? hackathonDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBA';

    const prize = job?.prize || 'To be announced';

    return (
        <div onClick={() => navigate(`/description/hackathon/${job._id}`)} className='group bg-white dark:bg-zinc-900 rounded-[28px] p-0 shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-zinc-800 hover:border-purple-200/50 flex flex-col h-full relative overflow-hidden cursor-pointer'>
            {/* Header */}
            <div className='h-32 bg-gray-900 dark:bg-black relative p-6 flex justify-between items-start overflow-hidden'>
                <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -ml-10 -mb-10"></div>

                <Badge className="bg-white/10 text-white backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-xl font-bold text-[10px] uppercase tracking-wider shadow-sm z-10">
                    <div className='flex items-center gap-1.5'>
                        <Trophy size={12} className="text-yellow-400" />
                        Hackathon
                    </div>
                </Badge>

                <div className='z-10 text-right'>
                    <p className='text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-1'>Prize Pool</p>
                    <p className='text-lg font-black text-white'>{prize}</p>
                </div>
            </div>

            <div className="p-6 flex flex-col flex-1 gap-4">
                {/* Logo & Content */}
                <div className="flex gap-5 -mt-12 relative z-20">
                    <div className="p-1 rounded-[16px] bg-white dark:bg-zinc-800 shadow-lg border border-gray-100 dark:border-zinc-700 transition-transform group-hover:scale-105 duration-300">
                        <Avatar className="h-16 w-16 rounded-[12px]">
                            <AvatarImage src={job?.logo || job?.company?.logo} alt={job?.company?.name} className="object-cover" />
                            <AvatarFallback className="rounded-[12px] bg-purple-50 dark:bg-zinc-800 text-purple-600 dark:text-purple-400 font-black text-xl">
                                {job?.company?.name?.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                    <div className='pt-12 min-w-0 flex-1'>
                        <h1 className="font-black text-xl text-gray-900 dark:text-white leading-tight group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2">
                            {job?.title}
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-zinc-400 font-medium mt-1 line-clamp-1">{job?.company?.name}</p>
                    </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-3 mt-2">
                    <div className='bg-gray-50 dark:bg-zinc-800/50 text-gray-600 dark:text-zinc-400 border border-gray-100 dark:border-zinc-800 px-3 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2'>
                        <Users size={12} />
                        {job?.teamSize === "1" ? "Individual" : `${job?.teamSize} Members`}
                    </div>
                    <div className='bg-gray-50 dark:bg-zinc-800/50 text-gray-600 dark:text-zinc-400 border border-gray-100 dark:border-zinc-800 px-3 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2'>
                        <MapPin size={12} />
                        <span className="truncate">{job?.location || 'Online'}</span>
                    </div>
                </div>

                <div className='flex items-center gap-1.5 text-xs font-bold text-gray-500 dark:text-zinc-500 mt-1 pl-1'>
                    <Calendar size={14} className="text-gray-400 dark:text-zinc-600" /> Posted {dateString}
                </div>

                {/* Footer Section */}
                {user?.role !== 'recruiter' && (
                    <div className="mt-auto pt-4 border-t border-gray-50 dark:border-zinc-800/50 flex items-center justify-between gap-4">
                        <div className={`flex-1 h-12 rounded-2xl flex items-center justify-center gap-2 transition-all ${job?.applications?.some(app => (app.applicant?._id || app.applicant) === user?._id || app === user?._id)
                            ? 'bg-emerald-500 text-white'
                            : 'bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 shadow-lg'
                            }`}>
                            <Zap size={14} className={job?.applications?.some(app => (app.applicant?._id || app.applicant) === user?._id || app === user?._id) ? 'fill-current' : ''} />
                            <p className='text-[10px] font-black uppercase tracking-widest'>
                                {(job?.applications?.some(app => (app.applicant?._id || app.applicant) === user?._id || app === user?._id)) ? 'Registered' : 'Register Now'}
                            </p>
                        </div>
                        <div className='flex gap-2 text-gray-400 dark:text-zinc-500'>
                            <button className='w-11 h-11 rounded-xl bg-gray-50 dark:bg-zinc-800 hover:bg-white dark:hover:bg-zinc-700 border border-gray-100 dark:border-zinc-800 hover:border-purple-200 dark:hover:border-purple-900/50 flex items-center justify-center transition-all'>
                                <Share2 size={18} />
                            </button>
                            <LikeButton eventId={job._id} eventType="Hackathon" className="!rounded-xl w-11 h-11 border border-gray-100 dark:border-zinc-800 !bg-gray-50 dark:!bg-zinc-800" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default HackathonCard
