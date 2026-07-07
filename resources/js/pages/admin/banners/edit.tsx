import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Loader2, Upload, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface Banner {
    id: number;
    title: string | null;
    image_url: string;
    link: string | null;
    order: number;
    is_active: boolean;
}

interface EditBannerProps {
    banner: Banner;
}

export default function EditBanner({ banner }: EditBannerProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Banners', href: '/admin/banners' },
        { title: 'Edit', href: `/admin/banners/${banner.id}/edit` },
    ];

    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        title: banner.title || '',
        link: banner.link || '',
        order: banner.order,
        image: null as File | null,
        is_active: banner.is_active,
    });

    const [preview, setPreview] = useState<string | null>(banner.image_url);
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
        post(route('admin.banners.update', banner.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Banner" />

            {processing && (
                <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
                    <div className="relative flex h-24 w-24 items-center justify-center">
                        <div className="absolute inset-0 animate-spin rounded-full border-4 border-slate-100 border-t-orange-600"></div>
                        <Loader2 className="h-10 w-10 animate-pulse text-orange-600" />
                    </div>
                    <p className="mt-4 text-sm font-black uppercase tracking-widest text-slate-900">Updating Banner...</p>
                </div>
            )}

            <div className="w-full p-6">
                <div className="mb-8 flex items-center justify-between">
                    <div className="space-y-1">
                        <Link 
                            href={route('admin.banners.index')} 
                            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 transition-colors hover:text-slate-950"
                        >
                            <ArrowLeft className="h-3 w-3" />
                            Back to banners
                        </Link>
                        <h1 className="text-3xl font-black uppercase tracking-tight text-slate-950">Edit Banner</h1>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
                        <div className="space-y-8">
                            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                <h3 className="mb-6 text-sm font-black uppercase tracking-widest text-slate-400">Basic Information</h3>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-slate-600">Banner Title (Optional)</label>
                                        <input
                                            type="text"
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-bold focus:border-slate-400 focus:bg-white focus:ring-0 outline-none"
                                            placeholder="e.g. Eid Sale 2026"
                                        />
                                        {errors.title && <p className="text-xs font-bold uppercase text-red-500">{errors.title}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-slate-600">Link URL (Optional)</label>
                                        <input
                                            type="text"
                                            value={data.link}
                                            onChange={(e) => setData('link', e.target.value)}
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-bold focus:border-slate-400 focus:bg-white focus:ring-0 outline-none"
                                            placeholder="e.g. /products?category=sale"
                                        />
                                        {errors.link && <p className="text-xs font-bold uppercase text-red-500">{errors.link}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-slate-600">Sort Order</label>
                                        <input
                                            type="number"
                                            value={data.order}
                                            onChange={(e) => setData('order', parseInt(e.target.value) || 0)}
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-bold focus:border-slate-400 focus:bg-white focus:ring-0 outline-none"
                                            placeholder="0"
                                        />
                                        {errors.order && <p className="text-xs font-bold uppercase text-red-500">{errors.order}</p>}
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                <h3 className="mb-6 text-sm font-black uppercase tracking-widest text-slate-400">Banner Image</h3>
                                <div className="space-y-4">
                                    <div className="relative">
                                        {preview ? (
                                            <div className="relative aspect-[16/9] sm:aspect-[21/9] lg:aspect-[3/1] w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                                                <img src={preview} alt="Banner Preview" className="h-full w-full object-contain" />
                                                <button
                                                    type="button"
                                                    onClick={removeImage}
                                                    className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-950/50 text-white backdrop-blur transition-colors hover:bg-red-500"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div
                                                onClick={() => fileInputRef.current?.click()}
                                                className="flex aspect-[16/9] sm:aspect-[21/9] lg:aspect-[3/1] w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 transition-colors hover:border-slate-400 hover:bg-slate-100"
                                            >
                                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm">
                                                    <Upload className="h-6 w-6" />
                                                </div>
                                                <p className="mt-4 text-xs font-black uppercase tracking-widest text-slate-500">Upload Banner Image</p>
                                                <p className="mt-1 text-[10px] font-bold text-slate-400 uppercase">Recommended Size: 1920x640px</p>
                                                <p className="mt-1 text-[10px] font-bold text-slate-400 uppercase">Required: JPEG/PNG/WEBP/AVIF (Max: 5MB)</p>
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
                                    {errors.image && <p className="text-xs font-bold uppercase text-red-500">{errors.image}</p>}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                <h3 className="mb-6 text-sm font-black uppercase tracking-widest text-slate-400">Status</h3>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <label className="text-xs font-black uppercase tracking-widest text-slate-600">Active Status</label>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Enable/Disable this banner</p>
                                    </div>
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

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full rounded-2xl bg-slate-950 py-4 text-sm font-black uppercase tracking-[0.2em] text-white shadow-xl shadow-slate-950/20 transition-all hover:-translate-y-1 hover:bg-slate-800 disabled:opacity-50 active:translate-y-0"
                            >
                                Update Banner
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
