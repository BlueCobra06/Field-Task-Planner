import React, { useState, useEffect } from 'react';
import { Settings, Tractor, LogOut, Bell } from 'lucide-react';

const Dashboard = ({ onBack }) => {
  const [selectedFruits, setSelectedFruits] = useState([]);
  const [loading, setLoading] = useState(true);

  // Benutzer-Daten aus localStorage holen
  const raw = localStorage.getItem('userData') || '{}';
  let user = {};
  try {
    user = JSON.parse(raw) || {};
  } catch (error) {
    console.error('Error parsing user data:', error);
  }
  
  const firstname = user.firstName || user.firstname || 'Benutzer';

  // Lade die ausgewählten Kulturen vom Server
  useEffect(() => {
    const loadUserCrobs = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/user/crobs', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.success) {
          setSelectedFruits(data.data);
        }
      } catch (error) {
        console.error('Fehler beim Laden der Kulturen:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserCrobs();
  }, []);

  return (
    <div className="min-h-screen p-8">
      <div className="flex items-center gap-4 shadow-xl p-4 rounded-2xl">
        <Tractor className="w-16 h-16 text-white bg-black p-3 rounded-2xl" />
        <div className="flex-col">
          <p className="text-2xl font-bold">Willkommen, {firstname}!</p>
          <p className="text-lg">Smart Farm Manager Dashboard</p>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <Bell className="cursor-pointer hover:text-gray-600" />
          <Settings className="cursor-pointer hover:text-gray-600" />
          <LogOut 
            className="cursor-pointer hover:text-gray-600" 
            onClick={() => { 
              localStorage.removeItem('token');
              localStorage.removeItem('userData');
              window.location.href = '/login'; 
            }} 
          />
        </div>
      </div>

      {selectedFruits && selectedFruits.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Deine ausgewählten Kulturen</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedFruits.map(fruit => (
              <div key={fruit.id} className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold mb-2">{fruit.name}</h3>
                {fruit.category && <p className="text-gray-600 mb-2">{fruit.category}</p>}
                {fruit.planting_time && <p className="text-sm text-gray-500">Pflanzzeit: {fruit.planting_time}</p>}
                {fruit.harvest_time && <p className="text-sm text-gray-500">Erntezeit: {fruit.harvest_time}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {onBack && (
        <button
          onClick={onBack}
          className="mt-8 px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          Zurück zur Auswahl
        </button>
      )}
    </div>
  );
};

export default Dashboard;