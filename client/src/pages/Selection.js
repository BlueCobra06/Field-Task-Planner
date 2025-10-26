import React, { useEffect } from 'react';
import { Check, Search } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Selection = () => {
  const [search, setsearch] = React.useState('');
  const [allfrüchte, setAllfrüchte] = React.useState([]);
  const [früchte, setFrüchte] = React.useState([]);
  const [selectedFruitIds, setSelectedFruitIds] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const isFromDashboard = location.state?.fromDashboard || false;

  useEffect(() => {
    loadAllCrops();
    loadUserCrops();
  }, []);

  useEffect(() => {
    if (search.trim()) {
      searchCrops(search);
    } else {
      setFrüchte([]);
    }
  }, [search]);

  const loadAllCrops = async () => {
    try {
      const response = await fetch('/api/crobs/allcrobs');
      const data = await response.json();

      if (data.success) {
        setAllfrüchte(data.data);
      }
    } catch (error) {
      console.error('Fehler beim Laden der Kulturen:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserCrops = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/user/crobs', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();

      if (data.success) {
        const userCropIds = data.data.map(crop => crop.id);
        setSelectedFruitIds(userCropIds);
        if (userCropIds.length > 0 && !isFromDashboard) {
          navigate('/dashboard');
        }
      }
    } catch (error) {
      console.error('Fehler beim Laden der Benutzerkulturen:', error);
    }
  }

  const searchCrops = async (query) => {
    try {
      const response = await fetch(`/api/crobs/crobsbyName?name=${encodeURIComponent(query)}`);
      const data = await response.json();

      if (data.success) {
        setFrüchte(data.data);
      }
    } catch (error) {
      console.error('Fehler bei der Suche nach Kulturen:', error);
    }
  };

  const isSelected = (id) => selectedFruitIds.includes(id);

  const toggleFruit = (id) => {
    setSelectedFruitIds(prevSelected => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter(fruitId => fruitId !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

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

  const saveCrobs = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/user/crobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ selectedFruitIds })
      });
      const data = await response.json();

      if (data.success) {
        navigate('/dashboard');
      } else {
        console.error('Fehler beim Speichern der Kulturen:', data.message);
      }
    } catch (error) {
      console.error('Fehler beim Speichern der Kulturen:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-black/90 text-3xl mb-3 font-medium text-center ">Welche Kulturen baust du an?</h1>
      <div className="max-w-4xl mx-auto backdrop-blur-sm rounded-3xl shadow-2xl p-8 mt-8">
        <div className="mb-4 relative">
          <Search className="absolute w-6 h-6 text-gray-400 top-3 left-3"/>
          <input type="text"
            value={search}
            onChange={(e) => setsearch(e.target.value)}
            placeholder="Nach Kulturen Suchen"
            className="w-full px-4 py-3 text-base bg-gray-100 rounded-lg pl-12" />
        </div>
        {selectedFruitIds.length > 0 && (
            <div className="relative">
              <Check className="absolute text-white w-6 h-6 top-2 left-2"/>
              <button className="pl-10 bg-black text-white p-2 mb-2 rounded-2xl">{selectedFruitIds.length} Kultur ausgewählt</button>
            </div>
          )}
        {search && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {früchte.map(frucht => (
              <div key={frucht.id} className="">
                <button className={`flex items-center w-full p-4 rounded-xl flex flex-col items-center justify-center relative cursor-pointer hover:bg-gray-200 
                                 ${isSelected(frucht.id) ? 'bg-black text-white' : 'bg-gray-100 text-black'}`}
                  onClick={() => toggleFruit(frucht.id)}>
                  <span className="text-2xl flex-shrink-0">{getIcon(frucht.name)}</span>
                  {frucht.name}
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {!search && (
          <>
            {allfrüchte.map(frucht => (
              <div key={frucht.id} className="">
                <button className={`flex items-center w-full p-4 rounded-xl flex flex-col items-center justify-center relative cursor-pointer hover:bg-gray-200 
                                 ${isSelected(frucht.id) ? 'bg-black text-white' : 'bg-gray-100 text-black'}`}
                  onClick={() => toggleFruit(frucht.id)}>
                  <span className="text-2xl flex-shrink-0">{getIcon(frucht.name)}</span>
                  {frucht.name}
                </button>
              </div>
            ))}
          </>
        )}
        </div>
        {selectedFruitIds.length > 0 && (
          <div className="flex items-center justify-between mt-2">
            <button className="bg-gray-100 rounded-2xl whitespace-nowrap px-4 py-2" onClick={() => setSelectedFruitIds([])}>Auswahl zurücksetzen</button>
            <button 
              onClick={saveCrobs}
              disabled={isLoading}
              className="bg-black text-white font-bold py-2 px-4 rounded-2xl whitespace-nowrap disabled:opacity-50">
              {isLoading ? 'Speichere...' : `Weiter mit ${selectedFruitIds.length} Kultur`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Selection;
