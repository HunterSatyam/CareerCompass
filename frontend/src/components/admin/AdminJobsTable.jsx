import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Badge } from '../ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Edit2, Eye, MoreHorizontal, Sparkles, PlusCircle, Trash2 } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import axios from 'axios'
import { toast } from 'sonner'
import { JOB_API_END_POINT } from '@/utils/constant'
import { setAllAdminJobs } from '@/redux/jobSlice'

const AdminJobsTable = () => {
    const { allAdminJobs, searchedQuery } = useSelector(store => store.job);
    const [filterJobs, setFilterJobs] = useState(allAdminJobs);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleDelete = async (jobId) => {
        try {
            const res = await axios.delete(`${JOB_API_END_POINT}/delete/${jobId}`, {
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message);
                dispatch(setAllAdminJobs(allAdminJobs.filter(job => job._id !== jobId)));
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Failed to delete post");
        }
    };

    useEffect(() => {
        const filteredJobs = allAdminJobs.filter((job) => {
            if (!searchedQuery) {
                return true;
            };
            return job?.title?.toLowerCase().includes(searchedQuery.toLowerCase()) ||
                job?.company?.name?.toLowerCase().includes(searchedQuery.toLowerCase()) ||
                job?.jobType?.toLowerCase().includes(searchedQuery.toLowerCase());
        });
        setFilterJobs(filteredJobs);
    }, [allAdminJobs, searchedQuery]);


    return (
        <div className="bg-white dark:bg-zinc-900 rounded-[32px] overflow-hidden border border-gray-100 dark:border-zinc-800 transition-colors duration-300">
            <Table>
                <TableCaption className="pb-6 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-zinc-600">A list of your recently posted opportunities</TableCaption>
                <TableHeader className="bg-gray-50/50 dark:bg-zinc-800/50">
                    <TableRow className="border-b border-gray-100 dark:border-zinc-800">
                        <TableHead className="font-black text-[10px] uppercase tracking-widest text-gray-500 dark:text-zinc-400 py-6 pl-8">Logo</TableHead>
                        <TableHead className="font-black text-[10px] uppercase tracking-widest text-gray-500 dark:text-zinc-400 py-6">Company Name</TableHead>
                        <TableHead className="font-black text-[10px] uppercase tracking-widest text-gray-500 dark:text-zinc-400">Title</TableHead>
                        <TableHead className="font-black text-[10px] uppercase tracking-widest text-gray-500 dark:text-zinc-400">Type</TableHead>
                        <TableHead className="font-black text-[10px] uppercase tracking-widest text-gray-500 dark:text-zinc-400">Date</TableHead>
                        <TableHead className="text-right font-black text-[10px] uppercase tracking-widest text-gray-500 dark:text-zinc-400 pr-8">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        filterJobs?.map((job) => (
                            <TableRow key={job._id} className="border-b border-gray-50 dark:border-zinc-800/50 hover:bg-gray-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                                <TableCell className="pl-8">
                                    <Avatar className="h-10 w-10 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-800 p-1 flex items-center justify-center">
                                        <AvatarImage src={job?.logo || job?.company?.logo} className="object-contain" />
                                        <AvatarFallback className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-bold text-sm rounded-lg w-full h-full flex items-center justify-center">
                                            {job?.company?.name?.charAt(0)?.toUpperCase() || 'C'}
                                        </AvatarFallback>
                                    </Avatar>
                                </TableCell>
                                <TableCell className="py-5 font-black text-sm text-gray-900 dark:text-zinc-100">{job?.company?.name}</TableCell>
                                <TableCell className="text-sm font-bold text-gray-600 dark:text-zinc-400">{job?.title}</TableCell>
                                <TableCell>
                                    <Badge className={`
                                        ${job?.jobType?.toLowerCase() === 'job' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-950/30' :
                                            job?.jobType?.toLowerCase() === 'internship' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-950/30' :
                                                job?.jobType?.toLowerCase() === 'hackathon' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-950/30' :
                                                    job?.jobType?.toLowerCase() === 'webinar' ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-950/30' :
                                                        job?.jobType?.toLowerCase() === 'competition' ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-950/30' :
                                                            job?.jobType?.toLowerCase() === 'certification' ? 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-950/30' :
                                                                'bg-gray-50 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 border-gray-100 dark:border-zinc-700'}
                                        px-3 py-1 rounded-xl border shadow-none font-black text-[10px] uppercase tracking-wider
                                    `}>
                                        {job.jobType}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-[10px] font-black uppercase text-gray-400 dark:text-zinc-600">{job?.createdAt?.split("T")[0]}</TableCell>
                                <TableCell className="text-right pr-8">
                                    <Popover>
                                        <PopoverTrigger className="p-2.5 bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-xl transition-all border border-transparent hover:border-gray-200 dark:hover:border-zinc-600">
                                            <MoreHorizontal size={18} className="text-gray-400 dark:text-zinc-500" />
                                        </PopoverTrigger>
                                        <PopoverContent className="w-48 p-2 rounded-2xl shadow-2xl bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800">
                                            <button
                                                onClick={() => navigate(`/admin/posts/${job._id}/edit`)}
                                                className='flex items-center gap-3 w-full p-3.5 text-xs font-black uppercase tracking-widest text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-xl transition-all group'
                                            >
                                                <Edit2 className='w-4 h-4 group-hover:text-blue-600 transition-colors' />
                                                <span className='group-hover:text-gray-900 dark:group-hover:text-white'>Edit Post</span>
                                            </button>
                                            <button
                                                onClick={() => navigate(`/admin/posts/${job._id}/applicants`)}
                                                className='flex items-center gap-3 w-full p-3.5 text-xs font-black uppercase tracking-widest text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-xl mt-1 transition-all group'
                                            >
                                                <Sparkles className='w-4 h-4 text-purple-600' />
                                                <span className='group-hover:text-purple-600 transition-colors'>Rank Applicants</span>
                                            </button>
                                            <button
                                                onClick={() => navigate(`/admin/posts/${job._id}/assessment`)}
                                                className='flex items-center gap-3 w-full p-3.5 text-xs font-black uppercase tracking-widest text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-xl mt-1 transition-all group'
                                            >
                                                <Edit2 className='w-4 h-4 group-hover:text-emerald-600 transition-colors' />
                                                <span className='group-hover:text-emerald-600 transition-colors'>Assessment</span>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(job._id)}
                                                className='flex items-center gap-3 w-full p-3.5 text-xs font-black uppercase tracking-widest text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl mt-1 transition-all group'
                                            >
                                                <Trash2 className='w-4 h-4 group-hover:text-red-600 transition-colors' />
                                                <span className='group-hover:text-red-600 transition-colors'>Delete Post</span>
                                            </button>
                                        </PopoverContent>
                                    </Popover>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
            {filterJobs.length === 0 && (
                <div className="py-32 text-center bg-gray-50/30 dark:bg-zinc-800/10">
                    <div className='inline-flex p-4 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-300 dark:text-zinc-700 mb-4'>
                        <PlusCircle size={24} />
                    </div>
                    <p className="text-sm font-bold text-gray-400 dark:text-zinc-600 tracking-wide">No opportunities found matching your criteria</p>
                </div>
            )}
        </div>
    )
}

export default AdminJobsTable
