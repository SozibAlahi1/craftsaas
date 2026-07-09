import { Link } from '@inertiajs/react';

const categoryBannerImage = 'https://cdn.believers.com.bd/category_image/2025/october/2/category_image-2-20251008131600.jpg?v=1759929360';

export function CategoryBannerSection() {
    return (
        <section className="bg-[#f3f4f6] py-4 sm:py-6 lg:py-8">
            <div className="mx-auto max-w-[1440px]">
                <Link
                    href={route('home')}
                    className="block overflow-hidden rounded-[7px] bg-white transition-transform duration-300 hover:-translate-y-1"
                    aria-label="Open category"
                >
                    <img src={categoryBannerImage} alt="Category" className="h-auto w-full object-cover" loading="lazy" />
                </Link>
            </div>
        </section>
    );
}
