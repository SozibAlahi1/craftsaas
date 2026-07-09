import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Loader2, Upload, X } from 'lucide-react';
import { useRef, useState } from 'react';

interface Category {
    id: number;
    name: string;
    description: string | null;
    banner_image: string | null;
    show_on_home: boolean;
}

interface EditCategoryProps {
    category: Category;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Categories', href: '/admin/categories' },
    { title: 'Edit', href: '#' },
];

export default function EditCategory({ category }: EditCategoryProps) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        name: category.name,
        description: category.description || '',
        banner_image: null as File | null,
        show_on_home: category.show_on_home,
    });

    const [preview, setPreview] = useState<string | null>(category.banner_image);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('banner_image', file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        setData('banner_image', null);
        setPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Since we have a file upload, we use POST with _method=PUT
        post(route('admin.categories.update', category.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Category: ${category.name}`} />

            {processing && (
                <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
                    <div className="relative flex h-24 w-24 items-center justify-center">
                        <div className="absolute inset-0 animate-spin rounded-full border-4 border-slate-100 border-t-orange-600"></div>
                        <Loader2 className="h-10 w-10 animate-pulse text-orange-600" />
                    </div>
                    <p className="mt-4 text-sm font-black tracking-widest text-slate-900 uppercase">Updating Category...</p>
                </div>
            )}

            <div className="w-full p-6">
                <div className="mb-8 flex items-center justify-between">
                    <div className="space-y-1">
                        <Link
                            href={route('admin.categories.index')}
                            className="inline-flex items-center gap-2 text-xs font-black tracking-widest text-slate-400 uppercase transition-colors hover:text-slate-950"
                        >
                            <ArrowLeft className="h-3 w-3" />
                            Back to categories
                        </Link>
                        <h1 className="text-3xl font-black tracking-tight text-slate-950 uppercase">Edit Category</h1>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
                        <div className="space-y-8">
                            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                <h3 className="mb-6 text-sm font-black tracking-widest text-slate-400 uppercase">Basic Information</h3>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black tracking-widest text-slate-600 uppercase">Category Name</label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-bold outline-none focus:border-slate-400 focus:bg-white focus:ring-0"
                                            placeholder="e.g. Panjabi"
                                        />
                                        {errors.name && <p className="text-xs font-bold text-red-500 uppercase">{errors.name}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black tracking-widest text-slate-600 uppercase">Description</label>
                                        <textarea
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            rows={4}
                                            className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-bold outline-none focus:border-slate-400 focus:bg-white focus:ring-0"
                                            placeholder="Tell us about this category..."
                                        />
                                        {errors.description && <p className="text-xs font-bold text-red-500 uppercase">{errors.description}</p>}
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                <h3 className="mb-6 text-sm font-black tracking-widest text-slate-400 uppercase">Category Banner</h3>
                                <div className="space-y-4">
                                    <div className="relative">
                                        {preview ? (
                                            <div className="relative aspect-[3/1] w-full overflow-hidden rounded-xl border border-slate-200">
                                                <img src={preview} alt="Banner Preview" className="h-full w-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={removeImage}
                                                    className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-950/50 text-white backdrop-blur transition-colors hover:bg-red-500"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div
                                                onClick={() => fileInputRef.current?.click()}
                                                className="flex aspect-[3/1] w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 transition-colors hover:border-slate-400 hover:bg-slate-100"
                                            >
                                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm">
                                                    <Upload className="h-6 w-6" />
                                                </div>
                                                <p className="mt-4 text-xs font-black tracking-widest text-slate-500 uppercase">
                                                    Upload Banner Image
                                                </p>
                                                <p className="mt-1 text-[10px] font-bold text-slate-400 uppercase">Recommended: 1200x400px</p>
                                            </div>
                                        )}
                                        <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
                                    </div>
                                    {errors.banner_image && <p className="text-xs font-bold text-red-500 uppercase">{errors.banner_image}</p>}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                <h3 className="mb-6 text-sm font-black tracking-widest text-slate-400 uppercase">Visibility</h3>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <label className="text-xs font-black tracking-widest text-slate-600 uppercase">Show on Home</label>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Display as a section on home page</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setData('show_on_home', !data.show_on_home)}
                                        className={`relative h-6 w-11 flex-none rounded-full transition-colors duration-200 focus:outline-none ${
                                            data.show_on_home ? 'bg-orange-600' : 'bg-slate-200'
                                        }`}
                                    >
                                        <span
                                            className={`absolute top-1 left-1 h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                                                data.show_on_home ? 'translate-x-5' : 'translate-x-0'
                                            }`}
                                        />
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full rounded-2xl bg-slate-950 py-4 text-sm font-black tracking-[0.2em] text-white uppercase shadow-xl shadow-slate-950/20 transition-all hover:-translate-y-1 hover:bg-slate-800 active:translate-y-0 disabled:opacity-50"
                            >
                                Update Category
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
