import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ user }) {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
                <span className="font-bold text-lg">Task Manager</span>
                {user && <span className="text-sm">Hi, {user.firstname}</span>}
            </div>
            <div className="flex items-center gap-2">
                {user && user.avatar && (
                    <img src={user.avatar} alt="avatar" className="w-8 h-8 rounded-full" />
                )}
                <button className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-200" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </nav>
    );
}
