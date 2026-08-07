import { Link, router, usePage } from '@inertiajs/react';
import { Anchor, ChevronDown, Menu, Minus, PhoneCall, Plus, Search, ShoppingBag, ShoppingCart, Trash2, UserRound, Waves } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { type DynamicMenuItem } from '@/components/storefront-header';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { type SharedData } from '@/types';

const getMenuItemHref = (item: DynamicMenuItem) => {
    if (item.type === 'category' && item.category) {
        return route('products.index', { category: item.category.slug });
    }
    return item.url || '#';
};

export function ShutkiOceanHeader() {
    const { auth, cartCount, cart, menus, settings } = usePage<SharedData>().props;
    const activeMenus = menus && (menus as Array<unknown>).length > 0 ? (menus as DynamicMenuItem[]) : [];
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
                console.error('Search failed:', error);
            } finally {
                setIsSearching(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const logoUrl = (settings as any)?.site_logo_url as string | undefined;
    const siteName = (settings as any)?.site_name || 'Shutki Ocean';
    const footerPhone = (settings as any)?.footer_phone || '01700000000';
    const accountHref = auth.user ? route('dashboard') : route('login');

    if (cartCount > prevCartCount) {
        setIsCartOpen(true);
        setPrevCartCount(cartCount);
    } else if (cartCount < prevCartCount) {
        setPrevCartCount(cartCount);
    }

    const cartTotal = Object.values(cart).reduce((sum, item) => {
        const price = parseInt((item.price || '0').replace(/[^\d]/g, ''));
        return sum + price * item.quantity;
    }, 0);

    return (
        <header className="sticky top-0 z-50 w-full bg-white font-sans text-slate-800 shadow-sm border-b border-blue-100">
            {/* Top Announcement Bar - Soft Ocean Gradient */}
            <div className="bg-gradient-to-r from-[#0F52BA] via-[#1E40AF] to-[#0F52BA] py-1.5 text-center text-xs font-bold text-white">
                <div className="mx-auto flex max-w-[1440px] items-center justify-center gap-3 px-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/20 px-2.5 py-0.5 text-[11px] font-black text-amber-300">
                        <Waves className="h-3.5 w-3.5 animate-pulse text-amber-400" /> সরাসরি কক্সবাজার বঙ্গোপসাগর উপকূল থেকে
                    </span>
                    <span className="hidden sm:inline">১০০% অর্গানিক ও বিষমুক্ত শুকটি মাছ | দ্রুততম ক্যাশ অন ডেলিভারি অফার!</span>
                </div>
            </div>

            {/* Main Header Row */}
            <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between gap-4 py-3.5 lg:py-4">
                    {/* Brand Logo */}
                    <div className="flex shrink-0 items-center">
                        <Link href={route('home')} className="flex items-center gap-2.5 group">
                            {logoUrl ? (
                                <img src={logoUrl} alt={siteName} className="h-12 w-auto object-contain md:h-14" />
                            ) : (
                                <div className="flex items-center gap-2">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0F52BA] to-[#1E40AF] text-white shadow-md shadow-blue-500/20 transition-transform duration-300 group-hover:scale-105">
                                        <Anchor className="h-5 w-5" />
                                    </div>
                                    <span className="text-xl font-black tracking-tight text-slate-900 md:text-2xl">
                                        {siteName}
                                        <span className="text-[#F97316]">.</span>
                                    </span>
                                </div>
                            )}
                        </Link>
                    </div>

                    {/* Search Bar - Crisp Light Ocean Style */}
                    <div className="hidden flex-1 max-w-xl px-4 lg:block" ref={searchRef}>
                        <form
                            className="relative flex items-center overflow-hidden rounded-full border-2 border-blue-200 bg-blue-50/50 transition-all duration-300 focus-within:border-[#0F52BA] focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-200"
                            onSubmit={(e) => {
                                e.preventDefault();
                                setShowDropdown(false);
                                if (searchQuery) router.get(route('products.index'), { q: searchQuery });
                            }}
                        >
                            <input
                                type="search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => {
                                    if (searchQuery.length >= 2) setShowDropdown(true);
                                }}
                                placeholder="পছন্দের শুকটি মাছ খুঁজুন (যেমন: রূপচাঁদা, লইট্যা, ছুরি...)"
                                className="w-full bg-transparent px-5 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none"
                            />
                            <button
                                type="submit"
                                className="mr-1.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-[#0F52BA] to-[#1E40AF] text-white shadow-sm transition-transform hover:scale-105"
                            >
                                <Search className="h-4 w-4" />
                            </button>
                        </form>

                        {/* Search Dropdown */}
                        {showDropdown && (
                            <div className="absolute left-0 top-full z-50 mt-2 max-h-96 w-full overflow-hidden overflow-y-auto rounded-2xl border border-blue-100 bg-white p-2 shadow-2xl">
                                {isSearching ? (
                                    <div className="p-4 text-center text-sm text-blue-600 animate-pulse font-medium">খোঁজা হচ্ছে...</div>
                                ) : searchResults.length > 0 ? (
                                    <ul className="space-y-1">
                                        {searchResults.map((product) => (
                                            <li key={product.id}>
                                                <Link
                                                    href={route('products.show', product.slug)}
                                                    className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-blue-50"
                                                    onClick={() => setShowDropdown(false)}
                                                >
                                                    {product.featured_image ? (
                                                        <img
                                                            src={`/storage/${product.featured_image}`}
                                                            alt={product.name}
                                                            className="h-12 w-12 rounded-lg object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
                                                            <Search className="h-5 w-5" />
                                                        </div>
                                                    )}
                                                    <div className="min-w-0 flex-1">
                                                        <div className="truncate text-sm font-bold text-slate-800">{product.name}</div>
                                                        <div className="text-sm font-black text-[#F97316]">
                                                            ৳
                                                            {parseInt(
                                                                (product.sale_price || product.price || '0').replace(/[^\d]/g, ''),
                                                            ).toLocaleString('en-BD')}
                                                        </div>
                                                    </div>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="p-4 text-center text-sm text-slate-500">কোনো শুকটি মাছ পাওয়া যায়নি</div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right Hotline & Cart Controls */}
                    <div className="hidden lg:flex items-center gap-5">
                        {/* Hotline Button */}
                        <a
                            href={`tel:${footerPhone}`}
                            className="flex items-center gap-3 rounded-2xl border border-blue-200 bg-blue-50/60 px-3.5 py-1.5 transition-all hover:bg-blue-100/80 hover:border-blue-300"
                        >
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0F52BA] text-white shadow-sm">
                                <PhoneCall className="h-4 w-4" />
                            </div>
                            <div className="text-left">
                                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">অর্ডার হটলাইন</div>
                                <div className="text-sm font-black text-[#0F52BA]">{footerPhone}</div>
                            </div>
                        </a>

                        {/* Account */}
                        <Link
                            href={accountHref}
                            className="flex items-center justify-center h-10 w-10 rounded-2xl border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
                        >
                            <UserRound className="h-5 w-5" />
                        </Link>

                        {/* Cart Drawer Trigger */}
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="group relative flex items-center gap-3 rounded-2xl bg-gradient-to-r from-[#F97316] to-[#EA580C] px-4.5 py-2.5 text-white shadow-md shadow-orange-500/20 transition-all hover:scale-[1.02] hover:shadow-lg"
                        >
                            <div className="relative">
                                <ShoppingCart className="h-5 w-5" />
                                {cartCount > 0 && (
                                    <span className="absolute -right-2.5 -top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[11px] font-black text-[#F97316] shadow-sm">
                                        {cartCount}
                                    </span>
                                )}
                            </div>
                            <div className="text-left">
                                <div className="text-[10px] font-bold uppercase tracking-wider text-orange-100">কার্ট হিসাব</div>
                                <div className="text-sm font-black">৳{cartTotal.toLocaleString('en-BD')}</div>
                            </div>
                        </button>
                    </div>

                    {/* Mobile Controls */}
                    <div className="flex items-center gap-3 lg:hidden">
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white shadow-md"
                        >
                            <ShoppingCart className="h-5 w-5" />
                            {cartCount > 0 && (
                                <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-black text-[#F97316]">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700"
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom Nav Bar - Light Coastal Blue */}
            <div className="hidden lg:block border-t border-blue-100 bg-[#F0F6FF] py-2">
                <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
                    <nav className="flex items-center gap-4 text-sm font-bold">
                        <Link
                            href={route('home')}
                            className="flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-slate-700 transition-colors hover:bg-white hover:text-[#0F52BA]"
                        >
                            হোম
                        </Link>
                        <Link
                            href={route('products.index')}
                            className="flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-[#0F52BA] font-black transition-colors hover:bg-white"
                        >
                            <ShoppingBag className="h-4 w-4 text-[#F97316]" /> সকল শুকটি মাছ
                        </Link>

                        {activeMenus.map((section) => (
                            <div key={section.id} className="group relative">
                                <Link
                                    href={getMenuItemHref(section)}
                                    className="flex items-center gap-1 rounded-xl px-3 py-1.5 text-slate-700 transition-colors hover:bg-white hover:text-[#0F52BA]"
                                >
                                    {section.title}
                                    {section.children && section.children.length > 0 && <ChevronDown className="h-3.5 w-3.5 opacity-60" />}
                                </Link>

                                {section.children && section.children.length > 0 && (
                                    <div className="absolute left-0 top-full z-50 hidden min-w-[200px] flex-col rounded-2xl border border-blue-100 bg-white p-2 shadow-xl group-hover:flex">
                                        {section.children.map((item) => (
                                            <Link
                                                key={item.id}
                                                href={getMenuItemHref(item)}
                                                className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-blue-50 hover:text-[#0F52BA]"
                                            >
                                                {item.title}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </nav>

                    <div className="flex items-center gap-4 text-xs font-bold text-[#0F52BA]">
                        <span className="inline-flex items-center gap-1.5 bg-blue-100/80 px-3 py-1 rounded-full">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" /> সোনাদিয়া দ্বীপের ফ্রেশ স্টক
                        </span>
                    </div>
                </div>
            </div>

            {/* Cart Drawer */}
            <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
                <SheetContent side="right" className="flex w-[min(28rem,100vw)] flex-col bg-white p-0 text-slate-900 border-l border-slate-200">
                    <SheetHeader className="border-b border-slate-100 p-5 bg-blue-50/50">
                        <SheetTitle className="flex items-center gap-2 text-lg font-black text-[#0F52BA]">
                            <ShoppingCart className="h-5 w-5 text-[#F97316]" />
                            শপিং কার্ট ({cartCount})
                        </SheetTitle>
                    </SheetHeader>

                    <div className="flex-1 space-y-3 overflow-y-auto p-4 bg-slate-50/30">
                        {cartCount === 0 ? (
                            <div className="flex h-full flex-col items-center justify-center py-16 text-center text-slate-400">
                                <ShoppingCart className="mb-4 h-16 w-16 opacity-30 text-[#0F52BA]" />
                                <h3 className="text-lg font-bold text-slate-800">আপনার কার্ট খালি</h3>
                                <p className="mt-1 text-sm text-slate-500">পছন্দের শুকটি মাছ সিলেক্ট করে কার্টে যোগ করুন!</p>
                            </div>
                        ) : (
                            Object.entries(cart).map(([id, item]) => (
                                <div key={id} className="flex gap-4 rounded-2xl border border-blue-100 bg-white p-3 shadow-sm">
                                    <div className="h-20 w-20 flex-none overflow-hidden rounded-xl bg-slate-100 border border-slate-100">
                                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                                    </div>
                                    <div className="flex flex-1 flex-col justify-between">
                                        <div>
                                            <h4 className="line-clamp-2 text-sm font-bold text-slate-900">{item.name}</h4>
                                            <div className="mt-1 text-sm font-black text-[#F97316]">
                                                ৳{parseInt((item.price || '0').replace(/[^\d]/g, '')).toLocaleString('en-BD')}
                                            </div>
                                        </div>
                                        <div className="mt-2 flex items-center justify-between">
                                            <div className="flex items-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                                                <button
                                                    onClick={() =>
                                                        router.patch(route('cart.update', id), { quantity: Math.max(1, item.quantity - 1) })
                                                    }
                                                    className="flex h-7 w-7 items-center justify-center text-slate-600 hover:bg-slate-200"
                                                >
                                                    <Minus className="h-3 w-3" />
                                                </button>
                                                <span className="w-8 text-center text-sm font-bold text-slate-800">{item.quantity}</span>
                                                <button
                                                    onClick={() => router.patch(route('cart.update', id), { quantity: item.quantity + 1 })}
                                                    className="flex h-7 w-7 items-center justify-center text-slate-600 hover:bg-slate-200"
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => router.delete(route('cart.remove', id))}
                                                className="text-slate-400 transition-colors hover:text-red-500"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {cartCount > 0 && (
                        <div className="space-y-4 border-t border-slate-200 bg-white p-5 shadow-lg">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-slate-500 uppercase">মোট হিসাব</span>
                                <span className="text-xl font-black text-[#0F52BA]">৳{cartTotal.toLocaleString('en-BD')}</span>
                            </div>
                            <Link href={route('checkout.index')} className="block w-full">
                                <Button className="h-12 w-full rounded-2xl bg-gradient-to-r from-[#F97316] to-[#EA580C] font-black tracking-wide text-white uppercase shadow-md shadow-orange-500/20 transition-all hover:scale-[1.01]">
                                    অর্ডার সম্পন্ন করুন
                                </Button>
                            </Link>
                        </div>
                    )}
                </SheetContent>
            </Sheet>

            {/* Mobile Drawer */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetContent side="left" className="w-[min(22rem,100vw)] overflow-y-auto bg-white p-0 text-slate-900 border-r border-slate-200">
                    <div className="border-b border-blue-100 bg-blue-50/60 p-5">
                        <Link href={route('home')} className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0F52BA] text-white">
                                <Anchor className="h-5 w-5" />
                            </div>
                            <span className="text-lg font-black text-slate-900">{siteName}</span>
                        </Link>
                    </div>

                    <div className="space-y-2 p-4">
                        <form
                            className="mb-4 flex overflow-hidden rounded-full border border-blue-200 bg-blue-50/50"
                            onSubmit={(e) => {
                                e.preventDefault();
                                setIsMobileMenuOpen(false);
                                if (searchQuery) router.get(route('products.index'), { q: searchQuery });
                            }}
                        >
                            <input
                                type="search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="খুঁজুন..."
                                className="w-full border-0 bg-transparent px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none"
                            />
                            <button type="submit" className="flex items-center justify-center bg-[#0F52BA] px-4 text-white">
                                <Search className="h-4 w-4" />
                            </button>
                        </form>

                        <Link
                            href={route('home')}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block rounded-xl px-4 py-3 text-sm font-bold text-slate-800 hover:bg-blue-50"
                        >
                            হোম
                        </Link>
                        <Link
                            href={route('products.index')}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block rounded-xl px-4 py-3 text-sm font-black text-[#0F52BA] hover:bg-blue-50"
                        >
                            সকল শুকটি মাছ
                        </Link>

                        {activeMenus.map((section) => {
                            const hasChildren = section.children && section.children.length > 0;
                            if (!hasChildren) {
                                return (
                                    <Link
                                        key={section.id}
                                        href={getMenuItemHref(section)}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block rounded-xl px-4 py-3 text-sm font-bold text-slate-700 hover:bg-blue-50"
                                    >
                                        {section.title}
                                    </Link>
                                );
                            }
                            return (
                                <Collapsible
                                    key={section.id}
                                    open={openSection === section.title}
                                    onOpenChange={(o) => setOpenSection(o ? section.title : null)}
                                >
                                    <CollapsibleTrigger className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-bold text-slate-700 hover:bg-blue-50">
                                        {section.title}
                                        <ChevronDown className="h-4 w-4 text-slate-400" />
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <div className="space-y-1 py-1 pl-6 pr-4">
                                            {section.children?.map((item) => (
                                                <Link
                                                    key={item.id}
                                                    href={getMenuItemHref(item)}
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                    className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-blue-50 hover:text-[#0F52BA]"
                                                >
                                                    {item.title}
                                                </Link>
                                            ))}
                                        </div>
                                    </CollapsibleContent>
                                </Collapsible>
                            );
                        })}
                    </div>
                </SheetContent>
            </Sheet>
        </header>
    );
}
