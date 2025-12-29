import React, { useState } from 'react';
import API from '../api/api';

export default function TaskForm({ onSuccess, showToast }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            await API.post('/tasks', { title, description });
            setTitle('');
            setDescription('');
            showToast('Task created!', 'success');
            onSuccess();
        } catch (err) {
            showToast(err.response?.data?.message || err.message, 'error');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 p-4 border rounded bg-white shadow">
            <input
                type="text"
                placeholder="Task title"
                className="border p-2 rounded"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
            />
            <textarea
                placeholder="Description"
                value={description}
                className="border p-2 rounded"
                onChange={e => setDescription(e.target.value)}
            />
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" type="submit">
                Add Task
            </button>
        </form>
    );
}
