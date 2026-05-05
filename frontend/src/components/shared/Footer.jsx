import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin, Heart } from 'lucide-react'

const Footer = () => {
    const { user } = useSelector(store => store.auth);

    return (
        <footer className="bg-white dark:bg-zinc-950 border-t border-slate-200/50 dark:border-zinc-800/50 pt-20 pb-10 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-600 dark:bg-indigo-500 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/20">
                                C
                            </div>
                            <h2 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white uppercase">
                                Career<span className="text-indigo-600 dark:text-indigo-400">Compass</span>
                            </h2>
                        </div>
                        <p className="text-gray-500 dark:text-zinc-400 text-sm leading-relaxed max-w-sm font-medium">
                            The premier digital matrix for career acceleration. We bridge the gap between high-potential talent and elite industry opportunities globally.
                        </p>
                        <div className="flex gap-4 pt-2">
                            {[Facebook, Twitter, Linkedin, Instagram].map((Icon, idx) => (
                                <div key={idx} className='p-2 bg-gray-50 dark:bg-zinc-900 rounded-lg text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all cursor-pointer border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900/50 hover:shadow-md'>
                                    <Icon size={18} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links Column */}
                    <div>
                        <h3 className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-8">Navigation Matrix</h3>
                        <ul className="flex flex-col gap-4">
                            {
                                user && user.role === 'recruiter' ? (
                                    <>
                                        <li><Link to="/" className="text-gray-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm font-bold transition-colors">Home Base</Link></li>
                                        <li><Link to="/admin/companies" className="text-gray-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm font-bold transition-colors">Organizations</Link></li>
                                        <li><Link to="/admin/posts" className="text-gray-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm font-bold transition-colors">Active Posts</Link></li>
                                        <li><Link to="/admin/create" className="text-gray-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm font-bold transition-colors">New Transmission</Link></li>
                                    </>
                                ) : (
                                    <>
                                        <li><Link to="/" className="text-gray-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm font-bold transition-colors">Home Base</Link></li>
                                        <li><Link to="/events" className="text-gray-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm font-bold transition-colors">Explore Matrix</Link></li>
                                        <li><Link to="/resume/builder" className="text-gray-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm font-bold transition-colors">Identity Builder</Link></li>
                                        <li><Link to="/resume/ats" className="text-gray-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm font-bold transition-colors">Verification Scan</Link></li>
                                    </>
                                )
                            }
                        </ul>
                    </div>

                    {/* Contact Column */}
                    <div>
                        <h3 className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-8">Communication Hub</h3>
                        <ul className="flex flex-col gap-5">
                            <li className="flex items-start gap-4 group">
                                <div className='p-2.5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl text-indigo-600 dark:text-indigo-400'>
                                    <MapPin size={16} />
                                </div>
                                <span className="text-gray-600 dark:text-zinc-400 text-sm font-bold pt-1">IT Park Patna, Bihar 800001</span>
                            </li>
                            <li className="flex items-center gap-4 group">
                                <div className='p-2.5 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600 dark:text-blue-400'>
                                    <Mail size={16} />
                                </div>
                                <span className="text-gray-600 dark:text-zinc-400 text-sm font-bold">support@careercompass.com</span>
                            </li>
                            <li className="flex items-center gap-4 group">
                                <div className='p-2.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-emerald-600 dark:text-emerald-400'>
                                    <Phone size={16} />
                                </div>
                                <span className="text-gray-600 dark:text-zinc-400 text-sm font-bold">+91 77658 16901</span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter Column */}
                    <div className="lg:col-span-1">
                        <h3 className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-8">Newsletter</h3>
                        <p className='text-xs text-gray-500 dark:text-zinc-400 font-bold mb-4'>Secure your weekly synchronization with elite roles.</p>
                        <div className='flex gap-2 w-full'>
                            <input
                                type="email"
                                placeholder="matrix@email.com"
                                className='bg-gray-50 dark:bg-zinc-900 border border-transparent focus:border-indigo-500/50 rounded-xl px-4 py-2.5 text-xs font-bold text-gray-900 dark:text-white flex-1 transition-all outline-none'
                            />
                            <button className='bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-2.5 rounded-xl hover:bg-indigo-700 transition-all font-black text-[10px] uppercase shrink-0'>Join</button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-200/50 dark:border-zinc-800/50 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-gray-400 dark:text-zinc-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        © 2026 Protocol CareerCompass. Compiled with <Heart size={14} className='text-rose-500 fill-rose-500 animate-pulse' /> in Bharat.
                    </p>
                    <div className="flex gap-8">
                        {['Privacy', 'Terms', 'Security'].map((item) => (
                            <span key={item} className="text-gray-400 dark:text-zinc-500 text-[10px] font-black uppercase tracking-widest hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors">
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
