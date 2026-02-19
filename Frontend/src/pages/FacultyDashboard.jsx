import React from 'react';

const FacultyDashboard = () => {
    return (
        <div className="flex flex-col items-center justify-center py-12 space-y-8">
            <div className="text-center">
                <h1 className="text-4xl font-black text-blue-900 tracking-tight">Faculty Dean Hub</h1>
                <p className="text-blue-400 mt-2 font-bold uppercase tracking-[0.2em] text-[11px]">Department Operational Console</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                <div className="bg-white p-10 rounded-[2.5rem] border-2 border-blue-50 hover:border-blue-600 transition-all text-center shadow-sm">
                    <h3 className="text-xl font-bold text-blue-900">Class Issues</h3>
                    <p className="text-blue-300 text-xs mt-2 uppercase font-black">12 Pending</p>
                </div>
                <div className="bg-white p-10 rounded-[2.5rem] border-2 border-blue-50 hover:border-blue-600 transition-all text-center shadow-sm">
                    <h3 className="text-xl font-bold text-blue-900">Campus Environment</h3>
                    <p className="text-blue-300 text-xs mt-2 uppercase font-black">5 Pending</p>
                </div>
            </div>
        </div>
    );
};

export default FacultyDashboard;
