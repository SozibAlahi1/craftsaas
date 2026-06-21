import { Link } from '@inertiajs/react';

const additionalProducts = [
    {
        name: 'iPhone 16 Pro Max',
        price: '৳ 145,000',
        oldPrice: '৳ 152,000',
        discount: '৳ 7,000 OFF',
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80',
    },
    {
        name: 'Google Pixel 9 Pro',
        price: '৳ 112,500',
        oldPrice: '',
        discount: '',
        image: 'https://images.unsplash.com/photo-1510557880182-3a3c6d7a0f2c?auto=format&fit=crop&w=900&q=80',
    },
    {
        name: 'Samsung Galaxy Fold',
        price: '৳ 189,500',
        oldPrice: '',
        discount: '',
        image: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=900&q=80',
    },
    {
        name: 'Apple iPad Pro',
        price: '৳ 98,500',
        oldPrice: '৳ 104,000',
        discount: '৳ 5,500 OFF',
        image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9b?auto=format&fit=crop&w=900&q=80',
    },
    {
        name: 'Nothing Phone (3)',
        price: '৳ 72,000',
        oldPrice: '',
        discount: '',
        image: 'https://images.unsplash.com/photo-1518444028785-8f8f1c7f1c6a?auto=format&fit=crop&w=900&q=80',
    },
];

export function AdditionalProductGridSection() {
    return (
        <section className="bg-[#f3f4f6] py-8 sm:py-10 lg:py-14">
            <div className="mx-auto max-w-[1440px]">
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                    {additionalProducts.map((product) => (
                        <Link
                            key={product.name}
                            href={route('home')}
                            className="block h-full overflow-hidden rounded-[10px] border border-slate-200 bg-white shadow-[0_2px_8px_rgba(15,23,42,0.04)] transition-transform duration-300 hover:-translate-y-1"
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
                                    <div className="mt-2 text-[1.35rem] font-bold leading-none text-slate-950">{product.price}</div>

                                    <div className="mt-3 flex items-center gap-3 text-sm">
                                        {product.oldPrice && <span className="text-slate-500 line-through">{product.oldPrice}</span>}
                                        {product.discount && (
                                            <span className="rounded-full bg-emerald-100 px-3 py-1 font-medium text-emerald-600">
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
