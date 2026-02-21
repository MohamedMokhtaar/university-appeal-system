import React, { useState, useEffect } from 'react';
import classIssueService from '../api/classIssueService';

const ClassManagement = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedClass, setSelectedClass] = useState(null);
    const [classStudents, setClassStudents] = useState([]);
    const [allStudents, setAllStudents] = useState([]);
    const [loadingAllStudents, setLoadingAllStudents] = useState(false);
    const [pendingLeaders, setPendingLeaders] = useState({});
    const [migrationData, setMigrationData] = useState({ std_id: '', new_cls_no: '' });

    useEffect(() => {
        fetchClasses();
        fetchAllStudents();
    }, []);

    const fetchAllStudents = async () => {
        setLoadingAllStudents(true);
        try {
            const res = await classIssueService.getAllStudents();
            if (res.success) setAllStudents(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingAllStudents(false);
        }
    };

    const fetchClasses = async () => {
        try {
            const res = await classIssueService.getClasses();
            if (res.success) setClasses(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectClass = async (cls) => {
        setSelectedClass(cls);
        // Reset all forms on class switch
        setPendingLeaders({});
        setMigrationData({ std_id: '', new_cls_no: '' });
        try {
            const res = await classIssueService.getClassStudents(cls.cls_no);
            if (res.success) setClassStudents(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleChangeLeader = async () => {
        if (!selectedClass) return;
        const std_id = pendingLeaders[selectedClass.cls_no];
        if (!std_id) return;

        try {
            const res = await classIssueService.updateLeader(selectedClass.cls_no, std_id);
            if (res.success) {
                fetchClasses();
                // Clear pending leader ONLY for this class after success
                setPendingLeaders(prev => {
                    const next = { ...prev };
                    delete next[selectedClass.cls_no];
                    return next;
                });
            }
        } catch (err) {
            console.error('Failed to update leader', err);
        }
    };

    const handleMigrate = async (e) => {
        e.preventDefault();
        try {
            const res = await classIssueService.migrateStudent(migrationData.std_id, migrationData.new_cls_no);
            if (res.success) {
                // Clear form
                setMigrationData({ std_id: '', new_cls_no: '' });
                // If the migrated student was a pending leader for any class, it might be stale, 
                // but per user request, we only clear on SUCCESSFUL leader change. 
                // However, if they moved class, the pending leader dropdown for the OLD class 
                // should probably reset if it was that student. 
                setPendingLeaders(prev => {
                    if (!selectedClass) return prev;
                    const next = { ...prev };
                    delete next[selectedClass.cls_no];
                    return next;
                });

                // Refresh all data
                const updatedClassesRes = await classIssueService.getClasses();
                if (updatedClassesRes.success) {
                    setClasses(updatedClassesRes.data);

                    // If we have a selected class, refresh its data
                    if (selectedClass) {
                        // Find the updated class object in the new list to reflect leader changes
                        const updatedSelected = updatedClassesRes.data.find(c => c.cls_no === selectedClass.cls_no);
                        if (updatedSelected) {
                            setSelectedClass(updatedSelected);
                            // Refresh student roster for the selected class
                            const stdRes = await classIssueService.getClassStudents(updatedSelected.cls_no);
                            if (stdRes.success) setClassStudents(stdRes.data);
                        }
                    }
                }

                // Refresh global student list to ensure any cross-class logic stays in sync
                fetchAllStudents();
            }
        } catch (err) {
            console.error('Migration failed', err);
        }
    };

    if (loading) return <div className="p-10 text-center">Loading classes...</div>;

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight">Class Management</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Class List */}
                <div className="lg:col-span-1 space-y-4">
                    <h2 className="text-xl font-bold text-gray-800 px-1">All Classes</h2>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        {classes.map((cls) => (
                            <button
                                key={cls.cls_no}
                                onClick={() => handleSelectClass(cls)}
                                className={`w-full text-left p-5 transition-all duration-200 border-b border-gray-50 last:border-0 hover:bg-indigo-50/50 ${selectedClass?.cls_no === cls.cls_no ? 'bg-indigo-50 border-l-4 border-l-indigo-600' : ''}`}
                            >
                                <div className="font-semibold text-gray-900">{cls.cl_name}</div>
                                <div className="text-sm text-gray-500 mt-1 flex items-center">
                                    <span className="w-2 h-2 rounded-full bg-indigo-500 mr-2"></span>
                                    Leader: {cls.leader_name || 'Not assigned'}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Details & Actions */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Global Section: Migrate Student (Always visible or visible when NOTHING selected?) */}
                    {/* User says: Available BEFORE selecting any class. Click should NOT show migration. */}
                    {!selectedClass ? (
                        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 animate-in fade-in zoom-in duration-300">
                            <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                                <div className="p-2 bg-indigo-50 rounded-lg">
                                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                    </svg>
                                </div>
                                Move Student to Another Class
                            </h3>
                            <form onSubmit={handleMigrate} className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Student to Move</label>
                                        <select
                                            required
                                            value={migrationData.std_id}
                                            onChange={(e) => setMigrationData({ ...migrationData, std_id: e.target.value })}
                                            className="block w-full bg-gray-50 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-gray-900"
                                        >
                                            <option value="">Select Student</option>
                                            {loadingAllStudents ? (
                                                <option disabled>Loading students...</option>
                                            ) : allStudents.length === 0 ? (
                                                <option disabled>No students found</option>
                                            ) : (
                                                allStudents.map(s => (
                                                    <option key={s.std_id} value={s.std_id}>
                                                        {s.name} ({s.student_id})
                                                    </option>
                                                ))
                                            )}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Destination Class</label>
                                        <select
                                            required
                                            value={migrationData.new_cls_no}
                                            onChange={(e) => setMigrationData({ ...migrationData, new_cls_no: e.target.value })}
                                            className="block w-full bg-gray-50 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-gray-900"
                                        >
                                            <option value="">Select Target Class</option>
                                            {classes
                                                .filter(c => {
                                                    const selectedStudent = allStudents.find(s => s.std_id == migrationData.std_id);
                                                    return !selectedStudent || c.cls_no != selectedStudent.cls_no;
                                                })
                                                .map(c => (
                                                    <option key={c.cls_no} value={c.cls_no}>{c.cl_name}</option>
                                                ))}
                                        </select>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={!migrationData.std_id || !migrationData.new_cls_no}
                                    className={`w-full font-bold py-4 px-6 rounded-xl shadow-lg transition-all active:scale-[0.98] ${!migrationData.std_id || !migrationData.new_cls_no
                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
                                        }`}
                                >
                                    Migrate Student
                                </button>
                            </form>
                        </div>
                    ) : (
                        /* Class Specific View: ONLY Leader Management & Roster */
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 backdrop-blur-sm">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedClass(null);
                                                    setPendingLeaders({});
                                                    setMigrationData({ std_id: '', new_cls_no: '' });
                                                }}
                                                className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
                                                title="Back to Migration"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                                </svg>
                                            </button>
                                            <h2 className="text-2xl font-black text-gray-900">{selectedClass.cl_name}</h2>
                                        </div>
                                        <p className="text-gray-500 mt-1 ml-11">Manage class details and students</p>
                                    </div>
                                    <div className="bg-indigo-600/10 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-bold">
                                        Active Section
                                    </div>
                                </div>

                                <div className="mb-8">
                                    <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">Change Class Leader</label>
                                    <div className="flex flex-col gap-3">
                                        <select
                                            value={pendingLeaders[selectedClass.cls_no] || ""}
                                            onChange={(e) => setPendingLeaders(prev => ({ ...prev, [selectedClass.cls_no]: e.target.value }))}
                                            className="block w-full bg-gray-50 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-gray-900"
                                        >
                                            <option value="" disabled>Select a student to be leader</option>
                                            {classStudents.map(s => (
                                                <option key={s.std_id} value={s.std_id}>{s.name} ({s.student_id})</option>
                                            ))}
                                        </select>
                                        <button
                                            onClick={handleChangeLeader}
                                            disabled={!pendingLeaders[selectedClass.cls_no]}
                                            className={`w-full py-3 px-6 rounded-xl font-bold transition-all active:scale-[0.98] ${!pendingLeaders[selectedClass.cls_no]
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-100'
                                                }`}
                                        >
                                            Change Leader
                                        </button>
                                    </div>
                                </div>

                                <h3 className="text-lg font-bold text-gray-900 mb-4">Student Roster</h3>
                                <div className="overflow-hidden border border-gray-100 rounded-2xl">
                                    <table className="min-w-full divide-y divide-gray-100">
                                        <thead className="bg-gray-50/50">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Student Name</th>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">ID Code</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-50">
                                            {classStudents.map((s) => (
                                                <tr key={s.std_id} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{s.name}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md font-mono text-xs">{s.student_id}</span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClassManagement;
