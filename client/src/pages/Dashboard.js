import React, { useState, useEffect, useCallback } from 'react';
import { Settings, Tractor, LogOut, Bell, Trash2, Eye, Edit, Plus, MapPin, Calendar, BarChart3 } from 'lucide-react';
import { Aufgaben } from './Dashboard/aufgaben';
import { Kulturen } from './Dashboard/kulturen';
import { Schnellzugriff } from './Dashboard/schnellzugriff';

const Dashboard = ({ onBack }) => {
    const [tasks, setTasks] = useState([]);
    const raw = localStorage.getItem('userData') || '{}';
    let user = {};
    try {
        user = JSON.parse(raw) || {};
    } catch (error) {
        console.error('Error parsing user data:', error);
    }
    
    const firstname = user.firstName || user.firstname || 'Benutzer';

    const [selectedFruits, setSelectedFruits] = useState([]);
    const [loading, setLoading] = useState(true);

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
        aufgabenload();
        console.log('Tasks:', tasks);
    }, []);

    const gesamtfläche = () => {
      let result = 0;
      selectedFruits.forEach(fruit => {
        result += fruit.id;
      });

      return result;
    }

    const aufgabenload = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/user/tasks/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.success) {
          setTasks(data.data);
          setLoading(false);
        }
      } catch (error) {
        console.error('Fehler beim Laden der Aufgaben:', error);
      }
    }
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
          <p className="text-xl">Gesamtfläche: {gesamtfläche()} ha</p>
          <p className="text-xl">Offene Aufgaben: {tasks.length}</p>
          <p className="text-xl">Aktive Kulturen: {selectedFruits.length}</p>
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
      <Kulturen selectedFruits={selectedFruits} loading={loading} />

      <Aufgaben />

      <Schnellzugriff  onBack={() => Navigate('/selection')} />
    </div>
  );
};

export default Dashboard;