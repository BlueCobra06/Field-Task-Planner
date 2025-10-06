import React, { useState, useEffect } from 'react';
import { Trash2, Eye } from 'lucide-react';

const Kulturen = ({ selectedFruits, loading }) => {
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
        <>
            {selectedFruits && selectedFruits.length > 0 && (
                <div className="mt-8 bg-white p-6 shadow-xl rounded-3xl">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold mb-4">Deine Kulturen</h2>
                        <button className="text-white font-bold bg-black p-2 rounded-2xl">
                            {selectedFruits.length} aktiv
                        </button>
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
                                        <Eye className="w-6 h-6 cursor-pointer hover:text-blue-500" />
                                        <Trash2 className="w-6 h-6 cursor-pointer hover:text-red-500" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};

export { Kulturen };