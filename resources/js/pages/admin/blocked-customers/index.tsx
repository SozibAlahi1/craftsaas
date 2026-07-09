import { Button } from '@/components/ui/button';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Ban, Search } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
    },
    {
        title: 'Blocked Customers',
        href: '/admin/blocked-customers',
    },
];

interface BlockedCustomer {
    id: number;
    phone: string;
    reason: string | null;
    blocker?: { id: number; name: string };
    created_at: string;
}

interface PaginationProps {
    data: BlockedCustomer[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
    total: number;
}

export default function BlockedCustomersIndex({ customers, filters }: { customers: PaginationProps; filters: any }) {
    const [search, setSearch] = useState(filters.search || '');

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        phone: '',
        reason: '',
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('admin.blocked-customers.index'), { search }, { preserveState: true });
    };

    const handleBlock = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.blocked-customers.store'), {
            onSuccess: () => {
                reset();
                clearErrors();
            },
        });
    };

    const [unblockId, setUnblockId] = useState<number | null>(null);

    const executeUnblock = () => {
        if (unblockId !== null) {
            router.delete(route('admin.blocked-customers.destroy', unblockId), {
                onSuccess: () => setUnblockId(null),
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Blocked Customers" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-slate-950 uppercase">Blocked Customers</h1>
                        <p className="text-sm font-medium text-slate-500">Manage customers blocked from placing new orders.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div className="space-y-4 md:col-span-2">
                        <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                            <form onSubmit={handleSearch} className="flex w-full max-w-md items-center gap-2">
                                <div className="relative flex-1">
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                    <Input
                                        type="search"
                                        placeholder="Search phone number..."
                                        className="pl-9"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>
                                <Button type="submit" variant="secondary">
                                    Search
                                </Button>
                            </form>
                        </div>

                        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                            {customers.data.length === 0 ? (
                                <div className="flex flex-col items-center justify-center p-12 text-center">
                                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-50">
                                        <Ban className="h-8 w-8 text-slate-300" />
                                    </div>
                                    <h3 className="mb-1 text-lg font-black tracking-tight text-slate-900 uppercase">No Blocked Customers</h3>
                                    <p className="text-sm text-slate-500">No customers are currently blocked from ordering.</p>
                                </div>
                            ) : (
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-50">
                                        <tr>
                                            <th className="px-4 py-3 font-bold text-slate-600">Phone Number</th>
                                            <th className="px-4 py-3 font-bold text-slate-600">Reason</th>
                                            <th className="px-4 py-3 font-bold text-slate-600">Blocked By</th>
                                            <th className="px-4 py-3 font-bold text-slate-600">Date</th>
                                            <th className="px-4 py-3 text-right font-bold text-slate-600">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {customers.data.map((customer) => (
                                            <tr key={customer.id} className="hover:bg-slate-50">
                                                <td className="px-4 py-3 font-medium text-slate-900">{customer.phone}</td>
                                                <td className="px-4 py-3 text-slate-600">{customer.reason || '-'}</td>
                                                <td className="px-4 py-3 text-slate-600">{customer.blocker?.name || 'System'}</td>
                                                <td className="px-4 py-3 text-slate-600">{new Date(customer.created_at).toLocaleDateString()}</td>
                                                <td className="px-4 py-3 text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setUnblockId(customer.id)}
                                                        className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                                    >
                                                        Unblock
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>

                    <div>
                        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                            <h2 className="mb-4 text-sm font-black tracking-widest text-slate-900 uppercase">Block a Customer</h2>
                            <form onSubmit={handleBlock} className="space-y-4">
                                <div>
                                    <label className="mb-1.5 block text-xs font-bold text-slate-700">Phone Number</label>
                                    <Input placeholder="01XXXXXXXXX" value={data.phone} onChange={(e) => setData('phone', e.target.value)} />
                                    {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-xs font-bold text-slate-700">Reason (Optional)</label>
                                    <Input placeholder="Fake order history" value={data.reason} onChange={(e) => setData('reason', e.target.value)} />
                                    {errors.reason && <p className="mt-1 text-xs text-red-600">{errors.reason}</p>}
                                </div>
                                <Button type="submit" disabled={processing} className="w-full bg-red-600 hover:bg-red-700">
                                    <Ban className="mr-2 h-4 w-4" />
                                    Block Number
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmModal
                isOpen={unblockId !== null}
                onClose={() => setUnblockId(null)}
                onConfirm={executeUnblock}
                title="Unblock Customer"
                description="Are you sure you want to unblock this customer? They will be able to place new orders again."
                confirmText="Unblock"
                variant="default"
            />
        </AppLayout>
    );
}
