import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthContext from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import Leaderboard from './pages/Leaderboard';
import Friends from './pages/Friends';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import LandingPage from './pages/LandingPage';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) return <div className="min-h-screen bg-background-light flex items-center justify-center text-primary">
     <div className="flex flex-col items-center gap-4">
        <span className="material-symbols-outlined text-4xl animate-spin">refresh</span>
        <p className="text-sm font-medium animate-pulse text-slate-500">Loading Gradevo...</p>
     </div>
  </div>;
  
  return user ? children : <Navigate to="/" />;
};

const Layout = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen bg-background-light font-display overflow-hidden text-slate-900">
            <Navbar />
            <main className="flex-1 overflow-y-auto bg-background-light relative flex flex-col">
                {/* Header Gradient Glow */}
                <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>
                <div className="max-w-7xl mx-auto p-4 sm:p-8 relative z-10 w-full flex-1">
                    {children}
                </div>
                <Footer />
            </main>
        </div>
    );
};

function App() {
  return (
    <div className="font-display">
       <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Protected Dashboard Route */}
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Layout>
                  <Dashboard />
              </Layout>
            </PrivateRoute>
          } />
          
          <Route path="/leaderboard" element={
            <PrivateRoute>
              <Layout>
                  <Leaderboard />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/friends" element={
            <PrivateRoute>
              <Layout>
                  <Friends />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/profile" element={
            <PrivateRoute>
              <Layout>
                  <Profile />
              </Layout>
            </PrivateRoute>
          } />
          {/* Login and Register separate from Layout to avoid sidebar visibility */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
    </div>
  );
}

export default App;
