import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import API from '../api/api';
import Navbar from '../components/Navbar';
import TaskItem from '../components/TaskItem';
import Modal from '../components/Modal';
import { Plus, Loader2, Kanban, CheckCircle2, Calendar, AlertCircle, ChevronRight, Calendar as CalendarIcon, Target } from 'lucide-react';

export default function Dashboard() {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [formData, setFormData] = useState({ title: '', description: '', deadline: '', status: 'todo' });

    // Tính toán thống kê
    const stats = useMemo(() => {
        const total = tasks.length;
        const done = tasks.filter(t => t.status === 'done').length;

        // Tính task sắp hết hạn (còn dưới 48h và chưa done)
        const now = new Date();
        const urgentTasks = tasks.filter(t => {
            if (!t.deadline || t.status === 'done') return false;
            const diff = new Date(t.deadline) - now;
            return diff > 0 && diff < (48 * 60 * 60 * 1000);
        }).length;

        return {
            total,
            done,
            percent: total > 0 ? Math.round((done / total) * 100) : 0,
            urgentTasks
        };
    }, [tasks]);

    const loadInitialData = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) { navigate('/login'); return; }
            const [uRes, tRes] = await Promise.all([API.get('/auth/me'), API.get('/tasks')]);
            setUser(uRes.data.data);
            setTasks(tRes.data.data || []);
        } catch {
            navigate('/login');
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => { loadInitialData(); }, [loadInitialData]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        // Sử dụng window.location để reset hoàn toàn bộ nhớ cache/state bị lag
        window.location.href = '/login';
    };

    // ... (Giữ nguyên hàm onDragEnd, refreshTasks, handleOpenEdit, handleSubmit từ code cũ của bạn)
    const refreshTasks = async () => {
        try {
            const tRes = await API.get('/tasks');
            setTasks(tRes.data.data || []);
        } catch (error) { console.error(error); }
    };

    const onDragEnd = async (result) => {
        const { destination, source, draggableId } = result;
        if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) return;
        const newStatus = destination.droppableId;
        const originalTasks = [...tasks];
        setTasks(tasks.map(t => t.id.toString() === draggableId ? { ...t, status: newStatus } : t));
        try {
            await API.put(`/tasks/${draggableId}`, { status: newStatus });
        } catch {
            setTasks(originalTasks);
            alert("Lỗi cập nhật!");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingTask) await API.put(`/tasks/${editingTask.id}`, formData);
            else await API.post('/tasks', formData);
            setIsFormOpen(false);
            refreshTasks();
        } catch { alert("Lỗi!"); }
    };

    const handleOpenEdit = (task) => {
        setEditingTask(task);
        setFormData({
            title: task.title,
            description: task.description || '',
            deadline: task.deadline ? new Date(task.deadline).toISOString().substring(0, 16) : '',
            status: task.status
        });
        setIsFormOpen(true);
    };

    // Hàm hiển thị lịch sử
    const handleShowHistory = (task) => {
        alert(`Tính năng lịch sử cho: ${task.title} đang được phát triển.`);
    };

    // Hàm xóa Task
    const handleDelete = async (id) => {
        try {
            await API.delete(`/tasks/${id}`);
            refreshTasks();
        } catch {
            alert("Không thể xóa công việc này.");
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <Loader2 className="animate-spin text-indigo-600" size={32} />
        </div>
    );

    return (
        <div className="min-h-screen bg-white font-sans">
            <Navbar user={user} onLogout={handleLogout} />

            <main className="max-w-350 mx-auto px-4 md:px-8 py-8 md:py-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-xl shadow-indigo-100">
                            <Kanban className="text-white" size={24} />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Bảng công việc</h2>
                    </div>
                    <button
                        onClick={() => { setEditingTask(null); setFormData({ title: '', description: '', deadline: '', status: 'todo' }); setIsFormOpen(true); }}
                        className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2 active:scale-95 shadow-xl shadow-indigo-100"
                    >
                        <Plus size={20} /> Tạo task mới
                    </button>
                </div>

                {/* --- ANALYTICS BAR (Đã tối ưu Responsive) --- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {/* Card Tiến Độ */}
                    <div className="bg-linear-to-br from-indigo-600 to-blue-500 rounded-4xl p-7 text-white shadow-xl shadow-blue-100 transition-transform hover:scale-[1.02]">
                        <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-1">Tiến độ</p>
                        <div className="flex items-end justify-between">
                            <h4 className="text-4xl font-black">{stats.done}/{stats.total}</h4>
                            <CheckCircle2 size={36} className="opacity-30" />
                        </div>
                        <div className="mt-6 h-1.5 bg-white/20 rounded-full overflow-hidden shadow-inner">
                            <div className="h-full bg-white transition-all duration-1000 ease-out" style={{ width: `${stats.percent}%` }}></div>
                        </div>
                        <p className="text-xs font-bold mt-3 text-white/90">{stats.percent}% hoàn thành</p>
                    </div>

                    {/* Card Thời Gian */}
                    <div className="bg-gray-50 rounded-4xl p-7 border border-gray-100 group hover:bg-white hover:shadow-xl transition-all">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Hôm nay</p>
                        <div className="flex items-end justify-between">
                            <h4 className="text-2xl font-black text-gray-900">Tháng {new Date().getMonth() + 1}</h4>
                            <Calendar size={36} className="text-gray-200 group-hover:text-indigo-600 transition-colors" />
                        </div>
                        <p className="text-sm font-bold text-gray-500 mt-6 lowercase italic">
                            {new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric' })}
                        </p>
                    </div>

                    {/* Card Gấp */}
                    <div className="bg-gray-50 rounded-4xl p-7 border border-gray-100 group hover:bg-white hover:shadow-xl transition-all sm:col-span-2 lg:col-span-1">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Cần lưu ý</p>
                        <div className="flex items-end justify-between">
                            <h4 className="text-2xl font-black text-gray-900">{stats.urgentTasks} Task đến hạn</h4>
                            <AlertCircle size={36} className="text-gray-200 group-hover:text-amber-500 transition-colors" />
                        </div>
                        <button className="text-[11px] font-black text-indigo-600 uppercase mt-6 flex items-center gap-2 hover:gap-3 transition-all">
                            Xem ngay <ChevronRight size={14} />
                        </button>
                    </div>
                </div>

                {/* --- KANBAN BOARD --- */}
                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="flex flex-col lg:flex-row gap-6 md:gap-8 overflow-x-auto pb-6">
                        {['todo', 'doing', 'done'].map((columnId) => {
                            const columnTasks = tasks.filter(t => t.status === columnId);

                            return (
                                <div key={columnId} className="flex-1 min-w-[320px] bg-gray-50/50 rounded-[40px] p-6 flex flex-col border border-gray-100/50 min-h-125 lg:h-[calc(100vh-380px)]">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="font-black text-gray-700 uppercase text-[11px] tracking-widest flex items-center gap-2">
                                            <div className={`w-2.5 h-2.5 rounded-full ${columnId === 'todo' ? 'bg-gray-300' : columnId === 'doing' ? 'bg-indigo-500' : 'bg-emerald-500'}`} />
                                            {columnId === 'todo' ? 'Cần làm' : columnId === 'doing' ? 'Đang làm' : 'Xong'}
                                        </h3>
                                        <span className="text-[10px] font-black bg-white px-3 py-1.5 rounded-xl border border-gray-100 text-gray-400 shadow-sm">
                                            {columnTasks.length}
                                        </span>
                                    </div>

                                    <Droppable droppableId={columnId}>
                                        {(provided, snapshot) => (
                                            <div
                                                {...provided.droppableProps}
                                                ref={provided.innerRef}
                                                className={`flex-1 flex flex-col space-y-4 overflow-y-auto pr-2 transition-all rounded-3xl ${snapshot.isDraggingOver ? 'bg-indigo-50/40' : ''}`}
                                            >
                                                {/* KIỂM TRA NẾU CỘT TRỐNG */}
                                                {columnTasks.length === 0 ? (
                                                    <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-3xl p-8 text-center">
                                                        <div className="bg-gray-100 p-4 rounded-full mb-3">
                                                            <Target className="text-gray-300" size={32} />
                                                        </div>
                                                        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Trống</p>
                                                        <p className="text-gray-300 text-[10px] mt-1 italic">Kéo thả hoặc tạo task mới</p>
                                                    </div>
                                                ) : (
                                                    columnTasks.map((task, index) => (
                                                        <Draggable key={task.id.toString()} draggableId={task.id.toString()} index={index}>
                                                            {(provided, snapshot) => (
                                                                <div
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                    className={snapshot.isDragging ? "z-50" : ""}
                                                                >
                                                                    <TaskItem
                                                                        task={task}
                                                                        onEdit={handleOpenEdit}
                                                                        onDelete={handleDelete}
                                                                        onShowHistory={handleShowHistory}
                                                                    />
                                                                </div>
                                                            )}
                                                        </Draggable>
                                                    ))
                                                )}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </div>
                            );
                        })}
                    </div>
                </DragDropContext>
            </main>

            {/* Modal giữ nguyên */}
            <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={editingTask ? "Cập nhật" : "Tạo task"}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input className="w-full p-4 bg-gray-50 rounded-2xl font-bold outline-none border border-transparent focus:border-indigo-500 transition-all" placeholder="Tiêu đề" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                    <textarea className="w-full p-4 bg-gray-50 rounded-2xl font-bold outline-none h-32 border border-transparent focus:border-indigo-500 transition-all resize-none" placeholder="Mô tả" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                    <div className="grid grid-cols-2 gap-4">
                        <input type="datetime-local" className="w-full p-4 bg-gray-50 rounded-2xl font-bold outline-none" value={formData.deadline} onChange={e => setFormData({ ...formData, deadline: e.target.value })} />
                        <select className="w-full p-4 bg-gray-50 rounded-2xl font-bold outline-none cursor-pointer" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                            <option value="todo">Cần làm</option>
                            <option value="doing">Đang làm</option>
                            <option value="done">Hoàn thành</option>
                        </select>
                    </div>
                    <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-black shadow-lg shadow-indigo-100 transition-all active:scale-95">Lưu lại</button>
                </form>
            </Modal>
        </div>
    );
}