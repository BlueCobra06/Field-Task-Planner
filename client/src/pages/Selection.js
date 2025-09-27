import React from 'react';
import Dashboard from './Dashboard';

const Selection = () => {
  const [search, setsearch] = React.useState('');
  const [früchte, setFruits] = React.useState([]);
  const [allfrüchte, setAllFruits] = React.useState([]);
  const [selectedFruit, setSelectedFruit] = React.useState(null);
  const [showDashboard, setShowDashboard] = React.useState(false);

  const fetchFruits = React.useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/crobs/crobsbyName?name=${search}`);
      const data = await response.json();

      if (data.success && Array.isArray(data.data)) {
        console.log(data.data);
        setFruits(data.data);
      }  else {
          console.log('API returned success: false');
          setFruits([]);
      }
    } catch (error) {
      console.error('Error-API:', error);
      setFruits([]);
    }
  }, [search]);

  React.useEffect(() => {
    if (search.trim() !== '') {
      fetchFruits();
    } else {
      setFruits([]);
    }
  }, [search, fetchFruits]);

  const allfruits = React.useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/crobs/allcrobs');
      const data = await response.json();

      if (data.success && Array.isArray(data.data)) {
        console.log(data.data);
        setAllFruits(data.data);
      }  else {
          console.log('API returned success: false');
          setAllFruits([]);
      }
    } catch (error) {
      console.error('Error-API:', error);
      setAllFruits([]);
    }
  }, []);

  React.useEffect(() => {
    allfruits();
  }, [allfruits]);

  const icons = {
    "Winterweizen": "🌾",
    "Roggen": "🌾",
    "Gerste": "🌾", 
    "Mais": "🌽",
    "Kartoffeln": "🥔",
    "Zuckerrueben": "🫐",
    "Sonnenblumen": "🌻",
    "Raps": "🌻",
    "Hafer": "🌾",
    "Dinkel": "🌾",
    "Sojabohnen": "🫘",
    "Erbsen": "🫛",
    "Linsen": "🫘",
    "Klee": "🍀",
    "Luzerne": "🌿"
  };

  const getIcon = (name) => {
    return icons[name];
  };

  if (showDashboard && selectedFruit) {
    return <Dashboard selectedFruit={selectedFruit} />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-black/90 text-3xl mb-3 font-medium text-center ">Welche Kulturen baust du an?</h1>
      <div className="mb-8">
        <input type="text"
                value={search}
                onChange={(e) => setsearch(e.target.value)}
                placeholder="Nach Kulturen Suchen"
                className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg" />
      </div>
      <div className="max-w-4xl mx-auto backdrop-blur-sm rounded-3xl shadow-2xl p-8 mt-8">
        {search && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {früchte.map(frucht => (
               <div key={frucht.id} className="border-2 border-gray-200 rounded-xl p-6 cursor-pointer">
                <div className="flex justify-between items-center ">
                  <h3 className="text-xl font-bold mb-3">{frucht.name}</h3>
                  <p className="text-xl bg-purple-400 text-white font-bold px-3 py-1 rounded-xl">{frucht.category}</p>
                </div>
                <p className="text-gray-600 text-lg">{frucht.planting_time}</p>
              </div>
            ))}
          </div>
        )}
        {allfrüchte.map(frucht => (
          <div className="bg-white/95 text-center text-2xl font-medium text-black/70 mt-4 p-4
                          rounded-xl border-2 border-yellow-400/70">
            <div key={frucht.id} className="text-6xl">{getIcon(frucht.name)}</div>
            <div key={frucht.id}>{frucht.name}</div>
            <div key={frucht.id}
                 className="bg-blue-200 text-blue-600 font-bold px-3 py-1 rounded-xl">{frucht.category}</div>
            <button onClick={() => setSelectedFruit(frucht)}>Auswählen</button>
          </div>  
        ))}
      </div>
      {selectedFruit && (
        <button onClick={() => setShowDashboard(true)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mt-8">Weiter</button>
      )}
    </div>
  );
};

export default Selection;
