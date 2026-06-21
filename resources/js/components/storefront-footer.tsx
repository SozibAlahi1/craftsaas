import { Link, usePage } from '@inertiajs/react';
import { ChevronUp, Facebook, Mail, MapPin, Phone, Youtube } from 'lucide-react';

import AppLogoIcon from '@/components/app-logo-icon';

export function StorefrontFooter() {
    const { props } = usePage();
    const settings = props.settings as any;

    const footerDescription = settings?.footer_description || 'One of the largest Islamic Lifestyle brands in Bangladesh';
    const footerFacebookUrl = settings?.footer_facebook_url || 'https://facebook.com';
    const footerYoutubeUrl = settings?.footer_youtube_url || 'https://youtube.com';
    const footerPhone = settings?.footer_phone || '09638090000';
    const footerEmail = settings?.footer_email || 'cc.believerssign@gmail.com';
    const footerAddress = settings?.footer_address || 'Shop-3/1, Eastern Plaza, Hatirpool, Dhaka, Dhaka, Bangladesh';
    const footerCopyright = settings?.footer_copyright || '© 2026 Believers. All Rights Reserved';

    // Account links list fallback
    const accountLinks = settings?.footer_account_links && settings.footer_account_links.length > 0
        ? settings.footer_account_links
        : [
            { label: 'My Account', url: '/profile' },
            { label: 'Track My Order', url: '#' },
            { label: 'Join As Affiliate', url: '#' },
            { label: 'Complain Box', url: '#' },
        ];

    // Information links list fallback
    const informationLinks = settings?.footer_info_links && settings.footer_info_links.length > 0
        ? settings.footer_info_links
        : [
            { label: 'Shop All', url: '/products' },
            { label: 'Our Showrooms', url: '#' },
            { label: 'Refund & Returned', url: '#' },
            { label: 'About Us', url: '#' },
            { label: 'Privacy Policy', url: '#' },
            { label: 'Terms & Conditions', url: '#' },
        ];

    const renderLink = (link: { label: string; url: string }) => {
        let href = link.url;
        try {
            // Check if it is a named route like 'home' or 'products.index'
            if (href && !href.startsWith('/') && !href.startsWith('#') && !href.startsWith('http')) {
                href = route(href);
            }
        } catch (e) {
            href = '/';
        }

        if (href.startsWith('http')) {
            return (
                <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base font-semibold text-slate-600 transition-colors hover:text-slate-900"
                >
                    {link.label}
                </a>
            );
        }

        return (
            <Link href={href} className="text-base font-semibold text-slate-600 transition-colors hover:text-slate-900">
                {link.label}
            </Link>
        );
    };

    return (
        <footer className="bg-slate-50 text-slate-900 border-t border-slate-200">
            <div className="mx-auto max-w-[1440px] px-4 pt-10 pb-4 sm:px-6 sm:pt-12 sm:pb-4 lg:px-8 lg:pt-14 lg:pb-4">
                <div className="grid gap-10 lg:grid-cols-4 lg:gap-12">
                    <div className="max-w-sm">
                        <Link href={route('home')} className="inline-flex items-center">
                            <AppLogoIcon className="h-14 w-14 fill-current text-slate-800" />
                        </Link>

                        <p className="mt-6 max-w-sm text-center text-base leading-7 text-slate-600 sm:text-left">
                            {footerDescription}
                        </p>

                        <div className="mt-6 flex items-center justify-center gap-3 sm:justify-start">
                            {footerFacebookUrl && (
                                <a
                                    href={footerFacebookUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Facebook"
                                    className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#1877f2] text-white transition-transform hover:-translate-y-0.5"
                                >
                                    <Facebook className="h-5 w-5 fill-current" />
                                </a>
                            )}
                            {footerYoutubeUrl && (
                                <a
                                    href={footerYoutubeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="YouTube"
                                    className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#ff1d16] text-white transition-transform hover:-translate-y-0.5"
                                >
                                    <Youtube className="h-5 w-5 fill-current" />
                                </a>
                            )}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-2xl font-bold text-slate-800">Account</h3>
                        <ul className="mt-4 space-y-3">
                            {accountLinks.map((link, idx) => (
                                <li key={idx}>
                                    {renderLink(link)}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-2xl font-bold text-slate-800">Information</h3>
                        <ul className="mt-4 space-y-3">
                            {informationLinks.map((link, idx) => (
                                <li key={idx}>
                                    {renderLink(link)}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-2xl font-bold text-slate-800">Talk To Us</h3>

                        <div className="mt-4 space-y-4">
                            {footerPhone && (
                                <div>
                                    <p className="text-sm font-semibold text-slate-500">Got Questions? Call us</p>
                                    <a href={`tel:${footerPhone}`} className="mt-1 block text-3xl font-black tracking-tight text-slate-900">
                                        {footerPhone}
                                    </a>
                                </div>
                            )}

                            <div className="space-y-3 text-sm font-semibold text-slate-600">
                                {footerEmail && (
                                    <div className="flex items-start gap-3">
                                        <Mail className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                                        <a href={`mailto:${footerEmail}`} className="hover:text-slate-900 hover:underline">{footerEmail}</a>
                                    </div>
                                )}

                                {footerAddress && (
                                    <div className="flex items-start gap-3">
                                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                                        <span>{footerAddress}</span>
                                    </div>
                                )}

                                {footerPhone && (
                                    <div className="flex items-start gap-3">
                                        <Phone className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                                        <a href={`tel:${footerPhone}`} className="hover:text-slate-900 hover:underline">{footerPhone}</a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-4 border-t border-slate-200 pt-4 pb-0 text-center text-sm font-semibold text-slate-500">
                    {footerCopyright}
                </div>
            </div>

            <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="fixed bottom-6 right-6 z-50 inline-flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 text-white shadow-lg transition-transform hover:-translate-y-0.5"
                aria-label="Back to top"
            >
                <ChevronUp className="h-5 w-5" />
            </button>
        </footer>
    );
}
