import React, { useEffect, useState } from 'react';
import { BookOpen, Building2, CalendarDays, GraduationCap, Library, School, Shapes, UserSquare2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { useSearchParams } from 'react-router-dom';
import academicStructureService from '../api/academicStructureService';
import TabbedPageShell from '../components/TabbedPageShell';

const tabs = [
    { key: 'faculties', label: 'Faculties' },
    { key: 'departments', label: 'Departments' },
    { key: 'classes', label: 'Classes' },
    { key: 'semesters', label: 'Semesters' },
    { key: 'academics', label: 'Academics' },
    { key: 'subjects', label: 'Subjects' },
    { key: 'subject-class', label: 'Subject Class' }
];

const tabMeta = {
    faculties: { icon: Building2, title: 'Faculty Management', description: 'Create, update, and delete faculty records.' },
    departments: { icon: UserSquare2, title: 'Department Management', description: 'Create departments and map them to faculties.' },
    classes: { icon: School, title: 'Class Management', description: 'Class CRUD can be connected next.' },
    semesters: { icon: CalendarDays, title: 'Semester Setup', description: 'Create, update, and delete semester records.' },
    academics: { icon: GraduationCap, title: 'Academic Sessions', description: 'Create, update, and delete academic session records.' },
    subjects: { icon: Library, title: 'Subject Management', description: 'Create, update, and delete subjects and codes.' },
    'subject-class': { icon: Shapes, title: 'Subject Class Mapping', description: 'Subject-class mapping CRUD can be connected next.' }
};

const compactSwal = {
    width: 340,
    padding: '0.9rem',
    confirmButtonColor: '#1E5EFF',
    cancelButtonColor: '#9CA3AF',
    buttonsStyling: true
};

const inputClass =
    'rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100';

const initialForms = {
    faculties: { name: '' },
    departments: { name: '', faculty_no: '' },
    semesters: { semister_name: '' },
    academics: { start_date: '', end_date: '', active_year: '' },
    subjects: { name: '', code: '' }
};

const configs = {
    faculties: {
        label: 'Faculty', id: 'faculty_no', fields: ['name'], columns: [['name', 'Faculty Name']],
        list: academicStructureService.listFaculties, create: academicStructureService.createFaculty,
        update: academicStructureService.updateFaculty, remove: academicStructureService.deleteFaculty
    },
    departments: {
        label: 'Department', id: 'dept_no', fields: ['name', 'faculty_no'], columns: [['name', 'Department'], ['faculty_name', 'Faculty']],
        list: academicStructureService.listDepartments, create: academicStructureService.createDepartment,
        update: academicStructureService.updateDepartment, remove: academicStructureService.deleteDepartment
    },
    semesters: {
        label: 'Semester', id: 'sem_no', fields: ['semister_name'], columns: [['semister_name', 'Semester Name']],
        list: academicStructureService.listSemesters, create: academicStructureService.createSemester,
        update: academicStructureService.updateSemester, remove: academicStructureService.deleteSemester
    },
    academics: {
        label: 'Academic Session', id: 'acy_no', fields: ['start_date', 'end_date', 'active_year'], dateFields: ['start_date', 'end_date'],
        columns: [['active_year', 'Active Year'], ['start_date', 'Start Date'], ['end_date', 'End Date']],
        list: academicStructureService.listAcademics, create: academicStructureService.createAcademic,
        update: academicStructureService.updateAcademic, remove: academicStructureService.deleteAcademic
    },
    subjects: {
        label: 'Subject', id: 'sub_no', fields: ['name', 'code'], columns: [['name', 'Subject Name'], ['code', 'Code']],
        list: academicStructureService.listSubjects, create: academicStructureService.createSubject,
        update: academicStructureService.updateSubject, remove: academicStructureService.deleteSubject
    }
};

const placeholderText = {
    classes: 'Class CRUD can be connected in this tab.',
    'subject-class': 'Subject-class mapping CRUD can be connected in this tab.'
};

const crudTabs = Object.keys(configs);

const AcademicStructure = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const rawTab = searchParams.get('tab') || 'faculties';
    const activeTab = tabs.some((tab) => tab.key === rawTab) ? rawTab : 'faculties';
    const section = tabMeta[activeTab];
    const Icon = section.icon;
    const cfg = configs[activeTab];

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [rows, setRows] = useState({ faculties: [], departments: [], semesters: [], academics: [], subjects: [] });
    const [forms, setForms] = useState(initialForms);
    const [editing, setEditing] = useState({ faculties: null, departments: null, semesters: null, academics: null, subjects: null });

    const clearMessages = () => { setErrorMessage(''); setSuccessMessage(''); };
    const extractError = (error, fallback) =>
        error?.response?.data?.message || (error?.response?.data?.errors ? Object.values(error.response.data.errors).flat().join(' ') : fallback);

    const loadTab = async (tab, withLoading = true) => {
        if (!crudTabs.includes(tab)) return;
        if (withLoading) setLoading(true);
        try {
            if (tab === 'departments') {
                const [fRes, dRes] = await Promise.all([academicStructureService.listFaculties(), academicStructureService.listDepartments()]);
                if (fRes.success) setRows((prev) => ({ ...prev, faculties: fRes.data || [] }));
                if (dRes.success) setRows((prev) => ({ ...prev, departments: dRes.data || [] }));
            } else {
                const res = await configs[tab].list();
                if (res.success) setRows((prev) => ({ ...prev, [tab]: res.data || [] }));
            }
        } catch (error) {
            setErrorMessage(extractError(error, `Failed to load ${tab}.`));
        } finally {
            if (withLoading) setLoading(false);
        }
    };

    useEffect(() => {
        clearMessages();
        loadTab(activeTab, true);
    }, [activeTab]);

    const onTabChange = (tab) => {
        const next = new URLSearchParams(searchParams);
        next.set('tab', tab);
        setSearchParams(next);
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!cfg) return;
        setLoading(true);
        clearMessages();
        try {
            const id = editing[activeTab];
            if (id) await cfg.update(id, forms[activeTab]);
            else await cfg.create(forms[activeTab]);
            setSuccessMessage(`${cfg.label} ${id ? 'updated' : 'created'} successfully.`);
            setForms((prev) => ({ ...prev, [activeTab]: { ...initialForms[activeTab] } }));
            setEditing((prev) => ({ ...prev, [activeTab]: null }));
            await loadTab(activeTab, false);
        } catch (error) {
            setErrorMessage(extractError(error, `Failed to save ${cfg.label.toLowerCase()}.`));
        } finally {
            setLoading(false);
        }
    };

    const onEdit = (row) => {
        if (!cfg) return;
        const next = { ...initialForms[activeTab] };
        Object.keys(next).forEach((key) => { next[key] = row[key] ?? ''; });
        if (activeTab === 'departments') next.faculty_no = next.faculty_no ? String(next.faculty_no) : '';
        setForms((prev) => ({ ...prev, [activeTab]: next }));
        setEditing((prev) => ({ ...prev, [activeTab]: row[cfg.id] }));
        clearMessages();
    };

    const onDelete = async (row) => {
        if (!cfg) return;
        const result = await Swal.fire({
            ...compactSwal, title: `Delete ${cfg.label}?`, text: 'This action cannot be undone.', icon: 'warning',
            showCancelButton: true, confirmButtonText: 'Delete', cancelButtonText: 'Keep'
        });
        if (!result.isConfirmed) return;

        setLoading(true);
        clearMessages();
        try {
            await cfg.remove(row[cfg.id]);
            if (editing[activeTab] === row[cfg.id]) {
                setEditing((prev) => ({ ...prev, [activeTab]: null }));
                setForms((prev) => ({ ...prev, [activeTab]: { ...initialForms[activeTab] } }));
            }
            setSuccessMessage(`${cfg.label} deleted successfully.`);
            await loadTab(activeTab, false);
        } catch (error) {
            setErrorMessage(extractError(error, `Failed to delete ${cfg.label.toLowerCase()}.`));
        } finally {
            setLoading(false);
        }
    };

    const renderCrud = () => (
        <div className="space-y-5">
            <form onSubmit={onSubmit} className="grid grid-cols-1 gap-3 rounded-xl border border-gray-200 p-4 md:grid-cols-4">
                {cfg.fields.map((field) => field === 'faculty_no' ? (
                    <select key={field} value={forms[activeTab][field]} onChange={(e) => setForms((prev) => ({ ...prev, [activeTab]: { ...prev[activeTab], [field]: e.target.value } }))} className={inputClass} required>
                        <option value="">Select Faculty</option>
                        {rows.faculties.map((f) => <option key={f.faculty_no} value={f.faculty_no}>{f.name}</option>)}
                    </select>
                ) : (
                    <input key={field} type={cfg.dateFields?.includes(field) ? 'date' : 'text'} value={forms[activeTab][field]} onChange={(e) => setForms((prev) => ({ ...prev, [activeTab]: { ...prev[activeTab], [field]: e.target.value } }))} className={inputClass} placeholder={field.replace('_', ' ')} required />
                ))}
                <div className="flex gap-2 md:col-span-2">
                    <button type="submit" disabled={loading} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">{editing[activeTab] ? 'Update' : 'Create'}</button>
                    {editing[activeTab] && <button type="button" onClick={() => { setEditing((prev) => ({ ...prev, [activeTab]: null })); setForms((prev) => ({ ...prev, [activeTab]: { ...initialForms[activeTab] } })); clearMessages(); }} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">Cancel</button>}
                </div>
            </form>

            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead><tr className="border-b border-gray-200">{cfg.columns.map(([_, label]) => <th key={label} className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</th>)}<th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Actions</th></tr></thead>
                    <tbody>
                        {rows[activeTab].map((row) => (
                            <tr key={row[cfg.id]} className="border-b border-gray-100 text-sm hover:bg-blue-50/50">
                                {cfg.columns.map(([key]) => <td key={`${row[cfg.id]}-${key}`} className="px-3 py-3 text-gray-800">{row[key] || '-'}</td>)}
                                <td className="px-3 py-3"><div className="flex gap-2"><button type="button" onClick={() => onEdit(row)} className="rounded-md border border-blue-200 px-2.5 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-50">Edit</button><button type="button" onClick={() => onDelete(row)} className="rounded-md border border-red-200 px-2.5 py-1 text-xs font-semibold text-red-700 hover:bg-red-50">Delete</button></div></td>
                            </tr>
                        ))}
                        {!loading && rows[activeTab].length === 0 && <tr><td colSpan={cfg.columns.length + 1} className="px-3 py-8 text-center text-sm text-gray-500">No records found.</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <TabbedPageShell title="Academic Structure" description="Centralized setup for faculties, departments, semesters, and subjects." tabs={tabs} activeTab={activeTab} onTabChange={onTabChange}>
            <div className="mb-4 flex items-start gap-3">
                <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600"><Icon size={18} /></div>
                <div><h2 className="text-lg font-semibold text-black">{section.title}</h2><p className="text-sm text-gray-600">{section.description}</p></div>
            </div>
            {errorMessage && <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{errorMessage}</div>}
            {successMessage && <div className="mb-3 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">{successMessage}</div>}
            {crudTabs.includes(activeTab) ? renderCrud() : <div className="rounded-xl border border-gray-200 p-4 text-sm text-gray-600"><div className="flex items-center gap-2"><BookOpen size={16} className="text-blue-600" /><span>{placeholderText[activeTab]}</span></div></div>}
        </TabbedPageShell>
    );
};

export default AcademicStructure;
