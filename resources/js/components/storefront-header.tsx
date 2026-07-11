import { Link, router, usePage } from '@inertiajs/react';
import { ChevronDown, Menu, Minus, Plus, Search, ShoppingCart, Trash2, UserRound } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { type SharedData } from '@/types';

/* LIGHT Organic Palette */
const P = {
    sage: 'hsl(89,32%,54%)',
    sageDark: 'hsl(89,35%,42%)',
    sageLight: 'hsl(89,28%,88%)',
    sageBg: 'hsl(89,22%,95%)',
    honey: 'hsl(38,72%,52%)',
    honeyLight: 'hsl(38,70%,92%)',
    terra: 'hsl(18,55%,52%)',
    terraLight: 'hsl(18,55%,94%)',
    cream: 'hsl(48,40%,97%)',
    white: '#ffffff',
    border: 'hsl(89,20%,86%)',
    earth: 'hsl(35,28%,18%)',
    earthMid: 'hsl(35,22%,36%)',
    earthLight: 'hsl(35,18%,52%)',
} as const;

type CatalogSection = {
    title: string;
    items: string[];
};

export type DynamicMenuItem = {
    id: number;
    title: string;
    type: 'custom' | 'category';
    url: string | null;
    category_id: number | null;
    parent_id: number | null;
    order: number;
    category?: {
        id: number;
        name: string;
        slug: string;
    } | null;
    children?: DynamicMenuItem[];
};

const catalogSections: CatalogSection[] = [
    {
        title: "Men's Collection",
        items: ['Wallets', 'Belts', 'Card Holders', 'Office Bags', 'Messenger Bags', 'Backpacks', 'Key Rings', 'Watch Straps'],
    },
    {
        title: "Women's Collection",
        items: ['Handbags', 'Tote Bags', 'Crossbody Bags', 'Clutches', 'Wallets', 'Vanity Bags'],
    },
    {
        title: 'Office & Professional',
        items: ['Laptop Sleeves', 'Briefcases', 'Document Holders', 'Desk Accessories'],
    },
    {
        title: 'Travel Collection',
        items: ['Duffel Bags', 'Passport Holders', 'Travel Organizers', 'Luggage Tags'],
    },
    {
        title: 'Accessories',
        items: ['Keychains', 'Pen Holders', 'Mouse Pads', 'Phone Covers', 'AirPods Cases'],
    },
    {
        title: 'Handmade Collection',
        items: [
            'Handcrafted Products',
            'Limited Edition',
            'Artisan Series',
            'Gifts For Him',
            'Gifts For Her',
            'Corporate Gifts',
            'Personalized Gifts',
        ],
    },
    {
        title: 'Premium / Luxury Series',
        items: ['Full Grain Leather', 'Crazy Horse Leather', 'Vintage Collection', 'Executive Series'],
    },
];

const getMenuItemHref = (item: DynamicMenuItem) => {
    if (item.type === 'category' && item.category) {
        return route('products.index', { category: item.category.name });
    }
    return item.url || '#';
};

const getFallbackMenus = (): DynamicMenuItem[] => {
    return catalogSections.map((section, idx) => ({
        id: -idx - 1,
        title: section.title,
        type: 'custom',
        url: '#',
        category_id: null,
        parent_id: null,
        order: idx + 1,
        children: section.items.map((item, subIdx) => {
            const isWallet = item.includes('Wallet');
            const isBelt = item.includes('Belt');
            const catName = isWallet ? 'Wallets' : isBelt ? 'Belts' : 'Bags';
            return {
                id: -((idx + 1) * 100 + subIdx),
                title: item,
                type: 'custom',
                url: route('products.index', { category: catName }),
                category_id: null,
                parent_id: -idx - 1,
                order: subIdx + 1,
            };
        }),
    }));
};

