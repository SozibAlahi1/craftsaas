import { Link, usePage, router } from '@inertiajs/react';
import { ShoppingBag, Search, Menu, User, X, Minus, Plus, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

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
    const cartItems = Array.isArray(cart) 
        ? cart 
        : (cart && typeof cart === 'object' ? Object.values(cart) : []);

    const cartTotal = cartItems.reduce((sum: number, item: any) => {
        const price = parseFloat(String(item.price).replace(/[^0-9.]/g, ''));
        return sum + (price * (item.quantity || 1));
    }, 0);

    // Fallback menus if admin panel hasn't configured them
    const displayMenus = (menus && menus.length > 0) ? menus : [
        { id: 'fb-home', title: 'Home', url: '/' },
        { id: 'fb-shoes', title: 'Shoes', url: '/products?category=shoes' },
        { id: 'fb-bags', title: 'Bags', url: '/products?category=bags' },
        { id: 'fb-wallets', title: 'Wallets', url: '/products?category=wallets' },
        { id: 'fb-belts', title: 'Belts', url: '/products?category=belts' },
        { id: 'fb-accessories', title: 'Accessories', url: '/products?category=accessories' }
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
            <div className="container mx-auto px-4 lg:px-8 h-24 flex items-center justify-between">
                
                {/* Left Column: Logo */}
                <div className="flex items-center">
                    {/* Mobile Menu Trigger */}
                    <button 
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="lg:hidden mr-4 text-white hover:text-[#cba876] transition-colors"
                        aria-label="Open Menu"
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    <Link href="/" className="block">
                        {settings.site_logo_url ? (
                            <img src={settings.site_logo_url} alt={settings.site_name} className="h-14 md:h-18 w-auto object-contain" />
                        ) : (
                            <span className="text-xl md:text-2xl font-bold tracking-[0.1em] font-serif-display uppercase">
                                {settings.site_name}
                            </span>
                        )}
                    </Link>
                </div>

                {/* Center Column: Search Form */}
                <div className="hidden lg:flex flex-grow justify-center max-w-lg mx-8 xl:mx-16 search-container-desktop relative">
                    {/* Search Form (Sleek design: no solid button block, icon trigger at the end) */}
                    <form onSubmit={handleSearch} className="w-full flex items-center h-11 rounded-full border border-[#cba876] bg-[#050505] focus-within:ring-2 focus-within:ring-[#cba876]/20 transition-all pr-4">
                        <input
                            type="text"
                            placeholder="Search for products"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                            className="w-full bg-transparent pl-6 pr-2 py-2 text-sm text-white placeholder-gray-400 focus:outline-none"
                        />
                        <button 
                            type="submit" 
                            className="text-[#cba876] hover:text-white transition-colors flex items-center justify-center shrink-0"
                            aria-label="Search"
                        >
                            <Search className="w-5 h-5" />
                        </button>
                    </form>

                    {/* Ajax Autocomplete Suggestions List */}
                    {showSuggestions && suggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#0a0a0a] border border-[#1c1c1c] rounded-lg shadow-2xl overflow-hidden z-50 divide-y divide-[#1c1c1c]">
                            {suggestions.map((item: any) => {
                                const imgUrl = item.image 
                                    ? (item.image.startsWith('http') ? item.image : `/storage/${item.image}`) 
                                    : '/images/placeholder.png';
                                
                                return (
                                    <Link
                                        key={item.id}
                                        href={`/products/${item.slug}`}
                                        onClick={() => setShowSuggestions(false)}
                                        className="flex items-center px-4 py-3 hover:bg-[#cba876]/10 transition-colors group text-left"
                                    >
                                        <img 
                                            src={imgUrl} 
                                            alt={item.name} 
                                            className="w-10 h-10 object-cover rounded bg-[#0d0d0d] border border-white/5 mr-3"
                                        />
                                        <div className="flex-grow min-w-0">
                                            <h5 className="text-xs font-bold text-white truncate group-hover:text-[#cba876] transition-colors">{item.name}</h5>
                                            <span className="text-[11px] font-black text-[#cba876] block mt-0.5">{item.price}</span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Right Column: Tools (Cart & Account) */}
                <div className="flex items-center space-x-3 md:space-x-4 shrink-0">
                    
                    {/* User Account / Login (Icon-only, styled circularly to match cart) */}
                    <Link 
                        href={auth.user ? "/dashboard" : "/login"} 
                        className="p-2.5 bg-[#ffffff0f] rounded-full border border-[#ffffff1a] hover:border-[#cba876]/40 transition-colors group flex items-center justify-center"
                        title={auth.user ? "Dashboard" : "Login / Register"}
                    >
                        <User className="w-6 h-6 text-white group-hover:text-[#cba876] transition-colors" />
                    </Link>

                    {/* Cart Tool (Icon-only, styled circularly with badge and Sheet drawer) */}
                    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
                        <SheetTrigger asChild>
                            <button 
                                type="button" 
                                className="relative p-2.5 bg-[#ffffff0f] rounded-full border border-[#ffffff1a] hover:border-[#cba876]/40 transition-colors group flex items-center justify-center cursor-pointer"
                                title="Shopping Cart"
                            >
                                <ShoppingBag className="w-6 h-6 text-white group-hover:text-[#cba876] transition-colors" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-[#cba876] text-black text-[10px] font-black flex items-center justify-center rounded-full shadow-sm">
                                        {cartCount}
                                    </span>
                                )}
                            </button>
                        </SheetTrigger>
                        <SheetContent side="right" className="flex w-[min(28rem,100vw)] flex-col bg-[#0a0a0a] text-white p-0 border-l border-[#1c1c1c] focus:ring-0 focus-visible:outline-none">
                            <SheetHeader className="border-b border-[#1c1c1c] p-6 text-left bg-[#050505]">
                                <div className="flex items-center justify-between">
                                    <SheetTitle className="flex items-center gap-2.5 text-xl font-black uppercase tracking-widest text-white">
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
                                        <h3 className="text-lg font-bold text-white uppercase tracking-wider">Your cart is empty</h3>
                                        <p className="mt-2 text-sm text-gray-400">It looks like you haven't added anything to your cart yet.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {Object.entries(cart || {}).map(([id, item]: [string, any]) => {
                                            const imgUrl = item.image 
                                                ? (item.image.startsWith('http') ? item.image : `/storage/${item.image}`) 
                                                : '/images/placeholder.png';

                                            return (
                                                <div key={id} className="rounded-lg border border-[#1c1c1c] bg-[#0d0d0d] p-4">
                                                    <div className="flex gap-4">
                                                        <div className="h-20 w-20 flex-none overflow-hidden rounded-md border border-[#1c1c1c] p-0.5 bg-[#050505]">
                                                            <img src={imgUrl} alt={item.name} className="h-full w-full object-cover rounded-sm" />
                                                        </div>
                                                        <div className="flex flex-1 flex-col justify-between">
                                                            <div className="space-y-0.5">
                                                                <h4 className="text-[14px] font-bold text-white leading-snug">{item.name}</h4>
                                                                {item.color && (
                                                                    <span className="text-[11px] font-bold text-gray-500 uppercase block">
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
                                                                        onClick={() => router.patch(route('cart.update', id), { quantity: Math.max(1, item.quantity - 1) })}
                                                                        className="flex h-8 w-8 items-center justify-center rounded-sm border border-[#1c1c1c] bg-[#141414] text-gray-400 hover:text-white hover:bg-[#1f1f1f] transition-colors"
                                                                    >
                                                                        <Minus className="h-3 w-3" />
                                                                    </button>
                                                                    <span className="text-[14px] font-bold text-white w-4 text-center">{item.quantity}</span>
                                                                    <button 
                                                                        onClick={() => router.patch(route('cart.update', id), { quantity: item.quantity + 1 })}
                                                                        className="flex h-8 w-8 items-center justify-center rounded-sm border border-[#1c1c1c] bg-[#141414] text-gray-400 hover:text-white hover:bg-[#1f1f1f] transition-colors"
                                                                    >
                                                                        <Plus className="h-3 w-3" />
                                                                    </button>
                                                                </div>
                                                                <button 
                                                                    onClick={() => router.delete(route('cart.remove', id))}
                                                                    className="text-gray-500 hover:text-red-500 transition-colors"
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
                                <div className="border-t border-[#1c1c1c] p-6 space-y-4 bg-[#050505]">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[15px] font-black uppercase tracking-widest text-gray-400">Total:</span>
                                        <span className="text-[22px] font-black text-[#cba876]">
                                            ৳ {cartTotal.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="space-y-3">
                                        <Link href={route('checkout.index')} onClick={() => setIsCartOpen(false)} className="w-full block">
                                            <Button className="w-full rounded-md h-12 text-sm font-black bg-[#cba876] text-black hover:bg-[#b89563] uppercase tracking-widest transition-colors cursor-pointer">
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
            <div className="hidden lg:block border-t border-[#1c1c1c] bg-[#000000]">
                <div className="container mx-auto px-8">
                    <nav className="flex items-center justify-center space-x-8 h-12">
                        {displayMenus.map((menu: any) => (
                            <div key={menu.id} className="relative group h-full flex items-center">
                                <Link
                                    href={menu.url || (menu.category ? `/products?category=${menu.category.slug}` : '#')}
                                    className="text-[13px] font-bold tracking-wider text-gray-300 hover:text-[#cba876] uppercase transition-colors h-full flex items-center relative"
                                >
                                    {menu.title}
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#cba876] group-hover:w-full transition-all duration-300" />
                                </Link>

                                {/* Dropdown Menu (If children exist) */}
                                {menu.children && menu.children.length > 0 && (
                                    <div className="absolute top-full left-0 mt-0 w-56 bg-[#0a0a0a] border border-[#1c1c1c] rounded-b-md shadow-2xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                        {menu.children.map((child: any) => (
                                            <Link
                                                key={child.id}
                                                href={child.url || (child.category ? `/products?category=${child.category.slug}` : '#')}
                                                className="block px-4 py-2 text-[12px] font-semibold text-gray-400 hover:text-white hover:bg-[#cba876]/10 transition-colors"
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
            <div className="lg:hidden px-4 pb-4 search-container-mobile relative">
                <form onSubmit={handleSearch} className="w-full flex items-center h-10 rounded-full border border-[#cba876] bg-[#050505] transition-all pr-4">
                    <input
                        type="text"
                        placeholder="Search for products"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                        className="w-full bg-transparent pl-5 pr-2 py-2 text-sm text-white placeholder-gray-400 focus:outline-none"
                    />
                    <button 
                        type="submit" 
                        className="text-[#cba876] hover:text-white transition-colors flex items-center justify-center shrink-0"
                    >
                        <Search className="w-4 h-4" />
                    </button>
                </form>

                {/* Mobile Autocomplete Suggestions List */}
                {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute top-full left-4 right-4 mt-1 bg-[#0a0a0a] border border-[#1c1c1c] rounded-lg shadow-2xl overflow-hidden z-50 divide-y divide-[#1c1c1c]">
                        {suggestions.map((item: any) => {
                            const imgUrl = item.image 
                                ? (item.image.startsWith('http') ? item.image : `/storage/${item.image}`) 
                                : '/images/placeholder.png';
                            
                            return (
                                <Link
                                    key={item.id}
                                    href={`/products/${item.slug}`}
                                    onClick={() => setShowSuggestions(false)}
                                    className="flex items-center px-3 py-2.5 hover:bg-[#cba876]/10 transition-colors group text-left"
                                >
                                    <img 
                                        src={imgUrl} 
                                        alt={item.name} 
                                        className="w-8 h-8 object-cover rounded bg-[#0d0d0d] border border-white/5 mr-3"
                                    />
                                    <div className="flex-grow min-w-0">
                                        <h5 className="text-[11px] font-bold text-white truncate group-hover:text-[#cba876] transition-colors">{item.name}</h5>
                                        <span className="text-[10px] font-black text-[#cba876] block mt-0.5">{item.price}</span>
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
                    <div 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                    />
                    
                    {/* Drawer Content */}
                    <div className="relative w-80 max-w-[80vw] bg-[#0a0a0a] border-r border-[#1c1c1c] h-full flex flex-col p-6 z-10 text-white">
                        <div className="flex items-center justify-between mb-8">
                            <span className="text-lg font-bold uppercase tracking-wider">{settings.site_name}</span>
                            <button 
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-gray-400 hover:text-white"
                                aria-label="Close menu"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Navigation Links */}
                        <nav className="flex flex-col space-y-4 overflow-y-auto mb-8">
                            {displayMenus.map((menu: any) => (
                                <div key={menu.id} className="flex flex-col space-y-2">
                                    <Link
                                        href={menu.url || (menu.category ? `/products?category=${menu.category.slug}` : '#')}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="text-sm font-bold uppercase tracking-wider hover:text-[#cba876] transition-colors"
                                    >
                                        {menu.title}
                                    </Link>
                                    
                                    {/* Children Links */}
                                    {menu.children && menu.children.length > 0 && (
                                        <div className="pl-4 flex flex-col space-y-2 border-l border-[#1c1c1c]">
                                            {menu.children.map((child: any) => (
                                                <Link
                                                    key={child.id}
                                                    href={child.url || (child.category ? `/products?category=${child.category.slug}` : '#')}
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                    className="text-xs text-gray-400 hover:text-white transition-colors"
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
                                    className="block text-sm font-bold uppercase text-gray-300 hover:text-[#cba876] transition-colors"
                                >
                                    Dashboard ({auth.user.name})
                                </Link>
                            ) : (
                                <Link
                                    href="/login"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block text-sm font-bold uppercase text-gray-300 hover:text-[#cba876] transition-colors"
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
