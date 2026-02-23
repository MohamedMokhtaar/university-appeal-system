import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import classIssueService from '../api/classIssueService';

const ClassIssuesList = () => {
    const [issues, setIssues] = useState([]);
    const [stats, setStats] = useState({ total: 0, pending: 0, inReview: 0, resolved: 0, completed: 0 });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [issuesRes, statsRes] = await Promise.all([
                classIssueService.getIssues(),
                classIssueService.getStats()
            ]);
            if (issuesRes.success) setIssues(issuesRes.data);
            if (statsRes.success) setStats(statsRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const statusToKey = (status) => {
        switch ((status || '').toLowerCase()) {
            case 'pending': return 'pending';
            case 'in review': return 'inReview';
            case 'resolved': return 'resolved';
            case 'completed': return 'completed';
            default: return null;
        }
    };

    const handleStatusUpdate = async (issueId, newStatus) => {
        const currentIssue = issues.find((issue) => issue.cl_is_co_no === issueId);
        if (!currentIssue || currentIssue.status === newStatus) {
            return;
        }

        const authUser = JSON.parse(localStorage.getItem('auth_user') || 'null');
        const legacyUser = JSON.parse(localStorage.getItem('user') || 'null');
        const currentUserId = authUser?.user_id || legacyUser?.user_id || 1;

        try {
            const res = await classIssueService.updateIssueStatus(issueId, {
                new_status: newStatus,
                note: `Status updated to ${newStatus} from dashboard`,
                user_id: currentUserId
            });

            if (res.success) {
                setIssues(prev => prev.map(issue =>
                    issue.cl_is_co_no === issueId ? { ...issue, status: newStatus } : issue
                ));

                setStats((prev) => {
                    const oldKey = statusToKey(currentIssue.status);
                    const newKey = statusToKey(newStatus);
                    const next = { ...prev };

                    if (oldKey && typeof next[oldKey] === 'number' && next[oldKey] > 0) {
                        next[oldKey] -= 1;
                    }
                    if (newKey && typeof next[newKey] === 'number') {
                        next[newKey] += 1;
                    }

                    return next;
                });
            }
        } catch (err) {
            console.error('Failed to update status', err);
        }
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'in review': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'resolved': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
            case 'completed': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    if (loading) return <div className="p-10 text-center">Loading issues...</div>;

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-blue-900 tracking-tight">Classroom Issues</h1>
                    <p className="text-blue-400 mt-2 font-medium">Academic Department Operational Reports</p>
                </div>
            </div>

            {/* Status Counters */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Pending', count: stats.pending, color: 'text-amber-600', bg: 'bg-amber-50' },
                    { label: 'In Review', count: stats.inReview, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Resolved', count: stats.resolved, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                    { label: 'Completed', count: stats.completed, color: 'text-emerald-600', bg: 'bg-emerald-50' }
                ].map((item) => (
                    <div key={item.label} className={`${item.bg} px-6 py-4 rounded-3xl border border-white shadow-sm flex flex-col`}>
                        <span className={`text-2xl font-black ${item.color}`}>{item.count}</span>
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{item.label}</span>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-blue-50 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-100">
                    <thead className="bg-blue-50/50">
                        <tr>
                            <th className="px-8 py-5 text-left text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Issue Name</th>
                            <th className="px-8 py-5 text-left text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Class</th>
                            <th className="px-8 py-5 text-left text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Leader</th>
                            <th className="px-8 py-5 text-left text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Reported Date</th>
                            <th className="px-8 py-5 text-left text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Status</th>
                            <th className="px-8 py-5 text-right text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-50">
                        {issues.map((issue) => (
                            <tr key={issue.cl_is_co_no} className="hover:bg-blue-50/30 transition-colors group">
                                <td className="px-8 py-6">
                                    <div className="text-sm font-bold text-blue-900">{issue.issue_name}</div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="text-xs font-bold text-gray-500">{issue.class_name}</div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="text-xs font-bold text-blue-600">{issue.leader_name}</div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="text-xs font-medium text-gray-400">
                                        {new Date(issue.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <select
                                        value={issue.status}
                                        onChange={(e) => handleStatusUpdate(issue.cl_is_co_no, e.target.value)}
                                        className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all cursor-pointer focus:ring-2 focus:ring-blue-500/20 outline-none ${getStatusColor(issue.status)}`}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="In Review">In Review</option>
                                        <option value="Resolved">Resolved</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <button
                                        onClick={() => navigate(`/class-issues/${issue.cl_is_co_no}`)}
                                        className="inline-flex items-center justify-center px-5 py-2 rounded-xl bg-blue-50 text-blue-600 text-xs font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all"
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {issues.length === 0 && (
                    <div className="p-20 text-center">
                        <h3 className="text-lg font-bold text-blue-900">No issues found</h3>
                        <p className="text-blue-300 mt-1">Excellent! No problems have been reported at this time.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClassIssuesList;
