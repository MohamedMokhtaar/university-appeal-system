import client from './client';

const studentManagementService = {
    listSchools: async () => {
        const res = await client.get('/student-management/schools');
        return res.data;
    },

    createSchool: async (payload) => {
        const res = await client.post('/student-management/schools', payload);
        return res.data;
    },

    updateSchool: async (schNo, payload) => {
        const res = await client.put(`/student-management/schools/${schNo}`, payload);
        return res.data;
    },

    deleteSchool: async (schNo) => {
        const res = await client.delete(`/student-management/schools/${schNo}`);
        return res.data;
    },

    listParents: async () => {
        const res = await client.get('/student-management/parents');
        return res.data;
    },

    createParent: async (payload) => {
        const res = await client.post('/student-management/parents', payload);
        return res.data;
    },

    updateParent: async (parentNo, payload) => {
        const res = await client.put(`/student-management/parents/${parentNo}`, payload);
        return res.data;
    },

    deleteParent: async (parentNo) => {
        const res = await client.delete(`/student-management/parents/${parentNo}`);
        return res.data;
    }
};

export default studentManagementService;
