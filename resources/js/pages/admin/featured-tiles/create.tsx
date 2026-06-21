import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Loader2, Upload, X, Link as LinkIcon } from 'lucide-react';
import { useState, useRef } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Featured Tiles', href: '/admin/featured-tiles' },
    { title: 'Create', href: '#' },
];

interface Category {
    id: number;
    name: string;
}

interface CreateFeaturedTileProps {
    categories: Category[];
}

export default function CreateFeaturedTile({ categories }: CreateFeaturedTileProps) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        link: '',
        image: null as File | null,
        order: 0,
        is_active: true,
    });

    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        setData('image', null);
        setPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.featured-tiles.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Featured Tile" />

            {processing && (
                <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
                    <div className="relative flex h-24 w-24 items-center justify-center">
                        <div className="absolute inset-0 animate-spin rounded-full border-4 border-slate-100 border-t-orange-600"></div>
                        <Loader2 className="h-10 w-10 animate-pulse text-orange-600" />
                    </div>
                    <p className="mt-4 text-sm font-black uppercase tracking-widest text-slate-900">Uploading Tile...</p>
                </div>
            )}

            <div className="w-full p-6">
                <div className="mb-8 flex items-center justify-between">
                    <div className="space-y-1">
                        <Link 
                            href={route('admin.featured-tiles.index')} 
                            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 transition-colors hover:text-slate-950"
                        >
                            <ArrowLeft className="h-3 w-3" />
                            Back to tiles
                        </Link>
                        <h1 className="text-3xl font-black uppercase tracking-tight text-slate-950">New Featured Tile</h1>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
                        <div className="space-y-8">
                            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                <h3 className="mb-6 text-sm font-black uppercase tracking-widest text-slate-400">Basic Information</h3>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-slate-600">Tile Title (Internal)</label>
                                        <input
                                            type="text"
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-bold focus:border-slate-400 focus:bg-white focus:ring-0 outline-none"
                                            placeholder="e.g. Men's Shoes Collection"
                                        />
                                        {errors.title && <p className="text-xs font-bold uppercase text-red-500">{errors.title}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-slate-600">Link to Category</label>
                                        <div className="relative">
                                            <select
                                                value={data.link.split('category=')[1] || ''}
                                                onChange={(e) => setData('link', `/products?category=${e.target.value}`)}
                                                className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-bold focus:border-slate-400 focus:bg-white focus:ring-0 outline-none"
                                            >
                                                <option value="">Select a Category</option>
                                                {categories.map((category) => (
                                                    <option key={category.id} value={category.name}>
                                                        {category.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                                                <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </div>
                                        {errors.link && <p className="text-xs font-bold uppercase text-red-500">{errors.link}</p>}
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                <h3 className="mb-6 text-sm font-black uppercase tracking-widest text-slate-400">Tile Image</h3>
                                <div className="space-y-4">
                                    <div className="relative">
                                        {preview ? (
                                            <div className="relative aspect-square w-full max-w-[250px] mx-auto overflow-hidden rounded-xl border border-slate-200">
                                                <img src={preview} alt="Tile Preview" className="h-full w-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={removeImage}
                                                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-slate-950/50 text-white backdrop-blur transition-colors hover:bg-red-500"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div
                                                onClick={() => fileInputRef.current?.click()}
                                                className="flex aspect-square w-full max-w-[250px] mx-auto cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 transition-colors hover:border-slate-400 hover:bg-slate-100"
                                            >
                                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm">
                                                    <Upload className="h-6 w-6" />
                                                </div>
                                                <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Upload Image</p>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleImageChange}
                                            className="hidden"
                                            accept="image/*"
                                        />
                                    </div>
                                    {errors.image && <p className="text-xs font-bold uppercase text-red-500 text-center">{errors.image}</p>}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                <h3 className="mb-6 text-sm font-black uppercase tracking-widest text-slate-400">Settings</h3>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-slate-600">Display Order</label>
                                        <input
                                            type="number"
                                            value={data.order}
                                            onChange={(e) => setData('order', parseInt(e.target.value))}
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-bold focus:border-slate-400 focus:bg-white focus:ring-0 outline-none"
                                        />
                                        {errors.order && <p className="text-xs font-bold uppercase text-red-500">{errors.order}</p>}
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-black uppercase tracking-widest text-slate-600">Status</label>
                                        <button
                                            type="button"
                                            onClick={() => setData('is_active', !data.is_active)}
                                            className={`relative h-6 w-11 flex-none rounded-full transition-colors duration-200 focus:outline-none ${
                                                data.is_active ? 'bg-orange-600' : 'bg-slate-200'
                                            }`}
                                        >
                                            <span
                                                className={`absolute left-1 top-1 h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                                                    data.is_active ? 'translate-x-5' : 'translate-x-0'
                                                }`}
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full rounded-2xl bg-slate-950 py-4 text-sm font-black uppercase tracking-[0.2em] text-white shadow-xl shadow-slate-950/20 transition-all hover:-translate-y-1 hover:bg-slate-800 disabled:opacity-50 active:translate-y-0"
                            >
                                Save Tile
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
