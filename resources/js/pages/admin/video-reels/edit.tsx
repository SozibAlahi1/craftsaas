import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Loader2, Youtube } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Video Reels', href: '/admin/video-reels' },
    { title: 'Edit', href: '#' },
];

interface Product {
    id: number;
    name: string;
    price: string;
}

interface VideoReel {
    id: number;
    youtube_id: string;
    title: string | null;
    product_id: number | null;
    category_id: number | null;
    order: number;
    is_active: boolean;
}

interface Category {
    id: number;
    name: string;
}

interface EditVideoReelProps {
    reel: VideoReel;
    products: Product[];
    categories: Category[];
}

export default function EditVideoReel({ reel, products, categories }: EditVideoReelProps) {
    const { data, setData, put, processing, errors } = useForm({
        youtube_id: reel.youtube_id,
        title: reel.title || '',
        product_id: reel.product_id || '',
        category_id: reel.category_id || '',
        order: reel.order,
        is_active: reel.is_active,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('admin.video-reels.update', reel.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Video Reel" />

            {processing && (
                <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
                    <div className="relative flex h-24 w-24 items-center justify-center">
                        <div className="absolute inset-0 animate-spin rounded-full border-4 border-slate-100 border-t-red-600"></div>
                        <Loader2 className="h-10 w-10 animate-pulse text-red-600" />
                    </div>
                    <p className="mt-4 text-sm font-black uppercase tracking-widest text-slate-900">Updating Reel...</p>
                </div>
            )}

            <div className="w-full p-6">
                <div className="mb-8 flex items-center justify-between">
                    <div className="space-y-1">
                        <Link 
                            href={route('admin.video-reels.index')} 
                            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 transition-colors hover:text-slate-950"
                        >
                            <ArrowLeft className="h-3 w-3" />
                            Back to reels
                        </Link>
                        <h1 className="text-3xl font-black uppercase tracking-tight text-slate-950">Edit Video Reel</h1>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
                        <div className="space-y-8">
                            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                <h3 className="mb-6 text-sm font-black uppercase tracking-widest text-slate-400">Basic Information</h3>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-slate-600">YouTube Video ID <span className="text-red-500">*</span></label>
                                        <div className="relative flex items-center">
                                            <div className="absolute left-4 text-slate-400">
                                                <Youtube className="h-5 w-5" />
                                            </div>
                                            <input
                                                type="text"
                                                value={data.youtube_id}
                                                onChange={(e) => setData('youtube_id', e.target.value)}
                                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-bold focus:border-slate-400 focus:bg-white focus:ring-0 outline-none"
                                                placeholder="e.g. jYAhbGDTkXs"
                                            />
                                        </div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">The 11-character ID from the YouTube URL.</p>
                                        {errors.youtube_id && <p className="text-xs font-bold uppercase text-red-500">{errors.youtube_id}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-slate-600">Reel Title</label>
                                        <input
                                            type="text"
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-bold focus:border-slate-400 focus:bg-white focus:ring-0 outline-none"
                                            placeholder="Optional descriptive title"
                                        />
                                        {errors.title && <p className="text-xs font-bold uppercase text-red-500">{errors.title}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-slate-600">Category Section</label>
                                        <div className="relative">
                                            <select
                                                value={data.category_id}
                                                onChange={(e) => setData('category_id', e.target.value)}
                                                className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-bold focus:border-slate-400 focus:bg-white focus:ring-0 outline-none"
                                            >
                                                <option value="">None</option>
                                                {categories.map((category) => (
                                                    <option key={category.id} value={category.id}>
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
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Select the category section where this reel will appear.</p>
                                        {errors.category_id && <p className="text-xs font-bold uppercase text-red-500">{errors.category_id}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-slate-600">Associated Product</label>
                                        <div className="relative">
                                            <select
                                                value={data.product_id}
                                                onChange={(e) => setData('product_id', e.target.value)}
                                                className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-bold focus:border-slate-400 focus:bg-white focus:ring-0 outline-none"
                                            >
                                                <option value="">None (Just show video)</option>
                                                {products.map((product) => (
                                                    <option key={product.id} value={product.id}>
                                                        {product.name} - {product.price}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                                                <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Product to link in the "Add to Cart" button.</p>
                                        {errors.product_id && <p className="text-xs font-bold uppercase text-red-500">{errors.product_id}</p>}
                                    </div>
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
                                            onChange={(e) => setData('order', parseInt(e.target.value) || 0)}
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
                                                data.is_active ? 'bg-red-600' : 'bg-slate-200'
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
                                Update Reel
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
