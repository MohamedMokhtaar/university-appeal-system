import React from 'react';
import {
    LayoutDashboard,
    Users,
    UserSquare2,
    FileText,
    AlertCircle,
    MessageSquare,
    Settings,
    LogOut,
    ShieldCheck,
    CalendarClock,
    Zap,
    BookOpen,
    FileBarChart,
    ChevronRight
} from 'lucide-react';
import { logout, getUser } from '../utils/auth';
import { useLocation, useNavigate } from 'react-router-dom';

const SidebarItem = ({ icon: Icon, label, active = false, onClick }) => (
    <div
        onClick={onClick}
        className={`
        flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 group
        ${active
                ? 'bg-blue-50 text-blue-700 font-semibold'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
    `}>
        <div className="flex items-center gap-3">
            <Icon size={18} className={active ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'} />
            <span className="text-sm">{label}</span>
        </div>
        {active && <ChevronRight size={14} className="text-blue-400" />}
    </div>
);

const Sidebar = ({ isOpen, onClose }) => {
    const user = getUser();
    const roleName = user?.role_name || '';
    const location = useLocation();
    const navigate = useNavigate();

    const isSuperAdmin = roleName === 'SuperAdmin';
    const isHeadOfExam = roleName === 'HeadOfExam';
    const isFaculty = roleName === 'Faculty';
    const isTeacher = roleName === 'Teacher';

    const menuItems = [
        { icon: LayoutDashboard, label: "Dashboard", role: true, path: getRedirectPath(roleName) },
        { icon: Users, label: "Class & Students", role: isFaculty, path: '/faculty/classes' },
        { icon: Users, label: "Manage Students", role: isSuperAdmin },
        { icon: UserSquare2, label: "Manage Teachers", role: isSuperAdmin },
        { icon: FileText, label: "Exams Management", role: isSuperAdmin || isHeadOfExam },
        { icon: CalendarClock, label: "Appeal Deadlines", role: isSuperAdmin || isHeadOfExam },
        { icon: Zap, label: "Activate Period", role: isSuperAdmin || isHeadOfExam },
        { icon: AlertCircle, label: "Class Issues", role: isSuperAdmin || isFaculty, path: isFaculty ? '/faculty/issues' : null },
        { icon: ShieldCheck, label: "Campus Environment", role: isSuperAdmin || isFaculty, path: isFaculty ? '/faculty/campus' : null },
        { icon: BookOpen, label: "Coursework Appeals", role: isSuperAdmin || isFaculty || isTeacher, path: isFaculty ? '/faculty/coursework' : isTeacher ? '/teacher/appeals' : null },
        { icon: MessageSquare, label: "Support Messages", role: isSuperAdmin },
        { icon: FileBarChart, label: "Reports", role: isSuperAdmin || isHeadOfExam || isFaculty || isTeacher },
        { icon: Settings, label: "Settings", role: isSuperAdmin || isHeadOfExam || isFaculty },
    ];

    function getRedirectPath(role) {
        switch (role) {
            case 'SuperAdmin': return '/admin';
            case 'HeadOfExam': return '/hoe';
            case 'Faculty': return '/faculty';
            case 'Teacher': return '/teacher';
            default: return '/';
        }
    }

    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm z-30 lg:hidden" onClick={onClose} />
            )}

            <aside className={`
                fixed lg:static inset-y-0 left-0 w-64 bg-white border-r border-gray-100 z-40
                transition-transform duration-300 ease-in-out py-6 px-4 flex flex-col
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="flex items-center gap-3 px-2 mb-3 overflow-hidden">
                    <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white shrink-0">
                        <ShieldCheck size={20} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-bold text-blue-800 tracking-tight leading-none">THESIS</span>
                        <span className="text-[9px] text-gray-400 font-medium uppercase tracking-widest mt-0.5">Management v1.0</span>
                    </div>
                </div>

                <hr className="border-gray-100 mb-4 mx-2" />

                <nav className="space-y-1 flex-1 overflow-y-auto pr-1 custom-scrollbar">
                    {menuItems.filter(item => item.role).map((item, idx) => (
                        <SidebarItem
                            key={idx}
                            icon={item.icon}
                            label={item.label}
                            active={location.pathname === item.path || (item.label === 'Dashboard' && location.pathname.endsWith(item.path))}
                            onClick={() => item.path && navigate(item.path)}
                        />
                    ))}
                </nav>

                <div className="mt-auto pt-4">
                    <hr className="border-gray-100 mb-2 mx-2" />
                    <div onClick={logout} className="flex items-center gap-3 px-4 py-2.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-all group">
                        <LogOut size={18} className="text-gray-400 group-hover:text-red-500" />
                        <span className="text-sm font-medium">Logout</span>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;

