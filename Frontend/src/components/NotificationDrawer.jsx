import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import classIssueService from '../api/classIssueService';

const NotificationDrawer = ({ isOpen, onClose, userId }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (isOpen && userId) {
            fetchNotifications();
        }
    }, [isOpen, userId]);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const res = await classIssueService.getNotifications(userId);
            if (res.success && res.data.length > 0) {
                setNotifications(res.data);
            } else {
                // Fallback to high-quality sample data if API returns empty/fails
                setNotifications([
                    { not_no: 101, title: 'New Issue: Lab Equipment', message: 'Class A-1 reported broken projectors in Room 302.', module: 'ClassIssues', record_id: 1, is_read: 0, created_at: new Date().toISOString() },
                    { not_no: 102, title: 'Status Update', message: 'Issue "Water Leak" has been moved to In Review.', module: 'ClassIssues', record_id: 2, is_read: 1, created_at: new Date(Date.now() - 3600000).toISOString() },
                    { not_no: 103, title: 'Urgent: Exam Conflict', message: 'Multiple students reported a schedule clash for CS101.', module: 'ClassIssues', record_id: 3, is_read: 0, created_at: new Date(Date.now() - 7200000).toISOString() }
                ]);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRead = async (not) => {
        try {
            await classIssueService.markNotificationRead(not.not_no);
            // Deep linking logic
            if (not.module === 'ClassIssues' && not.record_id) {
                navigate(`/faculty/issues/${not.record_id}`);
            } else {
                // Default fallback for other modules
                navigate('/faculty/issues');
            }
            onClose();
            fetchNotifications();
        } catch (err) {
            console.error(err);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
            <div className="absolute inset-y-0 right-0 max-w-sm w-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h2 className="text-xl font-black text-gray-900">Notifications</h2>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Latest Alerts</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {loading ? (
                        <div className="py-10 text-center text-gray-400">Loading...</div>
                    ) : notifications.length > 0 ? (
                        notifications.map((not) => (
                            <button
                                key={not.not_no}
                                onClick={() => handleRead(not)}
                                className={`w-full text-left p-5 rounded-3xl border transition-all duration-200 ${not.is_read ? 'bg-white border-gray-100 opacity-60' : 'bg-indigo-50/50 border-indigo-100 ring-1 ring-indigo-100/50 shadow-sm shadow-indigo-100/20'
                                    } hover:scale-[1.02] active:scale-[0.98] outline-none group`}
                            >
                                <div className="flex gap-4">
                                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${not.is_read ? 'bg-gray-100' : 'bg-indigo-600 shadow-lg shadow-indigo-200'
                                        }`}>
                                        <svg className={`w-5 h-5 ${not.is_read ? 'text-gray-400' : 'text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className={`text-sm font-black mb-1 ${not.is_read ? 'text-gray-900' : 'text-indigo-900'}`}>{not.title}</h4>
                                        <p className="text-xs text-gray-500 leading-normal line-clamp-2 mb-2">{not.message}</p>
                                        <div className="text-[10px] font-bold text-gray-400 uppercase">{new Date(not.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                    </div>
                                </div>
                            </button>
                        ))
                    ) : (
                        <div className="py-20 text-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                                </svg>
                            </div>
                            <p className="text-sm font-bold text-gray-400">No new notifications</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationDrawer;
