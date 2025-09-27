import React, { useState } from 'react';
import { Tractor } from 'lucide-react';

const Login = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const contentType = response.headers.get('content-type');
      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userData', JSON.stringify(data.user));
        if (onLoginSuccess) {
          onLoginSuccess(data.user);
        }
      } else {
        alert('Login fehlgeschlagen: ' + data.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <Tractor className="w-16 h-16 text-green-600 mx-auto"/>
        <h1 className="text-3xl font-bold mb-2 text-center">Smart Farm Manager</h1>
        <p className="text-xl text-center mb-6">Digitale Hofverwaltung</p>
        <form className="flex flex-col space-y-4" onSubmit={handleLogin}>
          <input 
            type="email" 
            name="email"
            placeholder="E-Mail" 
            value={formData.email}
            onChange={handleInputChange}
            className="border border-gray-200 rounded-lg px-4 py-3"
            required
          />
          <input 
            type="password" 
            name="password"
            placeholder="Passwort" 
            value={formData.password}
            onChange={handleInputChange}
            className="border border-gray-200 rounded-lg px-4 py-3"
            required
          />
          <button 
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-green-600 text-white rounded-md text-lg font-semibold disabled:opacity-50"
          >
            {isLoading ? 'Wird geladen...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
