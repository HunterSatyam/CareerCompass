import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { addWebinar } from '@/redux/webinarSlice'
import { setFilters } from '@/redux/jobSlice'
import { WEBINAR_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { Loader2, Sparkles, ArrowRight, Video, PlusCircle, X } from 'lucide-react'
import WebinarCard from './WebinarCard';
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const LatestWebinar = () => {
    const { allWebinars } = useSelector(store => store.webinar);
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        companyName: '',
        description: '',
        location: 'Online',
        fee: '',
        speaker: '',
        date: '',
        time: '',
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
            payload.append("fee", Number(formData.fee));
            payload.append("speaker", formData.speaker);
            payload.append("companyName", formData.companyName);

            const dateTime = formData.date && formData.time ? `${formData.date}T${formData.time}` : new Date().toISOString();
            payload.append("date", dateTime);

            if (formData.file) {
                payload.append("file", formData.file);
            }

            const res = await axios.post(`${WEBINAR_API_END_POINT}/post`, payload, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            });
            if (res.data.success) {
                const updatedJob = res.data.webinar;
                dispatch(addWebinar(updatedJob));
                setIsModalOpen(false);
                setFormData({
                    title: '', companyName: '', description: '', location: 'Online',
                    fee: '', speaker: '',
                    date: '', time: '', file: null
                });
                toast.success("Webinar Stream Deployed Successfully!");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Failed to deploy broadcast.");
        } finally {
            setLoading(false);
        }
    }

    const webinars = allWebinars || [];

    return (
        <div className='max-w-7xl mx-auto my-32 px-4 transition-colors duration-300'>
            <div className='flex flex-col md:flex-row justify-between items-end gap-10 mb-16'>
                <div className='space-y-6'>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className='inline-flex items-center gap-2 px-5 py-2 rounded-full bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/40 uppercase tracking-[0.2em] text-[10px] font-black shadow-sm'
                    >
                        <Video size={14} />
                        Direct Broadcast
                    </motion.div>
                    <h1 className='text-5xl md:text-6xl font-black text-gray-900 dark:text-white leading-tight uppercase tracking-tight'>
                        Global <span className='text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-pink-500 dark:from-rose-400 dark:to-pink-400'>Insight webinars</span>
                    </h1>
                    <p className='text-gray-500 dark:text-zinc-500 font-medium max-w-lg text-lg'>
                        Connect with industry titans in real-time. High-bandwidth learning for professional mastery.
                    </p>
                </div>

                <div className='flex items-center gap-4'>
                    {user?.role === 'recruiter' && (
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className='bg-white dark:bg-zinc-900 text-gray-900 dark:text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest border border-gray-100 dark:border-zinc-800 hover:border-rose-500 transition-all active:scale-95 flex items-center gap-2 shadow-xl dark:shadow-none'
                        >
                            <PlusCircle size={18} /> Schedule Broadcast
                        </button>
                    )}
                    <button
                        onClick={() => {
                            dispatch(setFilters({ type: 'Webinars' }));
                            navigate("/events");
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className='bg-black dark:bg-white text-white dark:text-black px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-900 dark:hover:bg-gray-100 shadow-xl transition-all active:scale-95 flex items-center gap-2 border-none'
                    >
                        Archive Access <ArrowRight size={18} />
                    </button>
                </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 my-8'>
                {
                    webinars.length <= 0 ? (
                        <div className="col-span-full py-32 text-center border-2 border-dashed border-gray-100 dark:border-zinc-800 rounded-[48px] bg-white/50 dark:bg-zinc-900/50">
                            <Video size={48} className='mx-auto text-gray-300 dark:text-zinc-700 mb-6' />
                            <h3 className='text-xl font-black text-gray-400 dark:text-zinc-600 uppercase tracking-widest'>No live streams scheduled</h3>
                            <p className='text-gray-400 dark:text-zinc-600 font-bold text-xs mt-2'>Stay tuned for future transmissions</p>
                        </div>
                    ) : (
                        webinars.slice(0, 6).map((job, index) => (
                            <motion.div
                                key={job._id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                            >
                                <WebinarCard job={job} />
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
                                    <h2 className='text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight'>Broadcast Request</h2>
                                    <p className='text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest mt-1'>Configure live stream parameters</p>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className='p-3 bg-gray-50 dark:bg-zinc-800 rounded-2xl hover:bg-rose-50 dark:hover:bg-rose-900/20 text-gray-400 dark:text-zinc-500 hover:text-rose-600 transition-all'>
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                                <div className='md:col-span-2'>
                                    <label className='block text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-4 ml-2'>Visual ID (Banner)</label>
                                    <input
                                        type="file" name="file"
                                        onChange={handleFileChange}
                                        className="w-full text-xs text-gray-500 dark:text-zinc-400 file:mr-6 file:py-3 file:px-6 file:rounded-2xl file:border-0 file:text-[10px] file:font-black file:uppercase file:tracking-widest file:bg-rose-50 dark:file:bg-rose-900/20 file:text-rose-600 dark:file:text-rose-400 hover:file:bg-rose-100 dark:hover:file:bg-rose-900/30 transition-all cursor-pointer border border-dashed border-gray-200 dark:border-zinc-700 p-4 rounded-3xl"
                                        accept="image/*"
                                    />
                                </div>

                                <div className='md:col-span-2'>
                                    <label className='block text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-4 ml-2'>Webinar Heading</label>
                                    <input
                                        type="text" name="title" placeholder="e.g. Masterclass on Neural Networks"
                                        value={formData.title} onChange={handleInputChange} required
                                        className="w-full h-14 bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl px-6 text-sm font-bold text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-zinc-600 focus:ring-2 focus:ring-rose-500/20 transition-all"
                                    />
                                </div>

                                <div className='md:col-span-2'>
                                    <label className='block text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-4 ml-2'>Broadcasting Entity</label>
                                    <input
                                        type="text" name="companyName" placeholder="Organization"
                                        value={formData.companyName} onChange={handleInputChange} required
                                        className="w-full h-14 bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl px-6 text-sm font-bold text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-zinc-600 focus:ring-2 focus:ring-rose-500/20 transition-all"
                                    />
                                </div>

                                <div className='md:col-span-2'>
                                    <label className='block text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-4 ml-2'>Segment Overview (Description)</label>
                                    <textarea
                                        name="description" placeholder="Specify key takeaways and prerequisites..."
                                        value={formData.description} onChange={handleInputChange} required
                                        className="w-full h-32 bg-gray-50 dark:bg-zinc-800 border-none rounded-3xl p-6 text-sm font-bold text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-zinc-600 focus:ring-2 focus:ring-rose-500/20 transition-all resize-none"
                                    ></textarea>
                                </div>

                                <div>
                                    <label className='block text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-4 ml-2'>Sychronization (Date)</label>
                                    <input
                                        type="date" name="date"
                                        value={formData.date} onChange={handleInputChange} required
                                        className="w-full h-14 bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl px-6 text-sm font-bold text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-zinc-600 focus:ring-2 focus:ring-rose-500/20 transition-all [color-scheme:light] dark:[color-scheme:dark]"
                                    />
                                </div>

                                <div>
                                    <label className='block text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-4 ml-2'>Start Time</label>
                                    <input
                                        type="time" name="time"
                                        value={formData.time} onChange={handleInputChange} required
                                        className="w-full h-14 bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl px-6 text-sm font-bold text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-zinc-600 focus:ring-2 focus:ring-rose-500/20 transition-all [color-scheme:light] dark:[color-scheme:dark]"
                                    />
                                </div>

                                <div className='md:col-span-1'>
                                    <label className='block text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-4 ml-2'>Lead Speaker</label>
                                    <input
                                        type="text" name="speaker" placeholder="Speaker Name"
                                        value={formData.speaker} onChange={handleInputChange} required
                                        className="w-full h-14 bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl px-6 text-sm font-bold text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-zinc-600 focus:ring-2 focus:ring-rose-500/20 transition-all"
                                    />
                                </div>

                                <div className='md:col-span-1'>
                                    <label className='block text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-4 ml-2'>Access Fee (0 = Free)</label>
                                    <input
                                        type="number" name="fee" placeholder="₹"
                                        value={formData.fee} onChange={handleInputChange} required
                                        className="w-full h-14 bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl px-6 text-sm font-bold text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-zinc-600 focus:ring-2 focus:ring-rose-500/20 transition-all"
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
                                        className='flex-[2] h-16 bg-rose-600 dark:bg-rose-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-rose-200 dark:shadow-none hover:shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-2 border-none'
                                        disabled={loading}
                                    >
                                        {loading ? <Loader2 className='animate-spin' size={18} /> : (
                                            <>Authorize Broadcast <Sparkles size={16} /></>
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

export default LatestWebinar
