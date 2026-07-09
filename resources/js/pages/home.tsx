import { BannerCarousel } from '@/components/banner-carousel';
import { FeaturedTiles } from '@/components/featured-tiles';
import { StorefrontFooter } from '@/components/storefront-footer';
import { StorefrontHeader } from '@/components/storefront-header';
import { Head } from '@inertiajs/react';

export default function Home({ homeCategories, featuredTiles, banners }: { homeCategories: any[]; featuredTiles: any[]; banners: any[] }) {
    return (
        <>
            <Head title="Home" />
            <main className="bg-background text-foreground">
                <StorefrontHeader />
                <BannerCarousel banners={banners} />
                <FeaturedTiles categories={homeCategories} tiles={featuredTiles} />
                <StorefrontFooter />
            </main>
        </>
    );
}
