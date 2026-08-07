import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Calendar, CheckCircle2, CreditCard, Home, MapPin, Phone, Printer, Truck } from 'lucide-react';

import { ShutkiOceanFooter } from '@/themes/shutki-ocean/components/Footer';
import { ShutkiOceanHeader } from '@/themes/shutki-ocean/components/Header';

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
    const items = Object.values(order.items || {});

    return (
        <>
            <Head title={`অর্ডার কনফার্ম #${order.order_id} - Shutki Ocean`} />
            <main className="min-h-screen bg-[#F4F9FF] font-sans text-slate-800 selection:bg-[#F97316] selection:text-white">
                <ShutkiOceanHeader />

                <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
                    {/* Success Banner */}
                    <div className="mb-8 rounded-3xl border border-blue-100 bg-white p-8 text-center shadow-sm">
                        <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white shadow-lg shadow-orange-500/20">
                            <CheckCircle2 className="h-10 w-10" />
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 sm:text-4xl">🎉 অভিনন্দন! অর্ডার নিশ্চিত হয়েছে!</h1>
                        <p className="mt-2 text-sm text-slate-600">
                            ধন্যবাদ, <span className="font-bold text-slate-900">{order.customer.full_name}</span>! আপনার অর্ডার{' '}
                            <span className="font-mono font-black text-[#0F52BA]">#{order.order_id}</span> সফলভাবে গৃহীত হয়েছে।
                        </p>
                        <div className="mt-4 inline-flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50/50 px-4 py-2 text-xs font-bold text-[#0F52BA]">
                            <Truck className="h-4 w-4 text-[#F97316]" /> আপনার প্রিমিয়াম শুকটি মাছ দ্রুততম সময়ে ডেলিভারি করা হবে!
                        </div>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-3 lg:items-start">
                        {/* Order Details */}
                        <div className="space-y-6 lg:col-span-2">
                            <section className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm">
                                <h2 className="mb-4 border-b border-slate-100 pb-3 text-base font-black text-slate-900">
                                    অর্ডার আইটেম ({items.length}টি)
                                </h2>
                                <ul className="divide-y divide-slate-100">
                                    {items.map((item, idx) => (
                                        <li key={idx} className="flex gap-4 py-3">
                                            <img src={item.image} alt={item.name} className="h-14 w-14 rounded-xl object-cover border border-slate-100" />
                                            <div className="flex-1 min-w-0">
                                                <h4 className="truncate text-sm font-bold text-slate-900">{item.name}</h4>
                                                <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
                                                    <span>পরিমাণ: {item.quantity}</span>
                                                    <span className="font-black text-[#F97316]">
                                                        ৳{(parseInt(item.price.replace(/[^\d]/g, '')) * item.quantity).toLocaleString('en-BD')}
                                                    </span>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-xs font-bold text-slate-600">
                                    <div className="flex justify-between">
                                        <span>সাবটোটাল</span>
                                        <span className="text-slate-900">৳{order.subtotal.toLocaleString('en-BD')}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>শিপিং চার্জ</span>
                                        <span className="text-slate-900">৳{order.shipping.toLocaleString('en-BD')}</span>
                                    </div>
                                    <div className="flex justify-between border-t border-dashed border-slate-200 pt-3 text-base font-black text-slate-900">
                                        <span>সর্বমোট</span>
                                        <span className="text-[#F97316]">৳{order.total.toLocaleString('en-BD')}</span>
                                    </div>
                                </div>
                            </section>

                            <div className="flex flex-col gap-3 sm:flex-row">
                                <Link
                                    href={route('home')}
                                    className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#F97316] to-[#EA580C] py-3.5 text-xs font-black text-white shadow-md"
                                >
                                    <Home className="h-4 w-4" /> হোমে যান
                                </Link>
                                <button
                                    onClick={() => window.print()}
                                    className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white py-3.5 text-xs font-black text-slate-700 shadow-sm"
                                >
                                    <Printer className="h-4 w-4" /> মেমো প্রিন্ট করুন
                                </button>
                                <Link
                                    href={route('products.index')}
                                    className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-blue-200 bg-blue-50/50 py-3.5 text-xs font-black text-[#0F52BA]"
                                >
                                    আরো অর্ডার করুন <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>

                        {/* Customer Info Box */}
                        <div className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm text-xs space-y-4">
                            <h2 className="border-b border-slate-100 pb-3 text-base font-black text-slate-900">ডেলিভারি তথ্য</h2>
                            <div>
                                <span className="flex items-center gap-1 font-bold text-slate-500">
                                    <Calendar className="h-3.5 w-3.5 text-[#0F52BA]" /> তারিখ
                                </span>
                                <p className="mt-1 font-bold text-slate-900">{order.date}</p>
                            </div>
                            <div>
                                <span className="flex items-center gap-1 font-bold text-slate-500">
                                    <CreditCard className="h-3.5 w-3.5 text-[#0F52BA]" /> পেমেন্ট
                                </span>
                                <p className="mt-1 font-bold text-emerald-600">
                                    {paymentLabels[order.payment_method] || order.payment_method} (ক্যাশ অন ডেলিভারি)
                                </p>
                            </div>
                            <div>
                                <span className="flex items-center gap-1 font-bold text-slate-500">
                                    <MapPin className="h-3.5 w-3.5 text-[#0F52BA]" /> কাস্টমার ও ঠিকানা
                                </span>
                                <p className="mt-1 font-bold text-slate-900">{order.customer.full_name}</p>
                                <p className="text-slate-600">{order.customer.address}</p>
                            </div>
                            <div>
                                <span className="flex items-center gap-1 font-bold text-slate-500">
                                    <Phone className="h-3.5 w-3.5 text-[#0F52BA]" /> মোবাইল
                                </span>
                                <p className="mt-1 font-bold text-slate-900">{order.customer.phone}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <ShutkiOceanFooter />
            </main>
        </>
    );
}
