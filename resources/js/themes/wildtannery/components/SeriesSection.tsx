import { ProductCard } from './ProductCard';
import { Link } from '@inertiajs/react';

export function SeriesSection({ category }: { category: any }) {
    if (!category.products || category.products.length === 0) {
        return null; // Don't render if no products
    }

    return (
        <section className="py-20 bg-black">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="flex flex-col items-center mb-16">
                    <div className="flex items-center w-full max-w-3xl mb-4">
                        <div className="flex-grow h-px bg-gradient-to-r from-transparent to-[#cba876]"></div>
                        <h2 className="px-8 text-3xl md:text-5xl font-serif-display font-bold text-white text-center whitespace-nowrap">
                            <span className="text-[#cba876]">{category.name.split(' ')[0]}</span> {category.name.split(' ').slice(1).join(' ')}
                        </h2>
                        <div className="flex-grow h-px bg-gradient-to-l from-transparent to-[#cba876]"></div>
                    </div>
                    {category.description && (
                        <p className="text-gray-400 text-center max-w-2xl text-sm md:text-base">
                            {category.description}
                        </p>
                    )}
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    {category.products.map((product: any) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
                
                {/* View All Link (Optional) */}
                <div className="mt-12 text-center">
                    <Link 
                        href={`/products?category=${category.slug}`}
                        className="inline-block border-b border-[#cba876] text-[#cba876] pb-1 uppercase tracking-widest text-sm font-medium hover:text-white hover:border-white transition-colors"
                    >
                        View All {category.name}
                    </Link>
                </div>
            </div>
        </section>
    );
}
