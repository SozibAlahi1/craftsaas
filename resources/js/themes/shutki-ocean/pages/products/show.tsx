import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Check, Heart, ShieldCheck, ShoppingBag, ShoppingCart, Star, Truck, Waves } from 'lucide-react';
import { useState } from 'react';

import { ShutkiOceanFooter } from '@/themes/shutki-ocean/components/Footer';
import { ShutkiOceanHeader } from '@/themes/shutki-ocean/components/Header';
import { ProductCard } from '@/themes/shutki-ocean/components/ProductCard';

type Review = { id: number; name: string; rating: number; comment: string; created_at: string };
type Product = {
    id: number;
    slug: string;
    name: string;
    price: string;
    old_price: string | null;
    discount_text: string | null;
    image: string;
    gallery: string[];
    description: string;
    delivery_info: string | null;
    delivery_dhaka: string | null;
    delivery_outside: string | null;
    return_info: string | null;
    highlights: string[];
    color: string;
    variations: { colors: Array<string | { label: string; image: string | null }>; sizes: Array<string | { label: string; image: string | null }> };
    reviews: Review[];
    variants?: any[];
};
type RelatedProduct = Pick<Product, 'id' | 'slug' | 'name' | 'price' | 'old_price' | 'discount_text' | 'image'>;

