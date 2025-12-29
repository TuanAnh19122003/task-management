import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';
import Toast from '../components/Toast';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [toast, setToast] = useState({ message: '', type: 'success' });
    const navigate = useNavigate();

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast({ message: '', type }), 3000);
    };

    const handleLogin = async e => {
        e.preventDefault();
        try {
            const res = await API.post('/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            showToast('Login successful!', 'success');
            navigate('/');
        } catch (err) {
            showToast(err.response?.data?.message || err.message, 'error');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow flex flex-col gap-4 w-96">
                <h2 className="text-2xl font-bold text-center">Login</h2>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="border p-2 rounded"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="border p-2 rounded"
                    required
                />
                <button className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Login</button>
                <p className="text-center text-gray-500">
                    Don't have an account? <Link className="text-blue-500" to="/register">Register</Link>
                </p>
            </form>
            <Toast message={toast.message} type={toast.type} />
        </div>
    );
}
