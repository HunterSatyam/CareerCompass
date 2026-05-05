import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
    Briefcase, MapPin, IndianRupee,
    FileText, Sparkles, CheckCircle2,
    Loader2, ArrowRight, Building2,
    Users, Clock, Trophy
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Navbar from '../shared/Navbar'
import PremiumFileUpload from '../shared/PremiumFileUpload'
import axios from 'axios'
import { JOB_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addJob } from '@/redux/jobSlice'

const PostJob = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        title: '',
        companyName: '',
        description: '',
        requirements: '',
        location: '',
        salary: '',
        experience: 0,
        position: 1,
        jobType: 'Job',
        file: null
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileSelect = (file) => {
        setFormData(prev => ({ ...prev, file }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = new FormData();
            Object.keys(formData).forEach(key => {
                if (formData[key] !== null && formData[key] !== '') {
                    payload.append(key, formData[key]);
                }
            });

            // Explicitly set date for jobs
            payload.append("date", new Date().toISOString().split('T')[0]);

            const res = await axios.post(`${JOB_API_END_POINT}/post`, payload, {
                withCredentials: true
            });

            if (res.data.success) {
                toast.success("Job Posted Successfully!");
                if (res.data.job) dispatch(addJob(res.data.job));
                navigate('/admin/posts');
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Internal Server Error");
        } finally {
            setLoading(false);
        }
    };

    const inputBase = "w-full bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-all font-bold text-gray-700 dark:text-zinc-100 placeholder:text-gray-300 dark:placeholder:text-zinc-600 shadow-sm hover:border-gray-200 dark:hover:border-zinc-600";
    const labelBase = "block text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-4 ml-2";

    return (
        <div className='min-h-screen bg-[#F8F9FF] dark:bg-black transition-colors duration-300 pb-24'>
            <Navbar />

            <div className='max-w-5xl mx-auto px-4 mt-16'>
                {/* Header Section */}
                <div className='bg-black dark:bg-zinc-900 rounded-[48px] p-10 md:p-16 mb-16 text-white relative overflow-hidden shadow-2xl dark:shadow-none border border-white/5 dark:border-zinc-800'>
                    <div className='absolute -top-24 -right-24 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px]'></div>
                    <div className='absolute -bottom-24 -left-24 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px]'></div>

                    <div className='relative z-10 flex flex-col md:flex-row items-center justify-between gap-12'>
                        <div className='text-center md:text-left'>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className='inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-blue-300 font-black text-[10px] uppercase tracking-widest mb-8 border border-white/10 backdrop-blur-md'
                            >
                                <Sparkles size={14} className='fill-current' /> Talent Acquisition Protocol
                            </motion.div>
                            <h1 className='text-5xl md:text-6xl font-black mb-6 tracking-tight uppercase leading-tight'>Draft Your <span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400'>Legacy</span></h1>
                            <p className='text-gray-400 dark:text-zinc-500 font-medium text-lg max-w-xl'>Define the future of your organization by connecting with the world's most talented innovators.</p>
                        </div>
                        <div className='shrink-0 p-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[40px] shadow-inner group'>
                            <Briefcase size={80} className='text-blue-500 transition-transform group-hover:scale-110 duration-500 drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]' />
                        </div>
                    </div>
                </div>

                {/* Form Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='bg-white dark:bg-zinc-900 rounded-[48px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.06)] dark:shadow-none border border-white dark:border-zinc-800 p-10 md:p-16'
                >
                    <form onSubmit={handleSubmit} className='space-y-16'>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
                            {/* Row 1 */}
                            <div className='md:col-span-2'>
                                <label className={labelBase}>Job Title</label>
                                <input type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g. Lead Software Engineer (React)" required className={inputBase} />
                            </div>

                            {/* Row 2 */}
                            <div>
                                <label className={labelBase}>Company Name</label>
                                <div className='relative'>
                                    <Building2 className='absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 dark:text-zinc-600' size={18} />
                                    <input type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} placeholder="Your Organization" required className={`${inputBase} pl-12`} />
                                </div>
                            </div>
                            <div>
                                <label className={labelBase}>Work Location</label>
                                <div className='relative'>
                                    <MapPin className='absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 dark:text-zinc-600' size={18} />
                                    <input type="text" name="location" value={formData.location} onChange={handleInputChange} placeholder="Remote, Mumbai, etc." required className={`${inputBase} pl-12`} />
                                </div>
                            </div>

                            {/* Row 3 */}
                            <div className='md:col-span-2'>
                                <label className={labelBase}>Job Description</label>
                                <textarea name="description" value={formData.description} onChange={handleInputChange} rows={6} placeholder="Describe the role, responsibilities, and team culture..." required className={`${inputBase} resize-none`} />
                            </div>

                            {/* Row 4 */}
                            <div>
                                <label className={labelBase}>Salary Package (LPA)</label>
                                <div className='relative'>
                                    <IndianRupee className='absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 dark:text-zinc-600' size={18} />
                                    <input type="number" name="salary" value={formData.salary} onChange={handleInputChange} placeholder="Example: 12" required className={`${inputBase} pl-12`} />
                                </div>
                            </div>
                            <div>
                                <label className={labelBase}>Experience Required (Years)</label>
                                <div className='relative'>
                                    <Clock className='absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 dark:text-zinc-600' size={18} />
                                    <input type="number" name="experience" value={formData.experience} onChange={handleInputChange} placeholder="0 for Freshers" required className={`${inputBase} pl-12`} />
                                </div>
                            </div>

                            {/* Row 5 */}
                            <div>
                                <label className={labelBase}>Number of Positions</label>
                                <div className='relative'>
                                    <Users className='absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 dark:text-zinc-600' size={18} />
                                    <input type="number" name="position" value={formData.position} onChange={handleInputChange} placeholder="Total openings" required className={`${inputBase} pl-12`} />
                                </div>
                            </div>
                            <div>
                                <label className={labelBase}>Employment Type</label>
                                <div className='relative'>
                                    <Briefcase className='absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 dark:text-zinc-600' size={18} />
                                    <select name="jobType" value={formData.jobType} onChange={handleInputChange} className={`${inputBase} pl-12 appearance-none cursor-pointer [color-scheme:light] dark:[color-scheme:dark]`}>
                                        <option value="Job">Full-time Job</option>
                                        <option value="Internship">Internship</option>
                                        <option value="Contract">Contract</option>
                                        <option value="Freelance">Freelance</option>
                                    </select>
                                </div>
                            </div>

                            {/* Row 6 */}
                            <div className='md:col-span-2'>
                                <label className={labelBase}>Technical Requirements & Skills</label>
                                <div className='relative'>
                                    <Sparkles className='absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 dark:text-zinc-600' size={18} />
                                    <input type="text" name="requirements" value={formData.requirements} onChange={handleInputChange} placeholder="React, Tailwind, Node.js (Comma separated)" required className={`${inputBase} pl-12`} />
                                </div>
                            </div>

                            {/* Row 7 */}
                            <div className='md:col-span-2'>
                                <PremiumFileUpload onFileSelect={handleFileSelect} label="Deployment Artifact (Logo/Banner)" />
                            </div>
                        </div>

                        {/* Submit Actions */}
                        <div className='pt-12 flex flex-col md:flex-row items-center gap-8 border-t border-gray-100 dark:border-zinc-800'>
                            <Button
                                type="submit"
                                disabled={loading}
                                className='w-full md:flex-1 h-24 text-xl font-black uppercase tracking-[0.2em] rounded-[32px] bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 shadow-2xl transition-all active:scale-95 disabled:bg-gray-200 dark:disabled:bg-zinc-800 disabled:text-gray-400 border-none relative overflow-hidden group'
                            >
                                <div className='absolute inset-0 bg-gradient-to-r from-blue-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity'></div>
                                {loading ? (
                                    <div className='flex items-center gap-4'>
                                        <Loader2 className='animate-spin' size={32} />
                                        <span>Publishing...</span>
                                    </div>
                                ) : (
                                    <div className='flex items-center gap-4'>
                                        <CheckCircle2 size={28} />
                                        <span>Deploy Opening</span>
                                    </div>
                                )}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate('/admin/posts')}
                                className='w-full md:w-[240px] h-24 rounded-[32px] border-2 border-gray-100 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 font-black uppercase tracking-[0.2em] text-gray-400 text-sm transition-all bg-white dark:bg-zinc-900'
                            >
                                Abort Editor
                            </Button>
                        </div>
                    </form>
                </motion.div>

                {/* Footer Tips */}
                <div className='mt-16 grid grid-cols-1 md:grid-cols-3 gap-8'>
                    {[
                        { icon: <FileText className='text-blue-500' />, title: 'Clarity wins', desc: 'Be specific about deliverables to attract quality candidates.' },
                        { icon: <Trophy className='text-amber-500' />, title: 'Fair package', desc: 'Competitive salary listings get 3x more applications.' },
                        { icon: <Sparkles className='text-purple-500' />, title: 'Culture matters', desc: 'Mention perks and your company mission to stand out.' }
                    ].map((tip, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -5 }}
                            className='bg-white dark:bg-zinc-900 p-8 rounded-[32px] border border-gray-100 dark:border-zinc-800 shadow-sm flex items-start gap-5 transition-all'
                        >
                            <div className='p-4 bg-gray-50 dark:bg-zinc-800 rounded-2xl border border-gray-100 dark:border-zinc-700'>{tip.icon}</div>
                            <div>
                                <h4 className='font-black text-gray-900 dark:text-white mb-2 text-sm uppercase tracking-wider'>{tip.title}</h4>
                                <p className='text-xs text-gray-500 dark:text-zinc-500 font-medium leading-relaxed'>{tip.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default PostJob
