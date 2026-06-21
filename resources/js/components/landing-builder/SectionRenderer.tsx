import React from 'react';
import { 
    PremiumHero, 
    PremiumShowcase, 
    PremiumSpiceGrid, 
    PremiumFeatures, 
    PremiumComparison, 
    PremiumReviews, 
    PremiumCheckout 
} from './PremiumSections';

// Extremely basic placeholders for the builder.
// In a real application, these would be rich components rendering dynamic content and styles.

const HeroSection = ({ content, styles }: any) => (
    <div className={`p-24 text-center bg-slate-900 text-white ${styles?.className || ''}`}>
        <h1 className="text-5xl font-black mb-4">{content?.headline || 'Hero Headline'}</h1>
        <p className="text-xl text-slate-300 mb-8">{content?.subheadline || 'Subheadline goes here.'}</p>
        <button className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 rounded-full font-bold">
            {content?.cta || 'Shop Now'}
        </button>
    </div>
);

const ProductShowcase = ({ content, styles }: any) => (
    <div className={`p-12 max-w-7xl mx-auto ${styles?.className || ''}`}>
        <h2 className="text-3xl font-black text-center mb-8">{content?.headline || 'Featured Products'}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1,2,3,4].map(i => (
                <div key={i} className="border border-slate-200 rounded-xl p-4 text-center">
                    <div className="bg-slate-100 aspect-square rounded-lg mb-4"></div>
                    <h3 className="font-bold">Product Name</h3>
                    <p className="text-indigo-600 font-bold">$99.00</p>
                </div>
            ))}
        </div>
    </div>
);

const GenericPlaceholder = ({ type }: { type: string }) => (
    <div className="p-16 text-center bg-slate-50 border-y border-slate-200">
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
