import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Loader2, Save, MapPin, IndianRupee, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Navbar from '../shared/Navbar'
import PremiumFileUpload from '../shared/PremiumFileUpload'
import axios from 'axios'
import { JOB_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addJob } from '@/redux/jobSlice'

const UpdatePost = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    // Defaulting to Job, as full generic support would require querying all 6 APIs if type isn't provided.
    // For this implementation, we will assume updating regular jobs is the primary use case.
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        requirements: '',
        location: '',
        salary: '',
        experienceLevel: 0,
        position: '',
        jobType: 'Job',
        file: null
    });

    useEffect(() => {
        const fetchJob = async () => {
            try {
                // Fetch job details
                const res = await axios.get(`${JOB_API_END_POINT}/get/${id}`, { withCredentials: true });
                if (res.data.success) {
                    const job = res.data.job;
                    setFormData({
                        title: job.title || '',
                        description: job.description || '',
                        requirements: job.requirements ? job.requirements.join(',') : '',
                        location: job.location || '',
                        salary: job.salary || '',
                        experienceLevel: job.experienceLevel || 0,
                        position: job.position || '',
                        jobType: job.jobType || 'Job',
                        file: null
                    });
                }
            } catch (error) {
                toast.error("Failed to fetch post details. Make sure it's a regular Job post.");
            } finally {
                setFetching(false);
            }
        };
        fetchJob();
    }, [id]);

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

            const res = await axios.post(`${JOB_API_END_POINT}/update/${id}`, payload, {
                withCredentials: true
            });

            if (res.data.success) {
                toast.success("Post Updated Successfully!");
                navigate('/admin/posts');
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Internal Server Error");
        } finally {
            setLoading(false);
        }
    };

    const inputBase = "w-full bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 dark:focus:border-purple-400 outline-none transition-all font-bold text-gray-700 dark:text-zinc-100 placeholder:text-gray-300 dark:placeholder:text-zinc-600 shadow-sm hover:border-gray-200 dark:hover:border-zinc-600";
    const labelBase = "block text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-4 ml-2";

    if (fetching) return <div className="min-h-screen bg-[#F8F9FF] dark:bg-black flex justify-center items-center"><Loader2 className="animate-spin text-purple-600 w-12 h-12" /></div>;

    return (
        <div className='min-h-screen bg-[#F8F9FF] dark:bg-black transition-colors duration-300 pb-24'>
            <Navbar />

            <div className='max-w-4xl mx-auto px-4 mt-16'>
                <button
                    onClick={() => navigate(-1)}
                    className='flex items-center gap-3 text-gray-400 dark:text-zinc-500 hover:text-purple-600 dark:hover:text-purple-400 font-black text-[10px] uppercase tracking-[0.2em] mb-12 transition-all group'
                >
                    <div className='p-3 bg-white dark:bg-zinc-800 rounded-2xl group-hover:bg-purple-50 dark:group-hover:bg-purple-900/20 transition-all'>
                        <ArrowLeft size={20} />
                    </div>
                    Back to Posts
                </button>

                <div className='bg-white dark:bg-zinc-900 rounded-[48px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.08)] dark:shadow-none border border-white/50 dark:border-zinc-800 p-10 md:p-16 relative overflow-hidden'>
                    <div className='absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-[100px] -mr-32 -mt-32'></div>

                    <div className='flex items-center gap-6 mb-16 pb-12 border-b border-gray-100 dark:border-zinc-800'>
                        <div className='w-20 h-20 bg-black dark:bg-white text-white dark:text-black rounded-[28px] flex items-center justify-center text-3xl shadow-2xl relative'>
                            <Sparkles />
                        </div>
                        <div>
                            <h2 className='text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tight'>Edit Post</h2>
                            <p className='text-gray-400 dark:text-zinc-500 font-black text-xs uppercase tracking-[0.2em] mt-2'>Update your existing opportunity</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className='space-y-10'>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                            <div className='md:col-span-2'>
                                <label className={labelBase}>Event/Job Title</label>
                                <input type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g. Senior Frontend Developer" required className={inputBase} />
                            </div>

                            <div className='md:col-span-1'>
                                <label className={labelBase}>Job Type</label>
                                <input type="text" name="jobType" value={formData.jobType} onChange={handleInputChange} placeholder="e.g. Job" required className={inputBase} />
                            </div>

                            <div className='md:col-span-1'>
                                <label className={labelBase}>Location</label>
                                <div className='relative'>
                                    <MapPin className='absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 dark:text-zinc-600' size={18} />
                                    <input type="text" name="location" value={formData.location} onChange={handleInputChange} placeholder="Remote or City" required className={`${inputBase} pl-12`} />
                                </div>
                            </div>

                            <div className='md:col-span-2'>
                                <label className={labelBase}>Full Description</label>
                                <textarea name="description" value={formData.description} onChange={handleInputChange} rows={4} placeholder="Detailed overview of the opportunity..." required className={`${inputBase} resize-none`} />
                            </div>

                            <div>
                                <label className={labelBase}>Salary (LPA) / Stipend</label>
                                <div className='relative'>
                                    <IndianRupee className='absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 dark:text-zinc-600' size={18} />
                                    <input type="number" name="salary" value={formData.salary} onChange={handleInputChange} placeholder="e.g. 12" className={`${inputBase} pl-12`} />
                                </div>
                            </div>
                            <div>
                                <label className={labelBase}>Experience Level (Years)</label>
                                <input type="number" name="experienceLevel" value={formData.experienceLevel} onChange={handleInputChange} placeholder="0 for freshers" className={inputBase} />
                            </div>
                            <div>
                                <label className={labelBase}>No. of Positions</label>
                                <input type="number" name="position" value={formData.position} onChange={handleInputChange} placeholder="e.g. 5" className={inputBase} />
                            </div>

                            <div className='md:col-span-2'>
                                <label className={labelBase}>Requirements (Comma Separated)</label>
                                <input type="text" name="requirements" value={formData.requirements} onChange={handleInputChange} placeholder="React, Node.js, Problem Solving" className={inputBase} />
                            </div>

                            <div className='md:col-span-2'>
                                <PremiumFileUpload onFileSelect={handleFileSelect} label="Update Image or Logo (Optional)" />
                            </div>
                        </div>

                        <div className='pt-12 flex flex-col md:flex-row gap-6'>
                            <Button
                                type="submit"
                                disabled={loading}
                                className='flex-1 h-20 text-xl font-black uppercase tracking-[0.2em] rounded-[24px] bg-black dark:bg-white text-white dark:text-black hover:bg-gray-900 dark:hover:bg-gray-100 shadow-xl transition-all active:scale-95 disabled:bg-gray-200 dark:disabled:bg-zinc-800 disabled:text-gray-400 border-none flex justify-center items-center'
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className='animate-spin mr-3' size={28} />
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <Save size={24} className="mr-3" />
                                        Save Changes
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default UpdatePost
