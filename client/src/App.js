import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Selection from './pages/Selection';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('userData');

    if (token && userData) {
      checktoken(token, userData);
    } else {
      setIsLoading(false);
    }
  }, []);

  const checktoken = async (token, userData) => {
    try {
      const response = await fetch('/api/user/crobs', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const user = await JSON.parse(userData);
        setUser(user);
      } else {
        handleLogout();
      }
    } catch (error) {
      console.log(error);
      handleLogout();
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (userData, token) => {
    setUser(userData);
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('token', token);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('userData');
    localStorage.removeItem('token');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="App bg-gradient-to-br from-slate-900 to-slate-800">
      <main className="container mx-auto px-4 py-8">
        <Routes>
          {!user ? (
            <>
              <Route path="/login" element={<Login onLoginSuccess={handleLogin} />} />
              <Route path="/register" element={<Register onRegisterSuccess={handleLogin} />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          ) : (
            <>
              <Route path="/selection" element={<Selection user={user} />} />
              <Route path="/dashboard" element={<Dashboard user={user} onLogout={handleLogout} />} />
              <Route path="*" element={<Navigate to="/selection" replace />} />
            </>
          )}
        </Routes>
      </main>
    </div>
  );
}

export default App;
