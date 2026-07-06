import { Head, Link } from '@inertiajs/react';
import { ChevronRight, Filter, LayoutGrid } from 'lucide-react';
import { useState, useMemo } from 'react';

import { Header } from '../../themes/wildtannery/components/Header';
import { StorefrontFooter as Footer } from '@/components/storefront-footer';
import { ProductCard } from '../../themes/wildtannery/components/ProductCard';

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
    variations: {
        colors: any[];
        sizes: any[];
    };
    category: {
        name: string;
        slug: string;
    } | null;
};

interface ProductIndexProps {
    products: Product[];
    initialCategory?: string;
}

export default function Index({ products, initialCategory = 'All' }: ProductIndexProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);

    // Filter products based on selected category (matching against slug or name case-insensitively)
    const filteredProducts = useMemo(() => {
        if (!selectedCategory || selectedCategory === 'All') return products;
        return products.filter(p => 
            p.category?.name?.toLowerCase() === selectedCategory.toLowerCase() ||
            p.category?.slug?.toLowerCase() === selectedCategory.toLowerCase()
        );
    }, [products, selectedCategory]);

    const displayCategoryName = useMemo(() => {
        if (selectedCategory === 'All') return 'Our Collection';
        const matched = products.find(p => 
            p.category?.name?.toLowerCase() === selectedCategory.toLowerCase() ||
            p.category?.slug?.toLowerCase() === selectedCategory.toLowerCase()
        );
        return matched?.category?.name ?? (selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1));
    }, [selectedCategory, products]);

    return (
        <>
            <Head title={selectedCategory === 'All' ? 'Shop' : displayCategoryName} />
            <main className="bg-[#050505] text-white selection:bg-[#cba876] selection:text-black font-sans min-h-screen">
                <Header />

                {/* Breadcrumbs & Header */}
                <div className="bg-[#0a0a0a] border-b border-white/5">
                    <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-4">
                            <Link href={route('home')} className="hover:text-[#cba876] transition-colors">Home</Link>
                            <ChevronRight className="h-4 w-4 text-gray-600" />
                            <span className="text-[#cba876] font-bold">Shop</span>
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-white uppercase">
                            {displayCategoryName}
                        </h1>
                        <p className="mt-2 text-gray-400 max-w-2xl text-sm">
                            Browse our curated collection of premium quality products.
                        </p>
                    </div>
                </div>

                <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
                    {/* Toolbar */}
                    <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg border border-white/5 bg-[#0a0a0a] p-4 shadow-md">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2 text-sm font-bold text-white">
                                <Filter className="h-4 w-4 text-[#cba876]" />
                                Showing {selectedCategory === 'All' ? 'All Products' : displayCategoryName}
                            </div>
                            <div className="h-4 w-px bg-white/10" />
                            <p className="text-sm text-gray-400 font-medium">
                                <span className="text-[#cba876] font-bold">{filteredProducts.length}</span> products found
                            </p>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <div className="flex items-center rounded-md border border-white/10 p-1 bg-white/5">
                                <button className="p-1.5 rounded bg-[#cba876] text-black shadow-sm" aria-label="Grid view">
                                    <LayoutGrid className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Unified Product Grid */}
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.slug} product={product} />
                        ))}
                    </div>

                    {filteredProducts.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/5 text-gray-600">
                                <LayoutGrid className="h-10 w-10" />
                            </div>
                            <h3 className="text-xl font-bold text-white">No products found</h3>
                            <p className="mt-2 text-gray-400 text-sm">Try selecting a different category or clearing filters.</p>
                            <button 
                                onClick={() => setSelectedCategory('All')}
                                className="mt-6 font-bold text-[#cba876] underline hover:text-[#b89563]"
                            >
                                Show all products
                            </button>
                        </div>
                    )}

                    {/* Back to Home Placeholder */}
                    <div className="mt-16 flex justify-center border-t border-white/5 pt-10">
                        <Link href={route('home')} className="rounded-md border border-[#cba876] px-8 py-3 text-sm font-bold text-white transition-colors hover:bg-[#cba876] hover:!text-black uppercase tracking-widest">
                            Back to Home
                        </Link>
                    </div>
                </div>

                <Footer />
            </main>
        </>
    );
}
