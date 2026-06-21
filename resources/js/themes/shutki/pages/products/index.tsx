import { ShutkirFooter } from '@/themes/shutki/components/Footer';
import { StorefrontHeader } from '@/components/storefront-header';
import { Head, Link } from '@inertiajs/react';
import { ChevronRight, Filter, LayoutGrid, List } from 'lucide-react';
import { useState, useMemo } from 'react';

type Product = {
    slug: string;
    name: string;
    price: string;
    old_price: string | null;
    discount_text: string | null;
    image: string;
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


    // Filter products based on selected category
    const filteredProducts = useMemo(() => {
        if (selectedCategory === 'All') return products;
        return products.filter(p => p.category?.name === selectedCategory);
    }, [products, selectedCategory]);

    return (
        <>
            <Head title={`${selectedCategory === 'All' ? 'সকল পণ্য' : selectedCategory} - শুটকি ওয়ালা`} />
            <main className="bg-background text-foreground min-h-screen">
                <StorefrontHeader />

                {/* Breadcrumbs & Header */}
                <div className="bg-white border-b border-slate-200">
                    <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-500 mb-4">
                            <Link href={route('home')} className="hover:text-slate-950 transition-colors">হোম</Link>
                            <ChevronRight className="h-4 w-4" />
                            <span className="text-slate-900 font-bold">পণ্যসমূহ</span>
                        </div>
                        <h1 className="text-4xl font-black tracking-tight text-slate-950">
                            {selectedCategory === 'All' ? 'সকল পণ্য' : selectedCategory}
                        </h1>
                        <p className="mt-2 text-slate-600 max-w-2xl">আমাদের সংগ্রহ থেকে বাছাইকৃত সেরা মানের পণ্য ব্রাউজ করুন।</p>
                    </div>
                </div>

                <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
                    {/* Toolbar */}
                    <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                                <Filter className="h-4 w-4 text-orange-600" />
                                {selectedCategory === 'All' ? 'সকল পণ্য' : `${selectedCategory}`} দেখাচ্ছে
                            </div>
                            <div className="h-4 w-px bg-slate-200" />
                            <p className="text-sm text-slate-500 font-medium">
                                <span className="text-slate-950 font-bold">{filteredProducts.length}</span> টি পণ্য পাওয়া গেছে
                            </p>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <div className="flex items-center rounded-md border border-slate-200 p-1 bg-slate-50">
                                <button className="p-1.5 rounded bg-white text-slate-950 shadow-sm" aria-label="Grid view">
                                    <LayoutGrid className="h-4 w-4" />
                                </button>
                                <button className="p-1.5 rounded text-slate-400 hover:text-slate-600" aria-label="List view">
                                    <List className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Unified Product Grid */}
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 xl:grid-cols-5">
                        {filteredProducts.map((product) => (
                            <Link
                                key={product.slug}
                                href={route('products.show', product.slug)}
                                className="block h-full overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm transition-transform duration-300 hover:-translate-y-1"
                            >
                                <div className="flex h-full min-h-[340px] flex-col">
                                    <div className="flex-1">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="h-[220px] w-full object-cover"
                                            loading="lazy"
                                        />
                                    </div>

                                    <div className="px-4 pb-4 pt-3">
                                        <h3 className="text-[1.05rem] font-semibold leading-6 text-slate-950">{product.name}</h3>
                                        <div className="mt-2 text-[1.35rem] font-bold leading-none text-orange-600">{product.price}</div>

                                        <div className="mt-3 flex items-center gap-3 text-sm">
                                            {product.old_price && <span className="text-slate-500 line-through">{product.old_price}</span>}
                                            {product.discount_text && (
                                                <span className="rounded-md bg-orange-50 px-3 py-1 font-medium text-orange-600">
                                                    {product.discount_text}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {filteredProducts.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-slate-300">
                                <LayoutGrid className="h-10 w-10" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-950">কোনো পণ্য পাওয়া যায়নি</h3>
                            <p className="mt-2 text-slate-500">অন্য কোনো ক্যাটাগরি বেছে নিন অথবা ফিল্টার ক্লিয়ার করুন।</p>
                            <button 
                                onClick={() => setSelectedCategory('All')}
                                className="mt-6 font-bold text-orange-600 underline"
                            >
                                সকল পণ্য দেখুন
                            </button>
                        </div>
                    )}

                    {/* Back to Home Placeholder */}
                    <div className="mt-16 flex justify-center border-t border-slate-200 pt-10">
                        <Link href={route('home')} className="rounded-md border border-slate-950 px-8 py-3 text-sm font-bold text-slate-950 transition-colors hover:bg-slate-950 hover:text-white uppercase tracking-widest">
                            হোমে ফিরে যান
                        </Link>
                    </div>
                </div>

                <ShutkirFooter />
            </main>
        </>
    );
}
