import { Link } from '@inertiajs/react';

import { CategoryBannerSection } from '@/components/category-banner-section';
import { YouTubeReelsSection } from '@/components/youtube-reels-section';

type FeaturedCollection = {
    image: string;
};

const featuredCollections: FeaturedCollection[] = [
    { image: 'https://ssbleather.com/wp-content/uploads/2026/01/shoe.png' },
    { image: 'https://ssbleather.com/wp-content/uploads/2026/01/bag.png' },
    { image: 'https://ssbleather.com/wp-content/uploads/2026/01/belt.png' },
    { image: 'https://ssbleather.com/wp-content/uploads/2026/01/wallet.png' },
    { image: 'https://ssbleather.com/wp-content/uploads/2026/01/women-bag.png' },
    { image: 'https://ssbleather.com/wp-content/uploads/2026/01/women-shoes.png' },
    { image: 'https://ssbleather.com/wp-content/uploads/2026/01/bagpack.png' },
    { image: 'https://ssbleather.com/wp-content/uploads/2026/01/sandal.png' },
];

export function FeaturedCollections() {
    return (
        <section className="bg-[#f3f4f6] py-8 sm:py-10 lg:py-14">
            <div className="mx-auto max-w-[1440px]">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {featuredCollections.map((collection) => (
                        <Link
                            key={collection.image}
                            href={route('home')}
                            className="group relative overflow-hidden rounded-[7px] bg-white transition-transform duration-300 hover:-translate-y-1"
                        >
                            <div className="relative aspect-square overflow-hidden rounded-[7px] bg-white">
                                <img
                                    src={collection.image}
                                    alt=""
                                    className="absolute inset-0 h-full w-full object-cover"
                                    loading="lazy"
                                />
                            </div>
                        </Link>
                    ))}
                </div>
                <YouTubeReelsSection />
                <CategoryBannerSection />
            </div>
        </section>
    );
}
