import { Head, Link, usePage } from '@inertiajs/react';
import { ChevronRight, Filter, LayoutGrid } from 'lucide-react';
import { useMemo, useState } from 'react';

import { StorefrontFooter } from '@/components/storefront-footer';
import { StorefrontHeader } from '@/components/storefront-header';
import { type SharedData } from '@/types';

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

type Category = {
    id: number;
    name: string;
    slug: string;
};

interface ProductIndexProps {
    products: Product[];
    initialCategory?: string;
    initialCategoryName?: string;
}

export default function Index({ products, initialCategory = 'All', initialCategoryName = 'All' }: ProductIndexProps) {
    const { settings } = usePage<SharedData>().props;
    const isEnglish = settings?.site_theme === 'example' || settings?.site_theme === 'wildtannery';

    const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
    const [selectedCategoryName, setSelectedCategoryName] = useState<string>(initialCategoryName);

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
        if (selectedCategory === 'All') return isEnglish ? 'Our Collection' : 'সকল পণ্য';
        return selectedCategoryName || selectedCategory;
    }, [selectedCategory, selectedCategoryName, isEnglish]);

    const formatPrice = (price: any) => {
        if (price === null || price === undefined) return '';
        const numericPrice = parseFloat(String(price).replace(/[^0-9.]/g, ''));
        if (isNaN(numericPrice)) return price;
        return `৳${numericPrice.toLocaleString('en-BD', { minimumFractionDigits: 0 })}`;
    };

    return (
        <>
            <Head title={selectedCategory === 'All' ? (isEnglish ? 'Shop' : 'শপ') : displayCategoryName} />
            <main className="min-h-screen bg-slate-50 font-sans text-slate-900">
                <StorefrontHeader />

                {/* Breadcrumbs & Header */}
                <div className="border-b border-slate-200 bg-white">
                    <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
                        <div className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-500">
                            <Link href={route('home')} className="transition-colors hover:text-orange-600">
                                {isEnglish ? 'Home' : 'হোম'}
                            </Link>
                            <ChevronRight className="h-4 w-4 text-slate-400" />
                            <span className="font-bold text-slate-900">{isEnglish ? 'Shop' : 'শপ'}</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950 uppercase">{displayCategoryName}</h1>
                        <p className="mt-2 max-w-2xl text-sm text-slate-500">
                            {isEnglish
                                ? 'Browse our curated collection of premium quality products.'
                                : 'আমাদের প্রিমিয়াম কোয়ালিটি পণ্যের সংগ্রহ ব্রাউজ করুন।'}
                        </p>
                    </div>
                </div>

                <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
                    {/* Toolbar */}
                    <div className="mb-8 flex flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
                        <div className="flex items-center gap-4 sm:gap-6">
                            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                                <Filter className="h-4 w-4 text-orange-600" />
                                {isEnglish
                                    ? `Showing ${selectedCategory === 'All' ? 'All Products' : displayCategoryName}`
                                    : `প্রদর্শিত হচ্ছে ${selectedCategory === 'All' ? 'সকল পণ্য' : displayCategoryName}`}
                            </div>
                            <div className="h-4 w-px bg-slate-200" />
                            <p className="text-sm font-medium text-slate-500">
                                <span className="font-bold text-orange-600">{filteredProducts.length}</span>{' '}
                                {isEnglish ? 'products found' : 'টি পণ্য পাওয়া গেছে'}
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-1">
                                <button className="rounded bg-orange-600 p-1.5 text-white shadow-sm" aria-label="Grid view">
                                    <LayoutGrid className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Unified Product Grid */}
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                        {filteredProducts.map((product) => (
                            <Link
                                key={product.slug}
                                href={route('products.show', product.slug)}
                                className="group block overflow-hidden rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition-all duration-200 hover:border-slate-300 hover:shadow-md"
                            >
                                <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-slate-100">
                                    <img
                                        src={
                                            product.image
                                                ? product.image.startsWith('http')
                                                    ? product.image
                                                    : `/storage/${product.image}`
                                                : '/images/placeholder.png'
                                        }
                                        alt={product.name}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        loading="lazy"
                                    />
                                    {product.discount_text && (
                                        <span className="absolute top-2 left-2 rounded bg-orange-600 px-2 py-0.5 text-[11px] font-bold text-white shadow">
                                            {product.discount_text}
                                        </span>
                                    )}
                                </div>
                                <div className="mt-3 flex flex-col justify-between">
                                    <h3 className="line-clamp-2 text-sm font-bold text-slate-900 transition-colors group-hover:text-orange-600 min-h-[2.5rem]">
                                        {product.name}
                                    </h3>
                                    <div className="mt-1.5 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                                        <span className="text-base font-black text-orange-600">{formatPrice(product.price)}</span>
                                        {product.old_price && (
                                            <span className="text-xs font-semibold text-slate-400 line-through">
                                                {formatPrice(product.old_price)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {filteredProducts.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                                <LayoutGrid className="h-10 w-10" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">{isEnglish ? 'No products found' : 'কোনো পণ্য পাওয়া যায়নি'}</h3>
                            <p className="mt-2 text-sm text-slate-500">
                                {isEnglish ? 'Try selecting a different category or clearing filters.' : 'অন্য ক্যাটাগরি বেছে নিন অথবা ফিল্টার রিসেট করুন।'}
                            </p>
                            <button
                                onClick={() => setSelectedCategory('All')}
                                className="mt-6 font-bold text-orange-600 underline hover:text-orange-700"
                            >
                                {isEnglish ? 'Show all products' : 'সকল পণ্য দেখুন'}
                            </button>
                        </div>
                    )}

                    {/* Back to Home Placeholder */}
                    <div className="mt-16 flex justify-center border-t border-slate-200 pt-10">
                        <Link
                            href={route('home')}
                            className="rounded-xl border border-orange-500 px-8 py-3 text-sm font-bold tracking-wider text-orange-600 uppercase transition-colors hover:bg-orange-600 hover:text-white"
                        >
                            {isEnglish ? 'Back to Home' : 'হোমে ফিরে যান'}
                        </Link>
                    </div>
                </div>

                <StorefrontFooter />
            </main>
        </>
    );
}
