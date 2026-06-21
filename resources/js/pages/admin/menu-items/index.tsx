import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Edit2, Trash2, Link2, FolderTree, ExternalLink, Layers, ArrowUpDown, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { ConfirmModal } from '@/components/ui/confirm-modal';

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface MenuItem {
    id: number;
    title: string;
    type: 'custom' | 'category';
    url: string | null;
    category_id: number | null;
    parent_id: number | null;
    order: number;
    category?: Category | null;
    children?: MenuItem[];
}

interface MenuItemIndexProps {
    menuItems: MenuItem[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Header Menus', href: '/admin/menu-items' },
];

export default function MenuItemIndex({ menuItems }: MenuItemIndexProps) {
    const [confirmAction, setConfirmAction] = useState<{ id: number, type: 'parent' | 'child' } | null>(null);

    const executeConfirmAction = () => {
        if (!confirmAction) return;
        router.delete(route('admin.menu-items.destroy', confirmAction.id), {
            onSuccess: () => setConfirmAction(null),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Header Menus" />
            
            <div className="flex flex-col gap-6 p-6 w-full">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-slate-950 uppercase tracking-tight flex items-center gap-2">
                            <FolderTree className="h-6 w-6 text-orange-600" />
                            Header Menus
                        </h1>
                        <p className="text-sm text-slate-500 font-medium">Create and structure dynamic navigation menus (WordPress style)</p>
                    </div>
                    <Link 
                        href={route('admin.menu-items.create')}
                        className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2 text-sm font-black text-white transition-all hover:bg-slate-800 active:scale-95 uppercase tracking-widest shadow-lg"
                    >
                        <Plus className="h-4 w-4" />
                        Add Menu Item
                    </Link>
                </div>

                <div className="space-y-4">
                    {menuItems.map((item) => (
                        <div key={item.id} className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden transition-all hover:shadow-md">
                            {/* Parent Item Header Row */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-slate-50/50 gap-4 border-b border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-950 text-white shadow-sm font-black">
                                        {item.order}
                                    </div>
                                    <div>
                                        <div className="font-black text-slate-900 text-lg leading-tight">{item.title}</div>
                                        <div className="mt-1 flex items-center gap-2">
                                            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                                                Top Level
                                            </span>
                                            {item.type === 'category' ? (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-black text-orange-600 uppercase tracking-wider">
                                                    <Layers className="h-2.5 w-2.5" />
                                                    Category: {item.category?.name}
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-black text-blue-600 uppercase tracking-wider">
                                                    <Link2 className="h-2.5 w-2.5" />
                                                    Custom URL: {item.url}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 justify-end">
                                    <Link 
                                        href={route('admin.menu-items.create', { parent_id: item.id })}
                                        className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                                    >
                                        <Plus className="h-3.5 w-3.5" />
                                        Add Sub-item
                                    </Link>
                                    <Link 
                                        href={route('admin.menu-items.edit', item.id)}
                                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-slate-50 rounded-md transition-colors" 
                                        title="Edit"
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </Link>
                                    <button 
                                        onClick={() => setConfirmAction({ id: item.id, type: 'parent' })}
                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-slate-50 rounded-md transition-colors" 
                                        title="Delete"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Sub-items Panel */}
                            <div className="p-5 bg-white">
                                {item.children && item.children.length > 0 ? (
                                    <div className="relative pl-6 sm:pl-8 border-l-2 border-slate-100 space-y-3">
                                        {item.children.map((child) => (
                                            <div key={child.id} className="relative flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/30 hover:bg-slate-50/70 transition-colors gap-3">
                                                {/* Tree indicator line */}
                                                <div className="absolute left-[-26px] sm:left-[-34px] top-1/2 w-6 border-b-2 border-slate-100" />
                                                
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xs font-bold text-slate-400 font-mono bg-white border border-slate-200 h-6 w-6 rounded-full flex items-center justify-center">
                                                        {child.order}
                                                    </span>
                                                    <div>
                                                        <div className="font-bold text-slate-800 text-sm">{child.title}</div>
                                                        <div className="mt-0.5 flex items-center gap-2">
                                                            {child.type === 'category' ? (
                                                                <span className="inline-flex items-center gap-0.5 rounded bg-orange-50/50 px-1.5 py-0.5 text-[9px] font-bold text-orange-600 uppercase tracking-tight">
                                                                    Category: {child.category?.name}
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center gap-0.5 rounded bg-blue-50/50 px-1.5 py-0.5 text-[9px] font-bold text-blue-600 uppercase tracking-tight">
                                                                    URL: {child.url}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-1 justify-end">
                                                    <Link 
                                                        href={route('admin.menu-items.edit', child.id)}
                                                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-white rounded border border-transparent hover:border-slate-100 transition-colors" 
                                                        title="Edit"
                                                    >
                                                        <Edit2 className="h-3.5 w-3.5" />
                                                    </Link>
                                                    <button 
                                                        onClick={() => setConfirmAction({ id: child.id, type: 'child' })}
                                                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-white rounded border border-transparent hover:border-slate-100 transition-colors" 
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                        No nested sub-items created.
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {menuItems.length === 0 && (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center shadow-sm">
                            <FolderTree className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                            <h3 className="text-base font-bold text-slate-900">No menu items found</h3>
                            <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">Get started by creating your first top-level menu item to customize your storefront header layout.</p>
                            <div className="mt-6">
                                <Link 
                                    href={route('admin.menu-items.create')}
                                    className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2 text-sm font-black text-white transition-all hover:bg-slate-800 active:scale-95 uppercase tracking-widest"
                                >
                                    <Plus className="h-4 w-4" />
                                    Add Menu Item
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <ConfirmModal
                isOpen={confirmAction !== null}
                onClose={() => setConfirmAction(null)}
                onConfirm={executeConfirmAction}
                title={confirmAction?.type === 'parent' ? 'Delete Menu Item' : 'Delete Sub-menu Item'}
                description={confirmAction?.type === 'parent' ? 'Are you sure you want to delete this menu item and all its sub-items?' : 'Are you sure you want to delete this sub-menu item?'}
                confirmText="Delete"
            />
        </AppLayout>
    );
}