export default function Show({ product, relatedProducts = [] }: { product: Product; relatedProducts?: RelatedProduct[] }) {
    const getLabel = (v: any) => (typeof v === 'string' ? v : (v?.label ?? ''));
    const getImage = (v: any) => (typeof v === 'string' ? null : (v?.image ?? null));

    const getFirstColor = () => {
        const colors = product.variations?.colors || [];
        const validColor = colors.map(getLabel).find((l: string) => Boolean(l && l.trim()));
        if (validColor) return validColor;

        if (product.variants && product.variants.length > 0) {
            const vColor = product.variants[0].attribute_values?.find(
                (av: any) => av.attribute?.name?.toLowerCase() === 'color',
            )?.value;
            if (vColor) return vColor;
        }
        return '';
    };

    const getFirstSize = () => {
        const sizes = product.variations?.sizes || [];
        const validSize = sizes.map(getLabel).find((l: string) => Boolean(l && l.trim()));
        if (validSize) return validSize;

        if (product.variants && product.variants.length > 0) {
            const vSize = product.variants[0].attribute_values?.find(
                (av: any) => av.attribute?.name?.toLowerCase() === 'size',
            )?.value;
            if (vSize) return vSize;
        }
        return '';
    };

    const getColorImage = (color: any, index?: number) => {
        const raw = getImage(color);
        if (raw) {
            return raw.startsWith('http') || raw.startsWith('/') ? raw : `/storage/${raw}`;
        }
        return null;
    };

    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState(() => product.image);
    const [activeTab, setActiveTab] = useState<'details' | 'delivery' | 'reviews'>('details');
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);

    const getSelectedVariant = () => {
        if (!product.variants || product.variants.length === 0) return null;

        return product.variants.find((v: any) => {
            const hasColor = selectedColor && selectedColor.trim() !== '';
            const hasSize = selectedSize && selectedSize.trim() !== '';

            const vColor = v.attribute_values?.find((av: any) => av.attribute.name.toLowerCase() === 'color')?.value;
            const vSize = v.attribute_values?.find((av: any) => av.attribute.name.toLowerCase() === 'size')?.value;

            if (hasColor && hasSize) return vColor === selectedColor && vSize === selectedSize;
            if (hasColor) return vColor === selectedColor;
            if (hasSize) return vSize === selectedSize;
            return false;
        });
    };

    const selectColor = (label: string, image: string | null) => {
        if (selectedColor === label) {
            setSelectedColor(null);
            setActiveImage(product.image);
        } else {
            setSelectedColor(label);
            if (image) {
                setActiveImage(image);
            } else {
                setActiveImage(product.image);
            }
        }
    };
    const selectSize = (label: string, image: string | null) => {
        if (selectedSize === label) {
            setSelectedSize(null);
        } else {
            setSelectedSize(label);
            if (image) setActiveImage(image);
        }
    };

    const variationImages = [
        ...product.variations.colors.map((c, i) => getColorImage(c, i)),
        ...product.variations.sizes.map(getImage),
    ].filter((s): s is string => Boolean(s));
    const allImages = Array.from(new Set([product.image, ...(product.gallery || []), ...variationImages])).filter(Boolean);

    const {
        data: reviewData,
        setData: setReviewData,
        post: postReview,
        processing: submittingReview,
        reset: resetReview,
        errors: reviewErrors,
    } = useForm({ name: '', rating: 5, comment: '' });

    const reviews = product.reviews || [];
    const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : '5.0';

    const submitReview = (e: React.FormEvent) => {
        e.preventDefault();
        postReview(route('products.reviews.store', product.id), {
            preserveScroll: true,
            onSuccess: () => {
                setIsReviewFormOpen(false);
                resetReview();
                setSuccessMessage('ধন্যবাদ! রিভিউ প্রকাশিত হয়েছে।');
                setTimeout(() => setSuccessMessage(null), 3000);
            },
        });
    };

    const flash = (msg: string) => {
        setSuccessMessage(msg);
        setTimeout(() => setSuccessMessage(null), 3000);
    };

    const getVariantPrice = (variant: any) => {
        if (!variant) return null;
        if (variant.price !== null && variant.price !== undefined && String(variant.price).trim() !== '') {
            return variant.price;
        }
        if (variant.sku && !isNaN(Number(String(variant.sku).replace(/[^0-9.]/g, '')))) {
            return variant.sku;
        }
        return null;
    };

    const handleAddToCart = (qty = 1) => {
        const variant = getSelectedVariant();
        const vPrice = getVariantPrice(variant);
        router.post(
            route('cart.add'),
            {
                product_id: product.id,
                product_variant_id: variant?.id,
                slug: product.slug,
                name: product.name,
                price: vPrice ? `৳${Math.round(parseFloat(vPrice)).toLocaleString('en-BD')}` : product.price,
                image: product.image,
                quantity: qty,
                color: selectedColor,
                size: selectedSize,
            },
            {
                preserveScroll: true,
                preserveState: true,
                only: ['cart', 'cartCount', 'flash'],
                onSuccess: () => flash('কার্টে যোগ হয়েছে!'),
            },
        );
    };

    const handleBuyNow = () => {
        const variant = getSelectedVariant();
        const vPrice = getVariantPrice(variant);
        router.post(route('cart.buyNow'), {
            product_id: product.id,
            product_variant_id: variant?.id,
            slug: product.slug,
            name: product.name,
            price: vPrice ? `৳${Math.round(parseFloat(vPrice)).toLocaleString('en-BD')}` : product.price,
            image: product.image,
            quantity,
            color: selectedColor,
            size: selectedSize,
        });
    };

    return (
        <>
            <Head title={product.name} />
            <main className="min-h-screen bg-[#F4F9FF] font-sans text-slate-800 selection:bg-[#F97316] selection:text-white">
                <ShutkiOceanHeader />

                {/* Notification Toast */}
                {successMessage && (
                    <div className="animate-in fade-in slide-in-from-right-4 fixed right-6 bottom-24 z-[60] duration-300">
                        <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-[#F97316] to-[#EA580C] px-6 py-4 font-bold text-white shadow-2xl">
                            <Check className="h-5 w-5" /> {successMessage}
                        </div>
                    </div>
                )}

                <section className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <div className="mb-6 flex items-center gap-2 text-xs font-bold text-slate-500">
                        <Link href={route('home')} className="flex items-center gap-1 transition-colors hover:text-[#0F52BA]">
                            <ArrowLeft className="h-3.5 w-3.5" /> হোম
                        </Link>
                        <span>/</span>
                        <Link href={route('products.index')} className="transition-colors hover:text-[#0F52BA]">
                            সকল শুকটি
                        </Link>
                        <span>/</span>
                        <span className="truncate text-slate-900">{product.name}</span>
                    </div>

                    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
                        {/* Image Gallery */}
                        <div className="flex flex-row gap-3 sm:gap-4">
                            <div className="flex w-14 shrink-0 flex-col gap-2 sm:w-20">
                                {allImages.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveImage(image)}
                                        className={`overflow-hidden rounded-xl border-2 transition-all hover:scale-105 ${
                                            activeImage === image ? 'border-[#0F52BA]' : 'border-slate-200'
                                        }`}
                                    >
                                        <img src={image} alt="" className="aspect-square h-full w-full object-cover" />
                                    </button>
                                ))}
                            </div>
                            <div className="flex-1">
                                <div className="overflow-hidden rounded-3xl border border-blue-100 bg-white p-2 shadow-sm">
                                    <div className="relative aspect-square overflow-hidden rounded-2xl bg-slate-50">
                                        <img
                                            src={activeImage}
                                            alt={product.name}
                                            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                                        />
                                        {product.discount_text && (
                                            <span className="absolute top-4 left-4 rounded-xl bg-gradient-to-r from-[#F97316] to-[#EA580C] px-4 py-2 text-xs font-black text-white shadow-md">
                                                {product.discount_text}
                                            </span>
                                        )}
                                        <button
                                            type="button"
                                            className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-slate-400 shadow-sm backdrop-blur-md transition-colors hover:text-red-500"
                                        >
                                            <Heart className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Details & Actions */}
                        <div className="space-y-4">
                            <div className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm sm:p-8">
                                <h1 className="text-2xl leading-snug font-black text-slate-900 sm:text-3xl">{product.name}</h1>

                                <div className="mt-3 flex items-center gap-2 text-xs font-bold text-amber-500">
                                    <Star className="h-4 w-4 fill-amber-400" />
                                    <span className="text-slate-800">{avgRating} রেটিং</span>
                                    <span className="text-slate-400">({reviews.length} রিভিউ)</span>
                                </div>

                                {/* Price */}
                                <div className="mt-4 flex items-baseline gap-3">
                                    <div className="text-3xl font-black text-[#F97316] sm:text-4xl">
                                        {getVariantPrice(getSelectedVariant())
                                            ? `৳${Math.round(parseFloat(getVariantPrice(getSelectedVariant()))).toLocaleString('en-BD')}`
                                            : product.price}
                                    </div>
                                    {product.old_price && (
                                        <div className="text-base font-semibold text-slate-400 line-through">{product.old_price}</div>
                                    )}
                                </div>

                                <div
                                    className="rich-description mt-4 line-clamp-3 text-sm leading-7 text-slate-600"
                                    dangerouslySetInnerHTML={{ __html: product.description }}
                                />

                                {/* Color / Size / Weight Selector */}
                                {(product.variations.colors.filter((c) => getLabel(c)?.trim()).length > 0 ||
                                    product.variations.sizes.filter((s) => getLabel(s)?.trim()).length > 0) && (
                                    <div className="mt-6 space-y-4">
                                        {product.variations.colors.filter((c, i) => getLabel(c)?.trim() || getColorImage(c, i)).length > 0 && (
                                            <div>
                                                <div className="mb-2 flex items-center gap-2 text-xs font-bold tracking-wider text-slate-500 uppercase">
                                                    <span>টাইপ / ভ্যারিয়েন্ট</span>
                                                    {selectedColor && (
                                                        <>
                                                            <span className="text-slate-300">:</span>
                                                            <span className="font-bold capitalize text-[#0F52BA]">{selectedColor}</span>
                                                        </>
                                                    )}
                                                </div>
                                                {product.variations.colors.some((c, i) => Boolean(getColorImage(c, i))) ? (
                                                    <div className="flex flex-wrap items-center gap-3">
                                                        {product.variations.colors.map((c, index) => {
                                                            const label = getLabel(c) || `Color ${index + 1}`;
                                                            const colorImg = getColorImage(c, index);
                                                            const isSelected = selectedColor === label;
                                                            return (
                                                                <button
                                                                    key={label || index}
                                                                    type="button"
                                                                    title={label}
                                                                    onClick={() => selectColor(label, colorImg)}
                                                                    className={`group relative flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center overflow-hidden rounded-xl border-2 p-0.5 transition-all duration-200 ${
                                                                        isSelected
                                                                            ? 'border-[#0F52BA] ring-2 ring-[#0F52BA]/25 shadow-md scale-105'
                                                                            : 'border-slate-200 bg-white hover:border-slate-300 hover:scale-102'
                                                                    }`}
                                                                >
                                                                    {colorImg ? (
                                                                        <img
                                                                            src={colorImg}
                                                                            alt={label}
                                                                            className="h-full w-full rounded-lg object-cover"
                                                                        />
                                                                    ) : (
                                                                        <span className="flex h-full w-full items-center justify-center rounded-lg bg-slate-100 p-1 text-center text-[11px] font-bold text-slate-700">
                                                                            {label}
                                                                        </span>
                                                                    )}
                                                                    {isSelected && (
                                                                        <span className="absolute bottom-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#0F52BA] text-white shadow-sm ring-1 ring-white">
                                                                            <Check className="h-2.5 w-2.5 stroke-[3]" />
                                                                        </span>
                                                                    )}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-wrap gap-2">
                                                        {product.variations.colors.map((c, index) => {
                                                            const label = getLabel(c);
                                                            if (!label || !label.trim()) return null;
                                                            const isSelected = selectedColor === label;
                                                            return (
                                                                <button
                                                                    key={label || index}
                                                                    type="button"
                                                                    onClick={() => selectColor(label, null)}
                                                                    className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-bold transition-all duration-200 ${
                                                                        isSelected
                                                                            ? 'border-[#0F52BA] bg-[#0F52BA] text-white shadow-sm'
                                                                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                                                                    }`}
                                                                >
                                                                    <span>{label}</span>
                                                                    {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        {product.variations.sizes.filter((s) => getLabel(s)?.trim()).length > 0 && (
                                            <div>
                                                <div className="mb-2 text-xs font-bold tracking-wider text-slate-500 uppercase">ওজন / প্যাকেজিং</div>
                                                <div className="flex flex-wrap gap-2">
                                                    {product.variations.sizes.map((s) => {
                                                        const label = getLabel(s);
                                                        const img = getImage(s);
                                                        if (!label?.trim()) return null;
                                                        return (
                                                            <button
                                                                key={label}
                                                                onClick={() => selectSize(label, img)}
                                                                className={`rounded-xl border-2 px-4 py-2 text-xs font-bold transition-all ${
                                                                    selectedSize === label
                                                                        ? 'border-[#0F52BA] bg-[#0F52BA] text-white shadow-md'
                                                                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                                                                }`}
                                                            >
                                                                {label}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Qty & CTA */}
                                <div className="mt-6 flex flex-col gap-3">
                                    <div className="flex w-full items-center gap-3">
                                        <div className="flex shrink-0 items-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                                            <button
                                                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                                className="flex h-12 w-10 items-center justify-center text-lg font-bold text-slate-600 hover:bg-slate-200"
                                            >
                                                –
                                            </button>
                                            <span className="w-10 text-center text-base font-black text-slate-900">{quantity}</span>
                                            <button
                                                onClick={() => setQuantity((q) => q + 1)}
                                                className="flex h-12 w-10 items-center justify-center text-lg font-bold text-slate-600 hover:bg-slate-200"
                                            >
                                                +
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => handleAddToCart(quantity)}
                                            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50/50 px-4 text-xs font-black text-[#0F52BA] shadow-sm transition-colors hover:border-blue-300 hover:bg-blue-100 sm:text-sm"
                                        >
                                            <ShoppingCart className="h-4 w-4" /> কার্টে যোগ করুন
                                        </button>
                                    </div>

                                    <button
                                        onClick={handleBuyNow}
                                        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#F97316] to-[#EA580C] px-4 text-sm font-black text-white shadow-lg shadow-orange-500/20 transition-transform hover:scale-[1.01]"
                                    >
                                        <ShoppingBag className="h-4 w-4" /> এখনই অর্ডার করুন
                                    </button>
                                </div>

                                {/* Trust Strip */}
                                <div className="mt-6 grid grid-cols-3 gap-2 border-t border-slate-100 pt-4">
                                    <div className="flex flex-col items-center gap-1 rounded-xl bg-blue-50/50 p-2 text-center">
                                        <ShieldCheck className="h-4 w-4 text-[#0F52BA]" />
                                        <span className="text-[10px] font-bold text-slate-700">১০০% কেমিক্যাল মুক্ত</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1 rounded-xl bg-blue-50/50 p-2 text-center">
                                        <Truck className="h-4 w-4 text-[#0F52BA]" />
                                        <span className="text-[10px] font-bold text-slate-700">ফাস্ট হোম ডেলিভারি</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1 rounded-xl bg-blue-50/50 p-2 text-center">
                                        <Waves className="h-4 w-4 text-[#0F52BA]" />
                                        <span className="text-[10px] font-bold text-slate-700">ভ্যাকুয়াম সিমিং প্যাক</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Details / Delivery / Review Tabs */}
                <section className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-sm">
                        <nav className="flex border-b border-blue-100 bg-blue-50/40">
                            {(['details', 'delivery', 'reviews'] as const).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`relative px-6 py-4 text-xs font-black tracking-wider uppercase transition-colors sm:text-sm ${
                                        activeTab === tab ? 'text-[#0F52BA]' : 'text-slate-500 hover:text-slate-900'
                                    }`}
                                >
                                    {tab === 'details' ? 'বিস্তারিত তথ্য' : tab === 'delivery' ? 'শিপিং পলিসি' : `রিভিউ (${reviews.length})`}
                                    {activeTab === tab && <span className="absolute bottom-0 left-0 h-0.5 w-full bg-[#0F52BA]" />}
                                </button>
                            ))}
                        </nav>

                        <div className="p-6 sm:p-8">
                            {activeTab === 'details' && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-black text-slate-900">পণ্যের বিস্তারিত বিবরণ</h3>
                                    <div
                                        className="rich-description text-sm leading-8 text-slate-700"
                                        dangerouslySetInnerHTML={{ __html: product.description }}
                                    />
                                </div>
                            )}

                            {activeTab === 'delivery' && (
                                <div className="space-y-4 text-sm text-slate-700">
                                    <h3 className="text-lg font-black text-slate-900">শিপিং ও ডেলিভারি শর্তাবলী</h3>
                                    <p>{product.delivery_info || 'সারাবাংলাদেশে দ্রুত ও নিরাপদ ক্যাশ অন ডেলিভারি দেওয়া হয়।'}</p>
                                    <div className="grid gap-4 pt-2 sm:grid-cols-2">
                                        <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4">
                                            <div className="text-xs font-bold text-[#0F52BA] uppercase">ঢাকার ভেতরে</div>
                                            <div className="mt-1 font-bold text-slate-900">{product.delivery_dhaka || '২৪ - ৪৮ ঘণ্টার মধ্যে'}</div>
                                        </div>
                                        <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4">
                                            <div className="text-xs font-bold text-[#0F52BA] uppercase">ঢাকার বাইরে</div>
                                            <div className="mt-1 font-bold text-slate-900">{product.delivery_outside || '২ - ৩ কার্যদিবস'}</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'reviews' && (
                                <div className="space-y-6">
                                    <div className="flex flex-col gap-6 lg:flex-row">
                                        <div className="lg:w-1/3">
                                            <div className="rounded-2xl border border-blue-100 bg-blue-50/40 p-6 text-center">
                                                <div className="text-4xl font-black text-[#0F52BA]">{avgRating}</div>
                                                <div className="mt-2 flex justify-center gap-1">
                                                    {[1, 2, 3, 4, 5].map((s) => (
                                                        <Star
                                                            key={s}
                                                            className={`h-4 w-4 ${
                                                                s <= Math.round(parseFloat(avgRating))
                                                                    ? 'fill-amber-400 text-amber-400'
                                                                    : 'text-slate-300'
                                                            }`}
                                                        />
                                                    ))}
                                                </div>
                                                <button
                                                    onClick={() => setIsReviewFormOpen(!isReviewFormOpen)}
                                                    className="mt-4 w-full rounded-xl bg-[#0F52BA] py-2.5 text-xs font-black text-white shadow-sm"
                                                >
                                                    {isReviewFormOpen ? 'বাতিল করুন' : 'রিভিউ লিখুন'}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex-1 space-y-4">
                                            {isReviewFormOpen && (
                                                <form
                                                    onSubmit={submitReview}
                                                    className="space-y-4 rounded-2xl border border-blue-100 bg-white p-5 shadow-sm"
                                                >
                                                    <div>
                                                        <label className="mb-1 block text-xs font-bold text-slate-700">আপনার নাম</label>
                                                        <input
                                                            type="text"
                                                            value={reviewData.name}
                                                            onChange={(e) => setReviewData('name', e.target.value)}
                                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-900 outline-none"
                                                            placeholder="নাম লিখুন"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="mb-1 block text-xs font-bold text-slate-700">রেটিং</label>
                                                        <div className="flex gap-2">
                                                            {[1, 2, 3, 4, 5].map((s) => (
                                                                <button type="button" key={s} onClick={() => setReviewData('rating', s)}>
                                                                    <Star
                                                                        className={`h-6 w-6 ${
                                                                            s <= reviewData.rating
                                                                                ? 'fill-amber-400 text-amber-400'
                                                                                : 'text-slate-300'
                                                                        }`}
                                                                    />
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="mb-1 block text-xs font-bold text-slate-700">আপনার মন্তব্য</label>
                                                        <textarea
                                                            value={reviewData.comment}
                                                            onChange={(e) => setReviewData('comment', e.target.value)}
                                                            rows={3}
                                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-900 outline-none"
                                                            placeholder="অভিজ্ঞতা শেয়ার করুন..."
                                                        />
                                                    </div>
                                                    <button
                                                        type="submit"
                                                        disabled={submittingReview}
                                                        className="rounded-xl bg-[#0F52BA] px-6 py-2.5 text-xs font-black text-white"
                                                    >
                                                        {submittingReview ? 'পাঠানো হচ্ছে...' : 'সাবমিট করুন'}
                                                    </button>
                                                </form>
                                            )}

                                            {reviews.map((r) => (
                                                <div key={r.id} className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-bold text-slate-900">{r.name}</span>
                                                        <div className="flex gap-0.5">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    className={`h-3.5 w-3.5 ${
                                                                        i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                                                                    }`}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <p className="mt-2 text-xs text-slate-600">{r.comment}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <section className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
                        <h2 className="mb-6 text-xl font-black text-slate-900">সম্পর্কিত অন্যান্য শুকটি মাছ</h2>
                        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-5">
                            {relatedProducts.map((rp) => (
                                <ProductCard key={rp.id} product={rp} />
                            ))}
                        </div>
                    </section>
                )}

                <ShutkiOceanFooter />
            </main>
        </>
    );
}
