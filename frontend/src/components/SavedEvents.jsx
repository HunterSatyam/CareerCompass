import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import Footer from './shared/Footer'
import { USER_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import Job from './Job'
import InternshipCard from './InternshipCard'
import HackathonCard from './HackathonCard'
import WebinarCard from './WebinarCard'
import CompetitionCard from './CompetitionCard'
import CertificationCard from './CertificationCard'
import { motion } from 'framer-motion'
import { HeartOff, Loader2, Sparkles } from 'lucide-react'

const SavedEvents = () => {
    const [savedEvents, setSavedEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSavedEvents = async () => {
            try {
                const res = await axios.get(`${USER_API_END_POINT}/saved`, { withCredentials: true });
                if (res.data.success) {
                    setSavedEvents(res.data.savedEvents);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        fetchSavedEvents();
    }, []);

    const renderEventCard = (item) => {
        const { eventType, eventId } = item;
        // eventId is populated with the actual event object
        const event = eventId;

        if (!event) return null; // Handle deleted events

        switch (eventType) {
            case 'Job':
                return <Job job={event} key={event._id} />;
            case 'Internship':
                return <InternshipCard job={event} key={event._id} />;
            case 'Hackathon':
                return <HackathonCard job={event} key={event._id} />;
            case 'Webinar':
                return <WebinarCard job={event} key={event._id} />;
            case 'Competition':
                return <CompetitionCard job={event} key={event._id} />;
            case 'Certification':
                return <CertificationCard job={event} key={event._id} />;
            default:
                return null;
        }
    };

    if (loading) {
        return (
            <div className='min-h-screen bg-[#F8F9FF] dark:bg-black flex items-center justify-center'>
                <div className='relative'>
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className='w-16 h-16 border-4 border-purple-200 dark:border-zinc-800 border-t-purple-600 dark:border-t-purple-500 rounded-full'
                    />
                    <Sparkles className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-purple-600 dark:text-purple-400' size={24} />
                </div>
            </div>
        )
    }

    return (
        <div className='min-h-screen bg-[#F8F9FF] dark:bg-black transition-colors duration-300'>
            <Navbar />
            <div className='max-w-7xl mx-auto my-16 px-4 pb-20'>
                <div className='flex items-center gap-4 mb-12'>
                    <h1 className='text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight uppercase'>Your Curated <span className='text-purple-600 dark:text-purple-400'>Favorites</span></h1>
                    <div className='hidden sm:block h-1 flex-1 bg-gradient-to-r from-purple-100 to-transparent dark:from-purple-900/20 dark:to-transparent'></div>
                </div>

                {savedEvents.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className='flex flex-col items-center justify-center py-32 bg-white dark:bg-zinc-900 rounded-[40px] border border-gray-100 dark:border-zinc-800 shadow-xl dark:shadow-none'
                    >
                        <div className='bg-gray-50 dark:bg-zinc-800 p-8 rounded-[32px] text-gray-400 dark:text-zinc-600 mb-8 border border-gray-100 dark:border-zinc-700 shadow-inner'>
                            <HeartOff size={64} />
                        </div>
                        <h2 className='text-2xl font-black text-gray-900 dark:text-white'>No saved events yet</h2>
                        <p className='text-gray-500 dark:text-zinc-500 mt-3 font-medium'>Heart icons on events will help you save them for later.</p>
                    </motion.div>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                        {savedEvents.map((item) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={item._id}
                                className="relative h-full"
                            >
                                {renderEventCard(item)}
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    )
}

export default SavedEvents
