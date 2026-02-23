import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    AlertCircle,
    ArrowRight,
    CalendarClock,
    CheckCircle2,
    Clock3,
    GraduationCap,
    Layers,
    UserCheck,
    Users
} from 'lucide-react';
import { getUser } from '../utils/auth';
import classIssueService from '../api/classIssueService';

const Dashboard = () => {
    const navigate = useNavigate();
    const roleName = getUser()?.role_name || '';

    const [loading, setLoading] = useState(true);
    const [metrics, setMetrics] = useState({
        totalStudents: 0,
        totalTeachers: 0,
        activeAppeals: 0,
        pendingAppeals: 0,
        activeAcademicYear: '2025/2026',
        totalClasses: 0
    });
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        const loadDashboardData = async () => {
            setLoading(true);
            try {
                const [studentsRes, classesRes, statsRes, issuesRes] = await Promise.allSettled([
                    classIssueService.getAllStudents(),
                    classIssueService.getClasses(),
                    classIssueService.getStats(),
                    classIssueService.getIssues()
                ]);

                const students = studentsRes.status === 'fulfilled' && studentsRes.value.success ? studentsRes.value.data : [];
                const classes = classesRes.status === 'fulfilled' && classesRes.value.success ? classesRes.value.data : [];
                const stats = statsRes.status === 'fulfilled' && statsRes.value.success ? statsRes.value.data : {};
                const issues = issuesRes.status === 'fulfilled' && issuesRes.value.success ? issuesRes.value.data : [];

                setMetrics({
                    totalStudents: students.length,
                    totalTeachers: 24,
                    activeAppeals: Number(stats.inReview || 0) + Number(stats.resolved || 0),
                    pendingAppeals: Number(stats.pending || 0),
                    activeAcademicYear: '2025/2026',
                    totalClasses: classes.length
                });

                const mappedActivities = issues.slice(0, 6).map((issue) => ({
                    id: issue.cl_is_co_no,
                    student: issue.leader_name || 'N/A',
                    type: issue.issue_name || 'Appeal',
                    status: issue.status || 'Pending',
                    date: issue.created_at
                        ? new Date(issue.created_at).toLocaleDateString()
                        : new Date().toLocaleDateString()
                }));
                setActivities(mappedActivities);
            } catch (error) {
                console.error('Dashboard load error:', error);
                setActivities([]);
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
    }, []);

    const summaryCards = useMemo(
        () => [
            { key: 'students', label: 'Total Students', value: metrics.totalStudents, icon: Users },
            { key: 'teachers', label: 'Total Teachers', value: metrics.totalTeachers, icon: UserCheck },
            { key: 'active', label: 'Active Appeals', value: metrics.activeAppeals, icon: CheckCircle2 },
            { key: 'pending', label: 'Pending Appeals', value: metrics.pendingAppeals, icon: Clock3 },
            { key: 'year', label: 'Active Academic Year', value: metrics.activeAcademicYear, icon: CalendarClock },
            { key: 'classes', label: 'Total Classes', value: metrics.totalClasses, icon: Layers }
        ],
        [metrics]
    );

    const quickActions = [
        { key: 'add-student', label: 'Add Student', path: '/student-management?tab=students' },
        { key: 'open-period', label: 'Open Appeal Period', path: '/exam-appeals?tab=allow-appeals' },
        { key: 'assign-teacher', label: 'Assign Teacher', path: '/academic-structure?tab=academics' },
        { key: 'view-reports', label: 'View Reports', path: '/exam-appeals?tab=tracking' }
    ];

    return (
        <div className="space-y-6">
            <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">System Overview</p>
                        <h1 className="mt-2 text-2xl font-semibold text-black">Welcome, {roleName || 'User'}</h1>
                        <p className="mt-1 text-sm text-gray-600">Modern administration dashboard for thesis and appeal operations.</p>
                    </div>
                    <div className="hidden h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white md:flex">
                        <GraduationCap size={22} />
                    </div>
                </div>
            </div>

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {summaryCards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <div
                            key={card.key}
                            className="group rounded-xl border border-gray-200 border-t-4 border-t-blue-600 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                    <Icon size={18} />
                                </div>
                                <ArrowRight size={16} className="text-gray-300 transition group-hover:text-blue-600" />
                            </div>
                            <p className="mt-4 text-2xl font-bold text-black">{loading ? '...' : card.value}</p>
                            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-gray-500">{card.label}</p>
                        </div>
                    );
                })}
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-black">Quick Actions</h2>
                <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
                    {quickActions.map((action) => (
                        <button
                            key={action.key}
                            type="button"
                            onClick={() => navigate(action.path)}
                            className="rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                        >
                            {action.label}
                        </button>
                    ))}
                </div>
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-black">Recent Appeals</h2>
                    <button
                        type="button"
                        onClick={() => navigate('/exam-appeals?tab=tracking')}
                        className="text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                        View all
                    </button>
                </div>

                <div className="mt-4 overflow-x-auto">
                    <table className="min-w-full border-collapse">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Student</th>
                                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Type</th>
                                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Status</th>
                                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {activities.length > 0 ? (
                                activities.map((row) => (
                                    <tr key={row.id} className="border-b border-gray-100 text-sm transition hover:bg-blue-50/50">
                                        <td className="px-3 py-3 font-medium text-black">{row.student}</td>
                                        <td className="px-3 py-3 text-gray-700">{row.type}</td>
                                        <td className="px-3 py-3">
                                            <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                                                {row.status}
                                            </span>
                                        </td>
                                        <td className="px-3 py-3 text-gray-600">{row.date}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-3 py-8 text-center text-sm text-gray-500">
                                        <div className="inline-flex items-center gap-2">
                                            <AlertCircle size={16} />
                                            <span>No recent activity found.</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};

export default Dashboard;
