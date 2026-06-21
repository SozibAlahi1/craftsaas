import { Link, usePage } from '@inertiajs/react';
import { Facebook, Youtube, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
    const { settings } = usePage().props as any;

    return (
        <footer className="bg-[#050505] text-gray-400 py-16 border-t border-[#111111]">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand & Description */}
                    <div>
                        <Link href="/" className="inline-block mb-6">
                            {settings.site_logo_url ? (
                                <img src={settings.site_logo_url} alt={settings.site_name} className="h-10 object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                            ) : (
                                <span className="text-2xl font-bold tracking-[0.2em] font-serif-display uppercase text-white">
                                    {settings.site_name}
                                </span>
                            )}
                        </Link>
                        <p className="text-sm leading-relaxed mb-6">
                            {settings.footer_description}
                        </p>
                        <div className="flex space-x-4">
                            {settings.footer_facebook_url && (
                                <a href={settings.footer_facebook_url} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-gray-800 flex items-center justify-center hover:bg-[#cba876] hover:text-black hover:border-[#cba876] transition-all">
                                    <Facebook className="w-4 h-4" />
                                </a>
                            )}
                            {settings.footer_youtube_url && (
                                <a href={settings.footer_youtube_url} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-gray-800 flex items-center justify-center hover:bg-[#cba876] hover:text-black hover:border-[#cba876] transition-all">
                                    <Youtube className="w-4 h-4" />
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-medium uppercase tracking-wider mb-6">Information</h4>
                        <ul className="space-y-3">
                            {settings.footer_info_links?.map((link: any, idx: number) => (
                                <li key={idx}>
                                    <Link href={link.url} className="text-sm hover:text-[#cba876] transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Account Links */}
                    <div>
                        <h4 className="text-white font-medium uppercase tracking-wider mb-6">My Account</h4>
                        <ul className="space-y-3">
                            {settings.footer_account_links?.map((link: any, idx: number) => (
                                <li key={idx}>
                                    <Link href={link.url} className="text-sm hover:text-[#cba876] transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                            <li>
                                <Link href="/dashboard" className="text-sm hover:text-[#cba876] transition-colors">Dashboard</Link>
                            </li>
                            <li>
                                <Link href="/checkout" className="text-sm hover:text-[#cba876] transition-colors">Cart</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white font-medium uppercase tracking-wider mb-6">Contact Us</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start">
                                <MapPin className="w-5 h-5 mr-3 text-[#cba876] shrink-0 mt-0.5" />
                                <span className="text-sm">{settings.footer_address}</span>
                            </li>
                            <li className="flex items-center">
                                <Phone className="w-5 h-5 mr-3 text-[#cba876] shrink-0" />
                                <span className="text-sm">{settings.footer_phone}</span>
                            </li>
                            <li className="flex items-center">
                                <Mail className="w-5 h-5 mr-3 text-[#cba876] shrink-0" />
                                <span className="text-sm">{settings.footer_email}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-[#111111] flex flex-col md:flex-row items-center justify-between">
                    <p className="text-xs text-gray-500">
                        {settings.footer_copyright}
                    </p>
                    <div className="mt-4 md:mt-0 flex items-center space-x-4">
                        <span className="text-xs text-gray-500 uppercase tracking-widest">Secure Payment</span>
                        {/* Add payment icons here if needed */}
                    </div>
                </div>
            </div>
        </footer>
    );
}
