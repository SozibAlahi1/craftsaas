import { ConfirmModal } from '@/components/ui/confirm-modal';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Edit2, FolderTree, Layers, Link2, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

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
    const [confirmAction, setConfirmAction] = useState<{ id: number; type: 'parent' | 'child' } | null>(null);

    const executeConfirmAction = () => {
        if (!confirmAction) return;
        router.delete(route('admin.menu-items.destroy', confirmAction.id), {
            onSuccess: () => setConfirmAction(null),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Header Menus" />

            <div className="flex w-full flex-col gap-6 p-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="flex items-center gap-2 text-2xl font-black tracking-tight text-slate-950 uppercase">
                            <FolderTree className="h-6 w-6 text-orange-600" />
                            Header Menus
                        </h1>
                        <p className="text-sm font-medium text-slate-500">Create and structure dynamic navigation menus (WordPress style)</p>
                    </div>
                    <Link
                        href={route('admin.menu-items.create')}
                        className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2 text-sm font-black tracking-widest text-white uppercase shadow-lg transition-all hover:bg-slate-800 active:scale-95"
                    >
                        <Plus className="h-4 w-4" />
                        Add Menu Item
                    </Link>
                </div>

                <div className="space-y-4">
                    {menuItems.map((item) => (
                        <div
                            key={item.id}
                            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md"
                        >
                            {/* Parent Item Header Row */}
                            <div className="flex flex-col justify-between gap-4 border-b border-slate-100 bg-slate-50/50 p-5 sm:flex-row sm:items-center">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-950 font-black text-white shadow-sm">
                                        {item.order}
                                    </div>
                                    <div>
                                        <div className="text-lg leading-tight font-black text-slate-900">{item.title}</div>
                                        <div className="mt-1 flex items-center gap-2">
                                            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-black tracking-wider text-slate-500 uppercase">
                                                Top Level
                                            </span>
                                            {item.type === 'category' ? (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-black tracking-wider text-orange-600 uppercase">
                                                    <Layers className="h-2.5 w-2.5" />
                                                    Category: {item.category?.name}
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-black tracking-wider text-blue-600 uppercase">
                                                    <Link2 className="h-2.5 w-2.5" />
                                                    Custom URL: {item.url}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-2">
                                    <Link
                                        href={route('admin.menu-items.create', { parent_id: item.id })}
                                        className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-50"
                                    >
                                        <Plus className="h-3.5 w-3.5" />
                                        Add Sub-item
                                    </Link>
                                    <Link
                                        href={route('admin.menu-items.edit', item.id)}
                                        className="rounded-md p-2 text-slate-400 transition-colors hover:bg-slate-50 hover:text-blue-600"
                                        title="Edit"
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </Link>
                                    <button
                                        onClick={() => setConfirmAction({ id: item.id, type: 'parent' })}
                                        className="rounded-md p-2 text-slate-400 transition-colors hover:bg-slate-50 hover:text-red-600"
                                        title="Delete"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Sub-items Panel */}
                            <div className="bg-white p-5">
                                {item.children && item.children.length > 0 ? (
                                    <div className="relative space-y-3 border-l-2 border-slate-100 pl-6 sm:pl-8">
                                        {item.children.map((child) => (
                                            <div
                                                key={child.id}
                                                className="relative flex flex-col justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/30 p-4 transition-colors hover:bg-slate-50/70 sm:flex-row sm:items-center"
                                            >
                                                {/* Tree indicator line */}
                                                <div className="absolute top-1/2 left-[-26px] w-6 border-b-2 border-slate-100 sm:left-[-34px]" />

                                                <div className="flex items-center gap-3">
                                                    <span className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white font-mono text-xs font-bold text-slate-400">
                                                        {child.order}
                                                    </span>
                                                    <div>
                                                        <div className="text-sm font-bold text-slate-800">{child.title}</div>
                                                        <div className="mt-0.5 flex items-center gap-2">
                                                            {child.type === 'category' ? (
                                                                <span className="inline-flex items-center gap-0.5 rounded bg-orange-50/50 px-1.5 py-0.5 text-[9px] font-bold tracking-tight text-orange-600 uppercase">
                                                                    Category: {child.category?.name}
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center gap-0.5 rounded bg-blue-50/50 px-1.5 py-0.5 text-[9px] font-bold tracking-tight text-blue-600 uppercase">
                                                                    URL: {child.url}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-end gap-1">
                                                    <Link
                                                        href={route('admin.menu-items.edit', child.id)}
                                                        className="rounded border border-transparent p-1.5 text-slate-400 transition-colors hover:border-slate-100 hover:bg-white hover:text-blue-600"
                                                        title="Edit"
                                                    >
                                                        <Edit2 className="h-3.5 w-3.5" />
                                                    </Link>
                                                    <button
                                                        onClick={() => setConfirmAction({ id: child.id, type: 'child' })}
                                                        className="rounded border border-transparent p-1.5 text-slate-400 transition-colors hover:border-slate-100 hover:bg-white hover:text-red-600"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-4 text-center text-xs font-bold tracking-wider text-slate-400 uppercase">
                                        No nested sub-items created.
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {menuItems.length === 0 && (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center shadow-sm">
                            <FolderTree className="mx-auto mb-3 h-12 w-12 text-slate-300" />
                            <h3 className="text-base font-bold text-slate-900">No menu items found</h3>
                            <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
                                Get started by creating your first top-level menu item to customize your storefront header layout.
                            </p>
                            <div className="mt-6">
                                <Link
                                    href={route('admin.menu-items.create')}
                                    className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2 text-sm font-black tracking-widest text-white uppercase transition-all hover:bg-slate-800 active:scale-95"
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
                description={
                    confirmAction?.type === 'parent'
                        ? 'Are you sure you want to delete this menu item and all its sub-items?'
                        : 'Are you sure you want to delete this sub-menu item?'
                }
                confirmText="Delete"
            />
        </AppLayout>
    );
}
