import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import { ProductCard } from './ProductCard';

export function SeriesSection({ category }: { category: any }) {
    if (!category.products || category.products.length === 0) {
        return null; // Don't render if no products
    }

    return (
        <section className="bg-black py-12">
            <div className="container mx-auto px-4 lg:px-8">
                {/* Section Header (saifexbd.com style: left title + right More Products button) */}
                <div className="mb-8 flex flex-col items-baseline justify-between border-b border-[#1a1a1a] pb-3 sm:flex-row">
                    <h2 className="font-serif-display text-xl font-bold tracking-wide text-white uppercase md:text-2xl">{category.name}</h2>
                    <Link
                        href={`/products?category=${category.slug}`}
                        className="mt-2 flex items-center space-x-1 text-xs font-black tracking-widest text-[#cba876] uppercase transition-colors hover:text-[#b89563] sm:mt-0"
                    >
                        <span>More Products</span>
                        <ChevronRight className="h-4 w-4" />
                    </Link>
                </div>

                {/* Product Grid (2 columns on mobile, 3 on tablet, 5 on desktop) */}
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-5">
                    {category.products.slice(0, 10).map((product: any) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
}
