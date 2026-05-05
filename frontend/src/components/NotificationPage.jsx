import React, { useEffect } from 'react'
import Navbar from './shared/Navbar'
import Footer from './shared/Footer'
import { useSelector, useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, BellOff, CheckCircle2, Trash2, Calendar, MapPin, ExternalLink } from 'lucide-react'
import axios from 'axios'
import { NOTIFICATION_API_END_POINT } from '@/utils/constant'
import { setAllNotifications, markNotificationAsRead, removeNotification } from '@/redux/notificationSlice'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import useGetNotifications from '@/hooks/useGetNotifications'

const NotificationPage = () => {

    useGetNotifications();
    const { allNotifications } = useSelector(store => store.notification);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const markAsReadHandler = async (id) => {
        try {
            const res = await axios.put(`${NOTIFICATION_API_END_POINT}/${id}/read`, {}, { withCredentials: true });
            if (res.data.success) {
                dispatch(markNotificationAsRead(id));
                toast.success("Marked as read");
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to mark as read");
        }
    }

    const deleteHandler = async (id) => {
        try {
            const res = await axios.delete(`${NOTIFICATION_API_END_POINT}/${id}`, { withCredentials: true });
            if (res.data.success) {
                dispatch(removeNotification(id));
                toast.success("Notification deleted");
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to delete notification");
        }
    }

    return (
        <div className='min-h-screen bg-[#F8F9FF] dark:bg-black transition-colors duration-300'>
            <Navbar />
            <div className='max-w-4xl mx-auto my-16 px-4'>
                <div className='flex items-center justify-between mb-12'>
                    <div>
                        <h1 className='text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight uppercase'>Notifications</h1>
                        <p className='text-gray-500 dark:text-zinc-500 font-medium mt-2'>Stay updated with events matching your profile</p>
                    </div>
                    <div className='bg-white dark:bg-zinc-900 p-4 rounded-2xl shadow-xl dark:shadow-none border border-gray-100 dark:border-zinc-800 text-purple-600 dark:text-purple-400'>
                        <Bell size={32} />
                    </div>
                </div>

                <div className='space-y-6'>
                    <AnimatePresence mode='popLayout'>
                        {allNotifications.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className='bg-white dark:bg-zinc-900 rounded-[40px] p-24 text-center border border-gray-100 dark:border-zinc-800 shadow-xl dark:shadow-none'
                            >
                                <div className='inline-flex p-8 rounded-[32px] bg-gray-50 dark:bg-zinc-800 text-gray-400 dark:text-zinc-600 mb-8'>
                                    <BellOff size={64} />
                                </div>
                                <h3 className='text-2xl font-black text-gray-900 dark:text-white mb-3'>Sliences are Golden</h3>
                                <p className='text-gray-500 dark:text-zinc-500 max-w-xs mx-auto font-medium'>
                                    When recruiters post events matching your skills, you'll be the first to know.
                                </p>
                            </motion.div>
                        ) : (
                            allNotifications.map((notification, index) => (
                                <motion.div
                                    key={notification._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={`relative group bg-white dark:bg-zinc-900 rounded-[32px] p-8 border transition-all duration-300 ${notification.isRead ? 'opacity-60 border-gray-50 dark:border-zinc-800' : 'border-purple-100 dark:border-purple-900/30 shadow-2xl dark:shadow-none'
                                        }`}
                                >
                                    {!notification.isRead && (
                                        <div className='absolute top-8 right-8 w-2.5 h-2.5 bg-purple-600 dark:bg-purple-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(147,51,234,0.5)]'></div>
                                    )}

                                    <div className='flex gap-8'>
                                        <div className={`flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${notification.type === 'Job' ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' :
                                            notification.type === 'Internship' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' :
                                                'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                                            }`}>
                                            <Calendar size={28} />
                                        </div>

                                        <div className='flex-1'>
                                            <div className='flex items-start justify-between mb-2'>
                                                <h3 className='font-black text-xl text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors'>{notification.title}</h3>
                                                <span className='text-[10px] font-black text-gray-400 dark:text-zinc-600 uppercase tracking-widest bg-gray-50 dark:bg-zinc-800 px-3 py-1 rounded-full'>
                                                    {new Date(notification.createdAt).toLocaleDateString()} • {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>

                                            </div>
                                            <p className='text-gray-600 dark:text-zinc-400 font-medium mb-6 leading-relaxed'>{notification.message}</p>

                                            <div className='flex items-center gap-6'>
                                                <button
                                                    onClick={() => navigate(notification.actionUrl ? notification.actionUrl : `/description/${notification.type.toLowerCase()}/${notification.eventId}`)}
                                                    className='text-[10px] font-black uppercase tracking-widest text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 flex items-center gap-2 transition-all p-2 -ml-2 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/20'
                                                >
                                                    {notification.actionUrl ? 'Take Assessment' : 'Exploration Details'} <ExternalLink size={14} />
                                                </button>

                                                <div className='flex items-center gap-3 ml-auto opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0'>
                                                    {!notification.isRead && (
                                                        <button
                                                            onClick={() => markAsReadHandler(notification._id)}
                                                            className='p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-all'
                                                            title="Mark as read"
                                                        >
                                                            <CheckCircle2 size={20} />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => deleteHandler(notification._id)}
                                                        className='p-3 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-xl hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-all'
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={20} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default NotificationPage
