import React from 'react';
import { Calendar, Trash2, History, Clock, PlayCircle, CheckCircle, Pencil, GripVertical } from 'lucide-react';

const statusMap = {
    todo: { color: 'bg-gray-100 text-gray-600', icon: <Clock size={14} />, label: 'Cần làm' },
    doing: { color: 'bg-blue-100 text-blue-600', icon: <PlayCircle size={14} />, label: 'Đang làm' },
    done: { color: 'bg-green-100 text-green-600', icon: <CheckCircle size={14} />, label: 'Xong' }
};

export default function TaskItem({ task, onEdit, onDelete, onShowHistory }) {
    return (
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all group relative">

            {/* TAY CẦM KÉO: Thêm icon này để người dùng biết chỗ cầm để kéo */}
            <div className="absolute left-1 top-1/2 -translate-y-1/2 text-gray-300 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing">
                <GripVertical size={16} />
            </div>

            <div className="pl-2"> {/* Đẩy nội dung sang phải để nhường chỗ cho tay cầm */}
                <div className="flex justify-between items-start mb-2">
                    <span className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold uppercase ${statusMap[task.status].color}`}>
                        {statusMap[task.status].icon} {statusMap[task.status].label}
                    </span>

                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={(e) => { e.stopPropagation(); onEdit(task); }}
                            className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg"
                        >
                            <Pencil size={14} />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); onShowHistory(task); }}
                            className="p-1.5 text-gray-400 hover:text-purple-500 hover:bg-purple-50 rounded-lg"
                        >
                            <History size={14} />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                </div>

                <h4 className="font-bold text-gray-800 mb-1 text-sm">{task.title}</h4>
                <p className="text-gray-500 text-[11px] line-clamp-2 mb-3 leading-relaxed">
                    {task.description || "Không có mô tả chi tiết cho công việc này."}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                    <div className="flex items-center text-[10px] text-gray-400 font-bold gap-1 uppercase tracking-tighter">
                        <Calendar size={12} />
                        {task.deadline ? new Date(task.deadline).toLocaleDateString('vi-VN') : 'Không hạn'}
                    </div>
                </div>
            </div>
        </div>
    );
}