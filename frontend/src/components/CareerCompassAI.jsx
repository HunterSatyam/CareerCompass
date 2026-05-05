import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, User, Bot, Loader2, Sparkles } from 'lucide-react';

const CareerCompassAI = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'bot',
            content: "Hi there! I'm CareerCompass AI. \n\nI can help you search jobs, internships, build a resume, or create a skill roadmap. What's on your mind today?"
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Auto-scroll to bottom of messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isOpen]);

    const toggleChat = () => setIsOpen(!isOpen);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        // Add user message
        const userMessage = {
            id: Date.now(),
            type: 'user',
            content: inputValue
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        // Mock API response delay
        try {
            // Simulate network request
            await new Promise(resolve => setTimeout(resolve, 1500));

            const botResponse = generateMockResponse(inputValue);

            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                type: 'bot',
                content: botResponse
            }]);
        } catch (error) {
            console.error("Error sending message:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Mock Logic for CareerCompass AI
    const generateMockResponse = (input) => {
        const lowerInput = input.toLowerCase();

        if (lowerInput.includes('job') || lowerInput.includes('internship') || lowerInput.includes('search')) {
            return "I can help with that! EventCompiler has many opportunities.\n\nCould you tell me:\n• Your target role?\n• Preferred location (or remote)?\n• Your experience level?";
        }

        if (lowerInput.includes('resume') || lowerInput.includes('cv')) {
            return "Building a strong resume is key! \n\nI can help optimize your resume for ATS. Please share:\n• Your target role\n• Key skills\n• Brief project details";
        }

        if (lowerInput.includes('roadmap') || lowerInput.includes('learn') || lowerInput.includes('skill')) {
            return "A learning roadmap is a great idea! \n\nWhat role are you aiming for? (e.g., Frontend Dev, Data Scientist, Product Manager)";
        }

        if (lowerInput.includes('hackathon') || lowerInput.includes('competition')) {
            return "Competitions are a fantastic way to prove your skills! \n\nCheck out the 'Hackathons' section on our platform. I can also suggest some if you tell me your tech stack.";
        }

        if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
            return "Hello! How can I assist you with your career journey today?";
        }

        return "That sounds interesting! \n\nCould you give me a bit more detail so I can guide you better? I can help with jobs, internships, resumes, or skill roadmaps.";
    };

    return (
        <>
            {/* Floating Action Button */}
            <motion.button
                className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-700 dark:to-purple-800 text-white rounded-full shadow-lg hover:shadow-2xl transition-all flex items-center justify-center border border-white/20"
                onClick={toggleChat}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
            >
                {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="fixed bottom-24 right-6 z-50 w-96 h-[500px] bg-white dark:bg-zinc-900 rounded-[32px] shadow-2xl flex flex-col border border-gray-100 dark:border-zinc-800 overflow-hidden backdrop-blur-sm"
                        initial={{ y: 20, opacity: 0, scale: 0.95 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: 20, opacity: 0, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                        {/* Header */}
                        <div className="p-6 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-800 dark:to-purple-900 text-white flex items-center gap-4">
                            <div className="p-2.5 bg-white/20 dark:bg-black/20 rounded-2xl backdrop-blur-md">
                                <Bot size={24} className="text-white" />
                            </div>
                            <div>
                                <h3 className="font-black text-lg flex items-center gap-2 tracking-tight">
                                    CareerCompass AI
                                    <Sparkles size={16} className="text-yellow-300 animate-pulse" />
                                </h3>
                                <div className='flex items-center gap-2'>
                                    <div className='w-2 h-2 rounded-full bg-emerald-400 animate-pulse'></div>
                                    <p className="text-[10px] uppercase font-black tracking-widest text-indigo-100 opacity-90">Always Active</p>
                                </div>
                            </div>
                            <button onClick={toggleChat} className='ml-auto text-white/50 hover:text-white transition-colors'>
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50 dark:bg-black/50 space-y-4 custom-scrollbar">
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, x: msg.type === 'user' ? 20 : -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`
                    max-w-[85%] p-4 rounded-3xl text-sm leading-relaxed shadow-sm font-medium
                    ${msg.type === 'user'
                                            ? 'bg-indigo-600 text-white rounded-br-none'
                                            : 'bg-white dark:bg-zinc-800 text-gray-700 dark:text-zinc-200 border border-gray-100 dark:border-zinc-700 rounded-bl-none'}
                  `}>
                                        <p className="whitespace-pre-wrap">{msg.content}</p>
                                    </div>
                                </motion.div>
                            ))}

                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-white dark:bg-zinc-800 p-4 rounded-3xl rounded-bl-none border border-gray-100 dark:border-zinc-700 shadow-sm flex items-center gap-3">
                                        <div className='flex gap-1'>
                                            <span className='w-1.5 h-1.5 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-bounce' style={{ animationDelay: '0ms' }}></span>
                                            <span className='w-1.5 h-1.5 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-bounce' style={{ animationDelay: '150ms' }}></span>
                                            <span className='w-1.5 h-1.5 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-bounce' style={{ animationDelay: '300ms' }}></span>
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-zinc-400">Thinking...</span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSendMessage} className="p-4 bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800 flex gap-3">
                            <input
                                type="text"
                                placeholder="Ask about jobs, resume, skills..."
                                className="flex-1 p-3.5 bg-gray-50 dark:bg-zinc-800 rounded-2xl border border-transparent focus:border-indigo-500/50 dark:focus:border-indigo-400/50 text-sm font-medium outline-none transition-all dark:text-white dark:placeholder:text-zinc-600"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                            />
                            <button
                                type="submit"
                                disabled={!inputValue.trim() || isLoading}
                                className="p-3.5 bg-indigo-600 dark:bg-indigo-500 text-white rounded-2xl hover:bg-indigo-700 dark:hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md active:scale-95 flex items-center justify-center shrink-0"
                            >
                                <Send size={20} />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default CareerCompassAI;
