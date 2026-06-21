import React from 'react';
import { Truck, ShieldCheck, Phone, CheckCircle2, XCircle, ShoppingBag } from 'lucide-react';
import { useForm } from '@inertiajs/react';

// Common placeholder assets
const placeholderLogo = "https://placehold.co/200x80/ffffff/266B40?text=Logo";
const placeholderProduct = "https://placehold.co/400x300/e2e8f0/64748b?text=Product";
const placeholderSpice = "https://placehold.co/150x150/ffffff/266B40?text=Spice";
const placeholderReviews = "https://placehold.co/600x400/ffffff/64748b?text=Reviews";

export const PremiumHero = ({ content, styles }: any) => {
    const title = content?.headline || 'প্রিমিয়াম মিক্স মসলা';
    const subtitle = content?.subheadline || 'সঠিক উপাদানে তৈরি আমাদের স্পেশাল মসলা দিয়ে রান্নার স্বাদ বহুগুণ বাড়িয়ে নিন।';
    const logoUrl = content?.logo_url || placeholderLogo;
    const buttonText = content?.button_text || 'অর্ডার করুন';

    return (
        <section className={`bg-[#266B40] text-white py-12 relative overflow-hidden ${styles?.className || ''}`}>
            <div className="max-w-5xl mx-auto px-4 text-center">
                <img src={logoUrl} alt="Logo" className="mx-auto h-20 rounded-full mb-8 border-4 border-white shadow-lg object-cover" />
                <h1 className="text-4xl md:text-5xl font-black mb-4">{title}</h1>
                <p className="text-lg md:text-xl text-green-100 mb-10 max-w-2xl mx-auto">{subtitle}</p>
                <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-10">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex flex-col items-center">
                            <img src={content?.[`image_${i}`] || placeholderSpice} className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-white shadow-md mb-2 object-cover" alt="Spice" />
                        </div>
                    ))}
                </div>
                <button className="bg-[#8b4513] hover:bg-[#a0522d] text-white text-xl font-bold py-4 px-10 rounded-full shadow-xl transform transition hover:scale-105 animate-bounce">
                    {buttonText}
                </button>
            </div>
        </section>
    );
};

export const PremiumShowcase = ({ content, styles }: any) => {
    const headline = content?.headline || 'প্রিমিয়াম কোয়ালিটি মসলা \n এখন আপনার হাতের মুঠোয়';
    const description = content?.description || 'শতভাগ খাঁটি উপাদান দিয়ে তৈরি আমাদের এই স্পেশাল মিক্স মসলা আপনার রান্নার স্বাদ ও সুবাস বাড়িয়ে তুলবে কয়েকগুণ। আজই সংগ্রহ করুন।';
    const productImg = content?.product_image || placeholderProduct;
    const buttonText = content?.button_text || 'অর্ডার করুন';

    return (
        <section className={`py-16 bg-[#fafdfa] ${styles?.className || ''}`}>
            <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center gap-10">
                <div className="flex-1 text-center md:text-left">
                    <h2 className="text-3xl md:text-4xl font-black text-[#266B40] mb-6 leading-tight whitespace-pre-line">
                        {headline}
                    </h2>
                    <p className="text-lg text-slate-600 mb-8">{description}</p>
                    <button className="bg-[#8b4513] hover:bg-[#a0522d] text-white text-xl font-bold py-3 px-8 rounded-full shadow-lg transition hover:scale-105">
                        {buttonText}
                    </button>
                </div>
                <div className="flex-1 flex justify-center">
                    <img src={productImg} alt="Product Showcase" className="max-w-full h-auto drop-shadow-2xl rounded-xl object-cover" />
                </div>
            </div>
        </section>
    );
};

