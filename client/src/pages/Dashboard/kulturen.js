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
                <div className="mt-8 bg-slate-800 p-6 shadow-xl rounded-3xl">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold mb-4 text-white">Deine Kulturen</h2>
                        <button className="text-white font-bold bg-green-500 p-2 rounded-2xl mb-4">
                            {selectedFruits.length} aktiv
                        </button>
                    </div>
                    <div className="grid grid-rows gap-6">
                        {selectedFruits.map(fruit => (
                            <div key={fruit.id} className="bg-slate-700 p-6 rounded-xl shadow-lg">
                                <div className="flex items-center ">
                                    <div className="text-4xl bg-green-500 p-1 rounded-xl">{getIcon(fruit.name)}</div>
                                    <div className="ml-2">
                                        <h3 className="text-xl font-bold text-white">{fruit.name}</h3>
                                        <p className="text-gray-400">{fruit.id} ha</p>
                                    </div>
                                    <div className="ml-auto flex items-center gap-4">
                                        <Eye className="w-6 h-6 cursor-pointer hover:text-slate-500 text-white" />
                                        <Trash2 className="w-6 h-6 cursor-pointer hover:text-red-500 text-white" />
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