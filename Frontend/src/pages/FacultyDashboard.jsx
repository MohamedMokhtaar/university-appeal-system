import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ShieldCheck, BookOpen } from 'lucide-react';

const FacultyDashboard = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center py-12 px-6">
            <div className="w-full max-w-5xl flex justify-center items-center mb-16">
                <div className="text-center">
                    <h1 className="text-4xl font-black text-blue-900 tracking-tight">Faculty Hub</h1>
                    <p className="text-blue-400 mt-2 font-bold uppercase tracking-[0.2em] text-[11px]">Academic & Campus Operations</p>
                </div>
            </div>

            {/* Module Navigation */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
                <div
                    onClick={() => navigate('/faculty/issues')}
                    className="cursor-pointer bg-white p-10 rounded-[2.5rem] border-2 border-blue-50 hover:border-blue-600 hover:shadow-2xl hover:shadow-blue-200 transition-all text-center shadow-sm group"
                >
                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-600 transition-colors">
                        <AlertCircle className="w-8 h-8 text-blue-600 group-hover:text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-blue-900">Class Issues</h3>
                    <p className="text-blue-300 text-xs mt-2 uppercase font-black">Manage Reports</p>
                </div>

                <div
                    onClick={() => navigate('/faculty/campus')}
                    className="cursor-pointer bg-white p-10 rounded-[2.5rem] border-2 border-blue-50 hover:border-blue-600 hover:shadow-2xl hover:shadow-blue-200 transition-all text-center shadow-sm group"
                >
                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-600 transition-colors">
                        <ShieldCheck className="w-8 h-8 text-blue-600 group-hover:text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-blue-900">Campus Environment</h3>
                    <p className="text-blue-300 text-xs mt-2 uppercase font-black">Facilities & Safety</p>
                </div>

                <div
                    onClick={() => navigate('/faculty/coursework')}
                    className="cursor-pointer bg-white p-10 rounded-[2.5rem] border-2 border-blue-50 hover:border-blue-600 hover:shadow-2xl hover:shadow-blue-200 transition-all text-center shadow-sm group"
                >
                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-600 transition-colors">
                        <BookOpen className="w-8 h-8 text-blue-600 group-hover:text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-blue-900">Coursework Appeals</h3>
                    <p className="text-blue-300 text-xs mt-2 uppercase font-black">Academic Disputes</p>
                </div>
            </div>
        </div>
    );
};

export default FacultyDashboard;
