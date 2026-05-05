import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Users, MoreVertical, Search, Edit2, ShieldOff, ShieldCheck, Trash2, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const SysAdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Modal state
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [editForm, setEditForm] = useState({ fullname: '', email: '', role: '' });

    // Dropdown state
    const [openDropdownId, setOpenDropdownId] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`http://localhost:8000/api/v1/admin/users`, {
                withCredentials: true
            });
            if (res.data.success) {
                setUsers(res.data.users);
            }
        } catch (error) {
            toast.error("Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    const handleSuspend = async (userId, currentStatus) => {
        try {
            const res = await axios.put(`http://localhost:8000/api/v1/admin/users/${userId}/suspend`, {}, {
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message);
                setUsers(users.map(u => u._id === userId ? { ...u, isSuspended: !currentStatus } : u));
            }
        } catch (error) {
            toast.error("Failed to update suspension status");
        }
        setOpenDropdownId(null);
    };

    const handleDelete = async (userId) => {
        if (!window.confirm("Are you sure you want to completely delete this user?")) return;

        try {
            const res = await axios.delete(`http://localhost:8000/api/v1/admin/users/${userId}`, {
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message);
                setUsers(users.filter(u => u._id !== userId));
            }
        } catch (error) {
            toast.error("Failed to delete user");
        }
        setOpenDropdownId(null);
    };

    const openEditModal = (user) => {
        setSelectedUser(user);
        setEditForm({ fullname: user.fullname, email: user.email, role: user.role });
        setIsEditModalOpen(true);
        setOpenDropdownId(null);
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(`http://localhost:8000/api/v1/admin/users/${selectedUser._id}`, editForm, {
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message);
                setUsers(users.map(u => u._id === selectedUser._id ? res.data.user : u));
                setIsEditModalOpen(false);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update user");
        }
    };

    const toggleDropdown = (id) => {
        if (openDropdownId === id) setOpenDropdownId(null);
        else setOpenDropdownId(id);
    };

    const filteredUsers = users.filter(user =>
        user.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight uppercase">User Management</h1>
                    <p className="text-gray-400 mt-2 font-medium">Manage platform users, roles, and permissions.</p>
                </div>

                <div className="relative w-full md:w-80 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-500 transition-colors" size={18} />
                    <Input
                        type="text"
                        placeholder="Search by name or email..."
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
                                <th className="px-6 py-5 rounded-tl-3xl">User Details</th>
                                <th className="px-6 py-5">Role</th>
                                <th className="px-6 py-5">Status</th>
                                <th className="px-6 py-5 rounded-tr-3xl text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800/50 text-sm">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-20 text-center text-gray-500">Loading users...</td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-20 text-center text-gray-500">No users found.</td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user._id} className="hover:bg-gray-800/20 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold uppercase text-lg shadow-lg">
                                                    {user.fullname.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white group-hover:text-purple-400 transition-colors">{user.fullname}</p>
                                                    <p className="text-gray-500 text-xs">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-lg text-xs font-semibold capitalize border border-gray-700">
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.isSuspended ? (
                                                <span className="px-3 py-1 bg-red-500/10 text-red-400 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1 w-max border border-red-500/20">
                                                    <ShieldOff size={12} /> Suspended
                                                </span>
                                            ) : (
                                                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1 w-max border border-emerald-500/20">
                                                    <ShieldCheck size={12} /> Active
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="relative inline-block text-left">
                                                <button
                                                    onClick={() => toggleDropdown(user._id)}
                                                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-colors focus:outline-none"
                                                >
                                                    <MoreVertical size={18} />
                                                </button>

                                                {openDropdownId === user._id && (
                                                    <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-20 overflow-hidden isolate origin-top-right animate-in fade-in slide-in-from-top-2">
                                                        <div className="py-1">
                                                            <button
                                                                onClick={() => openEditModal(user)}
                                                                className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white flex items-center gap-2"
                                                            >
                                                                <Edit2 size={16} /> Edit Details
                                                            </button>
                                                            <button
                                                                onClick={() => handleSuspend(user._id, user.isSuspended)}
                                                                className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${user.isSuspended ? 'text-emerald-400 hover:bg-emerald-500/10' : 'text-orange-400 hover:bg-orange-500/10'}`}
                                                            >
                                                                {user.isSuspended ? <ShieldCheck size={16} /> : <ShieldOff size={16} />}
                                                                {user.isSuspended ? 'Unsuspend User' : 'Suspend User'}
                                                            </button>
                                                            <div className="border-t border-gray-700/50 my-1"></div>
                                                            <button
                                                                onClick={() => handleDelete(user._id)}
                                                                className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2"
                                                            >
                                                                <Trash2 size={16} /> Delete Account
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit User Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-gray-900 border border-gray-800 rounded-3xl w-full max-w-md shadow-2xl relative animate-in zoom-in-95 duration-200">
                        <button
                            onClick={() => setIsEditModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-purple-500/10 rounded-xl">
                                    <Edit2 className="text-purple-500" size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white uppercase tracking-wider">Edit User</h2>
                                    <p className="text-xs text-gray-500">Update account details immediately</p>
                                </div>
                            </div>

                            <form onSubmit={handleUpdateUser} className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-400 uppercase">Full Name</label>
                                    <Input
                                        type="text"
                                        value={editForm.fullname}
                                        onChange={(e) => setEditForm({ ...editForm, fullname: e.target.value })}
                                        required
                                        className="h-12 bg-black border border-gray-800 focus-visible:ring-purple-500 text-white"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-400 uppercase">Email Address</label>
                                    <Input
                                        type="email"
                                        value={editForm.email}
                                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                        required
                                        className="h-12 bg-black border border-gray-800 focus-visible:ring-purple-500 text-white"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-400 uppercase">Role</label>
                                    <select
                                        value={editForm.role}
                                        onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                                        className="w-full h-12 px-3 bg-black border border-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                                    >
                                        <option value="applicant">Applicant</option>
                                        <option value="recruiter">Recruiter</option>
                                    </select>
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsEditModalOpen(false)}
                                        className="flex-1 h-12 bg-transparent text-gray-300 border-gray-700 hover:bg-gray-800 hover:text-white"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="flex-1 h-12 bg-purple-600 hover:bg-purple-700 text-white font-bold"
                                    >
                                        Save Changes
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SysAdminUsers;
