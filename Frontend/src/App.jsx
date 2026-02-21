import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import FacultyDashboard from './pages/FacultyDashboard';
import ClassManagement from './pages/ClassManagement';
import ClassIssuesList from './pages/ClassIssuesList';
import ClassIssueDetails from './pages/ClassIssueDetails';
import Profile from './pages/Profile';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />

                <Route
                    path="/admin/*"
                    element={
                        <ProtectedRoute allowedRoleName="Admin">
                            <DashboardLayout>
                                <Routes>
                                    <Route index element={<AdminDashboard />} />
                                    <Route path="profile" element={<Profile />} />
                                </Routes>
                            </DashboardLayout>
                        </ProtectedRoute>
                    }
                />

                {/* 4. Faculty Portal - role_name: Faculty */}
                <Route
                    path="/faculty/*"
                    element={
                        <ProtectedRoute allowedRoleName="Faculty">
                            <DashboardLayout>
                                <Routes>
                                    <Route index element={<FacultyDashboard />} />
                                    <Route path="classes" element={<ClassManagement />} />
                                    <Route path="issues" element={<ClassIssuesList />} />
                                    <Route path="issues/:id" element={<ClassIssueDetails />} />
                                    <Route path="profile" element={<Profile />} />
                                </Routes>
                            </DashboardLayout>
                        </ProtectedRoute>
                    }
                />

                {/* 5. Teacher Portal - role_name: Teacher */}
                <Route
                    path="/teacher/*"
                    element={
                        <ProtectedRoute allowedRoleName="Teacher">
                            <DashboardLayout>
                                <Routes>
                                    <Route index element={<div className="p-10 text-center font-bold text-gray-900">Teacher Coursework Hub</div>} />
                                    <Route path="profile" element={<Profile />} />
                                </Routes>
                            </DashboardLayout>
                        </ProtectedRoute>
                    }
                />

                {/* Catch all - Return to Login */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;

