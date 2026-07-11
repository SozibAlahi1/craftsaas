import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Check, Heart, Leaf, Shield, ShoppingBag, ShoppingCart, Star, Truck } from 'lucide-react';
import { useState } from 'react';

import { StorefrontHeader } from '@/components/storefront-header';
import { ShutkirFooter } from '@/themes/shutki/components/Footer';

/* LIGHT Organic Palette */
const P = {
    sage: 'hsl(89,32%,54%)',
    sageDark: 'hsl(89,35%,42%)',
    sageLight: 'hsl(89,28%,88%)',
    sageBg: 'hsl(89,22%,95%)',
    honey: 'hsl(38,72%,52%)',
    honeyLight: 'hsl(38,70%,92%)',
    terra: 'hsl(18,55%,52%)',
    terraLight: 'hsl(18,55%,94%)',
    cream: 'hsl(48,40%,97%)',
    white: '#ffffff',
    border: 'hsl(89,20%,86%)',
    earth: 'hsl(35,28%,18%)',
    earthMid: 'hsl(35,22%,36%)',
    earthLight: 'hsl(35,18%,52%)',
} as const;

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
};
type RelatedProduct = Pick<Product, 'slug' | 'name' | 'price' | 'old_price' | 'discount_text' | 'image'>;

export default function Show({ product, relatedProducts }: { product: Product; relatedProducts: RelatedProduct[] }) {
    const getLabel = (v: any) => (typeof v === 'string' ? v : (v?.label ?? ''));
    const getImage = (v: any) => (typeof v === 'string' ? null : (v?.image ?? null));

    const [selectedColor, setSelectedColor] = useState(getLabel(product.variations.colors[0] ?? ''));
    const [selectedSize, setSelectedSize] = useState(getLabel(product.variations.sizes[0] ?? ''));
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState(() => getImage(product.variations.colors[0]) ?? product.image);
    const [activeTab, setActiveTab] = useState<'details' | 'delivery' | 'reviews'>('details');
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);

    const selectColor = (label: string, image: string | null) => {
        setSelectedColor(label);
        if (image) setActiveImage(image);
    };
    const selectSize = (label: string, image: string | null) => {
        setSelectedSize(label);
        if (image) setActiveImage(image);
    };

    const variationImages = [...product.variations.colors.map(getImage), ...product.variations.sizes.map(getImage)].filter((s): s is string =>
        Boolean(s),
    );
    const allImages = Array.from(new Set([product.image, ...(product.gallery || []), ...variationImages]));

    const {
        data: reviewData,
        setData: setReviewData,
        post: postReview,
        processing: submittingReview,
        reset: resetReview,
        errors: reviewErrors,
    } = useForm({ name: '', rating: 5, comment: '' });
    const reviews = product.reviews || [];
    const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : '0.0';

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

    const handleAddToCart = (qty = 1) => {
        router.post(
            route('cart.add'),
            {
                slug: product.slug,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: qty,
                color: selectedColor,
                size: selectedSize,
            },
            {
                preserveScroll: true,
                onSuccess: () => flash('কার্টে যোগ হয়েছে!'),
            },
        );
    };

    const handleBuyNow = () => {
        router.post(route('cart.buyNow'), {
            slug: product.slug,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity,
            color: selectedColor,
            size: selectedSize,
        });
    };

    const priceNum = parseInt((product.price || '0').replace(/[^\d]/g, ''));

    return (
        <>
            <Head title={product.name} />
            <main style={{ background: P.cream, color: P.earth }}>
                <StorefrontHeader />

                {/* Toast */}
                {successMessage && (
                    <div className="animate-in fade-in slide-in-from-right-4 fixed right-6 bottom-24 z-[60] duration-300">
                        <div className="flex items-center gap-3 rounded-xl px-6 py-4 font-bold text-white shadow-xl" style={{ background: P.sage }}>
                            <Check className="h-5 w-5" /> {successMessage}
                        </div>
                    </div>
                )}

                <section className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <div className="mb-6 flex items-center gap-2 text-sm font-medium" style={{ color: P.earthLight }}>
                        <Link
                            href={route('home')}
                            className="inline-flex items-center gap-1.5 transition-colors hover:opacity-75"
                            style={{ color: P.sage }}
                        >
                            <ArrowLeft className="h-4 w-4" /> হোম
                        </Link>
                        <span style={{ color: P.border }}>/</span>
                        <span className="font-semibold" style={{ color: P.earthMid }}>
                            {product.name}
                        </span>
                    </div>

                    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
                        {/* Gallery */}
                        <div className="flex flex-col-reverse gap-4 lg:flex-row">
                            <div className="grid grid-cols-4 gap-2 lg:flex lg:w-20 lg:flex-col">
                                {allImages.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveImage(image)}
                                        className="overflow-hidden rounded-lg border-2 transition-all hover:scale-[1.03]"
                                        style={{ borderColor: activeImage === image ? P.sage : P.border }}
                                    >
                                        <img src={image} alt="" className="aspect-square h-full w-full object-cover" />
                                    </button>
                                ))}
                            </div>
                            <div className="flex-1">
                                <div className="overflow-hidden rounded-2xl bg-white shadow-sm" style={{ border: `2px solid ${P.border}` }}>
                                    <div className="relative aspect-square">
                                        <img
                                            src={activeImage}
                                            alt={product.name}
                                            className="animate-in fade-in h-full w-full object-cover duration-500"
                                        />
                                        {product.discount_text && (
                                            <span
                                                className="absolute top-4 left-4 rounded-lg px-4 py-2 text-sm font-black text-white shadow-md"
                                                style={{ background: P.terra }}
                                            >
                                                {product.discount_text}
                                            </span>
                                        )}
                                        <button
                                            type="button"
                                            className="absolute top-4 right-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-400 shadow-md transition-colors hover:text-red-500"
                                        >
                                            <Heart className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Product info */}
                        <div className="space-y-4">
                            <div className="rounded-2xl bg-white p-6 shadow-sm" style={{ border: `2px solid ${P.border}` }}>
                                <div
                                    className="mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-black tracking-widest uppercase"
                                    style={{ background: P.sageBg, color: P.sageDark }}
                                >
                                    <Leaf className="h-3 w-3" /> অর্গানিক শুকটি
                                </div>

                                <h1
                                    className="text-2xl leading-tight font-black tracking-tight sm:text-3xl"
                                    style={{ color: P.sageDark }}
                                >
                                    {product.name}
                                </h1>

                                <div className="mt-3 flex items-center gap-2 text-sm" style={{ color: P.earthLight }}>
                                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                    <span>
                                        {avgRating} রেটিং — {reviews.length} জন রিভিউ করেছেন
                                    </span>
                                </div>

                                {/* Price */}
                                <div className="mt-4 flex flex-wrap items-end gap-3">
                                    <div className="text-3xl font-black sm:text-4xl" style={{ color: P.terra }}>
                                        {product.price}
                                    </div>
                                    {product.old_price && (
                                        <div className="flex items-center gap-2">
                                            <div className="text-lg font-semibold line-through" style={{ color: P.earthLight }}>
                                                {product.old_price}
                                            </div>
                                            {product.discount_text && (
                                                <span
                                                    className="rounded-full px-2.5 py-0.5 text-xs font-black"
                                                    style={{ background: P.honeyLight, color: P.honey }}
                                                >
                                                    {product.discount_text}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <p className="mt-4 line-clamp-3 text-sm leading-7" style={{ color: P.earthMid }}>
                                    {product.description}
                                </p>

                                {/* Variations */}
                                {(product.variations.colors.filter((c) => getLabel(c)?.trim()).length > 0 ||
                                    product.variations.sizes.filter((s) => getLabel(s)?.trim()).length > 0) && (
                                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                                        {product.variations.colors.filter((c) => getLabel(c)?.trim()).length > 0 && (
                                            <div>
                                                <div className="mb-2 text-xs font-black tracking-wider uppercase" style={{ color: P.earthMid }}>
                                                    কালার
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {product.variations.colors.map((c) => {
                                                        const label = getLabel(c);
                                                        const img = getImage(c);
                                                        if (!label?.trim()) return null;
                                                        return (
                                                            <button
                                                                key={label}
                                                                onClick={() => selectColor(label, img)}
                                                                className="rounded-lg border-2 px-4 py-2 text-sm font-bold transition-all"
                                                                style={{
                                                                    borderColor: selectedColor === label ? P.sage : P.border,
                                                                    background: selectedColor === label ? P.sage : P.white,
                                                                    color: selectedColor === label ? P.white : P.earth,
                                                                }}
                                                            >
                                                                {label}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                        {product.variations.sizes.filter((s) => getLabel(s)?.trim()).length > 0 && (
                                            <div>
                                                <div className="mb-2 text-xs font-black tracking-wider uppercase" style={{ color: P.earthMid }}>
                                                    সাইজ
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {product.variations.sizes.map((s) => {
                                                        const label = getLabel(s);
                                                        const img = getImage(s);
                                                        if (!label?.trim()) return null;
                                                        return (
                                                            <button
                                                                key={label}
                                                                onClick={() => selectSize(label, img)}
                                                                className="rounded-lg border-2 px-4 py-2 text-sm font-bold transition-all"
                                                                style={{
                                                                    borderColor: selectedSize === label ? P.sage : P.border,
                                                                    background: selectedSize === label ? P.sage : P.white,
                                                                    color: selectedSize === label ? P.white : P.earth,
                                                                }}
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

                                {/* Qty + CTA */}
                                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                                    <div
                                        className="inline-flex shrink-0 items-center self-start overflow-hidden rounded-xl sm:self-auto"
                                        style={{ border: `2px solid ${P.border}` }}
                                    >
                                        <button
                                            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                            className="hover:bg-sage-50 flex h-11 w-11 items-center justify-center text-xl font-bold transition-colors"
                                            style={{ background: P.sageBg, color: P.sageDark }}
                                        >
                                            –
                                        </button>
                                        <span className="mx-4 min-w-[2rem] text-center text-lg font-black" style={{ color: P.earth }}>
                                            {quantity}
                                        </span>
                                        <button
                                            onClick={() => setQuantity((q) => q + 1)}
                                            className="flex h-11 w-11 items-center justify-center text-xl font-bold transition-colors"
                                            style={{ background: P.sageBg, color: P.sageDark }}
                                        >
                                            +
                                        </button>
                                    </div>

                                    <div className="flex w-full flex-col gap-2 min-[400px]:flex-row sm:flex-1 sm:flex-row sm:gap-3">
                                        <button
                                            onClick={() => handleAddToCart(quantity)}
                                            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border-2 px-3 py-3.5 text-[13px] font-black transition-all hover:text-white lg:text-sm"
                                            style={{ borderColor: P.sage, color: P.sage }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = P.sage;
                                                e.currentTarget.style.color = 'white';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = 'transparent';
                                                e.currentTarget.style.color = P.sage;
                                            }}
                                        >
                                            <ShoppingCart className="h-4 w-4 shrink-0" /> কার্টে যোগ করুন
                                        </button>
                                        <button
                                            onClick={handleBuyNow}
                                            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-3.5 text-[13px] font-black text-white shadow-md transition-all hover:-translate-y-0.5 hover:opacity-90 lg:text-sm"
                                            style={{ background: P.terra }}
                                        >
                                            <ShoppingBag className="h-4 w-4 shrink-0" /> এখনই অর্ডার করুন
                                        </button>
                                    </div>
                                </div>

                                {/* Trust row */}
                                <div className="mt-5 grid grid-cols-3 gap-2 pt-4" style={{ borderTop: `1px solid ${P.border}` }}>
                                    {[
                                        { icon: <Shield className="h-4 w-4" />, text: '১০০% আসল' },
                                        { icon: <Truck className="h-4 w-4" />, text: 'দ্রুত ডেলিভারি' },
                                        { icon: <Leaf className="h-4 w-4" />, text: 'ভেজালমুক্ত' },
                                    ].map((item, i) => (
                                        <div
                                            key={i}
                                            className="flex flex-col items-center gap-1 rounded-lg px-1 py-2 text-center"
                                            style={{ background: P.sageBg }}
                                        >
                                            <span style={{ color: P.sage }}>{item.icon}</span>
                                            <span className="text-[10px] font-bold" style={{ color: P.earthMid }}>
                                                {item.text}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Tabs */}
                <section className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-2xl bg-white shadow-sm" style={{ border: `2px solid ${P.border}` }}>
                        <nav className="flex" style={{ borderBottom: `2px solid ${P.border}`, background: P.sageBg }}>
                            {(['details', 'delivery', 'reviews'] as const).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className="relative px-6 py-4 text-sm font-black tracking-wider uppercase transition-colors"
                                    style={{ color: activeTab === tab ? P.sageDark : P.earthLight }}
                                >
                                    {tab === 'details' ? 'বিস্তারিত' : tab === 'delivery' ? 'ডেলিভারি' : `রিভিউ (${reviews.length})`}
                                    {activeTab === tab && <span className="absolute bottom-0 left-0 h-0.5 w-full" style={{ background: P.sage }} />}
                                </button>
                            ))}
                        </nav>

                        <div className="p-6 sm:p-8">
                            {activeTab === 'details' && (
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                                    <h3 className="mb-4 text-xl font-black" style={{ color: P.sageDark }}>
                                        পণ্যের বিবরণ
                                    </h3>
                                    <p className="text-base leading-8" style={{ color: P.earthMid }}>
                                        {product.description}
                                    </p>
                                </div>
                            )}

                            {activeTab === 'delivery' && (
                                <div className="animate-in fade-in slide-in-from-bottom-2 max-w-3xl space-y-6 duration-500">
                                    <div>
                                        <h3 className="mb-3 text-xl font-black" style={{ color: P.sageDark }}>
                                            শিপিং ও ডেলিভারি
                                        </h3>
                                        <p className="text-sm leading-7" style={{ color: P.earthMid }}>
                                            {product.delivery_info || 'সারাবাংলাদেশে দ্রুত ও নিরাপদ ডেলিভারি দেওয়া হয়।'}
                                        </p>
                                    </div>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="rounded-xl p-5" style={{ background: P.sageBg, border: `2px solid ${P.sage}` }}>
                                            <div className="mb-1 text-xs font-black tracking-widest uppercase" style={{ color: P.sageDark }}>
                                                ঢাকার ভেতরে
                                            </div>
                                            <div className="text-sm font-bold" style={{ color: P.earth }}>
                                                {product.delivery_dhaka || '১-৩ কার্যদিবস'}
                                            </div>
                                        </div>
                                        <div className="rounded-xl p-5" style={{ background: P.honeyLight, border: `2px solid ${P.honey}` }}>
                                            <div className="mb-1 text-xs font-black tracking-widest uppercase" style={{ color: P.honey }}>
                                                ঢাকার বাইরে
                                            </div>
                                            <div className="text-sm font-bold" style={{ color: P.earth }}>
                                                {product.delivery_outside || '৩-৫ কার্যদিবস'}
                                            </div>
                                        </div>
                                    </div>
                                    {product.return_info && (
                                        <div>
                                            <h3 className="mb-2 text-lg font-black" style={{ color: P.sageDark }}>
                                                রিটার্ন পলিসি
                                            </h3>
                                            <p className="text-sm leading-7" style={{ color: P.earthMid }}>
                                                {product.return_info}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'reviews' && (
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                                    <div className="flex flex-col gap-8 lg:flex-row">
                                        <div className="lg:w-1/3">
                                            <div
                                                className="sticky top-24 rounded-xl p-6 text-center"
                                                style={{ background: P.sageBg, border: `2px solid ${P.border}` }}
                                            >
                                                <div className="text-5xl font-black" style={{ color: P.sageDark }}>
                                                    {avgRating}
                                                </div>
                                                <div className="mt-2 flex justify-center gap-1">
                                                    {[1, 2, 3, 4, 5].map((s) => (
                                                        <Star
                                                            key={s}
                                                            className={`h-5 w-5 ${s <= Math.round(parseFloat(avgRating)) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
                                                        />
                                                    ))}
                                                </div>
                                                <div className="mt-1 text-xs font-semibold" style={{ color: P.earthLight }}>
                                                    {reviews.length} জন রিভিউ দিয়েছেন
                                                </div>
                                                <button
                                                    onClick={() => setIsReviewFormOpen(!isReviewFormOpen)}
                                                    className="mt-5 w-full rounded-xl py-2.5 text-sm font-black text-white transition-all hover:opacity-90"
                                                    style={{ background: P.sage }}
                                                >
                                                    {isReviewFormOpen ? 'বাতিল করুন' : 'রিভিউ লিখুন'}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex-1 space-y-6">
                                            {isReviewFormOpen && (
                                                <div
                                                    className="animate-in slide-in-from-top-4 rounded-xl p-6 duration-300"
                                                    style={{ border: `2px solid ${P.sage}`, background: P.sageBg }}
                                                >
                                                    <h3
                                                        className="mb-4 text-lg font-black"
                                                        style={{ color: P.sageDark }}
                                                    >
                                                        আপনার রিভিউ লিখুন
                                                    </h3>
                                                    <form onSubmit={submitReview} className="space-y-4">
                                                        <div className="grid gap-4 sm:grid-cols-2">
                                                            <div>
                                                                <label
                                                                    className="mb-1.5 block text-xs font-black tracking-wider uppercase"
                                                                    style={{ color: P.earthMid }}
                                                                >
                                                                    আপনার নাম
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    value={reviewData.name}
                                                                    onChange={(e) => setReviewData('name', e.target.value)}
                                                                    className="w-full rounded-lg bg-white px-4 py-2 text-sm outline-none"
                                                                    style={{ border: `2px solid ${reviewErrors.name ? 'red' : P.border}` }}
                                                                    placeholder="আপনার নাম লিখুন"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label
                                                                    className="mb-1.5 block text-xs font-black tracking-wider uppercase"
                                                                    style={{ color: P.earthMid }}
                                                                >
                                                                    রেটিং
                                                                </label>
                                                                <div className="flex h-10 items-center gap-2">
                                                                    {[1, 2, 3, 4, 5].map((s) => (
                                                                        <button
                                                                            key={s}
                                                                            type="button"
                                                                            onClick={() => setReviewData('rating', s)}
                                                                            className="transition-transform hover:scale-110"
                                                                        >
                                                                            <Star
                                                                                className={`h-7 w-7 ${s <= reviewData.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
                                                                            />
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label
                                                                className="mb-1.5 block text-xs font-black tracking-wider uppercase"
                                                                style={{ color: P.earthMid }}
                                                            >
                                                                আপনার মন্তব্য
                                                            </label>
                                                            <textarea
                                                                value={reviewData.comment}
                                                                onChange={(e) => setReviewData('comment', e.target.value)}
                                                                rows={4}
                                                                className="w-full resize-none rounded-lg bg-white px-4 py-2 text-sm outline-none"
                                                                style={{ border: `2px solid ${P.border}` }}
                                                                placeholder="পণ্যটি সম্পর্কে আপনার অভিজ্ঞতা শেয়ার করুন..."
                                                            />
                                                        </div>
                                                        <button
                                                            type="submit"
                                                            disabled={submittingReview}
                                                            className="w-full rounded-xl py-3 text-sm font-black text-white disabled:opacity-50"
                                                            style={{ background: P.sage }}
                                                        >
                                                            {submittingReview ? 'পাঠানো হচ্ছে...' : 'রিভিউ পাঠান'}
                                                        </button>
                                                    </form>
                                                </div>
                                            )}

                                            {reviews.length === 0 ? (
                                                <div className="py-12 text-center">
                                                    <Leaf className="mx-auto mb-3 h-12 w-12" style={{ color: P.sageLight }} />
                                                    <h4 className="text-base font-bold" style={{ color: P.earthMid }}>
                                                        এখনো কোনো রিভিউ নেই
                                                    </h4>
                                                    <p className="mt-1 text-sm" style={{ color: P.earthLight }}>
                                                        প্রথম রিভিউ দিন!
                                                    </p>
                                                </div>
                                            ) : (
                                                reviews.map((review) => (
                                                    <div key={review.id} className="pb-6 last:pb-0" style={{ borderBottom: `1px solid ${P.border}` }}>
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <div
                                                                    className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-black text-white uppercase"
                                                                    style={{ background: P.sage }}
                                                                >
                                                                    {review.name.charAt(0)}
                                                                </div>
                                                                <div>
                                                                    <div className="text-sm font-black" style={{ color: P.earth }}>
                                                                        {review.name}
                                                                    </div>
                                                                    <div className="text-xs" style={{ color: P.earthLight }}>
                                                                        {new Date(review.created_at).toLocaleDateString('bn-BD')}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-0.5">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <Star
                                                                        key={i}
                                                                        className={`h-3.5 w-3.5 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
                                                                    />
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <p className="mt-3 text-sm leading-7" style={{ color: P.earthMid }}>
                                                            {review.comment}
                                                        </p>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Related products */}
                {relatedProducts.length > 0 && (
                    <section className="px-4 py-10 sm:px-6 lg:px-8" style={{ background: P.sageBg, borderTop: `1px solid ${P.border}` }}>
                        <div className="mx-auto max-w-[1440px]">
                            <h2 className="mb-6 text-2xl font-black" style={{ color: P.sageDark }}>
                                সম্পর্কিত পণ্য
                            </h2>
                            <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
                                {relatedProducts.map((item) => (
                                    <Link
                                        key={item.slug}
                                        href={route('products.show', item.slug)}
                                        className="group block overflow-hidden rounded-xl bg-white transition-all hover:-translate-y-1 hover:shadow-md"
                                        style={{ border: `2px solid ${P.border}` }}
                                        onMouseEnter={(e) => (e.currentTarget.style.borderColor = P.sage)}
                                        onMouseLeave={(e) => (e.currentTarget.style.borderColor = P.border)}
                                    >
                                        <div className="relative aspect-square overflow-hidden bg-white">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        </div>
                                        <div className="p-3">
                                            <h3 className="line-clamp-2 text-sm font-bold leading-tight" style={{ color: P.earth }}>
                                                {item.name}
                                            </h3>
                                            <div className="mt-1 text-base font-black" style={{ color: P.terra }}>
                                                {item.price}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                <ShutkirFooter />
            </main>
        </>
    );
}
