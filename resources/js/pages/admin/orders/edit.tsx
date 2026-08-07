import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, CreditCard, MapPin, Package, Plus, Trash2, User, Search, Loader2, Save, ShoppingBag } from 'lucide-react';
import { useState, useMemo } from 'react';

interface OrderItemInput {
    id?: number;
    product_id?: number | null;
    product_variant_id?: number | null;
    name: string;
    price: number;
    quantity: number;
    options?: Record<string, string | null> | null;
}

interface OrderData {
    id: number;
    order_number: string;
    full_name: string;
    phone: string;
    address: string;
    payment_method: string;
    status: string;
    shipping: number;
    subtotal: number;
    total: number;
    items: OrderItemInput[];
}

interface ProductItem {
    id: number;
    name: string;
    price: number;
    image?: string | null;
}

interface OrderEditProps {
    order: OrderData;
    products?: ProductItem[];
}

const parsePrice = (val: any): number => {
    if (typeof val === 'number') return isNaN(val) ? 0 : val;
    if (!val) return 0;
    const cleaned = String(val).replace(/[^\d.]/g, '');
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
};

export default function OrderEdit({ order, products = [] }: OrderEditProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Orders', href: '/admin/orders' },
        { title: `#${order.order_number}`, href: route('admin.orders.show', order.id) },
        { title: 'Edit', href: route('admin.orders.edit', order.id) },
    ];

    const { data, setData, put, processing, errors } = useForm({
        full_name: order.full_name || '',
        phone: order.phone || '',
        address: order.address || '',
        payment_method: order.payment_method || 'cod',
        status: order.status || 'pending',
        shipping: order.shipping || 0,
        items: (order.items || []).map((item) => ({
            id: item.id,
            product_id: item.product_id ?? null,
            product_variant_id: item.product_variant_id ?? null,
            name: item.name || '',
            price: parsePrice(item.price),
            quantity: Number(item.quantity) || 1,
            options: item.options ?? null,
        })),
    });

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [customItemName, setCustomItemName] = useState('');
    const [customItemPrice, setCustomItemPrice] = useState<number | ''>('');

    // Filter products locally for instantaneous response
    const filteredProducts = useMemo(() => {
        if (!searchQuery.trim()) return products;
        const q = searchQuery.toLowerCase();
        return products.filter((p) => p.name.toLowerCase().includes(q));
    }, [products, searchQuery]);

    // Computed totals
    const calculatedSubtotal = useMemo(() => {
        return data.items.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 1), 0);
    }, [data.items]);

    const calculatedTotal = useMemo(() => {
        return calculatedSubtotal + (Number(data.shipping) || 0);
    }, [calculatedSubtotal, data.shipping]);

    const handleItemChange = (index: number, field: keyof OrderItemInput, value: any) => {
        const updatedItems = [...data.items];
        updatedItems[index] = {
            ...updatedItems[index],
            [field]: value,
        };
        setData('items', updatedItems);
    };

    const handleRemoveItem = (index: number) => {
        if (data.items.length <= 1) {
            alert('An order must have at least one item.');
            return;
        }
        const updatedItems = data.items.filter((_, i) => i !== index);
        setData('items', updatedItems);
    };

    const handleAddProduct = (product: ProductItem) => {
        const newItem: OrderItemInput = {
            product_id: product.id,
            name: product.name,
            price: parsePrice(product.price),
            quantity: 1,
            options: product.image ? { image: product.image } : null,
        };
        setData('items', [...data.items, newItem]);
        setIsAddModalOpen(false);
        setSearchQuery('');
    };

    const handleQuickSelectProduct = (productIdStr: string) => {
        const prodId = parseInt(productIdStr, 10);
        const product = products.find((p) => p.id === prodId);
        if (product) {
            handleAddProduct(product);
        }
    };

    const handleAddCustomItem = () => {
        if (!customItemName.trim()) return;
        const newItem: OrderItemInput = {
            name: customItemName.trim(),
            price: parsePrice(customItemPrice),
            quantity: 1,
        };
        setData('items', [...data.items, newItem]);
        setCustomItemName('');
        setCustomItemPrice('');
        setIsAddModalOpen(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('admin.orders.update', order.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Order #${order.order_number}`} />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href={route('admin.orders.show', order.id)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50"
                            title="Back to order details"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-black tracking-tight text-slate-950 uppercase">
                                Edit Order #{order.order_number}
                            </h1>
                            <p className="text-sm font-medium text-slate-500">Update customer details, shipping, status, or add new items</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                    {/* Main Content Area: Items & Configuration */}
                    <div className="flex flex-col gap-6 xl:col-span-2">
                        {/* Customer Information Card */}
                        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
                                <User className="h-4 w-4 text-slate-500" />
                                <h2 className="text-sm font-black tracking-widest text-slate-900 uppercase">Customer Information</h2>
                            </div>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1.5 block text-xs font-bold text-slate-700">Customer Name *</label>
                                    <Input
                                        type="text"
                                        value={data.full_name}
                                        onChange={(e) => setData('full_name', e.target.value)}
                                        placeholder="Full Name"
                                        required
                                    />
                                    {errors.full_name && <p className="mt-1 text-xs font-bold text-red-600">{errors.full_name}</p>}
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-xs font-bold text-slate-700">Phone Number *</label>
                                    <Input
                                        type="text"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        placeholder="017xxxxxxxx"
                                        required
                                    />
                                    {errors.phone && <p className="mt-1 text-xs font-bold text-red-600">{errors.phone}</p>}
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="mb-1.5 block text-xs font-bold text-slate-700">Delivery Address *</label>
                                    <textarea
                                        className="w-full rounded-md border border-slate-200 p-3 text-sm font-medium text-slate-900 shadow-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                                        rows={3}
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                        placeholder="Full delivery address"
                                        required
                                    />
                                    {errors.address && <p className="mt-1 text-xs font-bold text-red-600">{errors.address}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Order Items Table Card */}
                        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
                                <div className="flex items-center gap-2">
                                    <Package className="h-4 w-4 text-slate-500" />
                                    <h2 className="text-sm font-black tracking-widest text-slate-900 uppercase">Order Items</h2>
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setIsAddModalOpen(true)}
                                    className="border-slate-300 text-slate-700 hover:bg-slate-50"
                                >
                                    <Plus className="mr-1.5 h-3.5 w-3.5" /> Add Product
                                </Button>
                            </div>

                            {errors.items && <p className="mb-3 text-xs font-bold text-red-600">{errors.items}</p>}

                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-100 bg-slate-50/50 text-xs font-black tracking-widest text-slate-400 uppercase">
                                            <th className="px-4 py-3">Item Details</th>
                                            <th className="w-28 px-4 py-3">Price (৳)</th>
                                            <th className="w-24 px-4 py-3">Qty</th>
                                            <th className="w-28 px-4 py-3 text-right">Subtotal</th>
                                            <th className="w-12 px-2 py-3"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {data.items.map((item, idx) => (
                                            <tr key={idx} className="group">
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        {item.options?.image && (
                                                            <img
                                                                src={item.options.image}
                                                                alt={item.name}
                                                                className="h-10 w-10 flex-none rounded-lg border border-slate-100 object-cover"
                                                            />
                                                        )}
                                                        <Input
                                                            type="text"
                                                            value={item.name}
                                                            onChange={(e) => handleItemChange(idx, 'name', e.target.value)}
                                                            className="font-bold text-slate-900"
                                                            placeholder="Product Name"
                                                            required
                                                        />
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        value={item.price}
                                                        onChange={(e) => handleItemChange(idx, 'price', parseFloat(e.target.value) || 0)}
                                                        className="w-28 font-semibold"
                                                        placeholder="0"
                                                        required
                                                    />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-1">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleItemChange(idx, 'quantity', Math.max(1, (item.quantity || 1) - 1))}
                                                            className="flex h-9 w-9 flex-none items-center justify-center rounded-md border border-slate-200 bg-slate-50 font-black text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-900 active:scale-95"
                                                            title="Decrease Quantity"
                                                        >
                                                            -
                                                        </button>
                                                        <Input
                                                            type="number"
                                                            min="1"
                                                            value={item.quantity}
                                                            onChange={(e) => handleItemChange(idx, 'quantity', Math.max(1, parseInt(e.target.value, 10) || 1))}
                                                            className="w-16 text-center font-bold"
                                                            required
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => handleItemChange(idx, 'quantity', (item.quantity || 1) + 1)}
                                                            className="flex h-9 w-9 flex-none items-center justify-center rounded-md border border-slate-200 bg-slate-50 font-black text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-900 active:scale-95"
                                                            title="Increase Quantity"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-right font-black text-slate-900">
                                                    ৳{((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                                                </td>
                                                <td className="px-2 py-3 text-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveItem(idx)}
                                                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                                                        title="Remove Item"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Quick Add Product Dropdown Bar */}
                            {products.length > 0 && (
                                <div className="mt-4 border-t border-slate-100 pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-slate-50/60 p-3 rounded-lg border border-dashed border-slate-200">
                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-600 flex-none">
                                        <ShoppingBag className="h-4 w-4 text-slate-500" />
                                        <span>Quick Add Product:</span>
                                    </div>
                                    <div className="flex-1">
                                        <Select onValueChange={handleQuickSelectProduct}>
                                            <SelectTrigger className="bg-white">
                                                <SelectValue placeholder="-- Choose a product from catalog --" />
                                            </SelectTrigger>
                                            <SelectContent className="max-h-60">
                                                {products.map((p) => (
                                                    <SelectItem key={p.id} value={String(p.id)}>
                                                        {p.name} — ৳{p.price.toLocaleString()}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Side Sidebar: Status, Shipping & Summary */}
                    <div className="flex flex-col gap-6">
                        {/* Status & Payment Settings */}
                        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                                <CreditCard className="h-4 w-4 text-slate-500" />
                                <h2 className="text-sm font-black tracking-widest text-slate-900 uppercase">Status & Payment</h2>
                            </div>

                            <div>
                                <label className="mb-1.5 block text-xs font-bold text-slate-700">Order Status *</label>
                                <Select value={data.status} onValueChange={(val) => setData('status', val)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="processing">Processing</SelectItem>
                                        <SelectItem value="shipped">Shipped</SelectItem>
                                        <SelectItem value="delivered">Delivered</SelectItem>
                                        <SelectItem value="hold">Hold</SelectItem>
                                        <SelectItem value="in_review">In Review</SelectItem>
                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.status && <p className="mt-1 text-xs font-bold text-red-600">{errors.status}</p>}
                            </div>

                            <div>
                                <label className="mb-1.5 block text-xs font-bold text-slate-700">Payment Method *</label>
                                <Select value={data.payment_method} onValueChange={(val) => setData('payment_method', val)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Method" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="cod">Cash on Delivery (COD)</SelectItem>
                                        <SelectItem value="bkash">bKash</SelectItem>
                                        <SelectItem value="sslcommerz">SSLCommerz</SelectItem>
                                        <SelectItem value="nagad">Nagad</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.payment_method && <p className="mt-1 text-xs font-bold text-red-600">{errors.payment_method}</p>}
                            </div>

                            <div>
                                <label className="mb-1.5 block text-xs font-bold text-slate-700">Shipping Charge (৳) *</label>
                                <Input
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={data.shipping}
                                    onChange={(e) => setData('shipping', parseFloat(e.target.value) || 0)}
                                    placeholder="0"
                                    required
                                />
                                {errors.shipping && <p className="mt-1 text-xs font-bold text-red-600">{errors.shipping}</p>}
                            </div>
                        </div>

                        {/* Financial Summary Card */}
                        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h2 className="mb-4 text-sm font-black tracking-widest text-slate-900 uppercase border-b border-slate-100 pb-3">
                                Payment Summary
                            </h2>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-center justify-between font-medium text-slate-600">
                                    <span>Items Subtotal</span>
                                    <span>৳{calculatedSubtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center justify-between font-medium text-slate-600">
                                    <span>Shipping Charge</span>
                                    <span>৳{(Number(data.shipping) || 0).toLocaleString()}</span>
                                </div>
                                <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-lg font-black text-slate-950">
                                    <span>Total Amount</span>
                                    <span>৳{calculatedTotal.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="mt-6 flex flex-col gap-2">
                                <Button type="submit" disabled={processing} className="w-full bg-slate-950 font-bold hover:bg-slate-800">
                                    {processing ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="mr-2 h-4 w-4" /> Save Changes
                                        </>
                                    )}
                                </Button>
                                <Link
                                    href={route('admin.orders.show', order.id)}
                                    className="inline-flex w-full justify-center rounded-md border border-slate-200 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </Link>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            {/* Add Product Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4">
                    <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h3 className="text-lg font-black text-slate-950">Add Product to Order</h3>
                            <button
                                type="button"
                                onClick={() => setIsAddModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Search Input */}
                        <div>
                            <label className="mb-1 block text-xs font-bold text-slate-700">Filter Store Catalog</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <Input
                                    type="text"
                                    placeholder="Search by product name..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                        </div>

                        {/* Filtered Products List */}
                        <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 rounded-xl border border-slate-200 bg-slate-50/50">
                            {filteredProducts.map((prod) => (
                                <div
                                    key={prod.id}
                                    onClick={() => handleAddProduct(prod)}
                                    className="flex items-center justify-between p-3 cursor-pointer hover:bg-white hover:shadow-sm transition-all group"
                                >
                                    <div className="flex items-center gap-3">
                                        {prod.image ? (
                                            <img src={prod.image} alt={prod.name} className="h-10 w-10 rounded-lg object-cover border border-slate-200" />
                                        ) : (
                                            <div className="h-10 w-10 rounded-lg bg-slate-200 flex items-center justify-center text-slate-400">
                                                <Package className="h-5 w-5" />
                                            </div>
                                        )}
                                        <div className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                                            {prod.name}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-black text-slate-900 text-sm">৳{prod.price.toLocaleString()}</span>
                                        <span className="rounded-md bg-slate-950 px-2 py-1 text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                            + Add
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {filteredProducts.length === 0 && (
                                <div className="p-6 text-center text-xs font-bold text-slate-400">
                                    No products found matching "{searchQuery}"
                                </div>
                            )}
                        </div>

                        {/* Custom Item Addition */}
                        <div className="relative border-t border-slate-100 pt-4">
                            <p className="mb-2 text-xs font-bold tracking-wider text-slate-400 uppercase">Or Add Custom Item</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <Input
                                    type="text"
                                    placeholder="Item Title (e.g. Custom Item)"
                                    value={customItemName}
                                    onChange={(e) => setCustomItemName(e.target.value)}
                                />
                                <Input
                                    type="number"
                                    min="0"
                                    placeholder="Price (৳)"
                                    value={customItemPrice}
                                    onChange={(e) => setCustomItemPrice(e.target.value === '' ? '' : parseFloat(e.target.value))}
                                />
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleAddCustomItem}
                                disabled={!customItemName.trim()}
                                className="w-full mt-2 border-slate-300"
                            >
                                Add Custom Item
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
