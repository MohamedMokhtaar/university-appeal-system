import React, { useEffect, useMemo, useState } from 'react';
import { School, Users } from 'lucide-react';
import Swal from 'sweetalert2';
import { useSearchParams } from 'react-router-dom';
import studentManagementService from '../api/studentManagementService';
import TabbedPageShell from '../components/TabbedPageShell';

const tabs = [
    { key: 'schools', label: 'Schools' },
    { key: 'parents', label: 'Parents' },
    { key: 'students', label: 'Students' }
];

const compactSwal = {
    width: 340,
    padding: '0.9rem',
    confirmButtonColor: '#1E5EFF',
    cancelButtonColor: '#9CA3AF',
    buttonsStyling: true
};

const StudentManagement = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const rawTab = searchParams.get('tab') || 'schools';
    const activeTab = tabs.some((tab) => tab.key === rawTab) ? rawTab : 'schools';

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [schools, setSchools] = useState([]);
    const [schoolForm, setSchoolForm] = useState({ name: '', addres: '' });
    const [editingSchoolId, setEditingSchoolId] = useState(null);

    const [parents, setParents] = useState([]);
    const [parentForm, setParentForm] = useState({ name: '', tell1: '', tell2: '' });
    const [editingParentId, setEditingParentId] = useState(null);

    const onTabChange = (tab) => {
        const next = new URLSearchParams(searchParams);
        next.set('tab', tab);
        setSearchParams(next);
    };

    const clearMessages = () => {
        setErrorMessage('');
        setSuccessMessage('');
    };

    const extractError = (error, fallback) =>
        error?.response?.data?.message ||
        (error?.response?.data?.errors ? Object.values(error.response.data.errors).flat().join(' ') : fallback);

    const loadSchools = async () => {
        setLoading(true);
        clearMessages();
        try {
            const res = await studentManagementService.listSchools();
            if (res.success) {
                setSchools(res.data || []);
            }
        } catch (error) {
            setErrorMessage(extractError(error, 'Failed to load schools.'));
        } finally {
            setLoading(false);
        }
    };

    const loadParents = async () => {
        setLoading(true);
        clearMessages();
        try {
            const res = await studentManagementService.listParents();
            if (res.success) {
                setParents(res.data || []);
            }
        } catch (error) {
            setErrorMessage(extractError(error, 'Failed to load parents.'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'schools') {
            loadSchools();
        } else if (activeTab === 'parents') {
            loadParents();
        } else {
            clearMessages();
        }
    }, [activeTab]);

    const onSubmitSchool = async (e) => {
        e.preventDefault();
        setLoading(true);
        clearMessages();
        try {
            if (editingSchoolId) {
                await studentManagementService.updateSchool(editingSchoolId, schoolForm);
                setSuccessMessage('School updated successfully.');
            } else {
                await studentManagementService.createSchool(schoolForm);
                setSuccessMessage('School created successfully.');
            }

            setSchoolForm({ name: '', addres: '' });
            setEditingSchoolId(null);
            await loadSchools();
        } catch (error) {
            setErrorMessage(extractError(error, 'Failed to save school.'));
        } finally {
            setLoading(false);
        }
    };

    const onEditSchool = (school) => {
        clearMessages();
        setEditingSchoolId(school.sch_no);
        setSchoolForm({ name: school.name || '', addres: school.addres || '' });
    };

    const onDeleteSchool = async (school) => {
        const result = await Swal.fire({
            ...compactSwal,
            title: 'Delete School?',
            text: `Are you sure you want to delete "${school.name}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            cancelButtonText: 'Keep'
        });
        if (!result.isConfirmed) return;

        setLoading(true);
        clearMessages();
        try {
            await studentManagementService.deleteSchool(school.sch_no);
            if (editingSchoolId === school.sch_no) {
                setEditingSchoolId(null);
                setSchoolForm({ name: '', addres: '' });
            }
            setSuccessMessage('School deleted successfully.');
            await Swal.fire({
                ...compactSwal,
                title: 'Deleted',
                text: 'School deleted successfully.',
                icon: 'success',
                confirmButtonText: 'OK'
            });
            await loadSchools();
        } catch (error) {
            setErrorMessage(extractError(error, 'Failed to delete school.'));
            await Swal.fire({
                ...compactSwal,
                title: 'Delete Failed',
                text: extractError(error, 'Failed to delete school.'),
                icon: 'error',
                confirmButtonText: 'OK'
            });
        } finally {
            setLoading(false);
        }
    };

    const onSubmitParent = async (e) => {
        e.preventDefault();
        setLoading(true);
        clearMessages();
        try {
            if (editingParentId) {
                await studentManagementService.updateParent(editingParentId, parentForm);
                setSuccessMessage('Parent updated successfully.');
            } else {
                await studentManagementService.createParent(parentForm);
                setSuccessMessage('Parent created successfully.');
            }

            setParentForm({ name: '', tell1: '', tell2: '' });
            setEditingParentId(null);
            await loadParents();
        } catch (error) {
            setErrorMessage(extractError(error, 'Failed to save parent.'));
        } finally {
            setLoading(false);
        }
    };

    const onEditParent = (parent) => {
        clearMessages();
        setEditingParentId(parent.parent_no);
        setParentForm({
            name: parent.name || '',
            tell1: parent.tell1 || '',
            tell2: parent.tell2 || ''
        });
    };

    const onDeleteParent = async (parent) => {
        const result = await Swal.fire({
            ...compactSwal,
            title: 'Delete Parent?',
            text: `Are you sure you want to delete "${parent.name}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            cancelButtonText: 'Keep'
        });
        if (!result.isConfirmed) return;

        setLoading(true);
        clearMessages();
        try {
            await studentManagementService.deleteParent(parent.parent_no);
            if (editingParentId === parent.parent_no) {
                setEditingParentId(null);
                setParentForm({ name: '', tell1: '', tell2: '' });
            }
            setSuccessMessage('Parent deleted successfully.');
            await Swal.fire({
                ...compactSwal,
                title: 'Deleted',
                text: 'Parent deleted successfully.',
                icon: 'success',
                confirmButtonText: 'OK'
            });
            await loadParents();
        } catch (error) {
            setErrorMessage(extractError(error, 'Failed to delete parent.'));
            await Swal.fire({
                ...compactSwal,
                title: 'Delete Failed',
                text: extractError(error, 'Failed to delete parent.'),
                icon: 'error',
                confirmButtonText: 'OK'
            });
        } finally {
            setLoading(false);
        }
    };

    const content = useMemo(() => {
        if (activeTab === 'schools') {
            return (
                <div className="space-y-5">
                    <form onSubmit={onSubmitSchool} className="grid grid-cols-1 gap-3 rounded-xl border border-gray-200 p-4 md:grid-cols-3">
                        <input
                            type="text"
                            value={schoolForm.name}
                            onChange={(e) => setSchoolForm((prev) => ({ ...prev, name: e.target.value }))}
                            placeholder="School name"
                            className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                            required
                        />
                        <input
                            type="text"
                            value={schoolForm.addres}
                            onChange={(e) => setSchoolForm((prev) => ({ ...prev, addres: e.target.value }))}
                            placeholder="Address"
                            className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                        />
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                            >
                                {editingSchoolId ? 'Update' : 'Create'}
                            </button>
                            {editingSchoolId && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingSchoolId(null);
                                        setSchoolForm({ name: '', addres: '' });
                                        clearMessages();
                                    }}
                                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>

                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Name</th>
                                    <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Address</th>
                                    <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {schools.map((school) => (
                                    <tr key={school.sch_no} className="border-b border-gray-100 text-sm hover:bg-blue-50/50">
                                        <td className="px-3 py-3 font-medium text-black">{school.name}</td>
                                        <td className="px-3 py-3 text-gray-700">{school.addres || '-'}</td>
                                        <td className="px-3 py-3">
                                            <div className="flex gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => onEditSchool(school)}
                                                    className="rounded-md border border-blue-200 px-2.5 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-50"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => onDeleteSchool(school)}
                                                    className="rounded-md border border-red-200 px-2.5 py-1 text-xs font-semibold text-red-700 hover:bg-red-50"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {!loading && schools.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="px-3 py-8 text-center text-sm text-gray-500">
                                            No schools found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            );
        }

        if (activeTab === 'parents') {
            return (
                <div className="space-y-5">
                    <form onSubmit={onSubmitParent} className="grid grid-cols-1 gap-3 rounded-xl border border-gray-200 p-4 md:grid-cols-4">
                        <input
                            type="text"
                            value={parentForm.name}
                            onChange={(e) => setParentForm((prev) => ({ ...prev, name: e.target.value }))}
                            placeholder="Parent name"
                            className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                            required
                        />
                        <input
                            type="text"
                            value={parentForm.tell1}
                            onChange={(e) => setParentForm((prev) => ({ ...prev, tell1: e.target.value }))}
                            placeholder="Phone 1"
                            className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                        />
                        <input
                            type="text"
                            value={parentForm.tell2}
                            onChange={(e) => setParentForm((prev) => ({ ...prev, tell2: e.target.value }))}
                            placeholder="Phone 2"
                            className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                        />
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                            >
                                {editingParentId ? 'Update' : 'Create'}
                            </button>
                            {editingParentId && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingParentId(null);
                                        setParentForm({ name: '', tell1: '', tell2: '' });
                                        clearMessages();
                                    }}
                                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>

                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Name</th>
                                    <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Phone 1</th>
                                    <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Phone 2</th>
                                    <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {parents.map((parent) => (
                                    <tr key={parent.parent_no} className="border-b border-gray-100 text-sm hover:bg-blue-50/50">
                                        <td className="px-3 py-3 font-medium text-black">{parent.name}</td>
                                        <td className="px-3 py-3 text-gray-700">{parent.tell1 || '-'}</td>
                                        <td className="px-3 py-3 text-gray-700">{parent.tell2 || '-'}</td>
                                        <td className="px-3 py-3">
                                            <div className="flex gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => onEditParent(parent)}
                                                    className="rounded-md border border-blue-200 px-2.5 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-50"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => onDeleteParent(parent)}
                                                    className="rounded-md border border-red-200 px-2.5 py-1 text-xs font-semibold text-red-700 hover:bg-red-50"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {!loading && parents.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-3 py-8 text-center text-sm text-gray-500">
                                            No parents found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            );
        }

        return (
            <div className="rounded-xl border border-gray-200 p-4 text-sm text-gray-600">
                Students tab is ready. Student CRUD can be connected next to existing student/user APIs.
            </div>
        );
    }, [
        activeTab,
        editingParentId,
        editingSchoolId,
        loading,
        parentForm.name,
        parentForm.tell1,
        parentForm.tell2,
        parents,
        schoolForm.addres,
        schoolForm.name,
        schools
    ]);

    return (
        <TabbedPageShell
            title="Student Management"
            description="Manage schools, parents, and students from one place."
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={onTabChange}
        >
            <div className="mb-4 flex items-start gap-3">
                <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    {activeTab === 'parents' ? <Users size={18} /> : <School size={18} />}
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-black">
                        {activeTab === 'schools' && 'School Management'}
                        {activeTab === 'parents' && 'Parent Management'}
                        {activeTab === 'students' && 'Student Management'}
                    </h2>
                    <p className="text-sm text-gray-600">Create, edit, delete, and view records directly from this tab.</p>
                </div>
            </div>

            {errorMessage && (
                <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{errorMessage}</div>
            )}

            {successMessage && (
                <div className="mb-3 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">{successMessage}</div>
            )}

            {content}
        </TabbedPageShell>
    );
};

export default StudentManagement;
