import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Check, Eye, Heart, ShoppingBag, ShoppingCart, Star } from 'lucide-react';
import { useState } from 'react';

import { StorefrontFooter as Footer } from '@/components/storefront-footer';
import { Header } from '../../themes/wildtannery/components/Header';

import { ProductCard } from '../../themes/wildtannery/components/ProductCard';

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

    const [selectedColor, setSelectedColor] = useState(getLabel(product.variations.colors[0] ?? ''));
    const [selectedSize, setSelectedSize] = useState(getLabel(product.variations.sizes[0] ?? ''));
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState(() => {
        return getImage(product.variations.colors[0]) ?? getImage(product.variations.sizes[0]) ?? product.image;
    });
    const [activeTab, setActiveTab] = useState<'details' | 'delivery' | 'reviews'>('details');
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);

    const selectColor = (label: string, image: string | null) => {
        setSelectedColor(label);
        if (image) {
            setActiveImage(image);
        }
    };

    const selectSize = (label: string, image: string | null) => {
        setSelectedSize(label);
        if (image) {
            setActiveImage(image);
        }
    };

    const variationImages = [...product.variations.colors.map(getImage), ...product.variations.sizes.map(getImage)].filter((src): src is string =>
        Boolean(src),
    );

    const allImages = Array.from(new Set([product.image, ...(product.gallery || []), ...variationImages]));

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

    const submitReview = (e: React.FormEvent) => {
        e.preventDefault();
        postReview(route('products.reviews.store', product.id), {
            preserveScroll: true,
            onSuccess: () => {
                setIsReviewFormOpen(false);
                resetReview();
                setSuccessMessage('Thank you! Your review has been posted.');
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

    const handleAddToCart = (
        item: { id: number; slug: string; name: string; price: string; image: string },
        qty: number = 1,
        color?: string,
        size?: string,
    ) => {
        const variant = getSelectedVariant();
        router.post(
            route('cart.add'),
            {
                product_id: item.id,
                product_variant_id: variant?.id,
                slug: item.slug,
                name: item.name,
                price: variant?.price ? `৳${variant.price.toLocaleString()}` : item.price,
                image: item.image,
                quantity: qty,
                color,
                size,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setSuccessMessage('Successfully added to cart!');
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
        router.post(route('cart.buyNow'), {
            product_id: item.id,
            product_variant_id: variant?.id,
            slug: item.slug,
            name: item.name,
            price: variant?.price ? `৳${variant.price.toLocaleString()}` : item.price,
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
                        <div className="flex items-center gap-3 rounded-md bg-[#cba876] px-6 py-4 font-bold text-black shadow-2xl">
                            <Check className="h-5 w-5" />
                            {successMessage}
                        </div>
                    </div>
                )}

                <section className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
                    <div className="mb-6 flex items-center gap-3 text-sm font-medium text-gray-400">
                        <Link href={route('home')} className="inline-flex items-center gap-2 transition-colors hover:text-[#cba876]">
                            <ArrowLeft className="h-4 w-4" />
                            Back to home
                        </Link>
                        <span className="text-gray-700">/</span>
                        <span className="text-[#cba876]">{product.name}</span>
                    </div>

                    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
                        <div className="flex flex-col-reverse gap-4 lg:flex-row">
                            <div className="grid grid-cols-4 gap-3 lg:flex lg:w-24 lg:flex-col lg:gap-4">
                                {allImages.map((image, index) => (
                                    <button
                                        key={`${product.slug}-${index}`}
                                        onClick={() => setActiveImage(image)}
                                        className={`overflow-hidden rounded-md border transition-all hover:scale-[1.02] focus:outline-none ${
                                            activeImage === image
                                                ? 'border-[#cba876] shadow-md ring-1 shadow-[#cba876]/10 ring-[#cba876]'
                                                : 'border-white/5 bg-[#0a0a0a] shadow-sm grayscale-[0.5] hover:grayscale-0'
                                        }`}
                                    >
                                        <img
                                            src={image}
                                            alt={`${product.name} thumbnail ${index}`}
                                            className="aspect-square h-full w-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>

                            <div className="flex-1">
                                <div className="overflow-hidden rounded-lg border border-white/5 bg-[#0a0a0a] shadow-sm">
                                    <div className="relative aspect-square bg-[#0d0d0d]">
                                        <img
                                            src={activeImage}
                                            alt={product.name}
                                            className="animate-in fade-in h-full w-full object-cover duration-500"
                                        />

                                        {product.discount_text && (
                                            <span className="absolute top-4 left-4 rounded-md bg-[#cba876] px-4 py-2 text-sm font-bold text-black shadow-lg">
                                                {product.discount_text}
                                            </span>
                                        )}

                                        <button
                                            type="button"
                                            className="absolute top-4 right-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/5 bg-[#0a0a0a]/90 text-white shadow-lg backdrop-blur hover:text-[#cba876]"
                                            aria-label="Add to wishlist"
                                        >
                                            <Heart className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="rounded-lg border border-white/5 bg-[#0a0a0a] p-6 shadow-sm sm:p-8">
                                <div className="mb-3 inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-[#cba876] uppercase">
                                    New arrival
                                </div>

                                <h1 className="text-3xl leading-tight font-bold tracking-tight text-white sm:text-4xl">{product.name}</h1>

                                <div className="mt-4 flex flex-wrap items-center gap-3">
                                    <div className="text-3xl font-black text-[#cba876] sm:text-4xl">
                                        {getSelectedVariant()?.price ? `৳${getSelectedVariant()?.price.toLocaleString()}` : product.price}
                                    </div>
                                    {product.old_price && !getSelectedVariant()?.price && (
                                        <div className="flex items-center gap-3">
                                            <div className="text-lg font-semibold text-slate-500 line-through">{product.old_price}</div>
                                            {product.discount_text && (
                                                <span className="rounded-md border border-[#cba876]/20 bg-[#cba876]/10 px-3 py-1 text-xs font-bold text-[#cba876]">
                                                    {product.discount_text}
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
                                            <span className="inline-flex items-center gap-1.5 rounded-full border border-green-500/20 bg-green-950/40 px-3 py-1 text-xs font-bold text-emerald-400">
                                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                                                In Stock
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/20 bg-red-950/40 px-3 py-1 text-xs font-bold text-red-400">
                                                <div className="h-1.5 w-1.5 rounded-full bg-red-500"></div>
                                                Out of Stock
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-4 flex items-center gap-2 text-sm text-gray-400">
                                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                    <span>
                                        {averageRating} rating from {reviews.length} verified buyers
                                    </span>
                                </div>

                                <div
                                    className="mt-5 line-clamp-2 max-w-2xl text-base leading-7 text-gray-300 whitespace-pre-wrap rich-description"
                                    dangerouslySetInnerHTML={{ __html: product.description }}
                                />

                                {(product.variations.colors.filter((c) => {
                                    const l = getLabel(c);
                                    return l && l.trim();
                                }).length > 0 ||
                                    product.variations.sizes.filter((s) => {
                                        const l = getLabel(s);
                                        return l && l.trim();
                                    }).length > 0) && (
                                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                                        {product.variations.colors.filter((c) => {
                                            const l = getLabel(c);
                                            return l && l.trim();
                                        }).length > 0 && (
                                            <div>
                                                <div className="text-sm font-semibold text-white">Color</div>
                                                <div className="mt-3 flex flex-wrap gap-2">
                                                    {product.variations.colors.map((color) => {
                                                        const label = getLabel(color);
                                                        const img = getImage(color);
                                                        if (!label || !label.trim()) return null;
                                                        return (
                                                            <button
                                                                key={label}
                                                                type="button"
                                                                className={`rounded-md border px-4 py-2 text-sm font-medium transition ${
                                                                    selectedColor === label
                                                                        ? 'border-[#cba876] bg-[#cba876] font-bold text-black'
                                                                        : 'border-white/10 bg-[#0d0d0d] text-gray-300 hover:border-[#cba876] hover:text-white'
                                                                }`}
                                                                onClick={() => selectColor(label, img)}
                                                            >
                                                                {img ? (
                                                                    <img
                                                                        src={img}
                                                                        alt={label}
                                                                        className="inline-block h-4 w-4 rounded object-cover"
                                                                    />
                                                                ) : (
                                                                    label
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
                                                <div className="text-sm font-semibold text-white">Size</div>
                                                <div className="mt-3 flex flex-wrap gap-2">
                                                    {product.variations.sizes.map((size) => {
                                                        const label = getLabel(size);
                                                        const img = getImage(size);
                                                        if (!label || !label.trim()) return null;
                                                        return (
                                                            <button
                                                                key={label}
                                                                type="button"
                                                                className={`rounded-md border px-4 py-2 text-sm font-medium transition ${
                                                                    selectedSize === label
                                                                        ? 'border-[#cba876] bg-[#cba876] font-bold text-black'
                                                                        : 'border-white/10 bg-[#0d0d0d] text-gray-300 hover:border-[#cba876] hover:text-white'
                                                                }`}
                                                                onClick={() => selectSize(label, img)}
                                                            >
                                                                {img ? (
                                                                    <img
                                                                        src={img}
                                                                        alt={label}
                                                                        className="inline-block h-4 w-4 rounded object-cover"
                                                                    />
                                                                ) : (
                                                                    label
                                                                )}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="mt-6 flex flex-col gap-3">
                                    <div className="flex gap-3 sm:hidden">
                                        <div className="inline-flex items-center rounded-full border border-white/10 bg-[#0d0d0d] px-2 py-1">
                                            <button
                                                type="button"
                                                onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                                                className="inline-flex h-10 min-h-[2.5rem] w-10 items-center justify-center rounded-full text-lg font-semibold text-gray-300 hover:bg-white/10 disabled:opacity-50"
                                                aria-label="Decrease quantity"
                                                disabled={!product.is_in_stock || product.stock_quantity <= 0}
                                            >
                                                –
                                            </button>

                                            <span className="mx-3 min-w-[2rem] text-center text-base font-semibold text-white">{quantity}</span>

                                            <button
                                                type="button"
                                                onClick={() => setQuantity((current) => Math.min(product.stock_quantity, current + 1))}
                                                className="inline-flex h-10 min-h-[2.5rem] w-10 items-center justify-center rounded-full text-lg font-semibold text-gray-300 hover:bg-white/10 disabled:opacity-50"
                                                aria-label="Increase quantity"
                                                disabled={!product.is_in_stock || product.stock_quantity <= 0 || quantity >= product.stock_quantity}
                                            >
                                                +
                                            </button>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => handleAddToCart(product, quantity, selectedColor, selectedSize)}
                                            disabled={!product.is_in_stock || product.stock_quantity <= 0}
                                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-[#cba876] px-6 py-4 text-sm font-bold text-black transition-all hover:bg-[#b89563] disabled:opacity-50"
                                        >
                                            <ShoppingBag className="h-4 w-4" />
                                            {product.is_in_stock && product.stock_quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
                                        </button>
                                    </div>

                                    <div className="hidden sm:flex sm:items-center">
                                        <div className="inline-flex items-center rounded-full border border-white/10 bg-[#0d0d0d] px-2 py-1">
                                            <button
                                                type="button"
                                                onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                                                className="inline-flex h-10 min-h-[2.5rem] w-10 items-center justify-center rounded-full text-lg font-semibold text-gray-300 hover:bg-white/10 disabled:opacity-50"
                                                aria-label="Decrease quantity"
                                                disabled={!product.is_in_stock || product.stock_quantity <= 0}
                                            >
                                                –
                                            </button>

                                            <span className="mx-3 min-w-[2rem] text-center text-base font-semibold text-white">{quantity}</span>

                                            <button
                                                type="button"
                                                onClick={() => setQuantity((current) => Math.min(product.stock_quantity, current + 1))}
                                                className="inline-flex h-10 min-h-[2.5rem] w-10 items-center justify-center rounded-full text-lg font-semibold text-gray-300 hover:bg-white/10 disabled:opacity-50"
                                                aria-label="Increase quantity"
                                                disabled={!product.is_in_stock || product.stock_quantity <= 0 || quantity >= product.stock_quantity}
                                            >
                                                +
                                            </button>
                                        </div>

                                        <div className="flex w-full flex-col gap-2 sm:ml-3 sm:flex-1 sm:flex-row">
                                            <button
                                                type="button"
                                                onClick={() => handleAddToCart(product, quantity, selectedColor, selectedSize)}
                                                disabled={!product.is_in_stock || product.stock_quantity <= 0}
                                                className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-[#cba876] px-6 py-4 text-sm font-bold text-white transition-all hover:bg-[#cba876] hover:!text-black disabled:opacity-50 sm:w-1/2"
                                            >
                                                <ShoppingBag className="h-4 w-4" />
                                                Add to Cart
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => handleBuyNow(product, quantity, selectedColor, selectedSize)}
                                                disabled={!product.is_in_stock || product.stock_quantity <= 0}
                                                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#cba876] px-6 py-4 text-sm font-bold text-black transition-all hover:bg-[#b89563] disabled:opacity-50 sm:w-1/2"
                                            >
                                                <ShoppingCart className="h-4 w-4" />
                                                Buy Now
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => handleBuyNow(product, quantity, selectedColor, selectedSize)}
                                        disabled={!product.is_in_stock || product.stock_quantity <= 0}
                                        className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#cba876] px-6 py-4 text-sm font-bold text-black transition-all hover:bg-[#b89563] disabled:opacity-50 sm:hidden"
                                    >
                                        <ShoppingCart className="h-4 w-4" />
                                        Buy Now
                                    </button>
                                </div>

                                {bundleItems.length > 0 && (
                                    <div className="mt-8 border-t border-white/5 pt-8">
                                        <h3 className="text-sm font-bold tracking-wider text-white uppercase">Frequently Bought Together</h3>
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
                                                        className="group/bundle flex items-center gap-3 rounded-lg border border-white/5 bg-[#0d0d0d] p-2 shadow-sm transition-all hover:border-white/10 hover:shadow-md"
                                                    >
                                                        <div className="relative h-12 w-12 flex-none overflow-hidden rounded-md bg-[#050505]">
                                                            <img src={itemImage} alt={item.name} className="h-full w-full object-cover" />
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <h4 className="truncate text-[10px] font-bold text-white transition-colors group-hover/bundle:text-[#cba876]">
                                                                {item.name}
                                                            </h4>
                                                            <div className="text-[10px] font-black text-[#cba876]">{formatPrice(item.price)}</div>
                                                        </div>
                                                        <div
                                                            className="flex h-8 w-8 flex-none items-center justify-center rounded-full border border-white/10 bg-white/5 text-[#cba876] transition-colors group-hover/bundle:border-[#cba876] group-hover/bundle:bg-[#cba876] group-hover/bundle:text-black"
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

                <section className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-lg border border-white/5 bg-[#0a0a0a] shadow-sm">
                        <div className="border-b border-white/5 bg-[#0d0d0d]">
                            <nav className="flex gap-8 px-6 sm:px-8" aria-label="Tabs">
                                {['details', 'delivery', 'reviews'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab as 'details' | 'delivery' | 'reviews')}
                                        className={`relative py-4 text-sm font-bold tracking-wider uppercase transition-colors ${
                                            activeTab === tab ? 'text-[#cba876]' : 'text-gray-400 hover:text-white'
                                        }`}
                                    >
                                        {tab === 'details' ? 'Product Details' : tab === 'delivery' ? 'Delivery' : 'Reviews'}
                                        {activeTab === tab && <span className="absolute bottom-0 left-0 h-0.5 w-full bg-[#cba876]" />}
                                        {tab === 'reviews' && (
                                            <span className="ml-2 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold text-gray-300">
                                                {reviews.length}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        <div className="p-6 sm:p-8 lg:p-10">
                            {activeTab === 'details' && (
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                                    <div className="space-y-12">
                                        <div className="space-y-6">
                                            <h3 className="text-xl font-bold tracking-tight text-white">Description</h3>
                                            <div
                                                className="text-base leading-8 text-gray-300 whitespace-pre-wrap rich-description"
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
                                                    color: #3b82f6 !important;
                                                    text-decoration: underline !important;
                                                }
                                            `}</style>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'delivery' && (
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                                    <div className="max-w-3xl space-y-8">
                                        <div className="space-y-4">
                                            <h3 className="text-xl font-bold tracking-tight text-white">Shipping & Delivery</h3>
                                            <p className="text-base leading-8 text-gray-300">
                                                {product.delivery_info ||
                                                    'We offer fast and reliable shipping across Bangladesh. All orders are carefully packaged to ensure your items arrive in perfect condition.'}
                                            </p>
                                        </div>
                                        <div className="grid gap-6 sm:grid-cols-2">
                                            <div className="rounded-xl border border-white/5 bg-[#0d0d0d] p-6 shadow-sm">
                                                <div className="mb-3 text-xs font-bold tracking-widest text-[#cba876] uppercase">Inside Dhaka</div>
                                                <div className="text-sm font-semibold text-white">{product.delivery_dhaka || '1-3 Working Days'}</div>
                                            </div>
                                            <div className="rounded-xl border border-white/5 bg-[#0d0d0d] p-6 shadow-sm">
                                                <div className="mb-3 text-xs font-bold tracking-widest text-[#cba876] uppercase">Outside Dhaka</div>
                                                <div className="text-sm font-semibold text-white">
                                                    {product.delivery_outside || '3-5 Working Days'}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <h3 className="text-xl font-bold tracking-tight text-white">Returns & Exchanges</h3>
                                            <p className="text-base leading-8 text-gray-300">
                                                {product.return_info ||
                                                    'If you are not satisfied with your purchase, you can return or exchange the product within 7 days of delivery, provided it is in its original condition and packaging.'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'reviews' && (
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                                    <div className="flex flex-col gap-10 lg:flex-row">
                                        <div className="lg:w-1/3">
                                            <div className="sticky top-24 rounded-lg border border-white/5 bg-[#0d0d0d] p-8 text-center">
                                                <div className="text-5xl font-black text-white">{averageRating}</div>
                                                <div className="mt-2 flex justify-center gap-1">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <Star
                                                            key={star}
                                                            className={`h-5 w-5 ${star <= Math.round(parseFloat(averageRating)) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                                                        />
                                                    ))}
                                                </div>
                                                <div className="mt-2 text-sm font-medium text-gray-400">Based on {reviews.length} reviews</div>
                                                <button
                                                    onClick={() => setIsReviewFormOpen(!isReviewFormOpen)}
                                                    className="mt-6 w-full rounded-md border border-[#cba876] px-6 py-3 text-sm font-bold text-[#cba876] transition-all hover:bg-[#cba876] hover:!text-black"
                                                >
                                                    {isReviewFormOpen ? 'Cancel Review' : 'Write a Review'}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex-1 space-y-8">
                                            {isReviewFormOpen && (
                                                <div className="animate-in slide-in-from-top-4 rounded-lg border border-white/5 bg-[#0d0d0d] p-6 duration-500">
                                                    <h3 className="mb-6 text-lg font-bold text-white">Write your review</h3>
                                                    <form onSubmit={submitReview} className="space-y-4">
                                                        <div className="grid gap-4 sm:grid-cols-2">
                                                            <div className="space-y-2">
                                                                <label className="text-xs font-black tracking-widest text-gray-400 uppercase">
                                                                    Your Name
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    value={reviewData.name}
                                                                    onChange={(e) => setReviewData('name', e.target.value)}
                                                                    className="w-full rounded-md border border-white/10 bg-[#050505] px-4 py-2 text-sm text-white outline-none focus:border-[#cba876] focus:ring-0"
                                                                    placeholder="Enter your name"
                                                                />
                                                                {reviewErrors.name && (
                                                                    <p className="mt-1 text-xs font-bold text-red-500 uppercase">
                                                                        {reviewErrors.name}
                                                                    </p>
                                                                )}
                                                            </div>
                                                            <div className="space-y-2">
                                                                <label className="text-xs font-black tracking-widest text-gray-400 uppercase">
                                                                    Rating
                                                                </label>
                                                                <div className="flex h-10 items-center gap-2">
                                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                                        <button
                                                                            key={star}
                                                                            type="button"
                                                                            onClick={() => setReviewData('rating', star)}
                                                                            className="transition-transform hover:scale-110 focus:outline-none"
                                                                        >
                                                                            <Star
                                                                                className={`h-6 w-6 ${star <= reviewData.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
                                                                            />
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                                {reviewErrors.rating && (
                                                                    <p className="mt-1 text-xs font-bold text-red-500 uppercase">
                                                                        {reviewErrors.rating}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-xs font-black tracking-widest text-gray-400 uppercase">
                                                                Your Comment
                                                            </label>
                                                            <textarea
                                                                value={reviewData.comment}
                                                                onChange={(e) => setReviewData('comment', e.target.value)}
                                                                rows={4}
                                                                className="w-full resize-none rounded-md border border-white/10 bg-[#050505] px-4 py-2 text-sm text-white outline-none focus:border-[#cba876] focus:ring-0"
                                                                placeholder="Share your thoughts about this product..."
                                                            />
                                                            {reviewErrors.comment && (
                                                                <p className="mt-1 text-xs font-bold text-red-500 uppercase">
                                                                    {reviewErrors.comment}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <button
                                                            type="submit"
                                                            disabled={submittingReview}
                                                            className="w-full rounded-md bg-[#cba876] px-6 py-3 text-sm font-bold text-black transition-all hover:bg-[#b89563] disabled:opacity-50"
                                                        >
                                                            {submittingReview ? 'Posting...' : 'Post Review'}
                                                        </button>
                                                    </form>
                                                </div>
                                            )}

                                            {reviews.length === 0 ? (
                                                <div className="py-10 text-center">
                                                    <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/5 text-gray-600">
                                                        <Star className="h-8 w-8" />
                                                    </div>
                                                    <h4 className="text-lg font-bold text-white">No reviews yet</h4>
                                                    <p className="mt-1 text-sm text-gray-400">Be the first to share your thoughts on this product.</p>
                                                </div>
                                            ) : (
                                                reviews.map((review) => (
                                                    <div
                                                        key={review.id}
                                                        className="animate-in fade-in border-b border-white/5 pb-8 duration-500 last:border-0 last:pb-0"
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 font-bold text-[#cba876] uppercase">
                                                                    {review.name.charAt(0)}
                                                                </div>
                                                                <div>
                                                                    <div className="text-sm font-bold text-white">{review.name}</div>
                                                                    <div className="text-xs text-gray-500">
                                                                        {new Date(review.created_at).toLocaleDateString('en-US', {
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
                                                                        className={`h-3.5 w-3.5 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
                                                                    />
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <p className="mt-4 text-sm leading-7 text-gray-300">{review.comment}</p>
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

                <section className="border-t border-white/5 bg-[#050505] py-8 sm:py-10 lg:py-12">
                    <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
                        <div className="mb-6 flex items-center justify-between gap-4">
                            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Related Products</h2>
                            <Link
                                href={route('products.index')}
                                className="text-sm font-semibold text-[#cba876] transition-colors hover:text-[#b89563]"
                            >
                                View all
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
                            {relatedProducts.map((item) => (
                                <ProductCard key={item.slug} product={item} />
                            ))}
                        </div>
                    </div>
                </section>

                <Footer />

                {/* Sticky Mobile Buy Now Bar */}
                <div className="fixed right-0 bottom-0 left-0 z-50 border-t border-white/10 bg-[#0a0a0a]/90 p-4 backdrop-blur-md sm:hidden">
                    <div className="flex items-center justify-between gap-4">
                        <div className="min-w-0">
                            <div className="truncate text-sm font-bold text-white">{product.name}</div>
                            <div className="text-lg font-black text-[#cba876]">{product.price}</div>
                        </div>
                        <button
                            type="button"
                            onClick={() => handleBuyNow(product, quantity, selectedColor, selectedSize)}
                            className="inline-flex items-center justify-center gap-2 rounded-md bg-[#cba876] px-8 py-3.5 text-sm font-bold text-black shadow-lg active:scale-95"
                        >
                            <ShoppingCart className="h-4 w-4" />
                            Buy Now
                        </button>
                    </div>
                </div>

                {/* Mobile Spacing for Sticky Bar */}
                <div className="h-24 sm:hidden" />
            </main>
        </>
    );
}
