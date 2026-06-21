import { Link, usePage } from '@inertiajs/react';
import { ShoppingBag, Search, Menu, User } from 'lucide-react';

export function Header() {
    const { menus, settings, cartCount } = usePage().props as any;

    return (
        <header className="sticky top-0 z-50 w-full border-b border-[#222222] bg-[#050505]/90 backdrop-blur-md">
            <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                {/* Mobile Menu */}
                <button className="lg:hidden text-white hover:text-[#cba876]">
                    <Menu className="w-6 h-6" />
                </button>

                {/* Left Navigation */}
                <nav className="hidden lg:flex items-center space-x-8">
                    {menus.slice(0, 3).map((menu: any) => (
                        <Link
                            key={menu.id}
                            href={menu.url || (menu.category ? `/products?category=${menu.category.slug}` : '#')}
                            className="text-sm font-medium tracking-wider text-gray-300 hover:text-[#cba876] uppercase transition-colors"
                        >
                            {menu.title}
                        </Link>
                    ))}
                </nav>

                {/* Center Logo */}
                <Link href="/" className="flex-shrink-0 absolute left-1/2 -translate-x-1/2">
                    {settings.site_logo_url ? (
                        <img src={settings.site_logo_url} alt={settings.site_name} className="h-10 object-contain" />
                    ) : (
                        <span className="text-2xl font-bold tracking-[0.2em] font-serif-display uppercase text-white">
                            {settings.site_name}
                        </span>
                    )}
                </Link>

                {/* Right Navigation & Icons */}
                <div className="flex items-center space-x-6">
                    <nav className="hidden lg:flex items-center space-x-8 mr-6">
                        {menus.slice(3, 6).map((menu: any) => (
                            <Link
                                key={menu.id}
                                href={menu.url || (menu.category ? `/products?category=${menu.category.slug}` : '#')}
                                className="text-sm font-medium tracking-wider text-gray-300 hover:text-[#cba876] uppercase transition-colors"
                            >
                                {menu.title}
                            </Link>
                        ))}
                    </nav>

                    <button className="text-white hover:text-[#cba876] transition-colors">
                        <Search className="w-5 h-5" />
                    </button>
                    <Link href="/dashboard" className="text-white hover:text-[#cba876] transition-colors hidden sm:block">
                        <User className="w-5 h-5" />
                    </Link>
                    <Link href="/checkout" className="text-white hover:text-[#cba876] transition-colors relative">
                        <ShoppingBag className="w-5 h-5" />
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 w-4 h-4 bg-[#cba876] text-black text-[10px] font-bold flex items-center justify-center rounded-full">
                                {cartCount}
                            </span>
                        )}
                    </Link>
                </div>
            </div>
        </header>
    );
}
