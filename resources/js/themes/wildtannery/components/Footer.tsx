import { Link, usePage } from '@inertiajs/react';
import { Facebook, Youtube, Mail, Phone, MapPin, ChevronUp } from 'lucide-react';

export function Footer() {
    const { settings } = usePage().props as any;

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const footerAddress = settings?.footer_address || 'C/O: Alam Fakir Bari, North Banshbaria, Banshbaria, Sitakund, Chattogram';
    const footerPhone = settings?.footer_phone || '+8801862854946';
    const footerWhatsapp = settings?.footer_whatsapp || '+88001862854946';
    const footerEmail = settings?.footer_email || 'info@saifexbd.com';

    return (
        <footer className="bg-[#0f0f0f] text-gray-400 pt-16 pb-8 border-t border-[#1c1c1c] select-none relative">
            <div className="container mx-auto px-4 lg:px-8">
                {/* 5-Column Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 xl:gap-12">
                    
                    {/* Column 1: Brand Info */}
                    <div className="lg:col-span-1">
                        <Link href="/" className="inline-block mb-4">
                            {settings?.site_logo_url ? (
                                <img src={settings.site_logo_url} alt={settings?.site_name} className="h-12 w-auto object-contain" />
                            ) : (
                                <span className="text-3xl font-black italic tracking-tight text-white block uppercase">
                                    {settings?.site_name || 'Saifex'}
                                </span>
                            )}
                        </Link>
                        <p className="text-[12px] leading-relaxed text-gray-400 mb-6">
                            your style is our priority. Trendy shopping made simple and affordable.
                        </p>
                        
                        <div>
                            <span className="text-xs font-bold text-white block mb-3 uppercase tracking-wider">Join with us</span>
                            <div className="flex space-x-2.5">
                                <a 
                                    href={settings?.footer_facebook_url || '#'} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="w-8 h-8 rounded-full bg-[#3b5998] flex items-center justify-center text-white hover:opacity-90 transition-opacity"
                                    aria-label="Facebook"
                                >
                                    <Facebook className="w-4 h-4 fill-white text-[#3b5998]" />
                                </a>
                                <a 
                                    href="#" 
                                    className="w-8 h-8 rounded-full bg-[#e1306c] flex items-center justify-center text-white hover:opacity-90 transition-opacity"
                                    aria-label="Instagram"
                                >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                                    </svg>
                                </a>
                                <a 
                                    href={settings?.footer_youtube_url || '#'} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="w-8 h-8 rounded-full bg-[#ff0000] flex items-center justify-center text-white hover:opacity-90 transition-opacity"
                                    aria-label="YouTube"
                                >
                                    <Youtube className="w-4 h-4 fill-white text-[#ff0000]" />
                                </a>
                                <a 
                                    href="#" 
                                    className="w-8 h-8 rounded-full bg-black border border-white/20 flex items-center justify-center text-white hover:opacity-90 transition-opacity"
                                    aria-label="TikTok"
                                >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.97v6.19c0 1.9-.53 3.86-1.81 5.21-1.32 1.46-3.37 2.22-5.36 2.05-2.22-.16-4.41-1.35-5.46-3.34-1.18-2.18-.94-5.06.67-7.01 1.35-1.68 3.63-2.52 5.76-2.1v4.03c-1.28-.27-2.68.18-3.41 1.25-.79 1.11-.69 2.76.32 3.66.92.83 2.37.89 3.32.1.8-.64 1.17-1.69 1.15-2.7V.02z"/>
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Categories */}
                    <div>
                        <h4 className="text-white text-sm font-bold uppercase mb-4 tracking-wider">Categories</h4>
                        <ul className="space-y-2.5 text-[13px]">
                            <li><Link href="/products?category=shoes" className="hover:text-white transition-colors">Shoes</Link></li>
                            <li><Link href="/products?category=bags" className="hover:text-white transition-colors">Bags</Link></li>
                            <li><Link href="/products?category=wallet" className="hover:text-white transition-colors">Wallet</Link></li>
                            <li><Link href="/products?category=belt" className="hover:text-white transition-colors">Belt</Link></li>
                            <li><Link href="/products?category=accessories" className="hover:text-white transition-colors">Accessories</Link></li>
                            <li><Link href="/products?category=campaign" className="hover:text-white transition-colors">Campaign</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Useful Links */}
                    <div>
                        <h4 className="text-white text-sm font-bold uppercase mb-4 tracking-wider">Useful Links</h4>
                        <ul className="space-y-2.5 text-[13px]">
                            <li><Link href="/promotions" className="hover:text-white transition-colors">Promotions</Link></li>
                            <li><Link href="/stores" className="hover:text-white transition-colors">Stores</Link></li>
                            <li><Link href="/contacts" className="hover:text-white transition-colors">Our contacts</Link></li>
                            <li><Link href="/delivery-return" className="hover:text-white transition-colors">Delivery & Return</Link></li>
                            <li><Link href="/outlet" className="hover:text-white transition-colors">Outlet</Link></li>
                        </ul>
                    </div>

                    {/* Column 4: Pages */}
                    <div>
                        <h4 className="text-white text-sm font-bold uppercase mb-4 tracking-wider">Pages</h4>
                        <ul className="space-y-2.5 text-[13px]">
                            <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                            <li><Link href="/contacts" className="hover:text-white transition-colors">Contact</Link></li>
                            <li><Link href="/refund-policy" className="hover:text-white transition-colors">Refund Policies</Link></li>
                            <li><Link href="/return-policy" className="hover:text-white transition-colors">Return Policies</Link></li>
                            <li><Link href="/terms-conditions" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
                        </ul>
                    </div>

                    {/* Column 5: Contact Info */}
                    <div>
                        <h4 className="text-white text-sm font-bold uppercase mb-4 tracking-wider">Contact</h4>
                        <ul className="space-y-3.5 text-[13px]">
                            <li className="flex items-start">
                                <MapPin className="w-4 h-4 mr-3 text-white shrink-0 mt-0.5" />
                                <span className="leading-relaxed text-gray-400">{footerAddress}</span>
                            </li>
                            <li className="flex items-center">
                                <Phone className="w-4 h-4 mr-3 text-white shrink-0" />
                                <span className="text-gray-400">{footerPhone}</span>
                            </li>
                            <li className="flex items-center">
                                <svg className="w-4 h-4 text-white mr-3 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.97C16.59 1.968 14.117 1.01 11.998 1.01 6.558 1.01 2.135 5.378 2.131 10.81c-.001 1.77.464 3.498 1.348 5.022L2.509 21.5l5.807-1.52c1.62.88 3.32 1.34 5.01 1.34v.01zM17.65 14.86c-.3-.15-1.78-.88-2.05-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.95 1.18-.18.2-.35.23-.65.08-1.2-.6-2.1-1.05-2.93-1.8-.62-.55-1.12-1.2-1.3-1.5-.18-.3-.02-.46.13-.61.13-.13.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.68-1.63-.93-2.23-.24-.58-.49-.5-.68-.5-.18-.01-.38-.01-.58-.01-.2 0-.52.08-.79.38-.28.3-1.07 1.05-1.07 2.56s1.09 2.97 1.24 3.17c.15.2 2.15 3.28 5.21 4.6.73.31 1.3.5 1.74.64.73.23 1.39.2 1.92.12.59-.09 1.78-.73 2.03-1.43.25-.7.25-1.3.18-1.43-.07-.1-.28-.2-.58-.35z"/>
                                </svg>
                                <span className="text-gray-400">{footerWhatsapp}</span>
                            </li>
                            <li className="flex items-center">
                                <Mail className="w-4 h-4 mr-3 text-white shrink-0" />
                                <span className="text-gray-400">{footerEmail}</span>
                            </li>
                        </ul>
                    </div>

                </div>

                <div className="mt-16 pt-8 border-t border-[#1c1c1c] flex flex-col md:flex-row items-center justify-between">
                    <p className="text-[11px] text-gray-500 font-medium tracking-wide">
                        {settings?.footer_copyright || `© ${new Date().getFullYear()} ${settings?.site_name || 'Saifexbd'} All Right Reserved | System Developed by Ecare.`}
                    </p>
                </div>
            </div>

            {/* Scroll To Top Button */}
            <button 
                onClick={scrollToTop}
                className="absolute bottom-6 right-6 lg:right-12 w-10 h-10 rounded bg-[#050505] hover:bg-[#cba876]/20 border border-white/10 flex items-center justify-center text-white transition-all shadow-xl group cursor-pointer"
                title="Scroll to top"
            >
                <ChevronUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
        </footer>
    );
}
