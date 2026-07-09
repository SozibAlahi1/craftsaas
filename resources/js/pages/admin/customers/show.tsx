import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, Mail, MapPin, Phone } from 'lucide-react';

interface OrderItem {
    id: number;
    name: string;
    quantity: number;
    price: number;
    product?: {
        image: string;
    };
}

interface Order {
    id: number;
    order_number: string;
    total: number;
    status: string;
    created_at: string;
    items: OrderItem[];
}

interface Customer {
    id: number;
    name: string;
    phone: string;
    email: string | null;
    address: string | null;
    total_orders: number;
    total_spent: number;
    segment: string;
    created_at: string;
    orders: Order[];
}

interface CustomerShowProps {
    customer: Customer;
}

export default function CustomerShow({ customer }: CustomerShowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Customers', href: '/admin/customers' },
        { title: customer.name, href: `/admin/customers/${customer.id}` },
    ];

    const getSegmentBadge = (segment: string) => {
        switch (segment) {
            case 'vip':
                return <span className="rounded bg-purple-100 px-3 py-1 text-sm font-bold tracking-wider text-purple-700 uppercase">VIP</span>;
            case 'loyal':
                return <span className="rounded bg-blue-100 px-3 py-1 text-sm font-bold tracking-wider text-blue-700 uppercase">Loyal</span>;
            default:
                return <span className="rounded bg-slate-100 px-3 py-1 text-sm font-bold tracking-wider text-slate-700 uppercase">New</span>;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Customer: ${customer.name}`} />

            <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
                <div className="mb-4">
                    <Link
                        href="/admin/customers"
                        className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition-colors hover:text-slate-900"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Customers
                    </Link>
                    <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                        <div className="flex items-center gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-2xl font-black text-indigo-700">
                                {customer.name.charAt(0)}
                            </div>
                            <div>
                                <h1 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">{customer.name}</h1>
                                <div className="mt-1 flex items-center gap-2">
                                    <span className="text-sm font-medium text-slate-500">
                                        Customer since {new Date(customer.created_at).toLocaleDateString()}
                                    </span>
                                    {getSegmentBadge(customer.segment)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-1">
                        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                            <h3 className="mb-4 border-b border-slate-100 pb-4 text-lg font-black text-slate-950">Contact Information</h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <Phone className="mt-0.5 h-5 w-5 text-slate-400" />
                                    <div>
                                        <div className="text-xs font-bold tracking-wider text-slate-500 uppercase">Phone</div>
                                        <div className="font-medium text-slate-900">{customer.phone}</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Mail className="mt-0.5 h-5 w-5 text-slate-400" />
                                    <div>
                                        <div className="text-xs font-bold tracking-wider text-slate-500 uppercase">Email</div>
                                        <div className="font-medium text-slate-900">{customer.email || 'N/A'}</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <MapPin className="mt-0.5 h-5 w-5 text-slate-400" />
                                    <div>
                                        <div className="text-xs font-bold tracking-wider text-slate-500 uppercase">Address</div>
                                        <div className="leading-relaxed font-medium text-slate-900">{customer.address || 'N/A'}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                            <h3 className="mb-4 border-b border-slate-100 pb-4 text-lg font-black text-slate-950">Value Metrics</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-xs font-bold tracking-wider text-slate-500 uppercase">Total Spent</div>
                                    <div className="mt-1 text-2xl font-black text-slate-950">৳{Number(customer.total_spent).toLocaleString()}</div>
                                </div>
                                <div>
                                    <div className="text-xs font-bold tracking-wider text-slate-500 uppercase">Total Orders</div>
                                    <div className="mt-1 text-2xl font-black text-slate-950">{customer.total_orders}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
                            <div className="border-b border-slate-100 p-6">
                                <h3 className="text-lg font-black text-slate-950">Order History</h3>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {customer.orders.length === 0 ? (
                                    <div className="p-8 text-center text-slate-500">No orders found.</div>
                                ) : (
                                    customer.orders.map((order) => (
                                        <div key={order.id} className="p-6 transition-colors hover:bg-slate-50/50">
                                            <div className="mb-4 flex items-start justify-between">
                                                <div>
                                                    <Link
                                                        href={`/admin/orders/${order.id}`}
                                                        className="font-black text-indigo-600 hover:text-indigo-800 hover:underline"
                                                    >
                                                        {order.order_number}
                                                    </Link>
                                                    <div className="mt-1 flex items-center gap-2 text-xs font-medium text-slate-500">
                                                        <Calendar className="h-3.5 w-3.5" />
                                                        {new Date(order.created_at).toLocaleDateString()}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-black text-slate-900">৳{Number(order.total).toLocaleString()}</div>
                                                    <span className="mt-1 inline-block rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold tracking-wider text-slate-700 uppercase">
                                                        {order.status}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {order.items.map((item) => (
                                                    <div
                                                        key={item.id}
                                                        className="flex items-center gap-2 rounded border border-slate-200 bg-white p-1.5 pr-3"
                                                    >
                                                        <img
                                                            src={item.product?.image || '/placeholder.png'}
                                                            alt=""
                                                            className="h-6 w-6 rounded-sm object-cover"
                                                        />
                                                        <span className="text-xs font-bold text-slate-700">
                                                            {item.quantity}x {item.name}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
