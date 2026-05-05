import React, { useEffect, useState, useRef } from 'react';
import Navbar from './shared/Navbar';
import axios from 'axios';
import { MESSAGE_API_END_POINT } from '../utils/constant';
import { useSelector } from 'react-redux';
import { Send, UserCircle2, Reply, Pencil, Trash2, X, MoreVertical } from 'lucide-react';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

const Community = () => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const { user } = useSelector(store => store.auth);
    const messagesEndRef = useRef(null);
    
    const [replyingTo, setReplyingTo] = useState(null);
    const [editingMessage, setEditingMessage] = useState(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchMessages = async () => {
        try {
            const res = await axios.get(MESSAGE_API_END_POINT, { withCredentials: true });
            if (res.data.success) {
                // To avoid interrupting editing, only update state if we're not actively editing, 
                // or carefully merge it. For simplicity, if editing, we might pause updates, 
                // but let's just merge.
                setMessages(res.data.messages);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(() => {
            fetchMessages();
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (editingMessage) {
            return submitEditMessage(e);
        }

        if (!inputMessage.trim()) return;

        try {
            const payload = { message: inputMessage };
            if (replyingTo) {
                payload.replyTo = replyingTo._id;
            }

            const res = await axios.post(`${MESSAGE_API_END_POINT}/send`, payload, { withCredentials: true });
            if (res.data.success) {
                setMessages([...messages, res.data.message]);
                setInputMessage('');
                setReplyingTo(null);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const submitEditMessage = async (e) => {
        e.preventDefault();
        if (!inputMessage.trim() || !editingMessage) return;

        try {
            const res = await axios.put(`${MESSAGE_API_END_POINT}/${editingMessage._id}`, { text: inputMessage }, { withCredentials: true });
            if (res.data.success) {
                setMessages(messages.map(m => m._id === editingMessage._id ? { ...m, message: inputMessage, isEdited: true } : m));
                setEditingMessage(null);
                setInputMessage('');
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteMessage = async (id) => {
        try {
            const res = await axios.delete(`${MESSAGE_API_END_POINT}/${id}`, { withCredentials: true });
            if (res.data.success) {
                setMessages(messages.filter(m => m._id !== id));
            }
        } catch (error) {
            console.log(error);
        }
    };

    const cancelAction = () => {
        setReplyingTo(null);
        setEditingMessage(null);
        setInputMessage('');
    };

    return (
        <div className="flex flex-col h-screen dark:bg-gray-900">
            <Navbar />
            <div className="flex-1 max-w-4xl w-full mx-auto p-4 flex flex-col h-[calc(100vh-80px)] overflow-hidden">
                <div className="bg-white dark:bg-gray-800 rounded-t-lg shadow-sm border-b dark:border-gray-700 p-4 shrink-0 z-10">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Global Community</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Chat with applicants and recruiters</p>
                </div>

                <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900/50 shadow-inner border-x dark:border-gray-700 overflow-x-hidden">
                    <div className="space-y-4">
                        {messages.map((msg) => {
                            const isOwnMessage = user?._id === msg.senderId?._id;
                            return (
                                <div key={msg._id} className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}>
                                    <div className={`flex items-end gap-2 max-w-[85%] sm:max-w-[70%] group`}>
                                        
                                        {!isOwnMessage && (
                                            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 mb-1">
                                                {msg.senderId?.profile?.profilePhoto ? (
                                                    <img src={msg.senderId.profile.profilePhoto} alt="profile" className="w-full h-full rounded-full object-cover" />
                                                ) : (
                                                    <UserCircle2 className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                                                )}
                                            </div>
                                        )}

                                        <motion.div 
                                            drag="x" 
                                            dragConstraints={{ left: 0, right: 0 }} 
                                            dragElastic={0.1}
                                            onDragEnd={(e, info) => {
                                                if (info.offset.x > 50) {
                                                    setReplyingTo(msg);
                                                    setEditingMessage(null);
                                                }
                                            }}
                                            className="relative flex flex-col w-full"
                                        >
                                            {msg.replyTo && (
                                                <div className={`flex items-center gap-1 mb-1 text-xs px-3 py-1.5 rounded-xl ${isOwnMessage ? 'bg-gray-200/50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 self-end mr-4' : 'bg-gray-200/50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 self-start ml-4'} border border-gray-200 dark:border-gray-700`}>
                                                    <Reply size={12} className="opacity-70" />
                                                    <span className="font-semibold opacity-80">{msg.replyTo.senderId?.fullname}:</span>
                                                    <span className="truncate max-w-[120px] sm:max-w-[200px] opacity-70">{msg.replyTo.message}</span>
                                                </div>
                                            )}
                                            
                                            <div className="flex items-center gap-2 w-full">
                                                {isOwnMessage && (
                                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Popover>
                                                            <PopoverTrigger asChild>
                                                                <button className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 bg-white dark:bg-gray-800 rounded-full shadow-sm border border-gray-200 dark:border-gray-700">
                                                                    <MoreVertical size={14} />
                                                                </button>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="w-32 p-1 border-gray-200 dark:border-gray-700 shadow-xl rounded-xl">
                                                                <button 
                                                                    onClick={() => {
                                                                        setEditingMessage(msg);
                                                                        setInputMessage(msg.message);
                                                                        setReplyingTo(null);
                                                                    }}
                                                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                                                >
                                                                    <Pencil size={14} /> Edit
                                                                </button>
                                                                <button 
                                                                    onClick={() => handleDeleteMessage(msg._id)}
                                                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors mt-1"
                                                                >
                                                                    <Trash2 size={14} /> Delete
                                                                </button>
                                                            </PopoverContent>
                                                        </Popover>
                                                    </div>
                                                )}

                                                <div className={`p-3 rounded-2xl ${isOwnMessage ? 'bg-[#183951] text-white rounded-br-none ml-auto' : 'bg-white dark:bg-gray-800 border dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'} shadow-sm relative`}>
                                                    {!isOwnMessage && (
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                                                                {msg.senderId?.fullname} <span className="font-normal text-[10px] ml-1 opacity-70">({msg.senderId?.role})</span>
                                                            </p>
                                                        </div>
                                                    )}
                                                    <p className="text-sm whitespace-pre-wrap break-words">{msg.message}</p>
                                                    
                                                    {msg.isEdited && (
                                                        <span className={`text-[9px] absolute bottom-1 right-3 ${isOwnMessage ? 'text-white/60' : 'text-gray-400'}`}>
                                                            (edited)
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>

                                        {isOwnMessage && (
                                            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 mb-1">
                                                {msg.senderId?.profile?.profilePhoto ? (
                                                    <img src={msg.senderId.profile.profilePhoto} alt="profile" className="w-full h-full rounded-full object-cover" />
                                                ) : (
                                                    <UserCircle2 className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-[10px] text-gray-400 mt-1 mx-10">
                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-b-lg shadow-sm border-t dark:border-gray-700 shrink-0">
                    <AnimatePresence>
                        {(replyingTo || editingMessage) && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10, height: 0 }}
                                animate={{ opacity: 1, y: 0, height: 'auto' }}
                                exit={{ opacity: 0, y: 10, height: 0 }}
                                className="flex items-center justify-between bg-gray-100 dark:bg-gray-900 px-4 py-2 rounded-t-xl border-x border-t border-gray-200 dark:border-gray-700 -mt-2 pb-3 pt-2"
                            >
                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 truncate">
                                    {replyingTo ? (
                                        <>
                                            <Reply size={14} className="text-blue-500" />
                                            <span className="font-medium">Replying to {replyingTo.senderId?.fullname}:</span>
                                            <span className="truncate opacity-80">{replyingTo.message}</span>
                                        </>
                                    ) : (
                                        <>
                                            <Pencil size={14} className="text-green-500" />
                                            <span className="font-medium">Editing message</span>
                                        </>
                                    )}
                                </div>
                                <button onClick={cancelAction} className="p-1 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 bg-gray-200 dark:bg-gray-800 rounded-full transition-colors">
                                    <X size={14} />
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSendMessage} className={`flex gap-3 relative ${replyingTo || editingMessage ? 'z-10 bg-white dark:bg-gray-800 pt-1' : ''}`}>
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            placeholder={editingMessage ? "Edit your message..." : "Type your message (Swipe right on a message to reply)..."}
                            className="flex-1 p-3 px-5 rounded-full border dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#183951] transition-all text-sm"
                        />
                        <Button type="submit" disabled={!inputMessage.trim()} className={`${editingMessage ? 'bg-green-600 hover:bg-green-700' : 'bg-[#183951] hover:bg-[#122b3e]'} text-white rounded-full p-3 h-12 w-12 flex items-center justify-center disabled:opacity-50 transition-all shadow-md`}>
                            {editingMessage ? <Pencil className="w-4 h-4" /> : <Send className="w-5 h-5 ml-1" />}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Community;
