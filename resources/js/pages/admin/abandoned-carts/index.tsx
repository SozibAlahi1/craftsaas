import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { CheckCircle, Clock, MapPin, Phone, ShoppingCart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConfirmModal } from '@/components/ui/confirm-modal';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
    },
    {
        title: 'Abandoned Carts',
        href: '/admin/abandoned-carts',
    },
];

interface CartData {
    name: string;
    price: string;
    quantity: number;
    options?: Record<string, string>;
}

interface Cart {
    id: number;
    session_id: string;
    customer_name: string | null;
    customer_phone: string | null;
    customer_address: string | null;
    cart_data: CartData[];
    last_active_at: string;
    status: string;
    created_at: string;
}

interface PaginationProps {
    data: Cart[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
    total: number;
}

export default function AbandonedCartsIndex({ carts, filters }: { carts: PaginationProps; filters: any }) {
    const [statusFilter, setStatusFilter] = useState(filters.status || 'pending');

    const handleFilterChange = (newStatus: string) => {
        setStatusFilter(newStatus);
        router.get(
            route('admin.abandoned-carts.index'),
            { status: newStatus },
            { preserveState: true, preserveScroll: true }
        );
    };

    const [confirmAction, setConfirmAction] = useState<{ id: number, type: 'recover' | 'delete' } | null>(null);

    const executeConfirmAction = () => {
        if (!confirmAction) return;
        if (confirmAction.type === 'recover') {
            router.post(route('admin.abandoned-carts.mark-recovered', confirmAction.id));
        } else {
            router.delete(route('admin.abandoned-carts.destroy', confirmAction.id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Abandoned Carts" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-slate-950 uppercase">Abandoned Carts</h1>
                        <p className="text-sm font-medium text-slate-500">Track and recover carts left behind by customers.</p>
                    </div>

                    <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-1">
                        <button
                            onClick={() => handleFilterChange('pending')}
                            className={`rounded-md px-3 py-1.5 text-xs font-bold transition-colors ${
                                statusFilter === 'pending' ? 'bg-amber-100 text-amber-700' : 'text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            Pending
                        </button>
                        <button
                            onClick={() => handleFilterChange('recovered')}
                            className={`rounded-md px-3 py-1.5 text-xs font-bold transition-colors ${
                                statusFilter === 'recovered' ? 'bg-emerald-100 text-emerald-700' : 'text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            Recovered
                        </button>
                    </div>
                </div>

                <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                    {carts.data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-12 text-center">
                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-50">
                                <ShoppingCart className="h-8 w-8 text-slate-300" />
                            </div>
                            <h3 className="mb-1 text-lg font-black tracking-tight text-slate-900 uppercase">No Carts Found</h3>
                            <p className="text-sm text-slate-500">There are no {statusFilter} abandoned carts at this time.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {carts.data.map((cart) => (
                                <div key={cart.id} className="p-5 transition-colors hover:bg-slate-50">
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                        <div className="flex-1 space-y-3">
                                            <div className="flex items-center gap-3">
                                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">
                                                    <ShoppingCart className="h-4 w-4 text-slate-500" />
                                                </span>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900">
                                                        {cart.customer_name || 'Guest User'}
                                                    </p>
                                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                                        <Clock className="h-3 w-3" />
                                                        Last active: {new Date(cart.last_active_at).toLocaleString()}
                                                    </div>
                                                </div>
                                                <span className={`ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-black tracking-tighter uppercase ${
                                                    cart.status === 'recovered' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                                }`}>
                                                    {cart.status}
                                                </span>
                                            </div>

                                            <div className={`ml-11 grid grid-cols-1 gap-4 ${(cart.customer_phone || cart.customer_address) ? 'sm:grid-cols-2' : ''}`}>
                                                {(cart.customer_phone || cart.customer_address) && (
                                                    <div className="space-y-1">
                                                        {cart.customer_phone && (
                                                            <div className="flex items-center gap-1.5 text-sm text-slate-600">
                                                                <Phone className="h-3.5 w-3.5 text-slate-400" />
                                                                {cart.customer_phone}
                                                            </div>
                                                        )}
                                                        {cart.customer_address && (
                                                            <div className="flex items-start gap-1.5 text-sm text-slate-600">
                                                                <MapPin className="mt-0.5 h-3.5 w-3.5 flex-none text-slate-400" />
                                                                <span className="line-clamp-2">{cart.customer_address}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                <div className="rounded-md border border-slate-100 bg-slate-50 p-3 max-w-lg">
                                                    <p className="mb-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                                                        Cart Items ({cart.cart_data ? Object.keys(cart.cart_data).length : 0})
                                                    </p>
                                                    <ul className="space-y-1">
                                                        {cart.cart_data && Object.values(cart.cart_data).map((item: any, idx) => (
                                                            <li key={idx} className="flex justify-between text-sm">
                                                                <span className="truncate text-slate-700">{item.name} x{item.quantity}</span>
                                                                <span className="font-medium text-slate-900 ml-4">{item.price}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 shrink-0">
                                            {cart.status === 'pending' && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setConfirmAction({ id: cart.id, type: 'recover' })}
                                                    className="w-full justify-start gap-1.5 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 sm:w-auto"
                                                >
                                                    <CheckCircle className="h-3.5 w-3.5" />
                                                    Mark Recovered
                                                </Button>
                                            )}
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setConfirmAction({ id: cart.id, type: 'delete' })}
                                                className="w-full justify-start gap-1.5 text-red-600 hover:bg-red-50 hover:text-red-700 sm:w-auto"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <ConfirmModal
                isOpen={confirmAction !== null}
                onClose={() => setConfirmAction(null)}
                onConfirm={executeConfirmAction}
                title={confirmAction?.type === 'recover' ? 'Mark Cart Recovered' : 'Delete Abandoned Cart'}
                description={confirmAction?.type === 'recover' ? 'Are you sure you want to mark this cart as recovered?' : 'Are you sure you want to delete this cart?'}
                confirmText={confirmAction?.type === 'recover' ? 'Mark Recovered' : 'Delete'}
                variant={confirmAction?.type === 'recover' ? 'default' : 'destructive'}
            />
        </AppLayout>
    );
}
