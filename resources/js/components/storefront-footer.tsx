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
            { label: 'Track My Order', url: 'track-order' },
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
        
        // Auto-override tracking links so they point to the actual route even if settings have placeholders
        if (link.label.toLowerCase().includes('track') && (href === '#' || href === 'track-order' || href === '/track-order')) {
            try {
                href = route('track-order');
            } catch (e) {
                href = '/track-order';
            }
        } else {
            try {
                // Check if it is a named route like 'home' or 'products.index'
                if (href && !href.startsWith('/') && !href.startsWith('#') && !href.startsWith('http')) {
                    href = route(href);
                }
            } catch (e) {
                href = '/';
            }
        }

        if (href.startsWith('http')) {
            return (
                <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base font-semibold text-muted-foreground transition-colors hover:text-foreground"
                >
                    {link.label}
                </a>
            );
        }

        return (
            <Link href={href} className="text-base font-semibold text-muted-foreground transition-colors hover:text-foreground">
                {link.label}
            </Link>
        );
    };

    return (
        <footer className="bg-card text-foreground border-t border-border">
            <div className="mx-auto max-w-[1440px] px-4 pt-10 pb-4 sm:px-6 sm:pt-12 sm:pb-4 lg:px-8 lg:pt-14 lg:pb-4">
                <div className="grid gap-10 lg:grid-cols-4 lg:gap-12">
                    <div className="max-w-sm">
                        <Link href={route('home')} className="inline-flex items-center">
                            {settings?.site_logo_url ? (
                                <img src={settings.site_logo_url} alt={settings?.site_name} className="h-14 w-auto object-contain" />
                            ) : (
                                <AppLogoIcon className="h-14 w-14 fill-current text-foreground" />
                            )}
                        </Link>

                        <p className="mt-6 max-w-sm text-center text-base leading-7 text-muted-foreground sm:text-left">
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
                        <h3 className="text-2xl font-bold text-foreground">Account</h3>
                        <ul className="mt-4 space-y-3">
                            {accountLinks.map((link, idx) => (
                                <li key={idx}>
                                    {renderLink(link)}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-2xl font-bold text-foreground">Information</h3>
                        <ul className="mt-4 space-y-3">
                            {informationLinks.map((link, idx) => (
                                <li key={idx}>
                                    {renderLink(link)}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-2xl font-bold text-foreground">Talk To Us</h3>

                        <div className="mt-4 space-y-4">
                            {footerPhone && (
                                <div>
                                    <p className="text-sm font-semibold text-muted-foreground">Got Questions? Call us</p>
                                    <a href={`tel:${footerPhone}`} className="mt-1 block text-3xl font-black tracking-tight text-foreground">
                                        {footerPhone}
                                    </a>
                                </div>
                            )}

                            <div className="space-y-3 text-sm font-semibold text-muted-foreground">
                                {footerEmail && (
                                    <div className="flex items-start gap-3">
                                        <Mail className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                                        <a href={`mailto:${footerEmail}`} className="hover:text-foreground hover:underline">{footerEmail}</a>
                                    </div>
                                )}

                                {footerAddress && (
                                    <div className="flex items-start gap-3">
                                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                                        <span>{footerAddress}</span>
                                    </div>
                                )}

                                {footerPhone && (
                                    <div className="flex items-start gap-3">
                                        <Phone className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                                        <a href={`tel:${footerPhone}`} className="hover:text-foreground hover:underline">{footerPhone}</a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-4 border-t border-border pt-4 pb-0 text-center text-sm font-semibold text-muted-foreground">
                    {footerCopyright}
                </div>
            </div>

            <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="fixed bottom-6 right-6 z-50 inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:-translate-y-0.5"
                aria-label="Back to top"
            >
                <ChevronUp className="h-5 w-5" />
            </button>
        </footer>
    );
}