export const PremiumSpiceGrid = ({ content, styles }: any) => {
    const titleHighlight = content?.title_highlight || '৯ টি';
    const titleRest = content?.title_rest || 'ভিন্ন মসলার সমাহার';
    const buttonText = content?.button_text || 'অর্ডার করুন';
    
    // Default 9 spices
    const defaultSpices = ['হলুদ', 'মরিচ', 'ধনিয়া', 'জিরা', 'আদা', 'রসুন', 'দারুচিনি', 'এলাচ', 'লবঙ্গ'];
    const spices = content?.spices ? (Array.isArray(content.spices) ? content.spices : content.spices.split(',')) : defaultSpices;

    return (
        <section className={`py-16 bg-white ${styles?.className || ''}`}>
            <div className="max-w-4xl mx-auto px-4 text-center">
                <h2 className="text-3xl font-black text-slate-800 mb-10">
                    <span className="text-[#FFC107]">{titleHighlight}</span> {titleRest}
                </h2>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-y-8 gap-x-4 mb-12 justify-items-center">
                    {spices.map((name: string, i: number) => (
                        <div key={i} className="flex flex-col items-center">
                            <img src={content?.[`spice_img_${i}`] || placeholderSpice} className="w-20 h-20 rounded-full border-4 border-[#F2F9F1] shadow-sm mb-3 object-cover" alt={name} />
                            <span className="font-bold text-slate-700">{name.trim()}</span>
                        </div>
                    ))}
                </div>
                <button className="bg-[#8b4513] hover:bg-[#a0522d] text-white text-xl font-bold py-3 px-10 rounded-full shadow-lg transition hover:scale-105">
                    {buttonText}
                </button>
            </div>
        </section>
    );
};

