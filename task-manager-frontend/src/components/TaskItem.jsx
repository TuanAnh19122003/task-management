import React, { useState } from 'react';
import API from '../api';
import Modal from './Modal';

export default function TaskItem({ task, onUpdate, showToast }) {
    const [confirmOpen, setConfirmOpen] = useState(false);

    const updateStatus = async status => {
        try {
            await API.put(`/tasks/${task.id}`, { status });
            showToast('Status updated!', 'success');
            onUpdate();
        } catch (err) {
            showToast(err.response?.data?.message || err.message, 'error');
        }
    };

    const deleteTask = async () => {
        try {
            await API.delete(`/tasks/${task.id}`);
            showToast('Task deleted!', 'success');
            onUpdate();
            setConfirmOpen(false);
        } catch (err) {
            showToast(err.response?.data?.message || err.message, 'error');
        }
    };

    return (
        <li className="flex justify-between items-center p-2 border-b bg-white rounded mb-2 shadow-sm">
            <div>
                <h3 className="font-bold">{task.title}</h3>
                <p className="text-gray-600">{task.description}</p>
                <p className="text-sm text-gray-500">Status: {task.status}</p>
            </div>
            <div className="flex gap-1">
                <button className="bg-gray-200 p-1 rounded" onClick={() => updateStatus('todo')}>Todo</button>
                <button className="bg-yellow-200 p-1 rounded" onClick={() => updateStatus('doing')}>Doing</button>
                <button className="bg-green-200 p-1 rounded" onClick={() => updateStatus('done')}>Done</button>
                <button className="bg-red-400 text-white p-1 rounded" onClick={() => setConfirmOpen(true)}>Delete</button>
            </div>

            <Modal
                isOpen={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={deleteTask}
                title="Confirm Delete"
            >
                Are you sure you want to delete this task?
            </Modal>
        </li>
    );
}
