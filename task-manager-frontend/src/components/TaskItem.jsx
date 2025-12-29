import React from 'react';
import { Calendar, Trash2, History, Clock, PlayCircle, CheckCircle, Pencil, GripVertical } from 'lucide-react';

const statusMap = {
    todo: { color: 'bg-gray-100 text-gray-600', icon: <Clock size={14} />, label: 'Cần làm' },
    doing: { color: 'bg-blue-100 text-blue-600', icon: <PlayCircle size={14} />, label: 'Đang làm' },
    done: { color: 'bg-emerald-100 text-emerald-600', icon: <CheckCircle size={14} />, label: 'Xong' }
};

export default function TaskItem({ task, onEdit, onDelete, onShowHistory }) {
    return (
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group relative active:scale-[0.98] touch-none">
            
            {/* TAY CẦM KÉO: Cực kỳ quan trọng để kéo trên Mobile mượt hơn */}
            <div className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-300 md:opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical size={18} />
            </div>

            <div className="pl-4"> 
                <div className="flex justify-between items-start mb-2">
                    <span className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${statusMap[task.status].color}`}>
                        {statusMap[task.status].icon} {statusMap[task.status].label}
                    </span>

                    {/* Điều chỉnh Opacity: Trên mobile luôn hiện (opacity-100), trên Desktop chỉ hiện khi hover */}
                    <div className="flex gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-all">
                        <button
                            onClick={(e) => { e.stopPropagation(); onEdit(task); }}
                            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                        >
                            <Pencil size={15} />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); onShowHistory(task); }}
                            className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-colors"
                        >
                            <History size={15} />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); if(confirm('Xóa task này?')) onDelete(task.id); }}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                        >
                            <Trash2 size={15} />
                        </button>
                    </div>
                </div>

                <h4 className="font-bold text-gray-800 mb-1 text-sm leading-snug">{task.title}</h4>
                <p className="text-gray-500 text-[11px] line-clamp-2 mb-3 leading-relaxed">
                    {task.description || "Chưa có mô tả..."}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                    <div className={`flex items-center text-[10px] font-bold gap-1 uppercase tracking-tighter ${task.deadline && new Date(task.deadline) < new Date() ? 'text-red-500' : 'text-gray-400'}`}>
                        <Calendar size={12} />
                        {task.deadline ? new Date(task.deadline).toLocaleDateString('vi-VN') : 'Không hạn'}
                    </div>
                </div>
            </div>
        </div>
    );
}