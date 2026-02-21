import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const classIssueService = {
    // Class Management
    getClasses: async () => {
        const response = await axios.get(`${API_URL}/faculty/classes`);
        return response.data;
    },
    updateLeader: async (cls_no, std_id) => {
        const response = await axios.put(`${API_URL}/faculty/classes/${cls_no}/leader`, { std_id });
        return response.data;
    },
    migrateStudent: async (std_id, new_cls_no) => {
        const response = await axios.post(`${API_URL}/faculty/students/migrate`, { std_id, new_cls_no });
        return response.data;
    },
    getClassStudents: async (cls_no) => {
        const response = await axios.get(`${API_URL}/faculty/classes/${cls_no}/students`);
        return response.data;
    },
    getAllStudents: async () => {
        const response = await axios.get(`${API_URL}/faculty/students`);
        return response.data;
    },

    // Issue Management
    getIssues: async () => {
        const response = await axios.get(`${API_URL}/faculty/issues`);
        return response.data;
    },
    getStats: async () => {
        const response = await axios.get(`${API_URL}/faculty/issues/stats`);
        return response.data;
    },
    getIssueDetails: async (id) => {
        const response = await axios.get(`${API_URL}/faculty/issues/${id}`);
        return response.data;
    },
    updateIssueStatus: async (id, data) => {
        const response = await axios.put(`${API_URL}/faculty/issues/${id}/status`, data);
        return response.data;
    },

    // Notifications
    getNotifications: async (user_id) => {
        const response = await axios.get(`${API_URL}/faculty/notifications/${user_id}`);
        return response.data;
    },
    markNotificationRead: async (not_no) => {
        const response = await axios.put(`${API_URL}/faculty/notifications/${not_no}/read`);
        return response.data;
    }
};

export default classIssueService;
