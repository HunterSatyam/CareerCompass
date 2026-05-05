import React, { useState } from 'react';
import { Bell, CheckCircle, Info, AlertTriangle, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';

const SysAdminNotifications = () => {
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            title: "New Company Registration",
            message: "TechCorp Inc. has requested recruiter access.",
            type: "info",
            time: "10 mins ago",
            read: false,
            icon: Info,
            color: "text-blue-500",
            bg: "bg-blue-500/10"
        },
        {
            id: 2,
            title: "System Alert",
            message: "High traffic detected on hackathon registrations page.",
            type: "warning",
            time: "1 hour ago",
            read: false,
            icon: AlertTriangle,
            color: "text-yellow-500",
            bg: "bg-yellow-500/10"
        },
        {
            id: 3,
            title: "Security Notice",
            message: "Multiple failed login attempts from IP 192.168.1.5",
            type: "critical",
            time: "2 hours ago",
            read: false,
            icon: ShieldAlert,
            color: "text-red-500",
            bg: "bg-red-500/10"
        },
        {
            id: 4,
            title: "Database Backup",
            message: "Automated daily backup completed successfully.",
            type: "success",
            time: "1 day ago",
            read: true,
            icon: CheckCircle,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10"
        }
    ]);

    const markAsRead = (id) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
        toast.success("Notification marked as read");
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
        toast.success("All notifications marked as read");
    };

    return (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-800 pb-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tight uppercase flex items-center gap-3">
                        <Bell className="text-purple-500" size={32} />
                        Notifications
                    </h1>
                    <p className="text-gray-400 mt-2 font-medium">System alerts and administrative updates.</p>
                </div>
                <button
                    onClick={markAllAsRead}
                    className="px-6 py-2 bg-gray-900 border border-gray-700 hover:bg-gray-800 text-white font-bold uppercase tracking-widest text-xs rounded-full shadow-lg transition-all"
                >
                    Mark All Read
                </button>
            </div>

            <div className="space-y-4">
                {notifications.length === 0 ? (
                    <div className="bg-gray-900 border border-gray-800 rounded-3xl p-12 text-center text-gray-500">
                        <Bell size={48} className="mx-auto mb-4 opacity-50" />
                        <p>No new notifications at this time.</p>
                    </div>
                ) : (
                    notifications.map((notif) => (
                        <div key={notif.id} className={`flex items-start gap-4 p-6 rounded-3xl border transition-all ${notif.read ? 'bg-gray-950 border-gray-900 opacity-75' : 'bg-gray-900 border-gray-800 shadow-xl'}`}>
                            <div className={`p-4 rounded-2xl ${notif.bg}`}>
                                <notif.icon size={24} className={notif.color} />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h3 className={`font-bold ${notif.read ? 'text-gray-400' : 'text-white'}`}>{notif.title}</h3>
                                    <span className="text-xs text-gray-500 font-medium">{notif.time}</span>
                                </div>
                                <p className="text-gray-400 mt-1 text-sm">{notif.message}</p>
                            </div>
                            {!notif.read && (
                                <button
                                    onClick={() => markAsRead(notif.id)}
                                    className="p-2 text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 rounded-full transition-colors"
                                    title="Mark as Read"
                                >
                                    <CheckCircle size={20} />
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default SysAdminNotifications;
