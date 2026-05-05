import { BASE_URL } from '../../utils/constant';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Video, Search, Eye, Trash2 } from 'lucide-react';
import { Input } from '../ui/input';

const SysAdminWebinars = () => {
    const [webinars, setWebinars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchWebinars();
    }, []);

    const fetchWebinars = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${BASE_URL}/api/v1/admin/webinars`, {
                withCredentials: true
            });
            if (res.data.success) {
                setWebinars(res.data.webinars);
            }
        } catch (error) {
            toast.error("Failed to fetch webinars");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this webinar?")) return;
        toast.promise(new Promise(resolve => setTimeout(resolve, 1000)), {
            loading: 'Deleting webinar...',
            success: () => {
                setWebinars(webinars.filter(w => w._id !== id));
                return "Webinar deleted successfully";
            },
            error: 'Failed to delete'
        });
    };

    const filteredWebinars = webinars.filter(webinar =>
        webinar.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight uppercase">Webinars</h1>
                    <p className="text-gray-400 mt-2 font-medium">Manage all platform live streams and webinars.</p>
                </div>

                <div className="relative w-full md:w-80 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-500 transition-colors" size={18} />
                    <Input
                        type="text"
                        placeholder="Search webinars..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-12 bg-gray-900 border border-gray-800 rounded-full pl-12 focus-visible:ring-2 focus-visible:ring-purple-500 text-white placeholder:text-gray-600 shadow-xl"
                    />
                </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-black/40 text-gray-400 text-xs uppercase tracking-wider font-semibold border-b border-gray-800">
                                <th className="px-6 py-5 rounded-tl-3xl">Webinar Title</th>
                                <th className="px-6 py-5">Speaker</th>
                                <th className="px-6 py-5">Date</th>
                                <th className="px-6 py-5">Duration</th>
                                <th className="px-6 py-5 rounded-tr-3xl text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800/50 text-sm">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-20 text-center text-gray-500">Loading webinars...</td>
                                </tr>
                            ) : filteredWebinars.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-20 text-center text-gray-500">No webinars found.</td>
                                </tr>
                            ) : (
                                filteredWebinars.map((webinar) => (
                                    <tr key={webinar._id} className="hover:bg-gray-800/20 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 font-bold border border-red-500/20">
                                                    <Video size={18} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white group-hover:text-red-500 transition-colors">{webinar.title}</p>
                                                    <p className="text-gray-500 text-xs">{webinar.topic || 'General'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-300 font-medium">
                                            {webinar.speakerName || "Unknown"}
                                        </td>
                                        <td className="px-6 py-4 text-gray-400 text-xs whitespace-nowrap">
                                            {new Date(webinar.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-gray-400">
                                            {webinar.duration || 'N/A'} min
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => window.open(`/description/webinar/${webinar._id}`, "_blank")}
                                                    className="p-2 bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors border border-gray-700"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(webinar._id)}
                                                    className="p-2 bg-red-500/10 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors border border-red-500/20"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SysAdminWebinars;
