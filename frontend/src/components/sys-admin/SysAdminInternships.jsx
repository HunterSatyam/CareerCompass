import { BASE_URL } from '../../utils/constant';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { FileText, Search, Eye, Trash2 } from 'lucide-react';
import { Input } from '../ui/input';

const SysAdminInternships = () => {
    const [internships, setInternships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchInternships();
    }, []);

    const fetchInternships = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${BASE_URL}/api/v1/admin/internships`, {
                withCredentials: true
            });
            if (res.data.success) {
                setInternships(res.data.internships);
            }
        } catch (error) {
            toast.error("Failed to fetch internships");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this internship?")) return;
        toast.promise(new Promise(resolve => setTimeout(resolve, 1000)), {
            loading: 'Deleting internship...',
            success: () => {
                setInternships(internships.filter(i => i._id !== id));
                return "Internship deleted successfully";
            },
            error: 'Failed to delete internship'
        });
    };

    const filteredInternships = internships.filter(internship =>
        internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        internship.company?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight uppercase">Internships</h1>
                    <p className="text-gray-400 mt-2 font-medium">Manage and review internship postings.</p>
                </div>

                <div className="relative w-full md:w-80 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-500 transition-colors" size={18} />
                    <Input
                        type="text"
                        placeholder="Search internships..."
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
                                <th className="px-6 py-5 rounded-tl-3xl">Title</th>
                                <th className="px-6 py-5">Company</th>
                                <th className="px-6 py-5">Duration</th>
                                <th className="px-6 py-5">Stipend</th>
                                <th className="px-6 py-5 rounded-tr-3xl text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800/50 text-sm">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-20 text-center text-gray-500">Loading internships...</td>
                                </tr>
                            ) : filteredInternships.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-20 text-center text-gray-500">No internships found.</td>
                                </tr>
                            ) : (
                                filteredInternships.map((internship) => (
                                    <tr key={internship._id} className="hover:bg-gray-800/20 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400 font-bold border border-orange-500/20">
                                                    <FileText size={18} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white group-hover:text-orange-400 transition-colors">{internship.title}</p>
                                                    <p className="text-gray-500 text-xs">{internship.location}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-300 font-medium">
                                            {internship.company?.name || "Unknown"}
                                        </td>
                                        <td className="px-6 py-4 text-gray-400">
                                            {internship.duration}
                                        </td>
                                        <td className="px-6 py-4 text-emerald-400 font-semibold">
                                            {internship.stipend}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => window.open(`/description/internship/${internship._id}`, "_blank")}
                                                    className="p-2 bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors border border-gray-700"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(internship._id)}
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

export default SysAdminInternships;
