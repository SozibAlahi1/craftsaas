import React, { useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, Link } from '@inertiajs/react';
import { ArrowLeft, Save, Plus, Trash2, Image as ImageIcon, List, Tag, Settings, Upload, X } from 'lucide-react';

interface Category {
    id: number;
    name: string;
}

interface VariationItem {
    label: string;
    image: File | string | null;
}

interface EditProps {
    categories: Category[];
    product: any;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Products', href: '/admin/products' },
    { title: 'Edit Product', href: '/admin/products/edit' },
];

export default function EditProduct({ categories, product }: EditProps) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        name: product.name || '',
        category_id: product.category_id || '',
        price: product.price || '',
        old_price: product.old_price || '',
        discount_text: product.discount_text || '',
        image: null as File | null,
        existing_image: product.image,
        gallery: [] as File[],
        existing_gallery: product.gallery || [],
        description: product.description || '',
        delivery_info: product.delivery_info || 'We offer fast and reliable shipping across Bangladesh. All orders are carefully packaged to ensure your items arrive in perfect condition.',
        delivery_dhaka: product.delivery_dhaka || '1-3 Working Days',
        delivery_outside: product.delivery_outside || '3-5 Working Days',
        return_info: product.return_info || 'If you are not satisfied with your purchase, you can return or exchange the product within 7 days of delivery, provided it is in its original condition and packaging.',
        highlights: product.highlights?.length ? product.highlights : [''],
        color: product.color || '',
        stock_quantity: product.stock_quantity ?? 0,
        is_in_stock: product.is_in_stock ?? true,
        variations: normalizeVariations(product.variations),
        variant_matrix: (product.variants || []).map((v: any) => {
            const attributes: Record<string, string> = {};
            (v.attribute_values || []).forEach((av: any) => {
                if (av.attribute?.name) attributes[av.attribute.name] = av.value;
            });
            return {
                id: v.id,
                sku: v.sku || '',
                price: v.price || '',
                stock_quantity: v.stock_quantity || 0,
                attributes
            };
        }),
    });

    function normalizeVariations(variations: any) {
        return {
            colors: Array.isArray(variations?.colors)
                ? variations.colors.map((item: any) => {
                    if (typeof item === 'string') {
                        return { label: item, image: null };
                    }
                    return {
                        label: item?.label ?? '',
                        image: item?.image ?? null,
                    };
                })
                : [{ label: '', image: null }],
            sizes: Array.isArray(variations?.sizes)
                ? variations.sizes.map((item: any) => {
                    if (typeof item === 'string') {
                        return { label: item, image: null };
                    }
                    return {
                        label: item?.label ?? '',
                        image: item?.image ?? null,
                    };
                })
                : [{ label: '', image: null }],
        };
    }

    // Auto-calculate discount
    React.useEffect(() => {
        const parsePrice = (val: string) => {
            const numbers = val.replace(/[^0-9]/g, '');
            return numbers ? parseInt(numbers) : 0;
        };

        const current = parsePrice(data.price);
        const old = parsePrice(data.old_price);

        if (old > current && current > 0) {
            const diff = old - current;
            setData('discount_text', `৳ ${diff.toLocaleString()} OFF`);
        } else {
            setData('discount_text', '');
        }
    }, [data.price, data.old_price]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.products.update', product.id));
    };

    const removeExistingGalleryImage = (index: number) => {
        const newGallery = [...data.existing_gallery];
        newGallery.splice(index, 1);
        setData('existing_gallery', newGallery);
    };

    const addGalleryImages = (files: FileList | null) => {
        if (files) {
            setData('gallery', [...data.gallery, ...Array.from(files)]);
        }
    };

    const removeGalleryImage = (index: number) => {
        const newGallery = [...data.gallery];
        newGallery.splice(index, 1);
        setData('gallery', newGallery);
    };

    const addHighlight = () => {
        setData('highlights', [...data.highlights, '']);
    };

    const removeHighlight = (index: number) => {
        const newHighlights = [...data.highlights];
        newHighlights.splice(index, 1);
        setData('highlights', newHighlights);
    };

    const updateHighlight = (index: number, value: string) => {
        const newHighlights = [...data.highlights];
        newHighlights[index] = value;
        setData('highlights', newHighlights);
    };

    const addVariation = (type: 'colors' | 'sizes') => {
        setData('variations', {
            ...data.variations,
            [type]: [...data.variations[type], { label: '', image: null }],
        });
    };

    const removeVariation = (type: 'colors' | 'sizes', index: number) => {
        const newVariations = { ...data.variations };
        newVariations[type].splice(index, 1);
        setData('variations', newVariations);
    };

    const updateVariation = (type: 'colors' | 'sizes', index: number, value: string) => {
        const newVariations = { ...data.variations };
        newVariations[type][index] = {
            ...newVariations[type][index],
            label: value,
        };
        setData('variations', newVariations);
    };

    const updateVariationImage = (type: 'colors' | 'sizes', index: number, file: File | null) => {
        const newVariations = { ...data.variations };
        newVariations[type][index] = {
            ...newVariations[type][index],
            image: file,
        };
        setData('variations', newVariations);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${product.name}`} />
            
            {processing && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/40 backdrop-blur-xl animate-in fade-in duration-300">
                    <div className="flex flex-col items-center gap-4">
                        <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-slate-950 shadow-2xl" />
                        <div className="text-center">
                            <p className="text-sm font-black uppercase tracking-[0.2em] text-slate-950">Uploading Assets</p>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">Please wait while we process your media</p>
                        </div>
                    </div>
                </div>
            )}
            
            <div className="p-6">
                <div className="flex items-center gap-4 mb-8">
                    <Link 
                        href={route('admin.products.index')}
                        className="p-2 rounded-none border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-black text-slate-950 uppercase tracking-tight">Edit Product</h1>
                        <p className="text-sm text-slate-500 font-medium">Update details for this item in your store catalog</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="w-full space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            {/* Product Info Section */}
                            <section className="rounded-none border border-slate-200 bg-white p-6 shadow-none">
                                <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
                                    <Tag className="h-4 w-4 text-slate-400" />
                                    <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Product Information</h2>
                                </div>
                                
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Product Name</label>
                                        <input 
                                            type="text" 
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                            className="w-full rounded-none border border-slate-200 px-4 py-2.5 text-sm focus:border-slate-400 focus:ring-0 focus:outline-none transition-colors"
                                            placeholder="e.g. Premium Leather Wallet"
                                        />
                                        {errors.name && <p className="text-xs font-bold text-red-500 mt-1 uppercase tracking-tighter">{errors.name}</p>}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Category</label>
                                            <select 
                                                value={data.category_id}
                                                onChange={e => setData('category_id', e.target.value)}
                                                className="w-full rounded-none border border-slate-200 px-4 py-2.5 text-sm focus:border-slate-400 focus:ring-0 focus:outline-none bg-white transition-colors"
                                            >
                                                <option value="">Select Category</option>
                                                {categories.map(category => (
                                                    <option key={category.id} value={category.id}>{category.name}</option>
                                                ))}
                                            </select>
                                            {errors.category_id && <p className="text-xs font-bold text-red-500 mt-1 uppercase tracking-tighter">{errors.category_id}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Primary Color</label>
                                            <input 
                                                type="text" 
                                                value={data.color}
                                                onChange={e => setData('color', e.target.value)}
                                                className="w-full rounded-none border border-slate-200 px-4 py-2.5 text-sm focus:border-slate-400 focus:ring-0 focus:outline-none transition-colors"
                                                placeholder="e.g. Dark Brown"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Description</label>
                                        <textarea 
                                            value={data.description}
                                            onChange={e => setData('description', e.target.value)}
                                            rows={6}
                                            className="w-full rounded-none border border-slate-200 px-4 py-2.5 text-sm focus:border-slate-400 focus:ring-0 focus:outline-none transition-colors resize-none"
                                            placeholder="Write detailed product description..."
                                        />
                                        {errors.description && <p className="text-xs font-bold text-red-500 mt-1 uppercase tracking-tighter">{errors.description}</p>}
                                    </div>
                                </div>
                            </section>

                            {/* Highlights Section */}
                            <section className="rounded-none border border-slate-200 bg-white p-6 shadow-none">
                                <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
                                    <List className="h-4 w-4 text-slate-400" />
                                    <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Product Highlights</h2>
                                </div>
                                
                                <div className="space-y-4">
                                    {data.highlights.map((highlight, index) => (
                                        <div key={index} className="flex gap-2">
                                            <input 
                                                type="text" 
                                                value={highlight}
                                                onChange={e => updateHighlight(index, e.target.value)}
                                                className="flex-1 rounded-none border border-slate-200 px-4 py-2 text-sm focus:border-slate-400 focus:ring-0 focus:outline-none transition-colors"
                                                placeholder={`Highlight ${index + 1}`}
                                            />
                                            <button 
                                                type="button"
                                                onClick={() => removeHighlight(index)}
                                                className="p-2 border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 transition-colors"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                    <button 
                                        type="button"
                                        onClick={addHighlight}
                                        className="inline-flex items-center gap-2 text-xs font-black text-slate-600 hover:text-slate-950 transition-colors uppercase tracking-widest"
                                    >
                                        <Plus className="h-3 w-3" />
                                        Add Highlight
                                    </button>
                                </div>
                            </section>

                            {/* Shipping & Returns Section */}
                            <section className="rounded-none border border-slate-200 bg-white p-6 shadow-none">
                                <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
                                    <Upload className="h-4 w-4 text-slate-400" />
                                    <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Shipping & Returns</h2>
                                </div>
                                
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Delivery Information</label>
                                        <textarea 
                                            value={data.delivery_info}
                                            onChange={e => setData('delivery_info', e.target.value)}
                                            rows={2}
                                            className="w-full rounded-none border border-slate-200 px-4 py-2.5 text-sm focus:border-slate-400 focus:ring-0 focus:outline-none transition-colors resize-none"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Inside Dhaka Time</label>
                                            <input 
                                                type="text" 
                                                value={data.delivery_dhaka}
                                                onChange={e => setData('delivery_dhaka', e.target.value)}
                                                className="w-full rounded-none border border-slate-200 px-4 py-2.5 text-sm focus:border-slate-400 focus:ring-0 focus:outline-none transition-colors"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Outside Dhaka Time</label>
                                            <input 
                                                type="text" 
                                                value={data.delivery_outside}
                                                onChange={e => setData('delivery_outside', e.target.value)}
                                                className="w-full rounded-none border border-slate-200 px-4 py-2.5 text-sm focus:border-slate-400 focus:ring-0 focus:outline-none transition-colors"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Return & Exchange Policy</label>
                                        <textarea 
                                            value={data.return_info}
                                            onChange={e => setData('return_info', e.target.value)}
                                            rows={2}
                                            className="w-full rounded-none border border-slate-200 px-4 py-2.5 text-sm focus:border-slate-400 focus:ring-0 focus:outline-none transition-colors resize-none"
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Variants Section */}
                            <section className="rounded-none border border-slate-200 bg-white p-6 shadow-none">
                                <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                                    <div className="flex items-center gap-2">
                                        <Settings className="h-4 w-4 text-slate-400" />
                                        <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Product Variants</h2>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            // Generate combinations
                                            const colors = data.variations.colors.filter((c: any) => c.label.trim() !== '');
                                            const sizes = data.variations.sizes.filter((s: any) => s.label.trim() !== '');
                                            let combos: any[] = [];
                                            
                                            if (colors.length === 0 && sizes.length === 0) {
                                                return;
                                            } else if (colors.length > 0 && sizes.length === 0) {
                                                combos = colors.map((c: any) => ({ attributes: { Color: c.label } }));
                                            } else if (sizes.length > 0 && colors.length === 0) {
                                                combos = sizes.map((s: any) => ({ attributes: { Size: s.label } }));
                                            } else {
                                                colors.forEach((c: any) => {
                                                    sizes.forEach((s: any) => {
                                                        combos.push({ attributes: { Color: c.label, Size: s.label } });
                                                    });
                                                });
                                            }
                                            
                                            // Map to variants array
                                            const newVariants = combos.map(combo => {
                                                // Try to keep existing variant if attribute match
                                                const existing = (data as any).variant_matrix.find((v: any) => 
                                                    JSON.stringify(v.attributes) === JSON.stringify(combo.attributes)
                                                );
                                                if (existing) return existing;
                                                return {
                                                    sku: '',
                                                    price: '',
                                                    stock_quantity: 0,
                                                    attributes: combo.attributes
                                                };
                                            });
                                            setData('variant_matrix', newVariants as never);
                                        }}
                                        className="text-xs font-black bg-slate-900 text-white px-3 py-1.5 hover:bg-slate-800 transition-colors uppercase tracking-widest"
                                    >
                                        Generate Variants
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                    <div className="space-y-4">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Colors</label>
                                        {data.variations.colors.map((color: any, index: number) => (
                                            <div key={index} className="flex gap-2">
                                                <input 
                                                    type="text" 
                                                    value={color.label}
                                                    onChange={e => updateVariation('colors', index, e.target.value)}
                                                    className="flex-1 rounded-none border border-slate-200 px-4 py-2 text-sm focus:border-slate-400 focus:ring-0 focus:outline-none transition-colors"
                                                    placeholder="e.g. Red"
                                                />
                                                <button 
                                                    type="button"
                                                    onClick={() => removeVariation('colors', index)}
                                                    className="p-2 border border-slate-200 text-slate-400 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                        <button 
                                            type="button"
                                            onClick={() => addVariation('colors')}
                                            className="inline-flex items-center gap-2 text-xs font-black text-slate-600 hover:text-slate-950 transition-colors uppercase tracking-widest"
                                        >
                                            <Plus className="h-3 w-3" /> Add Color
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Sizes</label>
                                        {data.variations.sizes.map((size: any, index: number) => (
                                            <div key={index} className="flex gap-2">
                                                <input 
                                                    type="text" 
                                                    value={size.label}
                                                    onChange={e => updateVariation('sizes', index, e.target.value)}
                                                    className="flex-1 rounded-none border border-slate-200 px-4 py-2 text-sm focus:border-slate-400 focus:ring-0 focus:outline-none transition-colors"
                                                    placeholder="e.g. XL"
                                                />
                                                <button 
                                                    type="button"
                                                    onClick={() => removeVariation('sizes', index)}
                                                    className="p-2 border border-slate-200 text-slate-400 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                        <button 
                                            type="button"
                                            onClick={() => addVariation('sizes')}
                                            className="inline-flex items-center gap-2 text-xs font-black text-slate-600 hover:text-slate-950 transition-colors uppercase tracking-widest"
                                        >
                                            <Plus className="h-3 w-3" /> Add Size
                                        </button>
                                    </div>
                                </div>

                                {/* Generated Matrix */}
                                {((data as any).variant_matrix || []).length > 0 && (
                                    <div className="mt-8 border border-slate-200 rounded-none overflow-x-auto">
                                        <table className="w-full text-left text-sm whitespace-nowrap">
                                            <thead className="bg-slate-50 border-b border-slate-200">
                                                <tr>
                                                    <th className="px-4 py-3 font-bold text-slate-600">Variant</th>
                                                    <th className="px-4 py-3 font-bold text-slate-600">SKU</th>
                                                    <th className="px-4 py-3 font-bold text-slate-600">Price (Override)</th>
                                                    <th className="px-4 py-3 font-bold text-slate-600">Stock</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {((data as any).variant_matrix || []).map((v: any, i: number) => (
                                                    <tr key={i}>
                                                        <td className="px-4 py-3 font-medium text-slate-900">
                                                            {Object.values(v.attributes).join(' / ')}
                                                        </td>
                                                        <td className="px-4 py-2">
                                                            <input 
                                                                type="text" 
                                                                value={v.sku}
                                                                onChange={(e) => {
                                                                    const newMatrix = [...(data as any).variant_matrix];
                                                                    newMatrix[i].sku = e.target.value;
                                                                    setData('variant_matrix', newMatrix as never);
                                                                }}
                                                                className="w-full rounded-none border border-slate-200 px-3 py-1.5 text-sm focus:border-slate-400 focus:ring-0 focus:outline-none"
                                                                placeholder="Optional"
                                                            />
                                                        </td>
                                                        <td className="px-4 py-2">
                                                            <input 
                                                                type="text" 
                                                                value={v.price}
                                                                onChange={(e) => {
                                                                    const newMatrix = [...(data as any).variant_matrix];
                                                                    newMatrix[i].price = e.target.value;
                                                                    setData('variant_matrix', newMatrix as never);
                                                                }}
                                                                className="w-full rounded-none border border-slate-200 px-3 py-1.5 text-sm focus:border-slate-400 focus:ring-0 focus:outline-none"
                                                                placeholder="Optional"
                                                            />
                                                        </td>
                                                        <td className="px-4 py-2">
                                                            <input 
                                                                type="number" 
                                                                min="0"
                                                                value={v.stock_quantity}
                                                                onChange={(e) => {
                                                                    const newMatrix = [...(data as any).variant_matrix];
                                                                    newMatrix[i].stock_quantity = parseInt(e.target.value) || 0;
                                                                    setData('variant_matrix', newMatrix as never);
                                                                }}
                                                                className="w-24 rounded-none border border-slate-200 px-3 py-1.5 text-sm focus:border-slate-400 focus:ring-0 focus:outline-none"
                                                            />
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </section>
                        </div>

                        <div className="space-y-8">
                            {/* Media Section */}
                            <section className="rounded-none border border-slate-200 bg-white p-6 shadow-none">
                                <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
                                    <ImageIcon className="h-4 w-4 text-slate-400" />
                                    <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Media Assets</h2>
                                </div>
                                
                                <div className="space-y-8">
                                    {/* Primary Image Upload */}
                                    <div className="space-y-4">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Primary Product Image</label>
                                        <input 
                                            type="file" 
                                            id="primary-image"
                                            onChange={e => setData('image', e.target.files?.[0] ?? null)}
                                            className="hidden"
                                            accept="image/*"
                                        />
                                        <label 
                                            htmlFor="primary-image"
                                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-400 transition-all cursor-pointer"
                                        >
                                            <Upload className="h-6 w-6 text-slate-300" />
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Upload Primary</span>
                                        </label>
                                        
                                        {/* Primary Preview Below */}
                                        {(data.image || data.existing_image) && (
                                            <div className="relative group w-full h-40 border border-slate-200 overflow-hidden mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                                <img src={data.image ? URL.createObjectURL(data.image) : data.existing_image} alt="Primary Preview" className="h-full w-full object-cover" />
                                                <button 
                                                    type="button"
                                                    onClick={() => setData('image', null)}
                                                    className="absolute top-2 right-2 p-1.5 bg-white/90 text-slate-400 hover:text-red-500 shadow-sm transition-colors"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        )}
                                        {errors.image && <p className="text-xs font-bold text-red-500 mt-1 uppercase tracking-tighter">{errors.image}</p>}
                                    </div>

                                    {/* Gallery Upload */}
                                    <div className="space-y-4">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Gallery Collection</label>
                                        <input 
                                            type="file" 
                                            id="gallery-images"
                                            multiple
                                            onChange={e => addGalleryImages(e.target.files)}
                                            className="hidden"
                                            accept="image/*"
                                        />
                                        <label 
                                            htmlFor="gallery-images"
                                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-400 transition-all cursor-pointer"
                                        >
                                            <Plus className="h-6 w-6 text-slate-300" />
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Add More Images</span>
                                        </label>

                                        {/* Gallery Previews Below */}
                                        {(data.gallery.length > 0 || data.existing_gallery.length > 0) && (
                                            <div className="grid grid-cols-2 gap-3 mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                                {data.existing_gallery.map((path: string, index: number) => (
                                                    <div key={`existing-${index}`} className="relative aspect-square border border-slate-200 overflow-hidden group">
                                                        <img src={path} alt={`Gallery ${index}`} className="h-full w-full object-cover" />
                                                        <button 
                                                            type="button"
                                                            onClick={() => removeExistingGalleryImage(index)}
                                                            className="absolute top-1 right-1 p-1 bg-white/90 text-slate-400 hover:text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <X className="h-3.5 w-3.5" />
                                                        </button>
                                                    </div>
                                                ))}
                                                {data.gallery.map((file, index) => (
                                                    <div key={index} className="relative aspect-square border border-slate-200 overflow-hidden group">
                                                        <img src={URL.createObjectURL(file)} alt={`Gallery ${index}`} className="h-full w-full object-cover" />
                                                        <button 
                                                            type="button"
                                                            onClick={() => removeGalleryImage(index)}
                                                            className="absolute top-1 right-1 p-1 bg-white/90 text-slate-400 hover:text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <X className="h-3.5 w-3.5" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {errors.gallery && <p className="text-xs font-bold text-red-500 mt-1 uppercase tracking-tighter">{errors.gallery}</p>}
                                    </div>
                                </div>
                            </section>

                            {/* Pricing Section */}
                            <section className="rounded-none border border-slate-200 bg-white p-6 shadow-none">
                                <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
                                    <span className="text-sm font-black text-slate-400">৳</span>
                                    <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Pricing</h2>
                                </div>
                                
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Current Price</label>
                                        <input 
                                            type="text" 
                                            value={data.price}
                                            onChange={e => setData('price', e.target.value)}
                                            className="w-full rounded-none border border-slate-200 px-4 py-2.5 text-sm focus:border-slate-400 focus:ring-0 focus:outline-none transition-colors"
                                            placeholder="e.g. ৳ 1,850"
                                        />
                                        {errors.price && <p className="text-xs font-bold text-red-500 mt-1 uppercase tracking-tighter">{errors.price}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Old Price (MSRP)</label>
                                        <input 
                                            type="text" 
                                            value={data.old_price}
                                            onChange={e => setData('old_price', e.target.value)}
                                            className="w-full rounded-none border border-slate-200 px-4 py-2.5 text-sm focus:border-slate-400 focus:ring-0 focus:outline-none transition-colors"
                                            placeholder="e.g. ৳ 2,450"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Discount Label (Auto)</label>
                                        <input 
                                            type="text" 
                                            value={data.discount_text}
                                            readOnly
                                            className="w-full rounded-none border border-slate-100 bg-slate-50 px-4 py-2.5 text-sm font-bold text-orange-600 focus:outline-none cursor-default"
                                            placeholder="৳ 0 OFF"
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Inventory & Stock Section */}
                            <section className="rounded-none border border-slate-200 bg-white p-6 shadow-none">
                                <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
                                    <List className="h-4 w-4 text-slate-400" />
                                    <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Inventory & Stock</h2>
                                </div>
                                
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Stock Quantity</label>
                                        <input 
                                            type="number" 
                                            min="0"
                                            value={data.stock_quantity}
                                            onChange={e => setData('stock_quantity', parseInt(e.target.value) || 0)}
                                            className="w-full rounded-none border border-slate-200 px-4 py-2.5 text-sm focus:border-slate-400 focus:ring-0 focus:outline-none transition-colors"
                                            placeholder="e.g. 50"
                                        />
                                        {errors.stock_quantity && <p className="text-xs font-bold text-red-500 mt-1 uppercase tracking-tighter">{errors.stock_quantity}</p>}
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <label className="text-xs font-black text-slate-900 uppercase tracking-widest">In Stock Status</label>
                                            <p className="text-[10px] text-slate-500 font-medium mt-0.5">Allow customers to purchase this item</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                className="sr-only peer"
                                                checked={data.is_in_stock}
                                                onChange={e => setData('is_in_stock', e.target.checked)}
                                            />
                                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-950"></div>
                                        </label>
                                    </div>
                                </div>
                            </section>

                            <button 
                                type="submit" 
                                disabled={processing}
                                className="w-full inline-flex items-center justify-center gap-2 rounded-none bg-slate-950 px-8 py-4 text-sm font-black text-white transition-all hover:bg-slate-800 active:scale-95 uppercase tracking-widest shadow-none disabled:opacity-50"
                            >
                                <Save className="h-5 w-5" />
                                {processing ? 'Uploading & Saving...' : 'Update Product'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
