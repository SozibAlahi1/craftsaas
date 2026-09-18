import { Link, usePage } from '@inertiajs/react';
import { ChevronUp, Facebook, Mail, MapPin, Phone, Youtube } from 'lucide-react';

import AppLogoIcon from '@/components/app-logo-icon';

export function StorefrontFooter() {
    const { props } = usePage();
    const settings = props.settings as any;

    const footerDescription = settings?.footer_description || 'বাংলাদেশের সেরা শুকটি মাছের অনলাইন বাজার। তাজা ও মানসম্পন্ন শুকটি মাছ সরাসরি আপনার দরজায়।';
    const footerFacebookUrl = settings?.footer_facebook_url || 'https://facebook.com';
    const footerYoutubeUrl = settings?.footer_youtube_url || 'https://youtube.com';
    const footerPhone = settings?.footer_phone || '01700000000';
    const footerEmail = settings?.footer_email || 'info@shutkivalley.com';
    const footerAddress = settings?.footer_address || 'শুটকি ভ্যালী, কক্সবাজার, বাংলাদেশ';
    const footerCopyright = settings?.footer_copyright || '© 2026 Shutki Valley. All Rights Reserved';

    // Account links list fallback
    const accountLinks =
        settings?.footer_account_links && settings.footer_account_links.length > 0
            ? settings.footer_account_links
            : [
                  { label: 'আমার অ্যাকাউন্ট', url: '/profile' },
                  { label: 'অর্ডার ট্র্যাক করুন', url: 'track-order' },
                  { label: 'রিফান্ড ও রিটার্ন পলিসি', url: '#' },
                  { label: 'অ্যাফিলিয়েট হিসেবে যুক্ত হন', url: '#' },
                  { label: 'অভিযোগ বক্স', url: '#' },
              ];

    // Information links list fallback
    const informationLinks =
        settings?.footer_info_links && settings.footer_info_links.length > 0
            ? settings.footer_info_links
            : [
                  { label: 'সকল প্রোডাক্ট', url: '/products' },
                  { label: 'আমাদের শো-রুম', url: '#' },
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
            'Refund & Returned': 'রিফান্ড ও রিটার্ন পলিসি',
            'Shipping & Return Policy': 'শিপিং ও রিটার্ন পলিসি',
            'Shop All': 'সকল প্রোডাক্ট',
            'About Us': 'আমাদের সম্পর্কে',
            'Privacy Policy': 'প্রাইভেসি পলিসি',
            'Terms & Conditions': 'টার্মস ও কন্ডিশনস',
            'Join As Affiliate': 'অ্যাফিলিয়েট হিসেবে যুক্ত হন',
            'Complain Box': 'অভিযোগ বক্স',
            'Our Showrooms': 'আমাদের শো-রুম',
        };

        const isEnglish = settings?.site_theme === 'example' || settings?.site_theme === 'wildtannery';

        if (!isEnglish && labelMap[label]) {
            label = labelMap[label];
        }

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
                    className="text-muted-foreground hover:text-foreground text-base font-semibold transition-colors"
                >
                    {label}
                </a>
            );
        }

        return (
            <Link href={href} className="text-muted-foreground hover:text-foreground text-base font-semibold transition-colors">
                {label}
            </Link>
        );
    };

    return (
        <footer className="bg-card text-foreground border-border border-t">
            <div className="mx-auto max-w-[1440px] px-4 pt-10 pb-4 sm:px-6 sm:pt-12 sm:pb-4 lg:px-8 lg:pt-14 lg:pb-4">
                <div className="grid gap-10 lg:grid-cols-4 lg:gap-12">
                    <div className="max-w-sm">
                        <Link href={route('home')} className="inline-flex items-center">
                            {settings?.site_logo_url ? (
                                <img src={settings.site_logo_url} alt={settings?.site_name} className="h-14 w-auto object-contain" />
                            ) : (
                                <AppLogoIcon className="text-foreground h-14 w-14 fill-current" />
                            )}
                        </Link>

                        <p className="text-muted-foreground mt-6 max-w-sm text-center text-base leading-7 sm:text-left">{footerDescription}</p>

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
                                    <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                    </svg>
                                </a>
                            )}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-foreground text-2xl font-bold">{isEnglish ? 'My Account' : 'আমার অ্যাকাউন্ট'}</h3>
                        <ul className="mt-4 space-y-3">
                            {accountLinks.map((link, idx) => (
                                <li key={idx}>{renderLink(link)}</li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-foreground text-2xl font-bold">{isEnglish ? 'Information & Policies' : 'তথ্য ও নীতি'}</h3>
                        <ul className="mt-4 space-y-3">
                            {informationLinks.map((link, idx) => (
                                <li key={idx}>{renderLink(link)}</li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-foreground text-2xl font-bold">{isEnglish ? 'Contact Us' : 'যোগাযোগ করুন'}</h3>

                        <div className="mt-4 space-y-4">
                            {footerPhone && (
                                <div>
                                    <p className="text-muted-foreground text-sm font-semibold">{isEnglish ? 'Have any questions? Call us' : 'কোনো প্রশ্ন থাকলে কল করুন'}</p>
                                    <a href={`tel:${footerPhone}`} className="text-foreground mt-1 block text-3xl font-black tracking-tight">
                                        {footerPhone}
                                    </a>
                                </div>
                            )}

                            <div className="text-muted-foreground space-y-3 text-sm font-semibold">
                                {footerEmail && (
                                    <div className="flex items-start gap-3">
                                        <Mail className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0" />
                                        <a href={`mailto:${footerEmail}`} className="hover:text-foreground hover:underline">
                                            {footerEmail}
                                        </a>
                                    </div>
                                )}

                                {footerAddress && (
                                    <div className="flex items-start gap-3">
                                        <MapPin className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0" />
                                        <span>{footerAddress}</span>
                                    </div>
                                )}

                                {footerPhone && (
                                    <div className="flex items-start gap-3">
                                        <Phone className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0" />
                                        <a href={`tel:${footerPhone}`} className="hover:text-foreground hover:underline">
                                            {footerPhone}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-border text-muted-foreground mt-4 border-t pt-4 pb-0 text-center text-sm font-semibold">{footerCopyright}</div>
            </div>

            <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="bg-primary text-primary-foreground fixed right-6 bottom-6 z-50 inline-flex h-11 w-11 items-center justify-center rounded-full shadow-lg transition-transform hover:-translate-y-0.5"
                aria-label="Back to top"
            >
                <ChevronUp className="h-5 w-5" />
            </button>
        </footer>
    );
}
