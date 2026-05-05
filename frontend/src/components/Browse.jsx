import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import Job from './Job'
import InternshipCard from './InternshipCard'
import HackathonCard from './HackathonCard'
import WebinarCard from './WebinarCard'
import CompetitionCard from './CompetitionCard'
import CertificationCard from './CertificationCard'
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import useGetAllInternships from '@/hooks/useGetAllInternships';
import useGetAllHackathons from '@/hooks/useGetAllHackathons';
import useGetAllWebinars from '@/hooks/useGetAllWebinars';
import useGetAllCompetitions from '@/hooks/useGetAllCompetitions';
import useGetAllCertifications from '@/hooks/useGetAllCertifications';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';

const Browse = () => {
    const [searchParams] = useSearchParams();
    const queryParam = searchParams.get('query');

    useGetAllJobs();
    useGetAllInternships();
    useGetAllHackathons();
    useGetAllWebinars();
    useGetAllCompetitions();
    useGetAllCertifications();

    const { allJobs } = useSelector(store => store.job);
    const { allInternship } = useSelector(store => store.internship);
    const { allHackathons } = useSelector(store => store.hackathon);
    const { allWebinars } = useSelector(store => store.webinar);
    const { allCompetitions } = useSelector(store => store.competition);
    const { allCertifications } = useSelector(store => store.certification);
    const dispatch = useDispatch();
    const { searchedQuery } = useSelector(store => store.job);

    const [allEvents, setAllEvents] = useState([]);

    useEffect(() => {
        if (queryParam) {
            dispatch(setSearchedQuery(queryParam));
        }
    }, [queryParam, dispatch]);

    useEffect(() => {
        return () => {
            dispatch(setSearchedQuery(""));
        }
    }, [])

    useEffect(() => {
        const combined = [
            ...(allJobs?.map(item => ({ ...item, type: 'job' })) || []),
            ...(allInternship?.map(item => ({ ...item, type: 'internship' })) || []),
            ...(allHackathons?.map(item => ({ ...item, type: 'hackathon' })) || []),
            ...(allWebinars?.map(item => ({ ...item, type: 'webinar' })) || []),
            ...(allCompetitions?.map(item => ({ ...item, type: 'competition' })) || []),
            ...(allCertifications?.map(item => ({ ...item, type: 'certification' })) || [])
        ];

        const query = (searchedQuery || queryParam || "").toLowerCase();

        if (query) {
            const temp = combined.filter(item => {
                const title = item.title?.toLowerCase() || "";
                const desc = item.description?.toLowerCase() || "";
                const type = item.type?.toLowerCase() || "";
                const location = item.location?.toLowerCase() || "";

                return title.includes(query) || desc.includes(query) || type.includes(query) || location.includes(query);
            });
            setAllEvents(temp);
        } else {
            setAllEvents(combined);
        }
    }, [allJobs, allInternship, allHackathons, allWebinars, allCompetitions, allCertifications, searchedQuery, queryParam]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-300">
            <Navbar />
            <div className='max-w-7xl mx-auto py-10 px-4'>
                <div className='mb-12 mt-10'>
                    <h1 className='text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tight'>
                        Search Results
                        <span className='ml-4 text-purple-600 dark:text-purple-400 opacity-50'>({allEvents.length})</span>
                    </h1>
                    <div className='h-1.5 w-24 bg-purple-600 dark:bg-purple-500 rounded-full mt-4'></div>
                </div>

                {allEvents.length === 0 ? (
                    <div className='flex flex-col items-center justify-center py-20 bg-white dark:bg-zinc-900 rounded-[40px] border border-dashed border-gray-200 dark:border-zinc-800 transition-colors'>
                        <img src="https://cdni.iconscout.com/illustration/premium/thumb/not-found-4064375-3363936.png" alt="Not found" className='w-64 opacity-70 dark:grayscale dark:invert' />
                        <p className='text-2xl font-black text-gray-400 dark:text-zinc-600 uppercase tracking-widest mt-8'>No results found</p>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                        {
                            allEvents.map((item, index) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    key={item._id}
                                >
                                    {(() => {
                                        switch (item.type) {
                                            case 'job':
                                                return <Job job={item} />;
                                            case 'internship':
                                                return <InternshipCard job={item} />;
                                            case 'hackathon':
                                                return <HackathonCard job={item} />;
                                            case 'webinar':
                                                return <WebinarCard job={item} />;
                                            case 'competition':
                                                return <CompetitionCard job={item} />;
                                            case 'certification':
                                                return <CertificationCard job={item} />;
                                            default:
                                                return <Job job={item} />;
                                        }
                                    })()}
                                </motion.div>
                            ))
                        }
                    </div>
                )}
            </div>
        </div>
    )
}

export default Browse
