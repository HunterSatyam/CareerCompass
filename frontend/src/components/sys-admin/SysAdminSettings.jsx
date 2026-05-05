import { BASE_URL } from '../../utils/constant';
import React, { useState } from 'react';
import { Shield, Bell, Key, Globe, Database, Save, Server } from 'lucide-react';
import { toast } from 'sonner';

const SysAdminSettings = () => {
    const [toggles, setToggles] = useState({
        maintMode: false,
        newSignups: true,
        emailNotifs: true,
        autoApproveOps: false,
        ipLogging: true
    });

    const handleSave = () => {
        toast.promise(new Promise(resolve => setTimeout(resolve, 1000)), {
            loading: 'Saving global settings...',
            success: 'Platform settings updated and synchronized successfully!',
            error: 'Failed to update settings'
        });
    };

    return (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500 max-w-5xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight uppercase">Platform Settings</h1>
                    <p className="text-gray-400 mt-2 font-medium">Configure global platform options and security features.</p>
                </div>
                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold uppercase tracking-widest text-xs rounded-full shadow-lg shadow-purple-600/30 transition-all active:scale-95 border-none"
                >
                    <Save size={16} /> Save Changes
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
                {/* Global Toggles */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-xl">
                        <div className="flex items-center gap-3 mb-6 border-b border-gray-800 pb-4">
                            <Server className="text-purple-500" size={24} />
                            <h2 className="text-lg font-bold text-white uppercase tracking-wider">System Toggles</h2>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-bold text-white">Maintenance Mode</h4>
                                    <p className="text-sm text-gray-500 mt-1">Disables the main public site for regular users. Admin dashboard remains accessible via your IP.</p>
                                </div>
                                <div
                                    onClick={() => setToggles({ ...toggles, maintMode: !toggles.maintMode })}
                                    className={`w-14 h-7 flex items-center rounded-full p-1 cursor-pointer transition-colors ${toggles.maintMode ? 'bg-purple-600' : 'bg-gray-700'}`}
                                >
                                    <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform ${toggles.maintMode ? 'translate-x-7' : 'translate-x-0'}`}></div>
                                </div>
                            </div>

                            <hr className="border-gray-800" />

                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-bold text-white">Allow New Signups</h4>
                                    <p className="text-sm text-gray-500 mt-1">When disabled, new users or recruiters will not be able to create accounts.</p>
                                </div>
                                <div
                                    onClick={() => setToggles({ ...toggles, newSignups: !toggles.newSignups })}
                                    className={`w-14 h-7 flex items-center rounded-full p-1 cursor-pointer transition-colors ${toggles.newSignups ? 'bg-emerald-500' : 'bg-gray-700'}`}
                                >
                                    <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform ${toggles.newSignups ? 'translate-x-7' : 'translate-x-0'}`}></div>
                                </div>
                            </div>

                            <hr className="border-gray-800" />

                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-bold text-white">Auto-Approve Opportunities</h4>
                                    <p className="text-sm text-gray-500 mt-1">Skip manual admin review for new Jobs and Internships posted by verified recruiters.</p>
                                </div>
                                <div
                                    onClick={() => setToggles({ ...toggles, autoApproveOps: !toggles.autoApproveOps })}
                                    className={`w-14 h-7 flex items-center rounded-full p-1 cursor-pointer transition-colors ${toggles.autoApproveOps ? 'bg-purple-600' : 'bg-gray-700'}`}
                                >
                                    <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform ${toggles.autoApproveOps ? 'translate-x-7' : 'translate-x-0'}`}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-xl">
                        <div className="flex items-center gap-3 mb-6 border-b border-gray-800 pb-4">
                            <Shield className="text-emerald-500" size={24} />
                            <h2 className="text-lg font-bold text-white uppercase tracking-wider">Security Setup</h2>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-bold text-white">Global IP Logging</h4>
                                    <p className="text-sm text-gray-500 mt-1">Log IP addresses of all user and admin actions natively.</p>
                                </div>
                                <div
                                    onClick={() => setToggles({ ...toggles, ipLogging: !toggles.ipLogging })}
                                    className={`w-14 h-7 flex items-center rounded-full p-1 cursor-pointer transition-colors ${toggles.ipLogging ? 'bg-emerald-500' : 'bg-gray-700'}`}
                                >
                                    <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform ${toggles.ipLogging ? 'translate-x-7' : 'translate-x-0'}`}></div>
                                </div>
                            </div>

                            <hr className="border-gray-800" />

                            <div>
                                <h4 className="font-bold text-white mb-3">Admin Session Timeout</h4>
                                <select className="w-full h-12 px-4 bg-black border border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white font-medium">
                                    <option value="15">15 Minutes of Inactivity</option>
                                    <option value="30">30 Minutes of Inactivity</option>
                                    <option value="60">1 Hour of Inactivity</option>
                                    <option value="1440">Never (24-Hour Token Expiry only)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info Sidebar */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-purple-900/40 to-black border border-purple-500/20 rounded-3xl p-8 shadow-xl">
                        <Key className="text-purple-400 mb-4" size={32} />
                        <h3 className="text-xl font-black text-white uppercase tracking-wider mb-2">Super Admin Access</h3>
                        <p className="text-sm text-gray-400 mb-6">You are logged in as the Super Admin. You possess irrevocable systemic rights across Career Compass.</p>

                        <button className="w-full py-3 bg-red-500/10 text-red-400 hover:bg-red-500/20 font-bold uppercase tracking-widest text-xs rounded-xl transition-colors border border-red-500/20">
                            Reset Admin Password
                        </button>
                    </div>

                    <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 shadow-xl space-y-4">
                        <div className="flex items-center gap-3">
                            <Database className="text-blue-400" size={20} />
                            <div>
                                <p className="text-xs text-gray-500 font-bold uppercase">Database Status</p>
                                <p className="text-sm text-emerald-400 font-medium">MongoDB Connected</p>
                            </div>
                        </div>
                        <div className="border-t border-gray-800 my-2"></div>
                        <div className="flex items-center gap-3">
                            <Globe className="text-blue-400" size={20} />
                            <div>
                                <p className="text-xs text-gray-500 font-bold uppercase">React Server Built</p>
                                <p className="text-sm text-white font-medium">Vite • Port 5173</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SysAdminSettings;