export function StorefrontHeader() {
    const { auth, cartCount, cart, menus, settings } = usePage<SharedData>().props;
    const activeMenus = menus && (menus as Array<unknown>).length > 0 ? (menus as DynamicMenuItem[]) : getFallbackMenus();
    const [openSection, setOpenSection] = useState<string | null>(null);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [prevCartCount, setPrevCartCount] = useState(cartCount);

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const desktopSearchRef = useRef<HTMLDivElement>(null);
    const mobileSearchRef = useRef<HTMLDivElement>(null);

    const logoUrl = (settings as any)?.site_logo_url as string | undefined;
    const siteName = (settings as any)?.site_name || 'wildtannery';
    const siteTheme = (settings as any)?.site_theme || 'classic';
    const accountHref = auth.user ? route('dashboard') : route('login');

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                desktopSearchRef.current &&
                !desktopSearchRef.current.contains(event.target as Node) &&
                mobileSearchRef.current &&
                !mobileSearchRef.current.contains(event.target as Node)
            ) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (searchQuery.trim().length > 0) {
            setIsSearching(true);
            setShowDropdown(true);
            const delayDebounceFn = setTimeout(() => {
                fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
                    .then((res) => res.json())
                    .then((data) => {
                        setSearchResults(data);
                        setIsSearching(false);
                    })
                    .catch((err) => {
                        console.error('Search error:', err);
                        setIsSearching(false);
                    });
            }, 300);

            return () => clearTimeout(delayDebounceFn);
        } else {
            setSearchResults([]);
            setShowDropdown(false);
            setIsSearching(false);
        }
    }, [searchQuery]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setShowDropdown(false);
            router.get(route('products.index', { search: searchQuery }));
        }
    };

    const SearchDropdown = () =>
        showDropdown && searchQuery.trim().length > 0 ? (
            <div className="absolute top-full left-0 z-50 mt-1 w-full overflow-hidden rounded-md border border-slate-200 bg-white shadow-lg">
                {isSearching ? (
                    <div className="px-4 py-3 text-sm text-slate-500">খুঁজছি...</div>
                ) : searchResults.length > 0 ? (
                    <ul className="max-h-[60vh] overflow-auto py-2">
                        {searchResults.map((product) => (
                            <li key={product.id}>
                                <Link
                                    href={route('products.show', product.slug)}
                                    className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50"
                                    onClick={() => setShowDropdown(false)}
                                >
                                    <img src={product.image} alt={product.name} className="h-12 w-12 rounded object-cover" />
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">{product.name}</p>
                                        <p className="text-xs font-medium text-orange-600">
                                            ৳ {parseInt(String(product.price).replace(/[^\d]/g, '')).toLocaleString()}
                                        </p>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="px-4 py-3 text-sm text-slate-500">কোনো পণ্য পাওয়া যায়নি</div>
                )}
            </div>
        ) : null;

    useEffect(() => {
        const html = document.documentElement;
        html.dataset.theme = siteTheme;
    }, [siteTheme]);
    const accountLabel = auth.user ? 'আপনার একাউন্ট' : 'সাইন ইন';

    // Auto-open drawer when items are added
    if (cartCount > prevCartCount) {
        setIsCartOpen(true);
        setPrevCartCount(cartCount);
    } else if (cartCount < prevCartCount) {
        setPrevCartCount(cartCount);
    }

    return (
        <header className="overflow-x-clip border-b border-black/10 bg-white text-slate-950">
            <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:gap-6">
                    <div className="flex items-center justify-between gap-3 lg:shrink-0">
                        <Link href={route('home')} className="flex items-center gap-3">
                            {logoUrl ? (
                                <img src={logoUrl} alt={`${siteName} logo`} className="h-12 w-auto rounded-lg object-contain" />
                            ) : (
                                <span className="flex h-12 w-12 items-center justify-center rounded-tl-[1.25rem] rounded-br-[1.25rem] bg-black text-2xl font-black tracking-tight text-white uppercase">
                                    {siteName ? siteName.charAt(0).toUpperCase() : 'W'}
                                </span>
                            )}
                        </Link>

                        <div className="flex items-center gap-2 lg:hidden">
                            <Link
                                href={accountHref}
                                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-700"
                            >
                                <UserRound className="h-5 w-5" />
                                <span className="sr-only">{accountLabel}</span>
                            </Link>

                            <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
                                <SheetTrigger asChild>
                                    <button
                                        type="button"
                                        className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-700"
                                        aria-label="Cart"
                                    >
                                        <ShoppingCart className="h-5 w-5" />
                                        {cartCount > 0 && (
                                            <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-orange-600 px-1 text-[10px] font-bold text-white">
                                                {cartCount}
                                            </span>
                                        )}
                                    </button>
                                </SheetTrigger>
                                <SheetContent side="right" className="flex w-[min(28rem,100vw)] flex-col bg-white p-0 focus:ring-0">
                                    <SheetHeader className="border-b border-slate-100 bg-slate-50/50 p-6 text-left">
                                        <div className="flex items-center justify-between">
                                            <SheetTitle className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-slate-900">
                                                <ShoppingCart className="h-6 w-6 text-orange-600" />
                                                শপিং কার্ট ({cartCount})
                                            </SheetTitle>
                                        </div>
                                    </SheetHeader>

                                    <div className="flex-1 overflow-y-auto px-6 py-4">
                                        {cartCount === 0 ? (
                                            <div className="flex h-full flex-col items-center justify-center text-center">
                                                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-50 text-slate-300">
                                                    <ShoppingCart className="h-10 w-10" />
                                                </div>
                                                <h3 className="text-lg font-bold text-slate-950">আপনার কার্টটি খালি</h3>
                                                <p className="mt-2 text-sm text-slate-500">মনে হচ্ছে আপনি এখনও আপনার কার্টে কিছু যোগ করেননি।</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                {Object.entries(cart).map(([id, item]) => (
                                                    <div key={id} className="rounded-md border border-slate-200 bg-white p-4">
                                                        <div className="flex gap-4">
                                                            <div className="h-20 w-20 flex-none overflow-hidden rounded-md border border-slate-100 bg-white p-0.5">
                                                                <img
                                                                    src={item.image}
                                                                    alt={item.name}
                                                                    className="h-full w-full rounded-sm object-cover"
                                                                />
                                                            </div>
                                                            <div className="flex flex-1 flex-col justify-between">
                                                                <div className="space-y-0.5">
                                                                    <h4 className="text-[14px] leading-snug font-bold text-slate-900">{item.name}</h4>
                                                                    <div className="text-[15px] font-bold text-orange-600">
                                                                        ৳ {parseInt(item.price.replace(/[^\d]/g, '')).toLocaleString()}
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center justify-between">
                                                                    {siteTheme === 'shutki' ? (
                                                                        <div
                                                                            className="inline-flex items-center overflow-hidden rounded-xl border"
                                                                            style={{ borderColor: P.border }}
                                                                        >
                                                                            <button
                                                                                onClick={() =>
                                                                                    router.patch(route('cart.update', id), {
                                                                                        quantity: Math.max(1, item.quantity - 1),
                                                                                    })
                                                                                }
                                                                                className="flex h-8 w-8 items-center justify-center text-base font-bold transition-colors"
                                                                                style={{ background: P.sageBg, color: P.sageDark }}
                                                                            >
                                                                                –
                                                                            </button>
                                                                            <span className="mx-3 min-w-[1rem] text-center text-xs font-black" style={{ color: P.earth }}>
                                                                                {item.quantity}
                                                                            </span>
                                                                            <button
                                                                                onClick={() =>
                                                                                    router.patch(route('cart.update', id), {
                                                                                        quantity: item.quantity + 1,
                                                                                    })
                                                                                }
                                                                                className="flex h-8 w-8 items-center justify-center text-base font-bold transition-colors"
                                                                                style={{ background: P.sageBg, color: P.sageDark }}
                                                                            >
                                                                                +
                                                                            </button>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="flex items-center gap-3">
                                                                            <button
                                                                                onClick={() =>
                                                                                    router.patch(route('cart.update', id), {
                                                                                        quantity: Math.max(1, item.quantity - 1),
                                                                                    })
                                                                                }
                                                                                className="flex h-8 w-8 items-center justify-center rounded-sm border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50"
                                                                            >
                                                                                <Minus className="h-3 w-3" />
                                                                            </button>
                                                                            <span className="w-4 text-center text-[14px] font-bold text-slate-900">
                                                                                {item.quantity}
                                                                            </span>
                                                                            <button
                                                                                onClick={() =>
                                                                                    router.patch(route('cart.update', id), {
                                                                                        quantity: item.quantity + 1,
                                                                                    })
                                                                                }
                                                                                className="flex h-8 w-8 items-center justify-center rounded-sm border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50"
                                                                            >
                                                                                <Plus className="h-3 w-3" />
                                                                            </button>
                                                                        </div>
                                                                    )}
                                                                    <button
                                                                        onClick={() => router.delete(route('cart.remove', id))}
                                                                        className="text-rose-500 transition-colors hover:text-rose-600"
                                                                    >
                                                                        <Trash2 className="h-5 w-5" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {cartCount > 0 && (
                                        <div className="space-y-4 border-t border-slate-100 bg-white p-6">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[15px] font-bold tracking-wide text-slate-900 uppercase">মোট:</span>
                                                <span className="text-[22px] font-bold text-orange-600">
                                                    ৳
                                                    {Object.values(cart)
                                                        .reduce((sum, item) => {
                                                            const price = parseInt(item.price.replace(/[^\d]/g, ''));
                                                            return sum + price * item.quantity;
                                                        }, 0)
                                                        .toLocaleString()}
                                                </span>
                                            </div>
                                            <div className="space-y-3">
                                                <Link href={route('checkout.index')} className="w-full">
                                                    <Button className="h-12 w-full rounded-md bg-slate-950 text-sm font-bold tracking-tight text-white uppercase shadow-sm transition-colors hover:bg-slate-800">
                                                        চেকআউট
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    )}
                                </SheetContent>
                            </Sheet>

                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-11 w-11 rounded-full border border-slate-200">
                                        <Menu className="h-5 w-5" />
                                        <span className="sr-only">Open menu</span>
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="w-[min(22rem,100vw)] overflow-y-auto bg-white">
                                    <SheetHeader className="mb-6 text-left">
                                        <SheetTitle className="text-xl font-black tracking-tight text-slate-950">মেনু</SheetTitle>
                                    </SheetHeader>

                                    <div ref={mobileSearchRef} className="relative mb-6">
                                        <form
                                            onSubmit={handleSearchSubmit}
                                            className="flex items-stretch overflow-hidden rounded-md border border-slate-300 bg-white shadow-sm"
                                        >
                                            <Input
                                                type="search"
                                                name="q"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                onFocus={() => setShowDropdown(true)}
                                                aria-label="Search products"
                                                placeholder="পণ্য খুঁজুন..."
                                                className="h-11 border-0 bg-transparent px-4 text-sm shadow-none focus-visible:ring-0"
                                            />
                                            <button
                                                type="submit"
                                                className="inline-flex items-center justify-center bg-slate-950 px-4 text-white transition-colors hover:bg-slate-800"
                                                aria-label="Search"
                                            >
                                                <Search className="h-5 w-5" />
                                            </button>
                                        </form>
                                        <SearchDropdown />
                                    </div>

                                    <div className="mb-4">
                                        <Link
                                            href={route('products.index')}
                                            className="flex w-full items-center justify-between rounded-md bg-slate-950 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-slate-800"
                                        >
                                            সকল পণ্য দেখুন
                                            <ChevronDown className="h-4 w-4 -rotate-90" />
                                        </Link>
                                    </div>

                                    <div className="space-y-3">
                                        {activeMenus.map((section) => {
                                            const hasChildren = section.children && section.children.length > 0;

                                            if (!hasChildren) {
                                                return (
                                                    <Link
                                                        key={section.id}
                                                        href={getMenuItemHref(section)}
                                                        className="flex w-full items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-slate-50"
                                                    >
                                                        {section.title}
                                                    </Link>
                                                );
                                            }

                                            return (
                                                <Collapsible
                                                    key={section.id}
                                                    open={openSection === section.title}
                                                    onOpenChange={(isOpen) => setOpenSection(isOpen ? section.title : null)}
                                                >
                                                    <CollapsibleTrigger className="group flex w-full items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-950">
                                                        <span>{section.title}</span>
                                                        <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                                                    </CollapsibleTrigger>
                                                    <CollapsibleContent className="overflow-hidden">
                                                        <div className="grid gap-1 rounded-b-xl border-x border-b border-slate-200 bg-slate-50 px-3 py-3">
                                                            {section.children?.map((item) => (
                                                                <Link
                                                                    key={item.id}
                                                                    href={getMenuItemHref(item)}
                                                                    className="rounded-lg px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-white hover:text-slate-950"
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
                        </div>
                    </div>

                    <div ref={desktopSearchRef} className="relative hidden w-full flex-1 lg:block lg:w-auto">
                        <form
                            onSubmit={handleSearchSubmit}
                            className="flex w-full items-stretch overflow-hidden rounded-md border border-slate-300 bg-white shadow-sm"
                        >
                            <input
                                type="search"
                                name="q"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setShowDropdown(true)}
                                aria-label="Search products"
                                placeholder="পণ্য খুঁজুন..."
                                className="min-w-0 flex-1 border-0 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-slate-500 focus:ring-0"
                            />
                            <button
                                type="submit"
                                className="inline-flex items-center justify-center bg-slate-950 px-5 text-white transition-colors hover:bg-slate-800"
                                aria-label="Search"
                            >
                                <Search className="h-5 w-5" />
                            </button>
                        </form>
                        <SearchDropdown />
                    </div>

                    <div className="hidden items-center gap-8 lg:flex">
                        <Link href={accountHref} className="flex items-center gap-3">
                            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 text-slate-500">
                                <UserRound className="h-6 w-6" />
                            </span>
                            <span className="text-sm leading-tight">
                                <span className="block text-slate-500">{auth.user ? 'হ্যালো' : 'সাইন ইন করুন'}</span>
                                <span className="font-semibold text-slate-900">{accountLabel}</span>
                            </span>
                        </Link>

                        <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
                            <SheetTrigger asChild>
                                <button type="button" className="relative inline-flex items-center justify-center text-slate-800" aria-label="Cart">
                                    <ShoppingCart className="h-7 w-7" />
                                    {cartCount > 0 && (
                                        <span className="absolute -top-2 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-600 px-1 text-[11px] font-bold text-white">
                                            {cartCount}
                                        </span>
                                    )}
                                </button>
                            </SheetTrigger>
                            <SheetContent side="right" className="flex w-[min(28rem,100vw)] flex-col bg-white p-0 focus:ring-0">
                                <SheetHeader className="border-b border-slate-100 bg-slate-50/50 p-6 text-left">
                                    <div className="flex items-center justify-between">
                                        <SheetTitle className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-slate-900">
                                            <ShoppingCart className="h-6 w-6 text-orange-600" />
                                            শপিং কার্ট ({cartCount})
                                        </SheetTitle>
                                    </div>
                                </SheetHeader>

                                <div className="flex-1 overflow-y-auto px-6 py-4">
                                    {cartCount === 0 ? (
                                        <div className="flex h-full flex-col items-center justify-center text-center">
                                            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-50 text-slate-300">
                                                <ShoppingCart className="h-10 w-10" />
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-950">আপনার কার্টটি খালি</h3>
                                            <p className="mt-2 text-sm text-slate-500">মনে হচ্ছে আপনি এখনও আপনার কার্টে কিছু যোগ করেননি।</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {Object.entries(cart).map(([id, item]) => (
                                                <div key={id} className="rounded-md border border-slate-200 bg-white p-4">
                                                    <div className="flex gap-4">
                                                        <div className="h-20 w-20 flex-none overflow-hidden rounded-md border border-slate-100 bg-white p-0.5">
                                                            <img src={item.image} alt={item.name} className="h-full w-full rounded-sm object-cover" />
                                                        </div>
                                                        <div className="flex flex-1 flex-col justify-between">
                                                            <div className="space-y-0.5">
                                                                <h4 className="text-[14px] leading-snug font-bold text-slate-900">{item.name}</h4>
                                                                <div className="text-[15px] font-bold text-orange-600">
                                                                    ৳ {parseInt(item.price.replace(/[^\d]/g, '')).toLocaleString()}
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center justify-between">
                                                                {siteTheme === 'shutki' ? (
                                                                    <div
                                                                        className="inline-flex items-center overflow-hidden rounded-xl border"
                                                                        style={{ borderColor: P.border }}
                                                                    >
                                                                        <button
                                                                            onClick={() =>
                                                                                router.patch(route('cart.update', id), {
                                                                                    quantity: Math.max(1, item.quantity - 1),
                                                                                })
                                                                            }
                                                                            className="flex h-8 w-8 items-center justify-center text-base font-bold transition-colors"
                                                                            style={{ background: P.sageBg, color: P.sageDark }}
                                                                        >
                                                                            –
                                                                        </button>
                                                                        <span className="mx-3 min-w-[1rem] text-center text-xs font-black" style={{ color: P.earth }}>
                                                                            {item.quantity}
                                                                        </span>
                                                                        <button
                                                                            onClick={() =>
                                                                                router.patch(route('cart.update', id), {
                                                                                    quantity: item.quantity + 1,
                                                                                })
                                                                            }
                                                                            className="flex h-8 w-8 items-center justify-center text-base font-bold transition-colors"
                                                                            style={{ background: P.sageBg, color: P.sageDark }}
                                                                        >
                                                                            +
                                                                        </button>
                                                                    </div>
                                                                ) : (
                                                                    <div className="flex items-center gap-3">
                                                                        <button
                                                                            onClick={() =>
                                                                                router.patch(route('cart.update', id), {
                                                                                    quantity: Math.max(1, item.quantity - 1),
                                                                                })
                                                                            }
                                                                            className="flex h-8 w-8 items-center justify-center rounded-sm border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50"
                                                                        >
                                                                            <Minus className="h-3 w-3" />
                                                                        </button>
                                                                        <span className="w-4 text-center text-[14px] font-bold text-slate-900">
                                                                            {item.quantity}
                                                                        </span>
                                                                        <button
                                                                            onClick={() =>
                                                                                router.patch(route('cart.update', id), { quantity: item.quantity + 1 })
                                                                            }
                                                                            className="flex h-8 w-8 items-center justify-center rounded-sm border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50"
                                                                        >
                                                                            <Plus className="h-3 w-3" />
                                                                        </button>
                                                                    </div>
                                                                )}
                                                                <button
                                                                    onClick={() => router.delete(route('cart.remove', id))}
                                                                    className="text-rose-500 transition-colors hover:text-rose-600"
                                                                >
                                                                    <Trash2 className="h-5 w-5" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {cartCount > 0 && (
                                    <div className="space-y-4 border-t border-slate-100 bg-white p-6">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[15px] font-bold tracking-wide text-slate-900 uppercase">মোট:</span>
                                            <span className="text-[22px] font-bold text-orange-600">
                                                ৳
                                                {Object.values(cart)
                                                    .reduce((sum, item) => {
                                                        const price = parseInt(item.price.replace(/[^\d]/g, ''));
                                                        return sum + price * item.quantity;
                                                    }, 0)
                                                    .toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="space-y-3">
                                            <Link href={route('checkout.index')} className="w-full">
                                                <Button className="h-12 w-full rounded-md bg-slate-950 text-sm font-bold tracking-tight text-white uppercase shadow-sm transition-colors hover:bg-slate-800">
                                                    চেকআউট
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>

                {!route().current('products.show') && (
                    <nav
                        aria-label="Main categories"
                        className="hidden flex-wrap items-center gap-x-6 gap-y-3 border-t border-slate-100 py-3 text-sm font-medium text-slate-900 lg:flex"
                    >
                        {activeMenus.map((section) => (
                            <div key={section.id} className="group relative">
                                <Link
                                    href={getMenuItemHref(section)}
                                    className="inline-flex items-center gap-1 transition-colors hover:text-slate-600"
                                >
                                    <span>{section.title}</span>
                                    {section.children && section.children.length > 0 && (
                                        <ChevronDown className="h-4 w-4 text-slate-400 transition-colors group-hover:text-slate-600" />
                                    )}
                                </Link>

                                {section.children && section.children.length > 0 && (
                                    <div className="pointer-events-none invisible absolute top-full left-0 z-20 pt-3 opacity-0 transition duration-150 group-focus-within:pointer-events-auto group-focus-within:visible group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100">
                                        <div className="w-56 rounded-2xl border border-slate-200 bg-white p-2.5 shadow-[0_18px_40px_rgba(15,23,42,0.12)]">
                                            <div className="flex flex-col gap-0.5">
                                                {section.children.map((item) => (
                                                    <Link
                                                        key={item.id}
                                                        href={getMenuItemHref(item)}
                                                        className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-950"
                                                    >
                                                        {item.title}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </nav>
                )}
            </div>
        </header>
    );
}
