import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';
import Toast from '../components/Toast';

export default function Register() {
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [toast, setToast] = useState({ message: '', type: 'success' });
    const navigate = useNavigate();

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast({ message: '', type }), 3000);
    };

    const handleRegister = async e => {
        e.preventDefault();
        try {
            await API.post('/auth/register', { firstname, lastname, email, password });
            showToast('Register successful!', 'success');
            navigate('/login');
        } catch (err) {
            showToast(err.response?.data?.message || err.message, 'error');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleRegister} className="bg-white p-8 rounded shadow flex flex-col gap-4 w-96">
                <h2 className="text-2xl font-bold text-center">Register</h2>
                <input
                    type="text"
                    placeholder="First Name"
                    value={firstname}
                    onChange={e => setFirstname(e.target.value)}
                    className="border p-2 rounded"
                    required
                />
                <input
                    type="text"
                    placeholder="Last Name"
                    value={lastname}
                    onChange={e => setLastname(e.target.value)}
                    className="border p-2 rounded"
                    required
                />
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
                <button className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Register</button>
                <p className="text-center text-gray-500">
                    Already have an account? <Link className="text-blue-500" to="/login">Login</Link>
                </p>
            </form>
            <Toast message={toast.message} type={toast.type} />
        </div>
    );
}
