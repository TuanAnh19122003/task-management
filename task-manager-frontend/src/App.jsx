import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">Hello TailwindCSS!</h1>
        <p className="text-gray-700 mb-6">This is a simple demo using Tailwind with React + Vite.</p>
        <button className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition">
          Click Me
        </button>
      </div>
    </div>
  );
}

export default App;
