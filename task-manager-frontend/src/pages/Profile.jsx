import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Save, ArrowLeft, Loader2, Camera } from 'lucide-react';
import API from '../api/api';
import Navbar from '../components/Navbar';

export default function Profile() {
    const [formData, setFormData] = useState({ firstname: '', lastname: '', email: '', avatar: '' });
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const fileInputRef = useRef();
    const navigate = useNavigate();
    const BASE_URL = 'http://localhost:5000'; // Thay bằng URL backend của bạn

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await API.get('/auth/me');
                const user = res.data.data;
                setFormData({
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                    avatar: user.avatar
                });
                if (user.avatar) {
                    setPreviewUrl(`${BASE_URL}/${user.avatar}`);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file)); // Tạo link ảnh tạm thời để xem trước
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        // SỬ DỤNG FORMDATA ĐỂ GỬI FILE
        const data = new FormData();
        data.append('firstname', formData.firstname);
        data.append('lastname', formData.lastname);
        data.append('email', formData.email);
        if (selectedFile) {
            data.append('avatar', selectedFile);
        }

        try {
            await API.put('/auth/me', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert("Cập nhật thông tin thành công!");
            window.location.reload(); // Reload để cập nhật ảnh trên Navbar
        } catch (err) {
            alert(err.response?.data?.message || "Lỗi cập nhật");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="flex justify-center mt-20"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar user={formData} />
            <div className="max-w-2xl mx-auto px-4 py-12">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-6 transition-colors">
                    <ArrowLeft size={18} /> Quay lại
                </button>

                <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                    <h2 className="text-2xl font-black text-gray-900 mb-8">Thông tin cá nhân</h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* PHẦN CHỈNH SỬA ẢNH ĐẠI DIỆN */}
                        <div className="flex flex-col items-center mb-8">
                            <div className="relative group">
                                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-200">
                                    {previewUrl ? (
                                        <img src={previewUrl} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            <User size={48} />
                                        </div>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current.click()}
                                    className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-all"
                                >
                                    <Camera size={18} />
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    className="hidden"
                                    accept="image/*"
                                />
                            </div>
                            <p className="text-xs text-gray-400 mt-2 italic">Nhấp vào icon máy ảnh để thay đổi ảnh</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Họ</label>
                                <input
                                    className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none mt-1"
                                    value={formData.firstname}
                                    onChange={e => setFormData({ ...formData, firstname: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Tên</label>
                                <input
                                    className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none mt-1"
                                    value={formData.lastname}
                                    onChange={e => setFormData({ ...formData, lastname: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase ml-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                                <input
                                    type="email"
                                    className="w-full pl-12 p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none mt-1"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <button
                            disabled={submitting}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95"
                        >
                            {submitting ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                            {submitting ? "Đang xử lý..." : "Lưu thay đổi"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}