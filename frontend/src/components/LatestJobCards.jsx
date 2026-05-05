import React from 'react'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { Briefcase, MapPin, Clock, Share2, Heart, Banknote } from 'lucide-react'

const LatestJobCards = ({ job }) => {
    const navigate = useNavigate();

    if (!job) return null;

    return (
        <div onClick={() => navigate(`/description/job/${job._id}`)} className='p-6 rounded-[24px] shadow-sm hover:shadow-2xl transition-all duration-500 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 cursor-pointer relative group flex flex-col h-full gap-5'>
            {/* Top Section: Title, Company, Logo */}
            <div className='flex justify-between items-start gap-4'>
                <div className='flex-1 min-w-0'>
                    <h1 className='text-xl font-black text-gray-900 dark:text-white leading-tight group-hover:text-[#6A38C2] dark:group-hover:text-purple-400 transition-colors line-clamp-2'>{job?.title}</h1>
                    <p className='text-sm font-bold text-red-600 dark:text-red-400 mt-2'>{job?.company?.name}</p>
                </div>
                <Avatar className="h-16 w-16 rounded-2xl border border-gray-100 dark:border-zinc-700 bg-white dark:bg-zinc-800 shadow-sm p-1.5 shrink-0">
                    <AvatarImage src={job?.logo || job?.company?.logo} className="object-contain w-full h-full rounded-xl" />
                    <AvatarFallback className="rounded-xl text-lg bg-gray-50 dark:bg-zinc-700 font-black text-gray-500 dark:text-zinc-400 uppercase">{job?.company?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
            </div>

            {/* Meta Info: Experience, Type, Location */}
            <div className='flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-400 dark:text-zinc-500 font-bold uppercase tracking-wider'>
                <div className='flex items-center gap-1.5'>
                    <Briefcase className='w-3.5 h-3.5' />
                    <span>{job?.experienceLevel === 0 ? "Fresher" : `${job?.experienceLevel}+ Years`}</span>
                </div>
                <span className='w-1 h-1 bg-gray-300 dark:bg-zinc-700 rounded-full hidden sm:block'></span>
                <div className='flex items-center gap-1.5'>
                    <Clock className='w-3.5 h-3.5' />
                    <span>{job?.jobType}</span>
                </div>
                <span className='w-1 h-1 bg-gray-300 dark:bg-zinc-700 rounded-full hidden sm:block'></span>
                <div className='flex items-center gap-1.5'>
                    <MapPin className='w-3.5 h-3.5' />
                    <span>{job?.location || "India"}</span>
                </div>
            </div>

            {/* Description/Skills Line */}
            <p className='text-sm text-gray-500 dark:text-zinc-400 font-medium line-clamp-2 leading-relaxed'>
                {job?.description}
            </p>

            {/* Action Row: Tags & Salary */}
            <div className='flex items-center justify-between gap-4 mt-auto'>
                <div className='flex flex-wrap gap-2'>
                    <Badge className='bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border border-purple-100 dark:border-purple-800/50 px-3 py-1.5 rounded-xl font-black text-[10px] uppercase' variant="secondary">
                        {job?.position} Positions
                    </Badge>
                </div>

                <Badge className='bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/50 px-3 py-1.5 rounded-xl font-black text-[10px] uppercase flex items-center gap-1.5' variant="secondary">
                    <Banknote className="w-3.5 h-3.5" />
                    {job?.salary} LPA
                </Badge>
            </div>

            {/* Footer: Date & Social Actions */}
            <div className='flex items-center justify-between pt-5 mt-2 border-t border-gray-50 dark:border-zinc-800'>
                <span className='text-[10px] font-black text-gray-400 dark:text-zinc-600 uppercase tracking-widest'>
                    Posted {job?.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Recently'}
                </span>
                <div className='flex gap-2'>
                    <button className='text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all p-2 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20'><Share2 className='w-5 h-5' /></button>
                    <button className='text-gray-400 hover:text-rose-500 dark:hover:text-rose-400 transition-all p-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-900/20'><Heart className='w-5 h-5' /></button>
                </div>
            </div>
        </div>
    )
}

export default LatestJobCards