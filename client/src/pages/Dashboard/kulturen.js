import React, { useState } from 'react';
import { Trash2, Eye, X, Save, MapPin, Calendar, Droplets, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Kulturen = ({ selectedFruits, loading }) => {
    const navigate = useNavigate();
    const [selectedCrop, setSelectedCrop] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [cropDetails, setCropDetails] = useState({
        fläche: '',
        standort: '',
        aussaatdatum: '',
        ernteerwartung: '',
        bewässerung: 'normal',
        dünger: '',
        notizen: ''
    });
    
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

    const handleOpenModal = async (crop) => {
        setSelectedCrop(crop);
        setIsModalOpen(true);
        
        // Lade existierende Details aus DB
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/user/crobs/${crop.id}/details`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            
            if (data.success && data.data) {
                setCropDetails(data.data);
            }
        } catch (error) {
            console.error('Fehler beim Laden der Details:', error);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedCrop(null);
        setCropDetails({
            fläche: '',
            standort: '',
            aussaatdatum: '',
            ernteerwartung: '',
            bewässerung: 'normal',
            dünger: '',
            notizen: ''
        });
    };

    const handleSaveDetails = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/user/crobs/${selectedCrop.id}/details`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(cropDetails)
            });

            const data = await response.json();

            if (data.success) {
                alert('Details erfolgreich gespeichert!');
                handleCloseModal();
            } else {
                alert('Fehler beim Speichern');
            }
        } catch (error) {
            console.error('Fehler beim Speichern der Details:', error);
            alert('Fehler beim Speichern');
        }
    };
    
    const handlecrobsDelete = async (id) => {
        if (!window.confirm('Möchtest du diese Kultur wirklich löschen?')) return;
        
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/user/crobs/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ fruitIdsToDelete: [id] })
            });

            const data = await response.json();

            if (data.success) {
                window.location.reload();
            } else {
                alert('Fehler beim Löschen');
            }
        } catch (error) {
            console.error('Fehler beim Entfernen der Crobs:', error);
        }
    };

    return (
        <>
            {selectedFruits && selectedFruits.length > 0 && (
                <div className="mt-8 bg-slate-800 p-6 shadow-xl rounded-3xl">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold mb-4 text-white">Deine Kulturen</h2>
                        <button 
                            className="text-white font-bold bg-green-500 p-3 rounded-2xl mb-4 hover:bg-green-600 transition-all" 
                            onClick={() => navigate('/selection', { state: { fromDashboard: true } })}
                        >
                            Hinzufügen
                        </button>
                    </div>
                    <div className="grid grid-rows gap-6">
                        {selectedFruits.map(fruit => (
                            <div key={fruit.id} className="bg-slate-700 p-6 rounded-xl shadow-lg hover:bg-slate-600 transition-all">
                                <div className="flex items-center">
                                    <div className="text-4xl bg-green-500 p-1 rounded-xl">{getIcon(fruit.name)}</div>
                                    <div className="ml-2">
                                        <h3 className="text-xl font-bold text-white">{fruit.name}</h3>
                                        <p className="text-gray-400"> ha</p>
                                    </div>
                                    <div className="ml-auto flex items-center gap-4">
                                        <Eye 
                                            className="w-6 h-6 cursor-pointer hover:text-blue-400 text-white transition-colors" 
                                            onClick={() => handleOpenModal(fruit)}
                                        />
                                        <Trash2 
                                            className="w-6 h-6 cursor-pointer hover:text-red-500 text-white transition-colors" 
                                            onClick={() => handlecrobsDelete(fruit.id)} 
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {isModalOpen && selectedCrop && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-800 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-slate-800 p-6 border-b border-slate-700 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="text-4xl bg-green-500 p-2 rounded-xl">
                                    {getIcon(selectedCrop.name)}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">{selectedCrop.name}</h2>
                                    <p className="text-gray-400">Details bearbeiten</p>
                                </div>
                            </div>
                            <button 
                                onClick={handleCloseModal}
                                className="p-2 hover:bg-slate-700 rounded-xl transition-all"
                            >
                                <X className="w-6 h-6 text-white" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="flex items-center gap-2 text-white font-medium mb-2">
                                    <MapPin className="w-4 h-4" />
                                    Fläche (Hektar)
                                </label>
                                <input 
                                    type="number"
                                    step="0.1"
                                    value={cropDetails.fläche}
                                    onChange={(e) => setCropDetails({...cropDetails, fläche: e.target.value})}
                                    className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                                    placeholder="z.B. 5.5"
                                />
                            </div>
                            <div>
                                <label className="flex items-center gap-2 text-white font-medium mb-2">
                                    <MapPin className="w-4 h-4" />
                                    Standort/Feld
                                </label>
                                <input 
                                    type="text"
                                    value={cropDetails.standort}
                                    onChange={(e) => setCropDetails({...cropDetails, standort: e.target.value})}
                                    className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                                    placeholder="z.B. Feld Nord-Ost"
                                />
                            </div>
                            <div>
                                <label className="flex items-center gap-2 text-white font-medium mb-2">
                                    <Calendar className="w-4 h-4" />
                                    Aussaatdatum
                                </label>
                                <input 
                                    type="date"
                                    value={cropDetails.aussaatdatum}
                                    onChange={(e) => setCropDetails({...cropDetails, aussaatdatum: e.target.value})}
                                    className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="flex items-center gap-2 text-white font-medium mb-2">
                                    <Calendar className="w-4 h-4" />
                                    Erwartete Ernte
                                </label>
                                <input 
                                    type="date"
                                    value={cropDetails.ernteerwartung}
                                    onChange={(e) => setCropDetails({...cropDetails, ernteerwartung: e.target.value})}
                                    className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="flex items-center gap-2 text-white font-medium mb-2">
                                    <Droplets className="w-4 h-4" />
                                    Bewässerung
                                </label>
                                <select 
                                    value={cropDetails.bewässerung}
                                    onChange={(e) => setCropDetails({...cropDetails, bewässerung: e.target.value})}
                                    className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                                >
                                    <option value="gering">Gering</option>
                                    <option value="normal">Normal</option>
                                    <option value="hoch">Hoch</option>
                                </select>
                            </div>
                            <div>
                                <label className="flex items-center gap-2 text-white font-medium mb-2">
                                    <TrendingUp className="w-4 h-4" />
                                    Düngung (kg/ha)
                                </label>
                                <input 
                                    type="text"
                                    value={cropDetails.dünger}
                                    onChange={(e) => setCropDetails({...cropDetails, dünger: e.target.value})}
                                    className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                                    placeholder="z.B. NPK 15-15-15, 200kg/ha"
                                />
                            </div>
                            <div>
                                <label className="text-white font-medium mb-2 block">
                                    Notizen
                                </label>
                                <textarea 
                                    value={cropDetails.notizen}
                                    onChange={(e) => setCropDetails({...cropDetails, notizen: e.target.value})}
                                    rows="4"
                                    className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-green-500 outline-none resize-none"
                                    placeholder="Zusätzliche Informationen..."
                                />
                            </div>
                        </div>
                        <div className="sticky bottom-0 bg-slate-800 p-6 border-t border-slate-700 flex gap-4">
                            <button 
                                onClick={handleCloseModal}
                                className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-all"
                            >
                                Abbrechen
                            </button>
                            <button 
                                onClick={handleSaveDetails}
                                className="flex-1 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                            >
                                <Save className="w-5 h-5" />
                                Speichern
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export { Kulturen };