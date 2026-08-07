import { Head, Link } from '@inertiajs/react';
import { ChevronRight, Filter, LayoutGrid } from 'lucide-react';
import { useMemo, useState } from 'react';

import { ShutkiOceanFooter } from '@/themes/shutki-ocean/components/Footer';
import { ShutkiOceanHeader } from '@/themes/shutki-ocean/components/Header';
import { ProductCard } from '@/themes/shutki-ocean/components/ProductCard';

type Product = {
    id: number;
    slug: string;
    name: string;
    price: string;
    old_price: string | null;
    discount_text: string | null;
    image: string;
    variations?: any;
    category: {
        name: string;
        slug: string;
    } | null;
};

interface ProductIndexProps {
    products: Product[];
    initialCategory?: string;
    initialCategoryName?: string;
}

export default function Index({ products, initialCategory = 'All', initialCategoryName = 'All' }: ProductIndexProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
    const [selectedCategoryName] = useState<string>(initialCategoryName);

    const filteredProducts = useMemo(() => {
        if (selectedCategory === 'All') return products;
        return products.filter(
            (p) => p.category?.name === selectedCategory || p.category?.slug === selectedCategory,
        );
    }, [products, selectedCategory]);

    return (
        <>
            <Head title={selectedCategory === 'All' ? 'সকল শুকটি মাছ' : selectedCategoryName || selectedCategory} />
            <main className="min-h-screen bg-[#F4F9FF] font-sans text-slate-800 selection:bg-[#F97316] selection:text-white">
                <ShutkiOceanHeader />

                {/* Header Banner */}
                <div className="border-b border-blue-100 bg-white shadow-sm">
                    <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
                        <div className="mb-3 flex items-center gap-2 text-xs font-bold text-slate-500">
                            <Link href={route('home')} className="transition-colors hover:text-[#0F52BA]">
                                হোম
                            </Link>
                            <ChevronRight className="h-3.5 w-3.5" />
                            <span className="text-slate-900">শুকটি মাছের কালেকশন</span>
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 sm:text-4xl">
                            {selectedCategory === 'All' ? 'সকল প্রিমিয়াম শুকটি মাছ' : selectedCategoryName || selectedCategory}
                        </h1>
                        <p className="mt-2 max-w-xl text-sm text-slate-600">
                            কক্সবাজার সমুদ্র উপকূলের বিষমুক্ত তাজা রোদে শুকানো শতভাগ অর্গানিক শুকটি মাছ।
                        </p>
                    </div>
                </div>

                <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
                    {/* Toolbar */}
                    <div className="mb-6 flex flex-col justify-between gap-4 rounded-2xl border border-blue-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                                <Filter className="h-4 w-4 text-[#F97316]" />
                                {selectedCategory === 'All' ? 'সকল পণ্য' : `${selectedCategoryName || selectedCategory}`}
                            </div>
                            <span className="h-4 w-px bg-slate-200" />
                            <p className="text-sm text-slate-600">
                                মোট <span className="font-black text-[#0F52BA]">{filteredProducts.length}</span> টি পণ্য পাওয়া গেছে
                            </p>
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>

                    {filteredProducts.length === 0 && (
                        <div className="flex flex-col items-center justify-center rounded-2xl border border-blue-100 bg-white py-16 text-center shadow-sm">
                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-slate-400">
                                <LayoutGrid className="h-8 w-8" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">কোনো শুকটি মাছ পাওয়া যায়নি</h3>
                            <p className="mt-1 text-sm text-slate-500">অন্য কোনো ক্যাটাগরি ফিল্টার করুন।</p>
                            <button
                                onClick={() => setSelectedCategory('All')}
                                className="mt-4 rounded-xl bg-[#0F52BA] px-6 py-2.5 text-xs font-black text-white shadow-md"
                            >
                                সকল শুকটি দেখুন
                            </button>
                        </div>
                    )}
                </div>

                <ShutkiOceanFooter />
            </main>
        </>
    );
}
