import React, { useState } from 'react';
import Navbar from '../../shared/Navbar';
import Footer from '../../shared/Footer';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, Send, HelpCircle, Code2, FileText, ListTodo, Trash2, Sparkles } from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import axios from 'axios';
import { INTERVIEW_API_END_POINT } from '@/utils/constant';

const AddInterviewQuestion = () => {
    const { companyId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        questionType: 'Subjective',
        category: 'Technical',
        difficulty: 'Medium',
        frequency: 'Medium',
        tips: '',
        sampleAnswer: '', // Subjective
        options: ['', '', '', ''], // Objective
        correctOption: 0, // Objective
        codeSnippet: '', // Coding
        solutionCode: '' // Coding
    });

    const handleOptionChange = (index, value) => {
        const newOptions = [...formData.options];
        newOptions[index] = value;
        setFormData({ ...formData, options: newOptions });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post(`${INTERVIEW_API_END_POINT}/question/create`, {
                ...formData,
                companyId
            }, { withCredentials: true });
            
            if (res.data.success) {
                toast.success(res.data.message);
                navigate('/admin/interview/hub');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add question");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-zinc-950 transition-colors duration-300'>
            <Navbar />
            <main className='max-w-4xl mx-auto px-6 py-12'>
                <button 
                    onClick={() => navigate(-1)}
                    className='flex items-center gap-2 text-gray-400 hover:text-purple-600 transition-colors font-bold uppercase text-[10px] tracking-widest mb-8'
                >
                    <ChevronLeft size={16} />
                    Back
                </button>

                <div className='mb-12'>
                    <h1 className='text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight'>Add New Question</h1>
                    <p className='text-gray-500 dark:text-gray-400 text-sm mt-1'>Create objective, subjective, or coding questions for this company.</p>
                </div>

                <form onSubmit={handleSubmit} className='space-y-8'>
                    <div className='bg-white dark:bg-zinc-900 rounded-[32px] p-8 border border-gray-100 dark:border-zinc-800 shadow-sm space-y-6'>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            <div className='space-y-4'>
                                <div>
                                    <label className='text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block'>Question Type</label>
                                    <div className='flex gap-2'>
                                        {[
                                            { id: 'Objective', icon: <ListTodo size={14}/> },
                                            { id: 'Subjective', icon: <FileText size={14}/> }
                                        ].map(type => (
                                            <button
                                                key={type.id}
                                                type='button'
                                                onClick={() => setFormData({...formData, questionType: type.id})}
                                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all font-bold text-xs ${
                                                    formData.questionType === type.id 
                                                        ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' 
                                                        : 'border-gray-50 dark:border-zinc-800 text-gray-400'
                                                }`}
                                            >
                                                {type.icon}
                                                {type.id}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className='text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block'>Category</label>
                                    <Input 
                                        placeholder='e.g. System Design'
                                        value={formData.category}
                                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                                        className='rounded-xl border-gray-100 dark:border-zinc-800'
                                    />
                                </div>
                            </div>
                            <div className='space-y-4'>
                                <div>
                                    <label className='text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block'>Difficulty</label>
                                    <select 
                                        className='w-full h-10 px-3 rounded-xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm'
                                        value={formData.difficulty}
                                        onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                                    >
                                        <option>Easy</option>
                                        <option>Medium</option>
                                        <option>Hard</option>
                                    </select>
                                </div>
                                <div>
                                    <label className='text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block'>Frequency</label>
                                    <select 
                                        className='w-full h-10 px-3 rounded-xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm'
                                        value={formData.frequency}
                                        onChange={(e) => setFormData({...formData, frequency: e.target.value})}
                                    >
                                        <option>Low</option>
                                        <option>Medium</option>
                                        <option>High</option>
                                        <option>Critical</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className='text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block'>Question Title</label>
                            <Input 
                                placeholder='e.g. Reverse a Linked List'
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                className='rounded-xl border-gray-100 dark:border-zinc-800 font-bold'
                            />
                        </div>

                        <div>
                            <label className='text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block'>Description / Problem Statement</label>
                            <textarea 
                                className='w-full h-32 bg-gray-50 dark:bg-zinc-800/50 border-none rounded-2xl p-4 text-sm'
                                placeholder='Explain the question in detail...'
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className='bg-white dark:bg-zinc-900 rounded-[32px] p-8 border border-gray-100 dark:border-zinc-800 shadow-sm'>
                        {formData.questionType === 'Objective' && (
                            <div className='space-y-6'>
                                <h3 className='text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest flex items-center gap-2'>
                                    <ListTodo size={16} className='text-purple-600'/> Options Configuration
                                </h3>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                    {formData.options.map((option, idx) => (
                                        <div key={idx} className='space-y-2'>
                                            <div className='flex items-center justify-between px-1'>
                                                <label className='text-[10px] font-black text-gray-400 uppercase tracking-widest'>Option {idx + 1}</label>
                                                <input 
                                                    type='radio' 
                                                    name='correct' 
                                                    checked={formData.correctOption === idx}
                                                    onChange={() => setFormData({...formData, correctOption: idx})}
                                                    className='accent-purple-600'
                                                />
                                            </div>
                                            <Input 
                                                value={option}
                                                onChange={(e) => handleOptionChange(idx, e.target.value)}
                                                className='rounded-xl border-gray-100 dark:border-zinc-800'
                                                placeholder={`Option ${idx + 1}`}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {formData.questionType === 'Subjective' && (
                            <div className='space-y-4'>
                                <h3 className='text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest flex items-center gap-2'>
                                    <FileText size={16} className='text-purple-600'/> Sample Answer
                                </h3>
                                <textarea 
                                    className='w-full h-48 bg-emerald-50/30 dark:bg-emerald-900/10 border border-emerald-100/50 dark:border-emerald-900/20 rounded-2xl p-6 text-sm font-medium'
                                    placeholder='Provide the ideal answer for applicants...'
                                    value={formData.sampleAnswer}
                                    onChange={(e) => setFormData({...formData, sampleAnswer: e.target.value})}
                                />
                            </div>
                        )}

                        {formData.questionType === 'Coding' && (
                            <div className='space-y-6'>
                                <div>
                                    <h3 className='text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest mb-4 flex items-center gap-2'>
                                        <Code2 size={16} className='text-purple-600'/> Starter Code
                                    </h3>
                                    <textarea 
                                        className='w-full h-48 bg-zinc-900 text-emerald-400 font-mono rounded-2xl p-6 text-xs'
                                        placeholder='function solution() {\n  // your code\n}'
                                        value={formData.codeSnippet}
                                        onChange={(e) => setFormData({...formData, codeSnippet: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <h3 className='text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest mb-4 flex items-center gap-2'>
                                        <Sparkles size={16} className='text-emerald-500'/> Solution Code
                                    </h3>
                                    <textarea 
                                        className='w-full h-48 bg-zinc-900 text-amber-400 font-mono rounded-2xl p-6 text-xs'
                                        placeholder='Optimized solution...'
                                        value={formData.solutionCode}
                                        onChange={(e) => setFormData({...formData, solutionCode: e.target.value})}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className='bg-white dark:bg-zinc-900 rounded-[32px] p-8 border border-gray-100 dark:border-zinc-800 shadow-sm'>
                        <h3 className='text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest mb-4 flex items-center gap-2'>
                            <HelpCircle size={16} className='text-blue-500'/> Expert Tips
                        </h3>
                        <textarea 
                            className='w-full h-24 bg-blue-50/30 dark:bg-blue-900/10 border border-blue-100/50 dark:border-blue-900/20 rounded-2xl p-4 text-sm'
                            placeholder='Any tips for the applicant?'
                            value={formData.tips}
                            onChange={(e) => setFormData({...formData, tips: e.target.value})}
                        />
                    </div>

                    <div className='flex justify-end gap-4'>
                        <Button 
                            type='button' 
                            variant='ghost' 
                            onClick={() => navigate(-1)}
                            className='px-10 py-6 rounded-2xl font-bold'
                        >
                            Cancel
                        </Button>
                        <Button 
                            type='submit'
                            disabled={loading}
                            className='bg-purple-600 hover:bg-purple-700 text-white px-12 py-6 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-purple-500/20'
                        >
                            {loading ? <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div> : <Send size={18} />}
                            Publish Question
                        </Button>
                    </div>
                </form>
            </main>
            <Footer />
        </div>
    );
};

export default AddInterviewQuestion;
