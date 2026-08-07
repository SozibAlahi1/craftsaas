import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { AlertCircle, ChevronRight, Lock, MapPin, Phone, ShieldCheck, Truck } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ShutkiOceanFooter } from '@/themes/shutki-ocean/components/Footer';
import { ShutkiOceanHeader } from '@/themes/shutki-ocean/components/Header';

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

    const { data, setData, post, processing, errors } = useForm({
        full_name: '',
        phone: '',
        address: '',
        payment_method: 'cod',
        shipping_area: 'inside',
    });

    const cartItems = Object.entries(cart);
    const subtotal = cartItems.reduce((sum, [_, item]) => {
        const price = parseInt(item.price.replace(/[^\d]/g, ''));
        return sum + price * item.quantity;
    }, 0);
    const shipping_cost_inside = settings?.shipping_cost_inside_dhaka ? parseInt(settings.shipping_cost_inside_dhaka) : 60;
    const shipping_cost_outside = settings?.shipping_cost_outside_dhaka ? parseInt(settings.shipping_cost_outside_dhaka) : 120;
    const shipping = data.shipping_area === 'inside' ? shipping_cost_inside : shipping_cost_outside;
    const total = subtotal + shipping;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('checkout.store'), {
            preserveScroll: true,
            onError: (errs) => {
                const first = Object.keys(errs)[0];
                document.getElementById(first)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            },
        });
    };

    return (
        <>
            <Head title="অর্ডার সম্পন্ন করুন - Shutki Ocean" />
            <main className="min-h-screen bg-[#F4F9FF] font-sans text-slate-800 selection:bg-[#F97316] selection:text-white">
                <ShutkiOceanHeader />

                {/* Page Banner */}
                <div className="border-b border-blue-100 bg-white shadow-sm">
                    <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8">
                        <div className="mb-2 flex items-center gap-2 text-xs font-bold text-slate-500">
                            <Link href={route('home')} className="hover:text-[#0F52BA]">
                                হোম
                            </Link>
                            <ChevronRight className="h-3.5 w-3.5" />
                            <span className="text-slate-900">অর্ডার ফরম</span>
                        </div>
                        <h1 className="text-2xl font-black text-slate-900 sm:text-3xl">অর্ডার নিশ্চিত করুন</h1>
                        <p className="mt-1 text-xs text-slate-500">আপনার সঠিক ডেলিভারি ঠিকানা ও ফোন নম্বর প্রবেশ করান</p>
                    </div>
                </div>

                <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
                    <form onSubmit={handleSubmit} noValidate className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-8">
                        {/* Form Inputs */}
                        <div className="space-y-6 lg:col-span-7">
                            {/* Delivery Info */}
                            <section className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm">
                                <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0F52BA] text-white">
                                        <MapPin className="h-5 w-5" />
                                    </div>
                                    <h2 className="text-lg font-black text-slate-900">ডেলিভারির ঠিকানা</h2>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="full_name" className="mb-1 block text-xs font-bold text-slate-700 uppercase">
                                            আপনার নাম <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            id="full_name"
                                            type="text"
                                            value={data.full_name}
                                            onChange={(e) => setData('full_name', e.target.value)}
                                            placeholder="আপনার নাম লিখুন"
                                            className="h-12 rounded-xl border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400"
                                        />
                                        {errors.full_name && (
                                            <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
                                                <AlertCircle className="h-3 w-3" /> {errors.full_name}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="phone" className="mb-1 block text-xs font-bold text-slate-700 uppercase">
                                            মোবাইল নম্বর <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#0F52BA]" />
                                            <Input
                                                id="phone"
                                                type="tel"
                                                value={data.phone}
                                                onChange={(e) => setData('phone', e.target.value)}
                                                placeholder="01XXXXXXXXX"
                                                className="h-12 rounded-xl border-slate-200 bg-slate-50 pl-10 text-slate-900 placeholder-slate-400"
                                            />
                                        </div>
                                        {errors.phone && (
                                            <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
                                                <AlertCircle className="h-3 w-3" /> {errors.phone}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="address" className="mb-1 block text-xs font-bold text-slate-700 uppercase">
                                            সম্পূর্ণ ঠিকানা <span className="text-red-500">*</span>
                                        </label>
                                        <Textarea
                                            id="address"
                                            rows={3}
                                            value={data.address}
                                            onChange={(e) => setData('address', e.target.value)}
                                            placeholder="গ্রাম/রোড, থানা, জেলা..."
                                            className="rounded-xl border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400"
                                        />
                                        {errors.address && (
                                            <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
                                                <AlertCircle className="h-3 w-3" /> {errors.address}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </section>

                            {/* Shipping Area */}
                            <section className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm">
                                <div className="mb-4 flex items-center gap-3 border-b border-slate-100 pb-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0F52BA] text-white">
                                        <Truck className="h-4 w-4" />
                                    </div>
                                    <h2 className="text-base font-black text-slate-900">শিপিং এরিয়া নির্বাচন করুন</h2>
                                </div>

                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    <label
                                        className={`flex cursor-pointer flex-col rounded-2xl border p-4 transition-all ${
                                            data.shipping_area === 'inside'
                                                ? 'border-[#0F52BA] bg-blue-50/50'
                                                : 'border-slate-200 bg-slate-50/50'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="shipping_area"
                                            value="inside"
                                            checked={data.shipping_area === 'inside'}
                                            onChange={() => setData('shipping_area', 'inside')}
                                            className="sr-only"
                                        />
                                        <span className="text-sm font-black text-slate-900">ঢাকার ভেতরে</span>
                                        <span className="mt-1 text-xs font-bold text-[#0F52BA]">ডেলিভারি চার্জ: ৳{shipping_cost_inside}</span>
                                    </label>

                                    <label
                                        className={`flex cursor-pointer flex-col rounded-2xl border p-4 transition-all ${
                                            data.shipping_area === 'outside'
                                                ? 'border-[#0F52BA] bg-blue-50/50'
                                                : 'border-slate-200 bg-slate-50/50'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="shipping_area"
                                            value="outside"
                                            checked={data.shipping_area === 'outside'}
                                            onChange={() => setData('shipping_area', 'outside')}
                                            className="sr-only"
                                        />
                                        <span className="text-sm font-black text-slate-900">ঢাকার বাইরে</span>
                                        <span className="mt-1 text-xs font-bold text-[#0F52BA]">ডেলিভারি চার্জ: ৳{shipping_cost_outside}</span>
                                    </label>
                                </div>
                            </section>

                            {/* Payment */}
                            <section className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm">
                                <div className="mb-4 flex items-center gap-3 border-b border-slate-100 pb-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0F52BA] text-white">
                                        <ShieldCheck className="h-4 w-4" />
                                    </div>
                                    <h2 className="text-base font-black text-slate-900">পেমেন্ট মেথড</h2>
                                </div>

                                <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-4">
                                    <div className="flex items-center gap-2 text-sm font-black text-[#0F52BA]">
                                        <ShieldCheck className="h-4 w-4" /> ক্যাশ অন ডেলিভারি (COD)
                                    </div>
                                    <p className="mt-1 text-xs text-slate-600">পণ্য হাতে পেয়ে চেক করে সম্পূর্ণ মূল্য পরিশোধ করুন।</p>
                                </div>
                            </section>
                        </div>

                        {/* Order Summary */}
                        <div className="mt-6 lg:col-span-5 lg:mt-0">
                            <div className="sticky top-24 rounded-3xl border border-blue-100 bg-white p-6 shadow-sm">
                                <h2 className="mb-4 border-b border-slate-100 pb-3 text-lg font-black text-slate-900">অর্ডার সারাংশ</h2>

                                <ul className="divide-y divide-slate-100">
                                    {cartItems.map(([id, item]) => (
                                        <li key={id} className="flex gap-3 py-3">
                                            <img src={item.image} alt={item.name} className="h-14 w-14 rounded-xl object-cover border border-slate-100" />
                                            <div className="flex-1 min-w-0">
                                                <h4 className="truncate text-xs font-bold text-slate-900">{item.name}</h4>
                                                <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
                                                    <span>× {item.quantity}</span>
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
                                        <span>পণ্যের দাম</span>
                                        <span className="text-slate-900">৳{subtotal.toLocaleString('en-BD')}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>ডেলিভারি চার্জ</span>
                                        <span className="text-slate-900">৳{shipping}</span>
                                    </div>
                                    <div className="flex justify-between border-t border-dashed border-slate-200 pt-3 text-base font-black text-slate-900">
                                        <span>সর্বমোট খরচ</span>
                                        <span className="text-[#F97316]">৳{total.toLocaleString('en-BD')}</span>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="mt-6 w-full rounded-2xl bg-gradient-to-r from-[#F97316] to-[#EA580C] py-3.5 text-sm font-black text-white shadow-md shadow-orange-500/20 transition-transform hover:scale-[1.01] disabled:opacity-50"
                                >
                                    {processing ? 'প্রসেসিং হচ্ছে...' : 'অর্ডার নিশ্চিত করুন'}
                                </button>

                                <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
                                    <Lock className="h-3 w-3 text-[#0F52BA]" /> নিরাপদ ও ১০০% সিকিউর্ড এনক্রিপ্টেড চেকআউট
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                <ShutkiOceanFooter />
            </main>
        </>
    );
}
