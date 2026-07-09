import { Link, router } from '@inertiajs/react';
import { BarChart2, Eye, Heart, ShoppingCart, Star } from 'lucide-react';
import { useState } from 'react';

export function ProductCard({ product }: { product: any }) {
    // Determine the product image
    const defaultImage = product.image ? (product.image.startsWith('http') ? product.image : `/storage/${product.image}`) : '/images/placeholder.png';

    // Prepare gallery array including the main image as the first one
    const galleryImages = [
        defaultImage,
        ...(Array.isArray(product.gallery) ? product.gallery : []).map((img: string) => (img.startsWith('http') ? img : `/storage/${img}`)),
    ].filter(Boolean);

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    // Format price safely as "৳ value.00"
    const formatPrice = (price: any) => {
        if (price === null || price === undefined) return '';
        const numericPrice = parseFloat(String(price).replace(/[^0-9.]/g, ''));
        if (isNaN(numericPrice)) return price;
        return `৳ ${numericPrice.toLocaleString('en-BD', { minimumFractionDigits: 2 })}`;
    };

    const hasDiscount =
        product.old_price &&
        parseFloat(String(product.old_price).replace(/[^0-9.]/g, '')) > parseFloat(String(product.price).replace(/[^0-9.]/g, ''));
    const discountPercent = hasDiscount
        ? Math.round(
              ((parseFloat(String(product.old_price).replace(/[^0-9.]/g, '')) - parseFloat(String(product.price).replace(/[^0-9.]/g, ''))) /
                  parseFloat(String(product.old_price).replace(/[^0-9.]/g, ''))) *
                  100,
          )
        : 0;

    const getLabel = (v: any) => (typeof v === 'string' ? v : (v?.label ?? ''));
    const colors = product.variations?.colors || [];
    const sizes = product.variations?.sizes || [];
    const hasColorVariations = colors.filter((c: any) => getLabel(c)?.trim() !== '').length > 0;
    const hasSizeVariations = sizes.filter((s: any) => getLabel(s)?.trim() !== '').length > 0;
    const isVariableProduct = hasColorVariations || hasSizeVariations;

    const handleBuyNow = (e: React.MouseEvent) => {
        e.preventDefault();
        router.post(route('cart.buyNow'), {
            product_id: product.id,
            slug: product.slug,
            name: product.name,
            price: String(product.price),
            image: product.image || '',
            quantity: 1,
            color: null,
            size: null,
        });
    };

    return (
        <div
            className="group relative flex h-full flex-col overflow-hidden rounded-[10px] border border-[#1a1a1a] bg-[#050505] shadow-md transition-all duration-300 hover:border-[#cba876]/40"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
                setIsHovered(false);
                setCurrentImageIndex(0);
            }}
        >
            {/* Image Container */}
            <div className="relative aspect-[1/1] w-full overflow-hidden bg-[#0d0d0d] select-none">
                <Link href={`/products/${product.slug}`} className="block h-full w-full">
                    <img
                        src={galleryImages[currentImageIndex]}
                        alt={product.name}
                        className="h-full w-full object-cover transition-all duration-500"
                    />
                </Link>

                {/* Badges */}
                {hasDiscount && (
                    <div className="absolute top-3 left-3 z-20 rounded-sm bg-[#e43a53] px-2.5 py-1 text-[10px] font-black tracking-wider text-white uppercase shadow-md">
                        -{discountPercent}%
                    </div>
                )}

                {/* Rating Badge */}
                <div className="absolute bottom-3 left-3 z-20 flex items-center rounded-sm border border-white/5 bg-black/75 px-2 py-0.5 text-[10px] font-bold text-gray-200 shadow-sm backdrop-blur-sm">
                    <Star className="mr-1 h-3 w-3 fill-[#fbbf24] text-[#fbbf24]" />
                    <span>5.0</span>
                </div>

                {/* Right Side Hover Actions (Compare, Quick View, Wishlist) */}
                <div className="absolute top-3 right-3 z-20 flex flex-col space-y-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <button
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/85 text-white shadow-md transition-all duration-200 hover:bg-[#cba876] hover:text-black"
                        title="Add to Wishlist"
                    >
                        <Heart className="h-4 w-4" />
                    </button>
                    <button
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/85 text-white shadow-md transition-all duration-200 hover:bg-[#cba876] hover:text-black"
                        title="Compare"
                    >
                        <BarChart2 className="h-4 w-4" />
                    </button>
                    <Link
                        href={`/products/${product.slug}`}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/85 text-white shadow-md transition-all duration-200 hover:bg-[#cba876] hover:text-black"
                        title="Quick View"
                    >
                        <Eye className="h-4 w-4" />
                    </Link>
                </div>

                {/* Gallery Slide Indicator Dots (Visible on hover at bottom center) */}
                {galleryImages.length > 1 && (
                    <div className="absolute right-3 bottom-3 z-20 flex items-center space-x-1.5 rounded-full bg-black/60 px-2 py-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        {galleryImages.map((_, idx) => (
                            <button
                                key={idx}
                                onMouseEnter={() => setCurrentImageIndex(idx)}
                                className={`h-1.5 w-1.5 rounded-full transition-all duration-200 ${
                                    currentImageIndex === idx ? 'scale-125 bg-[#cba876]' : 'bg-white/40'
                                }`}
                                aria-label={`View image ${idx + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div className="flex flex-grow flex-col p-3 pt-2 text-left">
                {/* Title */}
                <Link
                    href={`/products/${product.slug}`}
                    className="mb-0.5 line-clamp-2 text-xs leading-snug font-medium text-white transition-colors hover:text-[#cba876] md:text-sm"
                >
                    {product.name}
                </Link>

                {/* Category name */}
                {product.category && (
                    <span className="mb-1 block text-[9px] font-bold tracking-wider text-gray-400 uppercase">{product.category.name}</span>
                )}

                {/* Stock Status */}
                <p className="mb-1.5 flex items-center text-[10px] font-semibold text-emerald-500">
                    <span className="mr-1.5 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500"></span>
                    In Stock
                </p>

                {/* Price block */}
                <div className="mb-2.5 flex items-center space-x-2">
                    {hasDiscount ? (
                        <>
                            <span className="text-sm font-black text-white md:text-base">{formatPrice(product.price)}</span>
                            <span className="text-[10px] text-gray-500 line-through md:text-xs">{formatPrice(product.old_price)}</span>
                        </>
                    ) : (
                        <span className="text-sm font-black text-white md:text-base">{formatPrice(product.price)}</span>
                    )}
                </div>

                {/* Buy Now / View Details Button */}
                {isVariableProduct ? (
                    <Link
                        href={`/products/${product.slug}`}
                        className="mt-auto flex w-full items-center justify-center rounded-[5px] border border-[#cba876] py-2 text-[10px] font-bold tracking-wider text-white uppercase shadow-md transition-all duration-200 hover:bg-[#cba876] hover:!text-black"
                    >
                        <Eye className="mr-1.5 h-3.5 w-3.5" />
                        View Details
                    </Link>
                ) : (
                    <button
                        onClick={handleBuyNow}
                        className="mt-auto flex w-full items-center justify-center rounded-[5px] border border-[#cba876] py-2 text-[10px] font-bold tracking-wider text-white uppercase shadow-md transition-all duration-200 hover:bg-[#cba876] hover:!text-black"
                    >
                        <ShoppingCart className="mr-1.5 h-3.5 w-3.5" />
                        Buy Now
                    </button>
                )}
            </div>
        </div>
    );
}
