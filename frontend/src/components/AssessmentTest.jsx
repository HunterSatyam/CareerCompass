import React, { useState, useEffect, useRef } from 'react';
import Navbar from './shared/Navbar';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ASSESSMENT_API_END_POINT } from '@/utils/constant';
import { Button } from './ui/button';
import { CheckCircle2, Timer, AlertTriangle, XCircle, Camera } from 'lucide-react';
import { toast } from 'sonner';

const AssessmentTest = () => {
    const { id } = useParams(); // applicationId
    const navigate = useNavigate();
    const [submitted, setSubmitted] = useState(false);
    const [canceled, setCanceled] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState(null);
    const [duration, setDuration] = useState(0);

    // Proctoring states
    const [tabSwitches, setTabSwitches] = useState(0);
    const [mediaAccess, setMediaAccess] = useState(false);
    const videoRef = useRef(null);
    const streamRef = useRef(null);

    // Fetch assessment details
    useEffect(() => {
        const fetchAssessment = async () => {
            try {
                const res = await axios.get(`${ASSESSMENT_API_END_POINT}/application/${id}`, { withCredentials: true });
                if (res.data.success && res.data.assessment) {
                    setQuestions(res.data.assessment.questions);
                    // Initialize answers object
                    const initialAnswers = {};
                    res.data.assessment.questions.forEach((q, idx) => {
                        initialAnswers[idx] = '';
                    });
                    setAnswers(initialAnswers);
                    
                    const testDuration = res.data.assessment.duration || 30;
                    setDuration(testDuration);
                    setTimeLeft(testDuration * 60); // convert minutes to seconds
                }
            } catch (error) {
                console.error(error);
                toast.error(error.response?.data?.message || "Failed to load assessment.");
            } finally {
                setLoading(false);
            }
        };
        fetchAssessment();
    }, [id]);

    // Request Media Access
    useEffect(() => {
        if (!loading && !submitted && !canceled && questions.length > 0) {
            const getMedia = async () => {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                    streamRef.current = stream;
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                    }
                    setMediaAccess(true);
                } catch (err) {
                    toast.error("You must allow camera and microphone access to take this assessment.");
                }
            };
            getMedia();
        }

        return () => {
            // Cleanup media tracks on unmount
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, [loading, submitted, canceled, questions]);

    // Attach stream to video element when it renders
    useEffect(() => {
        if (mediaAccess && videoRef.current && streamRef.current) {
            videoRef.current.srcObject = streamRef.current;
        }
    }, [mediaAccess]);

    // Proctoring: Detect Tab/Window switch
    const lastWarningTimeRef = useRef(0);

    useEffect(() => {
        if (loading || submitted || canceled || questions.length === 0 || !mediaAccess) return;

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                handleTabSwitch();
            }
        };

        const handleTabSwitch = () => {
            const now = Date.now();
            if (now - lastWarningTimeRef.current < 2000) {
                // Prevent double counting 
                return;
            }
            lastWarningTimeRef.current = now;

            setTabSwitches(prev => {
                const newCount = prev + 1;
                if (newCount >= 3) {
                    toast.error("Test Canceled! You exceeded the maximum allowed tab switches.", { duration: 5000 });
                    cancelAssessment();
                } else {
                    toast.warning(`WARNING: Tab switch detected! (${newCount}/3 warnings before cancellation)`, { duration: 5000 });
                }
                return newCount;
            });
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [loading, submitted, canceled, questions, mediaAccess]);

    const handleChange = (index, value) => {
        setAnswers({ ...answers, [index]: value });
    };

    // Timer Logic
    useEffect(() => {
        if (timeLeft === null || submitted || canceled || loading || !mediaAccess) return;

        if (timeLeft <= 0) {
            handleSubmit(new Event('submit'), true); // Auto submit
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, submitted, canceled, loading, mediaAccess]);

    const formatTime = (seconds) => {
        if (seconds === null) return "00:00";
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const cancelAssessment = async () => {
        setCanceled(true);
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
        // Force submit with score 0 (by passing empty answers)
        try {
            await axios.post(`${ASSESSMENT_API_END_POINT}/application/${id}/submit`, { answers: {} }, { withCredentials: true });
            setTimeout(() => {
                navigate('/');
            }, 3000);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e, autoSubmit = false) => {
        if (e && e.preventDefault) e.preventDefault();
        
        // Validate all answered (skip validation if auto-submitting)
        if (!autoSubmit) {
            for (let i = 0; i < questions.length; i++) {
                if (!answers[i]) {
                    toast.error(`Please answer question ${i + 1}`);
                    return;
                }
            }
        }

        try {
            const res = await axios.post(`${ASSESSMENT_API_END_POINT}/application/${id}/submit`, { answers }, { withCredentials: true });
            if (res.data.success) {
                toast.success("Assessment submitted successfully!");
                setSubmitted(true);
                if (streamRef.current) {
                    streamRef.current.getTracks().forEach(track => track.stop());
                }
                setTimeout(() => {
                    navigate('/');
                }, 3000);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to submit assessment.");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    if (canceled) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-zinc-900">
                <Navbar />
                <div className="max-w-2xl mx-auto mt-20 p-8 bg-white dark:bg-zinc-800 rounded-3xl shadow-xl text-center border border-red-100 dark:border-red-900/30">
                    <XCircle size={64} className="text-red-500 mx-auto mb-6" />
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">Assessment Canceled</h2>
                    <p className="text-gray-600 dark:text-zinc-400">Your test was automatically canceled due to suspicious activity (switching tabs or leaving the testing window multiple times).</p>
                </div>
            </div>
        );
    }

    if (submitted) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-zinc-900">
                <Navbar />
                <div className="max-w-2xl mx-auto mt-20 p-8 bg-white dark:bg-zinc-800 rounded-3xl shadow-xl text-center">
                    <CheckCircle2 size={64} className="text-emerald-500 mx-auto mb-6" />
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">Test Submitted!</h2>
                    <p className="text-gray-600 dark:text-zinc-400">Thank you for completing the assessment. The recruiter will review your answers and get back to you soon.</p>
                </div>
            </div>
        );
    }

    if (questions.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-zinc-900">
                <Navbar />
                <div className="max-w-2xl mx-auto mt-20 p-8 bg-white dark:bg-zinc-800 rounded-3xl shadow-xl text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No Assessment Found</h2>
                    <p className="text-gray-600 dark:text-zinc-400">The recruiter hasn't provided an assessment for this role.</p>
                </div>
            </div>
        );
    }

    if (!mediaAccess) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-zinc-900">
                <Navbar />
                <div className="max-w-2xl mx-auto mt-20 p-8 bg-white dark:bg-zinc-800 rounded-3xl shadow-xl text-center border border-purple-100 dark:border-purple-900/30">
                    <Camera size={64} className="text-purple-500 mx-auto mb-6 animate-pulse" />
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">Proctoring Initialization</h2>
                    <p className="text-gray-600 dark:text-zinc-400 mb-6">This assessment requires a camera and microphone to ensure academic integrity. Please allow access when prompted by your browser to begin the test.</p>
                    <div className="flex items-center justify-center gap-2 text-sm font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl">
                        <AlertTriangle size={20} />
                        Make sure you grant permissions to continue.
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 pb-20">
            <Navbar />
            <div className="max-w-4xl mx-auto mt-10 p-6 md:p-10 bg-white dark:bg-zinc-800 rounded-3xl shadow-xl border border-gray-100 dark:border-zinc-800">
                
                {/* Proctoring Header */}
                <div className="flex flex-col md:flex-row gap-6 mb-8 items-start md:items-center justify-between bg-zinc-900 dark:bg-black p-4 rounded-2xl shadow-inner border border-zinc-800">
                    <div className="flex items-center gap-4">
                        <div className="w-32 h-24 bg-black rounded-lg overflow-hidden border-2 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)] relative">
                            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                            <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/60 px-2 py-1 rounded text-[10px] text-red-500 font-bold uppercase tracking-widest">
                                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div> REC
                            </div>
                        </div>
                        <div>
                            <h2 className="text-white font-black uppercase tracking-wider text-lg">Proctored Session</h2>
                            <p className="text-zinc-400 text-xs font-bold mt-1">Camera & Microphone Active</p>
                            {tabSwitches > 0 && (
                                <p className="text-red-400 text-xs font-bold mt-1.5 flex items-center gap-1.5">
                                    <AlertTriangle size={12} /> Warnings: {tabSwitches}/3
                                </p>
                            )}
                        </div>
                    </div>

                    {timeLeft !== null && (
                        <div className={`flex items-center gap-3 px-6 py-4 rounded-xl border-2 font-black text-2xl tracking-widest bg-black shadow-lg
                            ${timeLeft < 60 
                                ? 'border-red-500 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)] animate-pulse' 
                                : 'border-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.2)]'
                            }`}
                        >
                            <Timer size={24} className={timeLeft < 60 ? 'text-red-500' : 'text-purple-400'} />
                            {formatTime(timeLeft)}
                        </div>
                    )}
                </div>

                <div className="border-b dark:border-zinc-700 pb-6 mb-8">
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Assessment Test</h1>
                    <p className="text-gray-500 dark:text-zinc-400 mt-2">Please answer the following questions carefully. Do not leave this tab.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {questions.map((q, idx) => (
                        <div key={idx} className="space-y-4">
                            <label className="block text-lg font-bold text-gray-800 dark:text-zinc-200">
                                {idx + 1}. {q.questionText}
                            </label>
                            
                            {q.questionType === 'subjective' ? (
                                <textarea
                                    value={answers[idx]}
                                    onChange={(e) => handleChange(idx, e.target.value)}
                                    required
                                    rows={4}
                                    className="w-full p-4 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                                    placeholder="Your answer here..."
                                />
                            ) : (
                                <div className="space-y-3 pl-2">
                                    {q.options.map((opt, oIdx) => (
                                        <label key={oIdx} className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors">
                                            <input
                                                type="radio"
                                                name={`question_${idx}`}
                                                value={opt}
                                                checked={answers[idx] === opt}
                                                onChange={(e) => handleChange(idx, e.target.value)}
                                                required
                                                className="w-5 h-5 text-purple-600 focus:ring-purple-500"
                                            />
                                            <span className="text-gray-700 dark:text-zinc-300">{opt}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}

                    <div className="pt-6 border-t dark:border-zinc-700 flex justify-end">
                        <Button 
                            type="submit" 
                            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 rounded-xl font-bold text-lg shadow-lg transition-all"
                        >
                            Submit Assessment
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AssessmentTest;
