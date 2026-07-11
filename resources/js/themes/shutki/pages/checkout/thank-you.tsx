import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Calendar, CheckCircle2, CreditCard, Home, MapPin, Phone, Printer, Truck } from 'lucide-react';

import { StorefrontHeader } from '@/components/storefront-header';
import { ShutkirFooter } from '@/themes/shutki/components/Footer';

/* LIGHT Organic Palette */
const P = {
    sage: 'hsl(89,32%,54%)',
    sageDark: 'hsl(89,35%,42%)',
    sageBg: 'hsl(89,22%,95%)',
    honey: 'hsl(38,72%,52%)',
    honeyLight: 'hsl(38,70%,92%)',
    terra: 'hsl(18,55%,52%)',
    cream: 'hsl(48,40%,97%)',
    white: '#ffffff',
    border: 'hsl(89,20%,86%)',
    earth: 'hsl(35,28%,18%)',
    earthMid: 'hsl(35,22%,36%)',
    earthLight: 'hsl(35,18%,52%)',
} as const;

interface OrderItem {
    slug: string;
    name: string;
    price: string;
    image: string;
    quantity: number;
    color?: string;
    size?: string;
}
interface OrderDetails {
    order_id: string;
    customer: { full_name: string; phone: string; address: string };
    items: Record<string, OrderItem>;
    subtotal: number;
    shipping: number;
    total: number;
    payment_method: string;
    date: string;
}

const paymentLabels: Record<string, string> = { cod: 'ক্যাশ অন ডেলিভারি', bkash: 'bKash', nagad: 'Nagad' };

