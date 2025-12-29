import React from 'react';

export default function Modal({ isOpen, onClose, onConfirm, title, children }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
                <h2 className="text-xl font-bold mb-4">{title}</h2>
                <div className="mb-4">{children}</div>
                <div className="flex justify-end gap-2">
                    <button className="bg-gray-200 px-4 py-2 rounded" onClick={onClose}>Cancel</button>
                    <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={onConfirm}>Confirm</button>
                </div>
            </div>
        </div>
    );
}