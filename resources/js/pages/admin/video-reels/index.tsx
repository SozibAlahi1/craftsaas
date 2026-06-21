import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Edit2, Trash2, Eye, EyeOff, Move, Youtube } from 'lucide-react';
import { useState } from 'react';
import { ConfirmModal } from '@/components/ui/confirm-modal';

interface VideoReel {
    id: number;
    youtube_id: string;
    title: string | null;
    product: {
        id: number;
        name: string;
        price: string;
    } | null;
    category: {
        id: number;
        name: string;
    } | null;
    order: number;
    is_active: boolean;
}

interface VideoReelIndexProps {
    reels: VideoReel[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Video Reels', href: '/admin/video-reels' },
];

export default function VideoReelIndex({ reels }: VideoReelIndexProps) {
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const confirmDeletion = () => {
        if (deleteId !== null) {
            router.delete(route('admin.video-reels.destroy', deleteId));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Video Reels" />
            
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black text-slate-950 uppercase tracking-tight">Video Reels</h1>
                        <p className="text-sm text-slate-500 font-medium">Manage YouTube shorts/reels on the home page</p>
                    </div>
                    <Link 
                        href={route('admin.video-reels.create')}
                        className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2 text-sm font-black text-white transition-all hover:bg-slate-800 active:scale-95 uppercase tracking-widest shadow-lg"
                    >
                        <Plus className="h-4 w-4" />
                        Add Reel
                    </Link>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100">
                                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest w-12">Order</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">YouTube Video</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Title</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Category Section</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Product</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {reels.map((reel) => (
                                    <tr key={reel.id} className="hover:bg-slate-50/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 font-black text-slate-400">
                                                <Move className="h-3 w-3" />
                                                {reel.order}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
                                                    <Youtube className="h-5 w-5" />
                                                </div>
                                                <div className="font-mono text-xs font-bold text-slate-600">{reel.youtube_id}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-black text-slate-900 leading-tight">{reel.title || '-'}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {reel.category ? (
                                                <div className="inline-flex items-center gap-1.5 rounded-md bg-blue-50 px-2 py-1 text-xs font-bold text-blue-700">
                                                    {reel.category.name}
                                                </div>
                                            ) : (
                                                <div className="text-xs font-bold text-slate-400 uppercase">None</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {reel.product ? (
                                                <div className="font-bold text-slate-700">{reel.product.name}</div>
                                            ) : (
                                                <div className="text-xs font-bold text-slate-400 uppercase">None</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {reel.is_active ? (
                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-black text-green-600 uppercase tracking-widest">
                                                    <Eye className="h-3 w-3" />
                                                    Active
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                    <EyeOff className="h-3 w-3" />
                                                    Hidden
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link 
                                                    href={route('admin.video-reels.edit', reel.id)}
                                                    className="p-2 text-slate-400 hover:text-blue-600 transition-colors" 
                                                    title="Edit"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </Link>
                                                <button 
                                                    onClick={() => setDeleteId(reel.id)}
                                                    className="p-2 text-slate-400 hover:text-red-600 transition-colors" 
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {reels.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center">
                                            <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">No video reels found.</div>
                                            <Link href={route('admin.video-reels.create')} className="mt-2 text-xs font-black text-orange-600 uppercase hover:underline">Create your first reel</Link>
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
                title="Delete Video Reel"
                description="Are you sure you want to delete this video reel?"
                confirmText="Delete"
            />
        </AppLayout>
    );
}
