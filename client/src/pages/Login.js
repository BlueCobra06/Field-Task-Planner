import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Tractor, Lock, Mail, Eye, EyeOff } from 'lucide-react';

const Login = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (error) setError(null);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        onLoginSuccess(data.user, data.token);
      } else {
        setError(data.message || 'Login fehlgeschlagen');
      }
    } catch (error) {
      console.error('Fehler beim Login:', error);
      setError('Ein unerwarteter Fehler ist aufgetreten. Bitte versuche es später erneut.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="bg-slate-700 backdrop-blur-lg p-8 rounded-xl shadow-2xl max-w-md w-full">
        <div className="mx-auto bg-green-500 rounded-xl p-4 w-16 mb-2">
          <Tractor className="w-8 h-8 text-white mx-auto"/>
        </div>
        <h1 className="text-2xl font-bold mb-2 text-center text-white">Smart Farm Manager</h1>
        <p className="text-xl text-center mb-6 text-white">Digitale Hofverwaltung</p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <form className="flex flex-col space-y-4" onSubmit={handleLogin}>
          <label htmlFor="email" className="text-sm font-medium text-white">E-Mail</label>
          <input 
            type="email" 
            name="email"
            placeholder="E-Mail" 
            value={formData.email}
            onChange={handleInputChange}
            className="bg-slate-800 border border-slate-100 rounded-lg px-4 py-3"
            required
          />
          <label htmlFor="password" className="text-sm font-medium text-white">Passwort</label>
          <div className="relative">
            <Lock className="absolute left-2 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 inline-block mr-2" />
            <input 
              type={showPassword ? 'text' : 'password'} 
              name="password"
              placeholder="Passwort" 
              value={formData.password}
              onChange={handleInputChange}
              className="bg-slate-800 w-full border border-slate-200 rounded-lg px-4 py-3 pl-10"
              required
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2" type="button" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff className="w-5 h-5 text-gray-400 inline-block ml-2" /> : <Eye className="w-5 h-5 text-gray-400 inline-block ml-2" />}
            </button>
          </div>
          <button 
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-green-500 text-white rounded-xl text-lg font-semibold disabled:opacity-50"
          >
            {isLoading ? 'Wird geladen...' : 'Login'}
          </button>
          <div className="text-center text-white/50">
            Noch kein Konto? <Link to="/register" className="text-white font-bold">Jetzt registrieren</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
