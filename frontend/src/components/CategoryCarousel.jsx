import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import { Button } from './ui/button';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSearchedQuery } from '@/redux/jobSlice';
import { motion } from 'framer-motion';

const category = [
    "Frontend Developer",
    "Backend Developer",
    "Data Science",
    "Graphic Designer",
    "FullStack Developer",
    "AI and ML Engineer",
    "Data Analytics",
    "DevOP Engineer",
    "Cloud Engineer"
]

const CategoryCarousel = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchJobHandler = (query) => {
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    }

    return (
        <div className="w-full max-w-4xl mx-auto py-10">
            <Carousel className="w-full">
                <CarouselContent className="px-4">
                    {
                        category.map((cat, index) => (
                            <CarouselItem key={index} className="basis-auto">
                                <motion.div
                                    whileHover={{ y: -5 }}
                                    className="p-1"
                                >
                                    <button
                                        onClick={() => searchJobHandler(cat)}
                                        className="h-12 px-8 rounded-2xl bg-white dark:bg-zinc-900 text-gray-900 dark:text-white border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:border-purple-500 dark:hover:border-purple-400 transition-all font-black text-[10px] uppercase tracking-widest whitespace-nowrap active:scale-95"
                                    >
                                        {cat}
                                    </button>
                                </motion.div>
                            </CarouselItem>
                        ))
                    }
                </CarouselContent>
                <div className='hidden md:block'>
                    <CarouselPrevious className="h-12 w-12 rounded-2xl bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800 text-gray-400 dark:text-zinc-500 hover:text-purple-600 dark:hover:text-purple-400 transition-all shadow-lg" />
                    <CarouselNext className="h-12 w-12 rounded-2xl bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800 text-gray-400 dark:text-zinc-500 hover:text-purple-600 dark:hover:text-purple-400 transition-all shadow-lg" />
                </div>
            </Carousel>
        </div>
    )
}

export default CategoryCarousel