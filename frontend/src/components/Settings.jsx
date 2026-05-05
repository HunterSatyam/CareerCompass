import React, { useState } from 'react';
import Navbar from './shared/Navbar';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import {
    User,
    Lock,
    Bell,
    Shield,
    Moon,
    Sun,
    Trash2,
    ChevronRight,
    Settings as SettingsIcon,
    Mail,
    Phone,
    UserCircle,
    BadgeCheck,
    Smartphone,
    Globe,
    Eye,
    Zap,
    MessageSquare,
    Rss
} from 'lucide-react';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { toggleTheme } from '@/redux/themeSlice';
import { toast } from 'sonner';

const Settings = () => {
    const { user } = useSelector(store => store.auth);
    const { mode } = useSelector(store => store.theme);
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState('account');

    const tabs = [
        { id: 'account', label: 'Account', icon: <User size={18} /> },
        { id: 'security', label: 'Security', icon: <Lock size={18} /> },
        { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
        { id: 'appearance', label: 'Appearance', icon: <Sun size={18} /> },
        { id: 'privacy', label: 'Privacy', icon: <Shield size={18} /> },
    ];

    const handleSave = () => {
        toast.success("Settings updated successfully!");
    };

    const handleDeleteAccount = () => {
        toast.error("Account deletion is disabled for demo purposes.");
    };

    return (
        <div className="min-h-screen bg-[#F8F9FF] dark:bg-black transition-colors duration-300">
            <Navbar />

            <div className='max-w-6xl mx-auto py-12 px-4'>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='mb-10 text-center md:text-left'
                >
                    <div className='inline-flex items-center gap-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4'>
                        <SettingsIcon size={14} /> Control Centre
                    </div>
                    <h1 className='text-4xl font-black text-gray-900 dark:text-white tracking-tight uppercase'>Account <span className='text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400'>Settings</span></h1>
                    <p className='text-gray-500 dark:text-zinc-500 mt-2 font-medium'>Manage your account preferences, security, and appearance.</p>
                </motion.div>

                <div className='grid grid-cols-1 lg:grid-cols-12 gap-8'>
                    {/* Sidebar Tabs */}
                    <div className='lg:col-span-3 space-y-2'>
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 group ${activeTab === tab.id
                                    ? 'bg-white dark:bg-zinc-900 shadow-xl shadow-indigo-100/50 dark:shadow-none border border-white dark:border-zinc-800'
                                    : 'hover:bg-indigo-50 dark:hover:bg-zinc-900/50'
                                    }`}
                            >
                                <div className='flex items-center gap-3'>
                                    <div className={`p-2 rounded-xl transition-colors ${activeTab === tab.id
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-gray-100 dark:bg-zinc-800 text-gray-400 group-hover:text-indigo-600'
                                        }`}>
                                        {tab.icon}
                                    </div>
                                    <span className={`font-bold text-sm ${activeTab === tab.id ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-zinc-500'
                                        }`}>{tab.label}</span>
                                </div>
                                <ChevronRight size={14} className={`${activeTab === tab.id ? 'text-indigo-600 opacity-100' : 'opacity-0 group-hover:opacity-100'
                                    } transition-all`} />
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className='lg:col-span-9'>
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                            className='bg-white dark:bg-zinc-900 rounded-[40px] p-8 md:p-10 shadow-xl dark:shadow-none border border-white dark:border-zinc-800'
                        >
                            {/* Account Tab */}
                            {activeTab === 'account' && (
                                <div className='space-y-8'>
                                    <div className='flex items-center gap-4 mb-2'>
                                        <div className='h-20 w-20 rounded-[24px] bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400'>
                                            <UserCircle size={40} />
                                        </div>
                                        <div>
                                            <h3 className='text-xl font-black text-gray-900 dark:text-white'>Profile Information</h3>
                                            <p className='text-gray-500 text-sm font-medium'>Update your basic account details.</p>
                                        </div>
                                    </div>

                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                        <div className='space-y-2'>
                                            <label className='text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1'>Full Name</label>
                                            <div className='flex items-center gap-3 p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-2xl border border-gray-100 dark:border-zinc-800 text-gray-900 dark:text-zinc-200 font-bold'>
                                                <User size={18} className='text-indigo-500' />
                                                {user?.fullname}
                                            </div>
                                        </div>
                                        <div className='space-y-2'>
                                            <label className='text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1'>Email Address</label>
                                            <div className='flex items-center gap-3 p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-2xl border border-gray-100 dark:border-zinc-800 text-gray-900 dark:text-zinc-200 font-bold'>
                                                <Mail size={18} className='text-indigo-500' />
                                                {user?.email}
                                            </div>
                                        </div>
                                        <div className='space-y-2'>
                                            <label className='text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1'>Phone Number</label>
                                            <div className='flex items-center gap-3 p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-2xl border border-gray-100 dark:border-zinc-800 text-gray-900 dark:text-zinc-200 font-bold'>
                                                <Phone size={18} className='text-indigo-500' />
                                                {user?.phoneNumber || 'Not provided'}
                                            </div>
                                        </div>
                                        <div className='space-y-2'>
                                            <label className='text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1'>Account Role</label>
                                            <div className='flex items-center gap-3 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-900/50 text-indigo-700 dark:text-indigo-400 font-black uppercase text-[10px] tracking-widest'>
                                                <BadgeCheck size={18} />
                                                {user?.role}
                                            </div>
                                        </div>
                                    </div>

                                    <div className='pt-6 border-t border-gray-50 dark:border-zinc-800'>
                                        <Button
                                            onClick={handleSave}
                                            className='h-14 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 dark:shadow-none'
                                        >
                                            Update Profile
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Appearance Tab */}
                            {activeTab === 'appearance' && (
                                <div className='space-y-8'>
                                    <div>
                                        <h3 className='text-xl font-black text-gray-900 dark:text-white'>Appearance</h3>
                                        <p className='text-gray-500 text-sm font-medium'>Customise how the platform looks for you.</p>
                                    </div>

                                    <div className='space-y-4'>
                                        <div className='flex items-center justify-between p-6 bg-gray-50 dark:bg-zinc-800/30 rounded-[32px] border border-gray-100 dark:border-zinc-800 group hover:border-indigo-200 dark:hover:border-indigo-900/50 transition-all'>
                                            <div className='flex items-center gap-4'>
                                                <div className='p-3 bg-white dark:bg-zinc-800 rounded-2xl text-indigo-600 dark:text-indigo-400 shadow-sm'>
                                                    {mode === 'dark' ? <Moon size={24} /> : <Sun size={24} />}
                                                </div>
                                                <div>
                                                    <p className='font-black text-gray-900 dark:text-white uppercase text-xs tracking-widest'>Dark Mode</p>
                                                    <p className='text-[10px] text-gray-500 dark:text-zinc-500 font-bold uppercase tracking-tight mt-1'>Switch between light and dark themes</p>
                                                </div>
                                            </div>
                                            <Switch
                                                checked={mode === 'dark'}
                                                onCheckedChange={() => dispatch(toggleTheme())}
                                            />
                                        </div>

                                        <div className='flex items-center justify-between p-6 bg-gray-50 dark:bg-zinc-800/30 rounded-[32px] border border-gray-100 dark:border-zinc-800 opacity-50 cursor-not-allowed'>
                                            <div className='flex items-center gap-4'>
                                                <div className='p-3 bg-white dark:bg-zinc-800 rounded-2xl text-rose-600 dark:text-rose-400 shadow-sm'>
                                                    <Smartphone size={24} />
                                                </div>
                                                <div>
                                                    <p className='font-black text-gray-900 dark:text-white uppercase text-xs tracking-widest'>Mobile Optimisation</p>
                                                    <p className='text-[10px] text-gray-500 dark:text-zinc-500 font-bold uppercase tracking-tight mt-1'>Always on for the best experience</p>
                                                </div>
                                            </div>
                                            <Switch checked disabled />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Security Tab (Simplified) */}
                            {activeTab === 'security' && (
                                <div className='space-y-8'>
                                    <div>
                                        <h3 className='text-xl font-black text-gray-900 dark:text-white'>Security</h3>
                                        <p className='text-gray-500 text-sm font-medium'>Manage your password and account security.</p>
                                    </div>

                                    <div className='space-y-4'>
                                        <div className='p-6 bg-gray-50 dark:bg-zinc-800/30 rounded-[32px] border border-gray-100 dark:border-zinc-800'>
                                            <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
                                                <div>
                                                    <p className='font-black text-gray-900 dark:text-white uppercase text-xs tracking-widest'>Password</p>
                                                    <p className='text-[10px] text-gray-500 dark:text-zinc-500 font-bold uppercase tracking-tight mt-1'>Last changed: 3 months ago</p>
                                                </div>
                                                <Button variant="outline" className='rounded-xl font-black text-[10px] uppercase tracking-widest'>Change Password</Button>
                                            </div>
                                        </div>

                                        <div className='p-8 bg-rose-50/30 dark:bg-rose-900/10 rounded-[40px] border border-rose-100/50 dark:border-rose-900/30 mt-8'>
                                            <div className='flex items-center gap-4 mb-4 text-rose-600 dark:text-rose-400'>
                                                <Trash2 size={24} />
                                                <h4 className='font-black uppercase text-sm tracking-widest'>Danger Zone</h4>
                                            </div>
                                            <p className='text-xs text-rose-600/70 dark:text-rose-400/70 font-bold mb-6'>Once you delete your account, there is no going back. Please be certain.</p>
                                            <Button
                                                onClick={handleDeleteAccount}
                                                variant="destructive"
                                                className='bg-rose-600 hover:bg-rose-700 rounded-2xl font-black text-xs uppercase tracking-widest h-14 px-8'
                                            >
                                                Delete Account
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Notifications Tab */}
                            {activeTab === 'notifications' && (
                                <div className='space-y-8'>
                                    <div>
                                        <h3 className='text-xl font-black text-gray-900 dark:text-white'>Notifications</h3>
                                        <p className='text-gray-500 text-sm font-medium'>Control how you want to be notified about updates.</p>
                                    </div>

                                    <div className='space-y-4'>
                                        {[
                                            { title: "Email Notifications", desc: "Receive updates about your applications via email", icon: <Mail size={20} />, checked: true },
                                            { title: "Message Alerts", desc: "Get notified when a recruiter messages you", icon: <MessageSquare size={20} />, checked: true },
                                            { title: "Job Recommendations", desc: "Daily digest of jobs matching your profile", icon: <Zap size={20} />, checked: false },
                                            { title: "Platform Updates", desc: "New features and maintenance announcements", icon: <Rss size={20} />, checked: true }
                                        ].map((item, idx) => (
                                            <div key={idx} className='flex items-center justify-between p-6 bg-gray-50 dark:bg-zinc-800/30 rounded-[32px] border border-gray-100 dark:border-zinc-800 group hover:border-indigo-200 dark:hover:border-indigo-900/50 transition-all'>
                                                <div className='flex items-center gap-4'>
                                                    <div className='p-3 bg-white dark:bg-zinc-800 rounded-2xl text-indigo-600 dark:text-indigo-400 shadow-sm'>
                                                        {item.icon}
                                                    </div>
                                                    <div>
                                                        <p className='font-black text-gray-900 dark:text-white uppercase text-xs tracking-widest'>{item.title}</p>
                                                        <p className='text-[10px] text-gray-500 dark:text-zinc-500 font-bold uppercase tracking-tight mt-1'>{item.desc}</p>
                                                    </div>
                                                </div>
                                                <Switch defaultChecked={item.checked} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Privacy Tab */}
                            {activeTab === 'privacy' && (
                                <div className='space-y-8'>
                                    <div>
                                        <h3 className='text-xl font-black text-gray-900 dark:text-white'>Privacy & Visibility</h3>
                                        <p className='text-gray-500 text-sm font-medium'>Manage who can see your profile and activity.</p>
                                    </div>

                                    <div className='space-y-4'>
                                        {[
                                            { title: "Public Profile", desc: "Allow recruiters to find your profile in searches", icon: <Eye size={20} />, checked: true },
                                            { title: "Show Activity", desc: "Show when you are browsing or active", icon: <Zap size={20} />, checked: false },
                                            { title: "Search Engine Indexing", desc: "Allow Google and other engines to link to your profile", icon: <Globe size={20} />, checked: false },
                                            { title: "Two-Step Verification", desc: "Add an extra layer of security to your account", icon: <Shield size={20} />, checked: true }
                                        ].map((item, idx) => (
                                            <div key={idx} className='flex items-center justify-between p-6 bg-gray-50 dark:bg-zinc-800/30 rounded-[32px] border border-gray-100 dark:border-zinc-800 group hover:border-indigo-200 dark:hover:border-indigo-900/50 transition-all'>
                                                <div className='flex items-center gap-4'>
                                                    <div className='p-3 bg-white dark:bg-zinc-800 rounded-2xl text-indigo-600 dark:text-indigo-400 shadow-sm'>
                                                        {item.icon}
                                                    </div>
                                                    <div>
                                                        <p className='font-black text-gray-900 dark:text-white uppercase text-xs tracking-widest'>{item.title}</p>
                                                        <p className='text-[10px] text-gray-500 dark:text-zinc-500 font-bold uppercase tracking-tight mt-1'>{item.desc}</p>
                                                    </div>
                                                </div>
                                                <Switch defaultChecked={item.checked} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
