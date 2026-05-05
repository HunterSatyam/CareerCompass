import { BASE_URL } from '../../utils/constant';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, Briefcase, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const SysAdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalJobs: 0,
        totalApplications: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/api/v1/admin/dashboard/stats`, {
                    withCredentials: true
                });
                if (res.data.success) {
                    setStats(res.data.stats);
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchStats();
    }, []);

    const cards = [
        { label: 'Total Platform Users', value: stats.totalUsers, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { label: 'Active Opportunities', value: stats.totalJobs, icon: Briefcase, color: 'text-purple-500', bg: 'bg-purple-500/10' },
        { label: 'Total Applications', value: stats.totalApplications, icon: FileText, color: 'text-pink-500', bg: 'bg-pink-500/10' }
    ];

    return (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
            <div>
                <h1 className="text-3xl font-black tracking-tight uppercase">Overview Dashboard</h1>
                <p className="text-gray-400 mt-2 font-medium">Real-time statistics and platform activity.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cards.map((card, i) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={i}
                        className="bg-gray-900 border border-gray-800 rounded-3xl p-6 relative overflow-hidden group"
                    >
                        <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity ${card.bg.replace('/10', '')}`} />
                        <div className="flex items-center gap-4">
                            <div className={`p-4 rounded-2xl ${card.bg}`}>
                                <card.icon size={24} className={card.color} />
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest">{card.label}</p>
                                <h3 className="text-3xl font-black text-white">{card.value}</h3>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20">
                {/* User Growth Chart (Mock) */}
                <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 relative overflow-hidden group shadow-2xl">
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-500 rounded-full blur-[100px] opacity-10" />
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">User Growth (Last 7 Days)</h3>
                        <div className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-[10px] font-black uppercase tracking-tighter border border-blue-500/20">
                            Live Trend
                        </div>
                    </div>

                    <div className="h-40 flex items-end justify-between gap-1">
                        {[30, 45, 35, 60, 55, 80, 70].map((val, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${val}%` }}
                                    transition={{ delay: i * 0.1, duration: 1, type: "spring" }}
                                    className="w-full bg-gradient-to-t from-blue-600/20 to-blue-400 rounded-t-lg relative group/bar"
                                >
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-white text-black text-[10px] font-bold px-2 py-1 rounded">
                                        {val}
                                    </div>
                                </motion.div>
                                <span className="text-[10px] font-bold text-gray-600">Day {i + 1}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Activity Trends (Mock) */}
                <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 relative overflow-hidden group shadow-2xl">
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-purple-500 rounded-full blur-[100px] opacity-10" />
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Activity Trends (Heatmap)</h3>
                        <div className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full text-[10px] font-black uppercase tracking-tighter border border-purple-500/20">
                            Processing
                        </div>
                    </div>

                    <div className="space-y-4">
                        {[
                            { label: 'Job Applications', val: '85%', color: 'bg-pink-500' },
                            { label: 'Profile Updates', val: '62%', color: 'bg-purple-500' },
                            { label: 'New Recruiters', val: '38%', color: 'bg-indigo-500' },
                            { label: 'Email Alerts', val: '92%', color: 'bg-emerald-500' }
                        ].map((item, i) => (
                            <div key={i} className="space-y-1">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{item.label}</span>
                                    <span className="text-[10px] font-bold text-white">{item.val}</span>
                                </div>
                                <div className="h-2 w-full bg-black rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: item.val }}
                                        transition={{ delay: i * 0.2, duration: 1.5, ease: "circOut" }}
                                        className={`h-full ${item.color}`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SysAdminDashboard;
