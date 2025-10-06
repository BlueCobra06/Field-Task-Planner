import React from 'react';
import { Settings, MapPin, Calendar, BarChart3 } from 'lucide-react';

const Schnellzugriff = ({onBack}) => {
    return (
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
            {onBack && (
            <button
                onClick={onBack}
                className="mt-8 px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                Zurück zur Auswahl
            </button>
        )}
        </div>

    )
};

export { Schnellzugriff };