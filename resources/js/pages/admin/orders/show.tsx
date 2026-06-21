import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, CheckCircle2, Clock, CreditCard, MapPin, Package, Phone, Truck, User, XCircle, Printer, ShieldAlert } from 'lucide-react';
import { OrderTimeline } from '@/components/order-timeline';

interface OrderItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    options?: Record<string, string | null> | null;
}

interface Order {
    id: number;
    order_number: string;
    full_name: string;
    phone: string;
    address: string;
    payment_method: string;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    subtotal: number;
    shipping: number;
    total: number;
    created_at: string;
    courier_consignment_id?: string | null;
    courier_tracking_code?: string | null;
    courier_status?: string | null;
    courier_error?: string | null;
    fraud_success_ratio?: number | null;
    items: OrderItem[];
}

interface OrderShowProps {
    order: Order;
    activities: any[];
    statusLogs: any[];
    notes: any[];
}

const statusStyles: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-600',
    processing: 'bg-blue-100 text-blue-600',
    shipped: 'bg-purple-100 text-purple-600',
    delivered: 'bg-emerald-100 text-emerald-600',
    partial_delivered: 'bg-emerald-100 text-emerald-600',
    delivered_approval_pending: 'bg-indigo-100 text-indigo-600',
    partial_delivered_approval_pending: 'bg-indigo-100 text-indigo-600',
    cancelled: 'bg-red-100 text-red-600',
    cancelled_approval_pending: 'bg-rose-100 text-rose-600',
    unknown_approval_pending: 'bg-slate-100 text-slate-600',
    hold: 'bg-amber-100 text-amber-600',
    in_review: 'bg-blue-100 text-blue-600',
    unknown: 'bg-slate-100 text-slate-600',
};

const statusIcons: Record<string, typeof Package> = {
    pending: Clock,
    processing: Package,
    shipped: Package,
    delivered: CheckCircle2,
    partial_delivered: CheckCircle2,
    delivered_approval_pending: Clock,
    partial_delivered_approval_pending: Clock,
    cancelled: XCircle,
    cancelled_approval_pending: Clock,
    unknown_approval_pending: Clock,
    hold: Clock,
    in_review: Package,
    unknown: Package,
};

const formatCurrency = (amount: number) => `৳${amount.toLocaleString()}`;

const displayOptions = (options?: Record<string, string | null> | null) => {
    return Object.entries(options ?? {}).filter(([key, value]) => key !== 'image' && Boolean(value));
};

