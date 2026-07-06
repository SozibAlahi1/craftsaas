import { Head } from '@inertiajs/react';
import { Header } from '../components/Header';
import { StorefrontFooter as Footer } from '@/components/storefront-footer';
import { Hero } from '../components/Hero';
import { SeriesSection } from '../components/SeriesSection';

export default function Home({ homeCategories, featuredTiles, banners }: { homeCategories: any[], featuredTiles: any[], banners: any[] }) {
    // Exact mapping of Categories matching the layout row sequence in the user's screenshot:
    // 1. Shoes
    // 2. Bags
    // 3. Wallet
    // 4. Belt
    // 5. Accessories
    
    // Sort categories dynamically based on the exact sequence
    const sequence = ['shoes', 'bags', 'wallet', 'belt', 'accessories'];
    const sortedCategories = [...homeCategories].sort((a, b) => {
        const indexA = sequence.indexOf(a.slug.toLowerCase());
        const indexB = sequence.indexOf(b.slug.toLowerCase());
        const valA = indexA !== -1 ? indexA : 99;
        const valB = indexB !== -1 ? indexB : 99;
        return valA - valB;
    });
    return (
        <div className="bg-black min-h-screen text-white font-sans selection:bg-[#cba876] selection:text-black">
            <Head title="Home" />
            
            <Header />
            
            <main>
                <Hero banners={banners} />

                {/* Top Category Image-Grid (retrieved dynamically from admin panel's Featured Tiles) */}
                {featuredTiles && featuredTiles.length > 0 && (
                    <section className="py-10 bg-black select-none">
                        <div className="container mx-auto px-4 lg:px-8">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                                {featuredTiles
                                    .filter((tile: any) => tile.is_active !== false && tile.is_active !== 0)
                                    .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
                                    .map((tile: any) => {
                                        const imgUrl = tile.image.startsWith('http') ? tile.image : `/storage/${tile.image}`;
                                        
                                        return (
                                            <a 
                                                key={tile.id} 
                                                href={tile.link || '#'} 
                                                className="group block relative overflow-hidden rounded-[10px] aspect-square bg-[#0d0d0d] border border-white/5 shadow-md"
                                            >
                                                <img 
                                                    src={imgUrl} 
                                                    alt={tile.title || 'Category'} 
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                    loading="lazy"
                                                />
                                                <div className="absolute inset-0 bg-black/35 group-hover:bg-black/20 transition-all duration-300 flex items-end p-4">
                                                    <span className="text-[11px] font-black tracking-widest text-white uppercase bg-black/40 px-3 py-1.5 rounded-sm backdrop-blur-sm">
                                                        {tile.title}
                                                    </span>
                                                </div>
                                            </a>
                                        );
                                    })
                                }
                            </div>
                        </div>
                    </section>
                )}

                {/* Render Storefront Categories Rows (Shoes -> Bags -> Wallet -> Belt -> Accessories) */}
                {sortedCategories.map((category) => (
                    <SeriesSection key={category.id} category={category} />
                ))}
            </main>

            <Footer />
        </div>
    );
}
