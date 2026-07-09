import { StorefrontFooter as Footer } from '@/components/storefront-footer';
import { Header } from '@/themes/wildtannery/components/Header';
import { Head, useForm } from '@inertiajs/react';
import { AlertCircle, Box, Calendar, CheckCircle2, Clock, MapPin, Phone, Search, ShoppingBag, Truck } from 'lucide-react';

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
            <main className="bg-background text-foreground flex min-h-screen flex-col">
                <Header />

                <div className="mx-auto w-full max-w-4xl flex-grow px-4 py-12 sm:px-6 lg:px-8">
                    {/* Track Order Form */}
                    <div className="mx-auto mb-10 max-w-md text-center">
                        <h1 className="mb-3 text-3xl font-black tracking-wider text-white uppercase">Track Your Order</h1>
                        <p className="text-muted-foreground text-sm">
                            Enter your Order Number and Mobile Number to track the status of your shipment.
                        </p>
                    </div>

                    <div className="mx-auto mb-12 max-w-lg">
                        <form onSubmit={handleSubmit} className="border-border bg-card space-y-4 rounded-2xl border p-6 shadow-xl">
                            <div>
                                <label htmlFor="order_number" className="mb-2 block text-xs font-bold tracking-widest text-[#cba876] uppercase">
                                    Order Number / ID
                                </label>
                                <input
                                    id="order_number"
                                    type="text"
                                    required
                                    value={data.order_number}
                                    onChange={(e) => setData('order_number', e.target.value)}
                                    placeholder="e.g. 1024 or order slug"
                                    className="border-border bg-muted/20 text-foreground placeholder-muted-foreground h-12 w-full rounded-xl border px-4 text-sm transition-colors focus:border-[#cba876] focus:ring-0 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label htmlFor="phone" className="mb-2 block text-xs font-bold tracking-widest text-[#cba876] uppercase">
                                    Mobile Number
                                </label>
                                <input
                                    id="phone"
                                    type="tel"
                                    required
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    placeholder="e.g. 017XXXXXXXX"
                                    className="border-border bg-muted/20 text-foreground placeholder-muted-foreground h-12 w-full rounded-xl border px-4 text-sm transition-colors focus:border-[#cba876] focus:ring-0 focus:outline-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#cba876] text-sm font-black tracking-widest text-black uppercase shadow-lg transition-all hover:bg-[#b89563] active:scale-[0.98]"
                            >
                                <Search className="h-4 w-4" />
                                {processing ? 'Searching...' : 'Track Order'}
                            </button>
                        </form>

                        {error && (
                            <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-500">
                                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}
                    </div>

                    {/* Order Details & Timeline Section */}
                    {searched && order && (
                        <div className="animate-in fade-in space-y-8 duration-500">
                            {/* Tracking Timeline */}
                            <section className="border-border bg-card rounded-2xl border p-6 shadow-md">
                                <h2 className="mb-8 flex items-center gap-2 text-lg font-black tracking-widest text-[#cba876] uppercase">
                                    <Truck className="h-5 w-5" />
                                    Shipment Status
                                </h2>

                                <div className="relative grid grid-cols-1 gap-6 md:grid-cols-4">
                                    {timelineSteps.map((step, idx) => {
                                        const StepIcon = step.icon;
                                        const isCompleted = idx <= currentStep;
                                        const isActive = idx === currentStep;

                                        // Find if this specific status has a log date
                                        const statusLog = order.logs.find((log) => log.status.toLowerCase() === step.key);
                                        const logDate = statusLog ? statusLog.created_at : idx === 0 ? order.date : null;

                                        return (
                                            <div key={step.key} className="group relative flex flex-col items-center text-center">
                                                {/* Connector Line */}
                                                {idx < 3 && (
                                                    <div
                                                        className={`absolute top-6 right-[-40%] left-[60%] z-0 hidden h-0.5 transition-colors duration-500 md:block ${
                                                            idx < currentStep ? 'bg-[#cba876]' : 'bg-[#1c1c1c]'
                                                        }`}
                                                    />
                                                )}

                                                <div
                                                    className={`z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 shadow-md transition-all duration-500 ${
                                                        isActive
                                                            ? 'scale-110 border-[#cba876] bg-[#cba876] text-black'
                                                            : isCompleted
                                                              ? 'border-[#cba876] bg-transparent text-[#cba876]'
                                                              : 'text-muted-foreground border-[#1c1c1c] bg-transparent'
                                                    }`}
                                                >
                                                    <StepIcon className="h-5 w-5" />
                                                </div>

                                                <div className="mt-4 space-y-1">
                                                    <h3
                                                        className={`text-sm font-black tracking-wider uppercase ${
                                                            isCompleted ? 'text-white' : 'text-muted-foreground'
                                                        }`}
                                                    >
                                                        {step.label}
                                                    </h3>
                                                    <p className="text-muted-foreground px-2 text-xs">{step.desc}</p>
                                                    {logDate && (
                                                        <span className="mt-2 inline-block rounded-full bg-[#cba876]/10 px-2 py-0.5 text-[10px] font-bold text-[#cba876]">
                                                            {logDate}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {order.courier_tracking_code && (
                                    <div className="border-border mt-8 flex flex-col items-center justify-between gap-4 border-t pt-6 sm:flex-row">
                                        <div className="space-y-1 text-center sm:text-left">
                                            <h4 className="text-xs font-black tracking-wider text-[#cba876] uppercase">Courier Tracking Code</h4>
                                            <p className="text-sm font-bold text-white">{order.courier_tracking_code}</p>
                                        </div>
                                        {order.courier_status && (
                                            <div className="space-y-1 text-center sm:text-right">
                                                <h4 className="text-muted-foreground text-xs font-black tracking-wider uppercase">Courier Status</h4>
                                                <p className="text-sm font-bold text-white capitalize">{order.courier_status}</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </section>

                            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
                                {/* Order Summary Table */}
                                <div className="space-y-6 lg:col-span-2">
                                    <section className="border-border bg-card overflow-hidden rounded-2xl border shadow-md">
                                        <div className="border-border bg-muted/20 border-b px-6 py-4">
                                            <h2 className="flex items-center gap-2 text-sm font-black tracking-wider text-white uppercase">
                                                <ShoppingBag className="h-4 w-4 text-[#cba876]" />
                                                Order Items ({order.items.length})
                                            </h2>
                                        </div>
                                        <ul className="divide-border divide-y px-6">
                                            {order.items.map((item, idx) => (
                                                <li key={idx} className="flex py-6">
                                                    <div className="border-border bg-muted/10 h-16 w-16 flex-none overflow-hidden rounded-lg border p-0.5">
                                                        <img src={item.image} alt={item.name} className="h-full w-full rounded object-cover" />
                                                    </div>
                                                    <div className="ml-6 flex flex-1 flex-col justify-center">
                                                        <div className="flex items-start justify-between">
                                                            <div>
                                                                <h4 className="text-sm leading-tight font-bold text-white">{item.name}</h4>
                                                                {(item.color || item.size) && (
                                                                    <p className="text-muted-foreground mt-1 text-xs font-bold tracking-tight uppercase">
                                                                        {item.color} {item.size ? `/ ${item.size}` : ''}
                                                                    </p>
                                                                )}
                                                            </div>
                                                            <p className="text-sm font-bold text-white">
                                                                ৳ {parseInt(String(item.price).replace(/[^\d]/g, '')).toLocaleString()}
                                                            </p>
                                                        </div>
                                                        <div className="text-muted-foreground mt-1 flex items-center gap-4 text-xs font-bold">
                                                            <span>Qty: {item.quantity}</span>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                        <div className="bg-muted/10 space-y-3 p-6">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground font-bold tracking-tight uppercase">Subtotal</span>
                                                <span className="font-bold text-white">৳ {order.subtotal.toLocaleString()}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground font-bold tracking-tight uppercase">Shipping Fee</span>
                                                <span className="font-bold text-white">৳ {order.shipping.toLocaleString()}</span>
                                            </div>
                                            <div className="border-border mt-3 flex items-center justify-between border-t pt-3">
                                                <span className="text-base font-black tracking-tight text-white uppercase">Total Amount</span>
                                                <span className="text-xl font-black text-[#cba876]">৳ {order.total.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </section>
                                </div>

                                {/* Customer Info Card */}
                                <div className="space-y-6">
                                    <section className="border-border bg-card space-y-6 rounded-2xl border p-6 shadow-md">
                                        <div>
                                            <h3 className="mb-4 flex items-center gap-2 text-xs font-black tracking-widest text-[#cba876] uppercase">
                                                <Calendar className="h-3.5 w-3.5" />
                                                Order Details
                                            </h3>
                                            <div className="space-y-1">
                                                <p className="text-muted-foreground text-xs tracking-wider uppercase">Order ID / Number</p>
                                                <p className="text-sm font-bold text-white">#{order.order_number}</p>
                                                <p className="text-muted-foreground mt-3 text-xs tracking-wider uppercase">Order Date</p>
                                                <p className="text-sm font-bold text-white">{order.date}</p>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="mb-4 flex items-center gap-2 text-xs font-black tracking-widest text-[#cba876] uppercase">
                                                <MapPin className="h-3.5 w-3.5" />
                                                Shipping Address
                                            </h3>
                                            <div className="space-y-1">
                                                <p className="text-sm font-bold text-white">{order.customer.full_name}</p>
                                                <p className="text-muted-foreground text-sm leading-relaxed font-medium">{order.customer.address}</p>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="mb-4 flex items-center gap-2 text-xs font-black tracking-widest text-[#cba876] uppercase">
                                                <Phone className="h-3.5 w-3.5" />
                                                Contact Info
                                            </h3>
                                            <p className="text-sm font-bold text-white">{order.customer.phone}</p>
                                        </div>
                                    </section>
                                </div>
                            </div>
                        </div>
                    )}

                    {searched && !order && !error && (
                        <div className="py-10 text-center">
                            <div className="bg-muted/10 text-muted-foreground mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full">
                                <Search className="h-8 w-8" />
                            </div>
                            <h3 className="text-lg font-bold tracking-wider text-white uppercase">Order not found</h3>
                            <p className="text-muted-foreground mt-2 text-sm">Please check your order number and mobile number and try again.</p>
                        </div>
                    )}
                </div>

                <Footer />
            </main>
        </>
    );
}
