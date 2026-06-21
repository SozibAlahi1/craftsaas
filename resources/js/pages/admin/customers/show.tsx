import { Head, Link } from '@inertiajs/react';
import { Package, MapPin, Phone, Mail, Calendar, ArrowLeft } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';

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
        switch(segment) {
            case 'vip': return <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded text-sm font-bold uppercase tracking-wider">VIP</span>;
            case 'loyal': return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm font-bold uppercase tracking-wider">Loyal</span>;
            default: return <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded text-sm font-bold uppercase tracking-wider">New</span>;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Customer: ${customer.name}`} />

            <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
                <div className="mb-4">
                    <Link href="/admin/customers" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors mb-4">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Customers
                    </Link>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex items-center gap-4">
                            <div className="h-16 w-16 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-2xl font-black">
                                {customer.name.charAt(0)}
                            </div>
                            <div>
                                <h1 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">{customer.name}</h1>
                                <div className="mt-1 flex items-center gap-2">
                                    <span className="text-sm font-medium text-slate-500">Customer since {new Date(customer.created_at).toLocaleDateString()}</span>
                                    {getSegmentBadge(customer.segment)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
                            <h3 className="font-black text-lg text-slate-950 mb-4 pb-4 border-b border-slate-100">Contact Information</h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <Phone className="h-5 w-5 text-slate-400 mt-0.5" />
                                    <div>
                                        <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Phone</div>
                                        <div className="font-medium text-slate-900">{customer.phone}</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Mail className="h-5 w-5 text-slate-400 mt-0.5" />
                                    <div>
                                        <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Email</div>
                                        <div className="font-medium text-slate-900">{customer.email || 'N/A'}</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <MapPin className="h-5 w-5 text-slate-400 mt-0.5" />
                                    <div>
                                        <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Address</div>
                                        <div className="font-medium text-slate-900 leading-relaxed">{customer.address || 'N/A'}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
                            <h3 className="font-black text-lg text-slate-950 mb-4 pb-4 border-b border-slate-100">Value Metrics</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Spent</div>
                                    <div className="text-2xl font-black mt-1 text-slate-950">৳{Number(customer.total_spent).toLocaleString()}</div>
                                </div>
                                <div>
                                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Orders</div>
                                    <div className="text-2xl font-black mt-1 text-slate-950">{customer.total_orders}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
                            <div className="p-6 border-b border-slate-100">
                                <h3 className="font-black text-lg text-slate-950">Order History</h3>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {customer.orders.length === 0 ? (
                                    <div className="p-8 text-center text-slate-500">No orders found.</div>
                                ) : (
                                    customer.orders.map(order => (
                                        <div key={order.id} className="p-6 hover:bg-slate-50/50 transition-colors">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <Link href={`/admin/orders/${order.id}`} className="font-black text-indigo-600 hover:text-indigo-800 hover:underline">
                                                        {order.order_number}
                                                    </Link>
                                                    <div className="flex items-center gap-2 mt-1 text-xs font-medium text-slate-500">
                                                        <Calendar className="h-3.5 w-3.5" />
                                                        {new Date(order.created_at).toLocaleDateString()}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-black text-slate-900">৳{Number(order.total).toLocaleString()}</div>
                                                    <span className="inline-block mt-1 px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider rounded">
                                                        {order.status}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {order.items.map(item => (
                                                    <div key={item.id} className="flex items-center gap-2 bg-white border border-slate-200 p-1.5 rounded pr-3">
                                                        <img src={item.product?.image || '/placeholder.png'} alt="" className="w-6 h-6 object-cover rounded-sm" />
                                                        <span className="text-xs font-bold text-slate-700">{item.quantity}x {item.name}</span>
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
