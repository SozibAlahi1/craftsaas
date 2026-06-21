import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Search, Edit2, Trash2, Eye, EyeOff, Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';
import { ConfirmModal } from '@/components/ui/confirm-modal';

interface Banner {
    id: number;
    title: string | null;
    image_url: string;
    link: string | null;
    order: number;
    is_active: boolean;
}

interface BannerIndexProps {
    banners: Banner[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Banners', href: '/admin/banners' },
];

export default function BannerIndex({ banners }: BannerIndexProps) {
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const confirmDeletion = () => {
        if (deleteId !== null) {
            router.delete(route('admin.banners.destroy', deleteId), {
                onSuccess: () => setDeleteId(null),
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Banners" />
            
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black text-slate-950 uppercase tracking-tight">Banners</h1>
                        <p className="text-sm text-slate-500 font-medium">Manage homepage banners</p>
                    </div>
                    <Link 
                        href={route('admin.banners.create')}
                        className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2 text-sm font-black text-white transition-all hover:bg-slate-800 active:scale-95 uppercase tracking-widest shadow-lg"
                    >
                        <Plus className="h-4 w-4" />
                        Add Banner
                    </Link>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                    <div className="border-b border-slate-100 bg-slate-50/50 p-4">
                        <div className="relative max-w-sm">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input 
                                type="text" 
                                placeholder="Search banners..." 
                                className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 py-2 text-sm focus:border-slate-400 focus:ring-0 focus:outline-none placeholder:font-medium"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100">
                                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Image</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Title</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Link</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Order</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {banners.map((banner) => (
                                    <tr key={banner.id} className="hover:bg-slate-50/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            {banner.image_url ? (
                                                <div className="h-12 w-24 overflow-hidden rounded-md border border-slate-200">
                                                    <img src={banner.image_url} alt={banner.title || ''} className="h-full w-full object-cover" />
                                                </div>
                                            ) : (
                                                <div className="flex h-12 w-24 items-center justify-center rounded-md border border-slate-100 bg-slate-50 text-slate-300">
                                                    <ImageIcon className="h-5 w-5" />
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-black text-slate-900 leading-tight">{banner.title || '-'}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-bold text-slate-500">{banner.link || '-'}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-bold text-slate-900">{banner.order}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {banner.is_active ? (
                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-2.5 py-1 text-[10px] font-black text-orange-600 uppercase tracking-widest">
                                                    <Eye className="h-3 w-3" />
                                                    Active
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                    <EyeOff className="h-3 w-3" />
                                                    Inactive
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link 
                                                    href={route('admin.banners.edit', banner.id)}
                                                    className="p-2 text-slate-400 hover:text-blue-600 transition-colors" 
                                                    title="Edit"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </Link>
                                                <button 
                                                    onClick={() => setDeleteId(banner.id)}
                                                    className="p-2 text-slate-400 hover:text-red-600 transition-colors" 
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {banners.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center">
                                            <div className="text-sm font-bold text-slate-400">No banners found.</div>
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
                title="Delete Banner"
                description="Are you sure you want to delete this banner?"
                confirmText="Delete"
            />
        </AppLayout>
    );
}
