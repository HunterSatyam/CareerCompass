import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setAdminUser } from '@/redux/sysAdminSlice';
import axios from 'axios';
import { toast } from 'sonner';
import { Lock, Mail, ShieldAlert } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { USER_API_END_POINT } from '@/utils/constant';

const SysAdminLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const fetchAdminStats = async () => { /* to be implemented */ }

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.post(`http://localhost:8000/api/v1/admin/login`, { email, password }, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });
            if (res.data.success) {
                dispatch(setAdminUser(res.data.admin));
                toast.success(res.data.message);
                navigate("/sys-admin/dashboard");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Login Failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
            <div className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl">
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-purple-600/20 p-4 rounded-full mb-4">
                        <ShieldAlert className="text-purple-500 w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-wider">Super Admin</h2>
                    <p className="text-gray-400 mt-2 text-sm text-center">Secure access panel for platform management</p>
                </div>

                <form onSubmit={submitHandler} className="space-y-6">
                    <div className="space-y-2">
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-500 transition-colors" size={20} />
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Admin Email"
                                className="w-full h-14 bg-gray-950 border border-gray-800 rounded-2xl pl-12 focus-visible:ring-2 focus-visible:ring-purple-500 text-white placeholder:text-gray-600"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-500 transition-colors" size={20} />
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Secure Password"
                                className="w-full h-14 bg-gray-950 border border-gray-800 rounded-2xl pl-12 focus-visible:ring-2 focus-visible:ring-purple-500 text-white placeholder:text-gray-600"
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-14 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold uppercase tracking-wider"
                    >
                        {loading ? 'Authenticating...' : 'Access Panel'}
                    </Button>
                </form>

                <div className="mt-8 text-center text-xs text-gray-600">
                    <p>Unauthorized access is strictly prohibited & monitored.</p>
                </div>
            </div>
        </div>
    );
};
export default SysAdminLogin;
