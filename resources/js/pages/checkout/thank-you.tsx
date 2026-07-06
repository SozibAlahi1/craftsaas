import { StorefrontFooter } from '@/components/storefront-footer';
import { Header as StorefrontHeader } from '../../themes/wildtannery/components/Header';
import { Head, Link } from '@inertiajs/react';
import { CheckCircle2, ShoppingBag, ArrowRight, Printer, Home, MapPin, Phone, CreditCard, Calendar } from 'lucide-react';

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
                    <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
                        <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 mb-6 shadow-sm">
                            <CheckCircle2 className="h-10 w-10" />
                        </div>
                        <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl mb-4">Order Confirmed!</h1>
                        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                            Thank you for your purchase, <span className="font-bold text-foreground">{order.customer.full_name}</span>. 
                            Your order <span className="font-mono font-bold bg-muted text-[#cba876] px-2 py-0.5 rounded text-sm">#{order.order_id}</span> has been received and is being processed.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 items-start">
                        {/* Order Summary */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Items List */}
                            <section className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
                                <div className="border-b border-border bg-muted/20 px-6 py-4">
                                    <h2 className="flex items-center gap-2 font-black text-foreground uppercase tracking-wider text-sm">
                                        <ShoppingBag className="h-4 w-4" />
                                        Your Items ({items.length})
                                    </h2>
                                </div>
                                <ul className="divide-y divide-border px-6">
                                    {items.map((item, idx) => (
                                        <li key={idx} className="flex py-6">
                                            <div className="h-20 w-20 flex-none overflow-hidden rounded-lg border border-border bg-muted/10 p-1">
                                                <img src={item.image} alt={item.name} className="h-full w-full object-cover rounded" />
                                            </div>
                                            <div className="ml-6 flex flex-1 flex-col justify-center">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h4 className="text-base font-black text-foreground leading-tight">{item.name}</h4>
                                                        <p className="mt-1 text-xs font-bold text-muted-foreground uppercase tracking-tighter">
                                                            {item.color} {item.size ? `/ ${item.size}` : ''}
                                                        </p>
                                                    </div>
                                                    <p className="text-sm font-black text-foreground">৳{parseInt(item.price.replace(/[^\d]/g, '')).toLocaleString()}</p>
                                                </div>
                                                <div className="mt-2 flex items-center gap-4 text-xs font-bold text-muted-foreground italic">
                                                    <span>Qty: {item.quantity}</span>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                <div className="bg-muted/10 p-6 space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground font-bold uppercase tracking-tight">Subtotal</span>
                                        <span className="text-foreground font-black">৳{order.subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground font-bold uppercase tracking-tight">Shipping Fee</span>
                                        <span className="text-foreground font-black">৳{order.shipping.toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center justify-between border-t border-border pt-3 mt-3">
                                        <span className="text-lg font-black text-foreground uppercase tracking-tight">Total Paid</span>
                                        <span className="text-2xl font-black text-[#cba876]">৳{order.total.toLocaleString()}</span>
                                    </div>
                                </div>
                            </section>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                <Link
                                    href={route('home')}
                                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#cba876] px-6 py-4 text-sm font-black text-black shadow-xl transition-all hover:bg-[#b89563] hover:scale-[1.02] active:scale-[0.98] uppercase tracking-widest text-center cursor-pointer"
                                >
                                    <Home className="h-4 w-4" />
                                    Home
                                </Link>
                                <button
                                    onClick={() => window.print()}
                                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 py-4 text-sm font-black text-foreground shadow-sm transition-all hover:bg-muted/10 uppercase tracking-widest text-center cursor-pointer"
                                >
                                    <Printer className="h-4 w-4" />
                                    Print
                                </button>
                                <Link
                                    href={route('products.index')}
                                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-[#cba876] bg-transparent px-6 py-4 text-sm font-black text-[#cba876] transition-all hover:bg-[#cba876] hover:text-black uppercase tracking-widest text-center cursor-pointer"
                                >
                                    Shop
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>

                        {/* Customer & Delivery Info */}
                        <div className="space-y-6">
                            <section className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6">
                                <div>
                                    <h3 className="flex items-center gap-2 text-xs font-black text-[#cba876] uppercase tracking-widest mb-4">
                                        <Calendar className="h-3 w-3" />
                                        Order Details
                                    </h3>
                                    <div className="space-y-1">
                                        <p className="text-sm font-bold text-foreground">Order Date</p>
                                        <p className="text-sm text-muted-foreground font-medium">{order.date}</p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="flex items-center gap-2 text-xs font-black text-[#cba876] uppercase tracking-widest mb-4">
                                        <CreditCard className="h-3 w-3" />
                                        Payment
                                    </h3>
                                    <div className="space-y-1">
                                        <p className="text-sm font-bold text-foreground uppercase">{order.payment_method}</p>
                                        <p className="text-sm text-muted-foreground font-medium">Status: <span className="text-emerald-500 font-bold italic">Processing</span></p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="flex items-center gap-2 text-xs font-black text-[#cba876] uppercase tracking-widest mb-4">
                                        <MapPin className="h-3 w-3" />
                                        Shipping Address
                                    </h3>
                                    <div className="space-y-1">
                                        <p className="text-sm font-bold text-foreground">{order.customer.full_name}</p>
                                        <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                                            {order.customer.address}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="flex items-center gap-2 text-xs font-black text-[#cba876] uppercase tracking-widest mb-4">
                                        <Phone className="h-3 w-3" />
                                        Contact Info
                                    </h3>
                                    <p className="text-sm text-muted-foreground font-medium">{order.customer.phone}</p>
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
