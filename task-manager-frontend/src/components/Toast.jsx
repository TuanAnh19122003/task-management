import React from 'react';

export default function Toast({ message, type }) {
    if (!message) return null;
    const bg = type === 'error' ? 'bg-red-500' : 'bg-green-500';
    return (
        <div className={`fixed top-5 right-5 text-white px-4 py-2 rounded shadow ${bg}`}>
            {message}
        </div>
    );
}