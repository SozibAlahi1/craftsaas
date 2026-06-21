import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Search, Edit2, Trash2, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { ConfirmModal } from '@/components/ui/confirm-modal';

interface Product {
    id: number;
    name: string;
    slug: string;
    category: {
        name: string;
        slug: string;
    } | null;
    price: string;
    image: string;
    stock_quantity: number;
    is_in_stock: boolean;
}

interface ProductIndexProps {
    products: Product[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Products', href: '/admin/products' },
];

export default function ProductIndex({ products }: ProductIndexProps) {
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const handleDelete = (id: number) => {
        setDeleteId(id);
    };

    const confirmDeletion = () => {
        if (deleteId !== null) {
            router.delete(route('admin.products.destroy', deleteId));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Products" />
            
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black text-slate-950 uppercase tracking-tight">Products</h1>
                        <p className="text-sm text-slate-500 font-medium">Manage your store's catalog</p>
                    </div>
                    <Link 
                        href={route('admin.products.create')}
                        className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2 text-sm font-black text-white transition-all hover:bg-slate-800 active:scale-95 uppercase tracking-widest shadow-lg"
                    >
                        <Plus className="h-4 w-4" />
                        Add Product
                    </Link>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                    <div className="border-b border-slate-100 bg-slate-50/50 p-4">
                        <div className="relative max-w-sm">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input 
                                type="text" 
                                placeholder="Search products..." 
                                className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm focus:border-slate-400 focus:ring-0 focus:outline-none placeholder:font-medium transition-colors"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100">
                                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Product</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Category</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Stock</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Price</th>
                                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {products.length > 0 ? (
                                    products.map((product) => (
                                        <tr key={product.id} className="hover:bg-slate-50/30 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-12 w-12 flex-none overflow-hidden rounded-lg border border-slate-100 bg-slate-50 p-0.5">
                                                        <img src={product.image} alt={product.name} className="h-full w-full object-cover rounded" />
                                                    </div>
                                                    <div>
                                                        <div className="font-black text-slate-900 group-hover:text-orange-600 transition-colors leading-tight">{product.name}</div>
                                                        <div className="text-xs font-bold text-slate-400 font-mono mt-0.5">{product.slug}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-black text-slate-600 uppercase tracking-tighter">
                                                    {product.category?.name ?? 'Uncategorized'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {product.is_in_stock && product.stock_quantity > 0 ? (
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-slate-900">{product.stock_quantity} in stock</span>
                                                        <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Available</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-slate-400">0 in stock</span>
                                                        <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">Out of Stock</span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 font-black text-slate-900">{product.price}</td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Link 
                                                        href={`/products/${product.slug}`} 
                                                        target="_blank"
                                                        className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                                                        title="View on storefront"
                                                    >
                                                        <ExternalLink className="h-4 w-4" />
                                                    </Link>
                                                    <Link 
                                                        href={route('admin.products.edit', product.id)}
                                                        className="p-2 text-slate-400 hover:text-blue-600 transition-colors" 
                                                        title="Edit"
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                    </Link>
                                                    <button 
                                                        onClick={() => handleDelete(product.id)}
                                                        className="p-2 text-slate-400 hover:text-red-600 transition-colors" 
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center">
                                                    <Search className="h-6 w-6 text-slate-300" />
                                                </div>
                                                <p className="text-sm font-medium text-slate-400">No products found in the catalog.</p>
                                            </div>
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
                title="Delete Product"
                description="Are you sure you want to delete this product? This action cannot be undone."
                confirmText="Delete"
            />
        </AppLayout>
    );
}
