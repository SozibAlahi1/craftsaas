import { StorefrontHeader } from '@/components/storefront-header';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ShutkirFooter } from '@/themes/shutki/components/Footer';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { AlertCircle, ChevronRight, Leaf, Lock, MapPin, Phone, ShieldCheck, Truck } from 'lucide-react';

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
    });

    const cartItems = Object.entries(cart);
    const subtotal = cartItems.reduce((sum, [_, item]) => {
        const price = parseInt(item.price.replace(/[^\d]/g, ''));
        return sum + price * item.quantity;
    }, 0);
    const shipping = settings?.shipping_cost ? parseInt(settings.shipping_cost) : 60;
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

    const inputBase = `h-12 rounded-xl text-sm outline-none transition-all bg-white`;
    const inputStyle = (field: string) => ({
        border: `2px solid ${(errors as any)[field] ? 'hsl(0,65%,60%)' : P.border}`,
    });

    const paymentOptions = [
        { value: 'cod', label: 'ক্যাশ অন ডেলিভারি', sub: 'পণ্য পেয়ে পরিশোধ করুন', activeColor: P.sage, activeBg: P.sageBg },
        { value: 'bkash', label: 'bKash', sub: 'বিকাশে পেমেন্ট করুন', activeColor: '#E2136E', activeBg: '#fff0f6' },
        { value: 'nagad', label: 'Nagad', sub: 'নগদে পেমেন্ট করুন', activeColor: '#F15922', activeBg: '#fff6f2' },
    ];

    return (
        <>
            <Head title="অর্ডার করুন" />
            <main className="min-h-screen" style={{ background: P.cream, color: P.earth }}>
                <StorefrontHeader />

                {/* Page header */}
                <div className="bg-white" style={{ borderBottom: `2px solid ${P.border}` }}>
                    <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8">
                        <div className="mb-3 flex items-center gap-2 text-sm font-medium" style={{ color: P.earthLight }}>
                            <Link href={route('home')} className="transition-colors hover:opacity-75" style={{ color: P.sage }}>
                                হোম
                            </Link>
                            <ChevronRight className="h-4 w-4" />
                            <Link href={route('products.index')} className="transition-colors hover:opacity-75" style={{ color: P.sage }}>
                                পণ্য
                            </Link>
                            <ChevronRight className="h-4 w-4" />
                            <span className="font-black" style={{ color: P.sageDark }}>
                                অর্ডার
                            </span>
                        </div>
                        <h1 className="text-2xl font-black tracking-tight sm:text-3xl" style={{ color: P.sageDark }}>
                            🌿 অর্ডার সম্পন্ন করুন
                        </h1>
                        <p className="mt-1 text-sm" style={{ color: P.earthLight }}>
                            আপনার ডেলিভারি তথ্য ও পেমেন্ট পদ্ধতি নির্বাচন করুন।
                        </p>
                    </div>
                </div>

                <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
                    <form onSubmit={handleSubmit} noValidate className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-8">
                        {/* Left: Form */}
                        <div className="space-y-5 lg:col-span-7">
                            {/* Delivery info */}
                            <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-6" style={{ border: `2px solid ${P.border}` }}>
                                <div className="mb-5 flex items-center gap-3 pb-4" style={{ borderBottom: `2px solid ${P.sage}` }}>
                                    <div
                                        className="flex h-10 w-10 items-center justify-center rounded-full text-white shadow-sm"
                                        style={{ background: P.sage }}
                                    >
                                        <MapPin className="h-5 w-5" />
                                    </div>
                                    <h2 className="text-lg font-black" style={{ color: P.sageDark }}>
                                        ডেলিভারি তথ্য
                                    </h2>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label
                                            htmlFor="full_name"
                                            className="mb-1.5 block text-sm font-black tracking-wider uppercase"
                                            style={{ color: P.earthMid }}
                                        >
                                            পূর্ণ নাম <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            id="full_name"
                                            type="text"
                                            value={data.full_name}
                                            onChange={(e) => setData('full_name', e.target.value)}
                                            placeholder="আপনার নাম লিখুন"
                                            className={inputBase}
                                            style={inputStyle('full_name')}
                                        />
                                        {errors.full_name && (
                                            <p className="mt-1.5 flex items-center gap-1 text-xs font-bold text-red-600">
                                                <AlertCircle className="h-3 w-3" />
                                                {errors.full_name}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="phone"
                                            className="mb-1.5 block text-sm font-black tracking-wider uppercase"
                                            style={{ color: P.earthMid }}
                                        >
                                            মোবাইল নম্বর <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <Phone className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" style={{ color: P.sage }} />
                                            <Input
                                                id="phone"
                                                type="tel"
                                                value={data.phone}
                                                onChange={(e) => setData('phone', e.target.value)}
                                                placeholder="01XXXXXXXXX"
                                                className={`${inputBase} pl-10`}
                                                style={inputStyle('phone')}
                                            />
                                        </div>
                                        {errors.phone && (
                                            <p className="mt-1.5 flex items-center gap-1 text-xs font-bold text-red-600">
                                                <AlertCircle className="h-3 w-3" />
                                                {errors.phone}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="address"
                                            className="mb-1.5 block text-sm font-black tracking-wider uppercase"
                                            style={{ color: P.earthMid }}
                                        >
                                            সম্পূর্ণ ঠিকানা <span className="text-red-500">*</span>
                                        </label>
                                        <Textarea
                                            id="address"
                                            rows={3}
                                            value={data.address}
                                            onChange={(e) => setData('address', e.target.value)}
                                            placeholder="বাড়ি নম্বর, রাস্তা, এলাকা, জেলা..."
                                            className="resize-none rounded-xl bg-white text-sm outline-none"
                                            style={inputStyle('address')}
                                        />
                                        {errors.address && (
                                            <p className="mt-1.5 flex items-center gap-1 text-xs font-bold text-red-600">
                                                <AlertCircle className="h-3 w-3" />
                                                {errors.address}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </section>

                            {/* Payment */}
                            <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-6" style={{ border: `2px solid ${P.border}` }}>
                                <div className="mb-5 flex items-center gap-3 pb-4" style={{ borderBottom: `2px solid ${P.sage}` }}>
                                    <div
                                        className="flex h-10 w-10 items-center justify-center rounded-full text-white shadow-sm"
                                        style={{ background: P.honey }}
                                    >
                                        <ShieldCheck className="h-5 w-5" />
                                    </div>
                                    <h2 className="text-lg font-black" style={{ color: P.sageDark }}>
                                        পেমেন্ট পদ্ধতি
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                    {paymentOptions.map((pm) => (
                                        <label
                                            key={pm.value}
                                            className="relative flex cursor-pointer flex-col rounded-xl p-4 shadow-sm transition-all"
                                            style={{
                                                border: `2px solid ${data.payment_method === pm.value ? pm.activeColor : P.border}`,
                                                background: data.payment_method === pm.value ? pm.activeBg : P.white,
                                            }}
                                        >
                                            <input
                                                type="radio"
                                                name="payment_method"
                                                value={pm.value}
                                                checked={data.payment_method === pm.value}
                                                onChange={() => setData('payment_method', pm.value)}
                                                className="sr-only"
                                            />
                                            <span className="text-sm font-black" style={{ color: pm.activeColor }}>
                                                {pm.label}
                                            </span>
                                            <span className="mt-1 text-xs" style={{ color: P.earthLight }}>
                                                {pm.sub}
                                            </span>
                                            {data.payment_method === pm.value && (
                                                <div
                                                    className="absolute top-2.5 right-2.5 flex h-5 w-5 items-center justify-center rounded-full text-white"
                                                    style={{ background: pm.activeColor }}
                                                >
                                                    <ShieldCheck className="h-3 w-3" />
                                                </div>
                                            )}
                                        </label>
                                    ))}
                                </div>
                                {errors.payment_method && (
                                    <p className="mt-3 flex items-center gap-1 text-sm font-bold text-red-600">
                                        <AlertCircle className="h-4 w-4" />
                                        {errors.payment_method}
                                    </p>
                                )}
                            </section>
                        </div>

                        {/* Right: Order summary */}
                        <div className="mt-6 lg:col-span-5 lg:mt-0">
                            <div className="sticky top-24 space-y-4">
                                <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-6" style={{ border: `2px solid ${P.border}` }}>
                                    <h2
                                        className="mb-5 flex items-center gap-2.5 pb-3 text-lg font-black"
                                        style={{ color: P.sageDark, borderBottom: `2px solid ${P.sage}` }}
                                    >
                                        <Leaf className="h-5 w-5" style={{ color: P.sage }} /> অর্ডার সারাংশ
                                    </h2>

                                    <ul className="divide-y" style={{ borderColor: P.border }}>
                                        {cartItems.map(([id, item]) => (
                                            <li key={id} className="flex gap-3 py-4 first:pt-0">
                                                <div
                                                    className="h-16 w-16 flex-none overflow-hidden rounded-xl"
                                                    style={{ border: `1.5px solid ${P.border}` }}
                                                >
                                                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                                                </div>
                                                <div className="flex flex-1 flex-col justify-between">
                                                    <div>
                                                        <h4 className="text-sm leading-tight font-bold" style={{ color: P.earth }}>
                                                            {item.name}
                                                        </h4>
                                                        {(item.color || item.size) && (
                                                            <p className="mt-0.5 text-xs" style={{ color: P.earthLight }}>
                                                                {item.color}
                                                                {item.size ? ` / ${item.size}` : ''}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-bold" style={{ color: P.earthLight }}>
                                                            × {item.quantity}
                                                        </span>
                                                        <span className="text-sm font-black" style={{ color: P.terra }}>
                                                            ৳{(parseInt(item.price.replace(/[^\d]/g, '')) * item.quantity).toLocaleString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="mt-4 space-y-3 pt-4" style={{ borderTop: `2px solid ${P.border}` }}>
                                        <div className="flex justify-between text-sm">
                                            <span className="font-bold" style={{ color: P.earthLight }}>
                                                সাবটোটাল
                                            </span>
                                            <span className="font-black" style={{ color: P.earth }}>
                                                ৳{subtotal.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="flex items-center gap-1 font-bold" style={{ color: P.earthLight }}>
                                                <Truck className="h-4 w-4" /> শিপিং চার্জ
                                            </span>
                                            <span className="font-black" style={{ color: P.earth }}>
                                                ৳{shipping}
                                            </span>
                                        </div>
                                        <div className="flex justify-between border-t-2 border-dashed pt-3" style={{ borderColor: P.sage }}>
                                            <span className="text-base font-black tracking-tight uppercase" style={{ color: P.sageDark }}>
                                                মোট পরিশোধ
                                            </span>
                                            <span className="text-xl font-black" style={{ color: P.terra }}>
                                                ৳{total.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="mt-6 w-full rounded-xl py-4 text-sm font-black tracking-widest text-white uppercase shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50"
                                        style={{ background: P.sage }}
                                    >
                                        {processing ? 'প্রক্রিয়া হচ্ছে...' : '🌿 অর্ডার দিন'}
                                    </button>

                                    <div
                                        className="mt-4 flex items-center justify-center gap-2 text-[10px] font-bold tracking-widest uppercase"
                                        style={{ color: P.earthLight }}
                                    >
                                        <Lock className="h-3 w-3" /> নিরাপদ চেকআউট
                                    </div>
                                </section>

                                {/* Delivery note */}
                                <div className="rounded-xl p-4" style={{ background: P.sageBg, border: `2px solid ${P.border}` }}>
                                    <div className="flex items-start gap-3">
                                        <Truck className="mt-0.5 h-5 w-5 shrink-0" style={{ color: P.sage }} />
                                        <div>
                                            <p className="text-sm font-black" style={{ color: P.sageDark }}>
                                                ডেলিভারি নোট
                                            </p>
                                            <p className="mt-0.5 text-xs leading-5" style={{ color: P.earthMid }}>
                                                ঢাকার ভেতরে ১-৩ কার্যদিবস, ঢাকার বাইরে ৩-৫ কার্যদিবসের মধ্যে পৌঁছাবে।
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                <ShutkirFooter />
            </main>
        </>
    );
}
