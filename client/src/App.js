import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Selection from './pages/Selection';
import Login from './pages/Login';
import './App.css';

function App() {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    // const token = localStorage.getItem('token');
    // const userData = localStorage.getItem('userData');
    
    // if (token && userData) {
    //   setUser(JSON.parse(userData));
    // }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    setUser(null);
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="App bg-gradient-to-br from-purple-600 to-purple-800">
      <main className="container mx-auto px-4 py-8">
        {user ? (
          <Routes>
            <Route path="/" element={<Selection user={user} onLogout={handleLogout} />} />
          </Routes>
        ) : (
          <Login onLoginSuccess={handleLogin} />
        )}
      </main>
    </div>
  );
}

export default App;
