import { Link, router, usePage } from '@inertiajs/react';
import { ChevronDown, Globe, Heart, Menu, Phone, Search, ShoppingCart, Shuffle, UserRound, Minus, Plus, Trash2, Leaf } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { type SharedData } from '@/types';
import { type DynamicMenuItem } from '@/components/storefront-header';

const getMenuItemHref = (item: DynamicMenuItem) => {
    if (item.type === 'category' && item.category) {
        return route('products.index', { category: item.category.name });
    }
    return item.url || '#';
};

export function ShutkirHeader() {
    const { auth, cartCount, cart, menus, settings } = usePage<SharedData>().props;
    const activeMenus = (menus && (menus as Array<unknown>).length > 0) ? (menus as DynamicMenuItem[]) : [];
    const [openSection, setOpenSection] = useState<string | null>(null);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [prevCartCount, setPrevCartCount] = useState(cartCount);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (searchQuery.length < 2) {
            setSearchResults([]);
            setShowDropdown(false);
            return;
        }

        const timer = setTimeout(async () => {
            setIsSearching(true);
            try {
                const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
                const data = await response.json();
                setSearchResults(data);
                setShowDropdown(true);
            } catch (error) {
                console.error("Search failed:", error);
            } finally {
                setIsSearching(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const logoUrl = (settings as any)?.site_logo_url as string | undefined;
    const siteName = (settings as any)?.site_name || 'WoodMart';
    const accountHref = auth.user ? route('dashboard') : route('login');

    if (cartCount > prevCartCount) { setIsCartOpen(true); setPrevCartCount(cartCount); }
    else if (cartCount < prevCartCount) { setPrevCartCount(cartCount); }

    const cartTotal = Object.values(cart).reduce((sum, item) => {
        const price = parseInt((item.price || '0').replace(/[^\d]/g, ''));
        return sum + price * item.quantity;
    }, 0);

    return (
        <header className="sticky top-0 z-50 w-full bg-white font-sans shadow-sm">
            {/* Top Tier */}
            <div className="border-b border-gray-100">
                <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between gap-6 py-4 lg:py-5">
                        
                        {/* Logo */}
                        <div className="flex shrink-0">
                            <Link href={route('home')} className="flex shrink-0 items-center gap-2">
                                {logoUrl ? (
                                    <img src={logoUrl} alt={siteName} className="h-14 md:h-16 w-auto object-contain" />
                                ) : (
                                    <span className="text-[28px] font-black tracking-tighter text-[#1e1e1e]">
                                        <span className="text-[#8ba45e] italic mr-1">/ /</span>{siteName}<span className="text-[#8ba45e]">.</span>
                                    </span>
                                )}
                            </Link>
                        </div>

                        {/* Search Bar */}
                        <div className="hidden lg:flex flex-[2] justify-center px-4 xl:px-12">
                            <div className="relative w-full max-w-2xl" ref={searchRef}>
                                <form
                                    className="flex w-full items-center rounded-full border-2 border-[#8ba45e] bg-white p-0.5 shadow-sm focus-within:ring-2 focus-within:ring-[#8ba45e]/30 transition-shadow"
                                    onSubmit={(e) => { e.preventDefault(); setShowDropdown(false); if (searchQuery) router.get(route('products.index'), { q: searchQuery }); }}
                                >
                                    <input
                                        type="search"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onFocus={() => { if (searchQuery.length >= 2) setShowDropdown(true); }}
                                        placeholder="Search for products"
                                        className="w-full border-none bg-transparent px-5 py-2 text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-0"
                                    />
                                    <button
                                        type="submit"
                                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#8ba45e] text-white hover:bg-[#72874d] transition-colors"
                                    >
                                        <Search className="h-4 w-4" />
                                    </button>
                                </form>

                                {/* Dropdown */}
                                {showDropdown && (
                                    <div className="absolute top-full left-0 z-50 mt-2 w-full rounded-xl border border-gray-100 bg-white shadow-xl overflow-hidden max-h-96 overflow-y-auto">
                                        {isSearching ? (
                                            <div className="p-4 text-center text-sm text-gray-500">Searching...</div>
                                        ) : searchResults.length > 0 ? (
                                            <ul className="py-2">
                                                {searchResults.map((product) => (
                                                    <li key={product.id}>
                                                        <Link
                                                            href={route('products.show', product.slug)}
                                                            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                                                            onClick={() => setShowDropdown(false)}
                                                        >
                                                            {product.featured_image ? (
                                                                <img src={`/storage/${product.featured_image}`} alt={product.name} className="h-10 w-10 rounded object-cover" />
                                                            ) : (
                                                                <div className="h-10 w-10 rounded bg-gray-100 flex items-center justify-center text-gray-400">
                                                                    <Search className="h-4 w-4" />
                                                                </div>
                                                            )}
                                                            <div className="flex-1 min-w-0">
                                                                <div className="truncate text-sm font-semibold text-gray-800">{product.name}</div>
                                                                <div className="text-sm font-black text-[#8ba45e]">
                                                                    ৳{parseInt((product.sale_price || product.price || '0').replace(/[^\d]/g, '')).toLocaleString()}
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <div className="p-4 text-center text-sm text-gray-500">No products found.</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Contact Info */}
                        <div className="hidden lg:flex items-center gap-8 shrink-0">
                            <div className="flex items-center gap-3">
                                <Phone className="h-8 w-8 text-gray-500 stroke-[1.5]" />
                                <div>
                                    <div className="text-xs font-bold text-gray-900 leading-tight">24 Support</div>
                                    <div className="text-sm font-medium text-[#8ba45e] leading-tight mt-0.5">+1 212-334-0212</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Globe className="h-8 w-8 text-gray-500 stroke-[1.5]" />
                                <div>
                                    <div className="text-xs font-bold text-gray-900 leading-tight">Worldwide</div>
                                    <div className="text-sm font-medium text-[#8ba45e] leading-tight mt-0.5">Free Shipping</div>
                                </div>
                            </div>
                        </div>

                        {/* Mobile controls */}
                        <div className="flex items-center gap-4 lg:hidden">
                            <button onClick={() => setIsCartOpen(true)} className="relative text-gray-700">
                                <ShoppingCart className="h-6 w-6" />
                                {cartCount > 0 && (
                                    <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#8ba45e] text-[10px] font-bold text-white">
                                        {cartCount}
                                    </span>
                                )}
                            </button>
                            <button onClick={() => setIsMobileMenuOpen(true)} className="text-gray-700">
                                <Menu className="h-6 w-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Tier */}
            <div className="bg-[#eaf1f8] hidden lg:block border-b border-blue-100">
                <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
                    <div className="flex h-[52px] items-center justify-between">
                        
                        {/* Left: Categories + Nav Links */}
                        <div className="flex items-center gap-8 h-full">
                            
                            {/* All Categories Button */}
                            <div className="relative flex h-full items-center">
                                <button className="flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-gray-800 shadow-sm transition-shadow hover:shadow-md border border-white">
                                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#8ba45e] text-white">
                                        <Menu className="h-[10px] w-[10px]" />
                                    </div>
                                    All Categories
                                </button>
                            </div>

                            {/* Nav Links */}
                            <nav className="flex items-center gap-8 h-full text-[13px] font-bold text-gray-700 tracking-wide">
                                {activeMenus.map((section) => (
                                    <div key={section.id} className="group relative flex h-full items-center">
                                        <Link href={getMenuItemHref(section)} className="flex items-center gap-1 hover:text-[#8ba45e] transition-colors">
                                            {section.title}
                                            {section.children && section.children.length > 0 && (
                                                <ChevronDown className="h-3.5 w-3.5 opacity-50" />
                                            )}
                                        </Link>
                                        
                                        {/* Dropdown */}
                                        {section.children && section.children.length > 0 && (
                                            <div className="absolute top-full left-0 z-50 hidden min-w-[220px] flex-col rounded-b-lg border-t-2 border-[#8ba45e] bg-white py-2 shadow-xl group-hover:flex">
                                                {section.children.map((item) => (
                                                    <Link key={item.id} href={getMenuItemHref(item)} className="px-4 py-2.5 text-[15px] font-semibold text-gray-600 hover:bg-gray-50 hover:text-[#8ba45e]">
                                                        {item.title}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </nav>
                        </div>

                        {/* Right: Icons & Cart */}
                        <div className="flex items-center gap-6 h-full">
                            <div className="flex items-center gap-3 text-gray-600 text-[13px] font-semibold">
                                <span className="cursor-pointer hover:text-black flex items-center gap-0.5">USA <ChevronDown className="h-3 w-3 opacity-50" /></span>
                                <span className="cursor-pointer hover:text-black flex items-center gap-0.5">USD <ChevronDown className="h-3 w-3 opacity-50" /></span>
                            </div>

                            <div className="flex items-center gap-5 ml-1 h-6">
                                <Link href={accountHref} className="text-gray-700 hover:text-black">
                                    <UserRound className="h-5 w-5" />
                                </Link>

                                <Link href="#" className="relative text-gray-700 hover:text-black">
                                    <Shuffle className="h-5 w-5" />
                                    <span className="absolute -right-2 -top-2 flex h-[15px] min-w-[15px] items-center justify-center rounded-full bg-white border border-gray-200 text-[9px] font-bold text-[#8ba45e]">0</span>
                                </Link>
                                
                                <Link href="#" className="relative text-gray-700 hover:text-black">
                                    <Heart className="h-5 w-5" />
                                    <span className="absolute -right-2 -top-2 flex h-[15px] min-w-[15px] items-center justify-center rounded-full bg-white border border-gray-200 text-[9px] font-bold text-[#8ba45e]">0</span>
                                </Link>

                                <button onClick={() => setIsCartOpen(true)} className="flex items-center gap-3 text-gray-700 group hover:text-black ml-1">
                                    <div className="relative flex h-[42px] w-[42px] items-center justify-center rounded-full bg-[#8ba45e] text-white shadow-sm">
                                        <ShoppingCart className="h-[18px] w-[18px]" />
                                        {cartCount > 0 && (
                                            <span className="absolute -right-1 -top-1 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-white text-[#8ba45e] text-[10px] font-bold border border-gray-100 shadow-sm">
                                                {cartCount}
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-[16px] font-black tracking-tight ml-1">৳{cartTotal.toLocaleString()}</span>
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Cart Sidebar */}
            <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
                <SheetContent side="right" className="flex w-[min(28rem,100vw)] flex-col p-0 bg-white">
                    <SheetHeader className="p-5 border-b border-gray-100">
                        <SheetTitle className="flex items-center gap-2 font-bold text-gray-900">
                            <ShoppingCart className="h-5 w-5 text-gray-500" />
                            Shopping Cart ({cartCount})
                        </SheetTitle>
                    </SheetHeader>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50">
                        {cartCount === 0 ? (
                            <div className="flex h-full flex-col items-center justify-center py-16 text-center text-gray-500">
                                <ShoppingCart className="h-16 w-16 mb-4 opacity-20" />
                                <h3 className="text-lg font-bold text-gray-800">Cart is empty</h3>
                                <p className="mt-1 text-sm">Add some products to your cart!</p>
                            </div>
                        ) : (
                            Object.entries(cart).map(([id, item]) => (
                                <div key={id} className="rounded-xl bg-white p-3 shadow-sm border border-gray-100 flex gap-4">
                                    <div className="h-20 w-20 flex-none overflow-hidden rounded-lg bg-gray-100 border border-gray-100">
                                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                                    </div>
                                    <div className="flex flex-1 flex-col justify-between">
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-800 line-clamp-2">{item.name}</h4>
                                            <div className="text-sm font-black text-[#8ba45e] mt-1">
                                                ৳{parseInt((item.price || '0').replace(/[^\d]/g, '')).toLocaleString()}
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between mt-2">
                                            <div className="flex items-center rounded-lg border border-gray-200 overflow-hidden">
                                                <button onClick={() => router.patch(route('cart.update', id), { quantity: Math.max(1, item.quantity - 1) })}
                                                    className="flex h-7 w-7 items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-600">
                                                    <Minus className="h-3 w-3" />
                                                </button>
                                                <span className="w-8 text-center text-sm font-bold text-gray-800">{item.quantity}</span>
                                                <button onClick={() => router.patch(route('cart.update', id), { quantity: item.quantity + 1 })}
                                                    className="flex h-7 w-7 items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-600">
                                                    <Plus className="h-3 w-3" />
                                                </button>
                                            </div>
                                            <button onClick={() => router.delete(route('cart.remove', id))} className="text-gray-400 hover:text-red-500 transition-colors">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {cartCount > 0 && (
                        <div className="p-5 bg-white border-t border-gray-100 space-y-4 shadow-[0_-4px_10px_rgba(0,0,0,0.03)]">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Subtotal</span>
                                <span className="text-xl font-black text-gray-900">৳{cartTotal.toLocaleString()}</span>
                            </div>
                            <Link href={route('checkout.index')} className="block w-full">
                                <Button className="w-full h-12 rounded-xl font-bold uppercase tracking-wide text-white bg-[#8ba45e] hover:bg-[#72874d] shadow-md hover:shadow-lg transition-all">
                                    Checkout
                                </Button>
                            </Link>
                        </div>
                    )}
                </SheetContent>
            </Sheet>

            {/* Mobile Menu Sidebar */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetContent side="left" className="w-[min(22rem,100vw)] overflow-y-auto p-0 bg-white">
                    <div className="p-5 border-b border-gray-100 bg-gray-50">
                        <Link href={route('home')} className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                            {logoUrl ? (
                                <img src={logoUrl} alt={siteName} className="h-8 w-auto object-contain" />
                            ) : (
                                <span className="text-xl font-black text-gray-900 tracking-tight">{siteName}</span>
                            )}
                        </Link>
                    </div>
                    <div className="p-4 space-y-2">
                        {/* Mobile Search */}
                        <form className="flex overflow-hidden rounded-full border border-gray-200 mb-6 focus-within:border-[#8ba45e] transition-colors"
                            onSubmit={(e) => { e.preventDefault(); setIsMobileMenuOpen(false); if (searchQuery) router.get(route('products.index'), { q: searchQuery }); }}>
                            <input type="search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search..."
                                className="min-w-0 flex-1 border-0 bg-transparent px-4 py-2.5 text-sm outline-none text-gray-800" />
                            <button type="submit" className="inline-flex items-center justify-center px-4 text-white bg-[#8ba45e]">
                                <Search className="h-4 w-4" />
                            </button>
                        </form>

                        {activeMenus.map((section) => {
                            const hasChildren = section.children && section.children.length > 0;
                            if (!hasChildren) {
                                return (
                                    <Link key={section.id} href={getMenuItemHref(section)} onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center justify-between rounded-lg px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50">
                                        {section.title}
                                    </Link>
                                );
                            }
                            return (
                                <Collapsible key={section.id} open={openSection === section.title} onOpenChange={(o) => setOpenSection(o ? section.title : null)}>
                                    <CollapsibleTrigger className="group flex w-full items-center justify-between rounded-lg px-4 py-3 text-left text-sm font-bold text-gray-700 hover:bg-gray-50">
                                        {section.title}
                                        <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180 text-gray-400" />
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <div className="pl-6 pr-4 py-1 space-y-1">
                                            {section.children?.map((item) => (
                                                <Link key={item.id} href={getMenuItemHref(item)} onClick={() => setIsMobileMenuOpen(false)}
                                                    className="block rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-[#8ba45e]">
                                                    {item.title}
                                                </Link>
                                            ))}
                                        </div>
                                    </CollapsibleContent>
                                </Collapsible>
                            );
                        })}

                        <div className="mt-8 pt-4 border-t border-gray-100">
                            <Link href={accountHref} onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50">
                                <UserRound className="h-5 w-5 text-gray-400" />
                                {auth.user ? auth.user.name : 'Login / Register'}
                            </Link>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </header>
    );
}
