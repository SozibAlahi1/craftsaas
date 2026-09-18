import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Check,
    CheckCircle2,
    Eye,
    Heart,
    RotateCcw,
    ShieldCheck,
    ShoppingBag,
    ShoppingCart,
    Sparkles,
    Star,
    Truck,
    Zap,
} from 'lucide-react';
import { useState } from 'react';

import { StorefrontFooter as Footer } from '@/components/storefront-footer';
import { Header } from '../../components/Header';
import { ProductCard } from '../../components/ProductCard';

type Review = {
    id: number;
    name: string;
    rating: number;
    comment: string;
    created_at: string;
};

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
    variations: {
        colors: Array<string | { label: string; image: string | null }>;
        sizes: Array<string | { label: string; image: string | null }>;
    };
    stock_quantity: number;
    is_in_stock: boolean;
    reviews: Review[];
    variants: any[];
    category: any;
};

interface ProductShowProps {
    product: Product;
    relatedProducts: any[];
}

export default function Show({ product, relatedProducts }: ProductShowProps) {
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

    const getColorImage = (color: any, index: number) => {
        const raw = getImage(color);
        if (raw) {
            return raw.startsWith('http') || raw.startsWith('/') ? raw : `/storage/${raw}`;
        }
        if (product.gallery && Array.isArray(product.gallery) && product.gallery.length > 0) {
            if (product.gallery[index]) {
                const g = product.gallery[index];
                return g.startsWith('http') || g.startsWith('/') ? g : `/storage/${g}`;
            }
        }
        if (index === 0 && product.image) {
            return product.image.startsWith('http') || product.image.startsWith('/') ? product.image : `/storage/${product.image}`;
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

    const selectColor = (label: string, image: string | null) => {
        if (selectedColor === label) {
            setSelectedColor(null);
            setActiveImage(product.image);
        } else {
            setSelectedColor(label);
            if (image) {
                setActiveImage(image);
            }
        }
    };

    const selectSize = (label: string, image: string | null) => {
        setSelectedSize(label);
        if (image) {
            setActiveImage(image);
        }
    };

    const variationImages = [
        ...product.variations.colors.map((c, i) => getColorImage(c, i)),
        ...product.variations.sizes.map(getImage),
    ].filter((src): src is string => Boolean(src));

    const allImages = Array.from(new Set([product.image, ...(product.gallery || []), ...variationImages])).filter(Boolean);

    const {
        data: reviewData,
        setData: setReviewData,
        post: postReview,
        processing: submittingReview,
        reset: resetReview,
        errors: reviewErrors,
    } = useForm({
        name: '',
        rating: 5,
        comment: '',
    });

    const reviews = product.reviews || [];
    const averageRating = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : '0.0';

    const ratingCounts = [5, 4, 3, 2, 1].map((star) => {
        const count = reviews.filter((r) => Math.round(r.rating) === star).length;
        const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
        return { star, count, percentage };
    });

    const submitReview = (e: React.FormEvent) => {
        e.preventDefault();
        postReview(route('products.reviews.store', product.id), {
            preserveScroll: true,
            onSuccess: () => {
                setIsReviewFormOpen(false);
                resetReview();
                setSuccessMessage('ধন্যবাদ! আপনার রিভিউ সফলভাবে পোস্ট হয়েছে।');
                setTimeout(() => setSuccessMessage(null), 3000);
            },
        });
    };

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

    const getSavingsText = () => {
        if (!product.old_price) return null;
        const numericOld = parseFloat(String(product.old_price).replace(/[^0-9.]/g, ''));
        const currentPriceStr = getVariantPrice(getSelectedVariant()) || product.price;
        const numericCurrent = parseFloat(String(currentPriceStr).replace(/[^0-9.]/g, ''));
        if (!isNaN(numericOld) && !isNaN(numericCurrent) && numericOld > numericCurrent) {
            const diff = numericOld - numericCurrent;
            return `সাশ্রয় ৳${diff.toLocaleString('en-BD')}`;
        }
        return null;
    };

    const handleAddToCart = (
        item: { id: number; slug: string; name: string; price: string; image: string },
        qty: number = 1,
        color?: string,
        size?: string,
    ) => {
        const variant = getSelectedVariant();
        const vPrice = getVariantPrice(variant);
        router.post(
            route('cart.add'),
            {
                product_id: item.id,
                product_variant_id: variant?.id,
                slug: item.slug,
                name: item.name,
                price: vPrice ? `৳${parseInt(String(vPrice)).toLocaleString()}` : item.price,
                image: item.image,
                quantity: qty,
                color,
                size,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setSuccessMessage('কার্টে যুক্ত করা হয়েছে!');
                    setTimeout(() => setSuccessMessage(null), 3000);
                },
            },
        );
    };

    const handleBuyNow = (
        item: { id: number; slug: string; name: string; price: string; image: string },
        qty: number = 1,
        color?: string,
        size?: string,
    ) => {
        const variant = getSelectedVariant();
        const vPrice = getVariantPrice(variant);
        router.post(route('cart.buyNow'), {
            product_id: item.id,
            product_variant_id: variant?.id,
            slug: item.slug,
            name: item.name,
            price: vPrice ? `৳${parseInt(String(vPrice)).toLocaleString()}` : item.price,
            image: item.image,
            quantity: qty,
            color,
            size,
        });
    };

    const formatPrice = (price: any) => {
        if (price === null || price === undefined) return '';
        const numericPrice = parseFloat(String(price).replace(/[^0-9.]/g, ''));
        if (isNaN(numericPrice)) return price;
        return `৳ ${numericPrice.toLocaleString('en-BD', { minimumFractionDigits: 0 })}`;
    };

    const bundleItems = relatedProducts.slice(0, 2);

    return (
        <>
            <Head title={product.name} />
            <main className="bg-[#050505] font-sans text-white selection:bg-[#cba876] selection:text-black">
                <Header />

                {successMessage && (
                    <div className="animate-in fade-in slide-in-from-right-4 fixed right-6 bottom-24 z-[60] duration-300">
                        <div className="flex items-center gap-3 rounded-xl border border-black/10 bg-[#cba876] px-6 py-4 font-bold text-black shadow-2xl backdrop-blur-md">
                            <CheckCircle2 className="h-5 w-5 flex-none text-black" />
                            {successMessage}
                        </div>
                    </div>
                )}

                <section className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
                    <div className="mb-6 flex flex-wrap items-center gap-2 text-sm font-medium text-gray-400">
                        <Link
                            href={route('home')}
                            className="inline-flex items-center gap-2 rounded-lg px-2 py-1 transition-colors hover:bg-white/5 hover:text-[#cba876]"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            হোম পেইজ
                        </Link>
                        <span className="text-gray-700">/</span>
                        <span className="max-w-[280px] truncate font-semibold text-[#cba876] sm:max-w-md">{product.name}</span>
                    </div>

                    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
                        {/* Gallery Section */}
                        <div className="flex flex-col-reverse gap-4 lg:flex-row">
                            <div className="grid grid-cols-4 gap-3 lg:flex lg:w-24 lg:flex-col lg:gap-4">
                                {allImages.map((image, index) => (
                                    <button
                                        key={`${product.slug}-${index}`}
                                        onClick={() => setActiveImage(image)}
                                        className={`group relative overflow-hidden rounded-xl border transition-all duration-300 focus:outline-none ${
                                            activeImage === image
                                                ? 'border-[#cba876] shadow-lg ring-2 shadow-[#cba876]/20 ring-[#cba876]'
                                                : 'border-white/10 bg-[#0a0a0a] opacity-75 grayscale-[0.4] hover:border-white/30 hover:opacity-100 hover:grayscale-0'
                                        }`}
                                    >
                                        <img
                                            src={image}
                                            alt={`${product.name} thumbnail ${index + 1}`}
                                            className="aspect-square h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                                        />
                                    </button>
                                ))}
                            </div>

                            <div className="flex-1">
                                <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d0d] shadow-2xl">
                                    <div className="relative aspect-square overflow-hidden bg-[#0a0a0a]">
                                        <img
                                            src={activeImage}
                                            alt={product.name}
                                            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                        />

                                        {product.discount_text && (
                                            <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#cba876] to-[#e6c999] px-4 py-2 text-xs font-black tracking-wider text-black uppercase shadow-xl">
                                                <Sparkles className="h-3.5 w-3.5 fill-black" />
                                                {product.discount_text}
                                            </span>
                                        )}

                                        <span className="absolute bottom-4 left-4 rounded-full border border-white/10 bg-black/60 px-3 py-1.5 text-xs font-semibold text-white/90 backdrop-blur-md">
                                            {allImages.indexOf(activeImage) + 1} / {allImages.length}
                                        </span>

                                        <button
                                            type="button"
                                            className="absolute top-4 right-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/60 text-white shadow-xl backdrop-blur-md transition-all hover:border-[#cba876] hover:bg-[#cba876] hover:text-black"
                                            aria-label="Add to wishlist"
                                        >
                                            <Heart className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Product Summary & Buy Options */}
                        <div className="space-y-6">
                            <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-6 shadow-xl sm:p-8">
                                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#cba876]/30 bg-[#cba876]/10 px-3.5 py-1 text-xs font-bold tracking-widest text-[#cba876] uppercase">
                                    <Sparkles className="h-3.5 w-3.5" />
                                    পপুলার অফার
                                </div>

                                <h1 className="text-2xl leading-tight font-extrabold tracking-tight text-white sm:text-3xl lg:text-4xl">
                                    {product.name}
                                </h1>

                                <div className="mt-4 flex flex-wrap items-baseline gap-3">
                                    <span className="text-3xl font-black text-[#cba876] sm:text-4xl">
                                        {getVariantPrice(getSelectedVariant())
                                            ? `৳${parseInt(String(getVariantPrice(getSelectedVariant()))).toLocaleString()}`
                                            : product.price}
                                    </span>

                                    {product.old_price && !getSelectedVariant()?.price && (
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="text-lg font-bold text-gray-500 line-through">{product.old_price}</span>
                                            {getSavingsText() && (
                                                <span className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-black text-emerald-400">
                                                    {getSavingsText()}
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    <div className="ml-auto">
                                        {(
                                            getSelectedVariant()
                                                ? getSelectedVariant()?.stock_quantity > 0
                                                : product.is_in_stock && product.stock_quantity > 0
                                        ) ? (
                                            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/60 px-3.5 py-1.5 text-xs font-bold text-emerald-400 backdrop-blur-sm">
                                                <span className="relative flex h-2 w-2">
                                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                                                </span>
                                                স্টকে আছে
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-950/60 px-3.5 py-1.5 text-xs font-bold text-red-400 backdrop-blur-sm">
                                                <span className="h-2 w-2 rounded-full bg-red-500"></span>
                                                স্টক শেষ
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-4 flex items-center gap-2 text-sm text-gray-300">
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={`h-4 w-4 ${star <= Math.round(parseFloat(averageRating)) ? 'fill-amber-400 text-amber-400' : 'text-gray-600'}`}
                                            />
                                        ))}
                                    </div>
                                    <span className="font-bold text-white">{averageRating}</span>
                                    <span className="text-gray-500">|</span>
                                    <span className="text-gray-400">{reviews.length} টি ভেরিফাইড রিভিউ</span>
                                </div>

                                <div
                                    className="rich-description mt-5 line-clamp-3 text-sm leading-relaxed whitespace-pre-wrap text-gray-300"
                                    dangerouslySetInnerHTML={{ __html: product.description }}
                                />

                                {/* Color & Size Selection */}
                                {(product.variations.colors.filter((c) => {
                                    const l = getLabel(c);
                                    return l && l.trim();
                                }).length > 0 ||
                                    product.variations.sizes.filter((s) => {
                                        const l = getLabel(s);
                                        return l && l.trim();
                                    }).length > 0) && (
                                    <div className="mt-6 grid gap-5 sm:grid-cols-2">
                                        {product.variations.colors.filter((c, i) => {
                                            const l = getLabel(c);
                                            return (l && l.trim()) || getColorImage(c, i);
                                        }).length > 0 && (
                                            <div>
                                                <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-gray-300 uppercase">
                                                    <span>কালার সিলেক্ট করুন</span>
                                                    {selectedColor && (
                                                        <>
                                                            <span className="text-gray-600">:</span>
                                                            <span className="font-bold capitalize text-[#cba876]">{selectedColor}</span>
                                                        </>
                                                    )}
                                                </div>
                                                <div className="mt-3 flex flex-wrap items-center gap-3">
                                                    {product.variations.colors.map((color, index) => {
                                                        const label = getLabel(color) || `Color ${index + 1}`;
                                                        const colorImg = getColorImage(color, index);
                                                        const isSelected = selectedColor === label;
                                                        return (
                                                            <button
                                                                key={label || index}
                                                                type="button"
                                                                title={label}
                                                                className={`group relative flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center overflow-hidden rounded-xl border-2 p-0.5 transition-all duration-200 ${
                                                                    isSelected
                                                                        ? 'border-[#cba876] ring-2 ring-[#cba876]/30 shadow-md shadow-[#cba876]/20 scale-105'
                                                                        : 'border-white/10 bg-[#0d0d0d] hover:border-white/30 hover:scale-102'
                                                                }`}
                                                                onClick={() => selectColor(label, colorImg)}
                                                            >
                                                                {colorImg ? (
                                                                    <img
                                                                        src={colorImg}
                                                                        alt={label}
                                                                        className="h-full w-full rounded-lg object-cover"
                                                                    />
                                                                ) : (
                                                                    <span className="flex h-full w-full items-center justify-center rounded-lg bg-white/5 p-1 text-center text-[11px] font-bold text-gray-300">
                                                                        {label}
                                                                    </span>
                                                                )}
                                                                {isSelected && (
                                                                    <span className="absolute bottom-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#cba876] text-black shadow-sm ring-1 ring-black/40">
                                                                        <Check className="h-2.5 w-2.5 stroke-[3]" />
                                                                    </span>
                                                                )}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        {product.variations.sizes.filter((s) => {
                                            const l = getLabel(s);
                                            return l && l.trim();
                                        }).length > 0 && (
                                            <div>
                                                <div className="text-xs font-bold tracking-wider text-gray-300 uppercase">সাইজ সিলেক্ট করুন</div>
                                                <div className="mt-3 flex flex-wrap gap-2">
                                                    {product.variations.sizes.map((size) => {
                                                        const label = getLabel(size);
                                                        const img = getImage(size);
                                                        if (!label || !label.trim()) return null;
                                                        const isSelected = selectedSize === label;
                                                        return (
                                                            <button
                                                                key={label}
                                                                type="button"
                                                                className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold transition-all duration-200 ${
                                                                    isSelected
                                                                        ? 'border-[#cba876] bg-[#cba876] text-black shadow-md shadow-[#cba876]/20'
                                                                        : 'border-white/10 bg-[#0d0d0d] text-gray-300 hover:border-white/30 hover:text-white'
                                                                }`}
                                                                onClick={() => selectSize(label, img)}
                                                            >
                                                                {img ? (
                                                                    <img src={img} alt={label} className="h-4 w-4 rounded-md object-cover" />
                                                                ) : null}
                                                                <span>{label}</span>
                                                                {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Quantity & Actions */}
                                <div className="mt-6 flex flex-col gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="inline-flex items-center rounded-xl border border-white/15 bg-[#0d0d0d] p-1 shadow-inner">
                                            <button
                                                type="button"
                                                onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                                                className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-lg font-bold text-gray-300 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-40"
                                                aria-label="Decrease quantity"
                                                disabled={!product.is_in_stock || product.stock_quantity <= 0}
                                            >
                                                –
                                            </button>

                                            <span className="mx-4 min-w-[2rem] text-center text-base font-extrabold text-white">{quantity}</span>

                                            <button
                                                type="button"
                                                onClick={() => setQuantity((current) => Math.min(product.stock_quantity, current + 1))}
                                                className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-lg font-bold text-gray-300 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-40"
                                                aria-label="Increase quantity"
                                                disabled={!product.is_in_stock || product.stock_quantity <= 0 || quantity >= product.stock_quantity}
                                            >
                                                +
                                            </button>
                                        </div>

                                        <div className="flex flex-1 gap-3">
                                            <button
                                                type="button"
                                                onClick={() => handleAddToCart(product, quantity, selectedColor, selectedSize)}
                                                disabled={!product.is_in_stock || product.stock_quantity <= 0}
                                                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#cba876] px-5 py-4 text-sm font-bold text-white transition-all duration-300 hover:bg-[#cba876] hover:text-black active:scale-[0.98] disabled:opacity-50"
                                            >
                                                <ShoppingBag className="h-4 w-4" />
                                                কার্টে যুক্ত করুন
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => handleBuyNow(product, quantity, selectedColor, selectedSize)}
                                                disabled={!product.is_in_stock || product.stock_quantity <= 0}
                                                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#cba876] to-[#dfb87f] px-5 py-4 text-sm font-black text-black shadow-lg shadow-[#cba876]/20 transition-all duration-300 hover:from-[#e2be88] hover:to-[#e8c897] hover:shadow-xl hover:shadow-[#cba876]/30 active:scale-[0.98] disabled:opacity-50"
                                            >
                                                <ShoppingCart className="h-4 w-4" />
                                                অর্ডার করুন
                                            </button>
                                        </div>
                                    </div>

                                    {/* Trust & Guarantee Grid */}
                                    <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4 backdrop-blur-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-[#cba876]/15 text-[#cba876]">
                                                <Truck className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <div className="text-xs font-bold text-white">ক্যাশ অন ডেলিভারি</div>
                                                <div className="text-[10px] text-gray-400">পণ্য দেখে মূল্য পরিশোধ</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-[#cba876]/15 text-[#cba876]">
                                                <RotateCcw className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <div className="text-xs font-bold text-white">৭ দিনের রিটার্ন</div>
                                                <div className="text-[10px] text-gray-400">সহজ রিটার্ন সুবিধা</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-[#cba876]/15 text-[#cba876]">
                                                <ShieldCheck className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <div className="text-xs font-bold text-white">১০০% অরিজিনাল</div>
                                                <div className="text-[10px] text-gray-400">অরিজিনাল কোয়ালিটি</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-[#cba876]/15 text-[#cba876]">
                                                <Zap className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <div className="text-xs font-bold text-white">দ্রুত শিপিং</div>
                                                <div className="text-[10px] text-gray-400">সারাদেশে ডেলিভারি</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {bundleItems.length > 0 && (
                                    <div className="mt-8 border-t border-white/10 pt-6">
                                        <h3 className="text-xs font-bold tracking-wider text-gray-300 uppercase">একসাথে কিনলে বিশেষ ছাড়</h3>
                                        <div className="mt-4 grid grid-cols-2 gap-3">
                                            {bundleItems.map((item, i) => {
                                                const itemUrl = `/products/${item.slug}`;
                                                const itemImage = item.image
                                                    ? item.image.startsWith('http')
                                                        ? item.image
                                                        : `/storage/${item.image}`
                                                    : '/images/placeholder.png';
                                                return (
                                                    <Link
                                                        key={i}
                                                        href={itemUrl}
                                                        className="group/bundle flex items-center gap-3 rounded-xl border border-white/10 bg-[#0d0d0d] p-2.5 shadow-sm transition-all duration-200 hover:border-[#cba876]/50 hover:bg-[#121212]"
                                                    >
                                                        <div className="relative h-12 w-12 flex-none overflow-hidden rounded-lg bg-[#050505]">
                                                            <img
                                                                src={itemImage}
                                                                alt={item.name}
                                                                className="h-full w-full object-cover transition-transform group-hover/bundle:scale-105"
                                                            />
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <h4 className="truncate text-xs font-bold text-white transition-colors group-hover/bundle:text-[#cba876]">
                                                                {item.name}
                                                            </h4>
                                                            <div className="text-xs font-black text-[#cba876]">{formatPrice(item.price)}</div>
                                                        </div>
                                                        <div
                                                            className="flex h-7 w-7 flex-none items-center justify-center rounded-full border border-white/10 bg-white/5 text-[#cba876] transition-colors group-hover/bundle:border-[#cba876] group-hover/bundle:bg-[#cba876] group-hover/bundle:text-black"
                                                            aria-label="View Product"
                                                        >
                                                            <Eye className="h-3.5 w-3.5" />
                                                        </div>
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Tabs Section */}
                <section className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-xl">
                        <div className="border-b border-white/10 bg-[#0d0d0d]">
                            <nav className="flex gap-2 px-4 sm:gap-6 sm:px-8" aria-label="Tabs">
                                {[
                                    { id: 'details', label: 'প্রোডাক্ট বিবরণ' },
                                    { id: 'delivery', label: 'ডেলিভারি তথ্য' },
                                    { id: 'reviews', label: 'কাস্টমার রিভিউ', count: reviews.length },
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as 'details' | 'delivery' | 'reviews')}
                                        className={`relative flex items-center gap-2 px-3 py-4 text-xs font-bold tracking-wider uppercase transition-colors duration-200 sm:px-4 sm:text-sm ${
                                            activeTab === tab.id ? 'text-[#cba876]' : 'text-gray-400 hover:text-white'
                                        }`}
                                    >
                                        <span>{tab.label}</span>
                                        {tab.count !== undefined && (
                                            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-extrabold text-white">
                                                {tab.count}
                                            </span>
                                        )}
                                        {activeTab === tab.id && (
                                            <span className="absolute bottom-0 left-0 h-1 w-full rounded-t-full bg-[#cba876] shadow-sm shadow-[#cba876]" />
                                        )}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        <div className="p-6 sm:p-8 lg:p-10">
                            {activeTab === 'details' && (
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="space-y-6">
                                        <h3 className="flex items-center gap-2 text-xl font-bold tracking-tight text-white">
                                            <Sparkles className="h-5 w-5 text-[#cba876]" />
                                            প্রোডাক্ট বিবরণ ও বৈশিষ্ট্য
                                        </h3>
                                        <div
                                            className="rich-description text-base leading-relaxed whitespace-pre-wrap text-gray-300"
                                            dangerouslySetInnerHTML={{ __html: product.description }}
                                        />
                                        <style>{`
                                            .rich-description ul {
                                                list-style-type: disc !important;
                                                padding-left: 1.5rem !important;
                                                margin-top: 0.5rem !important;
                                                margin-bottom: 0.5rem !important;
                                            }
                                            .rich-description ol {
                                                list-style-type: decimal !important;
                                                padding-left: 1.5rem !important;
                                                margin-top: 0.5rem !important;
                                                margin-bottom: 0.5rem !important;
                                            }
                                            .rich-description h1 {
                                                font-size: 1.5rem !important;
                                                font-weight: 800 !important;
                                                margin-top: 1rem !important;
                                                margin-bottom: 0.5rem !important;
                                                color: #ffffff !important;
                                            }
                                            .rich-description h2 {
                                                font-size: 1.25rem !important;
                                                font-weight: 700 !important;
                                                margin-top: 1rem !important;
                                                margin-bottom: 0.5rem !important;
                                                color: #ffffff !important;
                                            }
                                            .rich-description a {
                                                color: #cba876 !important;
                                                text-decoration: underline !important;
                                            }
                                        `}</style>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'delivery' && (
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="max-w-3xl space-y-8">
                                        <div className="space-y-4">
                                            <h3 className="flex items-center gap-2 text-xl font-bold tracking-tight text-white">
                                                <Truck className="h-5 w-5 text-[#cba876]" />
                                                শিপিং ও ডেলিভারি তথ্য
                                            </h3>
                                            <p className="text-base leading-relaxed text-gray-300">
                                                {product.delivery_info ||
                                                    'আমরা দ্রুততম সময়ে সারাদেশে হোম ডেলিভারি দিয়ে থাকি। আপনার প্যাককৃত পণ্যটি নিরাপদে আপনার হাতে পৌঁছানো নিশ্চিত করা হয়।'}
                                            </p>
                                        </div>
                                        <div className="grid gap-6 sm:grid-cols-2">
                                            <div className="rounded-2xl border border-white/10 bg-[#0d0d0d] p-6 shadow-md">
                                                <div className="mb-2 text-xs font-bold tracking-widest text-[#cba876] uppercase">
                                                    ঢাকার ভিতরে ডেলিভারি
                                                </div>
                                                <div className="text-lg font-bold text-white">{product.delivery_dhaka || '১-৩ কর্মদিবস'}</div>
                                            </div>
                                            <div className="rounded-2xl border border-white/10 bg-[#0d0d0d] p-6 shadow-md">
                                                <div className="mb-2 text-xs font-bold tracking-widest text-[#cba876] uppercase">
                                                    ঢাকার বাইরে ডেলিভারি
                                                </div>
                                                <div className="text-lg font-bold text-white">{product.delivery_outside || '৩-৫ কর্মদিবস'}</div>
                                            </div>
                                        </div>
                                        <div className="space-y-4 border-t border-white/10 pt-4">
                                            <h3 className="flex items-center gap-2 text-xl font-bold tracking-tight text-white">
                                                <RotateCcw className="h-5 w-5 text-[#cba876]" />
                                                রিটার্ন ও এক্সচেঞ্জ পলিসি
                                            </h3>
                                            <p className="text-base leading-relaxed text-gray-300">
                                                {product.return_info ||
                                                    'পণ্য হাতে পাওয়ার পর কোনো ত্রুটি পরিলক্ষিত হলে ডেলিভারি ম্যান থাকা অবস্থায় আমাদের সাথে যোগাযোগ করুন। ৭ দিনের মধ্যে ক্যাশ ব্যাক বা এক্সচেঞ্জ করার সুবিধা রয়েছে।'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'reviews' && (
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="flex flex-col gap-10 lg:flex-row">
                                        <div className="lg:w-1/3">
                                            <div className="sticky top-24 rounded-2xl border border-white/10 bg-[#0d0d0d] p-6 text-center shadow-lg">
                                                <div className="text-5xl font-black text-white">{averageRating}</div>
                                                <div className="mt-2 flex justify-center gap-1">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <Star
                                                            key={star}
                                                            className={`h-5 w-5 ${star <= Math.round(parseFloat(averageRating)) ? 'fill-amber-400 text-amber-400' : 'text-gray-600'}`}
                                                        />
                                                    ))}
                                                </div>
                                                <div className="mt-2 text-xs font-bold text-gray-400">
                                                    {reviews.length} টি ভেরিফাইড রিভিউ এর ওপর ভিত্তি করে
                                                </div>

                                                {/* Rating breakdown bars */}
                                                <div className="mt-6 space-y-2 border-t border-white/10 pt-4 text-left">
                                                    {ratingCounts.map(({ star, count, percentage }) => (
                                                        <div key={star} className="flex items-center gap-2 text-xs text-gray-400">
                                                            <span className="w-3 font-bold text-white">{star}</span>
                                                            <Star className="h-3 w-3 flex-none fill-amber-400 text-amber-400" />
                                                            <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                                                                <div
                                                                    className="h-full rounded-full bg-[#cba876]"
                                                                    style={{ width: `${percentage}%` }}
                                                                />
                                                            </div>
                                                            <span className="w-6 text-right font-medium">{count}</span>
                                                        </div>
                                                    ))}
                                                </div>

                                                <button
                                                    onClick={() => setIsReviewFormOpen(!isReviewFormOpen)}
                                                    className="mt-6 w-full rounded-xl border border-[#cba876] px-6 py-3 text-xs font-bold text-[#cba876] transition-all hover:bg-[#cba876] hover:text-black"
                                                >
                                                    {isReviewFormOpen ? 'ফর্ম বন্ধ করুন' : 'রিভিউ প্রদান করুন'}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex-1 space-y-8">
                                            {isReviewFormOpen && (
                                                <div className="animate-in slide-in-from-top-4 rounded-2xl border border-white/10 bg-[#0d0d0d] p-6 shadow-xl duration-300">
                                                    <h3 className="mb-6 text-lg font-bold text-white">আপনার মতামত ও অভিজ্ঞতা লিখুন</h3>
                                                    <form onSubmit={submitReview} className="space-y-4">
                                                        <div className="grid gap-4 sm:grid-cols-2">
                                                            <div className="space-y-2">
                                                                <label className="text-xs font-bold tracking-wider text-gray-300 uppercase">
                                                                    আপনার নাম
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    value={reviewData.name}
                                                                    onChange={(e) => setReviewData('name', e.target.value)}
                                                                    className="w-full rounded-xl border border-white/10 bg-[#050505] px-4 py-2.5 text-sm text-white outline-none focus:border-[#cba876] focus:ring-1 focus:ring-[#cba876]"
                                                                    placeholder="নাম লিখুন"
                                                                />
                                                                {reviewErrors.name && (
                                                                    <p className="mt-1 text-xs font-bold text-red-400">{reviewErrors.name}</p>
                                                                )}
                                                            </div>
                                                            <div className="space-y-2">
                                                                <label className="text-xs font-bold tracking-wider text-gray-300 uppercase">
                                                                    রেটিং দিন
                                                                </label>
                                                                <div className="flex h-10 items-center gap-2">
                                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                                        <button
                                                                            key={star}
                                                                            type="button"
                                                                            onClick={() => setReviewData('rating', star)}
                                                                            className="transition-transform hover:scale-125 focus:outline-none"
                                                                        >
                                                                            <Star
                                                                                className={`h-6 w-6 ${star <= reviewData.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-600'}`}
                                                                            />
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                                {reviewErrors.rating && (
                                                                    <p className="mt-1 text-xs font-bold text-red-400">{reviewErrors.rating}</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-xs font-bold tracking-wider text-gray-300 uppercase">
                                                                আপনার রিভিউ বা মন্তব্য
                                                            </label>
                                                            <textarea
                                                                value={reviewData.comment}
                                                                onChange={(e) => setReviewData('comment', e.target.value)}
                                                                rows={4}
                                                                className="w-full resize-none rounded-xl border border-white/10 bg-[#050505] px-4 py-2.5 text-sm text-white outline-none focus:border-[#cba876] focus:ring-1 focus:ring-[#cba876]"
                                                                placeholder="পণ্যটির গুণগত মান সম্পর্কে কিছু বলুন..."
                                                            />
                                                            {reviewErrors.comment && (
                                                                <p className="mt-1 text-xs font-bold text-red-400">{reviewErrors.comment}</p>
                                                            )}
                                                        </div>
                                                        <button
                                                            type="submit"
                                                            disabled={submittingReview}
                                                            className="w-full rounded-xl bg-[#cba876] px-6 py-3.5 text-sm font-black text-black transition-all hover:bg-[#dfb87f] disabled:opacity-50"
                                                        >
                                                            {submittingReview ? 'পোস্ট করা হচ্ছে...' : 'রিভিউ সাবমিট করুন'}
                                                        </button>
                                                    </form>
                                                </div>
                                            )}

                                            {reviews.length === 0 ? (
                                                <div className="py-12 text-center">
                                                    <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/5 text-gray-500">
                                                        <Star className="h-8 w-8" />
                                                    </div>
                                                    <h4 className="text-lg font-bold text-white">এখনও কোনো রিভিউ নেই</h4>
                                                    <p className="mt-1 text-xs text-gray-400">প্রথম কাস্টমার হিসেবে পণ্যটির রিভিউ প্রদান করুন।</p>
                                                </div>
                                            ) : (
                                                reviews.map((review) => (
                                                    <div
                                                        key={review.id}
                                                        className="animate-in fade-in border-b border-white/10 pb-8 duration-300 last:border-0 last:pb-0"
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#cba876]/15 font-bold text-[#cba876] uppercase">
                                                                    {review.name.charAt(0)}
                                                                </div>
                                                                <div>
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-sm font-bold text-white">{review.name}</span>
                                                                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                                                                            <CheckCircle2 className="h-3 w-3" /> Verified Buyer
                                                                        </span>
                                                                    </div>
                                                                    <div className="text-xs text-gray-500">
                                                                        {new Date(review.created_at).toLocaleDateString('bn-BD', {
                                                                            month: 'long',
                                                                            day: 'numeric',
                                                                            year: 'numeric',
                                                                        })}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-0.5">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <Star
                                                                        key={i}
                                                                        className={`h-3.5 w-3.5 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-600'}`}
                                                                    />
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <p className="mt-4 text-sm leading-relaxed text-gray-300">{review.comment}</p>
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

                {/* Related Products Section */}
                <section className="border-t border-white/10 bg-[#050505] py-10 sm:py-14">
                    <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
                        <div className="mb-8 flex items-center justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">সম্পর্কিত প্রোডাক্টসমূহ</h2>
                                <p className="mt-1 text-xs text-gray-400">আপনার পছন্দ হতে পারে এমন অন্যান্য আইটেম</p>
                            </div>
                            <Link
                                href={route('products.index')}
                                className="text-xs font-bold text-[#cba876] underline underline-offset-4 transition-colors hover:text-[#e2be88]"
                            >
                                সব দেখুন
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-5">
                            {relatedProducts.map((item) => (
                                <ProductCard key={item.slug} product={item} />
                            ))}
                        </div>
                    </div>
                </section>

                <Footer />

                {/* Sticky Mobile Buy Now Bar */}
                <div className="fixed right-0 bottom-0 left-0 z-50 border-t border-white/10 bg-[#0a0a0a]/95 p-3.5 shadow-2xl backdrop-blur-xl sm:hidden">
                    <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0 flex-1">
                            <div className="truncate text-xs font-bold text-white">{product.name}</div>
                            <div className="text-base font-black text-[#cba876]">
                                {getVariantPrice(getSelectedVariant())
                                    ? `৳${parseInt(String(getVariantPrice(getSelectedVariant()))).toLocaleString()}`
                                    : product.price}
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => handleBuyNow(product, quantity, selectedColor, selectedSize)}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#cba876] to-[#dfb87f] px-6 py-3 text-xs font-black text-black shadow-lg active:scale-95"
                        >
                            <ShoppingCart className="h-4 w-4" />
                            অর্ডার করুন
                        </button>
                    </div>
                </div>

                {/* Mobile Spacing for Sticky Bar */}
                <div className="h-20 sm:hidden" />
            </main>
        </>
    );
}
