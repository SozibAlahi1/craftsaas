import { Head } from '@inertiajs/react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Hero } from '../components/Hero';
import { SeriesSection } from '../components/SeriesSection';
import { FeaturedTiles } from '@/components/featured-tiles'; // We can reuse the default one or create a custom one

export default function Home({ homeCategories, featuredTiles, banners }: { homeCategories: any[], featuredTiles: any[], banners: any[] }) {
    // If we want to inject a custom comparison section, we could do it between categories
    
    return (
        <div className="bg-black min-h-screen text-white font-sans selection:bg-[#cba876] selection:text-black">
            <Head title="Home" />
            
            <Header />
            
            <main>
                <Hero banners={banners} />
                
                {/* Render each category as a Series Section */}
                {homeCategories.map((category, index) => (
                    <div key={category.id}>
                        <SeriesSection category={category} />
                        
                        {/* Insert FeaturedTiles after the first category to break the layout nicely */}
                        {index === 0 && featuredTiles && featuredTiles.length > 0 && (
                            <section className="py-16 bg-[#050505] border-y border-[#111111]">
                                <div className="container mx-auto px-4">
                                    <div className="flex items-center justify-center mb-10">
                                        <h3 className="text-2xl font-serif-display text-white uppercase tracking-widest">
                                            <span className="text-[#cba876]">Featured</span> Collections
                                        </h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {featuredTiles.map((tile: any) => (
                                            <a key={tile.id} href={tile.link || '#'} className="group block relative overflow-hidden rounded-lg aspect-video">
                                                <img 
                                                    src={tile.image} 
                                                    alt={tile.title || 'Featured Collection'} 
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                                                    <h4 className="text-white text-xl font-medium tracking-wide uppercase">{tile.title || ''}</h4>
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        )}
                    </div>
                ))}
                
                {/* Information / Partner section (using default static layout but text could be dynamic if we had DB fields) */}
                <section className="py-20 bg-black border-t border-[#111111]">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl font-serif-display font-bold mb-12">
                            Our Corporate <span className="text-[#cba876]">Partners</span>
                        </h2>
                        {/* Mocking partners since they aren't in DB yet, or could use settings if available */}
                        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                            <span className="text-2xl font-bold tracking-widest uppercase">Forbes</span>
                            <span className="text-2xl font-bold tracking-widest uppercase">GQ</span>
                            <span className="text-2xl font-bold tracking-widest uppercase">Vogue</span>
                            <span className="text-2xl font-bold tracking-widest uppercase">Esquire</span>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
