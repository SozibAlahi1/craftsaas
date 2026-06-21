import { Link, usePage } from '@inertiajs/react';
import { ChevronUp, ChevronRight, Facebook, Mail, MapPin, Phone, Youtube, Clock } from 'lucide-react';

/* RED & WHITE Palette matching the reference layout */
const P = {
    accent: '#ff3000', // Red/Orange accent
    bg: '#ffffff',
    textMain: '#111827', // gray-900
    textMuted: '#4b5563', // gray-600
    border: '#e5e7eb',
    footerBottom: '#1f2937', // dark for bottom bar, or white? user said "white background", let's make bottom bar very light gray or dark. Usually bottom bar can be slightly different. Let's make it very dark gray for contrast, or just simple border top white. The image has a very dark bottom bar. I will use #111827 for bottom bar and white text there, or keep it white based on "white background". Let's stick to white background entirely with top border.
} as const;

export function ShutkirFooter() {
    const { props } = usePage();
    const settings = props.settings as any;

    const footerDescription = settings?.footer_description || 'বাংলাদেশের সেরা অর্গানিক শুকটি মাছের অনলাইন বাজার। ভেজালমুক্ত পণ্য সরাসরি আপনার দরজায়।';
    const footerFacebookUrl = settings?.footer_facebook_url || 'https://facebook.com';
    const footerYoutubeUrl = settings?.footer_youtube_url || '';
    const footerPhone = settings?.footer_phone || '01XXXXXXXXX';
    const footerEmail = settings?.footer_email || '';
    const footerAddress = settings?.footer_address || '';
    const footerCopyright = settings?.footer_copyright || `© ${new Date().getFullYear()} শুকটি বাজার। সকল অধিকার সংরক্ষিত।`;
    
    // Add Whatsapp if available in future, for now placeholder URL or use phone
    const footerWhatsappUrl = settings?.footer_whatsapp_url || `https://wa.me/${footerPhone.replace(/[^0-9]/g, '')}`;

    const siteName = settings?.site_name || 'শুকটি বাজার';
    const logoUrl = (settings as any)?.site_logo_url as string | undefined;

    const accountLinks = settings?.footer_account_links?.length > 0
        ? settings.footer_account_links
        : [
            { label: 'আমার অ্যাকাউন্ট', url: '/dashboard' },
            { label: 'অর্ডার ট্র্যাক করুন', url: '#' },
            { label: 'রিটার্ন পলিসি', url: '#' },
        ];

    const informationLinks = settings?.footer_info_links?.length > 0
        ? settings.footer_info_links
        : [
            { label: 'সব পণ্য', url: '/products' },
            { label: 'আমাদের সম্পর্কে', url: '#' },
            { label: 'গোপনীয়তা নীতি', url: '#' },
            { label: 'শর্তাবলী', url: '#' },
        ];

    const renderLink = (link: { label: string; url: string }) => {
        let href = link.url;
        try {
            if (href && !href.startsWith('/') && !href.startsWith('#') && !href.startsWith('http')) href = route(href);
        } catch { href = '/'; }
        const cls = "text-[13px] font-semibold transition-colors hover:text-[#ff3000]";
        if (href.startsWith('http')) {
            return <a href={href} target="_blank" rel="noopener noreferrer" className={cls} style={{ color: P.textMuted }}>{link.label}</a>;
        }
        return <Link href={href} className={cls} style={{ color: P.textMuted }}>{link.label}</Link>;
    };

    return (
        <footer style={{ background: P.bg, borderTop: `1px solid ${P.border}` }} className="font-sans">
            <div className="mx-auto max-w-[1440px] px-4 pt-16 pb-8 sm:px-6 lg:px-8">
                <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr_1fr_1.2fr]">

                    {/* Column 1: Brand & Description */}
                    <div>
                        <Link href={route('home')} className="inline-flex items-center gap-3 mb-5">
                            {logoUrl ? (
                                <img src={logoUrl} alt={siteName} className="h-12 w-auto object-contain" />
                            ) : (
                                <span className="text-2xl font-black uppercase tracking-tight" style={{ color: P.textMain }}>
                                    {siteName}
                                </span>
                            )}
                        </Link>

                        <p className="text-[13px] leading-6 mb-8" style={{ color: P.textMuted }}>
                            {footerDescription}
                        </p>

                        {/* Social Icons */}
                        <div className="flex items-center gap-3">
                            {footerFacebookUrl && (
                                <a href={footerFacebookUrl} target="_blank" rel="noopener noreferrer"
                                    className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1877F2] text-white transition-transform hover:-translate-y-1">
                                    <Facebook className="h-4 w-4 fill-current" />
                                </a>
                            )}
                            {footerYoutubeUrl && (
                                <a href={footerYoutubeUrl} target="_blank" rel="noopener noreferrer"
                                    className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FF0000] text-white transition-transform hover:-translate-y-1">
                                    <Youtube className="h-4 w-4 fill-current" />
                                </a>
                            )}
                            {footerPhone && (
                                <a href={footerWhatsappUrl} target="_blank" rel="noopener noreferrer"
                                    className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366] text-white transition-transform hover:-translate-y-1">
                                    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                                        <path d="M12.031 0C5.385 0 0 5.385 0 12.031c0 2.128.552 4.195 1.6 6.012L.152 23.366l5.449-1.428A11.968 11.968 0 0012.031 24c6.646 0 12.031-5.385 12.031-12.031S18.677 0 12.031 0zm0 22.007c-1.802 0-3.567-.485-5.114-1.403l-.367-.217-3.8.995 1.014-3.705-.238-.378a9.98 9.98 0 01-1.526-5.33c0-5.513 4.488-10.001 10.031-10.001 5.514 0 10.032 4.488 10.032 10.001s-4.518 10.038-10.032 10.038zm5.501-7.514c-.302-.151-1.782-.88-2.059-.981-.277-.101-.479-.151-.681.151-.202.302-.78 1.002-.956 1.203-.176.201-.352.226-.655.075-1.528-.756-2.585-1.464-3.541-3.111-.176-.302.176-.277.756-1.436.075-.151.038-.277-.038-.428-.075-.151-.681-1.637-.932-2.241-.252-.579-.504-.504-.681-.504h-.579c-.202 0-.529.075-.806.378-.277.302-1.058 1.032-1.058 2.518 0 1.486 1.083 2.922 1.234 3.123.151.201 2.115 3.226 5.137 4.534.705.302 1.259.478 1.688.629.705.226 1.359.176 1.863.126.579-.075 1.782-.73 2.033-1.436.252-.705.252-1.309.176-1.436-.075-.126-.277-.201-.579-.352z"/>
                                    </svg>
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Column 2: Categories (Mapped to Account/Custom links for structure) */}
                    <div>
                        <h3 className="text-[16px] font-black mb-5 pb-2 relative" style={{ color: P.textMain }}>
                            ক্যাটাগরি
                            <div className="absolute bottom-0 left-0 h-[2px] w-12" style={{ backgroundColor: P.accent }}></div>
                        </h3>
                        <ul className="space-y-3">
                            {accountLinks.map((link: any, idx: number) => (
                                <li key={idx} className="flex items-center gap-2 group">
                                    <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-1" style={{ color: P.accent }} />
                                    {renderLink(link)}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Important Links */}
                    <div>
                        <h3 className="text-[16px] font-black mb-5 pb-2 relative" style={{ color: P.textMain }}>
                            প্রয়োজনীয় লিংক
                            <div className="absolute bottom-0 left-0 h-[2px] w-12" style={{ backgroundColor: P.accent }}></div>
                        </h3>
                        <ul className="space-y-3">
                            {informationLinks.map((link: any, idx: number) => (
                                <li key={idx} className="flex items-center gap-2 group">
                                    <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-1" style={{ color: P.accent }} />
                                    {renderLink(link)}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 4: Contact Us */}
                    <div>
                        <h3 className="text-[16px] font-black mb-5 pb-2 relative" style={{ color: P.textMain }}>
                            যোগাযোগ করুন
                            <div className="absolute bottom-0 left-0 h-[2px] w-12" style={{ backgroundColor: P.accent }}></div>
                        </h3>
                        <div className="space-y-4">
                            {footerAddress && (
                                <div className="flex items-start gap-3">
                                    <MapPin className="mt-0.5 h-[18px] w-[18px] shrink-0" style={{ color: P.accent }} />
                                    <span className="text-[13px] leading-relaxed" style={{ color: P.textMuted }}>
                                        <strong className="font-bold mr-1" style={{ color: P.textMain }}>প্রধান অফিস:</strong>
                                        {footerAddress}
                                    </span>
                                </div>
                            )}
                            
                            {footerPhone && (
                                <div className="flex items-center gap-3">
                                    <Phone className="h-[18px] w-[18px] shrink-0" style={{ color: P.accent }} />
                                    <span className="text-[13px]" style={{ color: P.textMuted }}>
                                        <strong className="font-bold mr-1" style={{ color: P.textMain }}>হটলাইন:</strong> 
                                        {footerPhone}
                                    </span>
                                </div>
                            )}

                            {footerEmail && (
                                <div className="flex items-center gap-3">
                                    <Mail className="h-[18px] w-[18px] shrink-0" style={{ color: P.accent }} />
                                    <span className="text-[13px]" style={{ color: P.textMuted }}>
                                        <strong className="font-bold mr-1" style={{ color: P.textMain }}>ইমেইল:</strong> 
                                        {footerEmail}
                                    </span>
                                </div>
                            )}

                            <div className="flex items-center gap-3">
                                <Clock className="h-[18px] w-[18px] shrink-0" style={{ color: P.accent }} />
                                <span className="text-[13px]" style={{ color: P.textMuted }}>
                                    সকাল ৯:০০ - রাত ১০:০০ (প্রতিদিন)
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="py-4 px-4 text-center" style={{ backgroundColor: P.textMain }}>
                <p className="text-[13px] text-gray-300">
                    {footerCopyright}
                </p>
            </div>

            {/* Back to top */}
            <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="fixed bottom-6 right-6 z-50 inline-flex h-11 w-11 items-center justify-center rounded-full shadow-lg transition-transform hover:-translate-y-1"
                style={{ background: P.accent, color: P.bg }} aria-label="উপরে যান">
                <ChevronUp className="h-5 w-5" />
            </button>
        </footer>
    );
}
