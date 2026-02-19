import React from 'react';

const AdminDashboard = () => {
    return (
        <div className="space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-blue-50 shadow-sm text-center">
                <h1 className="text-3xl font-black text-blue-900 tracking-tight">SuperAdmin Dashboard</h1>
                <p className="text-blue-400 mt-2 font-bold uppercase tracking-widest text-[10px]">Full System Access Granted</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-blue-50 shadow-sm h-32 flex items-center justify-center italic text-blue-200">
                        Admin Stat Card {i}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboard;
