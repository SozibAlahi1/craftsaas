import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Search, Edit2, Trash2, Image as ImageIcon, ExternalLink, Eye, EyeOff, Move } from 'lucide-react';
import { useState } from 'react';
import { ConfirmModal } from '@/components/ui/confirm-modal';

interface FeaturedTile {
    id: number;
    title: string | null;
    image: string;
    link: string | null;
    order: number;
    is_active: boolean;
}

interface FeaturedTileIndexProps {
    tiles: FeaturedTile[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Featured Tiles', href: '/admin/featured-tiles' },
];

export default function FeaturedTileIndex({ tiles }: FeaturedTileIndexProps) {
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const confirmDeletion = () => {
        if (deleteId !== null) {
            router.delete(route('admin.featured-tiles.destroy', deleteId), {
                onSuccess: () => setDeleteId(null),
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Featured Tiles" />
            
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black text-slate-950 uppercase tracking-tight">Featured Tiles</h1>
                        <p className="text-sm text-slate-500 font-medium">Manage the 8 grid tiles on the home page</p>
                    </div>
                    <Link 
                        href={route('admin.featured-tiles.create')}
                        className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2 text-sm font-black text-white transition-all hover:bg-slate-800 active:scale-95 uppercase tracking-widest shadow-lg"
                    >
                        <Plus className="h-4 w-4" />
                        Add Tile
                    </Link>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100">
                                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest w-12">Order</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Image</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Title / Link</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {tiles.map((tile) => (
                                    <tr key={tile.id} className="hover:bg-slate-50/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 font-black text-slate-400">
                                                <Move className="h-3 w-3" />
                                                {tile.order}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="h-16 w-16 overflow-hidden rounded-md border border-slate-200">
                                                <img src={tile.image} alt={tile.title || 'Tile'} className="h-full w-full object-cover" />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-black text-slate-900 leading-tight">{tile.title || 'Untitled Tile'}</div>
                                            {tile.link && (
                                                <div className="mt-1 flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                    <ExternalLink className="h-2.5 w-2.5" />
                                                    {tile.link}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {tile.is_active ? (
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
                                                    href={route('admin.featured-tiles.edit', tile.id)}
                                                    className="p-2 text-slate-400 hover:text-blue-600 transition-colors" 
                                                    title="Edit"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </Link>
                                                <button 
                                                    onClick={() => setDeleteId(tile.id)}
                                                    className="p-2 text-slate-400 hover:text-red-600 transition-colors" 
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {tiles.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center">
                                            <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">No tiles found.</div>
                                            <Link href={route('admin.featured-tiles.create')} className="mt-2 text-xs font-black text-orange-600 uppercase hover:underline">Create your first tile</Link>
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
                title="Delete Featured Tile"
                description="Are you sure you want to delete this tile?"
                confirmText="Delete"
            />
        </AppLayout>
    );
}
