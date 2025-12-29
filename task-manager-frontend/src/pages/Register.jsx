import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, UserPlus, Loader2 } from 'lucide-react';
import API from '../api/api';

export default function Register() {
    const [formData, setFormData] = useState({ firstname: '', lastname: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await API.post('/auth/register', formData);
            alert("Đăng ký thành công!");
            navigate('/login');
        } catch (err) {
            // Sử dụng err để console lỗi, giúp hết cảnh báo no-unused-vars
            console.error("Lỗi đăng ký:", err);
            alert(err.response?.data?.message || "Lỗi đăng ký");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Tạo tài khoản</h2>
                    <p className="text-gray-400 mt-2">Bắt đầu tối ưu hiệu suất làm việc của bạn</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                    <div className="flex gap-4">
                        <input
                            placeholder="Họ"
                            required
                            className="w-1/2 p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            onChange={e => setFormData({ ...formData, firstname: e.target.value })}
                        />
                        <input
                            placeholder="Tên"
                            required
                            className="w-1/2 p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            onChange={e => setFormData({ ...formData, lastname: e.target.value })}
                        />
                    </div>

                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="email"
                            required
                            placeholder="Email"
                            className="w-full pl-12 p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="password"
                            required
                            placeholder="Mật khẩu"
                            className="w-full pl-12 p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2 transition-all mt-4 
                        ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-900 hover:bg-black text-white active:scale-[0.98]'}`}
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <UserPlus size={20} />
                        )}
                        {loading ? "Đang xử lý..." : "Đăng ký tài khoản"}
                    </button>
                </form>

                <p className="mt-8 text-center text-gray-500 text-sm">
                    Đã là thành viên? <Link to="/login" className="text-blue-600 font-bold hover:underline">Đăng nhập</Link>
                </p>
            </div>
        </div>
    );
}