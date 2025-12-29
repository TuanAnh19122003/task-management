import React, { useState, useEffect } from 'react';
import API from '../api';
import Navbar from '../components/Navbar';
import TaskForm from '../components/TaskForm';
import TaskItem from '../components/TaskItem';
import Toast from '../components/Toast';
import Modal from '../components/Modal';

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [toast, setToast] = useState({ message: '', type: 'success' });
    const [historyTask, setHistoryTask] = useState([]);
    const [historyOpen, setHistoryOpen] = useState(false);

    // Hiển thị toast
    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast({ message: '', type }), 3000);
    };

    // Fetch user & tasks
    useEffect(() => {
        const init = async () => {
            try {
                const userRes = await API.get('/users/me');
                setUser(userRes.data.data);
            } catch {
                showToast('Failed to fetch user', 'error');
            }

            try {
                const tasksRes = await API.get('/tasks');
                setTasks(tasksRes.data.data);
            } catch {
                showToast('Failed to fetch tasks', 'error');
            }
        };
        init();
    }, []);

    // Lấy lịch sử task
    const fetchHistory = async taskId => {
        try {
            const res = await API.get(`/tasks/${taskId}/history`);
            setHistoryTask(res.data.data || []);
            setHistoryOpen(true);
        } catch {
            showToast('Failed to fetch history', 'error');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navbar */}
            <Navbar user={user} />

            <div className="max-w-4xl mx-auto p-4">
                {/* Task form */}
                <TaskForm onSuccess={async () => {
                    const res = await API.get('/tasks');
                    setTasks(res.data.data);
                }} showToast={showToast} />

                {/* Task list */}
                <ul className="mt-4">
                    {tasks.map(task => (
                        <TaskItem
                            key={task.id}
                            task={task}
                            onUpdate={async () => {
                                const res = await API.get('/tasks');
                                setTasks(res.data.data);
                            }}
                            showToast={showToast}
                            onHistory={() => fetchHistory(task.id)}
                        />
                    ))}
                </ul>
            </div>

            {/* Task history modal */}
            <Modal
                isOpen={historyOpen}
                onClose={() => setHistoryOpen(false)}
                onConfirm={() => setHistoryOpen(false)}
                title="Task History"
            >
                {historyTask.length === 0 ? (
                    <p className="text-gray-500">No history available</p>
                ) : (
                    <ul className="space-y-2 max-h-64 overflow-y-auto">
                        {historyTask.map((h, idx) => (
                            <li key={idx} className="border p-2 rounded bg-gray-50">
                                <p>
                                    <strong>Old Status:</strong> {h.oldStatus} → <strong>New Status:</strong> {h.newStatus}
                                </p>
                                <p className="text-sm text-gray-500">{new Date(h.createdAt).toLocaleString()}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </Modal>

            {/* Toast */}
            <Toast message={toast.message} type={toast.type} />
        </div>
    );
}
