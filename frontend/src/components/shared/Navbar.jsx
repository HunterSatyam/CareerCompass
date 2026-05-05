import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { LogOut, User2, Heart, Bell, Menu, Home, Building2, FileText, PlusCircle, Sparkles, FileEdit, Search, ChevronRight, Briefcase, Sun, Moon, Settings, Users, Trophy, Code, BookOpen } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'
import useGetNotifications from '@/hooks/useGetNotifications'
import { toggleTheme } from '@/redux/themeSlice'

const Navbar = () => {
    useGetNotifications();
    const { user } = useSelector(store => store.auth);
    const { allNotifications } = useSelector(store => store.notification);
    const { mode } = useSelector(store => store.theme);
    const dispatch = useDispatch();

    const navigate = useNavigate();

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setUser(null));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Something went wrong while logging out");
        }
    }
    return (
        <div className='sticky top-0 z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-gray-100 dark:border-zinc-800 transition-colors duration-300'>
            <div className='flex items-center justify-between mx-auto max-w-7xl h-16 px-12'>
                <div className='flex items-center gap-4'>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon" className="hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl transition-all h-10 w-10 text-gray-600 dark:text-gray-400 group">
                                <Menu size={24} className='group-hover:rotate-90 transition-transform duration-300' />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-72 p-2 rounded-[28px] shadow-2xl border-gray-50 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl mt-2 animate-in fade-in zoom-in duration-200" align="start">
                            <div className='flex flex-col gap-1'>
                                <div className='px-4 py-3 mb-2 border-b border-gray-50 dark:border-zinc-800 flex items-center justify-between'>
                                    <h3 className='text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]'>Quick Navigation</h3>
                                    <div className='h-1.5 w-1.5 rounded-full bg-purple-500 animate-pulse'></div>
                                </div>
                                {((user?.role === 'recruiter') ? [
                                    { title: 'Home', path: '/', icon: <Home size={18} /> },
                                    { title: 'Organisation', path: '/admin/companies', icon: <Building2 size={18} /> },
                                    { title: 'Posts', path: '/admin/posts', icon: <FileText size={18} /> },
                                    { title: 'Applicant Ranking Table', path: '/admin/posts', icon: <Sparkles size={18} /> },
                                    { title: 'Create Post', path: '/admin/create', icon: <PlusCircle size={18} /> },
                                    { title: 'Assessment Result', path: '/admin/assessment-results', icon: <Trophy size={18} /> },
                                    { title: 'Interview Question Practice', path: '/admin/interview/hub', icon: <Sparkles size={18} /> },
                                    { title: 'Community', path: '/community', icon: <Users size={18} /> },
                                    { title: 'Settings', path: '/settings', icon: <Settings size={18} /> },
                                ] : [
                                    { title: 'Home', path: '/', icon: <Home size={18} /> },
                                    { title: 'Resume Builder', path: '/resume/builder', icon: <FileEdit size={18} /> },
                                    { title: 'ATS Checker', path: '/resume/ats', icon: <Search size={18} /> },
                                    { title: 'Mock Interview', path: '/interview/mock', icon: <Sparkles size={18} /> },
                                    { title: 'Common Questions', path: '/interview/common', icon: <BookOpen size={18} /> },
                                    { title: 'Saved Events', path: '/saved-events', icon: <Heart size={18} /> },
                                    { title: 'My Application', path: '/my-applications', icon: <Briefcase size={18} /> },
                                    { title: 'Community', path: '/community', icon: <Users size={18} /> },
                                    { title: 'Settings', path: '/settings', icon: <Settings size={18} /> },
                                ]).map((link, idx) => (
                                    <Link
                                        key={idx}
                                        to={link.path}
                                        className='flex items-center justify-between p-3.5 rounded-2xl hover:bg-purple-50 dark:hover:bg-purple-900/20 group transition-all'
                                    >
                                        <div className='flex items-center gap-3'>
                                            <div className='p-2 bg-gray-50 dark:bg-zinc-800 rounded-xl text-gray-400 group-hover:bg-white dark:group-hover:bg-zinc-700 group-hover:text-purple-600 group-hover:shadow-sm transition-all relative'>
                                                {link.icon}
                                                {link.badge > 0 && (
                                                    <span className='absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[8px] text-white font-bold ring-2 ring-white dark:ring-zinc-900'>
                                                        {link.badge}
                                                    </span>
                                                )}
                                            </div>
                                            <span className='font-bold text-gray-600 dark:text-gray-300 group-hover:text-purple-600 transition-colors uppercase text-[11px] tracking-wider'>{link.title}</span>
                                        </div>
                                        <ChevronRight size={14} className='text-gray-300 dark:text-zinc-600 group-hover:text-purple-400 group-hover:translate-x-1 transition-all' />
                                    </Link>
                                ))}
                            </div>
                        </PopoverContent>
                    </Popover>
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-indigo-600 dark:bg-indigo-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                            C
                        </div>
                        <h2 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">
                            Career<span className="text-indigo-600 dark:text-indigo-400">Compass</span>
                        </h2>
                    </Link>
                </div>
                <div className='flex items-center gap-8'>
                    <ul className='flex font-black text-sm uppercase tracking-widest items-center gap-6 text-gray-600 dark:text-gray-400'>
                        {
                            user && user.role === 'recruiter' ? (
                                <>
                                    <li className='hover:text-purple-600 transition-colors text-zinc-900 dark:text-zinc-100'><Link to="/">Home</Link></li>
                                    <li className='hover:text-purple-600 transition-colors text-zinc-900 dark:text-zinc-100'><Link to="/admin/companies">Organisation</Link></li>
                                    <li className='hover:text-purple-600 transition-colors text-zinc-900 dark:text-zinc-100'><Link to="/admin/posts">Posts</Link></li>
                                    <li className='hover:text-purple-600 transition-colors text-zinc-900 dark:text-zinc-100'><Link to="/admin/create">Create Post</Link></li>
                                    <li className='hover:text-purple-600 transition-colors text-zinc-900 dark:text-zinc-100'><Link to="/admin/interview/hub">Interview Hub</Link></li>
                                    <li className='hover:text-purple-600 transition-colors text-zinc-900 dark:text-zinc-100'><Link to="/community">Community</Link></li>
                                </>
                            ) : (
                                <>
                                    <li className='hover:text-purple-600 transition-colors text-zinc-900 dark:text-zinc-100'><Link to="/">Home</Link></li>
                                    <li className='hover:text-purple-600 transition-colors text-zinc-900 dark:text-zinc-100'><Link to="/events">Events</Link></li>
                                    <li className='hover:text-purple-600 transition-colors text-zinc-900 dark:text-zinc-100'><Link to="/interview/mock">Interview</Link></li>
                                    <li className='hover:text-purple-600 transition-colors text-zinc-900 dark:text-zinc-100'><Link to="/resume/builder">Builder</Link></li>
                                    <li className='hover:text-purple-600 transition-colors text-zinc-900 dark:text-zinc-100'><Link to="/resume/ats">ATS</Link></li>
                                    <li className='hover:text-purple-600 transition-colors text-zinc-900 dark:text-zinc-100'><Link to="/community">Community</Link></li>
                                    <li className='hover:text-purple-600 transition-colors text-zinc-900 dark:text-zinc-100'>
                                        <Link to="/saved-events" className='flex items-center gap-2'>
                                            <Heart size={20} />
                                            <span className='hidden md:inline'></span>
                                        </Link>
                                    </li>
                                    <li className='hover:text-purple-600 transition-colors relative text-zinc-900 dark:text-zinc-100'>
                                        <Link to="/notification">
                                            <Bell size={20} />
                                        </Link>
                                        {allNotifications.filter(n => !n.isRead).length > 0 && (
                                            <span className='absolute -top-2 -right-3 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] text-white font-bold ring-2 ring-white dark:ring-zinc-900 animate-pulse'>
                                                {allNotifications.filter(n => !n.isRead).length}
                                            </span>
                                        )}
                                    </li>

                                </>
                            )
                        }



                    </ul>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => dispatch(toggleTheme())}
                        className="rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-600 dark:text-gray-400 transition-all duration-300"
                    >
                        {mode === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    </Button>

                    {
                        !user ? (
                            <div className='flex items-center gap-2'>
                                <Link to="/login">
                                    <Button variant="outline" className="border-gray-300 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-200 transition-colors duration-300">
                                        Login
                                    </Button>
                                </Link>
                                <Link to="/signup">
                                    <Button className="bg-gradient-to-r from-[#6A38C2] to-[#8a46a3] hover:from-[#5b30a6] hover:to-[#783e8f] text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5">
                                        Signup
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Avatar className="cursor-pointer ring-2 ring-transparent hover:ring-purple-500 transition-all">
                                        <AvatarImage src={user?.profile?.profilePhoto} alt="@shadcn" />
                                        <AvatarFallback className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-bold">{user?.fullname?.charAt(0)?.toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                </PopoverTrigger>
                                <PopoverContent className="w-80 p-4 rounded-3xl shadow-2xl border-gray-100 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl mt-2 animate-in fade-in zoom-in duration-200">
                                    <div className='space-y-4'>
                                        <div className='flex items-center gap-4 p-2'>
                                            <Avatar className="h-12 w-12 ring-2 ring-purple-100 dark:ring-purple-900/30">
                                                <AvatarImage src={user?.profile?.profilePhoto} alt="@shadcn" />
                                                <AvatarFallback className="bg-purple-100 dark:bg-purple-100 text-purple-700 font-bold">{user?.fullname?.charAt(0)?.toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <h4 className='font-bold text-gray-900 dark:text-white truncate'>{user?.fullname}</h4>
                                                <p className='text-xs text-gray-500 dark:text-gray-400 line-clamp-1'>{user?.profile?.bio || 'No bio provided'}</p>
                                            </div>
                                        </div>

                                        <div className='flex flex-col gap-1'>
                                            <Link to="/profile" className='flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-zinc-800 group transition-all'>
                                                <div className="p-2 bg-gray-50 dark:bg-zinc-800 rounded-xl text-gray-400 group-hover:bg-white dark:group-hover:bg-zinc-700 group-hover:text-purple-600 transition-all">
                                                    <User2 size={18} />
                                                </div>
                                                <span className='font-bold text-[11px] uppercase tracking-wider text-gray-600 dark:text-gray-300 group-hover:text-purple-600 transition-colors'>View Profile</span>
                                            </Link>

                                            {user?.role !== 'recruiter' && (
                                                <Link to="/my-applications" className='flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-zinc-800 group transition-all'>
                                                    <div className="p-2 bg-gray-50 dark:bg-zinc-800 rounded-xl text-gray-400 group-hover:bg-white dark:group-hover:bg-zinc-700 group-hover:text-purple-600 transition-all">
                                                        <Briefcase size={18} />
                                                    </div>
                                                    <span className='font-bold text-[11px] uppercase tracking-wider text-gray-600 dark:text-gray-300 group-hover:text-purple-600 transition-colors'>My Application</span>
                                                </Link>
                                            )}

                                            <Link to="/settings" className='flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-zinc-800 group transition-all'>
                                                <div className="p-2 bg-gray-50 dark:bg-zinc-800 rounded-xl text-gray-400 group-hover:bg-white dark:group-hover:bg-zinc-700 group-hover:text-indigo-600 transition-all">
                                                    <Settings size={18} />
                                                </div>
                                                <span className='font-bold text-[11px] uppercase tracking-wider text-gray-600 dark:text-gray-300 group-hover:text-indigo-600 transition-colors'>Settings</span>
                                            </Link>

                                            <button onClick={logoutHandler} className='flex w-full items-center gap-3 p-3 rounded-2xl hover:bg-rose-50 dark:hover:bg-rose-900/10 group transition-all'>
                                                <div className="p-2 bg-gray-50 dark:bg-zinc-800 rounded-xl text-gray-400 group-hover:bg-white dark:group-hover:bg-zinc-700 group-hover:text-rose-600 transition-all">
                                                    <LogOut size={18} />
                                                </div>
                                                <span className='font-bold text-[11px] uppercase tracking-wider text-gray-600 dark:text-gray-300 group-hover:text-rose-600 transition-colors'>Logout</span>
                                            </button>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        )
                    }

                </div>
            </div>

        </div>
    )
}

export default Navbar