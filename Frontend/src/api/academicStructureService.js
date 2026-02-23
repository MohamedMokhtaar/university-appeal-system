import client from './client';

const academicStructureService = {
    listFaculties: async () => {
        const res = await client.get('/academic-structure/faculties');
        return res.data;
    },

    createFaculty: async (payload) => {
        const res = await client.post('/academic-structure/faculties', payload);
        return res.data;
    },

    updateFaculty: async (facultyNo, payload) => {
        const res = await client.put(`/academic-structure/faculties/${facultyNo}`, payload);
        return res.data;
    },

    deleteFaculty: async (facultyNo) => {
        const res = await client.delete(`/academic-structure/faculties/${facultyNo}`);
        return res.data;
    },

    listDepartments: async () => {
        const res = await client.get('/academic-structure/departments');
        return res.data;
    },

    createDepartment: async (payload) => {
        const res = await client.post('/academic-structure/departments', payload);
        return res.data;
    },

    updateDepartment: async (deptNo, payload) => {
        const res = await client.put(`/academic-structure/departments/${deptNo}`, payload);
        return res.data;
    },

    deleteDepartment: async (deptNo) => {
        const res = await client.delete(`/academic-structure/departments/${deptNo}`);
        return res.data;
    },

    listSemesters: async () => {
        const res = await client.get('/academic-structure/semesters');
        return res.data;
    },

    createSemester: async (payload) => {
        const res = await client.post('/academic-structure/semesters', payload);
        return res.data;
    },

    updateSemester: async (semNo, payload) => {
        const res = await client.put(`/academic-structure/semesters/${semNo}`, payload);
        return res.data;
    },

    deleteSemester: async (semNo) => {
        const res = await client.delete(`/academic-structure/semesters/${semNo}`);
        return res.data;
    },

    listAcademics: async () => {
        const res = await client.get('/academic-structure/academics');
        return res.data;
    },

    createAcademic: async (payload) => {
        const res = await client.post('/academic-structure/academics', payload);
        return res.data;
    },

    updateAcademic: async (acyNo, payload) => {
        const res = await client.put(`/academic-structure/academics/${acyNo}`, payload);
        return res.data;
    },

    deleteAcademic: async (acyNo) => {
        const res = await client.delete(`/academic-structure/academics/${acyNo}`);
        return res.data;
    },

    listSubjects: async () => {
        const res = await client.get('/academic-structure/subjects');
        return res.data;
    },

    createSubject: async (payload) => {
        const res = await client.post('/academic-structure/subjects', payload);
        return res.data;
    },

    updateSubject: async (subNo, payload) => {
        const res = await client.put(`/academic-structure/subjects/${subNo}`, payload);
        return res.data;
    },

    deleteSubject: async (subNo) => {
        const res = await client.delete(`/academic-structure/subjects/${subNo}`);
        return res.data;
    }
};

export default academicStructureService;
