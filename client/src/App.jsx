import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { EmployeeProvider, useEmployee } from './context/EmployeeContext';
import Navbar from './components/Navbar';
import EmployeeNavbar from './components/EmployeeNavbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import LaundryDetails from './pages/LaundryDetails';
import EmployeeLogin from './pages/EmployeeLogin';
import EmployeeDashboard from './pages/EmployeeDashboard';
import EmployeeOrderDetails from './pages/EmployeeOrderDetails';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-2 text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-2 text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== 'admin' && user.role !== 'washer') {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

const EmployeeRoute = ({ children }) => {
  const { employee, loading } = useEmployee();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-2 text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return employee ? children : <Navigate to="/employee/login" />;
};

function AppContent() {
  const location = useLocation();
  const isEmployeeRoute = location.pathname.startsWith('/employee');
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-slate-100">
      {!isEmployeeRoute && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
              <Route
                path="/laundry/:id"
                element={
                  <PrivateRoute>
                    <LaundryDetails />
                  </PrivateRoute>
                }
              />
              {/* Employee Routes */}
              <Route path="/employee/login" element={<EmployeeLogin />} />
              <Route
                path="/employee/dashboard"
                element={
                  <EmployeeRoute>
                    <EmployeeDashboard />
                  </EmployeeRoute>
                }
              />
              <Route
                path="/employee/orders/:id"
                element={
                  <EmployeeRoute>
                    <EmployeeOrderDetails />
                  </EmployeeRoute>
                }
              />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <EmployeeProvider>
          <AppContent />
        </EmployeeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