export default function OrderShow({ order, activities, statusLogs, notes }: OrderShowProps) {
    const displayStatus = order.courier_status || 'pending';
    const StatusIcon = statusIcons[displayStatus] || Package;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Orders', href: '/admin/orders' },
        { title: `#${order.order_number}`, href: route('admin.orders.show', order.id) },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Order #${order.order_number}`} />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-start sm:items-center justify-between flex-col sm:flex-row gap-4">
                    <div className="flex items-center gap-4">
                        <Link
                            href={route('admin.orders.index')}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50"
                            title="Back to orders"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="text-2xl font-black tracking-tight text-slate-950 uppercase">Order #{order.order_number}</h1>
                                <span
                                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-black tracking-tighter uppercase ${statusStyles[displayStatus] || 'bg-slate-100 text-slate-600'}`}
                                >
                                    <StatusIcon className="h-3 w-3" />
                                    {displayStatus.replace(/_/g, ' ')}
                                </span>
                            </div>
                            <p className="text-sm font-medium text-slate-500">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <a
                            href={route('admin.orders.print', { order: order.id, size: 'a4' })}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 active:scale-[0.97]"
                        >
                            <Printer className="h-3.5 w-3.5" />
                            A4
                        </a>
                        <a
                            href={route('admin.orders.print', { order: order.id, size: 'thermal80' })}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 active:scale-[0.97]"
                        >
                            <Printer className="h-3.5 w-3.5" />
                            80mm
                        </a>
                        <a
                            href={route('admin.orders.print', { order: order.id, size: 'thermal58' })}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 active:scale-[0.97]"
                        >
                            <Printer className="h-3.5 w-3.5" />
                            58mm
                        </a>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                    <div className="flex flex-col gap-6 xl:col-span-2">
                        <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
                        <div className="border-b border-slate-100 p-5">
                            <h2 className="text-sm font-black tracking-widest text-slate-900 uppercase">Order Items</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-left">
                                <thead>
                                    <tr className="border-b border-slate-100 bg-slate-50/50">
                                        <th className="px-5 py-3 text-xs font-black tracking-widest text-slate-400 uppercase">Item</th>
                                        <th className="px-5 py-3 text-xs font-black tracking-widest text-slate-400 uppercase">Qty</th>
                                        <th className="px-5 py-3 text-xs font-black tracking-widest text-slate-400 uppercase">Price</th>
                                        <th className="px-5 py-3 text-right text-xs font-black tracking-widest text-slate-400 uppercase">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {order.items.map((item) => (
                                        <tr key={item.id}>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex h-14 w-14 flex-none items-center justify-center overflow-hidden rounded-lg border border-slate-100 bg-slate-50">
                                                        {item.options?.image ? (
                                                            <img src={item.options.image} alt={item.name} className="h-full w-full object-cover" />
                                                        ) : (
                                                            <Package className="h-5 w-5 text-slate-300" />
                                                        )}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="font-black text-slate-900">{item.name}</div>
                                                        {displayOptions(item.options).length > 0 && (
                                                            <div className="mt-1 text-xs font-bold text-slate-400">
                                                                {displayOptions(item.options)
                                                                    .map(([key, value]) => `${key}: ${value}`)
                                                                    .join(', ')}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-sm font-bold text-slate-600">{item.quantity}</td>
                                            <td className="px-5 py-4 text-sm font-bold text-slate-600">{formatCurrency(item.price)}</td>
                                            <td className="px-5 py-4 text-right font-black text-slate-900">
                                                {formatCurrency(item.price * item.quantity)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="border-t border-slate-100 bg-slate-50/40 p-5">
                            <div className="ml-auto flex max-w-xs flex-col gap-2">
                                <div className="flex items-center justify-between text-sm font-bold text-slate-500">
                                    <span>Subtotal</span>
                                    <span>{formatCurrency(order.subtotal)}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm font-bold text-slate-500">
                                    <span>Shipping</span>
                                    <span>{formatCurrency(order.shipping)}</span>
                                </div>
                                <div className="flex items-center justify-between border-t border-slate-200 pt-2 text-lg font-black text-slate-950">
                                    <span>Total</span>
                                    <span>{formatCurrency(order.total)}</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    <OrderTimeline activities={activities} statusLogs={statusLogs} notes={notes} />
                    </div>

                    <div className="flex flex-col gap-6">
                        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="mb-4 flex items-center gap-2">
                                <User className="h-4 w-4 text-slate-400" />
                                <h2 className="text-sm font-black tracking-widest text-slate-900 uppercase">Customer</h2>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-xs font-black tracking-widest text-slate-400 uppercase">Name</p>
                                    <p className="font-bold text-slate-900">{order.full_name}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-black tracking-widest text-slate-400 uppercase">Phone</p>
                                    <p className="flex items-center gap-2 font-bold text-slate-900">
                                        <Phone className="h-3.5 w-3.5 text-slate-400" />
                                        {order.phone}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs font-black tracking-widest text-slate-400 uppercase">Address</p>
                                    <p className="flex items-start gap-2 text-sm font-bold text-slate-700">
                                        <MapPin className="mt-0.5 h-3.5 w-3.5 flex-none text-slate-400" />
                                        {order.address}
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="mb-4 flex items-center gap-2">
                                <CreditCard className="h-4 w-4 text-slate-400" />
                                <h2 className="text-sm font-black tracking-widest text-slate-900 uppercase">Payment</h2>
                            </div>
                            <p className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-black tracking-wider text-slate-600 uppercase">
                                {order.payment_method.replace(/_/g, ' ')}
                            </p>
                        </section>

                        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="mb-4 flex items-center gap-2">
                                <Truck className="h-4 w-4 text-slate-400" />
                                <h2 className="text-sm font-black tracking-widest text-slate-900 uppercase">Courier</h2>
                            </div>
                            <div className="space-y-3 text-sm">
                                <div>
                                    <p className="text-xs font-black tracking-widest text-slate-400 uppercase">Consignment ID</p>
                                    <p className="font-bold text-slate-900">{order.courier_consignment_id ?? 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-black tracking-widest text-slate-400 uppercase">Tracking Code</p>
                                    <p className="font-bold text-slate-900">{order.courier_tracking_code ?? 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-black tracking-widest text-slate-400 uppercase">Fraud Ratio</p>
                                    <p className="font-black text-emerald-700">
                                        {typeof order.fraud_success_ratio === 'number' ? `${order.fraud_success_ratio.toFixed(2)}%` : 'Pending'}
                                    </p>
                                </div>
                                
                                <div className="mt-4 flex gap-2 border-t border-slate-100 pt-4">
                                    {!order.courier_consignment_id ? (
                                        <Link 
                                            href={route('admin.orders.send-courier', order.id)} 
                                            method="post" 
                                            as="button" 
                                            className="flex w-full justify-center rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-blue-700"
                                        >
                                            Send to Steadfast
                                        </Link>
                                    ) : (
                                        <Link 
                                            href={route('admin.orders.sync-courier', order.id)} 
                                            method="post" 
                                            as="button" 
                                            className="flex w-full justify-center rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-200"
                                        >
                                            Sync Status
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </section>

                        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="mb-4 flex items-center gap-2">
                                <ShieldAlert className="h-4 w-4 text-slate-400" />
                                <h2 className="text-sm font-black tracking-widest text-slate-900 uppercase">Risk Assessment</h2>
                            </div>
                            <div className="space-y-3 text-sm">
                                {order.risk_score ? (
                                    <>
                                        <div>
                                            <p className="text-xs font-black tracking-widest text-slate-400 uppercase">Risk Score</p>
                                            <p className={`font-black ${
                                                order.risk_score.status === 'high' ? 'text-red-600' : 
                                                order.risk_score.status === 'medium' ? 'text-amber-600' : 'text-emerald-600'
                                            }`}>
                                                {order.risk_score.score}% ({order.risk_score.status})
                                            </p>
                                        </div>
                                        {order.risk_score.factors && order.risk_score.factors.length > 0 && (
                                            <div>
                                                <p className="text-xs font-black tracking-widest text-slate-400 uppercase mb-1">Risk Factors</p>
                                                <ul className="list-disc pl-4 text-slate-600 text-xs font-medium space-y-1">
                                                    {order.risk_score.factors.map((factor: string, idx: number) => (
                                                        <li key={idx}>{factor}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <p className="text-slate-500 font-medium">Pending evaluation.</p>
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
