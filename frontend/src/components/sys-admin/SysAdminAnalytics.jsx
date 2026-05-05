import { BASE_URL } from '../../utils/constant';
import React, { useEffect, useState } from 'react';
import { BarChart, Activity, TrendingUp, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'sonner';

const SysAdminAnalytics = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await axios.get('${BASE_URL}/api/v1/admin/analytics', {
                    withCredentials: true
                });
                if (res.data.success) {
                    setData(res.data.analytics);
                }
            } catch (error) {
                toast.error("Failed to load real-time analytics");
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500 text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight uppercase">Analytics & Reports</h1>
                    <p className="text-gray-400 mt-2 font-medium">Deep-dive insights and platform performance metrics across the Career Compass database.</p>
                </div>
                <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold uppercase tracking-widest text-xs rounded-full shadow-lg shadow-purple-600/30 transition-all active:scale-95 border-none">
                    Export PDF
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 relative overflow-hidden">
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-500 rounded-full blur-3xl opacity-20" />
                    <Users size={24} className="text-blue-500 mb-4" />
                    <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">New Registrations</p>
                    <h3 className="text-3xl font-black text-white mt-1">+{data?.newRegistrations || 0}</h3>
                    <p className={`text-xs font-semibold mt-2 ${data?.userTrend >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {data?.userTrend >= 0 ? '↑' : '↓'} {Math.abs(data?.userTrend)}% since last month
                    </p>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 relative overflow-hidden">
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-purple-500 rounded-full blur-3xl opacity-20" />
                    <TrendingUp size={24} className="text-purple-500 mb-4" />
                    <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">App Success Rate</p>
                    <h3 className="text-3xl font-black text-white mt-1">{data?.successRate || 0}%</h3>
                    <p className="text-xs text-emerald-400 font-semibold mt-2">Verified Real-Time Meta</p>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 relative overflow-hidden">
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-pink-500 rounded-full blur-3xl opacity-20" />
                    <Activity size={24} className="text-pink-500 mb-4" />
                    <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Next Week Prediction</p>
                    <h3 className="text-3xl font-black text-white mt-1">~{data?.predictedNextWeek || 0}</h3>
                    <p className="text-xs text-purple-400 font-semibold mt-2">ML-Based User Projection</p>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 relative overflow-hidden">
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-500 rounded-full blur-3xl opacity-20" />
                    <BarChart size={24} className="text-blue-500 mb-4" />
                    <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Platform Revenue</p>
                    <h3 className="text-3xl font-black text-white mt-1">$0.00</h3>
                    <p className="text-xs text-gray-500 font-semibold mt-2">Payment Gateway Pending</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 h-[400px] flex flex-col justify-between relative overflow-hidden text-white">
                    <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-6">Traffic Analysis (Last 7 Days)</h3>
                    <div className="flex-1 flex items-end justify-between gap-2 md:gap-4 px-4 pb-4">
                        {[40, 70, 45, 90, 60, 85, 50].map((h, i) => (
                            <motion.div
                                key={i}
                                initial={{ height: 0 }}
                                animate={{ height: `${h}%` }}
                                transition={{ delay: i * 0.1, duration: 1, type: "spring" }}
                                className="w-full bg-gradient-to-t from-purple-600 to-indigo-400 rounded-t-xl opacity-80 hover:opacity-100 transition-opacity"
                            ></motion.div>
                        ))}
                    </div>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 h-[400px] flex flex-col justify-between relative overflow-hidden text-white">
                    <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-6">Application Breakdown</h3>
                    <div className="flex-1 flex flex-col justify-center gap-6">
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-bold text-gray-400 uppercase">
                                <span>Jobs</span>
                                <span>{data?.trends?.jobs || 0}%</span>
                            </div>
                            <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: `${data?.trends?.jobs || 0}%` }} transition={{ duration: 1 }} className="h-full bg-blue-500"></motion.div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-bold text-gray-400 uppercase">
                                <span>Internships</span>
                                <span>{data?.trends?.internships || 0}%</span>
                            </div>
                            <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: `${data?.trends?.internships || 0}%` }} transition={{ duration: 1, delay: 0.2 }} className="h-full bg-orange-500"></motion.div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-bold text-gray-400 uppercase">
                                <span>Hackathons</span>
                                <span>{data?.trends?.hackathons || 0}%</span>
                            </div>
                            <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: `${data?.trends?.hackathons || 0}%` }} transition={{ duration: 1, delay: 0.4 }} className="h-full bg-pink-500"></motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SysAdminAnalytics;
