import React, { useEffect, useState } from 'react'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { useDispatch, useSelector } from 'react-redux'
import { setFilters } from '@/redux/jobSlice'
import { Search, X, Filter } from 'lucide-react'

const filterData = [
    {
        filterType: "Events Type",
        key: "type",
        array: ["Jobs", "Internships", "Hackathons", "Webinars", "Certification", "Competition"]
    },
    {
        filterType: "Location",
        key: "location",
        array: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai", "Remote"]
    },
    {
        filterType: "Industry",
        key: "industry",
        array: ["Frontend Developer", "Backend Developer", "FullStack Developer", "Data Science", "Design"]
    },
    {
        filterType: "Date of Post",
        key: "date",
        array: ["Last 24 Hours", "Last 7 Days", "Last Month", "Anytime"]
    },
    {
        filterType: "Income",
        key: "income",
        array: ["0-3LPA", "3LPA-6LPA", "6LPA-10LPA", "10LPA-25LPA", "25LPA+"]
    }
]

const FilterCard = () => {
    const { filters } = useSelector(store => store.job);
    const [title, setTitle] = useState(filters.title || "");
    const dispatch = useDispatch();

    const changeHandler = (key, value) => {
        dispatch(setFilters({ [key]: value }));
    }

    const clearFilters = () => {
        setTitle("");
        dispatch(setFilters({
            title: "",
            type: "",
            location: "",
            industry: "",
            date: "",
            income: ""
        }));
    }

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            dispatch(setFilters({ title }));
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [title]);

    return (
        <div className='w-full bg-white dark:bg-zinc-900 bg-opacity-90 dark:bg-opacity-90 backdrop-blur-md p-6 rounded-[24px] shadow-xl border border-gray-100/50 dark:border-zinc-800 sticky top-24 transition-all duration-300'>
            <div className='flex items-center justify-between mb-6 pb-4 border-b border-gray-50 dark:border-zinc-800'>
                <div className='flex items-center gap-2'>
                    <div className='p-2 bg-purple-50 dark:bg-purple-900/20 rounded-xl text-purple-600 dark:text-purple-400'>
                        <Filter size={18} />
                    </div>
                    <h1 className='text-xl font-black text-gray-900 dark:text-white'>Filters</h1>
                </div>
                {(filters.title || filters.type || filters.location || filters.industry || filters.date || filters.income) && (
                    <button
                        onClick={clearFilters}
                        className='text-[10px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-widest hover:text-purple-700 dark:hover:text-purple-300 flex items-center gap-1 transition-colors'
                    >
                        <X size={12} /> Clear All
                    </button>
                )}
            </div>

            <div className='space-y-8'>
                {/* Search by Title */}
                <div className='space-y-3'>
                    <label className='text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em] ml-1'>Search Title</label>
                    <div className='relative group'>
                        <Search className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 dark:text-zinc-600 group-focus-within:text-purple-500 dark:group-focus-within:text-purple-400 transition-colors' size={18} />
                        <Input
                            type="text"
                            placeholder="Search by name..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full h-12 bg-gray-50/50 dark:bg-zinc-800/50 border-gray-100 dark:border-zinc-800 rounded-2xl pl-12 focus-visible:ring-purple-500/20 focus-visible:border-purple-500 dark:focus-visible:border-purple-400 transition-all font-medium text-gray-900 dark:text-white"
                        />
                    </div>
                </div>

                {/* Radio Filters */}
                {
                    filterData.map((data, index) => (
                        <div key={index} className='space-y-4'>
                            <h2 className='text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em] ml-1'>{data.filterType}</h2>
                            <RadioGroup
                                value={filters[data.key]}
                                onValueChange={(value) => changeHandler(data.key, value)}
                                className="space-y-3"
                            >
                                {
                                    data.array.map((item, idx) => {
                                        const itemId = `id${index}-${idx}`
                                        return (
                                            <div key={itemId} className='flex items-center space-x-3 group cursor-pointer hover:bg-purple-50/50 dark:hover:bg-purple-900/10 p-2.5 rounded-xl transition-all duration-200 border border-transparent hover:border-purple-100/50 dark:hover:border-purple-900/30'>
                                                <RadioGroupItem
                                                    value={item}
                                                    id={itemId}
                                                    className="border-gray-300 dark:border-zinc-700 text-purple-600 dark:text-purple-400 focus:ring-purple-500 dark:focus:ring-purple-400"
                                                />
                                                <Label htmlFor={itemId} className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white cursor-pointer font-bold flex-1">{item}</Label>
                                            </div>
                                        )
                                    })
                                }
                            </RadioGroup>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default FilterCard

