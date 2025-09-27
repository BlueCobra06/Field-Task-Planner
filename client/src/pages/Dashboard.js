import React from 'react';

const Dashboard = ({ selectedFruit }) => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mb-6">Welcome to your dashboard!</p>
        {selectedFruit && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-green-800">Ausgewählte Kultur:</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <p className="text-gray-700"><strong>Name:</strong> {selectedFruit.name}</p>
              <p className="text-gray-700"><strong>Kategorie:</strong> {selectedFruit.category}</p>
              <p className="text-gray-700"><strong>Pflanzzeit:</strong> {selectedFruit.planting_time}</p>
              <p className="text-gray-700"><strong>Erntezeit:</strong> {selectedFruit.harvest_time}</p>
            </div>
            {selectedFruit.description && (
              <div className="mt-4">
                <p className="text-gray-700"><strong>Beschreibung:</strong></p>
                <p className="text-gray-600 mt-2">{selectedFruit.description}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;