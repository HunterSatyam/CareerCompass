import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { addCompetition } from '@/redux/competitionSlice'
import { setFilters } from '@/redux/jobSlice'
import { COMPETITION_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { Loader2, Sparkles, ArrowRight, Trophy, PlusCircle, X } from 'lucide-react'
import CompetitionCard from './CompetitionCard';
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const LatestCompetition = () => {
    const { allCompetitions } = useSelector(store => store.competition);
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        companyName: '',
        description: '',
        location: '',
        prize: '',
        teamSize: 1,
        type: 'Competition',
        file: null
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleFileChange = (e) => {
        setFormData({ ...formData, file: e.target.files?.[0] });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const payload = new FormData();
            payload.append("title", formData.title);
            payload.append("description", formData.description);
            payload.append("prize", formData.prize);
            payload.append("location", formData.location);
            payload.append("teamSize", Number(formData.teamSize));
            payload.append("companyName", formData.companyName);
            if (formData.file) {
                payload.append("file", formData.file);
            }

            const res = await axios.post(`${COMPETITION_API_END_POINT}/post`, payload, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            });
            if (res.data.success) {
                const updatedJob = res.data.competition;
                dispatch(addCompetition(updatedJob));
                setIsModalOpen(false);
                setFormData({ title: '', companyName: '', description: '', location: '', prize: '', teamSize: 1, type: 'Competition', file: null });
                toast.success("Competition Protocol Deployed!");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Failed to deploy challenge.");
        } finally {
            setLoading(false);
        }
    }

    const competitions = allCompetitions || [];

    return (
        <div className='max-w-7xl mx-auto my-32 px-4 transition-colors duration-300'>
            <div className='flex flex-col md:flex-row justify-between items-end gap-10 mb-16'>
                <div className='space-y-6'>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className='inline-flex items-center gap-2 px-5 py-2 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/40 uppercase tracking-[0.2em] text-[10px] font-black shadow-sm'
                    >
                        <Trophy size={14} />
                        Global Supremacy
                    </motion.div>
                    <h1 className='text-5xl md:text-6xl font-black text-gray-900 dark:text-white leading-tight uppercase tracking-tight'>
                        Open <span className='text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-500 dark:from-amber-400 dark:to-orange-400'>Elite Challenges</span>
                    </h1>
                    <p className='text-gray-500 dark:text-zinc-500 font-medium max-w-lg text-lg'>
                        Manifest your talent, outclass the competition, and secure your place among the legends.
                    </p>
                </div>

                <div className='flex items-center gap-4'>
                    {user?.role === 'recruiter' && (
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className='bg-white dark:bg-zinc-900 text-gray-900 dark:text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest border border-gray-100 dark:border-zinc-800 hover:border-amber-500 transition-all active:scale-95 flex items-center gap-2 shadow-xl dark:shadow-none'
                        >
                            <PlusCircle size={18} /> Deploy Challenge
                        </button>
                    )}
                    <button
                        onClick={() => {
                            dispatch(setFilters({ type: 'Competition' }));
                            navigate("/events");
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className='bg-black dark:bg-white text-white dark:text-black px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-900 dark:hover:bg-gray-100 shadow-xl transition-all active:scale-95 flex items-center gap-2 border-none'
                    >
                        Tournament hub <ArrowRight size={18} />
                    </button>
                </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 my-8'>
                {
                    competitions.length <= 0 ? (
                        <div className="col-span-full py-32 text-center border-2 border-dashed border-gray-100 dark:border-zinc-800 rounded-[48px] bg-white/50 dark:bg-zinc-900/50">
                            <Trophy size={48} className='mx-auto text-gray-300 dark:text-zinc-700 mb-6' />
                            <h3 className='text-xl font-black text-gray-400 dark:text-zinc-600 uppercase tracking-widest'>No active tournaments</h3>
                            <p className='text-gray-400 dark:text-zinc-600 font-bold text-xs mt-2'>Prepare for the next global engagement</p>
                        </div>
                    ) : (
                        competitions.slice(0, 6).map((job, index) => (
                            <motion.div
                                key={job._id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                            >
                                <CompetitionCard job={job} />
                            </motion.div>
                        ))
                    )
                }
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className='fixed inset-0 flex items-center justify-center z-[100] px-4'>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className='absolute inset-0 bg-black/80 backdrop-blur-md'
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className='bg-white dark:bg-zinc-900 p-10 rounded-[48px] w-full max-w-xl shadow-2xl relative z-10 border border-white/50 dark:border-zinc-800 max-h-[90vh] overflow-y-auto custom-scrollbar'
                        >
                            <div className='flex items-center justify-between mb-10'>
                                <div>
                                    <h2 className='text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight'>Competition Parameters</h2>
                                    <p className='text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest mt-1'>Configure tournament protocols</p>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className='p-3 bg-gray-50 dark:bg-zinc-800 rounded-2xl hover:bg-rose-50 dark:hover:bg-rose-900/20 text-gray-400 dark:text-zinc-500 hover:text-rose-600 transition-all'>
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                                <div className='md:col-span-2'>
                                    <label className='block text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-4 ml-2'>Identity Artifact (Logo)</label>
                                    <input
                                        type="file" name="file"
                                        onChange={handleFileChange}
                                        className="w-full text-xs text-gray-500 dark:text-zinc-400 file:mr-6 file:py-3 file:px-6 file:rounded-2xl file:border-0 file:text-[10px] file:font-black file:uppercase file:tracking-widest file:bg-amber-50 dark:file:bg-amber-900/20 file:text-amber-600 dark:file:text-amber-400 hover:file:bg-amber-100 dark:hover:file:bg-amber-900/30 transition-all cursor-pointer border border-dashed border-gray-200 dark:border-zinc-700 p-4 rounded-3xl"
                                        accept="image/*"
                                    />
                                </div>

                                <div className='md:col-span-2'>
                                    <label className='block text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-4 ml-2'>Competition Title</label>
                                    <input
                                        type="text" name="title" placeholder="e.g. Algorithmic Supremacy 2024"
                                        value={formData.title} onChange={handleInputChange} required
                                        className="w-full h-14 bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl px-6 text-sm font-bold text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-zinc-600 focus:ring-2 focus:ring-amber-500/20 transition-all"
                                    />
                                </div>

                                <div className='md:col-span-2'>
                                    <label className='block text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-4 ml-2'>Hosting Authority</label>
                                    <input
                                        type="text" name="companyName" placeholder="Organization"
                                        value={formData.companyName} onChange={handleInputChange} required
                                        className="w-full h-14 bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl px-6 text-sm font-bold text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-zinc-600 focus:ring-2 focus:ring-amber-500/20 transition-all"
                                    />
                                </div>

                                <div className='md:col-span-2'>
                                    <label className='block text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-4 ml-2'>Tournament Scope (Description)</label>
                                    <textarea
                                        name="description" placeholder="Specify format, rounds, and eligibility..."
                                        value={formData.description} onChange={handleInputChange} required
                                        className="w-full h-32 bg-gray-50 dark:bg-zinc-800 border-none rounded-3xl p-6 text-sm font-bold text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-zinc-600 focus:ring-2 focus:ring-amber-500/20 transition-all resize-none"
                                    ></textarea>
                                </div>

                                <div>
                                    <label className='block text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-4 ml-2'>Operation Center (Location)</label>
                                    <input
                                        type="text" name="location" placeholder="Remote / Arena"
                                        value={formData.location} onChange={handleInputChange} required
                                        className="w-full h-14 bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl px-6 text-sm font-bold text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-zinc-600 focus:ring-2 focus:ring-amber-500/20 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className='block text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-4 ml-2'>Reward Matrix (Prize)</label>
                                    <input
                                        type="text" name="prize" placeholder="e.g. ₹ 100k Pool"
                                        value={formData.prize} onChange={handleInputChange} required
                                        className="w-full h-14 bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl px-6 text-sm font-bold text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-zinc-600 focus:ring-2 focus:ring-amber-500/20 transition-all"
                                    />
                                </div>

                                <div className='md:col-span-2'>
                                    <label className='block text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-4 ml-2'>Team capacity (Max Members)</label>
                                    <input
                                        type="number" name="teamSize" placeholder="e.g. 4"
                                        value={formData.teamSize} onChange={handleInputChange} required
                                        className="w-full h-14 bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl px-6 text-sm font-bold text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-zinc-600 focus:ring-2 focus:ring-amber-500/20 transition-all"
                                    />
                                </div>

                                <div className='md:col-span-2 pt-6 flex gap-4'>
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className='flex-1 h-16 rounded-2xl font-black text-xs uppercase tracking-widest text-gray-400 dark:text-zinc-500 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all border border-gray-100 dark:border-zinc-800'
                                    >
                                        Abort
                                    </button>
                                    <button
                                        type="submit"
                                        className='flex-[2] h-16 bg-amber-600 dark:bg-amber-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-amber-200 dark:shadow-none hover:shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-2 border-none'
                                        disabled={loading}
                                    >
                                        {loading ? <Loader2 className='animate-spin' size={18} /> : (
                                            <>Deploy Challenge <Sparkles size={16} /></>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default LatestCompetition
