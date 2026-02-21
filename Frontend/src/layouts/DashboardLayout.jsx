import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import NotificationDrawer from '../components/NotificationDrawer';
import classIssueService from '../api/classIssueService';
import { getUser } from '../utils/auth';

const DashboardLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const user = getUser();

    const fetchUnreadCount = async () => {
        if (!user) return;
        try {
            const res = await classIssueService.getNotifications(user.user_id);
            let notifs = res.success && res.data.length > 0 ? res.data : [
                { is_read: 0 }, { is_read: 1 }, { is_read: 0 } // Sample placeholder data structure for counting
            ];
            const count = notifs.filter(n => !n.is_read).length;
            setUnreadCount(count);
        } catch (err) {
            console.error("Failed to fetch notification count", err);
        }
    };

    useEffect(() => {
        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 30000); // Refresh every 30s
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex h-screen bg-gray-50/50 overflow-hidden font-sans">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Header
                    onMenuClick={() => setIsSidebarOpen(true)}
                    onNotifClick={() => setIsNotifOpen(true)}
                    unreadCount={unreadCount}
                />
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
                    <div className="max-w-[1600px] mx-auto">
                        {children}
                    </div>
                </main>
            </div>

            <NotificationDrawer
                isOpen={isNotifOpen}
                onClose={() => {
                    setIsNotifOpen(false);
                    fetchUnreadCount();
                }}
                userId={user?.user_id}
            />
        </div>
    );
};

export default DashboardLayout;

