/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';
import Navbar from '../components/Navbar';
import { 
    Loader2, Camera, Mail, ShieldCheck, Save, X, 
    CheckCircle2, ArrowLeft, User as UserIcon, Settings2 
} from 'lucide-react';

export default function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);

    const [editData, setEditData] = useState({ firstname: '', lastname: '', email: '' });
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const fileInputRef = useRef(null);

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const res = await API.get('/auth/me');
            const userData = res.data.data;
            setUser(userData);
            resetEditForm(userData);
        } catch (err) {
            if (err.response?.status === 401) handleLogout();
        } finally {
            setLoading(false);
        }
    };

    const resetEditForm = (userData) => {
        setEditData({
            firstname: userData.firstname,
            lastname: userData.lastname,
            email: userData.email
        });
        setSelectedFile(null);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            setIsEditing(true);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const formData = new FormData();
            formData.append('firstname', editData.firstname);
            formData.append('lastname', editData.lastname);
            formData.append('email', editData.email);
            if (selectedFile) formData.append('avatar', selectedFile);

            const res = await API.put('/auth/me', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setUser(res.data.data);
            setIsEditing(false);
            setSelectedFile(null);
            setPreviewUrl(null);
            alert("Cập nhật thông tin thành công!");
        } catch (err) {
            alert(err.response?.data?.message || "Lỗi khi lưu thông tin");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="animate-spin text-indigo-600" size={48} />
                <p className="text-gray-500 font-medium animate-pulse">Đang tải hồ sơ...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            <Navbar user={user} onLogout={handleLogout} />

            <main className="max-w-3xl mx-auto px-4 py-8">
                {/* Nút quay lại */}
                <button 
                    onClick={() => navigate(-1)}
                    className="group mb-6 flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors font-medium cursor-pointer"
                >
                    <div className="p-2 rounded-full group-hover:bg-indigo-50 transition-colors">
                        <ArrowLeft size={20} />
                    </div>
                    Quay lại
                </button>

                <div className="bg-white rounded-4xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Header Background - Đã sửa thành bg-linear-to-br */}
                    <div className="h-40 bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 relative">
                        <div className="absolute inset-0 bg-black/10"></div>
                    </div>

                    <div className="px-8 pb-10">
                        {/* Avatar Section */}
                        <div className="relative -mt-20 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div className="relative inline-block">
                                <div className="relative group">
                                    <img
                                        src={previewUrl || (user?.avatar ? `http://localhost:5000/${user.avatar}` : `https://ui-avatars.com/api/?name=${user?.firstname}&background=6366f1&color=fff`)}
                                        className={`w-40 h-40 rounded-4xl border-[6px] border-white object-cover shadow-xl transition-transform duration-300 group-hover:scale-[1.02] ${selectedFile ? 'ring-4 ring-green-400' : ''}`}
                                        alt="profile"
                                    />
                                    <button
                                        onClick={() => fileInputRef.current.click()}
                                        className="absolute bottom-2 right-2 bg-indigo-600 text-white p-3 rounded-2xl shadow-lg hover:bg-indigo-700 transition-all active:scale-90 border-4 border-white cursor-pointer"
                                    >
                                        <Camera size={20} />
                                    </button>
                                </div>
                                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileSelect} />
                            </div>

                            <div className="flex gap-3 h-fit">
                                {isEditing ? (
                                    <>
                                        <button 
                                            onClick={() => { setIsEditing(false); resetEditForm(user); }}
                                            className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all cursor-pointer"
                                        >
                                            <X size={18} /> Hủy
                                        </button>
                                        <button 
                                            onClick={handleSave} 
                                            disabled={saving}
                                            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-70 cursor-pointer"
                                        >
                                            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Lưu hồ sơ
                                        </button>
                                    </>
                                ) : (
                                    <button 
                                        onClick={() => setIsEditing(true)}
                                        className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-100 text-gray-700 rounded-2xl font-bold hover:border-indigo-100 hover:bg-indigo-50/30 transition-all shadow-sm cursor-pointer"
                                    >
                                        <Settings2 size={18} className="text-indigo-500" /> Chỉnh sửa
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Form Section */}
                        <div className="grid grid-cols-1 gap-8">
                            <section>
                                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <UserIcon size={16} /> Thông tin cơ bản
                                </h2>
                                
                                {isEditing ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-300">
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-gray-500 ml-1">Họ</label>
                                            <input
                                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none transition-all font-medium text-gray-700"
                                                value={editData.lastname}
                                                onChange={e => setEditData({ ...editData, lastname: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-gray-500 ml-1">Tên</label>
                                            <input
                                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none transition-all font-medium text-gray-700"
                                                value={editData.firstname}
                                                onChange={e => setEditData({ ...editData, firstname: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-gray-50/50 p-6 rounded-4xl border border-gray-100">
                                        <p className="text-3xl font-black text-gray-800 tracking-tight">
                                            {user?.lastname} {user?.firstname}
                                        </p>
                                        <p className="text-indigo-600 font-semibold mt-1">Thành viên TaskFlow</p>
                                    </div>
                                )}
                            </section>

                            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className={`group flex items-center gap-4 p-5 rounded-4xl border-2 transition-all ${isEditing ? 'bg-indigo-50/30 border-indigo-200' : 'bg-white border-gray-50 shadow-sm'}`}>
                                    <div className="p-3 bg-white rounded-2xl shadow-sm text-indigo-600 group-hover:scale-110 transition-transform">
                                        <Mail size={24} />
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Email liên hệ</p>
                                        {isEditing ? (
                                            <input
                                                className="w-full bg-transparent border-none outline-none font-bold text-gray-700 p-0 focus:ring-0"
                                                value={editData.email}
                                                onChange={e => setEditData({ ...editData, email: e.target.value })}
                                            />
                                        ) : (
                                            <p className="font-bold text-gray-700 truncate">{user?.email}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 p-5 bg-white border-2 border-gray-50 rounded-4xl shadow-sm group">
                                    <div className="p-3 bg-green-50 rounded-2xl text-green-600 group-hover:scale-110 transition-transform">
                                        <ShieldCheck size={24} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Trạng thái tài khoản</p>
                                        <div className="flex items-center gap-1.5 text-green-600 font-bold text-sm">
                                            <CheckCircle2 size={16} />
                                            <span>Đã xác thực</span>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}