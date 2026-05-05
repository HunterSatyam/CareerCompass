import React, { useState } from 'react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Link, useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { Loader2, Lock, CheckCircle2, ArrowLeft, Eye, EyeOff } from 'lucide-react'
import { motion } from 'framer-motion'

const ResetPassword = () => {
    const { token } = useParams()
    const navigate = useNavigate()
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    const submitHandler = async (e) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            toast.error("Passwords do not match")
            return
        }
        if (password.length < 6) {
            toast.error("Password must be at least 6 characters")
            return
        }
        try {
            setLoading(true)
            const res = await axios.post(`${USER_API_END_POINT}/reset-password/${token}`, { password }, {
                headers: { "Content-Type": "application/json" },
            })
            if (res.data.success) {
                setSuccess(true)
                toast.success(res.data.message)
                setTimeout(() => navigate("/login"), 3000)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='min-h-screen bg-white flex'>
            {/* Left Side - Hero Section */}
            <div className='hidden lg:flex w-1/2 bg-black text-white p-12 flex-col justify-between relative overflow-hidden'>
                <div className='absolute top-0 right-0 w-96 h-96 bg-emerald-600/30 rounded-full blur-[100px] -mr-20 -mt-20'></div>
                <div className='absolute bottom-0 left-0 w-96 h-96 bg-teal-600/30 rounded-full blur-[100px] -ml-20 -mb-20'></div>

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
                        Set your <span className='text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400'>new password</span>
                    </h1>
                    <p className='text-gray-400 text-lg max-w-md'>
                        Choose a strong password to keep your account secure.
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
                    {!success ? (
                        <>
                            <div className='text-center lg:text-left'>
                                <h2 className='text-3xl font-black text-gray-900 tracking-tight'>New Password</h2>
                                <p className='text-gray-500 mt-2 font-medium'>Create a strong password for your account</p>
                            </div>

                            <form onSubmit={submitHandler} className='space-y-6'>
                                <div className='space-y-5'>
                                    <div className='space-y-2'>
                                        <Label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">New Password</Label>
                                        <div className='relative'>
                                            <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                                                <Lock className='h-5 w-5 text-gray-300' />
                                            </div>
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Enter new password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="pl-11 pr-11 h-12 bg-white border-gray-100 focus:border-purple-500 focus:ring-purple-500/20 rounded-xl font-medium text-black transition-all"
                                                required
                                            />
                                            <button type="button" onClick={() => setShowPassword(!showPassword)} className='absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600'>
                                                {showPassword ? <EyeOff className='h-5 w-5' /> : <Eye className='h-5 w-5' />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className='space-y-2'>
                                        <Label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Confirm Password</Label>
                                        <div className='relative'>
                                            <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                                                <Lock className='h-5 w-5 text-gray-300' />
                                            </div>
                                            <Input
                                                type={showConfirm ? "text" : "password"}
                                                placeholder="Confirm new password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="pl-11 pr-11 h-12 bg-white border-gray-100 focus:border-purple-500 focus:ring-purple-500/20 rounded-xl font-medium text-black transition-all"
                                                required
                                            />
                                            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className='absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600'>
                                                {showConfirm ? <EyeOff className='h-5 w-5' /> : <Eye className='h-5 w-5' />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {password && confirmPassword && password !== confirmPassword && (
                                    <p className='text-red-500 text-sm font-medium'>⚠️ Passwords do not match</p>
                                )}

                                <Button type="submit" className="w-full h-12 bg-black hover:bg-gray-900 text-white font-black rounded-xl text-md transition-all transform active:scale-95 shadow-xl hover:shadow-2xl">
                                    {loading ? (
                                        <div className='flex items-center gap-2'>
                                            <Loader2 className='h-5 w-5 animate-spin' />
                                            <span>Resetting Password...</span>
                                        </div>
                                    ) : 'Reset Password'}
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
                            <h2 className='text-3xl font-black text-gray-900 tracking-tight'>Password Reset!</h2>
                            <p className='text-gray-500 font-medium max-w-sm mx-auto'>
                                Your password has been updated successfully. Redirecting to login...
                            </p>
                            <Link to="/login">
                                <Button className="h-12 rounded-xl font-bold bg-black hover:bg-gray-900 text-white px-8">
                                    Go to Login
                                </Button>
                            </Link>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </div>
    )
}

export default ResetPassword
