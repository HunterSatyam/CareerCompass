import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { ATS_API_END_POINT, APPLICATION_API_END_POINT } from '@/utils/constant'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { User, Mail, FileText, Download, TrendingUp, Award, Clock, Check, X, Search, Filter, ChevronLeft, Sparkles, Binary } from 'lucide-react'
import Footer from '../shared/Footer'

const Applicants = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [applicants, setApplicants] = useState([]);
    const [jobInfo, setJobInfo] = useState({ title: '', type: '' });
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchRankedApplicants = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${ATS_API_END_POINT}/rank/${params.id}`, { withCredentials: true });
                if (res.data.success) {
                    setApplicants(res.data.applicants);
                    setJobInfo({ title: res.data.jobTitle, type: res.data.jobType });
                }
            } catch (error) {
                console.log(error);
                toast.error("Failed to fetch ranked applicants");
            } finally {
                setLoading(false);
            }
        }
        fetchRankedApplicants();
    }, [params.id]);

    const statusHandler = async (status, id) => {
        try {
            const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${id}/update`, { status }, { withCredentials: true });
            if (res.data.success) {
                toast.success(res.data.message);
                setApplicants(prev => prev.map(app =>
                    app.applicationId === id ? { ...app, status: status.toLowerCase() } : app
                ));
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update status');
        }
    }

    const filteredApplicants = applicants.filter(app =>
        app.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className='min-h-screen bg-[#F8F9FF] dark:bg-black transition-colors duration-300'>
            <Navbar />
            <div className='max-w-7xl mx-auto px-4 md:px-12 py-12'>
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='mb-12'
                >
                    <div className='flex items-center gap-4 mb-6'>
                        <Button
                            variant="ghost"
                            onClick={() => navigate(-1)}
                            className="p-3 bg-white dark:bg-zinc-900 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 transition-all active:scale-95"
                        >
                            <ChevronLeft className="text-gray-900 dark:text-white" size={20} />
                        </Button>
                        <div className='flex items-center gap-3'>
                            <Badge className={`
                                ${jobInfo.type?.toLowerCase() === 'job' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400' :
                                    jobInfo.type?.toLowerCase() === 'internship' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' :
                                        'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'}
                                border-none px-4 py-1.5 font-black text-[10px] uppercase tracking-widest rounded-full shadow-sm
                            `}>
                                {jobInfo.type || 'Opportunity'}
                            </Badge>
                            <span className='text-gray-400 dark:text-zinc-600 font-bold text-[10px] uppercase tracking-widest'>Recruiter Central Dashboard</span>
                        </div>
                    </div>
                    <div className='flex flex-col md:flex-row md:items-end justify-between gap-6'>
                        <div>
                            <h1 className='text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight uppercase leading-tight'>
                                Smart Talent <span className='text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 underline decoration-purple-600/20'>Intelligence</span>
                            </h1>
                            <p className='text-gray-500 dark:text-zinc-500 font-medium mt-4 text-lg'>
                                Analyzing candidates for <span className='text-gray-900 dark:text-white font-black underline decoration-indigo-500/30'>"{jobInfo.title}"</span> using advanced matching.
                            </p>
                        </div>
                        <div className='flex items-center gap-2 px-6 py-3 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-xl dark:shadow-none'>
                            <div className='w-2 h-2 rounded-full bg-emerald-500 animate-pulse'></div>
                            <span className='text-[10px] font-black uppercase tracking-widest text-gray-900 dark:text-white'>ATS Live Ranking</span>
                        </div>
                    </div>
                </motion.div>

                <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
                    {/* Stats Overlay */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className='lg:col-span-1 space-y-6'
                    >
                        <div className='bg-white dark:bg-zinc-900 p-8 rounded-[32px] shadow-sm border border-gray-100 dark:border-zinc-800 group hover:border-blue-500/30 transition-all overflow-hidden relative'>
                            <div className='absolute -right-4 -top-4 w-24 h-24 bg-blue-500/5 rounded-full blur-3xl'></div>
                            <div className='flex items-center gap-3 mb-6'>
                                <div className='p-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform'>
                                    <TrendingUp size={24} />
                                </div>
                                <h3 className='font-black text-[10px] uppercase tracking-widest text-gray-400 dark:text-zinc-500'>Growth Metrics</h3>
                            </div>
                            <div className='flex items-baseline gap-2'>
                                <p className='text-5xl font-black text-gray-900 dark:text-white'>{applicants.length}</p>
                                <span className='text-xs font-bold text-gray-400'>Apps</span>
                            </div>
                            <p className='text-[10px] text-gray-500 dark:text-zinc-500 mt-4 font-black uppercase tracking-widest flex items-center gap-2'>
                                <Binary size={12} className='text-blue-500' /> Total Candidates Analyzed
                            </p>
                        </div>

                        <div className='bg-white dark:bg-zinc-900 p-8 rounded-[32px] shadow-sm border border-gray-100 dark:border-zinc-800 group hover:border-emerald-500/30 transition-all overflow-hidden relative'>
                            <div className='absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/5 rounded-full blur-3xl'></div>
                            <div className='flex items-center gap-3 mb-6'>
                                <div className='p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform'>
                                    <Award size={24} />
                                </div>
                                <h3 className='font-black text-[10px] uppercase tracking-widest text-gray-400 dark:text-zinc-500'>Elite Tier</h3>
                            </div>
                            <div className='flex items-baseline gap-2'>
                                <p className='text-5xl font-black text-emerald-600 dark:text-emerald-400'>
                                    {applicants.length > 0 ? Math.max(...applicants.map(a => a.score)) : 0}%
                                </p>
                                <span className='text-xs font-bold text-gray-400'>Match</span>
                            </div>
                            <p className='text-[10px] text-gray-500 dark:text-zinc-500 mt-4 font-black uppercase tracking-widest flex items-center gap-2'>
                                <Sparkles size={12} className='text-emerald-500' /> Peak Performance Score
                            </p>
                        </div>
                    </motion.div>

                    {/* Table View */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className='lg:col-span-3 bg-white dark:bg-zinc-900 rounded-[32px] shadow-sm border border-gray-100 dark:border-zinc-800 overflow-hidden'
                    >
                        <div className='p-8 border-b border-gray-100 dark:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gray-50/20 dark:bg-white/5'>
                            <div className='flex items-center gap-4 bg-white dark:bg-zinc-800 px-6 py-3.5 rounded-2xl border border-gray-200 dark:border-zinc-700 w-full max-w-md group focus-within:border-purple-500 transition-all'>
                                <Search size={20} className='text-gray-400 dark:text-zinc-500 group-focus-within:text-purple-500' />
                                <input
                                    type="text"
                                    placeholder='Search by name or email...'
                                    className='bg-transparent outline-none text-sm w-full font-bold text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-zinc-600'
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className='flex items-center gap-3'>
                                <Button variant="outline" className='h-12 rounded-2xl gap-3 font-black text-[10px] uppercase tracking-widest border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white shadow-sm'>
                                    <Filter size={16} />
                                    Sort: Relevance
                                </Button>
                            </div>
                        </div>

                        <div className='overflow-x-auto'>
                            {loading ? (
                                <div className='h-[500px] flex flex-col items-center justify-center gap-6'>
                                    <div className='relative'>
                                        <div className='w-20 h-20 border-4 border-purple-500/20 border-t-purple-600 rounded-full animate-spin'></div>
                                        <Sparkles className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-purple-600' size={24} />
                                    </div>
                                    <div className='text-center'>
                                        <h3 className='text-gray-900 dark:text-white font-black uppercase tracking-widest text-sm mb-2'>AI Analysis Engine Active</h3>
                                        <p className='text-gray-400 dark:text-zinc-600 font-bold uppercase tracking-widest text-[10px]'>Processing data models & ranking resumes...</p>
                                    </div>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader className="bg-gray-50/50 dark:bg-zinc-800/30">
                                        <TableRow className="hover:bg-transparent border-b border-gray-100 dark:border-zinc-800">
                                            <TableHead className="font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em] text-[10px] py-8 pl-10">Rank</TableHead>
                                            <TableHead className="font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em] text-[10px]">Information</TableHead>
                                            <TableHead className="font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em] text-[10px]">Precision Score</TableHead>
                                            <TableHead className="font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em] text-[10px]">Core Matrix</TableHead>
                                            <TableHead className="font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em] text-[10px]">Artifacts</TableHead>
                                            <TableHead className="text-right font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em] text-[10px] pr-10">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredApplicants.map((item, index) => {
                                            const originalRank = applicants.findIndex(a => a.applicationId === item.applicationId) + 1;
                                            return (
                                                <TableRow key={item.applicationId} className="group hover:bg-gray-50/50 dark:hover:bg-white/5 transition-all duration-300 border-b border-gray-50 dark:border-zinc-800/50 last:border-0">
                                                    <TableCell className="py-8 pl-10">
                                                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm relative transition-all group-hover:scale-110 ${originalRank === 1 ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 shadow-lg shadow-amber-200/20' : originalRank === 2 ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : originalRank === 3 ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' : 'bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-zinc-600'}`}>
                                                            {originalRank === 1 && <Sparkles className='absolute -top-1 -right-1 text-amber-500' size={14} />}
                                                            {originalRank}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-4">
                                                            <div className="h-12 w-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-[18px] flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-black text-lg border border-indigo-100 dark:border-indigo-800 shadow-sm">
                                                                {item.fullname?.charAt(0)}
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="font-black text-gray-900 dark:text-white leading-tight text-base group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{item.fullname}</span>
                                                                <div className='flex items-center gap-2 mt-1'>
                                                                    <Mail size={10} className='text-gray-400' />
                                                                    <span className="text-[10px] text-gray-400 dark:text-zinc-500 font-bold lowercase">{item.email}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className='flex flex-col gap-2'>
                                                            <div className='flex items-center justify-between'>
                                                                <span className={`font-black text-[10px] uppercase tracking-widest ${item.score >= 70 ? 'text-emerald-600 dark:text-emerald-400' : item.score >= 40 ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400'}`}>
                                                                    {item.score}% Compatibility
                                                                </span>
                                                            </div>
                                                            <div className='w-24 bg-gray-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden border border-gray-200 dark:border-zinc-700 shadow-inner'>
                                                                <motion.div
                                                                    initial={{ width: 0 }}
                                                                    animate={{ width: `${item.score}%` }}
                                                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                                                    className={`h-full ${item.score >= 70 ? 'bg-gradient-to-r from-emerald-500 to-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.3)]' : item.score >= 40 ? 'bg-gradient-to-r from-amber-500 to-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.3)]' : 'bg-gradient-to-r from-rose-500 to-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.3)]'}`}
                                                                ></motion.div>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className='flex flex-wrap gap-1.5 max-w-[240px]'>
                                                            {item.matchedKeywords?.slice(0, 3).map((kw, i) => (
                                                                <Badge key={i} className="bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-none px-2.5 py-1 text-[9px] font-black uppercase tracking-wider rounded-lg shadow-sm">
                                                                    {kw}
                                                                </Badge>
                                                            ))}
                                                            {item.skills?.filter(s => !item.matchedKeywords?.includes(s.toLowerCase())).slice(0, 2).map((s, i) => (
                                                                <Badge key={i} className="bg-gray-50 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 border border-gray-200 dark:border-zinc-700 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider rounded-lg">
                                                                    {s}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        {item.resume ? (
                                                            <a href={item.resume} target='_blank' rel='noreferrer' className='flex items-center justify-center w-10 h-10 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl transition-all hover:scale-110 hover:shadow-lg border border-indigo-100 dark:border-indigo-800 group/link' title="Download Protocol Artifacts">
                                                                <Download size={18} className='group-hover/link:animate-bounce' />
                                                            </a>
                                                        ) : (
                                                            <div className='flex items-center gap-2 text-gray-300 dark:text-zinc-700 font-black text-[10px] uppercase tracking-widest'>
                                                                <X size={12} /> Unknown
                                                            </div>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-right pr-10">
                                                        <div className='flex items-center justify-end gap-3'>
                                                            {item.status === 'pending' ? (
                                                                <div className='flex gap-2.5 translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300'>
                                                                    <Button
                                                                        onClick={() => statusHandler('accepted', item.applicationId)}
                                                                        className='bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 text-white rounded-xl h-10 px-4 font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-emerald-200/30 active:scale-95 border-none'
                                                                    >
                                                                        <Check size={14} className='mr-2' /> Approve
                                                                    </Button>
                                                                    <Button
                                                                        onClick={() => statusHandler('rejected', item.applicationId)}
                                                                        variant="outline"
                                                                        className='border-rose-100 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/10 rounded-xl h-10 px-4 font-black text-[10px] uppercase tracking-[0.2em] active:scale-95 bg-white dark:bg-zinc-900'
                                                                    >
                                                                        <X size={14} className='mr-2' /> Deny
                                                                    </Button>
                                                                </div>
                                                            ) : (
                                                                <div className='flex items-center gap-2'>
                                                                    <Badge className={`${item.status === 'accepted' ? 'bg-emerald-400/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' : 'bg-rose-400/10 text-rose-600 dark:text-rose-400 border-rose-500/20'} px-5 py-2 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-sm animate-in fade-in zoom-in duration-500`}>
                                                                        System: {item.status}
                                                                    </Badge>
                                                                    {item.status === 'accepted' && (
                                                                        <Button
                                                                            onClick={() => statusHandler('rejected', item.applicationId)}
                                                                            variant="outline"
                                                                            className='border-rose-100 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/10 rounded-xl h-10 px-4 font-black text-[10px] uppercase tracking-[0.2em] active:scale-95 bg-white dark:bg-zinc-900 ml-2'
                                                                        >
                                                                            <X size={14} className='mr-2' /> Withdraw
                                                                        </Button>
                                                                    )}
                                                                    {item.status === 'rejected' && (
                                                                        <Button
                                                                            onClick={() => statusHandler('pending', item.applicationId)}
                                                                            variant="outline"
                                                                            className='border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-xl h-10 px-4 font-black text-[10px] uppercase tracking-[0.2em] active:scale-95 bg-white dark:bg-zinc-900 ml-2'
                                                                        >
                                                                            <Clock size={14} className='mr-2' /> Withdraw
                                                                        </Button>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            )}
                            {!loading && applicants.length === 0 && (
                                <div className='py-32 text-center bg-gray-50/20 dark:bg-black/20'>
                                    <div className='w-20 h-20 bg-gray-50 dark:bg-zinc-800 rounded-[32px] flex items-center justify-center mx-auto mb-6 border border-gray-100 dark:border-zinc-700/50 shadow-inner'>
                                        <User className='text-gray-300 dark:text-zinc-600' size={40} />
                                    </div>
                                    <h3 className='text-gray-900 dark:text-white font-black uppercase tracking-widest text-base mb-2'>Zero Candidates Found</h3>
                                    <p className='text-gray-400 dark:text-zinc-500 font-bold uppercase tracking-widest text-[10px]'>Wait for organic growth or adjust your posting's reach.</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Applicants
