import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Navigation from "./components/Navigation";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import LogWorkout from "./pages/LogWorkout";
import Schedule from "./pages/Schedule";
import About from "./pages/About";
import WorkoutDetail from "./pages/WorkoutDetail";
import ScheduleDetail from "./pages/ScheduleDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useState, useEffect, createContext, useContext } from "react";
import { isAuthenticated, logout, getCurrentUser } from "./services/api";

// Auth Context
const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

// Protected Route Component
function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function AppContent() {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  
  const isLanding = location.pathname === "/";
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated()) {
        try {
          const result = await getCurrentUser();
          if (result.success) {
            setUser(result.data);
            // Update localStorage with fresh data from API
            localStorage.setItem('user', JSON.stringify(result.data));
          } else {
            // Token invalid, logout
            logout();
          }
        } catch {
          logout();
        }
      }
      setAuthLoading(false);
    };
    checkAuth();
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    window.location.href = '/';
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, setUser, handleLogout, isAuthenticated: isAuthenticated() }}>
      <div className="min-h-screen bg-gray-50">
        {!isLanding && !isAuthPage && (
          <Navigation 
            user={user}
            onLogout={handleLogout}
          />
        )}
        <div className={!isLanding && !isAuthPage ? "pb-20 md:pt-20 md:pb-0" : ""}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/log" element={<ProtectedRoute><LogWorkout /></ProtectedRoute>} />
            <Route path="/workout/:id" element={<ProtectedRoute><WorkoutDetail /></ProtectedRoute>} />
            <Route path="/schedule" element={<ProtectedRoute><Schedule /></ProtectedRoute>} />
            <Route path="/schedule/:day" element={<ProtectedRoute><ScheduleDetail /></ProtectedRoute>} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
      </div>
    </AuthContext.Provider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
