import { ProductCard } from './ProductCard';
import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';

export function SeriesSection({ category }: { category: any }) {
    if (!category.products || category.products.length === 0) {
        return null; // Don't render if no products
    }

    return (
        <section className="py-12 bg-black">
            <div className="container mx-auto px-4 lg:px-8">
                {/* Section Header (saifexbd.com style: left title + right More Products button) */}
                <div className="flex flex-col sm:flex-row items-baseline justify-between mb-8 pb-3 border-b border-[#1a1a1a]">
                    <h2 className="text-xl md:text-2xl font-bold tracking-wide uppercase text-white font-serif-display">
                        {category.name}
                    </h2>
                    <Link 
                        href={`/products?category=${category.slug}`}
                        className="flex items-center space-x-1 text-xs font-black text-[#cba876] hover:text-[#b89563] uppercase tracking-widest transition-colors mt-2 sm:mt-0"
                    >
                        <span>More Products</span>
                        <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>

                {/* Product Grid (2 columns on mobile, 3 on tablet, 5 on desktop) */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
                    {category.products.slice(0, 10).map((product: any) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
}
