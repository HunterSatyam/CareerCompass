import React, { useEffect, useState } from 'react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading, setUser } from '@/redux/authSlice'
import { Loader2, Mail, Lock, Sparkles, ShieldCheck } from 'lucide-react'
import { motion } from 'framer-motion'

const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: "",
        role: "applicant",
    });
    const { loading, user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            if (error.response?.data?.notVerified) {
                toast.error(error.response.data.message);
                navigate("/verify-email", { state: { email: input.email } });
            } else {
                toast.error(error.response?.data?.message || "Invalid credentials. Access denied.");
            }
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
            <div className='hidden lg:flex w-1/2 bg-zinc-950 text-white p-16 flex-col justify-between relative overflow-hidden'>
                {/* Modern Decorative Gradients */}
                <div className='absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] -mr-32 -mt-32'></div>
                <div className='absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] -ml-32 -mb-32'></div>
                <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.4)_100%)]'></div>

                <div className='relative z-10'>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className='flex items-center gap-3 text-3xl font-black tracking-tighter'
                    >
                        <div className='w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-2xl shadow-white/10'>
                            <span className='text-black text-2xl font-black'>C</span>
                        </div>
                        CareerCompass
                    </motion.div>
                </div>

                <div className='relative z-10 space-y-8'>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-black uppercase tracking-widest mb-6'>
                            <Sparkles size={12} /> Elite Talent Network
                        </div>
                        <h1 className='text-7xl font-black tracking-tight leading-[0.9] mb-8'>
                            Synchronize <br />
                            <span className='text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400'>with the Future</span>.
                        </h1>
                        <p className='text-zinc-400 text-xl max-w-md font-medium leading-relaxed'>
                            Re-establish your connection with the global professional matrix. High-tier opportunities await.
                        </p>
                    </motion.div>
                </div>

                <div className='relative z-10 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500'>
                    <span>© 2026 Protocol CarrierCompass</span>
                    <div className='flex gap-8'>
                        <span className='hover:text-white cursor-pointer transition-colors'>Privacy</span>
                        <span className='hover:text-white cursor-pointer transition-colors'>Terms</span>
                    </div>
                </div>
            </div>

            {/* Right Side - Form Section */}
            <div className='w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50/30 dark:bg-zinc-950'>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className='w-full max-w-md space-y-12'
                >
                    <div className='text-center lg:text-left'>
                        <h2 className='text-4xl font-black text-gray-900 dark:text-white tracking-tight uppercase'>Initialize Session</h2>
                        <p className='text-gray-500 dark:text-zinc-500 mt-3 font-bold uppercase tracking-widest text-[10px]'>Verification Protocol Required</p>
                    </div>

                    <form onSubmit={submitHandler} className='space-y-8'>
                        <div className='space-y-6'>
                            <div className='space-y-3'>
                                <Label className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em] ml-2">Identity Channel (Email)</Label>
                                <div className='relative group'>
                                    <div className='absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none'>
                                        <Mail className='h-5 w-5 text-gray-300 dark:text-zinc-700 group-focus-within:text-purple-500 transition-colors' />
                                    </div>
                                    <Input
                                        type="email"
                                        placeholder="user@network.com"
                                        value={input.email}
                                        name="email"
                                        onChange={changeEventHandler}
                                        required
                                        className="pl-13 h-14 bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800 text-gray-900 dark:text-white shadow-sm dark:shadow-none focus:ring-2 focus:ring-purple-500/20 rounded-2xl font-bold transition-all text-sm"
                                    />
                                </div>
                            </div>

                            <div className='space-y-3'>
                                <Label className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em] ml-2">Secure Access (Password)</Label>
                                <div className='relative group'>
                                    <div className='absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none'>
                                        <Lock className='h-5 w-5 text-gray-300 dark:text-zinc-700 group-focus-within:text-purple-500 transition-colors' />
                                    </div>
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        value={input.password}
                                        name="password"
                                        onChange={changeEventHandler}
                                        required
                                        className="pl-13 h-14 bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800 text-gray-900 dark:text-white shadow-sm dark:shadow-none focus:ring-2 focus:ring-purple-500/20 rounded-2xl font-bold transition-all text-sm"
                                    />
                                </div>
                                <div className='flex justify-end'>
                                    <Link to="/forgot-password" size="sm" className='text-[10px] font-black uppercase tracking-widest text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors'>
                                        Recover Access
                                    </Link>
                                </div>
                            </div>

                            <div className='grid grid-cols-2 gap-4'>
                                <motion.div
                                    whileTap={{ scale: 0.98 }}
                                    className={`cursor-pointer border-2 p-5 rounded-2xl flex flex-col items-center gap-3 transition-all ${input.role === 'applicant' ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/10' : 'border-gray-50 dark:border-zinc-900 bg-white dark:bg-zinc-900 hover:border-gray-200 dark:hover:border-zinc-800'}`}
                                    onClick={() => setInput({ ...input, role: 'applicant' })}
                                >
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${input.role === 'applicant' ? 'border-purple-600' : 'border-gray-300 dark:border-zinc-700'}`}>
                                        {input.role === 'applicant' && <div className='w-3 h-3 rounded-full bg-purple-600 shadow-sm shadow-purple-200' />}
                                    </div>
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${input.role === 'applicant' ? 'text-purple-700 dark:text-purple-400' : 'text-gray-500 dark:text-zinc-500'}`}>Applicant</span>
                                </motion.div>
                                <motion.div
                                    whileTap={{ scale: 0.98 }}
                                    className={`cursor-pointer border-2 p-5 rounded-2xl flex flex-col items-center gap-3 transition-all ${input.role === 'recruiter' ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/10' : 'border-gray-50 dark:border-zinc-900 bg-white dark:bg-zinc-900 hover:border-gray-200 dark:hover:border-zinc-800'}`}
                                    onClick={() => setInput({ ...input, role: 'recruiter' })}
                                >
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${input.role === 'recruiter' ? 'border-purple-600' : 'border-gray-300 dark:border-zinc-700'}`}>
                                        {input.role === 'recruiter' && <div className='w-3 h-3 rounded-full bg-purple-600 shadow-sm shadow-purple-200' />}
                                    </div>
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${input.role === 'recruiter' ? 'text-purple-700 dark:text-purple-400' : 'text-gray-500 dark:text-zinc-500'}`}>Recruiter</span>
                                </motion.div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-16 bg-black dark:bg-white dark:text-black hover:bg-gray-900 dark:hover:bg-gray-100 text-white font-black rounded-2xl text-xs uppercase tracking-[0.3em] transition-all transform active:scale-95 shadow-xl shadow-purple-200/50 dark:shadow-none relative group overflow-hidden border-none"
                        >
                            <span className='relative z-10 flex items-center justify-center gap-3'>
                                {loading ? (
                                    <>
                                        <Loader2 className='h-5 w-5 animate-spin' />
                                        <span>Synchronizing...</span>
                                    </>
                                ) : (
                                    <>
                                        Authorize Session <ShieldCheck size={18} />
                                    </>
                                )}
                            </span>
                        </Button>

                        <div className="relative my-10">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-gray-100 dark:border-zinc-800" />
                            </div>
                            <div className="relative flex justify-center text-[10px] uppercase font-black tracking-[0.3em]">
                                <span className="bg-gray-50/30 dark:bg-zinc-950 px-6 text-gray-400 dark:text-zinc-600">External Auth</span>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            {['google', 'linkedin', 'github'].map((provider) => (
                                <a
                                    key={provider}
                                    href={`${USER_API_END_POINT}/auth/${provider}`}
                                    className="flex-1 h-14 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl flex items-center justify-center hover:bg-gray-50 dark:hover:bg-zinc-800 hover:border-purple-200 dark:hover:border-purple-500/50 transition-all shadow-sm group"
                                >
                                    <i className={`fa-brands fa-${provider} text-xl text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors`}></i>
                                </a>
                            ))}
                        </div>

                        <div className='text-center pt-8 border-t border-gray-100 dark:border-zinc-800'>
                            <p className='text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest'>
                                New to the network? <Link to="/signup" className='text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 ml-1 transition-colors'>Register Identity</Link>
                            </p>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    )
}

export default Login
