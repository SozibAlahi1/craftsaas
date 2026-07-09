import { StorefrontFooter } from '@/components/storefront-footer';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { AlertCircle, ChevronRight, Contact, CreditCard, Lock, ShieldCheck, ShoppingBag, Truck } from 'lucide-react';
import { Header as StorefrontHeader } from '../../themes/wildtannery/components/Header';

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
            onSuccess: () => {
                // Handle success
            },
            onError: (errors) => {
                // Scroll to the first error
                const firstErrorKey = Object.keys(errors)[0];
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
            <Head title="Checkout" />
            <main className="bg-background text-foreground min-h-screen">
                <StorefrontHeader />

                {/* Header Section */}
                <div className="bg-card border-border border-b">
                    <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
                        <div className="text-muted-foreground mb-4 flex items-center gap-2 text-sm font-medium">
                            <Link href={route('home')} className="hover:text-foreground transition-colors">
                                Home
                            </Link>
                            <ChevronRight className="h-4 w-4" />
                            <Link href={route('products.index')} className="hover:text-foreground transition-colors">
                                Shop
                            </Link>
                            <ChevronRight className="h-4 w-4" />
                            <span className="text-foreground font-bold">Checkout</span>
                        </div>
                        <h1 className="text-foreground text-3xl font-black tracking-tight sm:text-4xl">Complete Your Order</h1>
                        <p className="text-muted-foreground mt-2">Please provide your delivery details and choose a payment method.</p>
                    </div>
                </div>

                <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
                    <form onSubmit={handleSubmit} noValidate className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12">
                        {/* Left Column: Form Sections */}
                        <div className="space-y-6 lg:col-span-7">
                            {/* Contact & Shipping Information */}
                            <section className="border-border bg-card rounded-xl border p-5 shadow-sm sm:p-6">
                                <div className="border-border mb-5 flex items-center gap-3 border-b pb-4">
                                    <div className="bg-primary text-primary-foreground flex h-10 w-10 items-center justify-center rounded-full shadow-md">
                                        <Contact className="h-5 w-5" />
                                    </div>
                                    <h2 className="text-foreground text-xl font-bold tracking-tight">Delivery Information</h2>
                                </div>

                                <div className="space-y-4">
                                    {/* Personal Details */}
                                    <div className="space-y-4">
                                        <div className="w-full">
                                            <label htmlFor="full_name" className="text-muted-foreground mb-1 block text-sm font-bold">
                                                Full Name
                                            </label>
                                            <Input
                                                type="text"
                                                id="full_name"
                                                value={data.full_name}
                                                onChange={(e) => setData('full_name', e.target.value)}
                                                onBlur={handleSaveContact}
                                                placeholder="e.g. John Doe"
                                                className={`border-border bg-muted/50 focus:bg-card focus:border-primary h-12 transition-all ${errors.full_name ? 'border-rose-500 bg-rose-50/30 focus:border-rose-500' : ''}`}
                                            />
                                            {errors.full_name && (
                                                <p className="animate-in fade-in slide-in-from-top-1 mt-1.5 flex items-center gap-1 text-xs font-bold text-rose-600">
                                                    <AlertCircle className="h-3 w-3" />
                                                    {errors.full_name}
                                                </p>
                                            )}
                                        </div>

                                        <div className="w-full">
                                            <label htmlFor="phone" className="text-muted-foreground mb-1 block text-sm font-bold">
                                                Phone Number
                                            </label>
                                            <Input
                                                type="tel"
                                                id="phone"
                                                value={data.phone}
                                                onChange={(e) => setData('phone', e.target.value)}
                                                onBlur={handleSaveContact}
                                                placeholder="e.g. 01XXXXXXXXX"
                                                className={`border-border bg-muted/50 focus:bg-card focus:border-primary h-12 transition-all ${errors.phone ? 'border-rose-500 bg-rose-50/30 focus:border-rose-500' : ''}`}
                                            />
                                            {errors.phone && (
                                                <p className="animate-in fade-in slide-in-from-top-1 mt-1.5 flex items-center gap-1 text-xs font-bold text-rose-600">
                                                    <AlertCircle className="h-3 w-3" />
                                                    {errors.phone}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Address Details */}
                                    <div className="pt-1">
                                        <div>
                                            <label htmlFor="address" className="text-muted-foreground mb-1 block text-sm font-bold">
                                                Full Address
                                            </label>
                                            <Textarea
                                                id="address"
                                                rows={3}
                                                value={data.address}
                                                onChange={(e) => setData('address', e.target.value)}
                                                onBlur={handleSaveContact}
                                                placeholder="House no, Street name, Area..."
                                                className={`border-border bg-muted/50 focus:bg-card focus:border-primary transition-all ${errors.address ? 'border-rose-500 bg-rose-50/30 focus:border-rose-500' : ''}`}
                                            />
                                            {errors.address && (
                                                <p className="animate-in fade-in slide-in-from-top-1 mt-1.5 flex items-center gap-1 text-xs font-bold text-rose-600">
                                                    <AlertCircle className="h-3 w-3" />
                                                    {errors.address}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Payment Method */}
                            <section className="border-border bg-card rounded-xl border p-5 shadow-sm sm:p-6">
                                <div className="mb-5 flex items-center gap-3">
                                    <div className="bg-primary text-primary-foreground flex h-10 w-10 items-center justify-center rounded-full shadow-md">
                                        <CreditCard className="h-5 w-5" />
                                    </div>
                                    <h2 className="text-foreground text-xl font-bold tracking-tight">Payment Method</h2>
                                </div>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                    <label
                                        className={`relative flex cursor-pointer flex-col rounded-xl border p-4 shadow-sm transition-all focus:outline-none ${data.payment_method === 'cod' ? 'border-primary bg-muted ring-primary ring-2' : 'border-border hover:border-border/80 bg-card'}`}
                                    >
                                        <input
                                            type="radio"
                                            name="payment_method"
                                            value="cod"
                                            checked={data.payment_method === 'cod'}
                                            onChange={() => setData('payment_method', 'cod')}
                                            className="sr-only"
                                        />
                                        <span className="flex flex-1">
                                            <span className="flex flex-col">
                                                <span className="text-foreground block text-[15px] font-black">Cash on Delivery</span>
                                                <span className="text-muted-foreground mt-1 flex items-center text-xs leading-tight font-medium italic">
                                                    Pay when you receive the product
                                                </span>
                                            </span>
                                        </span>
                                        {data.payment_method === 'cod' && (
                                            <div className="bg-primary text-primary-foreground absolute top-3 right-3 rounded-full p-1">
                                                <ShieldCheck className="h-4 w-4" />
                                            </div>
                                        )}
                                    </label>

                                    <label
                                        className={`relative flex cursor-pointer flex-col rounded-xl border p-4 shadow-sm transition-all focus:outline-none ${data.payment_method === 'bkash' ? 'border-[#E2136E] bg-pink-50/30 ring-2 ring-[#E2136E]' : 'border-border hover:border-border/80 bg-card'}`}
                                    >
                                        <input
                                            type="radio"
                                            name="payment_method"
                                            value="bkash"
                                            checked={data.payment_method === 'bkash'}
                                            onChange={() => setData('payment_method', 'bkash')}
                                            className="sr-only"
                                        />
                                        <span className="flex flex-1">
                                            <span className="flex flex-col">
                                                <span className="block text-[15px] font-black text-[#E2136E]">bKash</span>
                                                <span className="text-muted-foreground mt-1 flex items-center text-xs leading-tight font-medium italic">
                                                    Pay securely with your bKash wallet
                                                </span>
                                            </span>
                                        </span>
                                        {data.payment_method === 'bkash' && (
                                            <div className="absolute top-3 right-3 rounded-full bg-[#E2136E] p-1 text-white">
                                                <ShieldCheck className="h-4 w-4" />
                                            </div>
                                        )}
                                    </label>

                                    <label
                                        className={`relative flex cursor-pointer flex-col rounded-xl border p-4 shadow-sm transition-all focus:outline-none ${data.payment_method === 'nagad' ? 'border-[#F15922] bg-orange-50/30 ring-2 ring-[#F15922]' : 'border-border hover:border-border/80 bg-card'}`}
                                    >
                                        <input
                                            type="radio"
                                            name="payment_method"
                                            value="nagad"
                                            checked={data.payment_method === 'nagad'}
                                            onChange={() => setData('payment_method', 'nagad')}
                                            className="sr-only"
                                        />
                                        <span className="flex flex-1">
                                            <span className="flex flex-col">
                                                <span className="block text-[15px] font-black text-[#F15922]">Nagad</span>
                                                <span className="text-muted-foreground mt-1 flex items-center text-xs leading-tight font-medium italic">
                                                    Fast and easy checkout with Nagad
                                                </span>
                                            </span>
                                        </span>
                                        {data.payment_method === 'nagad' && (
                                            <div className="absolute top-3 right-3 rounded-full bg-[#F15922] p-1 text-white">
                                                <ShieldCheck className="h-4 w-4" />
                                            </div>
                                        )}
                                    </label>
                                </div>
                                {errors.payment_method && (
                                    <p className="animate-in fade-in slide-in-from-top-1 mt-4 flex items-center gap-1 text-sm font-bold text-rose-600">
                                        <AlertCircle className="h-4 w-4" />
                                        {errors.payment_method}
                                    </p>
                                )}
                            </section>
                        </div>

                        {/* Right Column: Order Summary */}
                        <div className="mt-6 lg:col-span-5 lg:mt-0">
                            <div className="sticky top-28 space-y-6">
                                <section className="border-border bg-card rounded-xl border p-5 shadow-sm sm:p-6">
                                    <h2 className="text-foreground mb-4 flex items-center gap-2.5 text-xl font-bold tracking-tight">
                                        <ShoppingBag className="h-6 w-6 text-orange-600" />
                                        Order Summary
                                    </h2>

                                    <div className="flow-root">
                                        <ul className="divide-border/50 -my-6 divide-y">
                                            {cartItems.map(([id, item]) => (
                                                <li key={id} className="flex py-6">
                                                    <div className="border-border bg-muted h-20 w-20 flex-none overflow-hidden rounded-md border p-0.5">
                                                        <img src={item.image} alt={item.name} className="h-full w-full rounded-sm object-cover" />
                                                    </div>
                                                    <div className="ml-4 flex flex-1 flex-col justify-between">
                                                        <div>
                                                            <h4 className="text-foreground text-sm leading-tight font-bold">{item.name}</h4>
                                                            <p className="text-muted-foreground mt-1 text-xs font-bold tracking-tight uppercase">
                                                                {item.color} {item.size ? `/ ${item.size}` : ''}
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <p className="text-muted-foreground text-sm font-bold">Qty: {item.quantity}</p>
                                                            <p className="text-foreground text-sm font-black">
                                                                ৳{parseInt(item.price.replace(/[^\d]/g, '')).toLocaleString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="border-border mt-8 space-y-4 border-t pt-8">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground font-bold tracking-tight uppercase">Subtotal</span>
                                            <span className="text-foreground font-black">৳{subtotal.toLocaleString()}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-2">
                                                <Truck className="text-muted-foreground h-4 w-4" />
                                                <span className="text-muted-foreground font-bold tracking-tight uppercase">Shipping</span>
                                            </div>
                                            <span className="text-foreground font-black">৳{shipping}</span>
                                        </div>
                                        <div className="border-border flex items-center justify-between border-t-2 border-dashed pt-4">
                                            <span className="text-foreground text-lg font-black tracking-tight uppercase">Total Payable</span>
                                            <span className="text-2xl font-black text-orange-600">৳{total.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-primary text-primary-foreground hover:bg-primary/95 mt-8 w-full rounded-md px-6 py-4 text-sm font-black tracking-widest uppercase shadow-xl transition-all hover:scale-[1.02] focus:ring-0 focus:ring-offset-0 focus:outline-none active:scale-[0.98] disabled:opacity-50"
                                    >
                                        {processing ? 'Processing...' : 'Place Order Now'}
                                    </button>

                                    <div className="text-muted-foreground mt-6 flex items-center justify-center gap-2 text-[10px] font-black tracking-widest uppercase">
                                        <Lock className="h-3 w-3" />
                                        <span>SSL SECURE CHECKOUT</span>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </form>
                </div>

                <StorefrontFooter />
            </main>
        </>
    );
}
