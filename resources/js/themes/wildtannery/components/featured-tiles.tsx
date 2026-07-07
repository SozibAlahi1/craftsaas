import { Link } from '@inertiajs/react';
import { ProductCard, type Product } from './product-card';
import { YouTubeReelsSection } from '@/components/youtube-reels-section';

type FeaturedTile = {
    id: number;
    title: string | null;
    image: string;
    link: string | null;
};

type Category = {
    id: number;
    name: string;
    slug: string;
    banner_image: string | null;
    products: Product[];
    video_reels?: any[];
};

interface FeaturedTilesProps {
    categories?: Category[];
    tiles?: FeaturedTile[];
}

export function FeaturedTiles({ categories = [], tiles = [] }: FeaturedTilesProps) {
    return (
        <div className="bg-[#0B0E14]">
            {/* Top Promotional Tiles Grid */}
            {tiles.length > 0 && (
                <section className="px-4 py-8 lg:px-8 lg:py-12">
                    <div className="mx-auto max-w-[1440px]">
                        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
                            {tiles.map((tile) => (
                                <Link
                                    key={tile.id}
                                    href={tile.link || route('products.index')}
                                    className="group relative block overflow-hidden rounded-2xl bg-[#131826] shadow-xl transition-all hover:scale-[1.02] border border-slate-800"
                                >
                                    <div className="relative aspect-[4/3] w-full">
                                        <img 
                                            src={tile.image} 
                                            alt={tile.title || 'Promotional Offer'} 
                                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[8000ms] group-hover:scale-110 opacity-70 group-hover:opacity-90" 
                                            loading="lazy" 
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14]/80 via-transparent to-[#0B0E14]/30" />
                                        
                                        {tile.title && (
                                            <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                                                <h3 className="text-sm lg:text-base font-black uppercase tracking-widest text-white drop-shadow-md bg-[#0B0E14]/80 backdrop-blur-sm px-6 py-2 rounded-full border border-slate-700">
                                                    {tile.title}
                                                </h3>
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
            
            {/* Category Products */}
            {categories.map((category) => (
                <div key={category.id} className="bg-[#0B0E14]">
                    <section className="px-4 py-12 lg:px-8 lg:py-16 mx-auto max-w-[1440px]">
                        
                        {/* Section Header */}
                        <div className="mb-10 flex items-center justify-center gap-6">
                            <div className="h-px bg-slate-700/50 flex-1 max-w-[120px]"></div>
                            <h2 className="text-2xl font-bold tracking-wide text-white">
                                {category.name}
                            </h2>
                            <div className="h-px bg-slate-700/50 flex-1 max-w-[120px]"></div>
                        </div>

                        {/* Category Banner (If exists) */}
                        {category.banner_image && (
                            <Link 
                                href={route('products.index', { category: category.name })}
                                className="group mb-10 block overflow-hidden rounded-2xl shadow-xl border border-slate-800"
                            >
                                <img 
                                    src={category.banner_image} 
                                    alt={category.name} 
                                    className="h-auto w-full object-cover transition-transform duration-1000 group-hover:scale-[1.02] opacity-90 group-hover:opacity-100"
                                    loading="lazy"
                                />
                            </Link>
                        )}

                        {/* Product Grid */}
                        {category.products && category.products.length > 0 ? (
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 lg:gap-6">
                                {category.products.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-center py-10 text-slate-500">No products available in this category yet.</p>
                        )}
                        
                        <div className="mt-10 text-center flex justify-center">
                            <Link 
                                href={route('products.index', { category: category.name })}
                                className="inline-flex h-10 items-center justify-center text-xs font-semibold uppercase tracking-wider text-blue-500 hover:text-white hover:underline underline-offset-4"
                            >
                                View All {category.name}
                            </Link>
                        </div>
                    </section>

                    {/* YouTube Reels Section */}
                    {category.video_reels && category.video_reels.length > 0 && (
                        <div className="mx-auto max-w-[1440px] px-4 pb-12 lg:px-8 lg:pb-16 border-t border-slate-800/30 pt-12 mt-4">
                            <div className="mb-10 flex items-center justify-center gap-6">
                                <div className="h-px bg-slate-700/50 flex-1 max-w-[120px]"></div>
                                <h2 className="text-2xl font-bold tracking-wide text-white">
                                    Related Videos
                                </h2>
                                <div className="h-px bg-slate-700/50 flex-1 max-w-[120px]"></div>
                            </div>
                            <YouTubeReelsSection reels={category.video_reels} />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