export default function ThankYou({ order }: { order: OrderDetails }) {
    const items = Object.values(order.items);

    return (
        <>
            <Head title={`অর্ডার নিশ্চিত #${order.order_id}`} />
            <main className="min-h-screen" style={{ background: P.cream, color: P.earth }}>
                <StorefrontHeader />

                <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
                    {/* Success hero — sage-bg, NOT dark */}
                    <div
                        className="animate-in fade-in slide-in-from-top-4 mb-10 rounded-2xl bg-white p-8 text-center shadow-sm duration-700"
                        style={{ border: `3px solid ${P.sage}` }}
                    >
                        <div className="mb-5 inline-flex h-20 w-20 items-center justify-center rounded-full shadow-md" style={{ background: P.sage }}>
                            <CheckCircle2 className="h-10 w-10 text-white" />
                        </div>
                        <h1
                            className="mb-3 text-3xl font-black tracking-tight sm:text-4xl"
                            style={{ color: P.sageDark }}
                        >
                            🎉 অর্ডার নিশ্চিত হয়েছে!
                        </h1>
                        <p className="mx-auto max-w-xl text-base leading-7" style={{ color: P.earthMid }}>
                            ধন্যবাদ,{' '}
                            <span className="font-black" style={{ color: P.sageDark }}>
                                {order.customer.full_name}
                            </span>
                            !<br />
                            আপনার অর্ডার{' '}
                            <span className="rounded-lg px-2 py-0.5 font-mono text-sm font-black" style={{ background: P.sageBg, color: P.sageDark }}>
                                #{order.order_id}
                            </span>{' '}
                            সফলভাবে গ্রহণ করা হয়েছে।
                        </p>
                        <div
                            className="mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-2.5"
                            style={{ background: P.sageBg, border: `1px solid ${P.border}` }}
                        >
                            <Truck className="h-4 w-4" style={{ color: P.sage }} />
                            <span className="text-sm font-bold" style={{ color: P.sageDark }}>
                                আপনার শুকটি মাছ শীঘ্রই পাঠানো হবে!
                            </span>
                        </div>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-3 lg:items-start">
                        {/* Items list */}
                        <div className="space-y-5 lg:col-span-2">
                            <section className="overflow-hidden rounded-2xl bg-white shadow-sm" style={{ border: `2px solid ${P.border}` }}>
                                <div className="px-5 py-4" style={{ background: P.sageBg, borderBottom: `2px solid ${P.sage}` }}>
                                    <h2 className="flex items-center gap-2 text-sm font-black tracking-wider uppercase" style={{ color: P.sageDark }}>
                                        আপনার পণ্য ({items.length}টি)
                                    </h2>
                                </div>
                                <ul className="divide-y px-5" style={{ borderColor: P.border }}>
                                    {items.map((item, idx) => (
                                        <li key={idx} className="flex gap-4 py-4">
                                            <div
                                                className="h-16 w-16 flex-none overflow-hidden rounded-xl"
                                                style={{ border: `1.5px solid ${P.border}` }}
                                            >
                                                <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                                            </div>
                                            <div className="flex flex-1 flex-col justify-center gap-1">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div>
                                                        <h4 className="text-sm leading-tight font-black" style={{ color: P.earth }}>
                                                            {item.name}
                                                        </h4>
                                                        {(item.color || item.size) && (
                                                            <p className="mt-0.5 text-xs" style={{ color: P.earthLight }}>
                                                                {item.color}
                                                                {item.size ? ` / ${item.size}` : ''}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <p className="shrink-0 text-sm font-black" style={{ color: P.terra }}>
                                                        ৳{parseInt(item.price.replace(/[^\d]/g, '')).toLocaleString()}
                                                    </p>
                                                </div>
                                                <span className="text-xs font-bold" style={{ color: P.earthLight }}>
                                                    পরিমাণ: {item.quantity}
                                                </span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                <div className="space-y-2 px-5 py-4" style={{ background: P.sageBg, borderTop: `1px solid ${P.border}` }}>
                                    <div className="flex justify-between text-sm">
                                        <span className="font-bold" style={{ color: P.earthLight }}>
                                            সাবটোটাল
                                        </span>
                                        <span className="font-black" style={{ color: P.earth }}>
                                            ৳{order.subtotal.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="font-bold" style={{ color: P.earthLight }}>
                                            শিপিং চার্জ
                                        </span>
                                        <span className="font-black" style={{ color: P.earth }}>
                                            ৳{order.shipping.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between border-t-2 border-dashed pt-2" style={{ borderColor: P.sage }}>
                                        <span className="text-base font-black" style={{ color: P.sageDark }}>
                                            মোট পরিশোধ
                                        </span>
                                        <span className="text-xl font-black" style={{ color: P.terra }}>
                                            ৳{order.total.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </section>

                            {/* Actions */}
                            <div className="flex flex-col gap-3 sm:flex-row">
                                <Link
                                    href={route('home')}
                                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-black tracking-wider text-white uppercase shadow-md transition-all hover:-translate-y-0.5"
                                    style={{ background: P.sage }}
                                >
                                    <Home className="h-4 w-4" /> হোমে যান
                                </Link>
                                <button
                                    onClick={() => window.print()}
                                    className="hover:bg-sage-50 inline-flex flex-1 items-center justify-center gap-2 rounded-xl border-2 bg-white py-3.5 text-sm font-black tracking-wider uppercase transition-colors"
                                    style={{ borderColor: P.border, color: P.earth }}
                                >
                                    <Printer className="h-4 w-4" /> প্রিন্ট করুন
                                </button>
                                <Link
                                    href={route('products.index')}
                                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border-2 py-3.5 text-sm font-black tracking-wider uppercase transition-colors hover:bg-white"
                                    style={{ borderColor: P.sage, color: P.sageDark, background: P.sageBg }}
                                >
                                    আরো কিনুন <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div>
                            <section className="overflow-hidden rounded-2xl bg-white shadow-sm" style={{ border: `2px solid ${P.border}` }}>
                                <div className="px-5 py-4" style={{ background: P.sageBg, borderBottom: `2px solid ${P.sage}` }}>
                                    <h2 className="text-sm font-black tracking-wider uppercase" style={{ color: P.sageDark }}>
                                        অর্ডার তথ্য
                                    </h2>
                                </div>
                                <div className="divide-y" style={{ borderColor: P.border }}>
                                    <div className="space-y-1 px-5 py-4">
                                        <p
                                            className="flex items-center gap-1.5 text-xs font-black tracking-wider uppercase"
                                            style={{ color: P.earthLight }}
                                        >
                                            <Calendar className="h-3 w-3" style={{ color: P.sage }} /> তারিখ
                                        </p>
                                        <p className="text-sm font-bold" style={{ color: P.earth }}>
                                            {order.date}
                                        </p>
                                    </div>
                                    <div className="space-y-1 px-5 py-4">
                                        <p
                                            className="flex items-center gap-1.5 text-xs font-black tracking-wider uppercase"
                                            style={{ color: P.earthLight }}
                                        >
                                            <CreditCard className="h-3 w-3" style={{ color: P.sage }} /> পেমেন্ট
                                        </p>
                                        <p className="text-sm font-black" style={{ color: P.sageDark }}>
                                            {paymentLabels[order.payment_method] || order.payment_method}
                                        </p>
                                        <p className="text-xs font-bold text-emerald-600">প্রক্রিয়াধীন ✓</p>
                                    </div>
                                    <div className="space-y-1 px-5 py-4">
                                        <p
                                            className="flex items-center gap-1.5 text-xs font-black tracking-wider uppercase"
                                            style={{ color: P.earthLight }}
                                        >
                                            <MapPin className="h-3 w-3" style={{ color: P.sage }} /> ঠিকানা
                                        </p>
                                        <p className="text-sm font-bold" style={{ color: P.earth }}>
                                            {order.customer.full_name}
                                        </p>
                                        <p className="text-xs leading-5" style={{ color: P.earthMid }}>
                                            {order.customer.address}
                                        </p>
                                    </div>
                                    <div className="space-y-1 px-5 py-4">
                                        <p
                                            className="flex items-center gap-1.5 text-xs font-black tracking-wider uppercase"
                                            style={{ color: P.earthLight }}
                                        >
                                            <Phone className="h-3 w-3" style={{ color: P.sage }} /> মোবাইল
                                        </p>
                                        <p className="text-sm font-bold" style={{ color: P.earth }}>
                                            {order.customer.phone}
                                        </p>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>

                <ShutkirFooter />
            </main>
        </>
    );
}
