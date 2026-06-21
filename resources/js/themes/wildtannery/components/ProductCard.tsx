import { Link } from '@inertiajs/react';
import { Star, Eye, ShoppingCart } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

export function ProductCard({ product }: { product: any }) {
    // Determine the product image
    const defaultImage = product.image 
        ? (product.image.startsWith('http') ? product.image : `/storage/${product.image}`) 
        : '/images/placeholder.png';
        
    // Prepare gallery array including the main image as the first one
    const galleryImages = [
        defaultImage,
        ...(Array.isArray(product.gallery) ? product.gallery : []).map((img: string) => img.startsWith('http') ? img : `/storage/${img}`)
    ];

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHovering, setIsHovering] = useState(false);
    const hoverIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Format price safely
    const formatPrice = (price: number) => {
        if (!price || isNaN(price)) return '';
        return new Intl.NumberFormat('en-BD', { style: 'currency', currency: 'BDT', minimumFractionDigits: 2 }).format(price).replace('BDT', 'Tk').trim();
    };

    const hasDiscount = product.old_price && product.old_price > product.price;
    const discountPercent = hasDiscount 
        ? Math.round(((product.old_price - product.price) / product.old_price) * 100) 
        : 0;

    // Hover effect logic
    useEffect(() => {
        if (isHovering && galleryImages.length > 1) {
            hoverIntervalRef.current = setInterval(() => {
                setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
            }, 1200); // Change image every 1.2 seconds on hover
        } else {
            if (hoverIntervalRef.current) clearInterval(hoverIntervalRef.current);
        }

        return () => {
            if (hoverIntervalRef.current) clearInterval(hoverIntervalRef.current);
        };
    }, [isHovering, galleryImages.length]);

    return (
        <div 
            className="group flex flex-col bg-[#151515] rounded-2xl overflow-hidden relative shadow-sm border border-[#2a2a2a] hover:border-[#444444] transition-colors duration-300 h-full"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => {
                setIsHovering(false);
                setCurrentImageIndex(0); // Reset to primary image when mouse leaves
            }}
        >
            {/* Image Container */}
            <div className="relative aspect-[4/4.5] overflow-hidden bg-[#0a0a0a] rounded-t-2xl">
                <Link href={`/products/${product.slug}`} className="block w-full h-full">
                    <img 
                        src={galleryImages[currentImageIndex]} 
                        alt={product.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                </Link>

                {/* Badges */}
                {hasDiscount ? (
                    <div className="absolute top-3 left-3 bg-[#e43a53] text-white text-[11px] font-medium px-3 py-1 rounded-full z-10 shadow-md">
                        Save {discountPercent}%
                    </div>
                ) : null}
                
                <div className="absolute top-3 right-3 bg-[#111111]/80 backdrop-blur-md text-gray-200 text-[11px] font-medium px-2 py-1 rounded-full flex items-center shadow-sm z-10 border border-white/10">
                    <Star className="w-3 h-3 fill-[#fbbf24] text-[#fbbf24] mr-1" />
                    <span>5.0</span>
                </div>

                {/* Eye Icon (Quick View) */}
                <button className="absolute top-12 right-3 w-8 h-8 bg-[#111111]/80 backdrop-blur-md rounded-full flex items-center justify-center text-gray-300 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:text-white hover:bg-[#222] border border-white/10">
                    <Eye className="w-4 h-4" />
                </button>
            </div>

            {/* Product Info */}
            <div className="p-5 flex flex-col flex-grow bg-[#151515] text-left">
                {/* Title */}
                <Link href={`/products/${product.slug}`} className="text-gray-200 font-semibold text-[17px] hover:text-[#cba876] transition-colors mb-2 line-clamp-2">
                    {product.name}
                </Link>

                {/* Price */}
                <div className="flex flex-col items-start mb-4 mt-1">
                    {hasDiscount ? (
                        <div className="flex items-center space-x-2">
                            <span className="text-[#e43a53] text-[18px] font-bold">{formatPrice(product.price)}</span>
                            <span className="text-gray-500 text-[13px] line-through relative">
                                {formatPrice(product.old_price)}
                            </span>
                        </div>
                    ) : (
                        <span className="text-gray-200 text-[18px] font-bold">{formatPrice(product.price)}</span>
                    )}
                </div>

                {/* Gallery Thumbnails */}
                {galleryImages.length > 1 && (
                    <div className="flex justify-start space-x-2 mb-5">
                        {galleryImages.slice(0, 5).map((img, idx) => (
                            <button 
                                key={idx}
                                onMouseEnter={() => setCurrentImageIndex(idx)}
                                onClick={(e) => { e.preventDefault(); setCurrentImageIndex(idx); }}
                                className={`w-9 h-9 rounded-md overflow-hidden border transition-all ${currentImageIndex === idx ? 'border-[#cba876] shadow-sm' : 'border-[#333] opacity-60 hover:opacity-100 hover:border-gray-400'}`}
                            >
                                <img src={img} alt="" className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                )}

                {/* Buy Now Button */}
                <button className="w-full mt-auto bg-[#cba876] text-black font-semibold uppercase tracking-wider text-[13px] py-3.5 rounded-lg hover:bg-white transition-colors shadow-lg flex items-center justify-center">
                    <ShoppingCart className="w-[18px] h-[18px] mr-2" />
                    Buy Now
                </button>
            </div>
        </div>
    );
}
