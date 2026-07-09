import { ConfirmModal } from '@/components/ui/confirm-modal';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Edit2, Eye, EyeOff, Image as ImageIcon, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface Category {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    banner_image: string | null;
    show_on_home: boolean;
    products_count: number;
}

interface CategoryIndexProps {
    categories: Category[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Categories', href: '/admin/categories' },
];

export default function CategoryIndex({ categories }: CategoryIndexProps) {
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const confirmDeletion = () => {
        if (deleteId !== null) {
            router.delete(route('admin.categories.destroy', deleteId), {
                onSuccess: () => setDeleteId(null),
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Categories" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-slate-950 uppercase">Categories</h1>
                        <p className="text-sm font-medium text-slate-500">Manage product groupings</p>
                    </div>
                    <Link
                        href={route('admin.categories.create')}
                        className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2 text-sm font-black tracking-widest text-white uppercase shadow-lg transition-all hover:bg-slate-800 active:scale-95"
                    >
                        <Plus className="h-4 w-4" />
                        Add Category
                    </Link>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-100 bg-slate-50/50 p-4">
                        <div className="relative max-w-sm">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search categories..."
                                className="w-full rounded-lg border border-slate-200 bg-white py-2 pr-4 pl-10 text-sm placeholder:font-medium focus:border-slate-400 focus:ring-0 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/50">
                                    <th className="px-6 py-4 text-xs font-black tracking-widest text-slate-400 uppercase">Banner</th>
                                    <th className="px-6 py-4 text-xs font-black tracking-widest text-slate-400 uppercase">Name</th>
                                    <th className="px-6 py-4 text-xs font-black tracking-widest text-slate-400 uppercase">Slug</th>
                                    <th className="px-6 py-4 text-xs font-black tracking-widest text-slate-400 uppercase">Home Visibility</th>
                                    <th className="px-6 py-4 text-right text-xs font-black tracking-widest text-slate-400 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {categories.map((category) => (
                                    <tr key={category.id} className="group transition-colors hover:bg-slate-50/30">
                                        <td className="px-6 py-4">
                                            {category.banner_image ? (
                                                <div className="h-10 w-24 overflow-hidden rounded-md border border-slate-200">
                                                    <img src={category.banner_image} alt={category.name} className="h-full w-full object-cover" />
                                                </div>
                                            ) : (
                                                <div className="flex h-10 w-24 items-center justify-center rounded-md border border-slate-100 bg-slate-50 text-slate-300">
                                                    <ImageIcon className="h-4 w-4" />
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="leading-tight font-black text-slate-900">{category.name}</div>
                                            <div className="text-[10px] font-bold tracking-tighter text-slate-400 uppercase">
                                                {category.products_count} items
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="rounded bg-slate-50 px-2 py-1 font-mono text-xs font-bold text-slate-400">
                                                {category.slug}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {category.show_on_home ? (
                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-2.5 py-1 text-[10px] font-black tracking-widest text-orange-600 uppercase">
                                                    <Eye className="h-3 w-3" />
                                                    Visible
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                                                    <EyeOff className="h-3 w-3" />
                                                    Hidden
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link
                                                    href={route('admin.categories.edit', category.id)}
                                                    className="p-2 text-slate-400 transition-colors hover:text-blue-600"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </Link>
                                                <button
                                                    onClick={() => setDeleteId(category.id)}
                                                    className="p-2 text-slate-400 transition-colors hover:text-red-600"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {categories.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center">
                                            <div className="text-sm font-bold text-slate-400">No categories found.</div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <ConfirmModal
                isOpen={deleteId !== null}
                onClose={() => setDeleteId(null)}
                onConfirm={confirmDeletion}
                title="Delete Category"
                description="Are you sure you want to delete this category?"
                confirmText="Delete"
            />
        </AppLayout>
    );
}
