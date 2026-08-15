import { Link, usePage } from '@inertiajs/react';
import { Anchor, ChevronRight, ChevronUp, Clock, Facebook, Mail, MapPin, Phone, PhoneCall, ShieldCheck, Sparkles, Truck, Waves, Youtube } from 'lucide-react';

export function ShutkiOceanFooter() {
    const { props } = usePage();
    const settings = props.settings as any;

    const footerDescription =
        settings?.footer_description || 'কক্সবাজার সমুদ্র উপকূলের বিষমুক্ত তাজা রোদে শুকানো প্রিমিয়াম অর্গানিক শুকটি মাছ সরাসরি আপনার দরজায়।';
    const footerFacebookUrl = settings?.footer_facebook_url || 'https://facebook.com';
    const footerYoutubeUrl = settings?.footer_youtube_url || '';
    const footerPhone = settings?.footer_phone || '01700000000';
    const footerEmail = settings?.footer_email || 'info@shutkiocean.com';
    const footerAddress = settings?.footer_address || 'কক্সবাজার সমুদ্র সৈকত সড়ক, চট্টগ্রাম, বাংলাদেশ';
    const footerCopyright = settings?.footer_copyright || `© ${new Date().getFullYear()} শুটকি ওশান প্রিমিয়াম। সর্বস্বত্ব সংরক্ষিত।`;

    const footerWhatsappUrl = settings?.footer_whatsapp_url || `https://wa.me/${footerPhone.replace(/[^0-9]/g, '')}`;

    const siteName = settings?.site_name || 'Shutki Ocean';
    const logoUrl = (settings as any)?.site_logo_url as string | undefined;

    const accountLinks =
        settings?.footer_account_links?.length > 0
            ? settings.footer_account_links
            : [
                  { label: 'আমার অ্যাকাউন্ট', url: '/dashboard' },
                  { label: 'অর্ডার ট্র্যাক করুন', url: '#' },
                  { label: 'রিফান্ড ও রিটার্ন পলিসি', url: '#' },
                  { label: 'অ্যাফিলিয়েট হিসেবে যোগ দিন', url: '#' },
                  { label: 'অভিযোগ বক্স', url: '#' },
              ];

    const informationLinks =
        settings?.footer_info_links?.length > 0
            ? settings.footer_info_links
            : [
                  { label: 'সকল শুটকি কালেকশন', url: '/products' },
                  { label: 'আমাদের শোরুম', url: '#' },
                  { label: 'আমাদের সম্পর্কে', url: '#' },
                  { label: 'প্রাইভেসি পলিসি', url: '#' },
                  { label: 'টার্মস ও কন্ডিশনস', url: '#' },
              ];

    const renderLink = (link: { label: string; url: string }) => {
        let href = link.url;
        let label = link.label;

        const labelMap: Record<string, string> = {
            'My Account': 'আমার অ্যাকাউন্ট',
            'Track My Order': 'অর্ডার ট্র্যাক করুন',
            'Refund & Returned': 'রিটার্ন ও রিফান্ড পলিসি',
            'Shipping & Return Policy': 'শিপিং ও রিটার্ন পলিসি',
            'Shop All': 'সকল শুটকি কালেকশন',
            'About Us': 'আমাদের সম্পর্কে',
            'Privacy Policy': 'প্রাইভেসি পলিসি',
            'Terms & Conditions': 'টার্মস ও কন্ডিশনস',
            'Join As Affiliate': 'অ্যাফিলিয়েট হিসেবে যোগ দিন',
            'Complain Box': 'অভিযোগ বক্স',
            'Our Showrooms': 'আমাদের শোরুম',
        };

        if (labelMap[label]) {
            label = labelMap[label];
        }

        try {
            if (href && !href.startsWith('/') && !href.startsWith('#') && !href.startsWith('http')) href = route(href);
        } catch {
            href = '/';
        }
        const cls = 'text-sm font-bold text-[#0F52BA] transition-colors hover:text-[#F97316]';
        if (href.startsWith('http')) {
            return (
                <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
                    {label}
                </a>
            );
        }
        return (
            <Link href={href} className={cls}>
                {label}
            </Link>
        );
    };

    return (
        <footer className="relative bg-gradient-to-b from-[#F4F9FF] via-[#EBF3FF] to-[#E2E8F0] font-sans text-slate-800 border-t-2 border-blue-200">
            {/* Top Ocean Wave Header Banner - Distinct Coastal Identity */}
            <div className="bg-gradient-to-r from-[#0F52BA] via-[#1E40AF] to-[#0A369D] py-10 text-white shadow-lg">
                <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        <div className="flex items-center gap-3.5 rounded-2xl bg-white/10 p-4 backdrop-blur-md border border-white/20 shadow-md">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F97316] text-white shadow-md">
                                <ShieldCheck className="h-6 w-6" />
                            </div>
                            <div>
                                <h4 className="text-sm font-black text-white">১০০% কেমিক্যাল মুক্ত</h4>
                                <p className="text-xs text-blue-100 opacity-90">ডিডিটি বা বিষ ওষুধহীন প্রসংগ</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3.5 rounded-2xl bg-white/10 p-4 backdrop-blur-md border border-white/20 shadow-md">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F97316] text-white shadow-md">
                                <Waves className="h-6 w-6" />
                            </div>
                            <div>
                                <h4 className="text-sm font-black text-white">সোনাদিয়ার তাজা রোদ</h4>
                                <p className="text-xs text-blue-100 opacity-90">উপকূলীয় বিশুদ্ধ বাতাস ও রোদ</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3.5 rounded-2xl bg-white/10 p-4 backdrop-blur-md border border-white/20 shadow-md">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F97316] text-white shadow-md">
                                <Truck className="h-6 w-6" />
                            </div>
                            <div>
                                <h4 className="text-sm font-black text-white">ভ্যাকুয়াম সিমিং প্যাক</h4>
                                <p className="text-xs text-blue-100 opacity-90">দুর্গন্ধহীন আন্তর্জাতিক প্যাকিং</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3.5 rounded-2xl bg-white/10 p-4 backdrop-blur-md border border-white/20 shadow-md">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F97316] text-white shadow-md">
                                <Phone className="h-6 w-6" />
                            </div>
                            <div>
                                <h4 className="text-sm font-black text-white">ক্যাশ অন ডেলিভারি</h4>
                                <p className="text-xs text-blue-100 opacity-90">মেপে দেখে পর পরিশোধের সুবিধা</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Distinct Footer Columns */}
            <div className="mx-auto max-w-[1440px] px-4 pt-14 pb-12 sm:px-6 lg:px-8">
                <div className="grid gap-10 items-start lg:grid-cols-[1.3fr_1fr_1fr_1.3fr]">
                    {/* Column 1: Brand & Tagline */}
                    <div>
                        <Link href={route('home')} className="mb-4 inline-flex items-center gap-2.5 group">
                            {logoUrl ? (
                                <img src={logoUrl} alt={siteName} className="h-12 w-auto object-contain" />
                            ) : (
                                <div className="flex items-center gap-2">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0F52BA] to-[#1E40AF] text-white shadow-md shadow-blue-500/30">
                                        <Anchor className="h-6 w-6" />
                                    </div>
                                    <span className="text-2xl font-black tracking-tight text-slate-900">
                                        {siteName}
                                        <span className="text-[#F97316]">.</span>
                                    </span>
                                </div>
                            )}
                        </Link>

                        <p className="mb-6 text-sm leading-7 text-slate-600 font-medium">
                            {footerDescription}
                        </p>

                        {/* Social Icons */}
                        <div className="flex items-center gap-3">
                            {footerFacebookUrl && (
                                <a
                                    href={footerFacebookUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#1877F2] text-white shadow-md transition-all hover:scale-110"
                                >
                                    <Facebook className="h-5 w-5 fill-current" />
                                </a>
                            )}
                            {footerYoutubeUrl && (
                                <a
                                    href={footerYoutubeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#FF0000] text-white shadow-md transition-all hover:scale-110"
                                >
                                    <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                    </svg>
                                </a>
                            )}
                            {footerPhone && (
                                <a
                                    href={footerWhatsappUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#25D366] text-white shadow-md transition-all hover:scale-110"
                                >
                                    <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                                        <path d="M12.031 0C5.385 0 0 5.385 0 12.031c0 2.128.552 4.195 1.6 6.012L.152 23.366l5.449-1.428A11.968 11.968 0 0012.031 24c6.646 0 12.031-5.385 12.031-12.031S18.677 0 12.031 0zm0 22.007c-1.802 0-3.567-.485-5.114-1.403l-.367-.217-3.8.995 1.014-3.705-.238-.378a9.98 9.98 0 01-1.526-5.33c0-5.513 4.488-10.001 10.031-10.001 5.514 0 10.032 4.488 10.032 10.001s-4.518 10.038-10.032 10.038zm5.501-7.514c-.302-.151-1.782-.88-2.059-.981-.277-.101-.479-.151-.681.151-.202.302-.78 1.002-.956 1.203-.176.201-.352.226-.655.075-1.528-.756-2.585-1.464-3.541-3.111-.176-.302.176-.277.756-1.436.075-.151.038-.277-.038-.428-.075-.151-.681-1.637-.932-2.241-.252-.579-.504-.504-.681-.504h-.579c-.202 0-.529.075-.806.378-.277.302-1.058 1.032-1.058 2.518 0 1.486 1.083 2.922 1.234 3.123.151.201 2.115 3.226 5.137 4.534.705.302 1.259.478 1.688.629.705.226 1.359.176 1.863.126.579-.075 1.782-.73 2.033-1.436.252-.705.252-1.309.176-1.436-.075-.126-.277-.201-.579-.352z" />
                                    </svg>
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Column 2: Mapped Links 1 */}
                    <div>
                        <h3 className="relative mb-5 inline-block text-base font-black text-[#0F52BA]">
                            অর্ডার ও হেল্প ডেস্ক
                            <span className="absolute bottom-0 left-0 h-0.5 w-full bg-[#F97316]" />
                        </h3>
                        <ul className="space-y-3">
                            {accountLinks.map((link: any, idx: number) => (
                                <li key={idx} className="group flex items-center gap-2">
                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-[#0F52BA] text-xs group-hover:bg-[#0F52BA] group-hover:text-white transition-colors">
                                        ✓
                                    </span>
                                    {renderLink(link)}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Mapped Links 2 */}
                    <div>
                        <h3 className="relative mb-5 inline-block text-base font-black text-[#0F52BA]">
                            জরুরি পলিসি ও লিংক
                            <span className="absolute bottom-0 left-0 h-0.5 w-full bg-[#F97316]" />
                        </h3>
                        <ul className="space-y-3">
                            {informationLinks.map((link: any, idx: number) => (
                                <li key={idx} className="group flex items-center gap-2">
                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-[#0F52BA] text-xs group-hover:bg-[#0F52BA] group-hover:text-white transition-colors">
                                        ✓
                                    </span>
                                    {renderLink(link)}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 4: Cox's Bazar Hub Contact Card */}
                    <div>
                        <div className="rounded-3xl border-2 border-blue-200 bg-white p-6 shadow-md shadow-blue-500/5">
                            <h3 className="mb-4 text-base font-black text-[#0F52BA] flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-[#F97316]" /> কক্সবাজার অফিস ও হটলাইন
                            </h3>

                            <div className="space-y-3 text-xs text-slate-700">
                                {footerAddress && (
                                    <div className="flex items-start gap-2.5">
                                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#0F52BA]" />
                                        <span className="leading-relaxed font-semibold">{footerAddress}</span>
                                    </div>
                                )}
                                {footerPhone && (
                                    <a
                                        href={`tel:${footerPhone}`}
                                        className="flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#F97316] to-[#EA580C] px-3.5 py-2 text-white shadow-md font-black text-sm"
                                    >
                                        <PhoneCall className="h-4 w-4" /> হটলাইন: {footerPhone}
                                    </a>
                                )}
                                {footerEmail && (
                                    <div className="flex items-center gap-2.5">
                                        <Mail className="h-4 w-4 shrink-0 text-[#0F52BA]" />
                                        <span className="font-semibold">{footerEmail}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2.5 pt-1">
                                    <Clock className="h-4 w-4 shrink-0 text-[#0F52BA]" />
                                    <span className="font-bold text-slate-900">সকাল ৮:০০ - রাত ১১:০০ (প্রতিদিন)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Dark Coastal Bar */}
            <div className="border-t border-slate-700 bg-[#0B192C] py-4 text-center text-xs text-slate-300">
                <div className="mx-auto max-w-[1440px] px-4 flex flex-col items-center justify-between gap-2 sm:flex-row">
                    <p className="font-medium">{footerCopyright}</p>
                    <div className="flex items-center gap-2 text-amber-400 font-bold">
                        <Sparkles className="h-4 w-4 text-[#F97316]" /> ১০০% নিরাপদ ক্যাশ অন ডেলিভারি ও ফার্স্ট ক্লাউড শিপিং
                    </div>
                </div>
            </div>

            {/* Scroll Top Button */}
            <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white shadow-xl shadow-orange-500/30 transition-transform hover:scale-110"
                aria-label="উপরে যান"
            >
                <ChevronUp className="h-6 w-6" />
            </button>
        </footer>
    );
}
