import { SectionRenderer } from '@/components/landing-builder/SectionRenderer';
import { Head } from '@inertiajs/react';

interface Page {
    id: number;
    title: string;
    slug: string;
    status: string;
    settings: any;
    sections: any[];
}

export default function Show({ page }: { page: Page }) {
    // If we had a custom theme or font in settings, we would apply it here
    // e.g. <div className={`theme-${page.settings?.theme} font-${page.settings?.font}`}>

    return (
        <div className="min-h-screen bg-white">
            <Head>
                <title>{page.title}</title>
                {/* Meta tags for SEO would go here based on page.meta */}
                {page.meta?.description && <meta name="description" content={page.meta.description} />}
                {page.meta?.og_image && <meta property="og:image" content={page.meta.og_image} />}
            </Head>

            <main>
                {page.sections.length === 0 ? (
                    <div className="py-32 text-center text-slate-500">This page has no sections yet.</div>
                ) : (
                    page.sections.map((section) => <SectionRenderer key={section.id} section={section} />)
                )}
            </main>
        </div>
    );
}
