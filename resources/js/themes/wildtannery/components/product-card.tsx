import { Link, router } from '@inertiajs/react';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface Product {
    id: number;
    slug: string;
    name: string;
    price: string;
    old_price: string | null;
    discount_text: string | null;
    image: string;
}

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const handleQuickAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Add to cart directly using the same endpoint
        router.post(route('cart.add'), {
            product_id: product.id,
            quantity: 1
        }, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <Link
            href={route('products.show', product.slug)}
            className="group relative flex h-full flex-col overflow-hidden bg-[#131826] rounded-xl border border-slate-800 transition-all hover:border-slate-700 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-900/10"
        >
            {/* Image Container */}
            <div className="relative aspect-square w-full overflow-hidden bg-[#0B0E14] p-4">
                <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover rounded-lg transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                />
                
                {/* Badges */}
                <div className="absolute left-4 top-4 flex flex-col gap-2 z-10">
                    {product.discount_text && (
                        <span className="bg-red-600 px-2 py-0.5 text-[11px] font-bold text-white rounded-sm shadow-sm">
                            {product.discount_text}
                        </span>
                    )}
                </div>
            </div>

            {/* Product Details */}
            <div className="flex flex-col flex-1 px-4 pb-5 pt-3">
                <h3 className="text-[13px] font-semibold text-slate-300 leading-snug line-clamp-2 min-h-[38px] group-hover:text-blue-400 transition-colors">
                    {product.name}
                </h3>
                
                <div className="mt-2 flex items-center gap-3">
                    <span className="text-[15px] font-bold text-white">
                        {product.price}
                    </span>
                    {product.old_price && (
                        <span className="text-xs font-semibold text-slate-500 line-through">
                            {product.old_price}
                        </span>
                    )}
                </div>

                <div className="mt-4">
                    <Button 
                        onClick={handleQuickAdd}
                        variant="outline"
                        className="w-full bg-transparent border-blue-600 text-blue-500 hover:bg-blue-600 hover:text-white rounded-full text-xs font-bold tracking-wide h-9 transition-all flex items-center justify-center gap-2"
                    >
                        <ShoppingCart className="w-4 h-4" />
                        Add to cart
                    </Button>
                </div>
            </div>
        </Link>
    );
}
