import { Link, router } from '@inertiajs/react';
import { Star, Eye, ShoppingCart, Heart, BarChart2 } from 'lucide-react';
import { useState } from 'react';

export function ProductCard({ product }: { product: any }) {
    // Determine the product image
    const defaultImage = product.image 
        ? (product.image.startsWith('http') ? product.image : `/storage/${product.image}`) 
        : '/images/placeholder.png';
        
    // Prepare gallery array including the main image as the first one
    const galleryImages = [
        defaultImage,
        ...(Array.isArray(product.gallery) ? product.gallery : []).map((img: string) => img.startsWith('http') ? img : `/storage/${img}`)
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

    const hasDiscount = product.old_price && parseFloat(String(product.old_price).replace(/[^0-9.]/g, '')) > parseFloat(String(product.price).replace(/[^0-9.]/g, ''));
    const discountPercent = hasDiscount 
        ? Math.round(((parseFloat(String(product.old_price).replace(/[^0-9.]/g, '')) - parseFloat(String(product.price).replace(/[^0-9.]/g, ''))) / parseFloat(String(product.old_price).replace(/[^0-9.]/g, ''))) * 100) 
        : 0;

    const getLabel = (v: any) => (typeof v === 'string' ? v : v?.label ?? '');
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
            size: null
        });
    };

    return (
        <div 
            className="group flex flex-col bg-[#050505] rounded-[10px] overflow-hidden relative shadow-md border border-[#1a1a1a] hover:border-[#cba876]/40 transition-all duration-300 h-full"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
                setIsHovered(false);
                setCurrentImageIndex(0);
            }}
        >
            {/* Image Container */}
            <div className="relative aspect-[1/1] w-full overflow-hidden bg-[#0d0d0d] select-none">
                <Link href={`/products/${product.slug}`} className="block w-full h-full">
                    <img 
                        src={galleryImages[currentImageIndex]} 
                        alt={product.name} 
                        className="w-full h-full object-cover transition-all duration-500"
                    />
                </Link>

                {/* Badges */}
                {hasDiscount && (
                    <div className="absolute top-3 left-3 bg-[#e43a53] text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-sm z-20 shadow-md">
                        -{discountPercent}%
                    </div>
                )}
                
                {/* Rating Badge */}
                <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-sm text-gray-200 text-[10px] font-bold px-2 py-0.5 rounded-sm flex items-center shadow-sm z-20 border border-white/5">
                    <Star className="w-3 h-3 fill-[#fbbf24] text-[#fbbf24] mr-1" />
                    <span>5.0</span>
                </div>

                {/* Right Side Hover Actions (Compare, Quick View, Wishlist) */}
                <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                    <button 
                        className="w-9 h-9 bg-black/85 hover:bg-[#cba876] hover:text-black text-white rounded-full flex items-center justify-center shadow-md transition-all duration-200 border border-white/10"
                        title="Add to Wishlist"
                    >
                        <Heart className="w-4 h-4" />
                    </button>
                    <button 
                        className="w-9 h-9 bg-black/85 hover:bg-[#cba876] hover:text-black text-white rounded-full flex items-center justify-center shadow-md transition-all duration-200 border border-white/10"
                        title="Compare"
                    >
                        <BarChart2 className="w-4 h-4" />
                    </button>
                    <Link 
                        href={`/products/${product.slug}`}
                        className="w-9 h-9 bg-black/85 hover:bg-[#cba876] hover:text-black text-white rounded-full flex items-center justify-center shadow-md transition-all duration-200 border border-white/10"
                        title="Quick View"
                    >
                        <Eye className="w-4 h-4" />
                    </Link>
                </div>

                {/* Gallery Slide Indicator Dots (Visible on hover at bottom center) */}
                {galleryImages.length > 1 && (
                    <div className="absolute bottom-3 right-3 flex items-center space-x-1.5 z-20 bg-black/60 px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {galleryImages.map((_, idx) => (
                            <button
                                key={idx}
                                onMouseEnter={() => setCurrentImageIndex(idx)}
                                className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                                    currentImageIndex === idx ? 'bg-[#cba876] scale-125' : 'bg-white/40'
                                }`}
                                aria-label={`View image ${idx + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div className="p-3 pt-2 flex flex-col flex-grow text-left">
                {/* Title */}
                <Link 
                    href={`/products/${product.slug}`} 
                    className="text-white font-medium text-xs md:text-sm hover:text-[#cba876] transition-colors mb-0.5 line-clamp-2 leading-snug"
                >
                    {product.name}
                </Link>

                {/* Category name */}
                {product.category && (
                    <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold mb-1 block">
                        {product.category.name}
                    </span>
                )}

                {/* Stock Status */}
                <p className="text-[10px] font-semibold text-emerald-500 mb-1.5 flex items-center">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block mr-1.5 animate-pulse"></span>
                    In Stock
                </p>

                {/* Price block */}
                <div className="flex items-center space-x-2 mb-2.5">
                    {hasDiscount ? (
                        <>
                            <span className="text-white text-sm md:text-base font-black">{formatPrice(product.price)}</span>
                            <span className="text-gray-500 text-[10px] md:text-xs line-through">{formatPrice(product.old_price)}</span>
                        </>
                    ) : (
                        <span className="text-white text-sm md:text-base font-black">{formatPrice(product.price)}</span>
                    )}
                </div>

                {/* Buy Now / View Details Button */}
                {isVariableProduct ? (
                    <Link 
                        href={`/products/${product.slug}`}
                        className="w-full mt-auto border border-[#cba876] text-white hover:bg-[#cba876] hover:!text-black font-bold uppercase tracking-wider text-[10px] py-2 rounded-[5px] transition-all duration-200 shadow-md flex items-center justify-center"
                    >
                        <Eye className="w-3.5 h-3.5 mr-1.5" />
                        View Details
                    </Link>
                ) : (
                    <button 
                        onClick={handleBuyNow}
                        className="w-full mt-auto border border-[#cba876] text-white hover:bg-[#cba876] hover:!text-black font-bold uppercase tracking-wider text-[10px] py-2 rounded-[5px] transition-all duration-200 shadow-md flex items-center justify-center"
                    >
                        <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
                        Buy Now
                    </button>
                )}
            </div>
        </div>
    );
}
