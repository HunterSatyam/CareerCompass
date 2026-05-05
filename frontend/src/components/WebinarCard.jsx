import React from 'react'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { Calendar, Clock, Video, Users, Share2, Heart, ExternalLink } from 'lucide-react'
import { useSelector } from 'react-redux'
import LikeButton from './shared/LikeButton'

const WebinarCard = ({ job }) => {
    const navigate = useNavigate();
    const { user } = useSelector(store => store.auth);

    if (!job) return null;

    // Use job.date for webinar date, defaulting to creation date if not set
    const webinarDate = job?.date ? new Date(job.date) : new Date(job?.createdAt);
    const dateString = webinarDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    const timeString = webinarDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    // Assuming cost is stored in salary, 0 means Free
    const cost = job?.salary === 0 ? "Free" : `₹${job?.salary}`;

    return (
        <div onClick={() => navigate(`/description/webinar/${job._id}`)} className='group bg-white dark:bg-zinc-900 rounded-[28px] p-0 shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-zinc-800 hover:border-blue-500/20 flex flex-col h-full relative overflow-hidden cursor-pointer'>
            {/* Header */}
            <div className="absolute top-4 right-4 z-20">
                <LikeButton eventId={job._id} eventType="Webinar" />
            </div>
            <div className="h-28 bg-blue-600 dark:bg-blue-800 relative p-6 flex justify-between items-start overflow-hidden text-white">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-2xl -ml-10 -mb-10"></div>

                <Badge className="bg-white/20 text-white backdrop-blur-md border-none px-3 py-1.5 rounded-xl font-bold text-[10px] uppercase tracking-wider shadow-sm z-10">
                    <div className='flex items-center gap-1.5'>
                        <Video size={12} />
                        Webinar
                    </div>
                </Badge>
                <Badge className={`${job?.salary === 0 ? 'bg-emerald-400 text-emerald-950 px-4' : 'bg-yellow-400 text-yellow-950 px-3'} border-none py-1.5 rounded-xl font-black text-[10px] uppercase tracking-wider shadow-sm z-10 transition-all`}>
                    {cost}
                </Badge>
            </div>

            <div className="p-6 flex flex-col flex-1 gap-4">
                {/* Logo & Content */}
                <div className="flex gap-5 -mt-12 relative z-20">
                    <div className="p-1 rounded-[16px] bg-white dark:bg-zinc-800 shadow-lg border border-gray-100 dark:border-zinc-700 transition-transform group-hover:scale-105 duration-300">
                        <Avatar className="h-16 w-16 rounded-[12px]">
                            <AvatarImage src={job?.logo || job?.company?.logo} alt={job?.company?.name} className="object-cover" />
                            <AvatarFallback className="rounded-[12px] bg-blue-50 dark:bg-zinc-800 text-blue-600 dark:text-blue-400 font-black text-xl">
                                {job?.company?.name?.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                    <div className='pt-12 min-w-0 flex-1'>
                        <h1 className="font-black text-xl text-gray-900 dark:text-white leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                            {job?.title}
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-zinc-400 font-medium mt-1 line-clamp-1">{job?.company?.name}</p>
                    </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-3 mt-2">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-2xl border border-gray-100 dark:border-zinc-800 transition-colors group/info">
                        <div className='p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400'>
                            <Calendar size={16} />
                        </div>
                        <div>
                            <p className='text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest'>Date</p>
                            <p className='text-xs font-bold text-gray-900 dark:text-zinc-200'>{dateString}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-2xl border border-gray-100 dark:border-zinc-800 transition-colors group/info">
                        <div className='p-2 bg-orange-100 dark:bg-orange-900/30 rounded-xl text-orange-600 dark:text-orange-400'>
                            <Clock size={16} />
                        </div>
                        <div>
                            <p className='text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest'>Time</p>
                            <p className='text-xs font-bold text-gray-900 dark:text-zinc-200'>{timeString}</p>
                        </div>
                    </div>
                </div>

                {/* Footer Section */}
                {user?.role !== 'recruiter' && (
                    <div className="mt-auto pt-4 border-t border-gray-50 dark:border-zinc-800/50">
                        <button className={`w-full h-14 rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all shadow-lg flex items-center justify-center gap-2 group/btn active:scale-95 ${(job?.applications?.some(app => (app.applicant?._id || app.applicant) === user?._id || app === user?._id) ||
                            job?.registrations?.some(app => (app.applicant?._id || app.applicant) === user?._id || app === user?._id))
                            ? 'bg-emerald-500 text-white cursor-not-allowed border-none'
                            : 'bg-black dark:bg-white text-white dark:text-black hover:bg-blue-600 dark:hover:bg-blue-500 shadow-blue-100 dark:shadow-none font-black tracking-widest'
                            }`}>
                            <span>{(job?.applications?.some(app => (app.applicant?._id || app.applicant) === user?._id || app === user?._id) ||
                                job?.registrations?.some(app => (app.applicant?._id || app.applicant) === user?._id || app === user?._id)) ? 'Registration Confirmed' : 'Register Now'}</span>
                            {!((job?.applications?.some(app => (app.applicant?._id || app.applicant) === user?._id || app === user?._id) ||
                                job?.registrations?.some(app => (app.applicant?._id || app.applicant) === user?._id || app === user?._id))) && <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default WebinarCard
