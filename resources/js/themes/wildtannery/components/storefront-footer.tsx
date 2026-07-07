import { Link, usePage } from '@inertiajs/react';
import { ChevronUp, Facebook, Mail, MapPin, Phone, Youtube, Instagram } from 'lucide-react';

export function StorefrontFooter() {
    const { props } = usePage();
    const settings = props.settings as any;

    const footerDescription = settings?.footer_description || 'Crafting premium leather goods with timeless design and exceptional quality.';
    const footerFacebookUrl = settings?.footer_facebook_url || 'https://facebook.com';
    const footerYoutubeUrl = settings?.footer_youtube_url || 'https://youtube.com';
    const footerInstagramUrl = 'https://instagram.com'; 
    const footerPhone = settings?.footer_phone || '+880 123 456 789';
    const footerEmail = settings?.footer_email || 'info@wildtannery.com';
    const footerAddress = settings?.footer_address || '123 Leather Street, Artisan District, Dhaka, Bangladesh';
    const footerCopyright = settings?.footer_copyright || '© 2026 Wild Tannery. All Rights Reserved.';
    const logoUrl = settings?.site_logo_url as string | undefined;

    const accountLinks = settings?.footer_account_links && settings.footer_account_links.length > 0
        ? settings.footer_account_links
        : [
            { label: 'My Account', url: '/profile' },
            { label: 'Track My Order', url: '#' },
            { label: 'Wishlist', url: '#' },
            { label: 'Shopping Cart', url: '/cart' },
        ];

    const informationLinks = settings?.footer_info_links && settings.footer_info_links.length > 0
        ? settings.footer_info_links
        : [
            { label: 'Shop All', url: '/products' },
            { label: 'Leather Care', url: '#' },
            { label: 'Refund & Returns', url: '#' },
            { label: 'About Us', url: '#' },
            { label: 'Privacy Policy', url: '#' },
            { label: 'Terms & Conditions', url: '#' },
        ];

    const renderLink = (link: { label: string; url: string }) => {
        let href = link.url;
        try {
            if (href && !href.startsWith('/') && !href.startsWith('#') && !href.startsWith('http')) {
                href = route(href);
            }
        } catch (e) {
            href = '/';
        }

        const className = "text-[13px] text-slate-400 transition-colors hover:text-white flex items-center gap-2 py-1";
        
        if (href.startsWith('http')) {
            return (
                <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
                    {link.label}
                </a>
            );
        }

        return (
            <Link href={href} className={className}>
                {link.label}
            </Link>
        );
    };

    return (
        <footer className="bg-[#0B0E14] text-slate-300 border-t border-slate-800">
            {/* Corporate Partners Section */}
            <div className="border-b border-slate-800/50 py-12">
                <div className="mx-auto max-w-[1440px] px-6 text-center">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-8">Our Corporate Partners</h3>
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Placeholder for partner logos (text for now to mimic saifexbd layout) */}
                        <span className="text-lg font-black tracking-widest text-slate-500">PARTNER 1</span>
                        <span className="text-lg font-black tracking-widest text-slate-500">PARTNER 2</span>
                        <span className="text-lg font-black tracking-widest text-slate-500">PARTNER 3</span>
                        <span className="text-lg font-black tracking-widest text-slate-500">PARTNER 4</span>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-[1440px] px-6 pt-16 pb-8 lg:px-8 lg:pt-20">
                <div className="grid gap-12 lg:grid-cols-4 lg:gap-8">
                    
                    {/* Brand Info */}
                    <div>
                        <Link href={route('home')} className="inline-flex items-center mb-6">
                            {logoUrl ? (
                                <img
                                    src={logoUrl}
                                    alt="Wild Tannery Logo"
                                    className="h-10 w-auto object-contain brightness-0 invert"
                                />
                            ) : (
                                <span className="text-2xl font-black uppercase tracking-tighter text-white">
                                    WILD<span className="text-blue-600">TANNERY</span>
                                </span>
                            )}
                        </Link>

                        <p className="text-[13px] leading-relaxed text-slate-400">
                            {footerDescription}
                        </p>

                        <div className="mt-6 flex items-center gap-4">
                            {footerFacebookUrl && (
                                <a href={footerFacebookUrl} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
                                    <Facebook className="h-4 w-4" />
                                </a>
                            )}
                            <a href={footerInstagramUrl} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
                                <Instagram className="h-4 w-4" />
                            </a>
                            {footerYoutubeUrl && (
                                <a href={footerYoutubeUrl} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
                                    <Youtube className="h-4 w-4" />
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="text-[13px] font-bold text-white uppercase tracking-wider mb-6">Information</h3>
                        <ul className="space-y-2">
                            {informationLinks.map((link, idx) => (
                                <li key={idx}>{renderLink(link)}</li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-[13px] font-bold text-white uppercase tracking-wider mb-6">My Account</h3>
                        <ul className="space-y-2">
                            {accountLinks.map((link, idx) => (
                                <li key={idx}>{renderLink(link)}</li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-[13px] font-bold text-white uppercase tracking-wider mb-6">Contact Us</h3>
                        <div className="space-y-4">
                            {footerAddress && (
                                <div className="flex gap-3">
                                    <MapPin className="h-4 w-4 shrink-0 text-slate-500 mt-0.5" />
                                    <p className="text-[13px] text-slate-400">
                                        {footerAddress}
                                    </p>
                                </div>
                            )}

                            {footerPhone && (
                                <div className="flex gap-3">
                                    <Phone className="h-4 w-4 shrink-0 text-slate-500 mt-0.5" />
                                    <a href={`tel:${footerPhone}`} className="text-[13px] text-slate-400 hover:text-white transition-colors">
                                        {footerPhone}
                                    </a>
                                </div>
                            )}

                            {footerEmail && (
                                <div className="flex gap-3">
                                    <Mail className="h-4 w-4 shrink-0 text-slate-500 mt-0.5" />
                                    <a href={`mailto:${footerEmail}`} className="text-[13px] text-slate-400 hover:text-white transition-colors">
                                        {footerEmail}
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-8 sm:flex-row">
                    <p className="text-[12px] font-medium text-slate-500">
                        {footerCopyright}
                    </p>
                    <div className="flex gap-3 opacity-50 grayscale hover:grayscale-0 transition-all">
                        <div className="h-6 px-2 rounded bg-slate-800 flex items-center justify-center text-[9px] font-bold text-white">VISA</div>
                        <div className="h-6 px-2 rounded bg-slate-800 flex items-center justify-center text-[9px] font-bold text-white">MC</div>
                        <div className="h-6 px-2 rounded bg-slate-800 flex items-center justify-center text-[9px] font-bold text-white">BKASH</div>
                    </div>
                </div>
            </div>

            <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="fixed bottom-6 right-6 z-50 inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-transform hover:-translate-y-1 hover:shadow-blue-600/25"
                aria-label="Back to top"
            >
                <ChevronUp className="h-5 w-5" />
            </button>
        </footer>
    );
}
