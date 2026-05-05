import React, { useEffect, useState } from 'react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '@/redux/authSlice'
import { Loader2, User, Mail, Phone, Lock, Upload, Sparkles, ShieldCheck } from 'lucide-react'
import { motion } from 'framer-motion'

const Signup = () => {
    const [input, setInput] = useState({
        fullname: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "applicant",
        file: "",
        resume: ""
    });
    const { loading, user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        const { name, value } = e.target;
        if (name === "fullname") {
            if (value === "" || /^[a-zA-Z\s]*$/.test(value)) {
                setInput({ ...input, [name]: value });
            }
        } else if (name === "phoneNumber") {
            if (value === "" || /^[0-9]*$/.test(value)) {
                setInput({ ...input, [name]: value });
            }
        } else {
            setInput({ ...input, [name]: value });
        }
    }

    const changeFileHandler = (e) => {
        setInput({ ...input, file: e.target.files?.[0] });
    }

    const changeResumeHandler = (e) => {
        setInput({ ...input, resume: e.target.files?.[0] });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("password", input.password);
        formData.append("role", input.role);
        if (input.file) {
            formData.append("profilePhoto", input.file);
        }
        if (input.resume) {
            formData.append("resume", input.resume);
        }

        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
                headers: { 'Content-Type': "multipart/form-data" },
                withCredentials: true,
            });
            if (res.data.success) {
                navigate("/verify-email", { state: { email: input.email } });
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Registration failed. Please check your data.");
        } finally {
            dispatch(setLoading(false));
        }
    }

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate])

    return (
        <div className='min-h-screen bg-white dark:bg-black flex selection:bg-purple-100 dark:selection:bg-purple-900 transition-colors duration-300'>
            {/* Left Side - Hero Section */}
            <div className='hidden lg:flex w-5/12 bg-zinc-950 text-white p-12 flex-col justify-between relative overflow-hidden shrink-0'>
                <div className='absolute top-0 right-0 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[100px] -mr-20 -mt-20'></div>
                <div className='absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-[100px] -ml-20 -mb-20'></div>

                <div className='relative z-10'>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className='flex items-center gap-3 text-2xl font-black tracking-tighter'
                    >
                        <div className='w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-white/10'>
                            <span className='text-black text-xl font-black'>C</span>
                        </div>
                        CareerCompass
                    </motion.div>
                </div>

                <div className='relative z-10 space-y-6'>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[9px] font-black uppercase tracking-widest mb-4'>
                            <Sparkles size={10} /> Universal Career Interface
                        </div>
                        <h1 className='text-5xl font-black tracking-tight leading-[0.95] mb-6'>
                            Create Your <br />
                            <span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400'>Digital Legacy</span>.
                        </h1>
                        <p className='text-zinc-400 text-base max-w-sm font-medium leading-relaxed'>
                            Establish your credentials in the premier employment ecosystem. Secure your trajectory today.
                        </p>
                    </motion.div>
                </div>

                <div className='relative z-10 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600'>
                    © 2026 CareerCompass Protocol
                </div>
            </div>

            {/* Right Side - Form Section */}
            <div className='w-full lg:w-7/12 flex items-center justify-center p-6 bg-gray-50/30 dark:bg-zinc-950 overflow-y-auto h-screen'>
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className='w-full max-w-xl space-y-6 bg-white dark:bg-zinc-900/50 p-8 md:p-10 rounded-[32px] border border-white dark:border-zinc-800 shadow-xl dark:shadow-none'
                >
                    <div className='text-center lg:text-left'>
                        <h2 className='text-3xl font-black text-gray-900 dark:text-white tracking-tight uppercase'>Register Identity</h2>
                        <p className='text-gray-500 dark:text-zinc-500 mt-2 font-bold uppercase tracking-widest text-[9px]'>Access Key Generation Protocol</p>
                    </div>

                    <form onSubmit={submitHandler} className='space-y-5'>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4'>
                            <div className='space-y-2'>
                                <Label className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest ml-2">Full Name</Label>
                                <div className='relative group'>
                                    <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                                        <User className='h-4 w-4 text-gray-300 dark:text-zinc-700 group-focus-within:text-purple-500 transition-colors' />
                                    </div>
                                    <Input
                                        type="text"
                                        placeholder="Matrix Identity"
                                        value={input.fullname}
                                        name="fullname"
                                        onChange={changeEventHandler}
                                        required
                                        className="pl-11 h-12 bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800 text-gray-900 dark:text-white rounded-xl font-bold transition-all text-sm"
                                    />
                                </div>
                            </div>

                            <div className='space-y-2'>
                                <Label className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest ml-2">Email Address</Label>
                                <div className='relative group'>
                                    <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                                        <Mail className='h-4 w-4 text-gray-300 dark:text-zinc-700 group-focus-within:text-purple-500 transition-colors' />
                                    </div>
                                    <Input
                                        type="email"
                                        placeholder="user@network.com"
                                        value={input.email}
                                        name="email"
                                        onChange={changeEventHandler}
                                        required
                                        className="pl-11 h-12 bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800 text-gray-900 dark:text-white rounded-xl font-bold transition-all text-sm"
                                    />
                                </div>
                            </div>

                            <div className='space-y-2'>
                                <Label className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest ml-2">Phone Link</Label>
                                <div className='relative group'>
                                    <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                                        <Phone className='h-4 w-4 text-gray-300 dark:text-zinc-700 group-focus-within:text-purple-500 transition-colors' />
                                    </div>
                                    <Input
                                        type="text"
                                        placeholder="+91 XXXXX XXXXX"
                                        value={input.phoneNumber}
                                        name="phoneNumber"
                                        onChange={changeEventHandler}
                                        required
                                        className="pl-11 h-12 bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800 text-gray-900 dark:text-white rounded-xl font-bold transition-all text-sm"
                                    />
                                </div>
                            </div>

                            <div className='space-y-2'>
                                <Label className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest ml-2">Security Key</Label>
                                <div className='relative group'>
                                    <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                                        <Lock className='h-4 w-4 text-gray-300 dark:text-zinc-700 group-focus-within:text-purple-500 transition-colors' />
                                    </div>
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        value={input.password}
                                        name="password"
                                        onChange={changeEventHandler}
                                        required
                                        className="pl-11 h-12 bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800 text-gray-900 dark:text-white rounded-xl font-bold transition-all text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='grid grid-cols-2 gap-4 py-2 border-t border-gray-50 dark:border-zinc-800'>
                            <motion.div
                                whileTap={{ scale: 0.98 }}
                                className={`cursor-pointer border-2 p-3 rounded-xl flex items-center gap-3 transition-all ${input.role === 'applicant' ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/10' : 'border-gray-50 dark:border-zinc-900 bg-gray-50 dark:bg-zinc-900/50'}`}
                                onClick={() => setInput({ ...input, role: 'applicant' })}
                            >
                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${input.role === 'applicant' ? 'border-purple-600' : 'border-zinc-300 dark:border-zinc-700'}`}>
                                    {input.role === 'applicant' && <div className='w-2 h-2 rounded-full bg-purple-600 shadow-sm shadow-purple-200' />}
                                </div>
                                <span className={`text-[10px] font-black uppercase tracking-widest ${input.role === 'applicant' ? 'text-purple-700 dark:text-purple-400' : 'text-zinc-500'}`}>Applicant</span>
                            </motion.div>
                            <motion.div
                                whileTap={{ scale: 0.98 }}
                                className={`cursor-pointer border-2 p-3 rounded-xl flex items-center gap-3 transition-all ${input.role === 'recruiter' ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/10' : 'border-gray-50 dark:border-zinc-900 bg-gray-50 dark:bg-zinc-900/50'}`}
                                onClick={() => setInput({ ...input, role: 'recruiter' })}
                            >
                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${input.role === 'recruiter' ? 'border-purple-600' : 'border-zinc-300 dark:border-zinc-700'}`}>
                                    {input.role === 'recruiter' && <div className='w-2 h-2 rounded-full bg-purple-600 shadow-sm shadow-purple-200' />}
                                </div>
                                <span className={`text-[10px] font-black uppercase tracking-widest ${input.role === 'recruiter' ? 'text-purple-700 dark:text-purple-400' : 'text-zinc-500'}`}>Recruiter</span>
                            </motion.div>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div className='space-y-2'>
                                <Label className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest ml-1">Identity Visual</Label>
                                <Input accept="image/*" type="file" onChange={changeFileHandler} className="hidden" id="photo-v2" />
                                <label htmlFor="photo-v2" className='flex items-center gap-3 w-full h-12 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 border-dashed rounded-xl cursor-pointer hover:border-purple-600 transition-all px-4'>
                                    <div className='w-7 h-7 bg-purple-50 dark:bg-purple-900/20 rounded-lg flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0'>
                                        <Upload className='h-4 w-4' />
                                    </div>
                                    <p className='text-[10px] font-black text-gray-500 truncate'>{input.file ? input.file.name : "Select Image"}</p>
                                </label>
                            </div>

                            {input.role === 'applicant' && (
                                <div className='space-y-2'>
                                    <Label className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest ml-1">Credentials (PDF)</Label>
                                    <Input accept=".pdf,.doc,.docx" type="file" onChange={changeResumeHandler} className="hidden" id="res-v2" />
                                    <label htmlFor="res-v2" className='flex items-center gap-3 w-full h-12 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 border-dashed rounded-xl cursor-pointer hover:border-blue-600 transition-all px-4'>
                                        <div className='w-7 h-7 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0'>
                                            <Upload className='h-4 w-4' />
                                        </div>
                                        <p className='text-[10px] font-black text-gray-500 truncate'>{input.resume ? input.resume.name : "Select PDF"}</p>
                                    </label>
                                </div>
                            )}
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-14 bg-black dark:bg-white dark:text-black hover:bg-gray-900 dark:hover:bg-gray-100 text-white font-black rounded-2xl text-xs uppercase tracking-[0.3em] transition-all transform active:scale-95 shadow-lg shadow-purple-200/50 dark:shadow-none relative group overflow-hidden border-none"
                        >
                            <span className='relative z-10 flex items-center justify-center gap-3'>
                                {loading ? (
                                    <>
                                        <Loader2 className='h-5 w-5 animate-spin' />
                                        <span>Provisioning...</span>
                                    </>
                                ) : (
                                    <>
                                        Establish Account <ShieldCheck size={18} />
                                    </>
                                )}
                            </span>
                        </Button>

                        <div className='text-center pt-4 border-t border-gray-50 dark:border-zinc-800'>
                            <p className='text-[10px] font-black text-gray-400 dark:text-zinc-600 uppercase tracking-widest'>
                                Linked to an identity? <Link to="/login" className='text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 ml-1 transition-colors'>Re-Authenticate</Link>
                            </p>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    )
}

export default Signup
