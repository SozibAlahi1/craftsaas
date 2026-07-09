import { Head, Link } from '@inertiajs/react';
import { ChevronRight, Filter, LayoutGrid } from 'lucide-react';
import { useMemo, useState } from 'react';

import { StorefrontFooter as Footer } from '@/components/storefront-footer';
import { Header } from '../../themes/wildtannery/components/Header';
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
        return products.filter(
            (p) =>
                p.category?.name?.toLowerCase() === selectedCategory.toLowerCase() ||
                p.category?.slug?.toLowerCase() === selectedCategory.toLowerCase(),
        );
    }, [products, selectedCategory]);

    const displayCategoryName = useMemo(() => {
        if (selectedCategory === 'All') return 'Our Collection';
        const matched = products.find(
            (p) =>
                p.category?.name?.toLowerCase() === selectedCategory.toLowerCase() ||
                p.category?.slug?.toLowerCase() === selectedCategory.toLowerCase(),
        );
        return matched?.category?.name ?? selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1);
    }, [selectedCategory, products]);

    return (
        <>
            <Head title={selectedCategory === 'All' ? 'Shop' : displayCategoryName} />
            <main className="min-h-screen bg-[#050505] font-sans text-white selection:bg-[#cba876] selection:text-black">
                <Header />

                {/* Breadcrumbs & Header */}
                <div className="border-b border-white/5 bg-[#0a0a0a]">
                    <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
                        <div className="mb-4 flex items-center gap-2 text-sm font-medium text-gray-400">
                            <Link href={route('home')} className="transition-colors hover:text-[#cba876]">
                                Home
                            </Link>
                            <ChevronRight className="h-4 w-4 text-gray-600" />
                            <span className="font-bold text-[#cba876]">Shop</span>
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-white uppercase">{displayCategoryName}</h1>
                        <p className="mt-2 max-w-2xl text-sm text-gray-400">Browse our curated collection of premium quality products.</p>
                    </div>
                </div>

                <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
                    {/* Toolbar */}
                    <div className="mb-8 flex flex-col justify-between gap-4 rounded-lg border border-white/5 bg-[#0a0a0a] p-4 shadow-md sm:flex-row sm:items-center">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2 text-sm font-bold text-white">
                                <Filter className="h-4 w-4 text-[#cba876]" />
                                Showing {selectedCategory === 'All' ? 'All Products' : displayCategoryName}
                            </div>
                            <div className="h-4 w-px bg-white/10" />
                            <p className="text-sm font-medium text-gray-400">
                                <span className="font-bold text-[#cba876]">{filteredProducts.length}</span> products found
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex items-center rounded-md border border-white/10 bg-white/5 p-1">
                                <button className="rounded bg-[#cba876] p-1.5 text-black shadow-sm" aria-label="Grid view">
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
                            <p className="mt-2 text-sm text-gray-400">Try selecting a different category or clearing filters.</p>
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
                        <Link
                            href={route('home')}
                            className="rounded-md border border-[#cba876] px-8 py-3 text-sm font-bold tracking-widest text-white uppercase transition-colors hover:bg-[#cba876] hover:!text-black"
                        >
                            Back to Home
                        </Link>
                    </div>
                </div>

                <Footer />
            </main>
        </>
    );
}
