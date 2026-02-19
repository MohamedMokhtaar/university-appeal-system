import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ArrowLeft, Shield, BadgeCheck, Activity, Phone, Mail, CreditCard, Loader2 } from 'lucide-react';
import { getUser } from '../utils/auth';
import client from '../api/client';

const Profile = () => {
    const navigate = useNavigate();
    const user = getUser();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const isTeacher = user?.role_name === 'Teacher';

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await client.get('/profile/me', {
                    headers: { 'X-USER-ID': user?.user_id }
                });
                if (res.data.success) {
                    setProfile(res.data.profile);
                }
            } catch (err) {
                console.error('Failed to fetch profile:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const accountDetails = [
        { label: "Username", value: user?.username, icon: User },
        { label: "Role", value: user?.role_name, icon: Shield },
        { label: "Access Channel", value: user?.Accees_channel || 'Web Portal', icon: BadgeCheck },
        { label: "Status", value: user?.status || 'Active', icon: Activity },
    ];

    const teacherDetails = profile?.teacher_details ? [
        { label: "Full Name", value: profile.teacher_details.name, icon: User },
        { label: "Phone", value: profile.teacher_details.tell || '—', icon: Phone },
        { label: "Email", value: profile.teacher_details.email || '—', icon: Mail },
        { label: "Teacher ID", value: profile.teacher_details.teacher_id, icon: CreditCard },
    ] : [];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">User Profile</h1>
                    <p className="text-sm text-gray-500">View your account information</p>
                </div>
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
                >
                    <ArrowLeft size={16} />
                    <span>Back</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Avatar Card */}
                <div className="lg:col-span-1 bg-white border border-gray-100 rounded-2xl shadow-sm p-8 flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-4 border-4 border-white shadow-lg">
                        <User size={48} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">
                        {profile?.full_name || user?.display_name || user?.username}
                    </h2>
                    <p className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full mt-2 inline-block">
                        {user?.role_name}
                    </p>
                    <div className="w-full mt-8 pt-8 border-t border-gray-50 space-y-4">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">Account status</span>
                            <span className="flex items-center gap-1 text-green-600 font-bold uppercase text-[10px]">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                {user?.status || 'Active'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right column */}
                <div className="lg:col-span-2 flex flex-col lg:flex-row gap-6">

                    {/* Teacher Details — only shown for Teacher role, shown FIRST */}
                    {isTeacher && (
                        <div className="flex-1 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-50 bg-blue-50/30">
                                <h3 className="text-sm font-bold text-blue-800 uppercase tracking-wider">Teacher Information</h3>
                            </div>
                            {loading ? (
                                <div className="flex items-center justify-center py-10 text-gray-400 gap-2">
                                    <Loader2 size={18} className="animate-spin" />
                                    <span className="text-sm">Loading...</span>
                                </div>
                            ) : teacherDetails.length > 0 ? (
                                <div className="divide-y divide-gray-50">
                                    {teacherDetails.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-4 px-6 py-4 group hover:bg-gray-50/50 transition-colors">
                                            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                                                <item.icon size={18} />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.label}</p>
                                                <p className="text-sm font-semibold text-gray-900 mt-0.5">{item.value}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="px-6 py-8 text-center text-sm text-gray-400">
                                    No teacher record found.
                                </div>
                            )}
                        </div>
                    )}

                    {/* Account Details */}
                    <div className="flex-1 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/30">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Account Details</h3>
                        </div>
                        <div className="divide-y divide-gray-50">
                            {accountDetails.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-4 px-6 py-4 group hover:bg-gray-50/50 transition-colors">
                                    <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                        <item.icon size={18} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.label}</p>
                                        <p className="text-sm font-semibold text-gray-900 mt-0.5">{item.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Profile;
