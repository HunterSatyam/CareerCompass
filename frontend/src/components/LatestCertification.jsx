import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { addCertification } from '@/redux/certificationSlice'
import { setFilters } from '@/redux/jobSlice'
import { CERTIFICATION_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { Loader2, Sparkles, ArrowRight, Award, PlusCircle, X } from 'lucide-react'
import CertificationCard from './CertificationCard';
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const LatestCertification = () => {
    const { allCertifications } = useSelector(store => store.certification);
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
        duration: '',
        level: 'Beginner',
        type: 'Certification',
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
            payload.append("duration", formData.duration);
            payload.append("level", formData.level);
            payload.append("companyName", formData.companyName);
            if (formData.file) {
                payload.append("file", formData.file);
            }

            const res = await axios.post(`${CERTIFICATION_API_END_POINT}/post`, payload, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            });
            if (res.data.success) {
                const updatedJob = res.data.certification;
                dispatch(addCertification(updatedJob));
                setIsModalOpen(false);
                setFormData({ title: '', companyName: '', description: '', location: 'Online', fee: '', duration: '', level: 'Beginner', type: 'Certification', file: null });
                toast.success("Certification Protocol Verified!");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Failed to deploy certification.");
        } finally {
            setLoading(false);
        }
    }

    const certifications = allCertifications || [];

    return (
        <div className='max-w-7xl mx-auto my-32 px-4 transition-colors duration-300'>
            <div className='flex flex-col md:flex-row justify-between items-end gap-10 mb-16'>
                <div className='space-y-6'>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className='inline-flex items-center gap-2 px-5 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40 uppercase tracking-[0.2em] text-[10px] font-black shadow-sm'
                    >
                        <Award size={14} />
                        Verified Credentials
                    </motion.div>
                    <h1 className='text-5xl md:text-6xl font-black text-gray-900 dark:text-white leading-tight uppercase tracking-tight'>
                        Featured <span className='text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500 dark:from-indigo-400 dark:to-violet-400'>Elite Paths</span>
                    </h1>
                    <p className='text-gray-500 dark:text-zinc-500 font-medium max-w-lg text-lg'>
                        Forge your expertise with globally recognized validation. Premium learning for the advanced tier.
                    </p>
                </div>

                <div className='flex items-center gap-4'>
                    {user?.role === 'recruiter' && (
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className='bg-white dark:bg-zinc-900 text-gray-900 dark:text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest border border-gray-100 dark:border-zinc-800 hover:border-indigo-500 transition-all active:scale-95 flex items-center gap-2 shadow-xl dark:shadow-none'
                        >
                            <PlusCircle size={18} /> Provision Path
                        </button>
                    )}
                    <button
                        onClick={() => {
                            dispatch(setFilters({ type: 'Certification' }));
                            navigate("/events");
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className='bg-black dark:bg-white text-white dark:text-black px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-900 dark:hover:bg-gray-100 shadow-xl transition-all active:scale-95 flex items-center gap-2 border-none'
                    >
                        Neural network Hub <ArrowRight size={18} />
                    </button>
                </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 my-8'>
                {
                    certifications.length <= 0 ? (
                        <div className="col-span-full py-32 text-center border-2 border-dashed border-gray-100 dark:border-zinc-800 rounded-[48px] bg-white/50 dark:bg-zinc-900/50">
                            <Award size={48} className='mx-auto text-gray-300 dark:text-zinc-700 mb-6' />
                            <h3 className='text-xl font-black text-gray-400 dark:text-zinc-600 uppercase tracking-widest'>No verification paths active</h3>
                            <p className='text-gray-400 dark:text-zinc-600 font-bold text-xs mt-2'>Wait for the next credential cycle</p>
                        </div>
                    ) : (
                        certifications.slice(0, 6).map((job, index) => (
                            <motion.div
                                key={job._id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                            >
                                <CertificationCard job={job} />
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
                                    <h2 className='text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight'>Provision Certification</h2>
                                    <p className='text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest mt-1'>Configure credentialing protocols</p>
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
                                        className="w-full text-xs text-gray-500 dark:text-zinc-400 file:mr-6 file:py-3 file:px-6 file:rounded-2xl file:border-0 file:text-[10px] file:font-black file:uppercase file:tracking-widest file:bg-indigo-50 dark:file:bg-indigo-900/20 file:text-indigo-600 dark:file:text-indigo-400 hover:file:bg-indigo-100 dark:hover:file:bg-indigo-900/30 transition-all cursor-pointer border border-dashed border-gray-200 dark:border-zinc-700 p-4 rounded-3xl"
                                        accept="image/*"
                                    />
                                </div>

                                <div className='md:col-span-2'>
                                    <label className='block text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-4 ml-2'>Certification Title</label>
                                    <input
                                        type="text" name="title" placeholder="e.g. AWS Solutions Architect"
                                        value={formData.title} onChange={handleInputChange} required
                                        className="w-full h-14 bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl px-6 text-sm font-bold text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-zinc-600 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                    />
                                </div>

                                <div className='md:col-span-2'>
                                    <label className='block text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-4 ml-2'>Issuing Authority</label>
                                    <input
                                        type="text" name="companyName" placeholder="Organization"
                                        value={formData.companyName} onChange={handleInputChange} required
                                        className="w-full h-14 bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl px-6 text-sm font-bold text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-zinc-600 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                    />
                                </div>

                                <div className='md:col-span-2'>
                                    <label className='block text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-4 ml-2'>Curriculum Scope (Description)</label>
                                    <textarea
                                        name="description" placeholder="Specify key modules and outcomes..."
                                        value={formData.description} onChange={handleInputChange} required
                                        className="w-full h-32 bg-gray-50 dark:bg-zinc-800 border-none rounded-3xl p-6 text-sm font-bold text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-zinc-600 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none"
                                    ></textarea>
                                </div>

                                <div>
                                    <label className='block text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-4 ml-2'>Access Fee (0 = Free)</label>
                                    <input
                                        type="number" name="fee" placeholder="₹"
                                        value={formData.fee} onChange={handleInputChange} required
                                        className="w-full h-14 bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl px-6 text-sm font-bold text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-zinc-600 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className='block text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-4 ml-2'>Temporal Duration (Weeks)</label>
                                    <input
                                        type="text" name="duration" placeholder="e.g. 12 Weeks"
                                        value={formData.duration} onChange={handleInputChange} required
                                        className="w-full h-14 bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl px-6 text-sm font-bold text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-zinc-600 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                    />
                                </div>

                                <div className='md:col-span-2'>
                                    <label className='block text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-4 ml-2'>Difficulty Tier</label>
                                    <select
                                        name="level"
                                        value={formData.level}
                                        onChange={handleInputChange}
                                        className="w-full h-14 bg-gray-50 dark:bg-zinc-800 border-none rounded-2xl px-6 text-sm font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 transition-all [color-scheme:light] dark:[color-scheme:dark]"
                                    >
                                        <option value="Beginner">Beginner</option>
                                        <option value="Intermediate">Intermediate</option>
                                        <option value="Advanced">Advanced</option>
                                        <option value="Expert">Expert</option>
                                    </select>
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
                                        className='flex-[2] h-16 bg-indigo-600 dark:bg-indigo-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-200 dark:shadow-none hover:shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-2 border-none'
                                        disabled={loading}
                                    >
                                        {loading ? <Loader2 className='animate-spin' size={18} /> : (
                                            <>Provision Path <Sparkles size={16} /></>
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

export default LatestCertification
