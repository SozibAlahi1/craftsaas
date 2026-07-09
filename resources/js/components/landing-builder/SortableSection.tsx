import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2 } from 'lucide-react';
import React from 'react';

interface SortableSectionProps {
    section: any;
    isSelected: boolean;
    onSelect: () => void;
    onDelete: () => void;
    children: React.ReactNode;
}

export function SortableSection({ section, isSelected, onSelect, onDelete, children }: SortableSectionProps) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });

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
            className={`group relative ${isSelected ? 'ring-2 ring-indigo-600 ring-inset' : 'hover:ring-2 hover:ring-slate-300 hover:ring-inset'}`}
        >
            {/* Drag Handle */}
            <div
                {...attributes}
                {...listeners}
                className={`absolute top-1/2 left-2 z-20 -translate-y-1/2 cursor-grab rounded border border-slate-200 bg-white p-1.5 text-slate-400 shadow-sm transition-opacity hover:text-slate-900 active:cursor-grabbing ${isDragging ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
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
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                    }}
                    className="absolute top-2 right-2 z-20 rounded-lg bg-red-100 p-2 text-red-600 shadow-sm hover:bg-red-200"
                    title="Delete section"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            )}

            {/* Overlay when dragging */}
            {isDragging && <div className="pointer-events-none absolute inset-0 z-30 border-2 border-dashed border-indigo-400 bg-indigo-50/50" />}
        </div>
    );
}
