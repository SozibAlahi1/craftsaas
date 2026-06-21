import { Link } from '@inertiajs/react';

const products = [
    {
        slug: 'premium-leather-wallet',
        title: 'Premium Leather Wallet',
        oldPrice: '৳ 2,450',
        salePrice: '৳ 1,850',
        offBadge: '৳ 600 OFF',
        image: 'https://cdn.believers.com.bd/product_image/2026/january/634/product_hover-634-20260120050104.jpg?v=1768885264',
    },
    {
        slug: 'classic-leather-belt',
        title: 'Classic Leather Belt',
        oldPrice: '৳ 1,950',
        salePrice: '৳ 1,450',
        offBadge: '৳ 500 OFF',
        image: 'https://cdn.believers.com.bd/product_image/2026/january/653/product_hover-653-20260120060542.jpg?v=1768889142',
    },
    {
        slug: 'travel-sling-bag',
        title: 'Travel Sling Bag',
        oldPrice: '৳ 3,200',
        salePrice: '৳ 2,700',
        offBadge: '৳ 500 OFF',
        image: 'https://cdn.believers.com.bd/product_image/2026/january/639/product_hover-639-20260120051841.jpg?v=1768886321',
    },
    {
        slug: 'leather-messenger-bag',
        title: 'Leather Messenger Bag',
        oldPrice: '৳ 4,850',
        salePrice: '৳ 4,050',
        offBadge: '৳ 800 OFF',
        image: 'https://cdn.believers.com.bd/product_image/2026/january/641/product_hover-641-20260120052513.jpg?v=1768886713',
    },
    {
        slug: 'smart-casual-backpack',
        title: 'Smart Casual Backpack',
        oldPrice: '৳ 5,500',
        salePrice: '৳ 4,900',
        offBadge: '৳ 600 OFF',
        image: 'https://cdn.believers.com.bd/product_image/2026/january/646/product_hover-646-20260120054322.jpg?v=1768887802',
    },
];

export function SecondaryProductGridSection() {
    return (
        <section className="bg-[#f3f4f6] pt-2 pb-4 sm:pt-3 sm:pb-6 lg:pt-4 lg:pb-8">
            <div className="mx-auto max-w-[1440px]">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 xl:grid-cols-5">
                    {products.map((product) => (
                        <Link
                            key={product.image}
                            href={route('products.show', product.slug)}
                            className="block h-full overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm transition-transform duration-300 hover:-translate-y-1"
                        >
                            <div className="flex h-full min-h-[340px] flex-col">
                                <div className="flex-1">
                                    <img
                                        src={product.image}
                                        alt={product.title}
                                        className="h-[220px] w-full object-cover"
                                        loading="lazy"
                                    />
                                </div>

                                <div className="px-4 pb-4 pt-3">
                                    <h3 className="text-[1.05rem] font-semibold leading-6 text-slate-950">{product.title}</h3>
                                    <div className="mt-1 text-[1.35rem] font-bold leading-none text-orange-600">{product.salePrice}</div>

                                    <div className="mt-3 flex items-center gap-3 text-sm">
                                        <span className="text-slate-500 line-through">{product.oldPrice}</span>
                                        <span className="rounded-md bg-orange-50 px-3 py-1 font-medium text-orange-600">
                                            {product.offBadge}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
