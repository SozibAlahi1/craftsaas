import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2 } from 'lucide-react';

interface SortableSectionProps {
    section: any;
    isSelected: boolean;
    onSelect: () => void;
    onDelete: () => void;
    children: React.ReactNode;
}

export function SortableSection({ section, isSelected, onSelect, onDelete, children }: SortableSectionProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: section.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
        position: 'relative' as const,
    };

    return (
        <div 
            ref={setNodeRef} 
            style={style} 
            className={`relative group ${isSelected ? 'ring-2 ring-inset ring-indigo-600' : 'hover:ring-2 hover:ring-inset hover:ring-slate-300'}`}
        >
            {/* Drag Handle */}
            <div 
                {...attributes} 
                {...listeners}
                className={`absolute top-1/2 -translate-y-1/2 left-2 p-1.5 cursor-grab active:cursor-grabbing rounded bg-white shadow-sm border border-slate-200 text-slate-400 hover:text-slate-900 transition-opacity z-20 ${isDragging ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
            >
                <GripVertical className="h-4 w-4" />
            </div>

            {/* Click to select wrapper */}
            <div onClick={onSelect} className="cursor-pointer">
                {children}
            </div>

            {/* Delete button (only show when selected) */}
            {isSelected && (
                <button 
                    onClick={(e) => { e.stopPropagation(); onDelete(); }}
                    className="absolute top-2 right-2 p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 z-20 shadow-sm"
                    title="Delete section"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            )}
            
            {/* Overlay when dragging */}
            {isDragging && (
                <div className="absolute inset-0 bg-indigo-50/50 border-2 border-dashed border-indigo-400 z-30 pointer-events-none" />
            )}
        </div>
    );
}
