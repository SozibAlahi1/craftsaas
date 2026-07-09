import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Edit, Layers, Link2, Save } from 'lucide-react';

interface Category {
    id: number;
    name: string;
}

interface ParentItem {
    id: number;
    title: string;
}

interface MenuItem {
    id: number;
    title: string;
    type: 'custom' | 'category';
    url: string | null;
    category_id: number | null;
    parent_id: number | null;
    order: number;
}

interface MenuItemEditProps {
    menuItem: MenuItem;
    categories: Category[];
    parentItems: ParentItem[];
}

export default function MenuItemEdit({ menuItem, categories, parentItems }: MenuItemEditProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Header Menus', href: '/admin/menu-items' },
        { title: `Edit: ${menuItem.title}`, href: `/admin/menu-items/${menuItem.id}/edit` },
    ];

    const { data, setData, put, processing, errors } = useForm({
        title: menuItem.title,
        type: menuItem.type,
        url: menuItem.url || '',
        category_id: menuItem.category_id || '',
        parent_id: menuItem.parent_id || '',
        order: menuItem.order,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('admin.menu-items.update', menuItem.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Menu Item: ${menuItem.title}`} />

            <div className="flex w-full flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <Link
                            href={route('admin.menu-items.index')}
                            className="mb-2 inline-flex items-center gap-1.5 text-xs font-bold tracking-wider text-slate-500 uppercase transition-colors hover:text-slate-900"
                        >
                            <ArrowLeft className="h-3.5 w-3.5" />
                            Back to List
                        </Link>
                        <h1 className="flex items-center gap-2 text-2xl font-black tracking-tight text-slate-950 uppercase">
                            <Edit className="h-5 w-5 text-orange-600" />
                            Edit Menu Item: {menuItem.title}
                        </h1>
                        <p className="text-sm font-medium text-slate-500">Modify settings for this storefront navigation link.</p>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title Field */}
                        <div className="space-y-1.5">
                            <label htmlFor="title" className="block text-xs font-black tracking-wider text-slate-900 uppercase">
                                Menu Title / Label
                            </label>
                            <input
                                type="text"
                                id="title"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                placeholder="e.g. Wallets, Accessories, Shop All"
                                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold placeholder:font-medium placeholder:text-slate-400 focus:border-slate-400 focus:ring-0 focus:outline-none"
                                required
                            />
                            {errors.title && <div className="mt-1 text-xs font-bold text-rose-500">{errors.title}</div>}
                        </div>

                        {/* Type Picker */}
                        <div className="space-y-1.5">
                            <label className="block text-xs font-black tracking-wider text-slate-900 uppercase">Link Type</label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setData('type', 'custom')}
                                    className={`flex items-center justify-center gap-2 rounded-xl border-2 p-4 text-sm font-bold transition-all ${
                                        data.type === 'custom'
                                            ? 'border-slate-950 bg-slate-50 text-slate-950 shadow-sm'
                                            : 'border-slate-200 text-slate-500 hover:border-slate-300'
                                    }`}
                                >
                                    <Link2 className="h-4 w-4" />
                                    Custom URL / Link
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setData('type', 'category')}
                                    className={`flex items-center justify-center gap-2 rounded-xl border-2 p-4 text-sm font-bold transition-all ${
                                        data.type === 'category'
                                            ? 'border-slate-950 bg-slate-50 text-slate-950 shadow-sm'
                                            : 'border-slate-200 text-slate-500 hover:border-slate-300'
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
                                <label htmlFor="url" className="block text-xs font-black tracking-wider text-slate-900 uppercase">
                                    Custom URL / Path
                                </label>
                                <input
                                    type="text"
                                    id="url"
                                    value={data.url}
                                    onChange={(e) => setData('url', e.target.value)}
                                    placeholder="e.g. /products, /about, https://google.com"
                                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold placeholder:font-medium placeholder:text-slate-400 focus:border-slate-400 focus:ring-0 focus:outline-none"
                                    required={data.type === 'custom'}
                                />
                                <p className="mt-1 text-[10px] font-bold text-slate-400 uppercase">
                                    Use relative paths like <code className="rounded bg-slate-50 px-1 py-0.5">/products</code> or full paths like{' '}
                                    <code className="rounded bg-slate-50 px-1 py-0.5">https://...</code>
                                </p>
                                {errors.url && <div className="mt-1 text-xs font-bold text-rose-500">{errors.url}</div>}
                            </div>
                        ) : (
                            <div className="space-y-1.5">
                                <label htmlFor="category_id" className="block text-xs font-black tracking-wider text-slate-900 uppercase">
                                    Select Product Category
                                </label>
                                <select
                                    id="category_id"
                                    value={data.category_id}
                                    onChange={(e) => setData('category_id', e.target.value)}
                                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold focus:border-slate-400 focus:ring-0 focus:outline-none"
                                    required={data.type === 'category'}
                                >
                                    <option value="">-- Choose Category --</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.category_id && <div className="mt-1 text-xs font-bold text-rose-500">{errors.category_id}</div>}
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            {/* Parent selector */}
                            <div className="space-y-1.5">
                                <label htmlFor="parent_id" className="block text-xs font-black tracking-wider text-slate-900 uppercase">
                                    Parent Item (Nesting)
                                </label>
                                <select
                                    id="parent_id"
                                    value={data.parent_id}
                                    onChange={(e) => setData('parent_id', e.target.value)}
                                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold focus:border-slate-400 focus:ring-0 focus:outline-none"
                                >
                                    <option value="">None (Top-Level Item)</option>
                                    {parentItems.map((parent) => (
                                        <option key={parent.id} value={parent.id}>
                                            {parent.title}
                                        </option>
                                    ))}
                                </select>
                                {errors.parent_id && <div className="mt-1 text-xs font-bold text-rose-500">{errors.parent_id}</div>}
                            </div>

                            {/* Sort Order */}
                            <div className="space-y-1.5">
                                <label htmlFor="order" className="block text-xs font-black tracking-wider text-slate-900 uppercase">
                                    Sort Order
                                </label>
                                <input
                                    type="number"
                                    id="order"
                                    value={data.order}
                                    onChange={(e) => setData('order', parseInt(e.target.value) || 0)}
                                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold focus:border-slate-400 focus:ring-0 focus:outline-none"
                                    min="0"
                                />
                                {errors.order && <div className="mt-1 text-xs font-bold text-rose-500">{errors.order}</div>}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
                            <Link
                                href={route('admin.menu-items.index')}
                                className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-200 bg-white px-5 text-sm font-black tracking-widest text-slate-700 uppercase transition-colors hover:bg-slate-50 active:scale-95"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-slate-950 px-6 text-sm font-black tracking-widest text-white uppercase shadow-lg transition-colors hover:bg-slate-800 active:scale-95 disabled:opacity-50"
                            >
                                <Save className="h-4 w-4" />
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
