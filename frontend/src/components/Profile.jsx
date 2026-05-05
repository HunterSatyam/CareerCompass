import React, { useState } from 'react'
import Navbar from './shared/Navbar'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Contact, Mail, Pen, Briefcase, GraduationCap, MapPin, Globe, FileText, Sparkles, Github, Linkedin, ExternalLink, Code2, Settings } from 'lucide-react'
import { Badge } from './ui/badge'
import RecruiterApplicationsTable from './RecruiterApplicationsTable'
import UpdateProfileDialog from './UpdateProfileDialog'
import { useSelector } from 'react-redux'
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs'
import useGetRecruiterApplications from '@/hooks/useGetRecruiterApplications'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const Profile = () => {
    useGetAppliedJobs();
    useGetRecruiterApplications();
    const [open, setOpen] = useState(false);
    const { user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const isResume = user?.profile?.resume;

    const sections = {
        education: user?.profile?.education || [],
        experience: user?.profile?.experience || [],
        projects: user?.profile?.projects || [],
        socials: user?.profile?.socialLinks || {}
    };

    return (
        <div className="min-h-screen bg-[#F8F9FF] dark:bg-black transition-colors duration-300">
            <Navbar />

            {/* Header / Cover Section */}
            <div className='relative h-64 w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-800 dark:from-purple-900 dark:via-zinc-900 dark:to-zinc-950 overflow-hidden'>
                <div className='absolute inset-0 opacity-20'>
                    <div className='absolute top-0 left-0 w-96 h-96 bg-white dark:bg-purple-500 rounded-full mix-blend-overlay filter blur-3xl -translate-x-1/2 -translate-y-1/2'></div>
                    <div className='absolute bottom-0 right-0 w-96 h-96 bg-purple-300 dark:bg-indigo-500 rounded-full mix-blend-overlay filter blur-3xl translate-x-1/2 translate-y-1/2'></div>
                </div>
                <div className='absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#F8F9FF] dark:from-black to-transparent'></div>
            </div>

            <div className='max-w-6xl mx-auto px-4 -mt-32 relative z-10 pb-20'>
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>

                    {/* Left Column: Profile Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className='lg:col-span-1'
                    >
                        <div className='bg-white dark:bg-zinc-900 rounded-[40px] p-8 shadow-xl dark:shadow-none shadow-purple-100/50 border border-white dark:border-zinc-800 sticky top-24'>
                            <div className='flex flex-col items-center text-center'>
                                <div className='relative group'>
                                    <div className='absolute inset-0 bg-gradient-to-tr from-purple-600 to-pink-500 rounded-[32px] blur-lg opacity-20 group-hover:opacity-40 transition-opacity'></div>
                                    <Avatar className="h-32 w-32 rounded-[28px] border-4 border-white dark:border-zinc-800 shadow-xl relative">
                                        <AvatarImage src={user?.profile?.profilePhoto} alt="profile" />
                                        <AvatarFallback className="bg-purple-50 dark:bg-zinc-800 text-purple-600 dark:text-purple-400 text-3xl font-black">{user?.fullname?.charAt(0)?.toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <Button
                                        onClick={() => setOpen(true)}
                                        size="icon"
                                        className="absolute -bottom-2 -right-2 bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700 text-gray-900 dark:text-white rounded-2xl shadow-lg border border-gray-100 dark:border-zinc-700 transition-transform hover:scale-110"
                                    >
                                        <Pen size={16} />
                                    </Button>
                                    <Button
                                        onClick={() => navigate("/settings")}
                                        size="icon"
                                        className="absolute -bottom-2 -left-2 bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700 text-indigo-600 dark:text-indigo-400 rounded-2xl shadow-lg border border-gray-100 dark:border-zinc-700 transition-transform hover:scale-110"
                                    >
                                        <Settings size={16} />
                                    </Button>
                                </div>

                                <div className='mt-6'>
                                    <h1 className='text-3xl font-black text-gray-900 dark:text-white tracking-tight'>{user?.fullname}</h1>
                                    <div className='flex items-center justify-center gap-1.5 mt-2 text-purple-600 dark:text-purple-400 font-bold uppercase tracking-widest text-[10px] bg-purple-50 dark:bg-purple-900/20 px-3 py-1 rounded-full'>
                                        <Sparkles size={12} />
                                        {user?.role === 'recruiter' ? 'Recruiter' : 'Applicant Professional'}
                                    </div>
                                    <p className='mt-4 text-gray-500 dark:text-zinc-400 font-medium leading-relaxed'>{user?.profile?.bio || "No bio added yet."}</p>
                                </div>
                            </div>

                            {/* Social Links */}
                            {user?.role !== 'recruiter' && (
                                <div className='flex items-center justify-center gap-3 mt-6'>
                                    {sections.socials.linkedin && (
                                        <a href={sections.socials.linkedin} target="_blank" rel="noreferrer" className='p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl hover:scale-110 transition-transform shadow-sm'>
                                            <Linkedin size={20} />
                                        </a>
                                    )}
                                    {sections.socials.github && (
                                        <a href={sections.socials.github} target="_blank" rel="noreferrer" className='p-3 bg-gray-900 dark:bg-zinc-800 text-white dark:text-zinc-100 rounded-2xl hover:scale-110 transition-transform shadow-sm'>
                                            <Github size={20} />
                                        </a>
                                    )}
                                    {sections.socials.portfolio && (
                                        <a href={sections.socials.portfolio} target="_blank" rel="noreferrer" className='p-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-2xl hover:scale-110 transition-transform shadow-sm'>
                                            <Globe size={20} />
                                        </a>
                                    )}
                                </div>
                            )}

                            <div className='mt-10 space-y-4 pt-8 border-t border-gray-50 dark:border-zinc-800'>
                                <div className='flex items-center gap-4 group'>
                                    <div className='p-3 bg-gray-50 dark:bg-zinc-800 rounded-2xl text-gray-400 group-hover:bg-purple-50 dark:group-hover:bg-purple-900/20 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors'>
                                        <Mail size={20} />
                                    </div>
                                    <div className='flex flex-col min-w-0'>
                                        <span className='text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest'>Email</span>
                                        <span className='text-gray-900 dark:text-zinc-200 font-bold truncate tracking-tight'>{user?.email}</span>
                                    </div>
                                </div>

                                <div className='flex items-center gap-4 group'>
                                    <div className='p-3 bg-gray-50 dark:bg-zinc-800 rounded-2xl text-gray-400 group-hover:bg-purple-50 dark:group-hover:bg-purple-900/20 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors'>
                                        <Contact size={20} />
                                    </div>
                                    <div className='flex flex-col'>
                                        <span className='text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest'>Phone</span>
                                        <span className='text-gray-900 dark:text-zinc-200 font-bold tracking-tight'>{user?.phoneNumber || '—'}</span>
                                    </div>
                                </div>

                                <div className='flex items-center gap-4 group'>
                                    <div className='p-3 bg-gray-50 dark:bg-zinc-800 rounded-2xl text-gray-400 group-hover:bg-purple-50 dark:group-hover:bg-purple-900/20 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors'>
                                        <MapPin size={20} />
                                    </div>
                                    <div className='flex flex-col'>
                                        <span className='text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest'>Location</span>
                                        <span className='text-gray-900 dark:text-zinc-200 font-bold tracking-tight'>India</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column */}
                    <div className='lg:col-span-2 space-y-8'>
                        {user?.role !== 'recruiter' && (
                            <>
                                {/* Projects */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className='bg-white dark:bg-zinc-900 rounded-[40px] p-8 shadow-xl dark:shadow-none shadow-purple-100/50 border border-white dark:border-zinc-800'
                                >
                                    <div className='flex items-center gap-3 mb-8 pb-4 border-b border-gray-50 dark:border-zinc-800'>
                                        <div className='p-2 bg-purple-50 dark:bg-purple-900/20 rounded-xl text-purple-600 dark:text-purple-400'>
                                            <Code2 size={22} />
                                        </div>
                                        <h2 className='text-2xl font-black text-gray-900 dark:text-white'>Projects</h2>
                                    </div>
                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                        {sections.projects.length > 0 ? sections.projects.map((proj, idx) => (
                                            <div key={idx} className='p-6 rounded-[32px] bg-gray-50/30 dark:bg-zinc-800/30 border border-gray-100 dark:border-zinc-800 hover:border-purple-200 dark:hover:border-purple-900/50 hover:bg-white dark:hover:bg-zinc-800 transition-all group'>
                                                <div className='flex items-start justify-between'>
                                                    <h3 className='font-black text-gray-900 dark:text-zinc-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors'>{proj.title}</h3>
                                                    {proj.link && (
                                                        <a href={proj.link} target="_blank" rel="noreferrer" className='text-gray-400 dark:text-zinc-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors'>
                                                            <ExternalLink size={18} />
                                                        </a>
                                                    )}
                                                </div>
                                                <p className='text-gray-500 dark:text-zinc-400 font-medium text-xs mt-3 leading-relaxed'>{proj.description}</p>
                                            </div>
                                        )) : (
                                            <div className='col-span-2 text-center py-6 text-gray-400 dark:text-zinc-600 font-bold uppercase tracking-widest text-[10px]'>No projects listed</div>
                                        )}
                                    </div>
                                </motion.div>

                                <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                                    {/* Experience */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className='bg-white dark:bg-zinc-900 rounded-[40px] p-8 shadow-xl dark:shadow-none shadow-purple-100/50 border border-white dark:border-zinc-800'
                                    >
                                        <div className='flex items-center gap-3 mb-8'>
                                            <div className='p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-emerald-600 dark:text-emerald-400'>
                                                <Briefcase size={22} />
                                            </div>
                                            <h2 className='text-2xl font-black text-gray-900 dark:text-white'>Experience</h2>
                                        </div>
                                        <div className='space-y-8'>
                                            {sections.experience.length > 0 ? sections.experience.map((exp, idx) => (
                                                <div key={idx} className='relative pl-6 before:absolute before:left-0 before:top-1.5 before:w-1.5 before:h-1.5 before:bg-emerald-500 before:rounded-full'>
                                                    <div className='flex flex-col'>
                                                        <span className='text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1'>{exp.duration}</span>
                                                        <h3 className='font-black text-gray-900 dark:text-zinc-100 text-sm'>{exp.role}</h3>
                                                        <span className='text-xs text-gray-500 dark:text-zinc-400 font-bold'>{exp.company}</span>
                                                        <p className='text-[10px] text-gray-400 dark:text-zinc-500 font-medium mt-2 leading-relaxed'>{exp.description}</p>
                                                    </div>
                                                </div>
                                            )) : (
                                                <div className='text-center py-4 text-gray-400 dark:text-zinc-600 font-bold uppercase tracking-widest text-[10px]'>Fresher</div>
                                            )}
                                        </div>
                                    </motion.div>

                                    {/* Education */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className='bg-white dark:bg-zinc-900 rounded-[40px] p-8 shadow-xl dark:shadow-none shadow-purple-100/50 border border-white dark:border-zinc-800'
                                    >
                                        <div className='flex items-center gap-3 mb-8'>
                                            <div className='p-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600 dark:text-blue-400'>
                                                <GraduationCap size={22} />
                                            </div>
                                            <h2 className='text-2xl font-black text-gray-900 dark:text-white'>Education</h2>
                                        </div>
                                        <div className='space-y-8'>
                                            {sections.education.length > 0 ? sections.education.map((edu, idx) => (
                                                <div key={idx} className='relative pl-6 before:absolute before:left-0 before:top-1.5 before:w-1.5 before:h-1.5 before:bg-blue-500 before:rounded-full'>
                                                    <div className='flex flex-col'>
                                                        <span className='text-[9px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1'>{edu.year}</span>
                                                        <h3 className='font-black text-gray-900 dark:text-zinc-100 text-sm'>{edu.degree}</h3>
                                                        <span className='text-xs text-gray-500 dark:text-zinc-400 font-bold'>{edu.college}</span>
                                                        <div className='mt-2'>
                                                            <Badge variant="outline" className='bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400 font-black text-[8px] px-2 py-0'>
                                                                {edu.cgpa}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </div>
                                            )) : (
                                                <div className='text-center py-4 text-gray-400 dark:text-zinc-600 font-bold uppercase tracking-widest text-[10px]'>Details pending</div>
                                            )}
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Skills */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className='bg-white dark:bg-zinc-900 rounded-[40px] p-8 shadow-xl dark:shadow-none shadow-purple-100/50 border border-white dark:border-zinc-800'
                                >
                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                                        <div>
                                            <h3 className='text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest mb-6'>Arsenal</h3>
                                            <div className='flex flex-wrap gap-2'>
                                                {user?.profile?.skills?.length > 0 ? user.profile.skills.map((item, index) => (
                                                    <Badge key={index} className="bg-gray-50 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 border-transparent px-4 py-2 rounded-2xl shadow-none font-bold">
                                                        {item}
                                                    </Badge>
                                                )) : <span className="text-gray-400 dark:text-zinc-600 text-xs italic">Update skills in settings</span>}
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className='text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest mb-6'>Resume</h3>
                                            {isResume ? (
                                                <a target='blank' href={user?.profile?.resume} className='flex items-center gap-4 bg-gray-50/50 dark:bg-zinc-800/50 p-4 rounded-[32px] group hover:bg-white dark:hover:bg-zinc-800 hover:shadow-xl dark:hover:shadow-none transition-all border border-gray-100/50 dark:border-zinc-800'>
                                                    <div className='h-12 w-12 bg-white dark:bg-zinc-700 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm border border-gray-100 dark:border-zinc-600'>
                                                        <FileText size={24} />
                                                    </div>
                                                    <div className='flex flex-col min-w-0'>
                                                        <span className='text-xs font-bold text-gray-900 dark:text-zinc-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'>{user?.profile?.resumeOriginalName}</span>
                                                        <span className='text-[9px] text-gray-400 dark:text-zinc-500 font-black uppercase tracking-widest'>PDF Document</span>
                                                    </div>
                                                </a>
                                            ) : (
                                                <Button onClick={() => setOpen(true)} variant="outline" className="w-full h-16 rounded-[32px] border-dashed border-2 font-black text-gray-400 dark:text-zinc-600 dark:hover:text-zinc-400 transition-colors">Upload Credentials</Button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            </>
                        )}

                        {user?.role === 'recruiter' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className='bg-white dark:bg-zinc-900 rounded-[40px] p-2 shadow-xl dark:shadow-none shadow-purple-100/50 border border-white dark:border-zinc-800 overflow-hidden'
                            >
                                <div className='p-10 pb-4 flex items-center justify-between'>
                                    <div className='flex items-center gap-3'>
                                        <div className='p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-emerald-600 dark:text-emerald-400'>
                                            <Briefcase size={22} />
                                        </div>
                                        <h2 className='text-2xl font-black text-gray-900 dark:text-white'>Applicant Requests</h2>
                                    </div>
                                    <Badge className="bg-gray-900 dark:bg-white text-white dark:text-black border-0 font-black px-4 py-2 rounded-full uppercase text-[10px] tracking-widest">Live</Badge>
                                </div>
                                <div className='px-6 pb-6 overflow-hidden'>
                                    <RecruiterApplicationsTable />
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>

            <UpdateProfileDialog open={open} setOpen={setOpen} />
        </div>
    );
};

export default Profile;