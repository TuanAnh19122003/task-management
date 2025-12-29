import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';
import API from '../api/api';

export default function Login({ onLoginSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); 
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await API.post('/auth/login', { email, password });
            const token = res.data.token || res.data.data?.token;

            if (token) {
                localStorage.setItem('token', token);
                if (rememberMe) {
                    localStorage.setItem('rememberedEmail', email);
                } else {
                    localStorage.removeItem('rememberedEmail');
                }

                if (onLoginSuccess) onLoginSuccess();
                navigate('/');
            } else {
                setError('Không nhận được mã xác thực từ máy chủ');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Email hoặc mật khẩu không đúng');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                <div className="text-center mb-10">
                    <div className="bg-blue-600 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
                        <Lock className="text-white" size={24} />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Chào mừng trở lại</h2>
                    <p className="text-gray-400 mt-2">Đăng nhập để tiếp tục quản lý công việc</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 animate-pulse">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    {/* Email Input */}
                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                        <input
                            type="email"
                            placeholder="Email của bạn"
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>

                    {/* Password Input với nút Hiện mật khẩu */}
                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Mật khẩu"
                            className="w-full pl-12 pr-12 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                            required
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    {/* Ghi nhớ & Quên mật khẩu */}
                    <div className="flex items-center justify-between px-1">
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <input
                                type="checkbox"
                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            <span className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors">Ghi nhớ tôi</span>
                        </label>
                        <Link to="/forgot-password" size={20} className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">
                            Quên mật khẩu?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-4 rounded-2xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all transform active:scale-[0.98]"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : "Đăng nhập"}
                        {!loading && <ArrowRight size={20} />}
                    </button>
                </form>

                <p className="mt-8 text-center text-gray-500">
                    Chưa có tài khoản? <Link to="/register" className="text-blue-600 font-bold hover:underline">Đăng ký ngay</Link>
                </p>
            </div>
        </div>
    );
}