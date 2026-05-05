import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Badge } from './ui/badge'
import { useSelector, useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import { Calendar, Building2, Briefcase, CheckCircle2, Clock, XCircle, Code2, Video, Trophy, GraduationCap, Trash2 } from 'lucide-react'
import axios from 'axios'
import { APPLICATION_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { setAllAppliedJobs } from '@/redux/jobSlice'

const AppliedJobTable = () => {
    const { allAppliedJobs } = useSelector(store => store.job);
    const dispatch = useDispatch();

    const handleWithdraw = async (applicationId) => {
        try {
            const res = await axios.delete(`${APPLICATION_API_END_POINT}/withdraw/${applicationId}`, {
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message);
                dispatch(setAllAppliedJobs(allAppliedJobs.filter(app => app._id !== applicationId)));
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to withdraw application.");
        }
    };

    const getStatusStyle = (status) => {
        switch (status.toLowerCase()) {
            case 'accepted': return 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30';
            case 'rejected': return 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/30';
            default: return 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/30';
        }
    }

    const getStatusIcon = (status) => {
        switch (status.toLowerCase()) {
            case 'accepted': return <CheckCircle2 size={12} />;
            case 'rejected': return <XCircle size={12} />;
            default: return <Clock size={12} />;
        }
    }

    const getTypeIcon = (type) => {
        switch (type?.toLowerCase()) {
            case 'job': return <Briefcase size={16} />;
            case 'internship': return <Briefcase size={16} />;
            case 'hackathon': return <Code2 size={16} />;
            case 'webinar': return <Video size={16} />;
            case 'competition': return <Trophy size={16} />;
            case 'certification': return <GraduationCap size={16} />;
            default: return <Briefcase size={16} />;
        }
    }

    const getTypeColor = (type) => {
        switch (type?.toLowerCase()) {
            case 'job': return 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400';
            case 'internship': return 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400';
            case 'hackathon': return 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400';
            case 'webinar': return 'bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-zinc-300';
            case 'competition': return 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400';
            case 'certification': return 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400';
            default: return 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400';
        }
    }

    return (
        <div className='overflow-x-auto'>
            <Table>
                <TableHeader className="bg-gray-50/50 dark:bg-zinc-800/30">
                    <TableRow className="hover:bg-transparent border-0">
                        <TableHead className="font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest text-[10px] py-6 pl-8">Applied Date</TableHead>
                        <TableHead className="font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest text-[10px]">Position / Role</TableHead>
                        <TableHead className="font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest text-[10px]">Company</TableHead>
                        <TableHead className="text-right font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest text-[10px]">Current Status</TableHead>
                        <TableHead className="text-right font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest text-[10px] pr-8">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        allAppliedJobs.length <= 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-32 text-center text-gray-400 dark:text-zinc-600 font-medium">
                                    You haven't applied to any opportunities yet.
                                </TableCell>
                            </TableRow>
                        ) : allAppliedJobs.map((appliedJob, index) => (
                            <motion.tr
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                key={appliedJob._id}
                                className="group hover:bg-gray-50/50 dark:hover:bg-zinc-800/30 transition-colors border-b border-gray-50 dark:border-zinc-800 last:border-0"
                            >
                                <TableCell className="py-5 pl-8">
                                    <div className='flex items-center gap-2 text-gray-500 dark:text-zinc-400 font-bold text-xs'>
                                        <Calendar size={14} className="text-gray-300 dark:text-zinc-600" />
                                        {appliedJob?.createdAt?.split("T")[0]}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className='flex items-center gap-2'>
                                        <div className={`p-2 rounded-lg group-hover:scale-110 transition-transform ${getTypeColor(appliedJob.applicationType)}`}>
                                            {getTypeIcon(appliedJob.applicationType)}
                                        </div>
                                        <div className='flex flex-col'>
                                            <span className="font-bold text-gray-900 dark:text-zinc-100">{appliedJob.job?.title}</span>
                                            <span className='text-[8px] font-black uppercase tracking-tighter opacity-50 dark:text-white dark:opacity-30'>{appliedJob.applicationType}</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className='flex items-center gap-2 text-gray-600 dark:text-zinc-400 font-medium'>
                                        <Building2 size={14} className="text-gray-300 dark:text-zinc-600" />
                                        {appliedJob.job?.company?.name}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Badge className={`${getStatusStyle(appliedJob.status)} px-3 py-1.5 rounded-full border shadow-none font-black text-[10px] uppercase tracking-widest inline-flex`}>
                                        <div className='flex items-center gap-1.5'>
                                            {getStatusIcon(appliedJob.status)}
                                            {appliedJob.status.toUpperCase()}
                                        </div>
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right pr-8">
                                    <button 
                                        onClick={() => handleWithdraw(appliedJob._id)}
                                        className="p-2 rounded-xl text-red-500 bg-red-50 hover:bg-red-100 dark:text-red-400 dark:bg-red-900/20 dark:hover:bg-red-900/40 transition-colors inline-flex"
                                        title="Withdraw Application"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </TableCell>
                            </motion.tr>
                        ))
                    }
                </TableBody>
            </Table>
        </div>
    )
}

export default AppliedJobTable