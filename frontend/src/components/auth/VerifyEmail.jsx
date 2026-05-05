import React, { useState } from 'react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { Loader2, ShieldCheck, Mail } from 'lucide-react'
import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'

const VerifyEmail = () => {
    const [code, setCode] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const location = useLocation();

    // Get email from state passed from Signup or local storage or user input as fallback
    // For now, let's allow user to input email if not found, or use a query param
    const [email, setEmail] = useState(location.state?.email || "")
    const [timer, setTimer] = useState(120) // 120 seconds = 2 minutes
    const [canResend, setCanResend] = useState(false)

    React.useEffect(() => {
        let interval;
        if (timer > 0 && !canResend) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else {
            setCanResend(true);
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [timer, canResend]);

    const resendHandler = async () => {
        try {
            setCanResend(false);
            setTimer(120);
            const res = await axios.post(`${USER_API_END_POINT}/resend-otp`, { email }, {
                headers: { "Content-Type": "application/json" },
            });
            if (res.data.success) {
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to resend code");
            setCanResend(true);
        }
    }

    const submitHandler = async (e) => {
        e.preventDefault()
        try {
            setLoading(true)
            const res = await axios.post(`${USER_API_END_POINT}/verify-email`, { email, code }, {
                headers: { "Content-Type": "application/json" },
            })
            if (res.data.success) {
                toast.success(res.data.message)
                navigate("/login")
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Invalid or expired code")
        } finally {
            setLoading(false)
        }
    }


    return (
        <div className='min-h-screen bg-white flex'>
            {/* Left Side - Hero Section */}
            <div className='hidden lg:flex w-1/2 bg-black text-white p-12 flex-col justify-between relative overflow-hidden'>
                <div className='absolute top-0 right-0 w-96 h-96 bg-green-600/30 rounded-full blur-[100px] -mr-20 -mt-20'></div>
                <div className='absolute bottom-0 left-0 w-96 h-96 bg-emerald-600/30 rounded-full blur-[100px] -ml-20 -mb-20'></div>

                <div className='relative z-10'>
                    <div className='flex items-center gap-2 text-2xl font-bold tracking-tighter'>
                        <div className='w-8 h-8 bg-white rounded-lg flex items-center justify-center'>
                            <span className='text-black text-xl font-black'>C</span>
                        </div>
                        CareerCompass
                    </div>
                </div>

                <div className='relative z-10'>
                    <h1 className='text-6xl font-black tracking-tight mb-6 leading-tight'>
                        Verify your <span className='text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400'>identity</span>
                    </h1>
                    <p className='text-gray-400 text-lg max-w-md'>
                        We've sent a 6-digit code to your email. Enter it below to activate your account.
                    </p>
                </div>

                <div className='relative z-10 text-sm text-gray-500 font-medium'>
                    © 2026 CareerCompass Inc.
                </div>
            </div>

            {/* Right Side - Form Section */}
            <div className='w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#FDFCFE]'>
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className='w-full max-w-md space-y-8'
                >
                    <div className='text-center lg:text-left'>
                        <h2 className='text-3xl font-black text-gray-900 tracking-tight'>Verify Email</h2>
                        <p className='text-gray-500 mt-2 font-medium'>Check your inbox for the verification code</p>
                    </div>

                    <form onSubmit={submitHandler} className='space-y-6'>
                        <div className='space-y-4'>
                            <div className='space-y-2'>
                                <Label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Email Address</Label>
                                <div className='relative'>
                                    <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                                        <Mail className='h-5 w-5 text-gray-300' />
                                    </div>
                                    <Input
                                        type="email"
                                        placeholder="your@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-11 h-12 bg-white border-gray-100 focus:border-purple-500 focus:ring-purple-500/20 rounded-xl font-medium transition-all"
                                        required
                                        disabled={!!location.state?.email} // Disable if passed from signup
                                    />
                                </div>
                            </div>

                            <div className='space-y-2'>
                                <Label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Verification Code</Label>
                                <div className='relative'>
                                    <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                                        <ShieldCheck className='h-5 w-5 text-gray-300' />
                                    </div>
                                    <Input
                                        type="text"
                                        placeholder="Enter verification code"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                        className="pl-11 h-12 bg-white border-gray-100 focus:border-purple-500 focus:ring-purple-500/20 rounded-xl font-medium transition-all tracking-widest text-lg"
                                        required
                                        maxLength={6}
                                    />
                                </div>
                            </div>
                        </div>

                        <Button type="submit" className="w-full h-12 bg-black hover:bg-gray-900 text-white font-black rounded-xl text-md transition-all transform active:scale-95 shadow-xl hover:shadow-2xl">
                            {loading ? (
                                <div className='flex items-center gap-2'>
                                    <Loader2 className='h-5 w-5 animate-spin' />
                                    <span>Verifying...</span>
                                </div>
                            ) : 'Verify Account'}
                        </Button>

                        <div className='text-center space-y-2'>
                            <p className='text-sm text-gray-500 font-medium'>
                                Didn't receive the code?
                            </p>
                            {canResend ? (
                                <Button
                                    type="button"
                                    onClick={resendHandler}
                                    variant="link"
                                    className="text-purple-600 font-bold hover:text-purple-700 p-0 h-auto"
                                >
                                    Resend Code
                                </Button>
                            ) : (
                                <p className='text-sm text-purple-600 font-bold'>
                                    Resend in {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
                                </p>
                            )}
                        </div>
                    </form>

                </motion.div>
            </div>
        </div>
    )
}

export default VerifyEmail
