import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

import StudentDashboard from './pages/student/Dashboard';
import CreateEvent from './pages/student/CreateEvent';
import StudentApplications from './pages/student/Applications';
import StudentChat from './pages/student/Chat';

import BrandDashboard from './pages/brand/Dashboard';
import BrandEventDetail from './pages/brand/EventDetail';
import BrandApplications from './pages/brand/Applications';
import BrandChat from './pages/brand/Chat';

import CollegeApprovals from './pages/college-admin/Approvals';
import PlatformColleges from './pages/platform-admin/Colleges';

const HomeRedirect = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === 'student') {
    return <Navigate to="/student/dashboard" replace />;
  }

  if (user.role === 'brand') {
    return <Navigate to="/brand/dashboard" replace />;
  }

  if (user.role === 'college_admin') {
    return <Navigate to="/college-admin/approvals" replace />;
  }

  if (user.role === 'platform_admin') {
    return <Navigate to="/platform-admin/colleges" replace />;
  }

  return <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <>
      <Navbar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={
            <div className="container flex-center" style={{ minHeight: '60vh' }}>
              <div className="card text-center" style={{ padding: '3rem' }}>
                <h3 className="text-error" style={{ fontSize: '1.5rem' }}>Unauthorized Access</h3>
                <p>You do not have permission to view this page.</p>
              </div>
            </div>
          } />

          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute roles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/events/create"
            element={
              <ProtectedRoute roles={['student']}>
                <CreateEvent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/applications"
            element={
              <ProtectedRoute roles={['student']}>
                <StudentApplications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/chat/:appId"
            element={
              <ProtectedRoute roles={['student']}>
                <StudentChat />
              </ProtectedRoute>
            }
          />

          <Route
            path="/brand/dashboard"
            element={
              <ProtectedRoute roles={['brand']}>
                <BrandDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/brand/events/:id"
            element={
              <ProtectedRoute roles={['brand']}>
                <BrandEventDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/brand/applications"
            element={
              <ProtectedRoute roles={['brand']}>
                <BrandApplications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/brand/chat/:appId"
            element={
              <ProtectedRoute roles={['brand']}>
                <BrandChat />
              </ProtectedRoute>
            }
          />

          <Route
            path="/college-admin/approvals"
            element={
              <ProtectedRoute roles={['college_admin']}>
                <CollegeApprovals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/platform-admin/colleges"
            element={
              <ProtectedRoute roles={['platform_admin']}>
                <PlatformColleges />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </>
  );
};

export default App;
