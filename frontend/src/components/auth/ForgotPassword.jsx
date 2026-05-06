import React, { useState } from 'react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { Loader2, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'

const ForgotPassword = () => {
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)

    const submitHandler = async (e) => {
        e.preventDefault()
        try {
            setLoading(true)
            const res = await axios.post(`${USER_API_END_POINT}/forgot-password`, { email }, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            })
            if (res.data.success) {
                setSent(true)
                toast.success(res.data.message)
            }
        } catch (error) {
            console.error("Forgot Password Error:", error);
            toast.error(error.response?.data?.message || "Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='min-h-screen bg-white flex'>
            {/* Left Side - Hero Section */}
            <div className='hidden lg:flex w-1/2 bg-black text-white p-12 flex-col justify-between relative overflow-hidden'>
                <div className='absolute top-0 right-0 w-96 h-96 bg-orange-600/30 rounded-full blur-[100px] -mr-20 -mt-20'></div>
                <div className='absolute bottom-0 left-0 w-96 h-96 bg-red-600/30 rounded-full blur-[100px] -ml-20 -mb-20'></div>

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
                        Forgot your <span className='text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400'>password</span>?
                    </h1>
                    <p className='text-gray-400 text-lg max-w-md'>
                        No worries. We'll send you a secure link to reset it in seconds.
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
                    {!sent ? (
                        <>
                            <div className='text-center lg:text-left'>
                                <h2 className='text-3xl font-black text-gray-900 tracking-tight'>Reset Password</h2>
                                <p className='text-gray-500 mt-2 font-medium'>Enter your email and we'll send you a reset link</p>
                            </div>

                            <form onSubmit={submitHandler} className='space-y-6'>
                                <div className='space-y-2'>
                                    <Label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Email Address</Label>
                                    <div className='relative'>
                                        <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                                            <Mail className='h-5 w-5 text-gray-300' />
                                        </div>
                                        <Input
                                            type="email"
                                            placeholder="Enter your registered email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="pl-11 h-12 bg-white border-gray-100 focus:border-purple-500 focus:ring-purple-500/20 rounded-xl font-medium text-black transition-all"
                                            required
                                        />
                                    </div>
                                </div>

                                <Button type="submit" className="w-full h-12 bg-black hover:bg-gray-900 text-white font-black rounded-xl text-md transition-all transform active:scale-95 shadow-xl hover:shadow-2xl">
                                    {loading ? (
                                        <div className='flex items-center gap-2'>
                                            <Loader2 className='h-5 w-5 animate-spin' />
                                            <span>Sending Link...</span>
                                        </div>
                                    ) : 'Send Reset Link'}
                                </Button>

                                <div className='text-center'>
                                    <Link to="/login" className='inline-flex items-center gap-2 text-sm font-bold text-purple-600 hover:text-purple-700 hover:underline'>
                                        <ArrowLeft className='h-4 w-4' />
                                        Back to Login
                                    </Link>
                                </div>
                            </form>
                        </>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className='text-center space-y-6'
                        >
                            <div className='w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto'>
                                <CheckCircle2 className='h-10 w-10 text-green-600' />
                            </div>
                            <h2 className='text-3xl font-black text-gray-900 tracking-tight'>Check Your Email</h2>
                            <p className='text-gray-500 font-medium max-w-sm mx-auto'>
                                We've sent a password reset link to <strong className='text-gray-800'>{email}</strong>. The link will expire in 15 minutes.
                            </p>
                            <div className='bg-amber-50 border border-amber-200 rounded-xl p-4'>
                                <p className='text-amber-800 text-sm font-medium'>
                                    💡 Don't see the email? Check your spam folder.
                                </p>
                            </div>
                            <div className='flex flex-col gap-3'>
                                <Button onClick={() => { setSent(false); setEmail(""); }} variant="outline" className='h-12 rounded-xl font-bold border-gray-200'>
                                    Try another email
                                </Button>
                                <Link to="/login" className='inline-flex items-center justify-center gap-2 text-sm font-bold text-purple-600 hover:text-purple-700 hover:underline'>
                                    <ArrowLeft className='h-4 w-4' />
                                    Back to Login
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </div>
    )
}

export default ForgotPassword
