import { Head, Link } from '@inertiajs/react';
import { Search, Users, ExternalLink, Calendar, MapPin, Phone } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';

interface Customer {
    id: number;
    name: string;
    phone: string;
    email: string | null;
    address: string | null;
    total_orders: number;
    total_spent: number;
    segment: string;
    last_order_at: string | null;
}

interface CustomersIndexProps {
    customers: {
        data: Customer[];
        links: any[];
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Customers', href: '/admin/customers' },
];

export default function CustomersIndex({ customers }: CustomersIndexProps) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredCustomers = customers.data.filter(customer => {
        return customer.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
               customer.phone.includes(searchQuery);
    });

    const getSegmentBadge = (segment: string) => {
        switch(segment) {
            case 'vip': return <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider">VIP</span>;
            case 'loyal': return <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider">Loyal</span>;
            default: return <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider">New</span>;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Customers" />

            <div className="w-full p-4 sm:p-6 lg:p-8">
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Customers</h1>
                        <p className="mt-1 text-sm font-medium text-slate-500">Manage and view customer segments.</p>
                    </div>
                </div>

                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative max-w-sm flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by name or phone..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-none border border-slate-200 py-2.5 pl-10 pr-4 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-slate-950 focus:outline-none focus:ring-1 focus:ring-slate-950"
                        />
                    </div>
                </div>

                <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-slate-200 bg-slate-50">
                                <tr>
                                    <th className="whitespace-nowrap px-6 py-4 font-black tracking-wide text-slate-900">Customer</th>
                                    <th className="whitespace-nowrap px-6 py-4 font-black tracking-wide text-slate-900">Segment</th>
                                    <th className="whitespace-nowrap px-6 py-4 font-black tracking-wide text-slate-900">Total Orders</th>
                                    <th className="whitespace-nowrap px-6 py-4 font-black tracking-wide text-slate-900">Total Spent</th>
                                    <th className="whitespace-nowrap px-6 py-4 font-black tracking-wide text-slate-900">Last Order</th>
                                    <th className="whitespace-nowrap px-6 py-4 font-black tracking-wide text-slate-900 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredCustomers.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                            <div className="flex flex-col items-center gap-3">
                                                <Users className="h-10 w-10 text-slate-300" />
                                                <p className="font-medium">No customers found.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredCustomers.map((customer) => (
                                        <tr key={customer.id} className="transition-colors hover:bg-slate-50/50">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-slate-900">{customer.name}</div>
                                                <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                                                    <Phone className="h-3 w-3" /> {customer.phone}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {getSegmentBadge(customer.segment)}
                                            </td>
                                            <td className="px-6 py-4 font-bold text-slate-700">
                                                {customer.total_orders}
                                            </td>
                                            <td className="px-6 py-4 font-black text-slate-900">
                                                ৳{Number(customer.total_spent).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                {customer.last_order_at ? (
                                                    <div className="flex items-center gap-1.5 text-slate-600 text-xs font-medium">
                                                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                                        {new Date(customer.last_order_at).toLocaleDateString()}
                                                    </div>
                                                ) : '-'}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link href={`/admin/customers/${customer.id}`}>
                                                    <Button variant="ghost" size="sm" className="h-8 text-slate-500 hover:text-slate-900 rounded-none">
                                                        View <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                                                    </Button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
