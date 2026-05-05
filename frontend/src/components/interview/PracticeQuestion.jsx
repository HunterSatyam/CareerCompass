import React, { useState, useEffect } from 'react';
import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, CheckCircle2, Clock, Trophy, MessageCircle, Send, Lightbulb, Sparkles, AlertCircle, Code2, ListTodo, FileText } from 'lucide-react';
import { Button } from '../ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import axios from 'axios';
import { INTERVIEW_API_END_POINT } from '@/utils/constant';

const PracticeQuestion = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [userAnswer, setUserAnswer] = useState('');
    const [selectedOption, setSelectedOption] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const res = await axios.get(`${INTERVIEW_API_END_POINT}/question/get/${id}`, { withCredentials: true });
                if (res.data.success) {
                    setQuestions(res.data.questions);
                }
            } catch (error) {
                console.log(error);
                toast.error("Failed to load questions");
            } finally {
                setLoading(false);
            }
        }
        fetchQuestions();
    }, [id]);

    const currentQuestion = questions[currentQuestionIdx];

    const handleSubmit = () => {
        if (currentQuestion.questionType === 'Objective') {
            if (selectedOption === null) {
                toast.error("Please select an option");
                return;
            }
        } else {
            if (!userAnswer.trim()) {
                toast.error("Please provide an answer");
                return;
            }
        }
        setIsSubmitted(true);
        setShowAnswer(true);
        toast.success("Answer submitted!");
    };

    const nextQuestion = () => {
        if (currentQuestionIdx < questions.length - 1) {
            setCurrentQuestionIdx(prev => prev + 1);
            setShowAnswer(false);
            setUserAnswer('');
            setSelectedOption(null);
            setIsSubmitted(false);
        } else {
            toast.success("Practice session completed!");
            navigate('/interview/mock');
        }
    };

    if (loading) {
        return (
            <div className='min-h-screen flex items-center justify-center dark:bg-zinc-950'>
                <div className='w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin'></div>
            </div>
        );
    }

    if (!currentQuestion) {
        return (
            <div className='min-h-screen flex flex-col items-center justify-center dark:bg-zinc-950'>
                <AlertCircle size={48} className='text-rose-500 mb-4' />
                <h1 className='text-2xl font-bold dark:text-white'>No questions found for this company</h1>
                <Button onClick={() => navigate('/interview/mock')} className='mt-4 rounded-xl'>Go Back</Button>
            </div>
        );
    }

    const renderQuestionInput = () => {
        switch (currentQuestion.questionType) {
            case 'Objective':
                return (
                    <div className='grid grid-cols-1 gap-4'>
                        {currentQuestion.options.map((option, idx) => (
                            <button
                                key={idx}
                                onClick={() => !isSubmitted && setSelectedOption(idx)}
                                className={`w-full p-6 rounded-2xl border-2 text-left transition-all flex items-center justify-between group ${
                                    selectedOption === idx 
                                        ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20' 
                                        : 'border-gray-100 dark:border-zinc-800 hover:border-purple-200 dark:hover:border-zinc-700'
                                } ${isSubmitted && idx === currentQuestion.correctOption ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : ''}
                                  ${isSubmitted && selectedOption === idx && idx !== currentQuestion.correctOption ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/20' : ''}`}
                            >
                                <span className={`font-bold ${selectedOption === idx ? 'text-purple-600 dark:text-purple-400' : 'text-gray-600 dark:text-gray-400'}`}>
                                    {option}
                                </span>
                                {isSubmitted && idx === currentQuestion.correctOption && <CheckCircle2 className='text-emerald-500' size={20} />}
                            </button>
                        ))}
                    </div>
                );
            case 'Coding':
                return (
                    <div className='space-y-4'>
                        <div className='flex items-center justify-between px-4 py-2 bg-zinc-800 rounded-t-2xl border-b border-zinc-700'>
                            <span className='text-[10px] font-black text-zinc-400 uppercase tracking-widest'>solution.js</span>
                            <div className='flex gap-1.5'>
                                <div className='w-2.5 h-2.5 rounded-full bg-rose-500'></div>
                                <div className='w-2.5 h-2.5 rounded-full bg-amber-500'></div>
                                <div className='w-2.5 h-2.5 rounded-full bg-emerald-500'></div>
                            </div>
                        </div>
                        <textarea 
                            className='w-full h-80 bg-zinc-900 border-none rounded-b-2xl p-6 text-emerald-400 font-mono placeholder:text-zinc-700 focus:ring-0 transition-all resize-none'
                            placeholder='// Write your code here...'
                            value={userAnswer || currentQuestion.codeSnippet}
                            onChange={(e) => userAnswer === '' ? setUserAnswer(e.target.value) : setUserAnswer(e.target.value)}
                            disabled={isSubmitted}
                        />
                    </div>
                );
            default: // Subjective
                return (
                    <textarea 
                        className='w-full h-48 bg-gray-50 dark:bg-zinc-800/50 border-none rounded-2xl p-6 text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500 transition-all resize-none'
                        placeholder='Type your detailed answer here...'
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        disabled={isSubmitted}
                    />
                );
        }
    };

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-zinc-950 transition-colors duration-300'>
            <Navbar />

            <main className='max-w-5xl mx-auto px-6 py-12'>
                <div className='flex items-center justify-between mb-12'>
                    <button 
                        onClick={() => navigate('/interview/mock')}
                        className='flex items-center gap-2 text-gray-500 hover:text-purple-600 transition-colors font-bold uppercase text-xs tracking-widest'
                    >
                        <ChevronLeft size={16} />
                        Back to companies
                    </button>
                    
                    <div className='flex items-center gap-2'>
                        <div className='h-2 w-32 bg-gray-200 dark:bg-zinc-800 rounded-full overflow-hidden'>
                            <div 
                                className='h-full bg-purple-600 transition-all duration-500' 
                                style={{ width: `${((currentQuestionIdx + 1) / questions.length) * 100}%` }}
                            ></div>
                        </div>
                        <span className='text-xs font-bold text-gray-500'>{currentQuestionIdx + 1}/{questions.length}</span>
                    </div>
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                    <div className='lg:col-span-2 space-y-6'>
                        <motion.div 
                            key={currentQuestion._id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className='bg-white dark:bg-zinc-900 rounded-[32px] p-8 shadow-sm border border-gray-100 dark:border-zinc-800'
                        >
                            <div className='flex gap-3 mb-6'>
                                <span className='px-3 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-purple-100 dark:border-purple-900/30 flex items-center gap-2'>
                                    {currentQuestion.questionType === 'Objective' ? <ListTodo size={12}/> : 
                                     currentQuestion.questionType === 'Coding' ? <Code2 size={12}/> : <FileText size={12}/>}
                                    {currentQuestion.questionType}
                                </span>
                                <span className='px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-100 dark:border-blue-900/30'>
                                    {currentQuestion.difficulty}
                                </span>
                            </div>

                            <h2 className='text-2xl font-black text-gray-900 dark:text-white mb-6 leading-tight'>
                                {currentQuestion.title}
                            </h2>

                            <p className='text-gray-600 dark:text-gray-400 mb-8 leading-relaxed'>
                                {currentQuestion.description}
                            </p>

                            <div className='space-y-6'>
                                {renderQuestionInput()}
                                
                                <div className='flex justify-end'>
                                    {!isSubmitted ? (
                                        <Button 
                                            onClick={handleSubmit}
                                            className='bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-purple-500/20'
                                        >
                                            <Send size={18} />
                                            Submit Answer
                                        </Button>
                                    ) : (
                                        <Button 
                                            onClick={nextQuestion}
                                            className='bg-zinc-900 dark:bg-zinc-800 hover:bg-zinc-800 dark:hover:bg-zinc-700 text-white px-8 py-6 rounded-2xl font-bold flex items-center gap-2'
                                        >
                                            {currentQuestionIdx === questions.length - 1 ? 'Finish Session' : 'Next Question'}
                                            <Trophy size={18} />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </motion.div>

                        <AnimatePresence>
                            {showAnswer && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className='bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/20 rounded-[32px] p-8'
                                >
                                    <div className='flex items-center gap-3 mb-4'>
                                        <div className='p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl text-emerald-600'>
                                            <Sparkles size={20} />
                                        </div>
                                        <h3 className='font-black text-emerald-900 dark:text-emerald-400 uppercase tracking-widest text-sm'>
                                            {currentQuestion.questionType === 'Coding' ? 'Optimized Solution' : 'Correct Answer'}
                                        </h3>
                                    </div>
                                    <div className='text-emerald-800/80 dark:text-emerald-400/80 leading-relaxed mb-6 font-mono whitespace-pre-wrap text-sm'>
                                        {currentQuestion.questionType === 'Coding' ? currentQuestion.solutionCode : 
                                         currentQuestion.questionType === 'Objective' ? `Option ${currentQuestion.correctOption + 1}: ${currentQuestion.options[currentQuestion.correctOption]}` :
                                         currentQuestion.sampleAnswer}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className='space-y-6'>
                        <div className='bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/20 rounded-[32px] p-8'>
                            <div className='flex items-center gap-3 mb-6'>
                                <div className='p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl text-indigo-600'>
                                    <Lightbulb size={20} />
                                </div>
                                <h3 className='font-black text-indigo-900 dark:text-indigo-400 uppercase tracking-widest text-sm'>Expert Tips</h3>
                            </div>
                            <p className='text-indigo-800/80 dark:text-indigo-400/80 text-sm leading-relaxed'>
                                {currentQuestion.tips || "Stay calm and structured. Think out loud if this were a live interview."}
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default PracticeQuestion;
