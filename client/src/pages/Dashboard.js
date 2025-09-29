import React, { useState, useEffect } from 'react';
import { Settings, Tractor, LogOut, Bell, Trash2, Eye, Edit, Plus, MapPin, Calendar, BarChart3 } from 'lucide-react';

const Dashboard = ({ onBack }) => {
  const [selectedFruits, setSelectedFruits] = useState([]);
  const [loading, setLoading] = useState(true);

  const raw = localStorage.getItem('userData') || '{}';
  let user = {};
  try {
    user = JSON.parse(raw) || {};
  } catch (error) {
    console.error('Error parsing user data:', error);
  }
  
  const firstname = user.firstName || user.firstname || 'Benutzer';

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

    const getIcon = (name) => {
      const icons = {
        'Winterweizen': '🌾',
        'Roggen': '🌾', 
        'Gerste': '🌾',
        'Mais': '🌽',
        'Kartoffeln': '🥔',
        'Zuckerrueben': '🫐',
        'Sonnenblumen': '🌻',
        'Raps': '🌻',
        'Hafer': '🌾',
        'Dinkel': '🌾',
        'Sojabohnen': '🫘',
        'Erbsen': '🫛',
        'Linsen': '🫘',
        'Klee': '🍀',
        'Luzerne': '🌿',
        'Apfel': '🍎',
        'Birne': '🍐',
        'Kirsche': '🍒',
        'Pflaume': '🟣',
        'Erdbeere': '🍓',
        'Himbeere': '🫐',
        'Tomate': '🍅',
        'Kartoffel': '🥔',
        'Karotte': '🥕',
        'Weizen': '🌾'
      };
    return icons[name] || '🌱';
  };

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
      <div className="grid grid-cols-2 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-6 mt-8">
        <div className="flex mt-8 bg-white p-6 shadow-xl rounded-3xl flex-col">
          <p className="font-bold text-2xl mb-10">Übersicht</p>
          <p className="text-xl">Gesamtfläche</p>
          <p className="text-xl">Offene Aufgaben</p>
          <p className="text-xl">Aktive Kulturen</p>
          <p className="text-xl">Nächste Ernte</p>
        </div>
        <div className="flex flex-col mt-8 bg-white p-6 shadow-xl rounded-3xl ">
          <p className="text-2xl">Wetter</p>
          <div className="text-center">
            <p className="text-4xl font-bold">20°C</p>
            <p className="text-xl">Sonnig</p>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4 text-center">
            <div>
              <p className="opacity-50">Luftfeuchtigkeit</p>
              <p className="font-bold">60%</p>
            </div>
            <div>
              <p className="opacity-50">Niederschlag</p>
              <p className="font-bold">2mm</p>
            </div>
          </div>
          <div className="mt-6">
            <p className="font-bold text-lg">4-Tages Vorhersage</p>
            <div className="mt-2 grid grid-cols-1 gap-4">
              <div className="flex flex-row items-center justify-between">
                <p className="text-xl">Mo</p>
                <div className="flex flex-row items-center gap-2">
                  <p className="text-xl">🌧️</p>
                  <p className="font-bold text-xl">20°C</p>
                </div>
              </div>
              <div className="flex flex-row items-center justify-between">
                <p className="text-xl">Di</p>
                <div className="flex flex-row items-center gap-2">
                  <p className="text-xl">🌤️</p>
                  <p className="font-bold text-xl">22°C</p>
                </div>
              </div>
              <div className="flex flex-row items-center justify-between">
                <p className="text-xl">Mi</p>
                <div className="flex flex-row items-center gap-2">
                  <p className="text-xl">🌥️</p>
                  <p className="font-bold text-xl">21°C</p>
                </div>
              </div>
              <div className="flex flex-row items-center justify-between">
                <p className="text-xl">Do</p>
                <div className="flex flex-row items-center gap-2">
                  <p className="text-xl">🌤️</p>
                  <p className="font-bold text-xl">23°C</p>
                </div>
              </div>
              <div className="flex flex-row items-center justify-between">
                <p className="text-xl">Fr</p>
                <div className="flex flex-row items-center gap-2">
                  <p className="text-xl">🌤️</p>
                  <p className="font-bold text-xl">24°C</p>
                </div>
              </div>
            </div>
          </div>

        </div> 
      </div>
 

      {selectedFruits && selectedFruits.length > 0 && (
        <div className="mt-8 bg-white p-6 shadow-xl rounded-3xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold mb-4">Deine Kulturen</h2>
            <button className="text-white font-bold bg-black p-2 rounded-2xl">{selectedFruits.length} aktiv</button>
          </div>
          <div className="grid grid-rows gap-6">
            {selectedFruits.map(fruit => (
              <div key={fruit.id} className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center">
                  <div className="text-5xl">{getIcon(fruit.name)}</div>
                  <div className="ml-2">
                    <h3 className="text-xl font-bold">{fruit.name}</h3>
                    <p className="text-gray-600">{fruit.id} ha</p>
                  </div>
                  <div className="ml-auto flex items-center gap-4">
                    <Eye className="w-6 h-6" />
                    <Trash2 className="w-6 h-6" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="bg-white p-6 shadow-xl rounded-3xl mt-8">
        <div className="flex items-center justify-between">
          <p className="font-bold text-xl">Aktuelle Aufgaben</p>
          <button className="px-4 py-2 bg-black text-white rounded-2xl flex items-center gap-2">
            <Plus className="w-4 h-4" /> Neue Aufgabe
          </button>
        </div>
        <div className="mt-4">
          {loading ? (
            <p>Lade Aufgaben...</p>
          ) : (
            <p>Keine offenen Aufgaben.</p>
          )}
        </div>
      </div>

      <div className="bg-white p-6 shadow-xl rounded-3xl mt-8">
        <p className="text-xl">Schnellzugriff</p>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="flex flex-col items-center justify-center bg-white p-4 shadow-xl rounded-3xl">
            <MapPin className="w-8 h-8 mb-2" />
            <p className="text-xl">Felder</p>
          </div>
          <div className="flex flex-col items-center justify-center bg-white p-4 shadow-xl rounded-3xl">
            <Calendar className="w-8 h-8 mb-2" />
            <p className="text-xl">Planung</p>
          </div>
          <div className="flex flex-col items-center justify-center bg-white p-4 shadow-xl rounded-3xl">
            <BarChart3 className="w-8 h-8 mb-2" />
            <p className="text-xl">Berichte</p>
          </div>
          <div className="flex flex-col items-center justify-center bg-white p-4 shadow-xl rounded-3xl">
            <Settings className="w-8 h-8 mb-2" />
            <p className="text-xl">Einstellungen</p>
          </div>
        </div>
      </div>
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