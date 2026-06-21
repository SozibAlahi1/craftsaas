import { Link } from '@inertiajs/react';

interface Product {
    id: number;
    slug: string;
    name: string;
    price: string;
    old_price: string | null;
    discount_text: string | null;
    image: string;
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
    if (!category.products || category.products.length === 0) {
        return null;
    }

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
                {category.products.map((product) => (
                    <Link
                        key={product.id}
                        href={route('products.show', product.slug)}
                        className="block h-full overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/40"
                    >
                        <div className="flex h-full min-h-[340px] flex-col">
                            <div className="flex-1 overflow-hidden">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="h-[220px] w-full object-cover transition-transform duration-500 hover:scale-110"
                                    loading="lazy"
                                />
                            </div>

                            <div className="px-4 pb-4 pt-3">
                                <h3 className="line-clamp-1 text-[1.05rem] font-bold leading-6 text-slate-950">{product.name}</h3>
                                <div className="mt-2 text-[1.35rem] font-black leading-none text-orange-600">{product.price}</div>

                                <div className="mt-3 flex items-center gap-3 text-xs font-semibold">
                                    {product.old_price && <span className="text-slate-400 line-through">{product.old_price}</span>}
                                    {product.discount_text && (
                                        <span className="rounded-md bg-orange-50 px-2 py-1 text-orange-600">
                                            {product.discount_text}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
