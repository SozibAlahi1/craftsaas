import { useForm } from '@inertiajs/react';
import { CheckCircle2, Phone, ShieldCheck, ShoppingBag, Truck, XCircle } from 'lucide-react';
import React from 'react';

// Common placeholder assets
const placeholderLogo = 'https://placehold.co/200x80/ffffff/266B40?text=Logo';
const placeholderProduct = 'https://placehold.co/400x300/e2e8f0/64748b?text=Product';
const placeholderSpice = 'https://placehold.co/150x150/ffffff/266B40?text=Spice';
const placeholderReviews = 'https://placehold.co/600x400/ffffff/64748b?text=Reviews';

export const PremiumHero = ({ content, styles }: any) => {
    const title = content?.headline || 'প্রিমিয়াম মিক্স মসলা';
    const subtitle = content?.subheadline || 'সঠিক উপাদানে তৈরি আমাদের স্পেশাল মসলা দিয়ে রান্নার স্বাদ বহুগুণ বাড়িয়ে নিন।';
    const logoUrl = content?.logo_url || placeholderLogo;
    const buttonText = content?.button_text || 'অর্ডার করুন';

    return (
        <section className={`relative overflow-hidden bg-[#266B40] py-12 text-white ${styles?.className || ''}`}>
            <div className="mx-auto max-w-5xl px-4 text-center">
                <img src={logoUrl} alt="Logo" className="mx-auto mb-8 h-20 rounded-full border-4 border-white object-cover shadow-lg" />
                <h1 className="mb-4 text-4xl font-black md:text-5xl">{title}</h1>
                <p className="mx-auto mb-10 max-w-2xl text-lg text-green-100 md:text-xl">{subtitle}</p>
                <div className="mb-10 flex flex-wrap justify-center gap-4 md:gap-8">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex flex-col items-center">
                            <img
                                src={content?.[`image_${i}`] || placeholderSpice}
                                className="mb-2 h-20 w-20 rounded-full border-4 border-white object-cover shadow-md md:h-24 md:w-24"
                                alt="Spice"
                            />
                        </div>
                    ))}
                </div>
                <button className="transform animate-bounce rounded-full bg-[#8b4513] px-10 py-4 text-xl font-bold text-white shadow-xl transition hover:scale-105 hover:bg-[#a0522d]">
                    {buttonText}
                </button>
            </div>
        </section>
    );
};

