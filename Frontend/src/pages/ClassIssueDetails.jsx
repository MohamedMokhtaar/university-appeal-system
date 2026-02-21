import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import classIssueService from '../api/classIssueService';

const ClassIssueDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [note, setNote] = useState('');
    const [newStatus, setNewStatus] = useState('');

    // Fetch faculty user id from local storage (mock for now or get from auth context if available)
    const user_id = JSON.parse(localStorage.getItem('user'))?.user_id || 1;

    useEffect(() => {
        fetchDetails();
    }, [id]);

    const fetchDetails = async () => {
        try {
            const res = await classIssueService.getIssueDetails(id);
            if (res.success) {
                setData(res.data);
                setNewStatus(res.data.issue.current_status);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (e) => {
        e.preventDefault();
        setUpdating(true);
        try {
            const res = await classIssueService.updateIssueStatus(id, {
                new_status: newStatus,
                note,
                user_id
            });
            if (res.success) {
                setNote('');
                fetchDetails();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setUpdating(false);
        }
    };

    const getStatusStep = (status) => {
        const steps = ['Pending', 'In Review', 'Resolved', 'Completed'];
        return steps.indexOf(status);
    };

    if (loading) return <div className="p-10 text-center">Loading details...</div>;
    if (!data) return <div className="p-10 text-center">Issue not found</div>;

    const { issue, history } = data;
    const currentStep = getStatusStep(issue.current_status);

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <button
                onClick={() => navigate('/faculty/issues')}
                className="group flex items-center text-sm font-bold text-gray-500 hover:text-indigo-600 mb-8 transition-colors"
            >
                <svg className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                </svg>
                Back to List
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
                        <div className="flex justify-between items-start mb-6">
                            <h1 className="text-3xl font-black text-gray-900 leading-tight">{issue.issue_name}</h1>
                            <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border ${issue.current_status === 'Pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                issue.current_status === 'In Review' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                    issue.current_status === 'Resolved' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                                        'bg-emerald-50 text-emerald-600 border-emerald-100'
                                }`}>
                                {issue.current_status}
                            </span>
                        </div>

                        <div className="flex gap-4 mb-8">
                            <div className="bg-gray-50 px-4 py-3 rounded-2xl flex-1">
                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Class</div>
                                <div className="text-gray-900 font-bold">{issue.class_name}</div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 rounded-2xl flex-1">
                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Reported By</div>
                                <div className="text-gray-900 font-bold">{issue.leader_name}</div>
                            </div>
                        </div>

                        <div className="prose prose-indigo max-w-none">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Description</h3>
                            <p className="text-gray-600 leading-relaxed bg-indigo-50/30 p-4 rounded-2xl italic">"{issue.description}"</p>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
                        <h3 className="text-xl font-black text-gray-900 mb-6">Resolution History</h3>
                        <div className="space-y-6 relative before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100">
                            {history.length > 0 ? history.map((h, idx) => (
                                <div key={h.cit_no} className="relative pl-10 animate-in fade-in slide-in-from-left-4 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                                    <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center ${idx === history.length - 1 ? 'bg-indigo-600 ring-4 ring-indigo-100' : 'bg-gray-300'}`}>
                                        {idx === history.length - 1 && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                                    </div>
                                    <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-50">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="text-sm font-bold text-gray-900">Status changed to <span className="text-indigo-600">"{h.new_status}"</span></span>
                                            <span className="text-[10px] font-bold text-gray-400 uppercase">{new Date(h.changed_date).toLocaleString()}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-2">{h.note || 'No additional notes provided.'}</p>
                                        <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-tighter">Updated by {h.changed_by_name}</div>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-4 text-gray-400 italic text-sm">No history recorded yet.</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar Actions */}
                <div className="space-y-8">
                    <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 rounded-3xl shadow-2xl shadow-indigo-200 text-white">
                        <h3 className="text-xl font-black mb-6">Update Status</h3>
                        <form onSubmit={handleUpdateStatus} className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-bold text-indigo-200 uppercase tracking-widest mb-2">New Status</label>
                                <div className="space-y-2">
                                    {['Pending', 'In Review', 'Resolved', 'Completed'].map((step, idx) => (
                                        <button
                                            key={step}
                                            type="button"
                                            onClick={() => setNewStatus(step)}
                                            className={`w-full text-left px-5 py-3 rounded-xl text-sm font-bold transition-all border-2 ${newStatus === step
                                                ? 'bg-white text-indigo-800 border-white shadow-lg'
                                                : 'bg-indigo-700/50 text-indigo-100 border-transparent hover:bg-indigo-700'
                                                } ${idx > currentStep + 1 ? 'opacity-50 cursor-not-allowed hidden' : ''}`}
                                        >
                                            <div className="flex items-center justify-between">
                                                {step}
                                                {newStatus === step && (
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                                    </svg>
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-indigo-200 uppercase tracking-widest mb-2">Add Note</label>
                                <textarea
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    placeholder="Enter status update details..."
                                    className="w-full bg-indigo-500/30 border-2 border-indigo-400/30 rounded-2xl px-4 py-3 text-sm font-medium placeholder-indigo-300 focus:outline-none focus:border-white transition-all resize-none h-32"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={updating || newStatus === issue.current_status}
                                className="w-full bg-white text-indigo-600 font-black py-4 rounded-2xl shadow-xl shadow-indigo-900/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-50"
                            >
                                {updating ? 'Updating...' : 'Confirm Update'}
                            </button>
                        </form>
                    </div>

                    <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="bg-emerald-100 p-2 rounded-xl">
                                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <h4 className="text-emerald-900 font-black text-sm">Action Tip</h4>
                        </div>
                        <p className="text-xs text-emerald-700 leading-relaxed font-medium">Updating the status will send an immediate notification to the reporting class leader.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClassIssueDetails;
