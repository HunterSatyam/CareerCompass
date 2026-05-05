import React, { useState, useEffect } from 'react';
import Navbar from '../shared/Navbar';
import axios from 'axios';
import { ASSESSMENT_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Loader2, Search, Trophy, Video, X, Calendar, Clock, Link2, FileText, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AssessmentResults = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Interview modal state
    const [showInterviewModal, setShowInterviewModal] = useState(false);
    const [selectedApplicant, setSelectedApplicant] = useState(null);
    const [interviewForm, setInterviewForm] = useState({
        interviewDate: '',
        interviewTime: '',
        meetingLink: '',
        notes: ''
    });
    const [sendingInvite, setSendingInvite] = useState(false);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const res = await axios.get(`${ASSESSMENT_API_END_POINT}/results`, { withCredentials: true });
                if (res.data.success) {
                    setResults(res.data.results);
                }
            } catch (error) {
                console.error(error);
                toast.error("Failed to load assessment results");
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, []);

    const filteredResults = results.filter(r => 
        r?.applicantId?.fullname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r?.jobId?.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const openInterviewModal = (result) => {
        setSelectedApplicant(result);
        setInterviewForm({
            interviewDate: '',
            interviewTime: '',
            meetingLink: '',
            notes: ''
        });
        setShowInterviewModal(true);
    };

    const handleScheduleInterview = async (e) => {
        e.preventDefault();
        if (!interviewForm.interviewDate || !interviewForm.interviewTime) {
            toast.error("Date and Time are required.");
            return;
        }

        setSendingInvite(true);
        try {
            const res = await axios.post(`${ASSESSMENT_API_END_POINT}/schedule-interview`, {
                applicantEmail: selectedApplicant?.applicantId?.email,
                applicantName: selectedApplicant?.applicantId?.fullname,
                jobTitle: selectedApplicant?.jobId?.title,
                interviewDate: interviewForm.interviewDate,
                interviewTime: interviewForm.interviewTime,
                meetingLink: interviewForm.meetingLink,
                notes: interviewForm.notes
            }, { withCredentials: true });

            if (res.data.success) {
                toast.success("Interview invitation sent successfully!");
                setShowInterviewModal(false);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to send interview invitation.");
        } finally {
            setSendingInvite(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F8F9FF] dark:bg-black flex justify-center items-center transition-colors duration-300">
                <Loader2 className="animate-spin text-purple-600 w-12 h-12" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8F9FF] dark:bg-black transition-colors duration-300 pb-20">
            <Navbar />
            <div className="max-w-7xl mx-auto mt-10 px-4 md:px-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
                            <Trophy className="text-purple-600" size={32} />
                            Assessment Results
                        </h1>
                        <p className="text-gray-500 dark:text-zinc-400 font-bold text-sm uppercase tracking-widest mt-2">
                            Ranking table based on applicant test scores
                        </p>
                    </div>

                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search by name or job..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 dark:focus:border-purple-400 outline-none transition-all font-bold text-gray-700 dark:text-zinc-100"
                        />
                    </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 rounded-[32px] overflow-hidden border border-gray-100 dark:border-zinc-800 transition-colors duration-300">
                    <Table>
                        <TableCaption className="pb-6 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-zinc-600">
                            A list of applicants and their assessment scores
                        </TableCaption>
                        <TableHeader className="bg-gray-50/50 dark:bg-zinc-800/50">
                            <TableRow className="border-b border-gray-100 dark:border-zinc-800">
                                <TableHead className="font-black text-[10px] uppercase tracking-widest text-gray-500 dark:text-zinc-400 py-6 pl-8">Rank</TableHead>
                                <TableHead className="font-black text-[10px] uppercase tracking-widest text-gray-500 dark:text-zinc-400">Applicant</TableHead>
                                <TableHead className="font-black text-[10px] uppercase tracking-widest text-gray-500 dark:text-zinc-400">Job Title</TableHead>
                                <TableHead className="font-black text-[10px] uppercase tracking-widest text-gray-500 dark:text-zinc-400">Score</TableHead>
                                <TableHead className="font-black text-[10px] uppercase tracking-widest text-gray-500 dark:text-zinc-400">Date</TableHead>
                                <TableHead className="font-black text-[10px] uppercase tracking-widest text-gray-500 dark:text-zinc-400 text-right pr-8">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredResults.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-20 text-gray-400 dark:text-zinc-600 font-bold uppercase tracking-widest">
                                        No results found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredResults.map((result, idx) => (
                                    <TableRow key={result._id} className="border-b border-gray-50 dark:border-zinc-800/50 hover:bg-gray-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                                        <TableCell className="pl-8">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm
                                                ${idx === 0 ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' : 
                                                idx === 1 ? 'bg-gray-200 text-gray-600 dark:bg-gray-800 dark:text-gray-400' : 
                                                idx === 2 ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' : 
                                                'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400'}`}
                                            >
                                                #{idx + 1}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3 py-3">
                                                <Avatar className="h-10 w-10 border border-gray-100 dark:border-zinc-800 shadow-sm">
                                                    <AvatarImage src={result?.applicantId?.profile?.profilePhoto} />
                                                    <AvatarFallback className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-bold">
                                                        {result?.applicantId?.fullname?.charAt(0) || 'U'}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-bold text-sm text-gray-900 dark:text-zinc-100">{result?.applicantId?.fullname}</p>
                                                    <p className="text-xs text-gray-500 dark:text-zinc-500">{result?.applicantId?.email}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <p className="font-bold text-sm text-gray-700 dark:text-zinc-300">{result?.jobId?.title}</p>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30 font-black px-3 py-1">
                                                {result?.score} / {result?.maxScore}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-xs font-bold text-gray-500 dark:text-zinc-500">
                                            {new Date(result?.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right pr-8">
                                            <Button
                                                onClick={() => openInterviewModal(result)}
                                                variant="outline"
                                                className="border-purple-200 dark:border-purple-900/40 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-xl h-9 px-4 font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all"
                                            >
                                                <Video size={14} className="mr-2" /> Interview
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Interview Scheduling Modal */}
            <AnimatePresence>
                {showInterviewModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                        onClick={() => setShowInterviewModal(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-zinc-800 w-full max-w-lg overflow-hidden"
                        >
                            {/* Modal Header */}
                            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 relative">
                                <button
                                    onClick={() => setShowInterviewModal(false)}
                                    className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/20 rounded-full p-1.5 transition-colors"
                                >
                                    <X size={16} />
                                </button>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                                        <Video className="text-white" size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-white text-xl font-black tracking-tight">Schedule Interview</h2>
                                        <p className="text-white/70 text-sm font-medium">Face-to-face interview invitation</p>
                                    </div>
                                </div>
                            </div>

                            {/* Applicant Info */}
                            <div className="px-6 pt-5">
                                <div className="flex items-center gap-3 bg-gray-50 dark:bg-zinc-800 rounded-2xl p-4 border border-gray-100 dark:border-zinc-700">
                                    <Avatar className="h-12 w-12 border-2 border-purple-200 dark:border-purple-900">
                                        <AvatarImage src={selectedApplicant?.applicantId?.profile?.profilePhoto} />
                                        <AvatarFallback className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-bold text-lg">
                                            {selectedApplicant?.applicantId?.fullname?.charAt(0) || 'U'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-black text-gray-900 dark:text-white text-sm truncate">{selectedApplicant?.applicantId?.fullname}</p>
                                        <p className="text-xs text-gray-500 dark:text-zinc-400 truncate">{selectedApplicant?.applicantId?.email}</p>
                                    </div>
                                    <Badge className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30 font-black px-3 py-1 shrink-0">
                                        {selectedApplicant?.score}/{selectedApplicant?.maxScore}
                                    </Badge>
                                </div>
                            </div>

                            {/* Interview Form */}
                            <form onSubmit={handleScheduleInterview} className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest mb-2">
                                            <Calendar size={12} className="inline mr-1.5" />Date *
                                        </label>
                                        <input
                                            type="date"
                                            required
                                            value={interviewForm.interviewDate}
                                            onChange={(e) => setInterviewForm({ ...interviewForm, interviewDate: e.target.value })}
                                            className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl py-3 px-4 text-sm font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest mb-2">
                                            <Clock size={12} className="inline mr-1.5" />Time *
                                        </label>
                                        <input
                                            type="time"
                                            required
                                            value={interviewForm.interviewTime}
                                            onChange={(e) => setInterviewForm({ ...interviewForm, interviewTime: e.target.value })}
                                            className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl py-3 px-4 text-sm font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest mb-2">
                                        <Link2 size={12} className="inline mr-1.5" />Meeting Link (Zoom / Google Meet)
                                    </label>
                                    <input
                                        type="text"
                                        value={interviewForm.meetingLink}
                                        onChange={(e) => setInterviewForm({ ...interviewForm, meetingLink: e.target.value })}
                                        placeholder="https://meet.google.com/abc-xyz-123"
                                        className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl py-3 px-4 text-sm font-medium text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-600 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest mb-2">
                                        <FileText size={12} className="inline mr-1.5" />Notes for Applicant
                                    </label>
                                    <textarea
                                        value={interviewForm.notes}
                                        onChange={(e) => setInterviewForm({ ...interviewForm, notes: e.target.value })}
                                        placeholder="e.g. Please bring your portfolio, ID proof..."
                                        rows={3}
                                        className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl py-3 px-4 text-sm font-medium text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-600 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all resize-none"
                                    />
                                </div>

                                <div className="flex items-center gap-3 pt-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setShowInterviewModal(false)}
                                        className="flex-1 rounded-xl h-12 font-bold border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={sendingInvite}
                                        className="flex-1 rounded-xl h-12 font-black bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg shadow-purple-200 dark:shadow-none uppercase tracking-widest text-[10px]"
                                    >
                                        {sendingInvite ? (
                                            <Loader2 className="animate-spin mr-2" size={16} />
                                        ) : (
                                            <Send size={14} className="mr-2" />
                                        )}
                                        {sendingInvite ? 'Sending...' : 'Send Invitation'}
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AssessmentResults;
