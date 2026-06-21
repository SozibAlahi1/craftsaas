import { Head, Link, router } from '@inertiajs/react';
import { Search, Boxes, CheckCircle2, XCircle, Pencil, X, Save } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';

interface Variant {
    id: number;
    sku: string | null;
    stock_quantity: number;
    attribute_values: {
        value: string;
        attribute: { name: string };
    }[];
}

interface Product {
    id: number;
    name: string;
    slug: string;
    stock_quantity: number;
    is_in_stock: boolean;
    image: string;
    category?: {
        name: string;
    };
    variants?: Variant[];
}

interface StocksIndexProps {
    products: Product[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Stock Management', href: '/admin/stocks' },
];

export default function StocksIndex({ products }: StocksIndexProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState<'all' | 'in_stock' | 'out_of_stock'>('all');

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filter === 'all' 
            ? true 
            : filter === 'in_stock' ? product.is_in_stock && product.stock_quantity > 0 : !product.is_in_stock || product.stock_quantity === 0;
        return matchesSearch && matchesFilter;
    });

    const handleStockUpdate = (productId: number, newQuantity: number) => {
        router.post(route('admin.stocks.update', productId), {
            stock_quantity: newQuantity,
        }, {
            preserveScroll: true,
            preserveState: true,
            onError: (errors) => {
                console.error("Stock update failed", errors);
                alert("Failed to save stock. Please check the values.");
            }
        });
    };

    const handleVariantStockUpdate = (variantId: number, newQuantity: number) => {
        router.post(route('admin.stocks.variant.update', variantId), {
            stock_quantity: newQuantity,
        }, {
            preserveScroll: true,
            preserveState: true,
            onError: (errors) => {
                console.error("Variant stock update failed", errors);
                alert("Failed to save stock. Please check the values.");
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Stock Management" />

            <div className="w-full p-4 sm:p-6 lg:p-8">
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Stock Management</h1>
                        <p className="mt-1 text-sm font-medium text-slate-500">Quickly view and update your product inventory.</p>
                    </div>
                </div>

                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative max-w-sm flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-none border border-slate-200 py-2.5 pl-10 pr-4 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-slate-950 focus:outline-none focus:ring-1 focus:ring-slate-950"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value as any)}
                            className="rounded-none border border-slate-200 py-2.5 pl-4 pr-8 text-sm font-bold text-slate-700 focus:border-slate-950 focus:outline-none focus:ring-1 focus:ring-slate-950"
                        >
                            <option value="all">All Products</option>
                            <option value="in_stock">In Stock</option>
                            <option value="out_of_stock">Out of Stock</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-hidden rounded-none border border-slate-200 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-slate-200 bg-slate-50">
                                <tr>
                                    <th className="whitespace-nowrap px-6 py-4 font-black tracking-wide text-slate-900">Product / Variant</th>
                                    <th className="whitespace-nowrap px-6 py-4 font-black tracking-wide text-slate-900">Category</th>
                                    <th className="whitespace-nowrap px-6 py-4 font-black tracking-wide text-slate-900">Status</th>
                                    <th className="whitespace-nowrap px-6 py-4 font-black tracking-wide text-slate-900">Stock Quantity</th>
                                    <th className="whitespace-nowrap px-6 py-4 font-black tracking-wide text-slate-900 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredProducts.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                            <div className="flex flex-col items-center gap-3">
                                                <Boxes className="h-10 w-10 text-slate-300" />
                                                <p className="font-medium">No products found matching your criteria.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredProducts.map((product) => (
                                        <React.Fragment key={product.id}>
                                            <StockTableRow 
                                                product={product} 
                                                onUpdate={handleStockUpdate} 
                                            />
                                            {product.variants && product.variants.map((variant) => (
                                                <VariantStockTableRow 
                                                    key={`variant-${variant.id}`} 
                                                    variant={variant} 
                                                    onUpdate={handleVariantStockUpdate} 
                                                />
                                            ))}
                                        </React.Fragment>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

function StockTableRow({ product, onUpdate }: { product: Product, onUpdate: (id: number, qty: number) => void }) {
    const [quantity, setQuantity] = useState(product.stock_quantity);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        setQuantity(product.stock_quantity);
    }, [product]);

    const isDirty = quantity !== product.stock_quantity;

    const handleSave = () => {
        onUpdate(product.id, quantity);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setQuantity(product.stock_quantity);
        setIsEditing(false);
    };

    return (
        <tr className="transition-colors hover:bg-slate-50/50 bg-white">
            <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                    <img src={product.image} alt={product.name} className="h-12 w-12 rounded-none object-cover border border-slate-200" />
                    <div>
                        <div className="font-bold text-slate-900">{product.name}</div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-0.5">{product.slug}</div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 font-semibold text-slate-600">
                {product.category?.name || '-'}
            </td>
            <td className="px-6 py-4">
                <span className={`inline-flex items-center gap-1.5 rounded-none px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${
                    product.stock_quantity > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                }`}>
                    {product.stock_quantity > 0 ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                    {product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
            </td>
            <td className="px-6 py-4">
                {isEditing ? (
                    <input
                        type="number"
                        min="0"
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                        className="w-24 rounded-none border border-slate-200 py-1.5 px-3 text-sm font-bold text-slate-900 focus:border-slate-950 focus:outline-none focus:ring-1 focus:ring-slate-950"
                    />
                ) : (
                    <span className={`font-black ${product.stock_quantity > 5 ? 'text-slate-900' : 'text-orange-600'}`}>
                        {product.stock_quantity}
                    </span>
                )}
            </td>
            <td className="px-6 py-4 text-right">
                {isEditing ? (
                    <div className="flex items-center justify-end gap-1">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={handleCancel}
                            className="h-8 w-8 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-none"
                            title="Cancel"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                        <Button 
                            variant="ghost"
                            size="icon" 
                            onClick={handleSave}
                            disabled={!isDirty}
                            className={`h-8 w-8 rounded-none ${isDirty ? 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50' : 'text-slate-300'}`}
                            title="Save"
                        >
                            <Save className="h-4 w-4" />
                        </Button>
                    </div>
                ) : (
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setIsEditing(true)}
                        className="h-8 w-8 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-none"
                        title="Edit Stock"
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                )}
            </td>
        </tr>
    );
}

function VariantStockTableRow({ variant, onUpdate }: { variant: Variant, onUpdate: (id: number, qty: number) => void }) {
    const [quantity, setQuantity] = useState(variant.stock_quantity);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        setQuantity(variant.stock_quantity);
    }, [variant]);

    const isDirty = quantity !== variant.stock_quantity;

    const handleSave = () => {
        onUpdate(variant.id, quantity);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setQuantity(variant.stock_quantity);
        setIsEditing(false);
    };

    const variantName = variant.attribute_values.map(av => av.value).join(' / ');

    return (
        <tr className="transition-colors hover:bg-slate-50/50 bg-slate-50 border-t border-dashed border-slate-200">
            <td className="px-6 py-3 pl-24">
                <div className="flex items-center gap-2">
                    <div className="h-1 w-4 bg-slate-300 rounded-full"></div>
                    <div>
                        <div className="font-bold text-slate-700 text-xs uppercase tracking-widest">{variantName}</div>
                        {variant.sku && <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-0.5">SKU: {variant.sku}</div>}
                    </div>
                </div>
            </td>
            <td className="px-6 py-3 font-semibold text-slate-600 text-xs">
                -
            </td>
            <td className="px-6 py-3">
                <span className={`inline-flex items-center gap-1.5 rounded-none px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${
                    variant.stock_quantity > 0 ? 'bg-emerald-100/50 text-emerald-700' : 'bg-rose-100/50 text-rose-700'
                }`}>
                    {variant.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
            </td>
            <td className="px-6 py-3">
                {isEditing ? (
                    <input
                        type="number"
                        min="0"
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                        className="w-20 rounded-none border border-slate-200 py-1 px-2 text-xs font-bold text-slate-900 focus:border-slate-950 focus:outline-none focus:ring-1 focus:ring-slate-950"
                    />
                ) : (
                    <span className={`font-black text-sm ${variant.stock_quantity > 5 ? 'text-slate-700' : 'text-orange-600'}`}>
                        {variant.stock_quantity}
                    </span>
                )}
            </td>
            <td className="px-6 py-3 text-right">
                {isEditing ? (
                    <div className="flex items-center justify-end gap-1">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={handleCancel}
                            className="h-6 w-6 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-none"
                            title="Cancel"
                        >
                            <X className="h-3 w-3" />
                        </Button>
                        <Button 
                            variant="ghost"
                            size="icon" 
                            onClick={handleSave}
                            disabled={!isDirty}
                            className={`h-6 w-6 rounded-none ${isDirty ? 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50' : 'text-slate-300'}`}
                            title="Save"
                        >
                            <Save className="h-3 w-3" />
                        </Button>
                    </div>
                ) : (
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setIsEditing(true)}
                        className="h-6 w-6 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-none"
                        title="Edit Variant Stock"
                    >
                        <Pencil className="h-3 w-3" />
                    </Button>
                )}
            </td>
        </tr>
    );
}
