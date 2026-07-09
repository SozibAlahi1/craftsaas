import { ConfirmModal } from '@/components/ui/confirm-modal';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Edit2, Eye, EyeOff, Move, Plus, Trash2, Youtube } from 'lucide-react';
import { useState } from 'react';

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
                        <h1 className="text-2xl font-black tracking-tight text-slate-950 uppercase">Video Reels</h1>
                        <p className="text-sm font-medium text-slate-500">Manage YouTube shorts/reels on the home page</p>
                    </div>
                    <Link
                        href={route('admin.video-reels.create')}
                        className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2 text-sm font-black tracking-widest text-white uppercase shadow-lg transition-all hover:bg-slate-800 active:scale-95"
                    >
                        <Plus className="h-4 w-4" />
                        Add Reel
                    </Link>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/50">
                                    <th className="w-12 px-6 py-4 text-xs font-black tracking-widest text-slate-400 uppercase">Order</th>
                                    <th className="px-6 py-4 text-xs font-black tracking-widest text-slate-400 uppercase">YouTube Video</th>
                                    <th className="px-6 py-4 text-xs font-black tracking-widest text-slate-400 uppercase">Title</th>
                                    <th className="px-6 py-4 text-xs font-black tracking-widest text-slate-400 uppercase">Category Section</th>
                                    <th className="px-6 py-4 text-xs font-black tracking-widest text-slate-400 uppercase">Product</th>
                                    <th className="px-6 py-4 text-xs font-black tracking-widest text-slate-400 uppercase">Status</th>
                                    <th className="px-6 py-4 text-right text-xs font-black tracking-widest text-slate-400 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {reels.map((reel) => (
                                    <tr key={reel.id} className="group transition-colors hover:bg-slate-50/30">
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
                                            <div className="leading-tight font-black text-slate-900">{reel.title || '-'}</div>
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
                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-black tracking-widest text-green-600 uppercase">
                                                    <Eye className="h-3 w-3" />
                                                    Active
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
                                                    href={route('admin.video-reels.edit', reel.id)}
                                                    className="p-2 text-slate-400 transition-colors hover:text-blue-600"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </Link>
                                                <button
                                                    onClick={() => setDeleteId(reel.id)}
                                                    className="p-2 text-slate-400 transition-colors hover:text-red-600"
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
                                            <div className="text-sm font-bold tracking-widest text-slate-400 uppercase">No video reels found.</div>
                                            <Link
                                                href={route('admin.video-reels.create')}
                                                className="mt-2 text-xs font-black text-orange-600 uppercase hover:underline"
                                            >
                                                Create your first reel
                                            </Link>
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
