import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Link, router, usePage } from '@inertiajs/react';
import { Menu, Minus, Plus, Search, ShoppingBag, Trash2, User, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export function Header() {
    const { menus, settings, cart, cartCount, auth } = usePage().props as any;
    const [searchQuery, setSearchQuery] = useState('');
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [prevCartCount, setPrevCartCount] = useState(cartCount);

    useEffect(() => {
        if (cartCount > prevCartCount) {
            setIsCartOpen(true);
        }
        setPrevCartCount(cartCount);
    }, [cartCount]);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Calculate cart total subtotal safely handling both arrays and objects
    const cartItems = Array.isArray(cart) ? cart : cart && typeof cart === 'object' ? Object.values(cart) : [];

    const cartTotal = cartItems.reduce((sum: number, item: any) => {
        const price = parseFloat(String(item.price).replace(/[^0-9.]/g, ''));
        return sum + price * (item.quantity || 1);
    }, 0);

    // Fallback menus if admin panel hasn't configured them
    const displayMenus =
        menus && menus.length > 0
            ? menus
            : [
                  { id: 'fb-home', title: 'Home', url: '/' },
                  { id: 'fb-shoes', title: 'Shoes', url: '/products?category=shoes' },
                  { id: 'fb-bags', title: 'Bags', url: '/products?category=bags' },
                  { id: 'fb-wallets', title: 'Wallets', url: '/products?category=wallets' },
                  { id: 'fb-belts', title: 'Belts', url: '/products?category=belts' },
                  { id: 'fb-accessories', title: 'Accessories', url: '/products?category=accessories' },
              ];

    // Ajax Search Autocomplete Suggestion Logic
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        const delayDebounceFn = setTimeout(() => {
            setIsLoading(true);
            fetch(`/api/search?q=${encodeURIComponent(searchQuery.trim())}`)
                .then((res) => res.json())
                .then((data) => {
                    setSuggestions(data || []);
                    setShowSuggestions(true);
                })
                .catch((err) => console.error(err))
                .finally(() => setIsLoading(false));
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    // Close suggestions dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest('.search-container-desktop') && !target.closest('.search-container-mobile')) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setShowSuggestions(false);
            router.get(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-[#1c1c1c] bg-[#000000] text-white">
            {/* Main Header Row */}
            <div className="container mx-auto flex h-24 items-center justify-between px-4 lg:px-8">
                {/* Left Column: Logo */}
                <div className="flex items-center">
                    {/* Mobile Menu Trigger */}
                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="mr-4 text-white transition-colors hover:text-[#cba876] lg:hidden"
                        aria-label="Open Menu"
                    >
                        <Menu className="h-6 w-6" />
                    </button>

                    <Link href="/" className="block">
                        {settings.site_logo_url ? (
                            <img src={settings.site_logo_url} alt={settings.site_name} className="h-14 w-auto object-contain md:h-18" />
                        ) : (
                            <span className="font-serif-display text-xl font-bold tracking-[0.1em] uppercase md:text-2xl">{settings.site_name}</span>
                        )}
                    </Link>
                </div>

                {/* Center Column: Search Form */}
                <div className="search-container-desktop relative mx-8 hidden max-w-lg flex-grow justify-center lg:flex xl:mx-16">
                    {/* Search Form (Sleek design: no solid button block, icon trigger at the end) */}
                    <form
                        onSubmit={handleSearch}
                        className="flex h-11 w-full items-center rounded-full border border-[#cba876] bg-[#050505] pr-4 transition-all focus-within:ring-2 focus-within:ring-[#cba876]/20"
                    >
                        <input
                            type="text"
                            placeholder="Search for products"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                            className="w-full bg-transparent py-2 pr-2 pl-6 text-sm text-white placeholder-gray-400 focus:outline-none"
                        />
                        <button
                            type="submit"
                            className="flex shrink-0 items-center justify-center text-[#cba876] transition-colors hover:text-white"
                            aria-label="Search"
                        >
                            <Search className="h-5 w-5" />
                        </button>
                    </form>

                    {/* Ajax Autocomplete Suggestions List */}
                    {showSuggestions && suggestions.length > 0 && (
                        <div className="absolute top-full right-0 left-0 z-50 mt-1.5 divide-y divide-[#1c1c1c] overflow-hidden rounded-lg border border-[#1c1c1c] bg-[#0a0a0a] shadow-2xl">
                            {suggestions.map((item: any) => {
                                const imgUrl = item.image
                                    ? item.image.startsWith('http')
                                        ? item.image
                                        : `/storage/${item.image}`
                                    : '/images/placeholder.png';

                                return (
                                    <Link
                                        key={item.id}
                                        href={`/products/${item.slug}`}
                                        onClick={() => setShowSuggestions(false)}
                                        className="group flex items-center px-4 py-3 text-left transition-colors hover:bg-[#cba876]/10"
                                    >
                                        <img
                                            src={imgUrl}
                                            alt={item.name}
                                            className="mr-3 h-10 w-10 rounded border border-white/5 bg-[#0d0d0d] object-cover"
                                        />
                                        <div className="min-w-0 flex-grow">
                                            <h5 className="truncate text-xs font-bold text-white transition-colors group-hover:text-[#cba876]">
                                                {item.name}
                                            </h5>
                                            <span className="mt-0.5 block text-[11px] font-black text-[#cba876]">{item.price}</span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Right Column: Tools (Cart & Account) */}
                <div className="flex shrink-0 items-center space-x-3 md:space-x-4">
                    {/* User Account / Login (Icon-only, styled circularly to match cart) */}
                    <Link
                        href={auth.user ? '/dashboard' : '/login'}
                        className="group flex items-center justify-center rounded-full border border-[#ffffff1a] bg-[#ffffff0f] p-2.5 transition-colors hover:border-[#cba876]/40"
                        title={auth.user ? 'Dashboard' : 'Login / Register'}
                    >
                        <User className="h-6 w-6 text-white transition-colors group-hover:text-[#cba876]" />
                    </Link>

                    {/* Cart Tool (Icon-only, styled circularly with badge and Sheet drawer) */}
                    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
                        <SheetTrigger asChild>
                            <button
                                type="button"
                                className="group relative flex cursor-pointer items-center justify-center rounded-full border border-[#ffffff1a] bg-[#ffffff0f] p-2.5 transition-colors hover:border-[#cba876]/40"
                                title="Shopping Cart"
                            >
                                <ShoppingBag className="h-6 w-6 text-white transition-colors group-hover:text-[#cba876]" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#cba876] text-[10px] font-black text-black shadow-sm">
                                        {cartCount}
                                    </span>
                                )}
                            </button>
                        </SheetTrigger>
                        <SheetContent
                            side="right"
                            className="flex w-[min(28rem,100vw)] flex-col border-l border-[#1c1c1c] bg-[#0a0a0a] p-0 text-white focus:ring-0 focus-visible:outline-none"
                        >
                            <SheetHeader className="border-b border-[#1c1c1c] bg-[#050505] p-6 text-left">
                                <div className="flex items-center justify-between">
                                    <SheetTitle className="flex items-center gap-2.5 text-xl font-black tracking-widest text-white uppercase">
                                        <ShoppingBag className="h-6 w-6 text-[#cba876]" />
                                        Shopping Cart ({cartCount})
                                    </SheetTitle>
                                </div>
                            </SheetHeader>

                            <div className="flex-1 overflow-y-auto px-6 py-4">
                                {cartCount === 0 ? (
                                    <div className="flex h-full flex-col items-center justify-center text-center">
                                        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#111111] text-gray-700">
                                            <ShoppingBag className="h-10 w-10" />
                                        </div>
                                        <h3 className="text-lg font-bold tracking-wider text-white uppercase">Your cart is empty</h3>
                                        <p className="mt-2 text-sm text-gray-400">It looks like you haven't added anything to your cart yet.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {Object.entries(cart || {}).map(([id, item]: [string, any]) => {
                                            const imgUrl = item.image
                                                ? item.image.startsWith('http')
                                                    ? item.image
                                                    : `/storage/${item.image}`
                                                : '/images/placeholder.png';

                                            return (
                                                <div key={id} className="rounded-lg border border-[#1c1c1c] bg-[#0d0d0d] p-4">
                                                    <div className="flex gap-4">
                                                        <div className="h-20 w-20 flex-none overflow-hidden rounded-md border border-[#1c1c1c] bg-[#050505] p-0.5">
                                                            <img src={imgUrl} alt={item.name} className="h-full w-full rounded-sm object-cover" />
                                                        </div>
                                                        <div className="flex flex-1 flex-col justify-between">
                                                            <div className="space-y-0.5">
                                                                <h4 className="text-[14px] leading-snug font-bold text-white">{item.name}</h4>
                                                                {item.color && (
                                                                    <span className="block text-[11px] font-bold text-gray-500 uppercase">
                                                                        {item.color} {item.size ? `/ ${item.size}` : ''}
                                                                    </span>
                                                                )}
                                                                <div className="text-[15px] font-black text-[#cba876]">
                                                                    ৳ {parseInt(String(item.price).replace(/[^\d]/g, '')).toLocaleString()}
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-3">
                                                                    <button
                                                                        onClick={() =>
                                                                            router.patch(route('cart.update', id), {
                                                                                quantity: Math.max(1, item.quantity - 1),
                                                                            })
                                                                        }
                                                                        className="flex h-8 w-8 items-center justify-center rounded-sm border border-[#1c1c1c] bg-[#141414] text-gray-400 transition-colors hover:bg-[#1f1f1f] hover:text-white"
                                                                    >
                                                                        <Minus className="h-3 w-3" />
                                                                    </button>
                                                                    <span className="w-4 text-center text-[14px] font-bold text-white">
                                                                        {item.quantity}
                                                                    </span>
                                                                    <button
                                                                        onClick={() =>
                                                                            router.patch(route('cart.update', id), { quantity: item.quantity + 1 })
                                                                        }
                                                                        className="flex h-8 w-8 items-center justify-center rounded-sm border border-[#1c1c1c] bg-[#141414] text-gray-400 transition-colors hover:bg-[#1f1f1f] hover:text-white"
                                                                    >
                                                                        <Plus className="h-3 w-3" />
                                                                    </button>
                                                                </div>
                                                                <button
                                                                    onClick={() => router.delete(route('cart.remove', id))}
                                                                    className="text-gray-500 transition-colors hover:text-red-500"
                                                                >
                                                                    <Trash2 className="h-5 w-5" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {cartCount > 0 && (
                                <div className="space-y-4 border-t border-[#1c1c1c] bg-[#050505] p-6">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[15px] font-black tracking-widest text-gray-400 uppercase">Total:</span>
                                        <span className="text-[22px] font-black text-[#cba876]">৳ {cartTotal.toLocaleString()}</span>
                                    </div>
                                    <div className="space-y-3">
                                        <Link href={route('checkout.index')} onClick={() => setIsCartOpen(false)} className="block w-full">
                                            <Button className="h-12 w-full cursor-pointer rounded-md bg-[#cba876] text-sm font-black tracking-widest text-black uppercase transition-colors hover:bg-[#b89563]">
                                                Checkout Now
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            {/* Dedicated Desktop Menu Bar Row (Below main header row) */}
            <div className="hidden border-t border-[#1c1c1c] bg-[#000000] lg:block">
                <div className="container mx-auto px-8">
                    <nav className="flex h-12 items-center justify-center space-x-8">
                        {displayMenus.map((menu: any) => (
                            <div key={menu.id} className="group relative flex h-full items-center">
                                <Link
                                    href={menu.url || (menu.category ? `/products?category=${menu.category.slug}` : '#')}
                                    className="relative flex h-full items-center text-[13px] font-bold tracking-wider text-gray-300 uppercase transition-colors hover:text-[#cba876]"
                                >
                                    {menu.title}
                                    <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#cba876] transition-all duration-300 group-hover:w-full" />
                                </Link>

                                {/* Dropdown Menu (If children exist) */}
                                {menu.children && menu.children.length > 0 && (
                                    <div className="invisible absolute top-full left-0 z-50 mt-0 w-56 rounded-b-md border border-[#1c1c1c] bg-[#0a0a0a] py-2 opacity-0 shadow-2xl transition-all duration-200 group-hover:visible group-hover:opacity-100">
                                        {menu.children.map((child: any) => (
                                            <Link
                                                key={child.id}
                                                href={child.url || (child.category ? `/products?category=${child.category.slug}` : '#')}
                                                className="block px-4 py-2 text-[12px] font-semibold text-gray-400 transition-colors hover:bg-[#cba876]/10 hover:text-white"
                                            >
                                                {child.title}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Mobile Search Bar Row (Show on small screens below header) */}
            <div className="search-container-mobile relative px-4 pb-4 lg:hidden">
                <form
                    onSubmit={handleSearch}
                    className="flex h-10 w-full items-center rounded-full border border-[#cba876] bg-[#050505] pr-4 transition-all"
                >
                    <input
                        type="text"
                        placeholder="Search for products"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                        className="w-full bg-transparent py-2 pr-2 pl-5 text-sm text-white placeholder-gray-400 focus:outline-none"
                    />
                    <button type="submit" className="flex shrink-0 items-center justify-center text-[#cba876] transition-colors hover:text-white">
                        <Search className="h-4 w-4" />
                    </button>
                </form>

                {/* Mobile Autocomplete Suggestions List */}
                {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute top-full right-4 left-4 z-50 mt-1 divide-y divide-[#1c1c1c] overflow-hidden rounded-lg border border-[#1c1c1c] bg-[#0a0a0a] shadow-2xl">
                        {suggestions.map((item: any) => {
                            const imgUrl = item.image
                                ? item.image.startsWith('http')
                                    ? item.image
                                    : `/storage/${item.image}`
                                : '/images/placeholder.png';

                            return (
                                <Link
                                    key={item.id}
                                    href={`/products/${item.slug}`}
                                    onClick={() => setShowSuggestions(false)}
                                    className="group flex items-center px-3 py-2.5 text-left transition-colors hover:bg-[#cba876]/10"
                                >
                                    <img
                                        src={imgUrl}
                                        alt={item.name}
                                        className="mr-3 h-8 w-8 rounded border border-white/5 bg-[#0d0d0d] object-cover"
                                    />
                                    <div className="min-w-0 flex-grow">
                                        <h5 className="truncate text-[11px] font-bold text-white transition-colors group-hover:text-[#cba876]">
                                            {item.name}
                                        </h5>
                                        <span className="mt-0.5 block text-[10px] font-black text-[#cba876]">{item.price}</span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Mobile Drawer Overlay & Menu */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 flex lg:hidden">
                    {/* Backdrop */}
                    <div onClick={() => setIsMobileMenuOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm" />

                    {/* Drawer Content */}
                    <div className="relative z-10 flex h-full w-80 max-w-[80vw] flex-col border-r border-[#1c1c1c] bg-[#0a0a0a] p-6 text-white">
                        <div className="mb-8 flex items-center justify-between">
                            <span className="text-lg font-bold tracking-wider uppercase">{settings.site_name}</span>
                            <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-400 hover:text-white" aria-label="Close menu">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        {/* Navigation Links */}
                        <nav className="mb-8 flex flex-col space-y-4 overflow-y-auto">
                            {displayMenus.map((menu: any) => (
                                <div key={menu.id} className="flex flex-col space-y-2">
                                    <Link
                                        href={menu.url || (menu.category ? `/products?category=${menu.category.slug}` : '#')}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="text-sm font-bold tracking-wider uppercase transition-colors hover:text-[#cba876]"
                                    >
                                        {menu.title}
                                    </Link>

                                    {/* Children Links */}
                                    {menu.children && menu.children.length > 0 && (
                                        <div className="flex flex-col space-y-2 border-l border-[#1c1c1c] pl-4">
                                            {menu.children.map((child: any) => (
                                                <Link
                                                    key={child.id}
                                                    href={child.url || (child.category ? `/products?category=${child.category.slug}` : '#')}
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                    className="text-xs text-gray-400 transition-colors hover:text-white"
                                                >
                                                    {child.title}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </nav>

                        {/* Account Link (Mobile) */}
                        <div className="mt-auto border-t border-[#1c1c1c] pt-4">
                            {auth.user ? (
                                <Link
                                    href="/dashboard"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block text-sm font-bold text-gray-300 uppercase transition-colors hover:text-[#cba876]"
                                >
                                    Dashboard ({auth.user.name})
                                </Link>
                            ) : (
                                <Link
                                    href="/login"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block text-sm font-bold text-gray-300 uppercase transition-colors hover:text-[#cba876]"
                                >
                                    Login / Register
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
