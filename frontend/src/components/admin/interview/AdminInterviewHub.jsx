import React, { useState, useEffect } from 'react';
import Navbar from '../../shared/Navbar';
import Footer from '../../shared/Footer';
import { Plus, Search, Building2, Trash2, Edit3, ArrowRight, Star, ExternalLink } from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { INTERVIEW_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';

const AdminInterviewHub = ({ embedded = false, basePath = '/admin/interview' }) => {
    const [companies, setCompanies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        logo: '',
        category: '',
        difficulty: 'Medium',
        rating: 4.5
    });

    const navigate = useNavigate();

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            const res = await axios.get(`${INTERVIEW_API_END_POINT}/company/get`, { withCredentials: true });
            if (res.data.success) {
                setCompanies(res.data.companies);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCompany = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${INTERVIEW_API_END_POINT}/company/create`, formData, { withCredentials: true });
            if (res.data.success) {
                toast.success(res.data.message);
                setIsModalOpen(false);
                fetchCompanies();
                setFormData({ name: '', logo: '', category: '', difficulty: 'Medium', rating: 4.5 });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create company");
        }
    };

    const filteredCompanies = companies.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className={embedded ? 'bg-transparent' : 'min-h-screen bg-gray-50 dark:bg-zinc-950 transition-colors duration-300'}>
            {!embedded && <Navbar />}
            <main className={embedded ? 'max-w-7xl mx-auto' : 'max-w-7xl mx-auto px-6 py-12'}>
                <div className='flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6'>
                    <div>
                        <h1 className='text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight'>Interview Companies</h1>
                        <p className='text-gray-500 dark:text-gray-400 text-sm mt-1'>Manage companies and their interview question sets.</p>
                    </div>
                    <div className='flex items-center gap-4'>
                        <div className='relative'>
                            <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4' />
                            <Input 
                                placeholder='Search companies...' 
                                className='pl-10 w-64 rounded-xl border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button 
                            onClick={() => navigate(`${basePath}/questions`)}
                            variant='outline'
                            className='rounded-xl px-6 flex items-center gap-2 font-bold'
                        >
                            <Search size={18} />
                            Question Bank
                        </Button>
                        <Button 
                            onClick={() => setIsModalOpen(true)}
                            className='bg-purple-600 hover:bg-purple-700 text-white rounded-xl px-6 flex items-center gap-2 font-bold'
                        >
                            <Plus size={18} />
                            Add Company
                        </Button>
                    </div>
                </div>

                {loading ? (
                    <div className='flex justify-center py-20'>
                        <div className='w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin'></div>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {filteredCompanies.map((company) => (
                            <div 
                                key={company._id}
                                className='bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all group'
                            >
                                <div className='flex items-start justify-between mb-6'>
                                    <div className='w-14 h-14 bg-gray-50 dark:bg-zinc-800 rounded-2xl flex items-center justify-center p-3'>
                                        {company.logo ? <img src={company.logo} alt={company.name} className='w-full h-full object-contain' /> : <Building2 className='text-gray-400' />}
                                    </div>
                                    <div className='flex gap-2'>
                                        <Button variant='ghost' size='icon' className='h-8 w-8 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800'><Edit3 size={16} /></Button>
                                        <Button variant='ghost' size='icon' className='h-8 w-8 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 text-rose-500'><Trash2 size={16} /></Button>
                                    </div>
                                </div>
                                <h3 className='text-xl font-black text-gray-900 dark:text-white mb-1'>{company.name}</h3>
                                <p className='text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest mb-4'>{company.category}</p>
                                
                                <div className='flex items-center gap-4 mb-6'>
                                    <div className='flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-lg text-amber-600 dark:text-amber-400 font-bold text-[10px]'>
                                        <Star size={10} className='fill-current' /> {company.rating}
                                    </div>
                                    <div className='text-[10px] font-black text-gray-400 uppercase tracking-widest'>
                                        {company.questionsCount} Questions
                                    </div>
                                </div>

                                <Button 
                                    onClick={() => navigate(`${basePath}/add-question/${company._id}`)}
                                    variant='outline'
                                    className='w-full border-gray-200 dark:border-zinc-800 rounded-2xl py-6 hover:bg-gray-50 dark:hover:bg-zinc-800 flex items-center justify-center gap-2 font-bold group/btn'
                                >
                                    Manage Questions
                                    <ArrowRight size={16} className='group-hover/btn:translate-x-1 transition-transform' />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}

                {isModalOpen && (
                    <div className='fixed inset-0 z-50 flex items-center justify-center px-4'>
                        <button 
                            type='button'
                            aria-label='Close company modal'
                            onClick={() => setIsModalOpen(false)}
                            className='absolute inset-0 bg-black/60 backdrop-blur-sm'
                        />
                        <div className='bg-white dark:bg-zinc-900 w-full max-w-lg rounded-[32px] p-8 relative z-10 shadow-2xl border border-gray-100 dark:border-zinc-800'>
                                <h2 className='text-2xl font-black text-gray-900 dark:text-white mb-6 uppercase tracking-tight'>New Company</h2>
                                <form onSubmit={handleCreateCompany} className='space-y-4'>
                                    <div>
                                        <label className='text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block'>Company Name</label>
                                        <Input 
                                            placeholder='e.g. Google'
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            className='rounded-xl border-gray-200 dark:border-zinc-800'
                                        />
                                    </div>
                                    <div>
                                        <label className='text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block'>Logo URL</label>
                                        <Input 
                                            placeholder='https://...'
                                            value={formData.logo}
                                            onChange={(e) => setFormData({...formData, logo: e.target.value})}
                                            className='rounded-xl border-gray-200 dark:border-zinc-800'
                                        />
                                    </div>
                                    <div>
                                        <label className='text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block'>Category</label>
                                        <Input 
                                            placeholder='e.g. Product Based'
                                            value={formData.category}
                                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                                            className='rounded-xl border-gray-200 dark:border-zinc-800'
                                        />
                                    </div>
                                    <div className='grid grid-cols-2 gap-4'>
                                        <div>
                                            <label className='text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block'>Difficulty</label>
                                            <select 
                                                className='w-full h-10 px-3 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm'
                                                value={formData.difficulty}
                                                onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                                            >
                                                <option>Easy</option>
                                                <option>Medium</option>
                                                <option>Hard</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className='text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block'>Rating</label>
                                            <Input 
                                                type='number'
                                                step='0.1'
                                                max='5'
                                                value={formData.rating}
                                                onChange={(e) => setFormData({...formData, rating: parseFloat(e.target.value)})}
                                                className='rounded-xl border-gray-200 dark:border-zinc-800'
                                            />
                                        </div>
                                    </div>
                                    <div className='flex gap-3 pt-4'>
                                        <Button 
                                            type='button' 
                                            variant='ghost' 
                                            onClick={() => setIsModalOpen(false)}
                                            className='flex-1 rounded-xl font-bold'
                                        >
                                            Cancel
                                        </Button>
                                        <Button 
                                            type='submit'
                                            className='flex-1 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold'
                                        >
                                            Create Company
                                        </Button>
                                    </div>
                                </form>
                        </div>
                    </div>
                )}
            </main>
            {!embedded && <Footer />}
        </div>
    );
};

export default AdminInterviewHub;
