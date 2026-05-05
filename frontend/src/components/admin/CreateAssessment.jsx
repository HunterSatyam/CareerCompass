import React, { useState, useEffect } from 'react';
import Navbar from '../shared/Navbar';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ASSESSMENT_API_END_POINT } from '@/utils/constant';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { PlusCircle, Trash2, Save, FileText, CheckSquare } from 'lucide-react';

const CreateAssessment = () => {
    const { id } = useParams(); // This is the jobId
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [duration, setDuration] = useState(30);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        const fetchAssessment = async () => {
            try {
                const res = await axios.get(`${ASSESSMENT_API_END_POINT}/${id}`, { withCredentials: true });
                if (res.data.success && res.data.assessment) {
                    setQuestions(res.data.assessment.questions);
                    if (res.data.assessment.duration) {
                        setDuration(res.data.assessment.duration);
                    }
                }
            } catch (error) {
                // If 404, it means no assessment exists yet, which is fine
                if (error.response && error.response.status !== 404) {
                    toast.error("Failed to fetch existing assessment");
                }
            } finally {
                setFetching(false);
            }
        };
        fetchAssessment();
    }, [id]);

    const addQuestion = (type) => {
        setQuestions([...questions, {
            questionText: '',
            questionType: type,
            options: type === 'objective' ? ['', '', '', ''] : [],
            correctOption: ''
        }]);
    };

    const removeQuestion = (index) => {
        const newQuestions = [...questions];
        newQuestions.splice(index, 1);
        setQuestions(newQuestions);
    };

    const handleQuestionChange = (index, field, value) => {
        const newQuestions = [...questions];
        newQuestions[index][field] = value;
        setQuestions(newQuestions);
    };

    const handleOptionChange = (qIndex, oIndex, value) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options[oIndex] = value;
        setQuestions(newQuestions);
    };

    const handleSubmit = async () => {
        // Validate
        for (let i = 0; i < questions.length; i++) {
            const q = questions[i];
            if (!q.questionText.trim()) {
                toast.error(`Question ${i + 1} text is required`);
                return;
            }
            if (q.questionType === 'objective') {
                for (let j = 0; j < q.options.length; j++) {
                    if (!q.options[j].trim()) {
                        toast.error(`Question ${i + 1} option ${j + 1} is required`);
                        return;
                    }
                }
                if (!q.correctOption.trim()) {
                    toast.error(`Question ${i + 1} correct option is required`);
                    return;
                }
            }
        }

        setLoading(true);
        try {
            const res = await axios.post(`${ASSESSMENT_API_END_POINT}`, {
                jobId: id,
                duration: Number(duration) || 30,
                questions
            }, { withCredentials: true });

            if (res.data.success) {
                toast.success(res.data.message);
                navigate('/admin/posts');
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to save assessment");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 transition-colors duration-300 pb-20">
            <Navbar />
            <div className="max-w-4xl mx-auto mt-10 p-6 bg-white dark:bg-zinc-800 rounded-3xl shadow-xl">
                <div className="mb-8 border-b dark:border-zinc-700 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Assessment Builder</h1>
                        <p className="text-gray-500 dark:text-zinc-400 mt-2">Create objective or subjective questions for this job application.</p>
                    </div>
                    <div className="bg-white dark:bg-zinc-800 p-3 rounded-2xl border border-gray-200 dark:border-zinc-700 flex items-center gap-3 w-max">
                        <label className="text-sm font-bold text-gray-700 dark:text-zinc-300">Duration (Minutes):</label>
                        <input 
                            type="number" 
                            min="1"
                            value={duration} 
                            onChange={(e) => setDuration(e.target.value)} 
                            className="w-20 p-2 rounded-xl bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-purple-500 font-bold"
                        />
                    </div>
                </div>

                <div className="space-y-8">
                    {questions.map((q, qIndex) => (
                        <div key={qIndex} className="p-6 bg-gray-50 dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-700 relative">
                            <button 
                                onClick={() => removeQuestion(qIndex)}
                                className="absolute top-4 right-4 text-red-500 hover:text-red-700 p-2 bg-red-50 dark:bg-red-900/20 rounded-xl"
                            >
                                <Trash2 size={20} />
                            </button>

                            <div className="flex items-center gap-3 mb-4">
                                <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-3 py-1 rounded-full text-xs font-black uppercase">
                                    Question {qIndex + 1}
                                </span>
                                <span className="text-sm font-bold text-gray-500 dark:text-zinc-400 capitalize">
                                    {q.questionType} Type
                                </span>
                            </div>

                            <input
                                type="text"
                                placeholder="Enter your question here..."
                                value={q.questionText}
                                onChange={(e) => handleQuestionChange(qIndex, 'questionText', e.target.value)}
                                className="w-full p-4 mb-4 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                            />

                            {q.questionType === 'objective' && (
                                <div className="pl-4 space-y-3 border-l-2 border-purple-200 dark:border-purple-800">
                                    {q.options.map((opt, oIndex) => (
                                        <div key={oIndex} className="flex items-center gap-3">
                                            <span className="text-sm font-bold text-gray-500 dark:text-zinc-400 w-6">
                                                {String.fromCharCode(65 + oIndex)}.
                                            </span>
                                            <input
                                                type="text"
                                                placeholder={`Option ${oIndex + 1}`}
                                                value={opt}
                                                onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                                className="flex-1 p-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm"
                                            />
                                        </div>
                                    ))}
                                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-zinc-700">
                                        <label className="text-sm font-bold text-gray-700 dark:text-zinc-300 mr-4">Correct Option:</label>
                                        <select
                                            value={q.correctOption}
                                            onChange={(e) => handleQuestionChange(qIndex, 'correctOption', e.target.value)}
                                            className="p-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800"
                                        >
                                            <option value="">Select Correct Option</option>
                                            {q.options.map((opt, idx) => (
                                                <option key={idx} value={opt}>Option {String.fromCharCode(65 + idx)}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {questions.length === 0 && (
                    <div className="text-center py-12 text-gray-500 dark:text-zinc-400">
                        No questions added yet. Start by adding an objective or subjective question.
                    </div>
                )}

                <div className="mt-8 flex flex-wrap gap-4 items-center justify-between border-t dark:border-zinc-700 pt-6">
                    <div className="flex gap-4">
                        <Button 
                            variant="outline" 
                            onClick={() => addQuestion('objective')}
                            className="flex items-center gap-2 rounded-xl"
                        >
                            <CheckSquare size={18} /> Add Objective Q.
                        </Button>
                        <Button 
                            variant="outline" 
                            onClick={() => addQuestion('subjective')}
                            className="flex items-center gap-2 rounded-xl"
                        >
                            <FileText size={18} /> Add Subjective Q.
                        </Button>
                    </div>

                    <Button 
                        onClick={handleSubmit} 
                        disabled={loading || questions.length === 0}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 rounded-xl font-bold flex items-center gap-2"
                    >
                        <Save size={20} />
                        {loading ? 'Saving...' : 'Save Assessment'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CreateAssessment;
