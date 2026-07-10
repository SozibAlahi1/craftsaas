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

    if (!category.products || category.products.length === 0) {
        return null;
    }

    const isShutkiTheme = settings?.site_theme === 'shutki';
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
                onSuccess: () => {
                    setAddedProductId(product.id);
                    setTimeout(() => setAddedProductId(null), 2000);
                },
            }
        );
    };

    return (
        <div className="space-y-4 py-4 sm:py-6 lg:py-8">
            {/* Category Banner (Clickable Heading) */}
            {category.banner_image && (
                <Link
                    href={route('products.index', { category: category.name })}
                    className="group block overflow-hidden rounded-md transition-transform duration-500 hover:scale-[1.01]"
                >
                    <img
                        src={category.banner_image}
                        alt={category.name}
                        className="h-auto w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                    />
                </Link>
            )}

            {/* Product Grid */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 xl:grid-cols-5">
                {category.products.map((product) => {
                    const isVariable = isVariableProduct(product);
                    const isAdded = addedProductId === product.id;

                    return (
                        <Link
                            key={product.id}
                            href={route('products.show', product.slug)}
                            className="block h-full overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/40"
                        >
                            <div className="flex h-full min-h-[380px] flex-col">
                                <div className="flex-1 overflow-hidden">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="h-[220px] w-full object-cover transition-transform duration-500 hover:scale-110"
                                        loading="lazy"
                                    />
                                </div>

                                <div className="flex flex-col justify-between px-4 pt-3 pb-4">
                                    <div>
                                        <h3 className="line-clamp-1 text-[1.05rem] leading-6 font-bold text-slate-950">{product.name}</h3>
                                        <div className="mt-2 text-[1.35rem] leading-none font-black text-orange-600">{product.price}</div>

                                        <div className="mt-3 flex items-center gap-3 text-xs font-semibold">
                                            {product.old_price && <span className="text-slate-400 line-through">{product.old_price}</span>}
                                            {product.discount_text && (
                                                <span className="rounded-md bg-orange-50 px-2 py-1 text-orange-600">{product.discount_text}</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    {isVariable ? (
                                        <div
                                            className="mt-4 w-full rounded-full border text-center py-2 text-xs font-black tracking-wider uppercase transition-all duration-300"
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
                                            বিস্তারিত দেখুন
                                        </div>
                                    ) : (
                                        <div
                                            className="mt-4 w-full rounded-full text-center py-2 text-xs font-black tracking-wider uppercase text-white shadow-sm transition-all duration-300"
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
        </div>
    );
}
