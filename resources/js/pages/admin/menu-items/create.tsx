import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Sparkles, Layers, Link2 } from 'lucide-react';
import { useEffect } from 'react';

interface Category {
    id: number;
    name: string;
}

interface ParentItem {
    id: number;
    title: string;
}

interface MenuItemCreateProps {
    categories: Category[];
    parentItems: ParentItem[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Header Menus', href: '/admin/menu-items' },
    { title: 'Create Menu Item', href: '/admin/menu-items/create' },
];

export default function MenuItemCreate({ categories, parentItems }: MenuItemCreateProps) {
    const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const preselectedParentId = urlParams ? urlParams.get('parent_id') : '';

    const { data, setData, post, processing, errors } = useForm({
        title: '',
        type: 'custom',
        url: '',
        category_id: '',
        parent_id: preselectedParentId || '',
        order: 0,
    });

    // Handle preselected parent id from URL params on load
    useEffect(() => {
        if (preselectedParentId) {
            setData('parent_id', preselectedParentId);
        }
    }, [preselectedParentId]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.menu-items.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Menu Item" />
            
            <div className="flex flex-col gap-6 p-6 w-full">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <Link 
                            href={route('admin.menu-items.index')}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-wider mb-2"
                        >
                            <ArrowLeft className="h-3.5 w-3.5" />
                            Back to List
                        </Link>
                        <h1 className="text-2xl font-black text-slate-950 uppercase tracking-tight flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-orange-600" />
                            Add Menu Item
                        </h1>
                        <p className="text-sm text-slate-500 font-medium">Configure a new navigation link in your site's header menu.</p>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title Field */}
                        <div className="space-y-1.5">
                            <label htmlFor="title" className="text-xs font-black text-slate-900 uppercase tracking-wider block">
                                Menu Title / Label
                            </label>
                            <input 
                                type="text"
                                id="title"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                placeholder="e.g. Wallets, Accessories, Shop All"
                                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm focus:border-slate-400 focus:ring-0 focus:outline-none placeholder:font-medium placeholder:text-slate-400 font-semibold"
                                required
                            />
                            {errors.title && <div className="text-xs font-bold text-rose-500 mt-1">{errors.title}</div>}
                        </div>

                        {/* Type Picker */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-black text-slate-900 uppercase tracking-wider block">
                                Link Type
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setData('type', 'custom')}
                                    className={`flex items-center justify-center gap-2 rounded-xl p-4 border-2 text-sm font-bold transition-all ${
                                        data.type === 'custom' 
                                            ? 'border-slate-950 bg-slate-50 text-slate-950 shadow-sm' 
                                            : 'border-slate-200 hover:border-slate-300 text-slate-500'
                                    }`}
                                >
                                    <Link2 className="h-4 w-4" />
                                    Custom URL / Link
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setData('type', 'category')}
                                    className={`flex items-center justify-center gap-2 rounded-xl p-4 border-2 text-sm font-bold transition-all ${
                                        data.type === 'category' 
                                            ? 'border-slate-950 bg-slate-50 text-slate-950 shadow-sm' 
                                            : 'border-slate-200 hover:border-slate-300 text-slate-500'
                                    }`}
                                >
                                    <Layers className="h-4 w-4" />
                                    Product Category
                                </button>
                            </div>
                        </div>

                        {/* Conditional Inputs */}
                        {data.type === 'custom' ? (
                            <div className="space-y-1.5">
                                <label htmlFor="url" className="text-xs font-black text-slate-900 uppercase tracking-wider block">
                                    Custom URL / Path
                                </label>
                                <input 
                                    type="text"
                                    id="url"
                                    value={data.url}
                                    onChange={(e) => setData('url', e.target.value)}
                                    placeholder="e.g. /products, /about, https://google.com"
                                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm focus:border-slate-400 focus:ring-0 focus:outline-none placeholder:font-medium placeholder:text-slate-400 font-semibold"
                                    required={data.type === 'custom'}
                                />
                                <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Use relative paths like <code className="bg-slate-50 px-1 py-0.5 rounded">/products</code> or full paths like <code className="bg-slate-50 px-1 py-0.5 rounded">https://...</code></p>
                                {errors.url && <div className="text-xs font-bold text-rose-500 mt-1">{errors.url}</div>}
                            </div>
                        ) : (
                            <div className="space-y-1.5">
                                <label htmlFor="category_id" className="text-xs font-black text-slate-900 uppercase tracking-wider block">
                                    Select Product Category
                                </label>
                                <select 
                                    id="category_id"
                                    value={data.category_id}
                                    onChange={(e) => setData('category_id', e.target.value)}
                                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm focus:border-slate-400 focus:ring-0 focus:outline-none font-semibold"
                                    required={data.type === 'category'}
                                >
                                    <option value="">-- Choose Category --</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                                {errors.category_id && <div className="text-xs font-bold text-rose-500 mt-1">{errors.category_id}</div>}
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            {/* Parent selector */}
                            <div className="space-y-1.5">
                                <label htmlFor="parent_id" className="text-xs font-black text-slate-900 uppercase tracking-wider block">
                                    Parent Item (Nesting)
                                </label>
                                <select 
                                    id="parent_id"
                                    value={data.parent_id}
                                    onChange={(e) => setData('parent_id', e.target.value)}
                                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm focus:border-slate-400 focus:ring-0 focus:outline-none font-semibold"
                                >
                                    <option value="">None (Top-Level Item)</option>
                                    {parentItems.map((parent) => (
                                        <option key={parent.id} value={parent.id}>{parent.title}</option>
                                    ))}
                                </select>
                                {errors.parent_id && <div className="text-xs font-bold text-rose-500 mt-1">{errors.parent_id}</div>}
                            </div>

                            {/* Sort Order */}
                            <div className="space-y-1.5">
                                <label htmlFor="order" className="text-xs font-black text-slate-900 uppercase tracking-wider block">
                                    Sort Order
                                </label>
                                <input 
                                    type="number"
                                    id="order"
                                    value={data.order}
                                    onChange={(e) => setData('order', parseInt(e.target.value) || 0)}
                                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm focus:border-slate-400 focus:ring-0 focus:outline-none font-semibold"
                                    min="0"
                                />
                                {errors.order && <div className="text-xs font-bold text-rose-500 mt-1">{errors.order}</div>}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                            <Link
                                href={route('admin.menu-items.index')}
                                className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-200 bg-white px-5 text-sm font-black text-slate-700 hover:bg-slate-50 transition-colors uppercase tracking-widest active:scale-95"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-slate-950 px-6 text-sm font-black text-white hover:bg-slate-800 transition-colors uppercase tracking-widest shadow-lg active:scale-95 disabled:opacity-50"
                            >
                                <Save className="h-4 w-4" />
                                Save Menu Item
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
