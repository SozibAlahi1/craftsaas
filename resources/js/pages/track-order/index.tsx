import { Head, useForm, Link } from '@inertiajs/react';
import { Search, Calendar, MapPin, Phone, ShoppingBag, CheckCircle2, Truck, Box, Clock, ShieldCheck, AlertCircle } from 'lucide-react';
import { Header } from '@/themes/wildtannery/components/Header';
import { StorefrontFooter as Footer } from '@/components/storefront-footer';

interface TrackOrderProps {
    order: {
        id: number;
        order_number: string;
        status: string;
        subtotal: number;
        shipping: number;
        total: number;
        date: string;
        customer: {
            full_name: string;
            phone: string;
            address: string;
        };
        courier_tracking_code: string | null;
        courier_status: string | null;
        items: Array<{
            name: string;
            price: string;
            quantity: number;
            color: string | null;
            size: string | null;
            image: string;
        }>;
        logs: Array<{
            status: string;
            created_at: string;
        }>;
    } | null;
    error: string | null;
    searched: boolean;
    inputs: {
        order_number: string | null;
        phone: string | null;
    };
}

export default function TrackOrder({ order, error, searched, inputs }: TrackOrderProps) {
    const { data, setData, get, processing } = useForm({
        order_number: inputs.order_number || '',
        phone: inputs.phone || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        get(route('track-order'), {
            preserveState: true,
        });
    };

    // Helper to determine active status steps
    const getStatusStep = (status: string) => {
        const steps = ['pending', 'processing', 'shipped', 'delivered'];
        return steps.indexOf(status.toLowerCase());
    };

    const currentStep = order ? getStatusStep(order.status) : -1;

    const timelineSteps = [
        { key: 'pending', label: 'Order Placed', desc: 'Your order has been successfully placed.', icon: Clock },
        { key: 'processing', label: 'Processing', desc: 'We are preparing your items.', icon: Box },
        { key: 'shipped', label: 'Shipped', desc: 'Your package is on its way.', icon: Truck },
        { key: 'delivered', label: 'Delivered', desc: 'Package has been delivered.', icon: CheckCircle2 },
    ];

    return (
        <>
            <Head title="Track Your Order" />
            <main className="bg-background text-foreground min-h-screen flex flex-col">
                <Header />

                <div className="flex-grow mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
                    {/* Track Order Form */}
                    <div className="mx-auto max-w-md text-center mb-10">
                        <h1 className="text-3xl font-black uppercase tracking-wider text-white mb-3">Track Your Order</h1>
                        <p className="text-sm text-muted-foreground">
                            Enter your Order Number and Mobile Number to track the status of your shipment.
                        </p>
                    </div>

                    <div className="mx-auto max-w-lg mb-12">
                        <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-6 shadow-xl space-y-4">
                            <div>
                                <label htmlFor="order_number" className="block text-xs font-bold uppercase tracking-widest text-[#cba876] mb-2">
                                    Order Number / ID
                                </label>
                                <input
                                    id="order_number"
                                    type="text"
                                    required
                                    value={data.order_number}
                                    onChange={(e) => setData('order_number', e.target.value)}
                                    placeholder="e.g. 1024 or order slug"
                                    className="w-full h-12 rounded-xl border border-border bg-muted/20 px-4 text-sm text-foreground placeholder-muted-foreground focus:border-[#cba876] focus:outline-none focus:ring-0 transition-colors"
                                />
                            </div>

                            <div>
                                <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-widest text-[#cba876] mb-2">
                                    Mobile Number
                                </label>
                                <input
                                    id="phone"
                                    type="tel"
                                    required
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    placeholder="e.g. 017XXXXXXXX"
                                    className="w-full h-12 rounded-xl border border-border bg-muted/20 px-4 text-sm text-foreground placeholder-muted-foreground focus:border-[#cba876] focus:outline-none focus:ring-0 transition-colors"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full h-12 rounded-xl bg-[#cba876] text-black font-black uppercase tracking-widest text-sm hover:bg-[#b89563] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                            >
                                <Search className="h-4 w-4" />
                                {processing ? 'Searching...' : 'Track Order'}
                            </button>
                        </form>

                        {error && (
                            <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-500">
                                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                                <span>{error}</span>
                            </div>
                        )}
                    </div>

                    {/* Order Details & Timeline Section */}
                    {searched && order && (
                        <div className="space-y-8 animate-in fade-in duration-500">
                            {/* Tracking Timeline */}
                            <section className="rounded-2xl border border-border bg-card p-6 shadow-md">
                                <h2 className="text-lg font-black uppercase tracking-widest text-[#cba876] mb-8 flex items-center gap-2">
                                    <Truck className="h-5 w-5" />
                                    Shipment Status
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
                                    {timelineSteps.map((step, idx) => {
                                        const StepIcon = step.icon;
                                        const isCompleted = idx <= currentStep;
                                        const isActive = idx === currentStep;

                                        // Find if this specific status has a log date
                                        const statusLog = order.logs.find(log => log.status.toLowerCase() === step.key);
                                        const logDate = statusLog ? statusLog.created_at : (idx === 0 ? order.date : null);

                                        return (
                                            <div key={step.key} className="flex flex-col items-center text-center relative group">
                                                {/* Connector Line */}
                                                {idx < 3 && (
                                                    <div 
                                                        className={`hidden md:block absolute top-6 left-[60%] right-[-40%] h-0.5 z-0 transition-colors duration-500 ${
                                                            idx < currentStep ? 'bg-[#cba876]' : 'bg-[#1c1c1c]'
                                                        }`}
                                                    />
                                                )}

                                                <div 
                                                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 z-10 shadow-md transition-all duration-500 ${
                                                        isActive 
                                                            ? 'border-[#cba876] bg-[#cba876] text-black scale-110' 
                                                            : isCompleted 
                                                                ? 'border-[#cba876] bg-transparent text-[#cba876]' 
                                                                : 'border-[#1c1c1c] bg-transparent text-muted-foreground'
                                                    }`}
                                                >
                                                    <StepIcon className="w-5 h-5" />
                                                </div>

                                                <div className="mt-4 space-y-1">
                                                    <h3 className={`text-sm font-black uppercase tracking-wider ${
                                                        isCompleted ? 'text-white' : 'text-muted-foreground'
                                                    }`}>
                                                        {step.label}
                                                    </h3>
                                                    <p className="text-xs text-muted-foreground px-2">
                                                        {step.desc}
                                                    </p>
                                                    {logDate && (
                                                        <span className="inline-block text-[10px] font-bold text-[#cba876] bg-[#cba876]/10 px-2 py-0.5 rounded-full mt-2">
                                                            {logDate}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {order.courier_tracking_code && (
                                    <div className="mt-8 border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                                        <div className="space-y-1 text-center sm:text-left">
                                            <h4 className="text-xs font-black uppercase tracking-wider text-[#cba876]">Courier Tracking Code</h4>
                                            <p className="text-sm font-bold text-white">{order.courier_tracking_code}</p>
                                        </div>
                                        {order.courier_status && (
                                            <div className="space-y-1 text-center sm:text-right">
                                                <h4 className="text-xs font-black uppercase tracking-wider text-muted-foreground">Courier Status</h4>
                                                <p className="text-sm font-bold text-white capitalize">{order.courier_status}</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </section>

                            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 items-start">
                                {/* Order Summary Table */}
                                <div className="lg:col-span-2 space-y-6">
                                    <section className="rounded-2xl border border-border bg-card overflow-hidden shadow-md">
                                        <div className="border-b border-border bg-muted/20 px-6 py-4">
                                            <h2 className="flex items-center gap-2 font-black text-white uppercase tracking-wider text-sm">
                                                <ShoppingBag className="h-4 w-4 text-[#cba876]" />
                                                Order Items ({order.items.length})
                                            </h2>
                                        </div>
                                        <ul className="divide-y divide-border px-6">
                                            {order.items.map((item, idx) => (
                                                <li key={idx} className="flex py-6">
                                                    <div className="h-16 w-16 flex-none overflow-hidden rounded-lg border border-border bg-muted/10 p-0.5">
                                                        <img src={item.image} alt={item.name} className="h-full w-full object-cover rounded" />
                                                    </div>
                                                    <div className="ml-6 flex flex-1 flex-col justify-center">
                                                        <div className="flex items-start justify-between">
                                                            <div>
                                                                <h4 className="text-sm font-bold text-white leading-tight">{item.name}</h4>
                                                                {(item.color || item.size) && (
                                                                    <p className="mt-1 text-xs font-bold text-muted-foreground uppercase tracking-tight">
                                                                        {item.color} {item.size ? `/ ${item.size}` : ''}
                                                                    </p>
                                                                )}
                                                            </div>
                                                            <p className="text-sm font-bold text-white">৳ {parseInt(String(item.price).replace(/[^\d]/g, '')).toLocaleString()}</p>
                                                        </div>
                                                        <div className="mt-1 flex items-center gap-4 text-xs font-bold text-muted-foreground">
                                                            <span>Qty: {item.quantity}</span>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                        <div className="bg-muted/10 p-6 space-y-3">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground font-bold uppercase tracking-tight">Subtotal</span>
                                                <span className="text-white font-bold">৳ {order.subtotal.toLocaleString()}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground font-bold uppercase tracking-tight">Shipping Fee</span>
                                                <span className="text-white font-bold">৳ {order.shipping.toLocaleString()}</span>
                                            </div>
                                            <div className="flex items-center justify-between border-t border-border pt-3 mt-3">
                                                <span className="text-base font-black text-white uppercase tracking-tight">Total Amount</span>
                                                <span className="text-xl font-black text-[#cba876]">৳ {order.total.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </section>
                                </div>

                                {/* Customer Info Card */}
                                <div className="space-y-6">
                                    <section className="rounded-2xl border border-border bg-card p-6 shadow-md space-y-6">
                                        <div>
                                            <h3 className="flex items-center gap-2 text-xs font-black text-[#cba876] uppercase tracking-widest mb-4">
                                                <Calendar className="h-3.5 w-3.5" />
                                                Order Details
                                            </h3>
                                            <div className="space-y-1">
                                                <p className="text-xs text-muted-foreground uppercase tracking-wider">Order ID / Number</p>
                                                <p className="text-sm font-bold text-white">#{order.order_number}</p>
                                                <p className="text-xs text-muted-foreground uppercase tracking-wider mt-3">Order Date</p>
                                                <p className="text-sm font-bold text-white">{order.date}</p>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="flex items-center gap-2 text-xs font-black text-[#cba876] uppercase tracking-widest mb-4">
                                                <MapPin className="h-3.5 w-3.5" />
                                                Shipping Address
                                            </h3>
                                            <div className="space-y-1">
                                                <p className="text-sm font-bold text-white">{order.customer.full_name}</p>
                                                <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                                                    {order.customer.address}
                                                </p>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="flex items-center gap-2 text-xs font-black text-[#cba876] uppercase tracking-widest mb-4">
                                                <Phone className="h-3.5 w-3.5" />
                                                Contact Info
                                            </h3>
                                            <p className="text-sm text-white font-bold">{order.customer.phone}</p>
                                        </div>
                                    </section>
                                </div>
                            </div>
                        </div>
                    )}

                    {searched && !order && !error && (
                        <div className="text-center py-10">
                            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted/10 text-muted-foreground mb-4">
                                <Search className="h-8 w-8" />
                            </div>
                            <h3 className="text-lg font-bold text-white uppercase tracking-wider">Order not found</h3>
                            <p className="text-sm text-muted-foreground mt-2">
                                Please check your order number and mobile number and try again.
                            </p>
                        </div>
                    )}
                </div>

                <Footer />
            </main>
        </>
    );
}
