import { StorefrontHeader } from '@/components/storefront-header';
import { ShutkirFooter } from '@/themes/shutki/components/Footer';
import { Head, Link, router } from '@inertiajs/react';
import { ChevronRight, Filter, LayoutGrid, List } from 'lucide-react';
import { useMemo, useState } from 'react';

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
}

export default function Index({ products, initialCategory = 'All' }: ProductIndexProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
    const [addedProductId, setAddedProductId] = useState<number | null>(null);

    // Filter products based on selected category
    const filteredProducts = useMemo(() => {
        if (selectedCategory === 'All') return products;
        return products.filter((p) => p.category?.name === selectedCategory);
    }, [products, selectedCategory]);

    const isVariableProduct = (product: any) => {
        let variations = product.variations;
        if (typeof variations === 'string') {
            try {
                variations = JSON.parse(variations);
            } catch (e) {
                variations = null;
            }
        }
        if (!variations) return false;

        const hasColors = Array.isArray(variations.colors) && variations.colors.some((c: any) => c && c.label && c.label.trim() !== '');
        const hasSizes = Array.isArray(variations.sizes) && variations.sizes.some((s: any) => s && s.label && s.label.trim() !== '');

        return hasColors || hasSizes;
    };

    const handleAddToCart = (e: React.MouseEvent, product: any) => {
        e.preventDefault();
        e.stopPropagation();

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
                onSuccess: () => {
                    setAddedProductId(product.id);
                    setTimeout(() => setAddedProductId(null), 2000);
                },
            }
        );
    };

    const primaryColor = 'hsl(89,32%,54%)';
    const hoverColor = 'hsl(89,35%,42%)';

    return (
        <>
            <Head title={selectedCategory === 'All' ? 'সকল পণ্য' : selectedCategory} />
            <main className="bg-background text-foreground min-h-screen">
                <StorefrontHeader />

                {/* Breadcrumbs & Header */}
                <div className="border-b border-slate-200 bg-white">
                    <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
                        <div className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-500">
                            <Link href={route('home')} className="transition-colors hover:text-slate-950">
                                হোম
                            </Link>
                            <ChevronRight className="h-4 w-4" />
                            <span className="font-bold text-slate-900">পণ্যসমূহ</span>
                        </div>
                        <h1 className="text-4xl font-black tracking-tight text-slate-950">
                            {selectedCategory === 'All' ? 'সকল পণ্য' : selectedCategory}
                        </h1>
                        <p className="mt-2 max-w-2xl text-slate-600">আমাদের সংগ্রহ থেকে বাছাইকৃত সেরা মানের পণ্য ব্রাউজ করুন।</p>
                    </div>
                </div>

                <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
                    {/* Toolbar */}
                    <div className="mb-8 flex flex-col justify-between gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                                <Filter className="h-4 w-4 text-orange-600" />
                                {selectedCategory === 'All' ? 'সকল পণ্য' : `${selectedCategory}`} দেখাচ্ছে
                            </div>
                            <div className="h-4 w-px bg-slate-200" />
                            <p className="text-sm font-medium text-slate-500">
                                <span className="font-bold text-slate-950">{filteredProducts.length}</span> টি পণ্য পাওয়া গেছে
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex items-center rounded-md border border-slate-200 bg-slate-50 p-1">
                                <button className="rounded bg-white p-1.5 text-slate-950 shadow-sm" aria-label="Grid view">
                                    <LayoutGrid className="h-4 w-4" />
                                </button>
                                <button className="rounded p-1.5 text-slate-400 hover:text-slate-600" aria-label="List view">
                                    <List className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Unified Product Grid */}
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 xl:grid-cols-5">
                        {filteredProducts.map((product) => {
                            const isVariable = isVariableProduct(product);
                            const isAdded = addedProductId === product.id;

                            return (
                                <Link
                                    key={product.slug}
                                    href={route('products.show', product.slug)}
                                    className="block h-full overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:border-slate-300"
                                >
                                    <div className="flex h-full min-h-[290px] sm:min-h-[380px] flex-col">
                                        <div className="flex-1 overflow-hidden flex items-center justify-center bg-white">
                                            <img src={product.image} alt={product.name} className="h-[140px] sm:h-[220px] w-full object-contain" loading="lazy" />
                                        </div>

                                        <div className="flex flex-col justify-between px-3 py-3 sm:px-4 sm:pt-3 sm:pb-4">
                                            <div>
                                                <h3 className="line-clamp-2 text-sm sm:text-[1.05rem] leading-tight font-semibold text-slate-950">{product.name}</h3>
                                                <div className="mt-1 text-base sm:text-[1.35rem] leading-none font-bold text-orange-600">{product.price}</div>

                                                <div className="mt-1.5 flex items-center gap-3 text-xs">
                                                    {product.old_price && <span className="text-slate-500 line-through">{product.old_price}</span>}
                                                    {product.discount_text && (
                                                        <span className="rounded-md bg-orange-50 px-2 py-1 font-medium text-orange-600">
                                                            {product.discount_text}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Action Button */}
                                            {isVariable ? (
                                                <div
                                                    className="mt-2.5 w-full rounded-full border text-center py-1.5 sm:py-2 text-[10px] sm:text-xs font-black tracking-wider uppercase transition-all duration-300"
                                                    style={{
                                                        borderColor: primaryColor,
                                                        color: primaryColor,
                                                        backgroundColor: 'transparent',
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.backgroundColor = primaryColor;
                                                        e.currentTarget.style.color = '#ffffff';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.backgroundColor = 'transparent';
                                                        e.currentTarget.style.color = primaryColor;
                                                    }}
                                                >
                                                    বিস্তারিত দেখুন
                                                </div>
                                            ) : (
                                                <div
                                                    className="mt-2.5 w-full rounded-full text-center py-1.5 sm:py-2 text-[10px] sm:text-xs font-black tracking-wider uppercase text-white shadow-sm transition-all duration-300"
                                                    style={{
                                                        backgroundColor: isAdded ? '#10b981' : primaryColor,
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        if (!isAdded) {
                                                            e.currentTarget.style.backgroundColor = hoverColor;
                                                        }
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        if (!isAdded) {
                                                            e.currentTarget.style.backgroundColor = primaryColor;
                                                        }
                                                    }}
                                                    onClick={(e) => handleAddToCart(e, product)}
                                                >
                                                    {isAdded ? 'যুক্ত করা হয়েছে! ✓' : 'কার্টে যুক্ত করুন'}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                    {filteredProducts.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-slate-300">
                                <LayoutGrid className="h-10 w-10" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-950">কোনো পণ্য পাওয়া যায়নি</h3>
                            <p className="mt-2 text-slate-500">অন্য কোনো ক্যাটাগরি বেছে নিন অথবা ফিল্টার ক্লিয়ার করুন।</p>
                            <button onClick={() => setSelectedCategory('All')} className="mt-6 font-bold text-orange-600 underline">
                                সকল পণ্য দেখুন
                            </button>
                        </div>
                    )}

                    {/* Back to Home Placeholder */}
                    <div className="mt-16 flex justify-center border-t border-slate-200 pt-10">
                        <Link
                            href={route('home')}
                            className="rounded-md border border-slate-950 px-8 py-3 text-sm font-bold tracking-widest text-slate-950 uppercase transition-colors hover:bg-slate-950 hover:text-white"
                        >
                            হোমে ফিরে যান
                        </Link>
                    </div>
                </div>

                <ShutkirFooter />
            </main>
        </>
    );
}
