import { BASE_URL } from '../../utils/constant';
import React from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { LayoutDashboard, Users, Briefcase, Trophy, Video, FileText, Bell, BarChart, Settings, LogOut, Code, Award, Sparkles } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setAdminUser } from '@/redux/sysAdminSlice';
import axios from 'axios';
import { toast } from 'sonner';

const SysAdminLayout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/v1/admin/logout`, {
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setAdminUser(null));
                navigate("/sys-admin/login");
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error("Logout Error");
        }
    };

    const sidebarLinks = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/sys-admin/dashboard' },
        { name: 'Users', icon: Users, path: '/sys-admin/users' },
        { name: 'Jobs', icon: Briefcase, path: '/sys-admin/jobs' },
        { name: 'Internships', icon: FileText, path: '/sys-admin/internships' },
        { name: 'Hackathons', icon: Code, path: '/sys-admin/hackathons' },
        { name: 'Competitions', icon: Trophy, path: '/sys-admin/competitions' },
        { name: 'Webinars', icon: Video, path: '/sys-admin/webinars' },
        { name: 'Certifications', icon: Award, path: '/sys-admin/certifications' },
        { name: 'Mock Interview', icon: Sparkles, path: '/admin/interview/hub' },
        { name: 'Analytics', icon: BarChart, path: '/sys-admin/analytics' },
        { name: 'Settings', icon: Settings, path: '/sys-admin/settings' },
    ];

    return (
        <div className="flex h-screen bg-gray-950 text-white overflow-hidden font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col hidden md:flex">
                <div className="h-16 flex items-center px-6 border-b border-gray-800">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-indigo-600 dark:bg-indigo-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                            C
                        </div>
                        <h2 className="text-2xl font-black tracking-tight text-white dark:text-white">
                            Career<span className="text-indigo-600 dark:text-indigo-400">Compass</span>
                        </h2>
                    </Link>
                </div>
                <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
                    {sidebarLinks.map((link) => (
                        <NavLink
                            key={link.name}
                            to={link.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-3 rounded-xl transition-all font-medium text-sm ${isActive
                                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                                }`
                            }
                        >
                            <link.icon size={18} />
                            {link.name}
                        </NavLink>
                    ))}
                </div>
                <div className="p-4 border-t border-gray-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-3 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors font-medium text-sm"
                    >
                        <LogOut size={18} />
                        Logout Session
                    </button>
                </div>
            </aside>

            {/* Main Content Pane */}
            <div className="flex-1 flex flex-col h-full bg-black/40">
                {/* Top Navbar */}
                <header className="h-16 bg-gray-900/50 backdrop-blur-md border-b border-gray-800 flex items-center justify-between px-6 sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <div className="text-gray-300 font-semibold md:hidden">Career Compass</div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/sys-admin/notifications')}
                            className="p-2 text-gray-400 hover:text-white transition-colors relative"
                        >
                            <Bell size={20} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-purple-500 rounded-full"></span>
                        </button>
                        <div
                            onClick={() => navigate('/sys-admin/profile')}
                            className="h-8 w-8 rounded-full flex items-center justify-center bg-gradient-to-tr from-purple-500 to-indigo-500 border-2 border-gray-800 shadow-md cursor-pointer hover:opacity-80 transition-opacity"
                        >
                            <span className="text-white font-bold text-xs">SA</span>
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <main className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default SysAdminLayout;
