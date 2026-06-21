import { Link } from '@inertiajs/react';

const products = [
    {
        slug: 'galaxy-s26-ultra-5g',
        name: 'Galaxy S26 Ultra 5G',
        price: '৳ 128,500',
        oldPrice: '৳ 136,000',
        discount: '৳ 7,500 OFF',
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80',
    },
    {
        slug: 'nothing-phone-4a-pro',
        name: 'Nothing Phone (4a) Pro',
        price: '৳ 58,500',
        oldPrice: '',
        discount: '',
        image: 'https://images.unsplash.com/photo-1510557880182-3a3c6d7a0f2c?auto=format&fit=crop&w=900&q=80',
    },
    {
        slug: 'galaxy-a57-5g',
        name: 'Galaxy A57 5G',
        price: '৳ 48,500',
        oldPrice: '',
        discount: '',
        image: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=900&q=80',
    },
    {
        slug: 'xiaomi-pad-7',
        name: 'Xiaomi Pad 7',
        price: '৳ 38,500',
        oldPrice: '৳ 42,000',
        discount: '৳ 3,500 OFF',
        image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9b?auto=format&fit=crop&w=900&q=80',
    },
    {
        slug: 'samsung-galaxy-s24',
        name: 'Samsung Galaxy S24',
        price: '৳ 96,500',
        oldPrice: '৳ 102,000',
        discount: '৳ 5,500 OFF',
        image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=900&q=80',
    },
];

export function ProductGridSection() {
    return (
        <section className="bg-[#f3f4f6] pt-4 pb-2 sm:pt-5 sm:pb-3 lg:pt-6 lg:pb-4">
            <div className="mx-auto max-w-[1440px]">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 xl:grid-cols-5">
                    {products.map((product) => (
                        <Link
                            key={product.name}
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
                                        {product.oldPrice && <span className="text-slate-500 line-through">{product.oldPrice}</span>}
                                        {product.discount && (
                                            <span className="rounded-md bg-orange-50 px-3 py-1 font-medium text-orange-600">
                                                {product.discount}
                                            </span>
                                        )}
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
