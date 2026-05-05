import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { User as UserIcon, Mail, Shield, Key, Clock, Settings, Save } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { toast } from 'sonner';

const SysAdminProfile = () => {
    const { adminUser } = useSelector(store => store.sysadmin);
    const [loading, setLoading] = useState(false);

    // Fallback if adminUser is null for some reason
    const currentAdmin = adminUser || {
        fullname: 'Super Admin',
        email: 'admin@unstop.com',
        role: 'Super Admin',
        lastLogin: new Date().toISOString()
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            toast.success("Profile details updated successfully");
        }, 1000);
    };

    return (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500 max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight uppercase">Admin Profile</h1>
                    <p className="text-gray-400 mt-2 font-medium">Manage your administrative footprint and credentials.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Card Profile */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-xl flex flex-col items-center text-center">
                        <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 p-1 mb-6 relative group cursor-pointer">
                            <div className="w-full h-full bg-black rounded-full flex items-center justify-center border-4 border-gray-900 group-hover:opacity-80 transition-opacity">
                                <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
                                    {currentAdmin.fullname.charAt(0)}
                                </span>
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white font-bold text-xs uppercase bg-black/60 rounded-full">
                                Change
                            </div>
                        </div>

                        <h2 className="text-2xl font-black text-white">{currentAdmin.fullname}</h2>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full text-xs font-bold uppercase tracking-widest mt-3 border border-purple-500/20">
                            <Shield size={12} /> {currentAdmin.role}
                        </span>
                    </div>

                    <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 shadow-xl">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Account Metadata</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gray-800 rounded-lg"><Clock size={16} className="text-gray-400" /></div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase">Last Login Session</p>
                                    <p className="text-sm font-medium text-white">{new Date(currentAdmin.lastLogin).toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gray-800 rounded-lg"><Key size={16} className="text-gray-400" /></div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase">Permissions</p>
                                    <p className="text-sm font-medium text-white">Full System Access</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Edit Form */}
                <div className="lg:col-span-2">
                    <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-xl">
                        <div className="flex items-center gap-3 mb-8 border-b border-gray-800 pb-4">
                            <Settings className="text-purple-500" size={24} />
                            <h2 className="text-xl font-bold text-white uppercase tracking-wider">Profile Settings</h2>
                        </div>

                        <form onSubmit={handleUpdate} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Full Name</label>
                                    <div className="relative group">
                                        <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-500 transition-colors" size={18} />
                                        <Input
                                            defaultValue={currentAdmin.fullname}
                                            className="h-14 bg-black border border-gray-800 rounded-2xl pl-12 focus-visible:ring-2 focus-visible:ring-purple-500 text-white"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Email Address</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-500 transition-colors" size={18} />
                                        <Input
                                            type="email"
                                            defaultValue={currentAdmin.email}
                                            readOnly
                                            className="h-14 bg-gray-950 border border-gray-800 rounded-2xl pl-12 focus-visible:ring-0 text-gray-500 cursor-not-allowed opacity-70"
                                        />
                                    </div>
                                    <p className="text-xs text-red-400 ml-1">Super Admin email cannot be changed.</p>
                                </div>
                            </div>

                            <hr className="border-gray-800 my-6" />

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Change Password</label>
                                <div className="relative group">
                                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-500 transition-colors" size={18} />
                                    <Input
                                        type="password"
                                        placeholder="Enter new password (optional)"
                                        className="h-14 bg-black border border-gray-800 rounded-2xl pl-12 focus-visible:ring-2 focus-visible:ring-purple-500 text-white placeholder:text-gray-700"
                                    />
                                </div>
                            </div>

                            <div className="relative group">
                                <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-500 transition-colors" size={18} />
                                <Input
                                    type="password"
                                    placeholder="Confirm new password"
                                    className="h-14 bg-black border border-gray-800 rounded-2xl pl-12 focus-visible:ring-2 focus-visible:ring-purple-500 text-white placeholder:text-gray-700"
                                />
                            </div>

                            <div className="pt-6 flex justify-end">
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="h-14 px-8 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-purple-600/20"
                                >
                                    <Save size={18} />
                                    {loading ? 'Saving...' : 'Save Profile'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SysAdminProfile;
