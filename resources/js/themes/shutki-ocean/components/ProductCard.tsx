import { Link, router } from '@inertiajs/react';
import { ShoppingBag, ShoppingCart, Star } from 'lucide-react';
import { useState } from 'react';

export interface ShutkiProduct {
    id: number;
    slug: string;
    name: string;
    price: string;
    old_price?: string | null;
    discount_text?: string | null;
    image: string;
    rating?: number;
    reviews_count?: number;
}

export function ProductCard({ product }: { product: ShutkiProduct }) {
    const [isAdding, setIsAdding] = useState(false);

    const priceFormatted = product.price;
    const oldPriceFormatted = product.old_price;

    const handleQuickAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsAdding(true);
        router.post(
            route('cart.add'),
            {
                product_id: product.id,
                slug: product.slug,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1,
            },
            {
                preserveScroll: true,
                onFinish: () => setIsAdding(false),
            },
        );
    };

    const handleQuickBuyNow = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        router.post(route('cart.buyNow'), {
            product_id: product.id,
            slug: product.slug,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1,
        });
    };

    return (
        <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-blue-100 bg-white p-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/10">
            {/* Image Wrap */}
            <Link href={route('products.show', product.slug)} className="relative aspect-square w-full overflow-hidden rounded-xl bg-slate-50">
                <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                />

                {/* Discount Badge */}
                {product.discount_text && (
                    <span className="absolute left-2.5 top-2.5 rounded-lg bg-gradient-to-r from-[#F97316] to-[#EA580C] px-2.5 py-1 text-[11px] font-black text-white shadow-md">
                        {product.discount_text}
                    </span>
                )}
            </Link>

            {/* Content */}
            <div className="mt-3 flex flex-1 flex-col justify-between">
                <div>
                    {/* Rating placeholder / badge */}
                    <div className="flex items-center gap-1 text-xs text-amber-500">
                        <Star className="h-3.5 w-3.5 fill-amber-400" />
                        <span className="font-bold text-slate-700">{product.rating || '5.0'}</span>
                        <span className="text-[11px] text-slate-400">({product.reviews_count || 12})</span>
                    </div>

                    {/* Title */}
                    <Link href={route('products.show', product.slug)}>
                        <h3 className="mt-1.5 line-clamp-2 text-sm font-bold text-slate-800 transition-colors group-hover:text-[#0F52BA] sm:text-base">
                            {product.name}
                        </h3>
                    </Link>
                </div>

                {/* Price & Action Row */}
                <div className="mt-3">
                    <div className="flex items-baseline gap-2">
                        <span className="text-lg font-black text-[#F97316] sm:text-xl">{priceFormatted}</span>
                        {oldPriceFormatted && <span className="text-xs font-semibold text-slate-400 line-through">{oldPriceFormatted}</span>}
                    </div>

                    {/* Buttons */}
                    <div className="mt-3 grid grid-cols-2 gap-2">
                        <button
                            onClick={handleQuickAddToCart}
                            disabled={isAdding}
                            className="flex items-center justify-center gap-1 rounded-xl border border-blue-200 bg-blue-50/50 py-2 text-xs font-bold text-[#0F52BA] transition-colors hover:bg-blue-100 hover:border-blue-300"
                        >
                            <ShoppingCart className="h-3.5 w-3.5" />
                            <span>কার্টে রাখুন</span>
                        </button>
                        <button
                            onClick={handleQuickBuyNow}
                            className="flex items-center justify-center gap-1 rounded-xl bg-gradient-to-r from-[#F97316] to-[#EA580C] py-2 text-xs font-black text-white shadow-md transition-transform hover:scale-[1.02]"
                        >
                            <ShoppingBag className="h-3.5 w-3.5" />
                            <span>অর্ডার করুন</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
