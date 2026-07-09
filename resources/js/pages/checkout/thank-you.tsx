import { StorefrontFooter } from '@/components/storefront-footer';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Calendar, CheckCircle2, CreditCard, Home, MapPin, Phone, Printer, ShoppingBag } from 'lucide-react';
import { Header as StorefrontHeader } from '../../themes/wildtannery/components/Header';

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
    customer: {
        full_name: string;
        phone: string;
        address: string;
    };
    items: Record<string, OrderItem>;
    subtotal: number;
    shipping: number;
    total: number;
    payment_method: string;
    date: string;
}

interface ThankYouProps {
    order: OrderDetails;
}

export default function ThankYou({ order }: ThankYouProps) {
    const items = Object.values(order.items);

    return (
        <>
            <Head title={`Order Confirmed #${order.order_id}`} />
            <main className="bg-background text-foreground min-h-screen">
                <StorefrontHeader />

                <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
                    {/* Success Header */}
                    <div className="animate-in fade-in slide-in-from-top-4 mb-12 text-center duration-700">
                        <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 shadow-sm">
                            <CheckCircle2 className="h-10 w-10" />
                        </div>
                        <h1 className="text-foreground mb-4 text-4xl font-black tracking-tight sm:text-5xl">Order Confirmed!</h1>
                        <p className="text-muted-foreground mx-auto max-w-xl text-lg">
                            Thank you for your purchase, <span className="text-foreground font-bold">{order.customer.full_name}</span>. Your order{' '}
                            <span className="bg-muted rounded px-2 py-0.5 font-mono text-sm font-bold text-[#cba876]">#{order.order_id}</span> has
                            been received and is being processed.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
                        {/* Order Summary */}
                        <div className="space-y-6 lg:col-span-2">
                            {/* Items List */}
                            <section className="border-border bg-card overflow-hidden rounded-2xl border shadow-sm">
                                <div className="border-border bg-muted/20 border-b px-6 py-4">
                                    <h2 className="text-foreground flex items-center gap-2 text-sm font-black tracking-wider uppercase">
                                        <ShoppingBag className="h-4 w-4" />
                                        Your Items ({items.length})
                                    </h2>
                                </div>
                                <ul className="divide-border divide-y px-6">
                                    {items.map((item, idx) => (
                                        <li key={idx} className="flex py-6">
                                            <div className="border-border bg-muted/10 h-20 w-20 flex-none overflow-hidden rounded-lg border p-1">
                                                <img src={item.image} alt={item.name} className="h-full w-full rounded object-cover" />
                                            </div>
                                            <div className="ml-6 flex flex-1 flex-col justify-center">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h4 className="text-foreground text-base leading-tight font-black">{item.name}</h4>
                                                        <p className="text-muted-foreground mt-1 text-xs font-bold tracking-tighter uppercase">
                                                            {item.color} {item.size ? `/ ${item.size}` : ''}
                                                        </p>
                                                    </div>
                                                    <p className="text-foreground text-sm font-black">
                                                        ৳{parseInt(item.price.replace(/[^\d]/g, '')).toLocaleString()}
                                                    </p>
                                                </div>
                                                <div className="text-muted-foreground mt-2 flex items-center gap-4 text-xs font-bold italic">
                                                    <span>Qty: {item.quantity}</span>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                <div className="bg-muted/10 space-y-3 p-6">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground font-bold tracking-tight uppercase">Subtotal</span>
                                        <span className="text-foreground font-black">৳{order.subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground font-bold tracking-tight uppercase">Shipping Fee</span>
                                        <span className="text-foreground font-black">৳{order.shipping.toLocaleString()}</span>
                                    </div>
                                    <div className="border-border mt-3 flex items-center justify-between border-t pt-3">
                                        <span className="text-foreground text-lg font-black tracking-tight uppercase">Total Paid</span>
                                        <span className="text-2xl font-black text-[#cba876]">৳{order.total.toLocaleString()}</span>
                                    </div>
                                </div>
                            </section>

                            {/* Action Buttons */}
                            <div className="flex flex-col gap-3 sm:flex-row">
                                <Link
                                    href={route('home')}
                                    className="inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#cba876] px-6 py-4 text-center text-sm font-black tracking-widest text-black uppercase shadow-xl transition-all hover:scale-[1.02] hover:bg-[#b89563] active:scale-[0.98]"
                                >
                                    <Home className="h-4 w-4" />
                                    Home
                                </Link>
                                <button
                                    onClick={() => window.print()}
                                    className="border-border bg-card text-foreground hover:bg-muted/10 inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border px-6 py-4 text-center text-sm font-black tracking-widest uppercase shadow-sm transition-all"
                                >
                                    <Printer className="h-4 w-4" />
                                    Print
                                </button>
                                <Link
                                    href={route('products.index')}
                                    className="inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#cba876] bg-transparent px-6 py-4 text-center text-sm font-black tracking-widest text-[#cba876] uppercase transition-all hover:bg-[#cba876] hover:text-black"
                                >
                                    Shop
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>

                        {/* Customer & Delivery Info */}
                        <div className="space-y-6">
                            <section className="border-border bg-card space-y-6 rounded-2xl border p-6 shadow-sm">
                                <div>
                                    <h3 className="mb-4 flex items-center gap-2 text-xs font-black tracking-widest text-[#cba876] uppercase">
                                        <Calendar className="h-3 w-3" />
                                        Order Details
                                    </h3>
                                    <div className="space-y-1">
                                        <p className="text-foreground text-sm font-bold">Order Date</p>
                                        <p className="text-muted-foreground text-sm font-medium">{order.date}</p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="mb-4 flex items-center gap-2 text-xs font-black tracking-widest text-[#cba876] uppercase">
                                        <CreditCard className="h-3 w-3" />
                                        Payment
                                    </h3>
                                    <div className="space-y-1">
                                        <p className="text-foreground text-sm font-bold uppercase">{order.payment_method}</p>
                                        <p className="text-muted-foreground text-sm font-medium">
                                            Status: <span className="font-bold text-emerald-500 italic">Processing</span>
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="mb-4 flex items-center gap-2 text-xs font-black tracking-widest text-[#cba876] uppercase">
                                        <MapPin className="h-3 w-3" />
                                        Shipping Address
                                    </h3>
                                    <div className="space-y-1">
                                        <p className="text-foreground text-sm font-bold">{order.customer.full_name}</p>
                                        <p className="text-muted-foreground text-sm leading-relaxed font-medium">{order.customer.address}</p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="mb-4 flex items-center gap-2 text-xs font-black tracking-widest text-[#cba876] uppercase">
                                        <Phone className="h-3 w-3" />
                                        Contact Info
                                    </h3>
                                    <p className="text-muted-foreground text-sm font-medium">{order.customer.phone}</p>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>

                <StorefrontFooter />
            </main>
        </>
    );
}
