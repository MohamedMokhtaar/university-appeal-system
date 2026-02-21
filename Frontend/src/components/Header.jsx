import React, { useState } from 'react';
import { User, Menu, Bell, LogOut, Shield, ChevronDown } from 'lucide-react';
import { logout, getUser } from '../utils/auth';
import { useNavigate, Link } from 'react-router-dom';

const Header = ({ onMenuClick, onNotifClick, unreadCount }) => {
    const user = getUser();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    const getProfilePath = () => {
        switch (user?.role_name) {
            case 'SuperAdmin': return '/admin/profile';
            case 'HeadOfExam': return '/hoe/profile';
            case 'Faculty': return '/faculty/profile';
            case 'Teacher': return '/teacher/profile';
            default: return '/';
        }
    };

    return (
        <header className="bg-white border-b border-gray-100 h-16 flex items-center justify-between px-6 shrink-0 z-20">
            <div className="flex items-center gap-4">
                <button onClick={onMenuClick} className="lg:hidden text-gray-500 hover:bg-gray-50 p-2 rounded-lg transition-colors">
                    <Menu size={20} />
                </button>
                <h2 className="text-gray-900 font-bold tracking-tight text-sm hidden md:block uppercase tracking-wider">
                    University Appeals & Complaint MS
                </h2>
            </div>

            <div className="flex items-center gap-2">
                {/* Notification Bell */}
                <button
                    onClick={onNotifClick}
                    className="relative text-gray-400 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-gray-50 mr-1 group"
                >
                    <Bell size={18} />
                    {unreadCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 border-2 border-white text-[8px] font-bold text-white group-hover:border-blue-50">
                            {unreadCount}
                        </span>
                    )}
                </button>

                {/* User Menu Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="flex items-center gap-3 px-3 py-1.5 hover:bg-gray-50 rounded-xl transition-all border border-transparent hover:border-gray-100"
                    >
                        <div className="text-right hidden sm:block">
                            <p className="text-xs font-bold text-gray-900 leading-none">{user?.display_name || user?.username}</p>
                            <p className="text-[10px] font-medium text-gray-400 capitalize mt-1">{user?.role_name}</p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                            <User size={16} />
                        </div>
                        <ChevronDown size={14} className={`text-gray-400 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isMenuOpen && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setIsMenuOpen(false)}></div>
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl py-2 z-20">
                                <button
                                    onClick={() => { navigate(getProfilePath()); setIsMenuOpen(false); }}
                                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                                >
                                    <User size={14} className="text-blue-600" />
                                    <span>Profile</span>
                                </button>
                                <div className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 cursor-not-allowed">
                                    <Shield size={14} />
                                    <span>Security</span>
                                </div>
                                <hr className="my-2 border-gray-50" />
                                <button
                                    onClick={logout}
                                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <LogOut size={14} />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;

