import React from 'react';
import { Settings, MapPin, Calendar, BarChart3 } from 'lucide-react';

const Schnellzugriff = ({onBack}) => {
    return (
        <div className="bg-slate-800 p-6 shadow-xl rounded-3xl mt-8">
            <p className="text-2xl font-medium text-white">Schnellzugriff</p>
            <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="flex flex-col items-center justify-center bg-slate-700 p-4 shadow-xl rounded-3xl text-white">
                    <MapPin className="w-8 h-8 mb-2" />
                    <p className="text-xl">Felder</p>
                </div>
                <div className="flex flex-col items-center justify-center bg-slate-700 p-4 shadow-xl rounded-3xl text-white">
                    <Calendar className="w-8 h-8 mb-2" />
                    <p className="text-xl">Planung</p>
                </div>
                <div className="flex flex-col items-center justify-center bg-slate-700 p-4 shadow-xl rounded-3xl text-white">
                    <BarChart3 className="w-8 h-8 mb-2" />
                    <p className="text-xl">Berichte</p>
                </div>
                <div className="flex flex-col items-center justify-center bg-slate-700 p-4 shadow-xl rounded-3xl text-white">
                    <Settings className="w-8 h-8 mb-2" />
                    <p className="text-xl">Einstellungen</p>
                </div>
            </div>
            {onBack && (
            <button
                onClick={onBack}
                className="mt-8 px-6 py-2 bg-slate-700 rounded-lg hover:bg-gray-300 text-white"
                >
                Zurück zur Auswahl
            </button>
        )}
        </div>

    )
};

export { Schnellzugriff };