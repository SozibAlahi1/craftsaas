import { Link } from '@inertiajs/react';

import { CategoryProductSection } from '@/components/category-product-section';
import { YouTubeReelsSection } from '@/components/youtube-reels-section';

type FeaturedTile = {
    image: string;
};

export function FeaturedTiles({ categories = [], tiles = [] }: { categories?: any[]; tiles?: any[] }) {
    return (
        <section className="bg-[#f3f4f6] px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
            <div className="mx-auto max-w-[1440px]">
                {tiles.length > 0 && (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {tiles.map((tile) => (
                            <Link
                                key={tile.id}
                                href={tile.link || route('home')}
                                className="group relative overflow-hidden rounded-md bg-white transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
                            >
                                <div className="relative aspect-square overflow-hidden rounded-md bg-white">
                                    <img
                                        src={tile.image}
                                        alt={tile.title || ''}
                                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/5" />
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {categories.map((category) => (
                    <div key={category.id}>
                        <CategoryProductSection category={category} />
                        {category.video_reels && category.video_reels.length > 0 && <YouTubeReelsSection reels={category.video_reels} />}
                    </div>
                ))}
            </div>
        </section>
    );
}
