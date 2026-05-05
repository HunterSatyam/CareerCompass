import React, { useState } from 'react'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Loader2, X, User, Phone, Mail, FileText, Sparkles, CheckCircle2, GraduationCap, Briefcase, Code2, Link as LinkIcon, Plus, Trash2, Github, Linkedin, Globe } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'
import PremiumFileUpload from './shared/PremiumFileUpload'
import { motion, AnimatePresence } from 'framer-motion'

const UpdateProfileDialog = ({ open, setOpen }) => {
    const [loading, setLoading] = useState(false);
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();

    const [input, setInput] = useState({
        fullname: user?.fullname || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
        bio: user?.profile?.bio || "",
        skills: user?.profile?.skills?.join(", ") || "",
        education: user?.profile?.education || [{ college: '', degree: '', year: '', cgpa: '' }],
        experience: user?.profile?.experience || [{ company: '', role: '', duration: '', description: '' }],
        projects: user?.profile?.projects || [{ title: '', description: '', link: '' }],
        socialLinks: user?.profile?.socialLinks || { linkedin: '', github: '', portfolio: '' },
        file: null,
        profilePhoto: null
    });

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const handleSocialChange = (e) => {
        setInput({
            ...input,
            socialLinks: { ...input.socialLinks, [e.target.name]: e.target.value }
        });
    }

    // Dynamic section handlers
    const addSection = (section) => {
        const newItem = section === 'education' ? { college: '', degree: '', year: '', cgpa: '' } :
            section === 'experience' ? { company: '', role: '', duration: '', description: '' } :
                { title: '', description: '', link: '' };
        setInput({ ...input, [section]: [...input[section], newItem] });
    }

    const removeSection = (section, index) => {
        const newList = [...input[section]];
        newList.splice(index, 1);
        setInput({ ...input, [section]: newList });
    }

    const handleSectionChange = (section, index, field, value) => {
        const newList = [...input[section]];
        newList[index] = { ...newList[index], [field]: value };
        setInput({ ...input, [section]: newList });
    }

    const handleResumeSelect = (file) => {
        setInput({ ...input, file });
    }

    const handlePhotoSelect = (file) => {
        setInput({ ...input, profilePhoto: file });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("bio", input.bio);
        formData.append("skills", input.skills);

        formData.append("education", JSON.stringify(input.education.filter(edu => edu.college)));
        formData.append("experience", JSON.stringify(input.experience.filter(exp => exp.company)));
        formData.append("projects", JSON.stringify(input.projects.filter(proj => proj.title)));
        formData.append("socialLinks", JSON.stringify(input.socialLinks));

        if (input.file) {
            formData.append("file", input.file);
        }
        if (input.profilePhoto) {
            formData.append("profilePhoto", input.profilePhoto);
        }
        try {
            setLoading(true);
            const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Update failed");
        } finally {
            setLoading(false);
            setOpen(false);
        }
    }

    if (!open) return null;

    const inputClasses = "w-full bg-gray-50/50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-700 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all font-medium text-gray-700 dark:text-zinc-200 placeholder:text-gray-300 dark:placeholder:text-zinc-600";
    const labelClasses = "block text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-2.5 ml-1";
    const sectionTitleClasses = "flex items-center gap-2 text-sm font-black text-gray-900 dark:text-zinc-100 uppercase tracking-widest mb-6";

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setOpen(false)}
                className="absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white dark:bg-zinc-900 rounded-[40px] shadow-2xl w-full max-w-4xl h-[90vh] relative z-10 overflow-hidden border border-white dark:border-zinc-800"
            >
                {/* Header Decoration */}
                <div className='absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-900 dark:to-indigo-900 -z-10 opacity-90'></div>

                <form onSubmit={submitHandler} className='flex flex-col h-full'>
                    {/* Fixed Header */}
                    <div className='p-8 md:p-10 pb-4 flex flex-shrink-0 items-start justify-between'>
                        <div className='text-white'>
                            <div className='inline-flex items-center gap-2 bg-white/20 dark:bg-black/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-3 backdrop-blur-md border border-white/10'>
                                <Sparkles size={12} /> Account Identity
                            </div>
                            <h2 className="text-3xl font-black tracking-tight">Complete Profile</h2>
                        </div>
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="p-3 bg-white/10 dark:bg-black/20 backdrop-blur-md text-white rounded-2xl hover:bg-white/20 dark:hover:bg-black/30 transition-all border border-white/10"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Scrollable Body */}
                    <div className="flex-1 overflow-y-auto px-8 md:px-10 pb-10 custom-scrollbar space-y-12 dark:bg-zinc-900">
                        {/* Basic Info */}
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mt-4'>
                            <div className='md:col-span-2'>
                                <PremiumFileUpload
                                    onFileSelect={handlePhotoSelect}
                                    label="Profile Picture"
                                    existingFile={user?.profile?.profilePhoto}
                                />
                            </div>

                            <div className='space-y-1.5'>
                                <label className={labelClasses}>Full Name</label>
                                <div className='relative'>
                                    <User className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 dark:text-zinc-600' size={18} />
                                    <input name="fullname" value={input.fullname} onChange={changeEventHandler} className={`${inputClasses} pl-12`} />
                                </div>
                            </div>

                            <div className='space-y-1.5'>
                                <label className={labelClasses}>Phone Number</label>
                                <div className='relative'>
                                    <Phone className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 dark:text-zinc-600' size={18} />
                                    <input name="phoneNumber" value={input.phoneNumber} onChange={changeEventHandler} className={`${inputClasses} pl-12`} />
                                </div>
                            </div>

                            <div className='md:col-span-2 space-y-1.5'>
                                <label className={labelClasses}>Professional Bio</label>
                                <div className='relative'>
                                    <FileText className='absolute left-4 top-4 text-gray-300 dark:text-zinc-600' size={18} />
                                    <textarea name="bio" value={input.bio} onChange={changeEventHandler} rows={2} className={`${inputClasses} pl-12 resize-none`} placeholder="Tell us about yourself..." />
                                </div>
                            </div>
                        </div>

                        {user?.role !== 'recruiter' && (
                            <>
                                {/* Social Links */}
                                <div className='space-y-6'>
                                    <h3 className={sectionTitleClasses}><Globe size={18} className="text-purple-600 dark:text-purple-400" /> Digital Presence</h3>
                                    <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                                        <div className='relative'>
                                            <Linkedin className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 dark:text-zinc-600' size={18} />
                                            <input name="linkedin" value={input.socialLinks.linkedin} onChange={handleSocialChange} placeholder="LinkedIn Profile" className={`${inputClasses} pl-12`} />
                                        </div>
                                        <div className='relative'>
                                            <Github className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 dark:text-zinc-600' size={18} />
                                            <input name="github" value={input.socialLinks.github} onChange={handleSocialChange} placeholder="GitHub Profile" className={`${inputClasses} pl-12`} />
                                        </div>
                                        <div className='relative'>
                                            <LinkIcon className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 dark:text-zinc-600' size={18} />
                                            <input name="portfolio" value={input.socialLinks.portfolio} onChange={handleSocialChange} placeholder="Portfolio Website" className={`${inputClasses} pl-12`} />
                                        </div>
                                    </div>
                                </div>

                                {/* Education Section */}
                                <div className='space-y-6'>
                                    <div className='flex items-center justify-between'>
                                        <h3 className={sectionTitleClasses}><GraduationCap size={18} className="text-blue-500 dark:text-blue-400" /> Academic Background</h3>
                                        <button type="button" onClick={() => addSection('education')} className='p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors'><Plus size={18} /></button>
                                    </div>
                                    <div className='space-y-6'>
                                        {input.education.map((edu, idx) => (
                                            <div key={idx} className='p-6 bg-gray-50/50 dark:bg-zinc-800/30 border border-gray-100 dark:border-zinc-800 rounded-[32px] relative group'>
                                                {input.education.length > 1 && (
                                                    <button type="button" onClick={() => removeSection('education', idx)} className='absolute -top-2 -right-2 p-2 bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 text-rose-500 rounded-xl md:opacity-0 group-hover:opacity-100 transition-all shadow-sm'><Trash2 size={16} /></button>
                                                )}
                                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                                    <input placeholder="College/University Name" value={edu.college} onChange={(e) => handleSectionChange('education', idx, 'college', e.target.value)} className={inputClasses} />
                                                    <input placeholder="Degree (e.g. B.Tech)" value={edu.degree} onChange={(e) => handleSectionChange('education', idx, 'degree', e.target.value)} className={inputClasses} />
                                                    <input placeholder="Graduation Year" value={edu.year} onChange={(e) => handleSectionChange('education', idx, 'year', e.target.value)} className={inputClasses} />
                                                    <input placeholder="CGPA/Percentage" value={edu.cgpa} onChange={(e) => handleSectionChange('education', idx, 'cgpa', e.target.value)} className={inputClasses} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Experience Section */}
                                <div className='space-y-6'>
                                    <div className='flex items-center justify-between'>
                                        <h3 className={sectionTitleClasses}><Briefcase size={18} className="text-emerald-500 dark:text-emerald-400" /> Work Experience</h3>
                                        <button type="button" onClick={() => addSection('experience')} className='p-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors'><Plus size={18} /></button>
                                    </div>
                                    <div className='space-y-6'>
                                        {input.experience.map((exp, idx) => (
                                            <div key={idx} className='p-6 bg-gray-50/50 dark:bg-zinc-800/30 border border-gray-100 dark:border-zinc-800 rounded-[32px] relative group'>
                                                <button type="button" onClick={() => removeSection('experience', idx)} className='absolute -top-2 -right-2 p-2 bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 text-rose-500 rounded-xl md:opacity-0 group-hover:opacity-100 transition-all shadow-sm'><Trash2 size={16} /></button>
                                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                                    <input placeholder="Company Name" value={exp.company} onChange={(e) => handleSectionChange('experience', idx, 'company', e.target.value)} className={inputClasses} />
                                                    <input placeholder="Role / Position" value={exp.role} onChange={(e) => handleSectionChange('experience', idx, 'role', e.target.value)} className={inputClasses} />
                                                    <input placeholder="Duration (e.g. June 2023 - Present)" value={exp.duration} onChange={(e) => handleSectionChange('experience', idx, 'duration', e.target.value)} className={inputClasses} />
                                                    <textarea placeholder="Job Description / Responsibilities" value={exp.description} onChange={(e) => handleSectionChange('experience', idx, 'description', e.target.value)} rows={1} className={`${inputClasses} resize-none`} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Projects Section */}
                                <div className='space-y-6'>
                                    <div className='flex items-center justify-between'>
                                        <h3 className={sectionTitleClasses}><Code2 size={18} className="text-orange-500 dark:text-orange-400" /> Featured Projects</h3>
                                        <button type="button" onClick={() => addSection('projects')} className='p-2 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-xl hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors'><Plus size={18} /></button>
                                    </div>
                                    <div className='space-y-6'>
                                        {input.projects.map((proj, idx) => (
                                            <div key={idx} className='p-6 bg-gray-50/50 dark:bg-zinc-800/30 border border-gray-100 dark:border-zinc-800 rounded-[32px] relative group'>
                                                <button type="button" onClick={() => removeSection('projects', idx)} className='absolute -top-2 -right-2 p-2 bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 text-rose-500 rounded-xl md:opacity-0 group-hover:opacity-100 transition-all shadow-sm'><Trash2 size={16} /></button>
                                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                                    <input placeholder="Project Title" value={proj.title} onChange={(e) => handleSectionChange('projects', idx, 'title', e.target.value)} className={inputClasses} />
                                                    <input placeholder="Live Link / Repository" value={proj.link} onChange={(e) => handleSectionChange('projects', idx, 'link', e.target.value)} className={inputClasses} />
                                                    <textarea placeholder="Brief Project Description" value={proj.description} onChange={(e) => handleSectionChange('projects', idx, 'description', e.target.value)} rows={1} className={`${inputClasses} md:col-span-2 resize-none`} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Skills */}
                                <div className='space-y-1.5'>
                                    <label className={labelClasses}>Technical Skills</label>
                                    <div className='relative'>
                                        <input name="skills" value={input.skills} onChange={changeEventHandler} className={`${inputClasses} pl-12`} placeholder="React, Node.js, Python..." />
                                        <Sparkles className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 dark:text-zinc-600' size={18} />
                                    </div>
                                </div>

                                <div className='pb-4'>
                                    <PremiumFileUpload
                                        onFileSelect={handleResumeSelect}
                                        label="Resume / Portfolio (PDF)"
                                        accept="application/pdf"
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    {/* Fixed Footer */}
                    <div className='p-8 md:p-10 pt-4 border-t border-gray-100 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md flex-shrink-0'>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-16 rounded-3xl bg-black dark:bg-white text-white dark:text-black hover:bg-gray-900 dark:hover:bg-gray-100 shadow-xl dark:shadow-none font-black text-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <Loader2 className='animate-spin' size={24} />
                            ) : (
                                <>
                                    <CheckCircle2 size={24} />
                                    Update Professional Profile
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </motion.div>
        </div>
    )
}

export default UpdateProfileDialog