export const PremiumFeatures = ({ content, styles }: any) => {
    const f1 = content?.feature_1 || 'সারা দেশে ডেলিভারি';
    const f2 = content?.feature_2 || '১০০% খাঁটি পণ্য';
    const f3 = content?.feature_3 || 'মানসম্মত প্যাকিং';
    const f4 = content?.feature_4 || '২৪/৭ সাপোর্ট';

    return (
        <section className={`bg-[#1f5a34] text-white py-6 ${styles?.className || ''}`}>
            <div className="max-w-6xl mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    <div className="flex flex-col items-center justify-center">
                        <Truck className="h-8 w-8 mb-2 text-[#FFC107]" />
                        <span className="font-bold text-sm">{f1}</span>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        <ShieldCheck className="h-8 w-8 mb-2 text-[#FFC107]" />
                        <span className="font-bold text-sm">{f2}</span>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        <CheckCircle2 className="h-8 w-8 mb-2 text-[#FFC107]" />
                        <span className="font-bold text-sm">{f3}</span>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        <Phone className="h-8 w-8 mb-2 text-[#FFC107]" />
                        <span className="font-bold text-sm">{f4}</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export const PremiumComparison = ({ content, styles }: any) => {
    const title = content?.headline || 'কেন আমাদের মসলা?';
    const proTitle = content?.pro_title || 'আমাদের মসলা';
    const conTitle = content?.con_title || 'অন্যান্য মসলা';
    const pros = content?.pros ? (Array.isArray(content.pros) ? content.pros : content.pros.split('\n')) : ['১০০% খাঁটি ও তাজা', 'কোন কৃত্রিম রং বা ফ্লেভার নেই', 'সঠিক ওজনের নিশ্চয়তা', 'স্বাস্থ্যসম্মত পরিবেশে তৈরি'];
    const cons = content?.cons ? (Array.isArray(content.cons) ? content.cons : content.cons.split('\n')) : ['ভেজাল ও পুরোনো', 'কেমিক্যাল ও ক্ষতিকর রং যুক্ত', 'ওজনে কম দেওয়ার প্রবণতা', 'অস্বাস্থ্যকর পরিবেশে প্যাক করা'];
    const productImg = content?.product_image || placeholderProduct;

    return (
        <section className={`py-16 bg-[#fafdfa] ${styles?.className || ''}`}>
            <div className="max-w-5xl mx-auto px-4">
                <div className="text-center mb-12">
                    <span className="bg-[#266B40] text-white px-6 py-2 rounded-full font-bold text-xl inline-block shadow-md">{title}</span>
                </div>
                <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                    <div className="flex-1 bg-white p-6 rounded-2xl shadow-sm border border-green-100 w-full">
                        <h3 className="text-xl font-black text-center text-[#266B40] mb-6">{proTitle}</h3>
                        <ul className="space-y-4">
                            {pros.map((item: string, i: number) => (
                                <li key={i} className="flex items-start gap-3">
                                    <CheckCircle2 className="h-6 w-6 text-[#266B40] flex-shrink-0" />
                                    <span className="font-bold text-slate-700">{item.trim()}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="hidden md:block w-48 flex-shrink-0 relative z-10 scale-125">
                        <img src={productImg} alt="Comparison Product" className="w-full h-auto drop-shadow-xl rounded-lg object-cover" />
                    </div>
                    <div className="flex-1 bg-white p-6 rounded-2xl shadow-sm border border-red-50 w-full">
                        <h3 className="text-xl font-black text-center text-red-500 mb-6">{conTitle}</h3>
                        <ul className="space-y-4">
                            {cons.map((item: string, i: number) => (
                                <li key={i} className="flex items-start gap-3">
                                    <XCircle className="h-6 w-6 text-red-500 flex-shrink-0" />
                                    <span className="font-bold text-slate-500">{item.trim()}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
};

export const PremiumReviews = ({ content, styles }: any) => {
    const title = content?.headline || 'কাস্টমার রিভিউ';
    const reviewsImg = content?.reviews_image || placeholderReviews;

    return (
        <section className={`py-16 bg-[#266B40] ${styles?.className || ''}`}>
            <div className="max-w-3xl mx-auto px-4 text-center">
                <span className="bg-white text-[#266B40] px-6 py-2 rounded-full font-bold text-xl inline-block shadow-md mb-10">
                    {title}
                </span>
                <div className="bg-white p-4 rounded-2xl shadow-xl">
                    <img src={reviewsImg} alt="Reviews" className="w-full rounded-xl object-cover" />
                </div>
            </div>
        </section>
    );
};

export const PremiumCheckout = ({ content, styles }: any) => {
    const title = content?.headline || 'অর্ডার ফর্ম';
    const productName = content?.product_name || 'প্রিমিয়াম মিক্স মসলা';
    const price = content?.price || '1250';
    const shipping = content?.shipping || '60';
    const productImg = content?.product_image || placeholderProduct;
    const phoneContact = content?.phone_number || '01954-580988';

    // Form state (dumb form for builder preview, functional for real page)
    const { data, setData, post, processing, errors } = useForm({
        full_name: '', phone: '', address: '', payment_method: 'cod',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // The real submission logic will be handled via an event or we can just embed it if we know the product_id.
        // For the builder we just prevent default.
        if (window.location.pathname.includes('/admin')) return;
        
        // Pseudo-logic for live page:
        // axios.post(route('cart.add'), { ... }).then(() => post(route('checkout.store')))
    };

    return (
        <div className={`font-sans ${styles?.className || ''}`}>
            {/* CTA Bar */}
            <section className="bg-[#1f5a34] text-white py-4 border-b border-[#266B40]">
                <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
                    <Phone className="h-6 w-6" />
                    <span className="text-xl font-bold">সরাসরি কল করে অর্ডার করুন:</span>
                    <a href={`tel:${phoneContact}`} className="text-2xl font-black text-[#FFC107] tracking-wider">{phoneContact}</a>
                </div>
            </section>

            {/* Form */}
            <section className="py-16 bg-[#F2F9F1]">
                <div className="max-w-3xl mx-auto px-4">
                    <div className="text-center mb-8">
                        <span className="bg-[#266B40] text-white px-8 py-3 rounded-full font-black text-2xl inline-block shadow-lg">
                            {title}
                        </span>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-green-100">
                        <div className="bg-green-50 p-4 border-b border-green-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <img src={productImg} alt="Product" className="w-16 h-16 object-cover rounded-md border border-green-200" />
                                <div>
                                    <h4 className="font-bold text-slate-800 text-lg">{productName}</h4>
                                    <p className="text-[#266B40] font-black">৳{price}</p>
                                </div>
                            </div>
                            <div className="text-right hidden sm:block">
                                <p className="text-sm text-slate-500 font-bold">Total Delivery Charge: ৳{shipping}</p>
                                <p className="text-lg font-black text-slate-900">Total: ৳{(Number(price) + Number(shipping))}</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">আপনার নাম (Full Name)</label>
                                <input type="text" className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-slate-50" placeholder="আপনার সম্পূর্ণ নাম লিখুন" disabled={window.location.pathname.includes('/admin')} />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">মোবাইল নাম্বার (Phone Number)</label>
                                <input type="tel" className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-slate-50" placeholder="০১৭XXXXXXXX" disabled={window.location.pathname.includes('/admin')} />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">সম্পূর্ণ ঠিকানা (Full Address)</label>
                                <textarea rows={3} className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-slate-50" placeholder="গ্রাম/মহল্লা, থানা, জেলা" disabled={window.location.pathname.includes('/admin')}></textarea>
                            </div>
                            <button type="button" className="w-full bg-[#266B40] text-white text-xl font-black py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 mt-6 opacity-90 cursor-not-allowed">
                                <ShoppingBag className="w-6 h-6" />
                                অর্ডার কনফার্ম করুন
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
};
