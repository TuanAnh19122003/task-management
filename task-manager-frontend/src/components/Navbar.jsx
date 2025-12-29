import React from 'react';
import { LogOut, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar({ user, onLogout }) {
    const BASE_URL = 'http://localhost:5000';

    return (
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-30">
            <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">

                {/* Logo - Nhấn vào để về Dashboard */}
                <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                    <div className="bg-white p-2.5 rounded-xl shadow-lg shadow-blue-100 text-white">
                        <Sparkles className="text-indigo-600" size={24} />
                    </div>
                    <span className="text-xl font-black tracking-tighter text-gray-800">TASKFLOW</span>
                </Link>

                <div className="flex items-center gap-5">

                    {/* Link bao quanh thông tin User để nhấn vào ra Profile */}
                    <Link
                        to="/profile"
                        className="flex items-center gap-4 p-1.5 pr-3 rounded-2xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100"
                    >
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-gray-900 leading-tight">
                                {user?.firstname} {user?.lastname}
                            </p>
                            <p className="text-[11px] font-medium text-blue-500 uppercase tracking-wider">
                                Xem hồ sơ
                            </p>
                        </div>

                        <div className="relative w-12 h-12">
                            <img
                                src={user?.avatar
                                    ? (user.avatar.startsWith('http') ? user.avatar : `${BASE_URL}/${user.avatar}`)
                                    : `https://ui-avatars.com/api/?name=${user?.firstname}&background=2563eb&color=fff`
                                }
                                className="w-full h-full rounded-2xl object-cover border-2 border-white shadow-sm"
                                alt="profile"
                                // Xử lý lỗi nếu ảnh không tồn tại
                                onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${user?.firstname}&background=2563eb&color=fff`; }}
                            />
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full shadow-sm"></div>
                        </div>
                    </Link>

                    {/* Nút Đăng xuất */}
                    <div className="h-8 w-px bg-gray-100 mx-1"></div>

                    <button
                        onClick={onLogout}
                        title="Đăng xuất"
                        className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                        <LogOut size={22} />
                    </button>
                </div>
            </div>
        </nav>
    );
}