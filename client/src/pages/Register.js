import React, { useState } from 'react';
import { Tractor, Eye, EyeOff, Lock, User, Mail } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Register = ({ onRegisterSuccess }) => {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (error) setError(null);
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwörter stimmen nicht überein');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Passwort muss mindestens 6 Zeichen lang sein');
      return false;
    }
    return true;
  }

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstname: formData.firstName,
          lastname: formData.lastName,
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (data.success) {
        onRegisterSuccess(data.user, data.token);
      } else {
        setError(data.message || 'Registrierung fehlgeschlagen');
      }
    } catch (error) {
      console.error('Fehler bei der Registrierung:', error);
      setError('Ein unerwarteter Fehler ist aufgetreten. Bitte versuche es später erneut.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
        <div className="mx-auto bg-black rounded-xl p-4 w-16 mb-2">
          <Tractor className="w-8 h-8 text-white mx-auto"/>
        </div>
        <h1 className="text-2xl font-bold mb-2 text-center">Konto erstellen</h1>
        <p className="text-lg text-center mb-6">Registriere dich für die Smart Farm Manager</p>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <form className="flex flex-col space-y-4" onSubmit={handleRegister}>
            <div className="grid grid-cols-2 grid-rows-1 gap-4">
                <div>
                    <label className="text-sm font-medium">Vorname</label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"/>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            required
                            className="bg-gray-100 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black w-full pl-10"
                        />
                    </div>
                </div>
                <div>
                    <label className="text-sm font-medium">Nachname</label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"/>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName || ''}
                            onChange={handleInputChange}
                            required
                            className="bg-gray-100 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black w-full pl-10"
                        />
                    </div>
                </div>
            </div>
            <label className="text-sm font-medium">E-Mail</label>
            <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"/>
                <input
                    type="email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-gray-100 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black pl-10"
                />
            </div>
            <label className="text-sm font-medium">Passwort</label>
            <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"/>
                <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password || ''}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-gray-100 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black pl-10"
                />
                <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(s => !s)}
                >
                {showPassword ? <EyeOff className="w-5 h-5 text-gray-400"/> : <Eye className="w-5 h-5 text-gray-400"/>}
                </button>
            </div>
            <label className="text-sm font-medium">Passwort bestätigen</label>
            <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"/>
                <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword || ''}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-gray-100 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black pl-10"
                />
                
                <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowConfirmPassword(s => !s)}
                >
                {showConfirmPassword ? <EyeOff className="w-5 h-5 text-gray-400"/> : <Eye className="w-5 h-5 text-gray-400"/>}
                </button>
            </div>
            <button
              type="submit" 
              disabled={isLoading}
              className="px-4 py-2 bg-black text-white rounded-xl text-lg font-semibold disabled:opacity-50"
            >
              {isLoading ? 'Wird erstellt...' : 'Konto erstellen'}
            </button>
            <div className="text-center text-black/50">
              Bereits ein Konto? <Link to="/login" className="text-black">Anmelden</Link>
            </div>
        </form>
      </div>
    </div>
  );
};

export default Register;