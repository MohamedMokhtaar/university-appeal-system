import React from 'react';
import { CalendarClock, FileSearch, GraduationCap, LineChart } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import TabbedPageShell from '../components/TabbedPageShell';
import { getUser } from '../utils/auth';

const tabs = [
    { key: 'allow-appeals', label: 'Allow Appeals' },
    { key: 'coursework-appeal', label: 'Course Work Appeal' },
    { key: 'exam-paper-appeals', label: 'Exam Paper Appeals' },
    { key: 'tracking', label: 'Tracking' }
];

const aliasTabMap = {
    'period-setup': 'allow-appeals',
    coursework: 'coursework-appeal',
    'final-exam': 'exam-paper-appeals',
    reports: 'tracking',
    assignments: 'coursework-appeal'
};

const tabContent = {
    'allow-appeals': {
        icon: CalendarClock,
        title: 'Allow Appeals',
        description: 'Configure and publish opening or closing windows for student appeals.'
    },
    'coursework-appeal': {
        icon: GraduationCap,
        title: 'Course Work Appeal',
        description: 'Track and process coursework-related appeals raised by students.'
    },
    'exam-paper-appeals': {
        icon: FileSearch,
        title: 'Exam Paper Appeals',
        description: 'Handle exam paper review requests and final grading disputes.'
    },
    tracking: {
        icon: LineChart,
        title: 'Tracking',
        description: 'Monitor statuses, completion rates, and trends across appeal modules.'
    }
};

const sampleRows = [
    { id: 'APL-201', student: 'Alice Johnson', type: 'Coursework', status: 'Pending', date: '2026-02-20' },
    { id: 'APL-202', student: 'Brian Samuel', type: 'Final Exam', status: 'In Review', date: '2026-02-21' },
    { id: 'APL-203', student: 'Diana James', type: 'Coursework', status: 'Resolved', date: '2026-02-21' }
];

const ExamAppeals = () => {
    const roleName = getUser()?.role_name || '';
    const isFacultyOrTeacher = roleName === 'Faculty' || roleName === 'Teacher';
    const [searchParams, setSearchParams] = useSearchParams();
    const visibleTabs = isFacultyOrTeacher
        ? tabs.filter((tab) => tab.key === 'coursework-appeal')
        : tabs;

    const rawTab = searchParams.get('tab') || (isFacultyOrTeacher ? 'coursework-appeal' : 'allow-appeals');
    const normalizedTab = aliasTabMap[rawTab] || rawTab;
    const activeTab = visibleTabs.some((tab) => tab.key === normalizedTab)
        ? normalizedTab
        : (isFacultyOrTeacher ? 'coursework-appeal' : 'allow-appeals');
    const currentSection = tabContent[activeTab];
    const Icon = currentSection.icon;

    const onTabChange = (tab) => {
        const next = new URLSearchParams(searchParams);
        next.set('tab', tab);
        setSearchParams(next);
    };

    return (
        <TabbedPageShell
            title="Exam Appeals"
            description="Review appeal periods, coursework disputes, final exam appeals, and reporting."
            tabs={visibleTabs}
            activeTab={activeTab}
            onTabChange={onTabChange}
        >
            <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <Icon size={18} />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-black">{currentSection.title}</h2>
                    <p className="text-sm text-gray-600">{currentSection.description}</p>
                </div>
            </div>

            <div className="mt-5 overflow-x-auto">
                <table className="min-w-full">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Appeal ID</th>
                            <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Student</th>
                            <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Type</th>
                            <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Status</th>
                            <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sampleRows.map((row) => (
                            <tr key={row.id} className="border-b border-gray-100 text-sm transition hover:bg-blue-50/50">
                                <td className="px-3 py-3 font-medium text-black">{row.id}</td>
                                <td className="px-3 py-3 text-gray-700">{row.student}</td>
                                <td className="px-3 py-3 text-gray-700">{row.type}</td>
                                <td className="px-3 py-3">
                                    <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">{row.status}</span>
                                </td>
                                <td className="px-3 py-3 text-gray-700">{row.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </TabbedPageShell>
    );
};

export default ExamAppeals;
