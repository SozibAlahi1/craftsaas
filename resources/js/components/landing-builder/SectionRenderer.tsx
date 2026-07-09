import {
    PremiumCheckout,
    PremiumComparison,
    PremiumFeatures,
    PremiumHero,
    PremiumReviews,
    PremiumShowcase,
    PremiumSpiceGrid,
} from './PremiumSections';

// Extremely basic placeholders for the builder.
// In a real application, these would be rich components rendering dynamic content and styles.

const HeroSection = ({ content, styles }: any) => (
    <div className={`bg-slate-900 p-24 text-center text-white ${styles?.className || ''}`}>
        <h1 className="mb-4 text-5xl font-black">{content?.headline || 'Hero Headline'}</h1>
        <p className="mb-8 text-xl text-slate-300">{content?.subheadline || 'Subheadline goes here.'}</p>
        <button className="rounded-full bg-indigo-600 px-8 py-4 font-bold hover:bg-indigo-700">{content?.cta || 'Shop Now'}</button>
    </div>
);

const ProductShowcase = ({ content, styles }: any) => (
    <div className={`mx-auto max-w-7xl p-12 ${styles?.className || ''}`}>
        <h2 className="mb-8 text-center text-3xl font-black">{content?.headline || 'Featured Products'}</h2>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="rounded-xl border border-slate-200 p-4 text-center">
                    <div className="mb-4 aspect-square rounded-lg bg-slate-100"></div>
                    <h3 className="font-bold">Product Name</h3>
                    <p className="font-bold text-indigo-600">$99.00</p>
                </div>
            ))}
        </div>
    </div>
);

const GenericPlaceholder = ({ type }: { type: string }) => (
    <div className="border-y border-slate-200 bg-slate-50 p-16 text-center">
        <h2 className="text-2xl font-black text-slate-400 capitalize">{type.replace('_', ' ')} Section</h2>
    </div>
);

export function SectionRenderer({ section }: { section: any }) {
    switch (section.type) {
        case 'hero':
            return <HeroSection content={section.content} styles={section.styles} />;
        case 'product_showcase':
            return <ProductShowcase content={section.content} styles={section.styles} />;
        case 'premium_hero':
            return <PremiumHero content={section.content} styles={section.styles} />;
        case 'premium_showcase':
            return <PremiumShowcase content={section.content} styles={section.styles} />;
        case 'premium_spice_grid':
            return <PremiumSpiceGrid content={section.content} styles={section.styles} />;
        case 'premium_features':
            return <PremiumFeatures content={section.content} styles={section.styles} />;
        case 'premium_comparison':
            return <PremiumComparison content={section.content} styles={section.styles} />;
        case 'premium_reviews':
            return <PremiumReviews content={section.content} styles={section.styles} />;
        case 'premium_checkout':
            return <PremiumCheckout content={section.content} styles={section.styles} />;
        default:
            return <GenericPlaceholder type={section.type} />;
    }
}
