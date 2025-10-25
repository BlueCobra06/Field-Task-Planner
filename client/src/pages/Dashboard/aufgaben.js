import React, { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';

const Aufgaben = () => {
    const [loading, setLoading] = useState(true);
    const [newTask, setNewTask] = useState(false);
    const [taskInput, setTaskInput] = useState('');
    const [tasks, setTasks] = useState([]);
    const [dueDate, setDueDate] = useState('');

    const raw = localStorage.getItem('userData') || '{}';
    let user = {};
    try {
      user = JSON.parse(raw) || {};
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
    const handleCreateTask = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/user/tasks/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ text: `${taskInput}`, dueDate: dueDate })
        });
        const data = await response.json();
        if (data.success) {
          alert('Aufgabe erstellt!');
          setNewTask(false);
          setTaskInput('');
        }
      } catch (error) {
        console.error('Fehler beim Erstellen der Aufgabe:', error);
      }
    };
  
    const loadTasks = useCallback(async () => {
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
    }, []);
    
    const taskManager = async () => {
      if (newTask === true) {
        setNewTask(false);
      } else {
        setNewTask(true);
      }
    }

    const convertDate = (dateString) => {
      const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    };
  
    useEffect(() => {
      loadTasks();
  
      const interval = setInterval(() => {
        loadTasks();
      }, 5000);
      
      return () => clearInterval(interval);
    }, []);

    const handleToggleTask = async (taskId) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) {
        console.error('Task not found with ID:', taskId);
        return;
      }

      setTasks(tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));

      const token = localStorage.getItem('token');
      const response = await fetch(`/api/user/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ completed: !task.completed })
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error('Fehler beim Aktualisieren der Aufgabe');
      }

    } catch (error) {
      console.error('Fehler beim Aktualisieren der Aufgabe:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/user/tasks/delete/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setTasks(tasks.filter(t => t.id !== taskId));
      } else {
        throw new Error('Fehler beim Löschen der Aufgabe');
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="bg-slate-800 p-6 shadow-xl rounded-3xl mt-8">
        <div className="flex items-center justify-between">
          <p className="font-bold text-xl text-white">Aktuelle Aufgaben</p>
          <button className="px-4 py-2 bg-green-500 text-white rounded-2xl flex items-center gap-2"
                  onClick={taskManager}>
            <Plus className="w-4 h-4" /> Neue Aufgabe
          </button>
        </div>
        <div className="mt-4">
          {newTask && (
            <div className="fixed inset-0 bg-slate-800 bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-slate-800 p-6 rounded-2xl shadow-lg w-1/3">
                <h2 className="text-2xl font-bold mb-4 text-white">Neue Aufgabe</h2>
                  <input 
                    type="text"
                    className="bg-slate-700 border border-slate-600 p-2 rounded-lg w-full text-white"
                    value={taskInput}
                    onChange={(e) => setTaskInput(e.target.value)}
                    placeholder="Aufgabe eingeben"
                  />
                  <input 
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-slate-700/50 border border-slate-600 text-white px-4 py-3 rounded-lg mb-4 mt-4"
                  />
                  <div className="flex flex-row gap-4 mt-4">
                    <button 
                      className="px-4 py-2 font-bold bg-slate-700 border border-slate-600 rounded-xl hover:bg-slate-600 w-full text-white"
                      onClick={taskManager}>Abbrechen</button>
                    <button 
                      className="px-4 py-2 font-bold text-white bg-green-500 rounded-xl hover:bg-green-400 w-full"
                      onClick={handleCreateTask}>Erstellen</button> 
                  </div>
              </div>
            </div>
          )}
          {tasks.map((task) => (
            <div key={task.id} className="bg-slate-700 p-4 rounded-xl shadow-md mb-4">
              <div className="flex items-center gap-4">
                <input type="checkbox" 
                        className="w-5 h-5 rounded cursor-pointer" 
                        checked={task.completed} 
                        onChange={() => handleToggleTask(task.id)} 
                        />
                <div className="flex flex-col">
                  <p className="text-white font-bold">{task.tasks}</p>
                  <div className="flex flex-row gap-4">
                    <p className="text-gray-400">Fällig am: {convertDate(task.due_date)}</p>
                    <p className="text-gray-400">Priorität: {task.priority || 'keine'}</p>
                  </div>
                </div>
                <div className="flex justify-between gap-4 ml-auto">
                  <button className="bg-red-500 text-white px-4 py-2 rounded-xl" onClick={() => handleDeleteTask(task.id)}>Löschen</button>
                </div> 
              </div>

            </div>
          ))}
          {tasks.length === 0 && !loading && (
            <p className="text-gray-600">Keine aktuellen Aufgaben.</p>
          )}
          {loading && (
            <p className="text-gray-600">Lade Aufgaben...</p>
          )}
        </div>
      </div>
    );
};

export { Aufgaben };