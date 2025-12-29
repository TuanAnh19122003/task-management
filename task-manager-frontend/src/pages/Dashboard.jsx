import React, { useState, useEffect, useCallback } from 'react';
import API from '../api/api';
import Navbar from '../components/Navbar';
import TaskItem from '../components/TaskItem';
import Modal from '../components/Modal';
import { Plus, Loader2 } from 'lucide-react';

export default function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [user, setUser] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true); // Thêm loading state

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [formData, setFormData] = useState({ title: '', description: '', deadline: '', status: 'todo' });
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    // Dùng useCallback để hàm refresh có thể gọi từ nhiều nơi mà không gây loop
    const loadInitialData = useCallback(async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            if (!token) {
                window.location.href = '/login';
                return;
            }

            const [uRes, tRes] = await Promise.all([
                API.get('/auth/me'),
                API.get('/tasks')
            ]);

            setUser(uRes.data.data);
            setTasks(tRes.data.data);
        } catch (err) {
            console.error("Lỗi tải dữ liệu:", err);
            if (err.response?.status === 401) {
                // SỬA TẠI ĐÂY: Chỉ xóa token, không dùng clear()
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        } finally {
            setLoading(false);
        }
    }, []);

    // Hàm xử lý đăng xuất an toàn
    const handleLogout = () => {
        localStorage.removeItem('token'); // Chỉ xóa token xác thực
        // Không xóa 'rememberedEmail' để tính năng ghi nhớ vẫn hoạt động
        window.location.href = '/login';
    };

    // Tự động gọi lại dữ liệu khi F5 trang
    useEffect(() => {
        loadInitialData();
    }, [loadInitialData]);

    const refreshTasks = async () => {
        try {
            const tRes = await API.get('/tasks');
            setTasks(tRes.data.data);
        } catch (err) {
            console.error("Lỗi làm mới danh sách:", err);
        }
    };

    const openCreateModal = () => {
        setEditingTask(null);
        setFormData({ title: '', description: '', deadline: '', status: 'todo' });
        setIsFormOpen(true);
    };

    const openEditModal = (task) => {
        setEditingTask(task);
        setFormData({
            title: task.title,
            description: task.description || '',
            deadline: task.deadline ? new Date(task.deadline).toISOString().substring(0, 16) : '',
            status: task.status
        });
        setIsFormOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingTask) {
                await API.put(`/tasks/${editingTask.id}`, formData);
            } else {
                await API.post('/tasks', formData);
            }
            setIsFormOpen(false);
            refreshTasks();
        } catch (err) {
            console.error(err);
            alert("Có lỗi xảy ra khi lưu dữ liệu vào Database!");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa task này khỏi hệ thống?")) {
            try {
                await API.delete(`/tasks/${id}`);
                refreshTasks();
            } catch (err) {
                console.error(err);
            }
        }
    };

    const showHistory = async (task) => {
        try {
            const res = await API.get(`/tasks/${task.id}/history`);
            setHistory(res.data.data);
            setIsHistoryOpen(true);
        } catch (err) {
            console.error(err);
        }
    };

    const renderColumn = (status, title, dotColor) => (
        <div className="flex-1 min-w-72 bg-gray-50/50 rounded-2xl p-4 flex flex-col max-h-[75vh]">
            <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="flex items-center gap-2 font-bold text-gray-700">
                    <span className={`w-2.5 h-2.5 rounded-full ${dotColor}`}></span> {title}
                </h3>
                <span className="text-xs font-bold bg-white px-2 py-0.5 rounded-full shadow-sm text-gray-500">
                    {tasks.filter(t => t.status === status).length}
                </span>
            </div>
            <div className="space-y-3 overflow-y-auto pr-1">
                {tasks.filter(t => t.status === status).map(task => (
                    <TaskItem key={task.id} task={task} onEdit={openEditModal} onDelete={handleDelete} onShowHistory={showHistory} />
                ))}
            </div>
        </div>
    );

    // Màn hình loading khi F5 trang
    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
                <p className="text-gray-500 font-medium tracking-wide">Đang đồng bộ dữ liệu với Database...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <Navbar user={user} onLogout={handleLogout} />

            <main className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-2xl font-black tracking-tight text-gray-800 uppercase">Dự án của tôi</h2>
                        <p className="text-gray-400 text-sm">Chào mừng trở lại, {user?.firstname}!</p>
                    </div>
                    <button onClick={openCreateModal} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-100 active:scale-95">
                        <Plus size={18} /> Tạo Task Mới
                    </button>
                </div>

                <div className="flex flex-col md:flex-row gap-6 overflow-x-auto pb-4">
                    {renderColumn('todo', 'Cần làm', 'bg-gray-300')}
                    {renderColumn('doing', 'Đang xử lý', 'bg-blue-500')}
                    {renderColumn('done', 'Đã hoàn thành', 'bg-green-500')}
                </div>
            </main>

            <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={editingTask ? "Cập nhật công việc" : "Thiết lập công việc mới"}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tiêu đề công việc</label>
                        <input type="text" required className="w-full p-4 bg-gray-50 border-none rounded-2xl mt-1 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            placeholder="Nhập tên task..." value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Mô tả chi tiết</label>
                        <textarea className="w-full p-4 bg-gray-50 border-none rounded-2xl h-28 mt-1 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                            placeholder="Mô tả nội dung cần làm..." value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Hạn chót</label>
                            <input type="datetime-local" className="w-full p-4 bg-gray-50 border-none rounded-2xl mt-1 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                value={formData.deadline} onChange={e => setFormData({ ...formData, deadline: e.target.value })} />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Trạng thái</label>
                            <select className="w-full p-4 bg-gray-50 border-none rounded-2xl mt-1 focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none cursor-pointer"
                                value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                                <option value="todo">Cần làm</option>
                                <option value="doing">Đang làm</option>
                                <option value="done">Hoàn thành</option>
                            </select>
                        </div>
                    </div>
                    <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all mt-4 active:scale-95">
                        {editingTask ? "Lưu thay đổi" : "Khởi tạo công việc"}
                    </button>
                </form>
            </Modal>

            <Modal isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} title="Lịch sử hoạt động">
                <div className="space-y-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                    {history && history.length > 0 ? (
                        history.map((h, i) => (
                            <div key={i} className="flex gap-3 border-l-2 border-blue-100 pl-4 py-1 relative">
                                <div className="absolute -left-1.5 top-2 w-3 h-3 rounded-full bg-blue-500 border-2 border-white shadow-sm"></div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-700 leading-tight">
                                        Đã chuyển từ <span className="font-bold text-gray-400">{h.oldStatus}</span>
                                        <span className="mx-1">→</span>
                                        <span className="font-bold text-blue-600">{h.newStatus}</span>
                                    </p>
                                    <p className="text-[10px] text-gray-400 mt-1 italic">
                                        {new Date(h.changedAt).toLocaleString('vi-VN')}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10 text-gray-400 text-sm italic">Chưa có dữ liệu lịch sử.</div>
                    )}
                </div>
            </Modal>
        </div>
    );
}