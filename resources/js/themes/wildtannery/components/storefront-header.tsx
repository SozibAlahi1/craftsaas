import { Link, router, usePage } from '@inertiajs/react';
import { ChevronDown, Mail, Menu, Minus, Phone, Plus, Search, ShoppingBag, Trash2, UserRound } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { type SharedData } from '@/types';

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
        title: 'Bags',
        items: ['Messenger Bags', 'Crossbody Bags', 'Laptop Bags', 'Travel Bags', 'Tote Bags', 'Hand Bags'],
    },
    {
        title: 'Shoes',
        items: ['Casual Shoes', 'Formal Shoes', 'Loafers', "Men's Sandal", 'Ladies Sports Shoes'],
    },
    {
        title: 'Wallets',
        items: ['Zip Wallet', 'Long Wallet', 'Short Wallet', 'Card Holder', 'Passport Holder'],
    },
    {
        title: 'Belts',
        items: ['Buckle', 'Leather Belt'],
    },
    {
        title: 'Accessories',
        items: ['Leather Pouch', 'Leather Mouse Pad', 'Insole'],
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
            const isWallet = item.includes('Wallet') || item.includes('Holder');
            const isBelt = item.includes('Belt') || item.includes('Buckle');
            const isShoes = item.includes('Shoes') || item.includes('Sandal') || item.includes('Loafer');
            const catName = isWallet ? 'Wallets' : isBelt ? 'Belts' : isShoes ? 'Shoes' : 'Bags';
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
    const siteName = (settings as any)?.site_name || 'Wild Tannery';
    const siteTheme = (settings as any)?.site_theme || 'wildtannery';
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
            <div className="absolute top-full left-0 z-50 mt-1 w-full overflow-hidden rounded-md border border-slate-800 bg-[#0B0E14] shadow-xl">
                {isSearching ? (
                    <div className="px-4 py-3 text-sm text-slate-400">Searching...</div>
                ) : searchResults.length > 0 ? (
                    <ul className="max-h-[60vh] overflow-auto py-2">
                        {searchResults.map((product) => (
                            <li key={product.id}>
                                <Link
                                    href={route('products.show', product.slug)}
                                    className="flex items-center gap-3 px-4 py-2 hover:bg-[#131826]"
                                    onClick={() => setShowDropdown(false)}
                                >
                                    <img src={product.image} alt={product.name} className="h-12 w-12 rounded object-cover" />
                                    <div>
                                        <p className="text-sm font-semibold text-white">{product.name}</p>
                                        <p className="text-xs font-medium text-blue-500">
                                            ৳ {parseInt(String(product.price).replace(/[^\d]/g, '')).toLocaleString()}
                                        </p>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="px-4 py-3 text-sm text-slate-400">No products found</div>
                )}
            </div>
        ) : null;

    useEffect(() => {
        const html = document.documentElement;
        html.dataset.theme = siteTheme;
    }, [siteTheme]);

    const accountLabel = auth.user ? 'Account' : 'Login';

    if (cartCount > prevCartCount) {
        setIsCartOpen(true);
        setPrevCartCount(cartCount);
    } else if (cartCount < prevCartCount) {
        setPrevCartCount(cartCount);
    }

    return (
        <header className="overflow-x-clip bg-[#0B0E14] font-sans text-white border-b border-slate-800/60 sticky top-0 z-40">
            {/* Main Header */}
            <div>
                <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between gap-6 py-4 lg:py-5">
                        {/* Logo & Mobile Menu Toggle */}
                        <div className="flex items-center gap-4">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" className="-ml-2 text-white lg:hidden">
                                        <Menu className="h-6 w-6" />
                                        <span className="sr-only">Open menu</span>
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="w-[min(22rem,100vw)] overflow-y-auto bg-[#0B0E14] p-0 border-r border-slate-800 text-white">
                                    <SheetHeader className="border-b border-slate-800 p-4 text-left">
                                        <SheetTitle className="text-lg font-black tracking-tight text-white uppercase">Menu</SheetTitle>
                                    </SheetHeader>

                                    <div ref={mobileSearchRef} className="relative border-b border-slate-800 p-4">
                                        <form
                                            onSubmit={handleSearchSubmit}
                                            className="flex items-stretch rounded-full border border-slate-700 bg-[#131826]"
                                        >
                                            <Input
                                                type="search"
                                                name="q"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                onFocus={() => setShowDropdown(true)}
                                                aria-label="Search products"
                                                placeholder="Search products..."
                                                className="h-11 w-full border-0 bg-transparent px-4 text-sm text-white shadow-none focus-visible:ring-0 placeholder:text-slate-400"
                                            />
                                            <button type="submit" className="px-4 text-slate-400 transition-colors hover:text-white">
                                                <Search className="h-5 w-5" />
                                            </button>
                                        </form>
                                        <SearchDropdown />
                                    </div>

                                    <div className="space-y-1 p-2">
                                        {activeMenus.map((section) => {
                                            const hasChildren = section.children && section.children.length > 0;
                                            if (!hasChildren) {
                                                return (
                                                    <Link
                                                        key={section.id}
                                                        href={getMenuItemHref(section)}
                                                        className="flex w-full items-center justify-between rounded-md px-3 py-3 text-sm font-semibold text-slate-300 hover:bg-[#131826] hover:text-white"
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
                                                    <CollapsibleTrigger className="group flex w-full items-center justify-between rounded-md px-3 py-3 text-left text-sm font-semibold text-slate-300 hover:bg-[#131826] hover:text-white">
                                                        <span>{section.title}</span>
                                                        <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                                                    </CollapsibleTrigger>
                                                    <CollapsibleContent className="px-3 pb-2">
                                                        <div className="mt-1 grid gap-1 border-l border-slate-700 pl-4">
                                                            {section.children?.map((item) => (
                                                                <Link
                                                                    key={item.id}
                                                                    href={getMenuItemHref(item)}
                                                                    className="py-2 text-sm text-slate-400 transition-colors hover:text-white"
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

                            <Link href={route('home')} className="flex items-center">
                                {logoUrl ? (
                                    <img src={logoUrl} alt={`${siteName} logo`} className="h-8 lg:h-10 w-auto object-contain brightness-0 invert" />
                                ) : (
                                    <span className="text-2xl font-black tracking-tighter text-white uppercase lg:text-3xl">
                                        SAIF<span className="text-blue-600">EX</span>
                                    </span>
                                )}
                            </Link>
                        </div>

                        {/* Desktop Search */}
                        <div ref={desktopSearchRef} className="relative hidden max-w-2xl flex-1 lg:block mx-12">
                            <form
                                onSubmit={handleSearchSubmit}
                                className="flex items-stretch overflow-hidden rounded-full border border-slate-700 bg-[#131826] transition-colors focus-within:border-blue-500"
                            >
                                <input
                                    type="search"
                                    name="q"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => setShowDropdown(true)}
                                    aria-label="Search products"
                                    placeholder="Search for products..."
                                    className="min-w-0 flex-1 border-0 bg-transparent px-6 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 focus:ring-0"
                                />
                                <button
                                    type="submit"
                                    className="inline-flex items-center justify-center px-5 text-slate-400 transition-colors hover:text-white"
                                    aria-label="Search"
                                >
                                    <Search className="h-4 w-4" />
                                </button>
                            </form>
                            <SearchDropdown />
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center gap-6">
                            <Link href={accountHref} className="group hidden items-center gap-2 lg:flex">
                                <UserRound className="h-5 w-5 text-slate-300 transition-colors group-hover:text-blue-500" />
                                <span className="text-[13px] font-semibold text-slate-300 transition-colors group-hover:text-white uppercase tracking-wider">
                                    {accountLabel}
                                </span>
                            </Link>

                            <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
                                <SheetTrigger asChild>
                                    <button type="button" className="group relative flex items-center gap-2" aria-label="Cart">
                                        <div className="relative flex items-center justify-center">
                                            <ShoppingBag className="h-5 w-5 text-slate-300 transition-colors group-hover:text-blue-500" />
                                            <span className="absolute -top-2 -right-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-[#0B0E14]">
                                                {cartCount}
                                            </span>
                                        </div>
                                        <span className="hidden text-[13px] font-semibold text-slate-300 uppercase tracking-wider lg:block transition-colors group-hover:text-white">
                                            ৳ {Object.values(cart).reduce((sum, item) => sum + parseInt(item.price.replace(/[^\d]/g, '')) * item.quantity, 0).toLocaleString()}
                                        </span>
                                    </button>
                                </SheetTrigger>
                                <SheetContent side="right" className="flex w-[min(28rem,100vw)] flex-col bg-[#0B0E14] border-l border-slate-800 text-white p-0 focus:ring-0">
                                    <SheetHeader className="border-b border-slate-800 bg-[#131826] p-6 text-left">
                                        <div className="flex items-center justify-between">
                                            <SheetTitle className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-white">
                                                <ShoppingBag className="h-6 w-6 text-blue-500" />
                                                Shopping Cart ({cartCount})
                                            </SheetTitle>
                                        </div>
                                    </SheetHeader>

                                    <div className="flex-1 overflow-y-auto px-6 py-4">
                                        {cartCount === 0 ? (
                                            <div className="flex h-full flex-col items-center justify-center text-center">
                                                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#131826] text-slate-600">
                                                    <ShoppingBag className="h-10 w-10" />
                                                </div>
                                                <h3 className="text-lg font-bold text-white">Your Cart is Empty</h3>
                                                <p className="mt-2 text-sm text-slate-400">Looks like you haven't added anything yet.</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                {Object.entries(cart).map(([id, item]) => (
                                                    <div key={id} className="rounded-xl border border-slate-800 bg-[#131826] p-3">
                                                        <div className="flex gap-4">
                                                            <div className="h-24 w-24 flex-none overflow-hidden rounded-lg bg-slate-800">
                                                                <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                                                            </div>
                                                            <div className="flex flex-1 flex-col justify-between py-1">
                                                                <div>
                                                                    <h4 className="line-clamp-2 text-[14px] leading-snug font-bold text-white">
                                                                        {item.name}
                                                                    </h4>
                                                                    <div className="mt-1 text-[15px] font-bold text-blue-500">
                                                                        ৳ {parseInt(item.price.replace(/[^\d]/g, '')).toLocaleString()}
                                                                    </div>
                                                                </div>
                                                                <div className="mt-2 flex items-center justify-between">
                                                                    <div className="flex items-center gap-1 rounded-md border border-slate-700 bg-[#0B0E14] p-0.5">
                                                                        <button
                                                                            onClick={() =>
                                                                                router.patch(route('cart.update', id), {
                                                                                    quantity: Math.max(1, item.quantity - 1),
                                                                                })
                                                                            }
                                                                            className="flex h-7 w-7 items-center justify-center rounded-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                                                                        >
                                                                            <Minus className="h-3 w-3" />
                                                                        </button>
                                                                        <span className="w-6 text-center text-[13px] font-bold text-white">
                                                                            {item.quantity}
                                                                        </span>
                                                                        <button
                                                                            onClick={() =>
                                                                                router.patch(route('cart.update', id), {
                                                                                    quantity: item.quantity + 1,
                                                                                })
                                                                            }
                                                                            className="flex h-7 w-7 items-center justify-center rounded-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                                                                        >
                                                                            <Plus className="h-3 w-3" />
                                                                        </button>
                                                                    </div>
                                                                    <button
                                                                        onClick={() => router.delete(route('cart.remove', id))}
                                                                        className="text-slate-500 transition-colors hover:text-rose-500"
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
                                        <div className="space-y-4 border-t border-slate-800 bg-[#131826] p-6">
                                            <div className="flex items-center justify-between">
                                                <span className="text-base font-bold tracking-wide text-white">Subtotal:</span>
                                                <span className="text-2xl font-black text-blue-500">
                                                    ৳
                                                    {Object.values(cart)
                                                        .reduce((sum, item) => {
                                                            const price = parseInt(item.price.replace(/[^\d]/g, ''));
                                                            return sum + price * item.quantity;
                                                        }, 0)
                                                        .toLocaleString()}
                                                </span>
                                            </div>
                                            <Link href={route('checkout.index')} className="block w-full">
                                                <Button className="h-12 w-full rounded-full bg-blue-600 text-sm font-bold tracking-widest text-white uppercase shadow-lg shadow-blue-900/50 transition-all hover:bg-blue-500 hover:-translate-y-0.5">
                                                    Proceed to Checkout
                                                </Button>
                                            </Link>
                                        </div>
                                    )}
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Navigation (Desktop) */}
            {!route().current('products.show') && (
                <nav className="hidden border-b border-slate-800 bg-[#0B0E14] lg:block">
                    <div className="mx-auto flex max-w-[1440px] justify-center px-8">
                        <ul className="flex items-center gap-10 text-[12px] font-bold tracking-[0.1em] text-slate-300 uppercase">
                            {activeMenus.map((section) => (
                                <li key={section.id} className="group relative">
                                    <Link
                                        href={getMenuItemHref(section)}
                                        className="inline-flex h-[52px] items-center gap-1.5 transition-colors hover:text-white"
                                    >
                                        <span>{section.title}</span>
                                    </Link>

                                    {section.children && section.children.length > 0 && (
                                        <div className="pointer-events-none invisible absolute top-full left-1/2 z-20 -translate-x-1/2 translate-y-2 pt-2 opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                                            <div className="w-56 rounded-lg border border-slate-700 bg-[#131826] p-2 shadow-2xl">
                                                <ul className="flex flex-col">
                                                    {section.children.map((item) => (
                                                        <li key={item.id}>
                                                            <Link
                                                                href={getMenuItemHref(item)}
                                                                className="block rounded-md px-4 py-2 text-[13px] font-semibold text-slate-400 capitalize transition-colors hover:bg-slate-800 hover:text-white"
                                                            >
                                                                {item.title}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </nav>
            )}
        </header>
    );
}
