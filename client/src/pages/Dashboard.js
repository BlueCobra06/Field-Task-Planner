import React, { useState, useEffect, useCallback } from 'react';
import { Settings, Tractor, LogOut, Bell, Trash2, Eye, Edit, Plus, MapPin, Calendar, BarChart3 } from 'lucide-react';
import { Aufgaben } from './Dashboard/aufgaben';
import { Kulturen } from './Dashboard/kulturen';
import { Schnellzugriff } from './Dashboard/schnellzugriff';
import { Wetter } from './Dashboard/wetter';

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
    <div className="min-h-screen p-8 ">
      <div className="flex items-center gap-4 shadow-xl p-4 rounded-2xl bg-slate-800">
        <Tractor className="w-16 h-16 text-white bg-green-500 p-3 rounded-2xl" />
        <div className="flex-col">
          <p className="text-2xl font-bold text-white">Willkommen, {firstname}!</p>
          <p className="text-lg text-white">Smart Farm Manager Dashboard</p>
        </div>
        <div className="ml-auto flex items-center gap-4 text-white">
          <Bell className="cursor-pointer hover:text-slate-600 text-white" />
          <Settings className="cursor-pointer hover:text-slate-600 text-white" />
          <LogOut 
            className="cursor-pointer hover:text-slate-600 text-white" 
            onClick={() => { 
              localStorage.removeItem('token');
              localStorage.removeItem('userData');
              window.location.href = '/login'; 
            }} 
          />
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-6 mt-8">
        <div className="flex mt-8 bg-slate-800 p-6 shadow-xl rounded-3xl flex-col">
          <p className="font-bold text-2xl mb-6 text-white">📊 Übersicht</p>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-slate-700">
               <span className="text-slate-400">Gesamtfläche</span>
      <span className="text-xl font-bold text-emerald-500">{gesamtfläche()} ha</span>
            </div>
            <div>
              <div className="flex justify-between items-center pb-4 border-b border-slate-700">
                <span className="text-slate-400">Offene Aufgaben</span>
                <span className="text-xl font-bold text-emerald-500">{tasks.length}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-slate-700">
                <span className="text-slate-400">Aktive Kulturen</span>
                <span className="text-xl font-bold text-emerald-500">{selectedFruits.length}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-slate-700">
                <span className="text-slate-400">Nächste Ernte</span>
                <span className="text-xl font-bold text-emerald-500">In Kürze</span>
              </div>
            </div>
          </div>
        </div>
        <Wetter/>
      </div>
      <Kulturen selectedFruits={selectedFruits} loading={loading} />

      <Aufgaben />

      <Schnellzugriff  onBack={() => Navigate('/selection')} />
    </div>
  );
};

export default Dashboard;