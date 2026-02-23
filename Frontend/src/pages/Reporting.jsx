import React, { useEffect, useState } from 'react';
import classIssueService from '../api/classIssueService';

const Reporting = () => {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRows = async () => {
            try {
                const res = await classIssueService.getIssues();
                if (res.success) {
                    setRows(res.data || []);
                }
            } catch (error) {
                console.error('Reporting load error:', error);
                setRows([]);
            } finally {
                setLoading(false);
            }
        };

        fetchRows();
    }, []);

    return (
        <div className="space-y-5">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h1 className="text-2xl font-semibold text-black">Reporting</h1>
                <p className="mt-1 text-sm text-gray-600">System-wide reporting for appeals and issue activity.</p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Appeal / Issue</th>
                                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Student</th>
                                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Status</th>
                                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="px-3 py-8 text-center text-sm text-gray-500">
                                        Loading report data...
                                    </td>
                                </tr>
                            ) : rows.length > 0 ? (
                                rows.map((row) => (
                                    <tr key={row.cl_is_co_no} className="border-b border-gray-100 text-sm transition hover:bg-blue-50/50">
                                        <td className="px-3 py-3 font-medium text-black">{row.issue_name || 'Appeal'}</td>
                                        <td className="px-3 py-3 text-gray-700">{row.leader_name || 'N/A'}</td>
                                        <td className="px-3 py-3">
                                            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                                                {row.status || 'Pending'}
                                            </span>
                                        </td>
                                        <td className="px-3 py-3 text-gray-700">
                                            {row.created_at ? new Date(row.created_at).toLocaleDateString() : '-'}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-3 py-8 text-center text-sm text-gray-500">
                                        No report data found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Reporting;