export const PremiumShowcase = ({ content, styles }: any) => {
    const headline = content?.headline || 'প্রিমিয়াম কোয়ালিটি মসলা \n এখন আপনার হাতের মুঠোয়';
    const description =
        content?.description ||
        'শতভাগ খাঁটি উপাদান দিয়ে তৈরি আমাদের এই স্পেশাল মিক্স মসলা আপনার রান্নার স্বাদ ও সুবাস বাড়িয়ে তুলবে কয়েকগুণ। আজই সংগ্রহ করুন।';
    const productImg = content?.product_image || placeholderProduct;
    const buttonText = content?.button_text || 'অর্ডার করুন';

    return (
        <section className={`bg-[#fafdfa] py-16 ${styles?.className || ''}`}>
            <div className="mx-auto flex max-w-5xl flex-col items-center gap-10 px-4 md:flex-row">
                <div className="flex-1 text-center md:text-left">
                    <h2 className="mb-6 text-3xl leading-tight font-black whitespace-pre-line text-[#266B40] md:text-4xl">{headline}</h2>
                    <p className="mb-8 text-lg text-slate-600">{description}</p>
                    <button className="rounded-full bg-[#8b4513] px-8 py-3 text-xl font-bold text-white shadow-lg transition hover:scale-105 hover:bg-[#a0522d]">
                        {buttonText}
                    </button>
                </div>
                <div className="flex flex-1 justify-center">
                    <img src={productImg} alt="Product Showcase" className="h-auto max-w-full rounded-xl object-cover drop-shadow-2xl" />
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
        <section className={`bg-white py-16 ${styles?.className || ''}`}>
            <div className="mx-auto max-w-4xl px-4 text-center">
                <h2 className="mb-10 text-3xl font-black text-slate-800">
                    <span className="text-[#FFC107]">{titleHighlight}</span> {titleRest}
                </h2>
                <div className="mb-12 grid grid-cols-3 justify-items-center gap-x-4 gap-y-8 md:grid-cols-5">
                    {spices.map((name: string, i: number) => (
                        <div key={i} className="flex flex-col items-center">
                            <img
                                src={content?.[`spice_img_${i}`] || placeholderSpice}
                                className="mb-3 h-20 w-20 rounded-full border-4 border-[#F2F9F1] object-cover shadow-sm"
                                alt={name}
                            />
                            <span className="font-bold text-slate-700">{name.trim()}</span>
                        </div>
                    ))}
                </div>
                <button className="rounded-full bg-[#8b4513] px-10 py-3 text-xl font-bold text-white shadow-lg transition hover:scale-105 hover:bg-[#a0522d]">
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
        <section className={`bg-[#1f5a34] py-6 text-white ${styles?.className || ''}`}>
            <div className="mx-auto max-w-6xl px-4">
                <div className="grid grid-cols-2 gap-6 text-center md:grid-cols-4">
                    <div className="flex flex-col items-center justify-center">
                        <Truck className="mb-2 h-8 w-8 text-[#FFC107]" />
                        <span className="text-sm font-bold">{f1}</span>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        <ShieldCheck className="mb-2 h-8 w-8 text-[#FFC107]" />
                        <span className="text-sm font-bold">{f2}</span>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        <CheckCircle2 className="mb-2 h-8 w-8 text-[#FFC107]" />
                        <span className="text-sm font-bold">{f3}</span>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        <Phone className="mb-2 h-8 w-8 text-[#FFC107]" />
                        <span className="text-sm font-bold">{f4}</span>
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
    const pros = content?.pros
        ? Array.isArray(content.pros)
            ? content.pros
            : content.pros.split('\n')
        : ['১০০% খাঁটি ও তাজা', 'কোন কৃত্রিম রং বা ফ্লেভার নেই', 'সঠিক ওজনের নিশ্চয়তা', 'স্বাস্থ্যসম্মত পরিবেশে তৈরি'];
    const cons = content?.cons
        ? Array.isArray(content.cons)
            ? content.cons
            : content.cons.split('\n')
        : ['ভেজাল ও পুরোনো', 'কেমিক্যাল ও ক্ষতিকর রং যুক্ত', 'ওজনে কম দেওয়ার প্রবণতা', 'অস্বাস্থ্যকর পরিবেশে প্যাক করা'];
    const productImg = content?.product_image || placeholderProduct;

    return (
        <section className={`bg-[#fafdfa] py-16 ${styles?.className || ''}`}>
            <div className="mx-auto max-w-5xl px-4">
                <div className="mb-12 text-center">
                    <span className="inline-block rounded-full bg-[#266B40] px-6 py-2 text-xl font-bold text-white shadow-md">{title}</span>
                </div>
                <div className="flex flex-col items-center justify-center gap-8 md:flex-row">
                    <div className="w-full flex-1 rounded-2xl border border-green-100 bg-white p-6 shadow-sm">
                        <h3 className="mb-6 text-center text-xl font-black text-[#266B40]">{proTitle}</h3>
                        <ul className="space-y-4">
                            {pros.map((item: string, i: number) => (
                                <li key={i} className="flex items-start gap-3">
                                    <CheckCircle2 className="h-6 w-6 flex-shrink-0 text-[#266B40]" />
                                    <span className="font-bold text-slate-700">{item.trim()}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="relative z-10 hidden w-48 flex-shrink-0 scale-125 md:block">
                        <img src={productImg} alt="Comparison Product" className="h-auto w-full rounded-lg object-cover drop-shadow-xl" />
                    </div>
                    <div className="w-full flex-1 rounded-2xl border border-red-50 bg-white p-6 shadow-sm">
                        <h3 className="mb-6 text-center text-xl font-black text-red-500">{conTitle}</h3>
                        <ul className="space-y-4">
                            {cons.map((item: string, i: number) => (
                                <li key={i} className="flex items-start gap-3">
                                    <XCircle className="h-6 w-6 flex-shrink-0 text-red-500" />
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
        <section className={`bg-[#266B40] py-16 ${styles?.className || ''}`}>
            <div className="mx-auto max-w-3xl px-4 text-center">
                <span className="mb-10 inline-block rounded-full bg-white px-6 py-2 text-xl font-bold text-[#266B40] shadow-md">{title}</span>
                <div className="rounded-2xl bg-white p-4 shadow-xl">
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
        full_name: '',
        phone: '',
        address: '',
        payment_method: 'cod',
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
            <section className="border-b border-[#266B40] bg-[#1f5a34] py-4 text-white">
                <div className="mx-auto flex max-w-5xl flex-col items-center justify-center gap-4 px-4 text-center sm:flex-row">
                    <Phone className="h-6 w-6" />
                    <span className="text-xl font-bold">সরাসরি কল করে অর্ডার করুন:</span>
                    <a href={`tel:${phoneContact}`} className="text-2xl font-black tracking-wider text-[#FFC107]">
                        {phoneContact}
                    </a>
                </div>
            </section>

            {/* Form */}
            <section className="bg-[#F2F9F1] py-16">
                <div className="mx-auto max-w-3xl px-4">
                    <div className="mb-8 text-center">
                        <span className="inline-block rounded-full bg-[#266B40] px-8 py-3 text-2xl font-black text-white shadow-lg">{title}</span>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-green-100 bg-white shadow-xl">
                        <div className="flex items-center justify-between border-b border-green-100 bg-green-50 p-4">
                            <div className="flex items-center gap-3">
                                <img src={productImg} alt="Product" className="h-16 w-16 rounded-md border border-green-200 object-cover" />
                                <div>
                                    <h4 className="text-lg font-bold text-slate-800">{productName}</h4>
                                    <p className="font-black text-[#266B40]">৳{price}</p>
                                </div>
                            </div>
                            <div className="hidden text-right sm:block">
                                <p className="text-sm font-bold text-slate-500">Total Delivery Charge: ৳{shipping}</p>
                                <p className="text-lg font-black text-slate-900">Total: ৳{Number(price) + Number(shipping)}</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6 p-6 md:p-8">
                            <div>
                                <label className="mb-2 block text-sm font-bold text-slate-700">আপনার নাম (Full Name)</label>
                                <input
                                    type="text"
                                    className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3"
                                    placeholder="আপনার সম্পূর্ণ নাম লিখুন"
                                    disabled={window.location.pathname.includes('/admin')}
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-bold text-slate-700">মোবাইল নাম্বার (Phone Number)</label>
                                <input
                                    type="tel"
                                    className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3"
                                    placeholder="০১৭XXXXXXXX"
                                    disabled={window.location.pathname.includes('/admin')}
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-bold text-slate-700">সম্পূর্ণ ঠিকানা (Full Address)</label>
                                <textarea
                                    rows={3}
                                    className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3"
                                    placeholder="গ্রাম/মহল্লা, থানা, জেলা"
                                    disabled={window.location.pathname.includes('/admin')}
                                ></textarea>
                            </div>
                            <button
                                type="button"
                                className="mt-6 flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-[#266B40] py-4 text-xl font-black text-white opacity-90 shadow-lg"
                            >
                                <ShoppingBag className="h-6 w-6" />
                                অর্ডার কনফার্ম করুন
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
};
