import React, { useEffect, useState } from 'react';
import { Settings, CloudDrizzle, Cloud, Wind, CloudRain, CloudSnow, Sun} from 'lucide-react';

const Wetter = () => {
    const [temperature, setTemperature] = useState(null);
    const [precipitation, setPrecipitation] = useState(null);
    const [humidity, setHumidity] = useState(null);
    const [forecast, setForecast] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [city, setCity] = useState('Berlin');
    const [loading, setLoading] = useState(false);

    const getwetter = async(city) => {
        if (!city) return;
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/wetter/data?ort=${encodeURIComponent(city)}`, {
            headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            
            if (data.success) {
                setTemperature(data.data.current.temperature_2m);
                setPrecipitation(data.data.current.precipitation);
                setHumidity(data.data.current.relative_humidity_2m);

                const daily = data.data.daily;
                const forecastArray = daily.time.map((date, index) => ({
                  date: date,
                  tempMax: daily.temperature_2m_max[index],
                  tempMin: daily.temperature_2m_min[index],
                  humidity: daily.relative_humidity_2m_max[index],
                  precipitation: daily.precipitation_sum[index],
                  weatherCode: daily.weather_code[index]
                }));
                setForecast(forecastArray);

                console.log(data.data);
                console.log(forecastArray);
            }
        } catch (error) {
            console.log(error);
        } finally {
          setLoading(false);
        }
    };

    useEffect(() => {
      const init = async () => {
          const savedCity = await getLocation();
          await getwetter(savedCity);
        };
      init();  
    }, []);

    const handleConfirm = async () => {
      await saveLocation(city);
      await getwetter(city);
      setIsOpen(false);
    };

    const getWochentag = (day) => {
      const tage = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
      const date = new Date(day);
      return tage[date.getDay()];
    }

    const getWetterEmoji = (code) => {
      if (code === 0) return <Sun className="w-6 h-6 text-yellow-400" />;
      if (code >= 1 && code <= 3) return <Cloud className="w-6 h-6 text-gray-300" />;
      if (code >= 45 && code <= 48) return <Wind className="w-6 h-6 text-gray-400" />;
      if (code >= 51 && code <= 67) return <CloudRain className="w-6 h-6 text-blue-400" />;
      if (code >= 71 && code <= 77) return <CloudSnow className="w-6 h-6 text-blue-200" />;
      if (code >= 80 && code <= 82) return <CloudDrizzle className="w-6 h-6 text-blue-300" />;
      if (code >= 85 && code <= 86) return <CloudSnow className="w-6 h-6 text-white" />;
      if (code >= 95 && code <= 99) return <CloudRain className="w-6 h-6 text-purple-400" />;
      return <Cloud className="w-6 h-6 text-gray-400" />;
    };

    const getLocation = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/wetter/location', {
                headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();

        if (data.success && data.data.location) {
          setCity(data.data.location);
          return data.data.location;
        } else {
          return 'Berlin';
        }
      } catch (error) {
        return 'Berlin';
      }   
    };

    const saveLocation = async (location) => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/wetter/location', {
            method: 'PUT',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ location: city })
        });
        const data = await response.json();

        if (data.success) {
          console.log('✅ Location gespeichert:', city);
        } 
      } catch (error) {
        console.log('❌ Fehler beim Speichern:', error);
      }   
    };    

    return (
        <div className="flex flex-col mt-8 bg-slate-800 p-6 shadow-xl rounded-3xl relative overflow-hidden">
          {isOpen && (
            <div className="bg-slate-800 p-6 z-10 absolute top-0 left-0 w-full h-full rounded-3xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white text-xl font-bold">Einstellungen</p>
                  <p className="text-xl text-white mb-2">{city}</p>
                </div>
                <button className="text-white text-2xl hover:text-gray-300" onClick={() => setIsOpen(false)}>
                  ✕
                </button>
              </div>
              <div className="relative mb-4">
                <input className="w-full px-3 py-3 pr-12 border-2 border-slate-600 bg-slate-700 rounded-xl text-white placeholder-gray-400" 
                      type="text" 
                      placeholder="Stadt eingeben"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleConfirm()}
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  🔍
                </button>
              </div>
              <button 
                onClick={handleConfirm}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition-all">
                Bestätigen
              </button>     
            </div>
          )}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-white">⛅ Wetter</p>
            </div>
            <button className="p-2 hover:bg-slate-700 rounded-xl transition-all" onClick={() => setIsOpen(true)}>
              <Settings className="w-6 h-6 text-white"/>
            </button>
          </div>
          <div className="text-center">
            <p className="text-lg text-gray-400 font-medium">{city}</p>
            <p className="text-6xl font-bold text-white">{temperature}°C</p>
            <p className="text-xl text-gray-400">Sonnig</p>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4 text-center">
            <div>
              <p className="opacity-50 text-white">Luftfeuchtigkeit</p>
              <p className="font-bold text-white">{humidity}%</p>
            </div>
            <div>
              <p className="opacity-50 text-white">Niederschlag</p>
              <p className="font-bold text-white">{precipitation} mm</p>
            </div>
          </div>
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-600">
              <p className="font-bold text-lg text-white">📅 7-Tage Vorhersage</p>
            </div>
            <div className="mt-2 grid grid-cols-1 gap-3">
              {forecast.map((day, index) => (
                <div key={index} className="flex flex-row items-center justify-between bg-slate-700 p-4 rounded-xl hover:bg-slate-600 transition-all">
                  <p className="text-xl text-gray-400 min-w-[120px]">{getWochentag(day.date)}</p>
                  <div className="flex flex-row items-center gap-3">
                    <p className="text-2xl">{getWetterEmoji(day.weatherCode)}</p>
                    <p className="font-bold text-xl text-white min-w-[60px] text-right">
                      {Math.round(day.tempMax)}°C
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div> 
    )
};

export { Wetter };