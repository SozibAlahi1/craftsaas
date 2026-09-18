import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    ChevronDown,
    ChevronRight,
    Lock,
    ShieldCheck,
    ShoppingBag,
} from 'lucide-react';
import React, { useState } from 'react';

interface CartItem {
    slug: string;
    name: string;
    price: string;
    image: string;
    quantity: number;
    color?: string;
    size?: string;
}

interface CheckoutProps {
    cart: Record<string, CartItem>;
}

export default function Checkout({ cart }: CheckoutProps) {
    const { props } = usePage();
    const settings = props.settings as any;

    const [isSummaryOpen, setIsSummaryOpen] = useState(false);
    const [discountCode, setDiscountCode] = useState('');

    const { data, setData, post, processing, errors } = useForm({
        full_name: '',
        phone: '',
        address: '',
        payment_method: 'cod',
        shipping_area: 'inside',
    });

    const cartItems = Object.entries(cart);
    const subtotal = cartItems.reduce((sum, [_, item]) => {
        const price = parseInt(item.price.replace(/[^\d]/g, '')) || 0;
        return sum + price * item.quantity;
    }, 0);

    const shipping_cost_inside = settings?.shipping_cost_inside_dhaka
        ? parseInt(settings.shipping_cost_inside_dhaka)
        : 60;
    const shipping_cost_outside = settings?.shipping_cost_outside_dhaka
        ? parseInt(settings.shipping_cost_outside_dhaka)
        : 120;
    const shipping = data.shipping_area === 'inside' ? shipping_cost_inside : shipping_cost_outside;
    const total = subtotal + shipping;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('checkout.store'), {
            preserveScroll: true,
            onError: (errs) => {
                const firstErrorKey = Object.keys(errs)[0];
                const element = document.getElementById(firstErrorKey);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    element.focus();
                }
            },
        });
    };

    const handleSaveContact = () => {
        if (data.full_name || data.phone || data.address) {
            router.post(
                route('checkout.save-contact'),
                {
                    full_name: data.full_name,
                    phone: data.phone,
                    address: data.address,
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                },
            );
        }
    };

    return (
        <>
            <Head title={`Checkout – ${settings?.site_name || 'Store'}`} />

            <div className="min-h-screen bg-white font-sans text-slate-800 antialiased selection:bg-slate-900 selection:text-white">
                {/* Mobile Header with Logo & Collapsible Order Summary */}
                <header className="border-b border-slate-200 bg-white lg:hidden">
                    <div className="flex items-center justify-between px-4 py-3.5">
                        <Link href={route('home')} className="flex items-center gap-2">
                            {settings?.site_logo_url ? (
                                <img
                                    src={settings.site_logo_url}
                                    alt={settings?.site_name || 'Logo'}
                                    className="h-8 max-h-8 w-auto object-contain"
                                />
                            ) : (
                                <span className="text-lg font-bold tracking-tight text-slate-900">
                                    {settings?.site_name || 'Store'}
                                </span>
                            )}
                        </Link>
                    </div>

                    {/* Mobile Order Summary Bar */}
                    <div className="border-t border-slate-200 bg-[#fafafa]">
                        <button
                            type="button"
                            onClick={() => setIsSummaryOpen((prev) => !prev)}
                            className="flex w-full items-center justify-between px-4 py-3.5 text-left text-sm transition-colors hover:bg-slate-100/60"
                        >
                            <span className="flex items-center gap-2 font-medium text-sky-700">
                                <ShoppingBag className="h-4 w-4" />
                                <span>{isSummaryOpen ? 'Hide order summary' : 'Show order summary'}</span>
                                <ChevronDown
                                    className={`h-4 w-4 transition-transform duration-200 ${
                                        isSummaryOpen ? 'rotate-180' : ''
                                    }`}
                                />
                            </span>
                            <span className="text-base font-bold text-slate-900">৳{total.toLocaleString()}</span>
                        </button>

                        {/* Collapsible Mobile Cart Drawer */}
                        {isSummaryOpen && (
                            <div className="border-t border-slate-200 px-4 pt-4 pb-6">
                                <div className="space-y-3.5">
                                    {cartItems.map(([id, item]) => (
                                        <div key={id} className="flex items-center gap-3">
                                            <div className="relative flex h-16 w-16 flex-none items-center justify-center rounded-lg border border-slate-200 bg-white p-0.5">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="h-full w-full rounded-md object-cover"
                                                />
                                                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-slate-500 text-[11px] font-semibold text-white shadow ring-2 ring-white">
                                                    {item.quantity}
                                                </span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="line-clamp-2 text-sm font-medium text-slate-900">
                                                    {item.name}
                                                </h4>
                                                {(item.color || item.size) && (
                                                    <p className="mt-0.5 text-xs text-slate-500">
                                                        {item.color}
                                                        {item.color && item.size ? ' / ' : ''}
                                                        {item.size}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="text-sm font-medium text-slate-900">
                                                ৳{parseInt(item.price.replace(/[^\d]/g, '') || '0').toLocaleString()}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-5 space-y-2.5 border-t border-slate-200 pt-4 text-sm">
                                    <div className="flex justify-between text-slate-600">
                                        <span>Subtotal</span>
                                        <span className="font-medium text-slate-900">৳{subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-600">
                                        <span>Shipping</span>
                                        <span className="font-medium text-slate-900">৳{shipping}</span>
                                    </div>
                                    <div className="flex justify-between border-t border-slate-200 pt-2.5 text-base font-bold text-slate-900">
                                        <span>Total</span>
                                        <span>
                                            <span className="mr-1 text-xs font-normal text-slate-500">BDT</span>
                                            ৳{total.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </header>

                {/* Main 2-Column Shopify Layout */}
                <div className="mx-auto max-w-7xl">
                    <div className="lg:grid lg:grid-cols-12 lg:min-h-screen">
                        {/* LEFT COLUMN: Checkout Form (~58% width on desktop) */}
                        <div className="px-4 py-8 sm:px-6 lg:col-span-7 lg:px-12 lg:py-10">
                            <div className="mx-auto max-w-xl">
                                {/* Desktop Logo */}
                                <div className="mb-6 hidden lg:block">
                                    <Link href={route('home')} className="inline-block">
                                        {settings?.site_logo_url ? (
                                            <img
                                                src={settings.site_logo_url}
                                                alt={settings?.site_name || 'Logo'}
                                                className="h-9 max-h-9 w-auto object-contain"
                                            />
                                        ) : (
                                            <span className="text-2xl font-black tracking-tight text-slate-900">
                                                {settings?.site_name || 'Store'}
                                            </span>
                                        )}
                                    </Link>
                                </div>

                                {/* Shopify Breadcrumb Trail */}
                                <nav className="mb-8 hidden items-center gap-1.5 text-xs text-slate-500 lg:flex">
                                    <Link href={route('home')} className="hover:text-slate-900">
                                        Cart
                                    </Link>
                                    <ChevronRight className="h-3 w-3 text-slate-400" />
                                    <span className="font-semibold text-slate-900">Information</span>
                                    <ChevronRight className="h-3 w-3 text-slate-400" />
                                    <span>Shipping</span>
                                    <ChevronRight className="h-3 w-3 text-slate-400" />
                                    <span>Payment</span>
                                </nav>

                                <form onSubmit={handleSubmit} noValidate className="space-y-8">
                                    {/* Contact Section */}
                                    <section>
                                        <div className="mb-3 flex items-center justify-between">
                                            <h2 className="text-base font-semibold text-slate-900">Contact</h2>
                                        </div>
                                        <div className="space-y-1.5">
                                            <div className="relative">
                                                <input
                                                    type="tel"
                                                    id="phone"
                                                    value={data.phone}
                                                    onChange={(e) => setData('phone', e.target.value)}
                                                    onBlur={handleSaveContact}
                                                    placeholder="Phone number (e.g. 01XXXXXXXXX)"
                                                    className={`w-full rounded-md border bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none transition-all ${
                                                        errors.phone
                                                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                                            : 'border-slate-300'
                                                    }`}
                                                />
                                            </div>
                                            {errors.phone && (
                                                <p className="mt-1 flex items-center gap-1 text-xs text-red-600">
                                                    <AlertCircle className="h-3.5 w-3.5 flex-none" />
                                                    {errors.phone}
                                                </p>
                                            )}
                                        </div>
                                    </section>

                                    {/* Delivery Address Section */}
                                    <section className="space-y-4">
                                        <h2 className="text-base font-semibold text-slate-900">Delivery</h2>

                                        {/* Country/Region (Fixed to Bangladesh) */}
                                        <div>
                                            <label className="block text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1">
                                                Country / Region
                                            </label>
                                            <div className="flex h-10 w-full items-center justify-between rounded-md border border-slate-300 bg-slate-50 px-3 text-sm text-slate-700">
                                                <span>Bangladesh</span>
                                                <Lock className="h-3.5 w-3.5 text-slate-400" />
                                            </div>
                                        </div>

                                        {/* Full Name */}
                                        <div className="space-y-1.5">
                                            <input
                                                type="text"
                                                id="full_name"
                                                value={data.full_name}
                                                onChange={(e) => setData('full_name', e.target.value)}
                                                onBlur={handleSaveContact}
                                                placeholder="Full name"
                                                className={`w-full rounded-md border bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none transition-all ${
                                                    errors.full_name
                                                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                                        : 'border-slate-300'
                                                }`}
                                            />
                                            {errors.full_name && (
                                                <p className="mt-1 flex items-center gap-1 text-xs text-red-600">
                                                    <AlertCircle className="h-3.5 w-3.5 flex-none" />
                                                    {errors.full_name}
                                                </p>
                                            )}
                                        </div>

                                        {/* Address */}
                                        <div className="space-y-1.5">
                                            <textarea
                                                id="address"
                                                rows={3}
                                                value={data.address}
                                                onChange={(e) => setData('address', e.target.value)}
                                                onBlur={handleSaveContact}
                                                placeholder="Address (House number, road name, area, thana/district)"
                                                className={`w-full resize-none rounded-md border bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none transition-all ${
                                                    errors.address
                                                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                                        : 'border-slate-300'
                                                }`}
                                            />
                                            {errors.address && (
                                                <p className="mt-1 flex items-center gap-1 text-xs text-red-600">
                                                    <AlertCircle className="h-3.5 w-3.5 flex-none" />
                                                    {errors.address}
                                                </p>
                                            )}
                                        </div>
                                    </section>

                                    {/* Shipping Method Section (Shopify Box Style) */}
                                    <section className="space-y-3">
                                        <h2 className="text-base font-semibold text-slate-900">Shipping method</h2>

                                        <div className="overflow-hidden rounded-lg border border-slate-300 bg-white divide-y divide-slate-200">
                                            {/* Inside Dhaka */}
                                            <label
                                                className={`flex cursor-pointer items-center justify-between p-4 transition-colors ${
                                                    data.shipping_area === 'inside'
                                                        ? 'bg-sky-50/40'
                                                        : 'hover:bg-slate-50'
                                                }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <input
                                                        type="radio"
                                                        name="shipping_area"
                                                        value="inside"
                                                        checked={data.shipping_area === 'inside'}
                                                        onChange={() => setData('shipping_area', 'inside')}
                                                        className="h-4 w-4 text-slate-900 border-slate-300 focus:ring-slate-900"
                                                    />
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-900">
                                                            Inside Dhaka (ঢাকার ভেতরে)
                                                        </p>
                                                        <p className="text-xs text-slate-500">1–2 business days</p>
                                                    </div>
                                                </div>
                                                <span className="text-sm font-semibold text-slate-900">
                                                    ৳{shipping_cost_inside}
                                                </span>
                                            </label>

                                            {/* Outside Dhaka */}
                                            <label
                                                className={`flex cursor-pointer items-center justify-between p-4 transition-colors ${
                                                    data.shipping_area === 'outside'
                                                        ? 'bg-sky-50/40'
                                                        : 'hover:bg-slate-50'
                                                }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <input
                                                        type="radio"
                                                        name="shipping_area"
                                                        value="outside"
                                                        checked={data.shipping_area === 'outside'}
                                                        onChange={() => setData('shipping_area', 'outside')}
                                                        className="h-4 w-4 text-slate-900 border-slate-300 focus:ring-slate-900"
                                                    />
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-900">
                                                            Outside Dhaka (ঢাকার বাইরে)
                                                        </p>
                                                        <p className="text-xs text-slate-500">2–4 business days</p>
                                                    </div>
                                                </div>
                                                <span className="text-sm font-semibold text-slate-900">
                                                    ৳{shipping_cost_outside}
                                                </span>
                                            </label>
                                        </div>

                                        {errors.shipping_area && (
                                            <p className="flex items-center gap-1 text-xs text-red-600">
                                                <AlertCircle className="h-3.5 w-3.5 flex-none" />
                                                {errors.shipping_area}
                                            </p>
                                        )}
                                    </section>

                                    {/* Payment Section (Shopify Accordion Style) */}
                                    <section className="space-y-3">
                                        <div>
                                            <h2 className="text-base font-semibold text-slate-900">Payment</h2>
                                            <p className="text-xs text-slate-500">
                                                All transactions are secure and encrypted.
                                            </p>
                                        </div>

                                        <div className="overflow-hidden rounded-lg border border-slate-300 bg-white">
                                            {/* Option: Cash on Delivery */}
                                            <label
                                                className={`flex cursor-pointer items-center justify-between p-4 transition-colors ${
                                                    data.payment_method === 'cod' ? 'bg-sky-50/40' : 'hover:bg-slate-50'
                                                }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <input
                                                        type="radio"
                                                        name="payment_method"
                                                        value="cod"
                                                        checked={data.payment_method === 'cod'}
                                                        onChange={() => setData('payment_method', 'cod')}
                                                        className="h-4 w-4 text-slate-900 border-slate-300 focus:ring-slate-900"
                                                    />
                                                    <span className="text-sm font-medium text-slate-900">
                                                        Cash on Delivery (COD) / ক্যাশ অন ডেলিভারি
                                                    </span>
                                                </div>
                                                <ShieldCheck className="h-5 w-5 text-slate-400" />
                                            </label>

                                            {/* Sub-panel when COD is selected */}
                                            {data.payment_method === 'cod' && (
                                                <div className="border-t border-slate-200 bg-[#fafafa] p-4 text-xs text-slate-600 leading-relaxed">
                                                    পণ্য ডেলিভারি পাওয়ার পর দেখে মূল্য পরিশোধ করুন। Pay with cash when
                                                    your order is delivered to your doorstep.
                                                </div>
                                            )}
                                        </div>

                                        {errors.payment_method && (
                                            <p className="flex items-center gap-1 text-xs text-red-600">
                                                <AlertCircle className="h-3.5 w-3.5 flex-none" />
                                                {errors.payment_method}
                                            </p>
                                        )}
                                    </section>

                                    {/* Submit Action Row */}
                                    <div className="flex flex-col-reverse items-center justify-between gap-4 pt-4 sm:flex-row">
                                        <Link
                                            href={route('home')}
                                            className="text-xs font-medium text-sky-700 hover:text-sky-800 transition-colors"
                                        >
                                            ‹ Return to shop
                                        </Link>

                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full sm:w-auto sm:px-8 py-3.5 rounded-lg bg-[#1773B0] hover:bg-[#125a8a] text-white text-sm font-semibold shadow-sm transition-all hover:shadow focus:ring-2 focus:ring-[#1773B0] focus:ring-offset-2 focus:outline-none disabled:opacity-60 flex items-center justify-center gap-2"
                                        >
                                            {processing ? (
                                                <>
                                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                                    <span>Processing order...</span>
                                                </>
                                            ) : (
                                                <span>Complete order</span>
                                            )}
                                        </button>
                                    </div>
                                </form>

                                {/* Shopify Minimal Footer Policies */}
                                <div className="mt-12 border-t border-slate-200 pt-6 text-[11px] text-slate-500">
                                    <div className="flex flex-wrap gap-x-4 gap-y-2">
                                        <span className="hover:underline cursor-pointer">Refund policy</span>
                                        <span className="hover:underline cursor-pointer">Shipping policy</span>
                                        <span className="hover:underline cursor-pointer">Privacy policy</span>
                                        <span className="hover:underline cursor-pointer">Terms of service</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Order Summary Desktop (~42% width, Shopify light-gray background) */}
                        <div className="hidden border-l border-slate-200 bg-[#f9fafb] lg:col-span-5 lg:block lg:min-h-screen lg:px-10 lg:py-10">
                            <div className="sticky top-10 mx-auto max-w-md space-y-6">
                                {/* Cart Items List */}
                                <div className="space-y-4">
                                    {cartItems.map(([id, item]) => (
                                        <div key={id} className="flex items-center gap-4">
                                            {/* Shopify Item Image with Round Quantity Badge */}
                                            <div className="relative flex h-16 w-16 flex-none items-center justify-center rounded-lg border border-slate-200 bg-white p-0.5 shadow-xs">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="h-full w-full rounded-md object-cover"
                                                />
                                                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-slate-500 text-[11px] font-semibold text-white shadow ring-2 ring-white">
                                                    {item.quantity}
                                                </span>
                                            </div>

                                            {/* Details */}
                                            <div className="flex-1 min-w-0">
                                                <h4 className="line-clamp-2 text-sm font-medium text-slate-900">
                                                    {item.name}
                                                </h4>
                                                {(item.color || item.size) && (
                                                    <p className="mt-0.5 text-xs text-slate-500">
                                                        {item.color}
                                                        {item.color && item.size ? ' / ' : ''}
                                                        {item.size}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Price */}
                                            <div className="text-sm font-medium text-slate-900">
                                                ৳{parseInt(item.price.replace(/[^\d]/g, '') || '0').toLocaleString()}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Discount Code Input (Shopify Style) */}
                                <div className="flex gap-2 border-y border-slate-200 py-4">
                                    <input
                                        type="text"
                                        value={discountCode}
                                        onChange={(e) => setDiscountCode(e.target.value)}
                                        placeholder="Discount code"
                                        className="flex-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
                                    />
                                    <button
                                        type="button"
                                        disabled={!discountCode.trim()}
                                        className="rounded-md border border-slate-300 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Apply
                                    </button>
                                </div>

                                {/* Pricing Breakdown */}
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between text-slate-600">
                                        <span>Subtotal</span>
                                        <span className="font-medium text-slate-900">৳{subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-600">
                                        <span>Shipping</span>
                                        <span className="font-medium text-slate-900">৳{shipping}</span>
                                    </div>
                                    <div className="flex items-baseline justify-between border-t border-slate-200 pt-3">
                                        <span className="text-base font-medium text-slate-900">Total</span>
                                        <span className="text-2xl font-bold tracking-tight text-slate-900">
                                            <span className="mr-1.5 text-xs font-normal text-slate-500">BDT</span>
                                            ৳{total.toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                {/* Trust & Security */}
                                <div className="flex items-center justify-center gap-2 text-xs text-slate-400 pt-2">
                                    <Lock className="h-3.5 w-3.5" />
                                    <span>Guaranteed safe and secure checkout</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

