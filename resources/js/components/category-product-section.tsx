import { Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

interface Product {
    id: number;
    slug: string;
    name: string;
    price: string;
    old_price: string | null;
    discount_text: string | null;
    image: string;
    variations?: any;
}

interface Category {
    id: number;
    name: string;
    slug: string;
    banner_image: string | null;
    products: Product[];
}

interface CategoryProductSectionProps {
    category: Category;
}

export function CategoryProductSection({ category }: CategoryProductSectionProps) {
    const { settings } = usePage().props as any;
    const [addedProductId, setAddedProductId] = useState<number | null>(null);
    const [bannerError, setBannerError] = useState(false);

    if (!category.products || category.products.length === 0) {
        return null;
    }

    const isShutkiTheme = settings?.site_theme === 'shutki';
    const isEnglish = settings?.site_theme === 'example' || settings?.site_theme === 'wildtannery';
    const primaryColor = isShutkiTheme ? 'hsl(89,32%,54%)' : '#cba876';
    const hoverColor = isShutkiTheme ? 'hsl(89,35%,42%)' : '#b89563';
    const textColor = isShutkiTheme ? 'hsl(89,32%,54%)' : '#cba876';
    const textHoverColor = isShutkiTheme ? '#ffffff' : '#000000';

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
                preserveState: true,
                only: ['cart', 'cartCount', 'flash'],
                onSuccess: () => {
                    setAddedProductId(product.id);
                    setTimeout(() => setAddedProductId(null), 2000);
                },
            }
        );
    };

    const bannerSrc = category.banner_image
        ? category.banner_image.startsWith('http') || category.banner_image.startsWith('/')
            ? category.banner_image
            : `/storage/${category.banner_image}`
        : null;

    return (
        <div className="space-y-3 sm:space-y-4 py-3 sm:py-6 lg:py-8">
            {/* Category Banner (Clickable Heading) or Fallback Text Header */}
            {bannerSrc && !bannerError ? (
                <Link
                    href={route('products.index', { category: category.slug })}
                    className="group block overflow-hidden rounded-md transition-transform duration-500 hover:scale-[1.01]"
                >
                    <img
                        src={bannerSrc}
                        alt={category.name}
                        className="h-auto w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                        onError={() => setBannerError(true)}
                    />
                </Link>
            ) : (
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <h2 className="text-base sm:text-xl font-bold tracking-tight text-slate-900 uppercase">
                        {category.name}
                    </h2>
                    <Link
                        href={route('products.index', { category: category.slug })}
                        className="text-xs sm:text-sm font-semibold transition-colors hover:underline"
                        style={{ color: primaryColor }}
                    >
                        {isEnglish ? 'View All' : 'সব দেখুন'} &rarr;
                    </Link>
                </div>
            )}

            {/* Product Grid */}
            <div className="grid grid-cols-2 gap-2 sm:gap-4 xl:grid-cols-5">
                {category.products.map((product) => {
                    const isVariable = isVariableProduct(product);
                    const isAdded = addedProductId === product.id;
                    const productImage = product.image
                        ? product.image.startsWith('http') || product.image.startsWith('/')
                            ? product.image
                            : `/storage/${product.image}`
                        : '/images/placeholder.png';

                    return (
                        <Link
                            key={product.id}
                            href={route('products.show', product.slug)}
                            className="group flex h-full flex-col overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-md"
                        >
                            <div className="relative w-full aspect-square overflow-hidden bg-slate-100">
                                <img
                                    src={productImage}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    loading="lazy"
                                />
                            </div>

                            <div className="flex flex-1 flex-col justify-between p-2.5 sm:p-4">
                                <div>
                                    <h3 className="line-clamp-2 text-xs sm:text-sm font-bold text-slate-950 leading-snug min-h-[2rem] sm:min-h-[2.5rem]">
                                        {product.name}
                                    </h3>
                                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5 sm:gap-2">
                                        <span className="text-sm sm:text-base font-black text-orange-600 leading-none whitespace-nowrap">
                                            {product.price}
                                        </span>
                                        {product.old_price && (
                                            <span className="text-[11px] sm:text-xs font-semibold text-slate-400 line-through whitespace-nowrap">
                                                {product.old_price}
                                            </span>
                                        )}
                                        {product.discount_text && (
                                            <span className="rounded bg-orange-50 px-1.5 py-0.5 text-[10px] sm:text-xs font-bold text-orange-600 whitespace-nowrap">
                                                {product.discount_text}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Action Button */}
                                {isVariable ? (
                                    <div
                                        className="mt-2.5 w-full rounded-full border text-center font-bold tracking-wider uppercase transition-all duration-300 py-1.5 sm:py-2 text-[10px] sm:text-xs"
                                        style={{
                                            borderColor: primaryColor,
                                            color: textColor,
                                            backgroundColor: 'transparent',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = primaryColor;
                                            e.currentTarget.style.color = textHoverColor;
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                            e.currentTarget.style.color = textColor;
                                        }}
                                    >
                                        {isEnglish ? 'View Details' : 'বিস্তারিত দেখুন'}
                                    </div>
                                ) : (
                                    <div
                                        className="mt-2.5 w-full rounded-full text-center font-bold tracking-wider uppercase text-white shadow-sm transition-all duration-300 py-1.5 sm:py-2 text-[10px] sm:text-xs"
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
                                        {isAdded
                                            ? (isEnglish ? 'Added! ✓' : 'যুক্ত করা হয়েছে! ✓')
                                            : (isEnglish ? 'Add to Cart' : 'কার্টে যুক্ত করুন')}
                                    </div>
                                )}
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
