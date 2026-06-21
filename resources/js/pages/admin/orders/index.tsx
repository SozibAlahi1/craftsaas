import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { AlertTriangle, CheckCircle2, Clock, Copy, Eye, MoreVertical, Package, RefreshCw, Search, Trash2, Truck, XCircle, Filter } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface Order {
    id: number;
    order_number: string;
    full_name: string;
    status: string;
    payment_method: string;
    total: number;
    items_count: number;
    created_at: string;
    courier_consignment_id?: string | null;
    courier_tracking_code?: string | null;
    courier_status?: string | null;
    courier_error?: string | null;
    fraud_success_ratio?: number | null;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedData<T> {
    data: T[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    from: number;
    to: number;
    total: number;
}

interface OrderIndexProps {
    orders: PaginatedData<Order>;
    filters: {
        search?: string;
        status?: string;
        payment_method?: string;
        date_from?: string;
        date_to?: string;
    };
}

type OrderAction = 'send' | 'sync' | 'fraud';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Orders', href: '/admin/orders' },
];

const StatusBadge = ({ status }: { status: string }) => {
    const styles: Record<string, string> = {
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

    const icons: Record<string, typeof Package> = {
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

    const Icon = icons[status] || Package;
    const label = status.replace(/_/g, ' ');

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-black tracking-tighter uppercase ${styles[status] || 'bg-slate-100 text-slate-600'}`}
        >
            <Icon className="h-3 w-3" />
            {label}
        </span>
    );
};

const FraudCheckCell = ({ order, isLoading, onCheckCourier }: { order: Order; isLoading: boolean; onCheckCourier: (orderId: number) => void }) => {
    return (
        <div className="flex min-w-[120px] items-center gap-2">
            {order.risk_score ? (
                <div className={`text-sm font-black tracking-wider ${
                    order.risk_score.status === 'high' ? 'text-red-600' : 
                    order.risk_score.status === 'medium' ? 'text-amber-600' : 'text-emerald-600'
                }`}>
                    Risk: {order.risk_score.score}% ({order.risk_score.status})
                </div>
            ) : (
                <div className="text-xs font-black tracking-wider text-slate-400 uppercase">Pending</div>
            )}
            {typeof order.fraud_success_ratio === 'number' && (
                <div className="text-xs font-black tracking-wider text-emerald-700 mt-1">Steadfast: {order.fraud_success_ratio.toFixed(2)}%</div>
            )}
            <button
                onClick={() => onCheckCourier(order.id)}
                disabled={isLoading}
                className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-emerald-200 bg-emerald-50 text-emerald-700 transition-colors hover:bg-emerald-100 disabled:opacity-50"
                title="Check courier fraud score"
                aria-label="Check courier fraud score"
            >
                <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
        </div>
    );
};

export default function OrderIndex({ orders, filters }: OrderIndexProps) {
    const [activeAction, setActiveAction] = useState<{ orderId: number; action: OrderAction } | null>(null);
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [bulkStatus, setBulkStatus] = useState<string>('');
    const [isBulkUpdating, setIsBulkUpdating] = useState(false);

    const [search, setSearch] = useState(filters?.search || '');
    const [status, setStatus] = useState(filters?.status || 'all');
    const [dateFrom, setDateFrom] = useState(filters?.date_from || '');
    const [dateTo, setDateTo] = useState(filters?.date_to || '');
    const [paymentMethod, setPaymentMethod] = useState(filters?.payment_method || 'all');

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenMenuId(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSendToCourier = (orderId: number) => {
        setActiveAction({ orderId, action: 'send' });
        router.post(route('admin.orders.send-courier', orderId), {}, {
            onFinish: () => setActiveAction(null),
        });
    };

    const handleSyncStatus = (orderId: number) => {
        setActiveAction({ orderId, action: 'sync' });
        router.post(route('admin.orders.sync-courier', orderId), {}, {
            onFinish: () => setActiveAction(null),
        });
    };

    const handleCheckCourier = (orderId: number) => {
        setActiveAction({ orderId, action: 'fraud' });
        router.post(route('admin.orders.fraud-check', orderId), {}, {
            preserveScroll: true,
            onFinish: () => setActiveAction(null),
        });
    };

    const applyFilters = () => {
        router.get(route('admin.orders.index'), {
            search: search || undefined,
            status: status !== 'all' ? status : undefined,
            date_from: dateFrom || undefined,
            date_to: dateTo || undefined,
            payment_method: paymentMethod !== 'all' ? paymentMethod : undefined,
        }, { preserveState: true });
    };

    const handleBulkUpdate = () => {
        if (!bulkStatus || selectedIds.length === 0) return;
        setIsBulkUpdating(true);
        router.patch(route('admin.orders.bulk-update'), {
            order_ids: selectedIds,
            status: bulkStatus
        }, {
            onSuccess: () => {
                setSelectedIds([]);
                setBulkStatus('');
            },
            onFinish: () => setIsBulkUpdating(false)
        });
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === orders.data.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(orders.data.map(o => o.id));
        }
    };

    const toggleSelect = (id: number) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(i => i !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Orders" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-slate-950 uppercase">Orders</h1>
                        <p className="text-sm font-medium text-slate-500">Monitor and fulfill customer purchases</p>
                    </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    {/* Filters Section */}
                    <div className="border-b border-slate-100 bg-slate-50/50 p-4 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                            <div className="relative col-span-1 md:col-span-2">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <Input
                                    type="text"
                                    placeholder="Search order ID, phone, name..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-10"
                                    onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                                />
                            </div>
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="processing">Processing</SelectItem>
                                    <SelectItem value="shipped">Shipped</SelectItem>
                                    <SelectItem value="delivered">Delivered</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Payment Method" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Methods</SelectItem>
                                    <SelectItem value="cod">Cash on Delivery</SelectItem>
                                    <SelectItem value="bkash">bKash</SelectItem>
                                    <SelectItem value="sslcommerz">SSLCommerz</SelectItem>
                                </SelectContent>
                            </Select>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={applyFilters} className="w-full">
                                    <Filter className="h-4 w-4 mr-2" /> Filter
                                </Button>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="w-auto" />
                            <span className="text-sm text-slate-500">to</span>
                            <Input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="w-auto" />
                        </div>
                    </div>

                    {/* Bulk Actions */}
                    {selectedIds.length > 0 && (
                        <div className="bg-indigo-50 border-b border-indigo-100 p-3 flex items-center justify-between">
                            <span className="text-sm font-medium text-indigo-700">
                                {selectedIds.length} orders selected
                            </span>
                            <div className="flex items-center gap-3">
                                <Select value={bulkStatus} onValueChange={setBulkStatus}>
                                    <SelectTrigger className="w-40 bg-white">
                                        <SelectValue placeholder="Change Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="processing">Processing</SelectItem>
                                        <SelectItem value="shipped">Shipped</SelectItem>
                                        <SelectItem value="delivered">Delivered</SelectItem>
                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button onClick={handleBulkUpdate} disabled={isBulkUpdating || !bulkStatus} size="sm">
                                    {isBulkUpdating ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : null}
                                    Update
                                </Button>
                            </div>
                        </div>
                    )}

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/50">
                                    <th className="px-6 py-4 w-10">
                                        <Checkbox
                                            checked={selectedIds.length > 0 && selectedIds.length === orders.data.length}
                                            onCheckedChange={toggleSelectAll}
                                        />
                                    </th>
                                    <th className="px-6 py-4 text-xs font-black tracking-widest text-slate-400 uppercase">Order ID</th>
                                    <th className="px-6 py-4 text-xs font-black tracking-widest text-slate-400 uppercase">Customer</th>
                                    <th className="px-6 py-4 text-xs font-black tracking-widest text-slate-400 uppercase">Status</th>
                                    <th className="px-6 py-4 text-xs font-black tracking-widest text-slate-400 uppercase">Courier Fulfillment</th>
                                    <th className="px-6 py-4 text-xs font-black tracking-widest text-slate-400 uppercase">Fraud Check</th>
                                    <th className="px-6 py-4 text-xs font-black tracking-widest text-slate-400 uppercase">Items</th>
                                    <th className="px-6 py-4 text-xs font-black tracking-widest text-slate-400 uppercase">Total</th>
                                    <th className="px-6 py-4 text-right text-xs font-black tracking-widest text-slate-400 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {orders.data.map((order) => {
                                    const activeOrderAction = activeAction?.orderId === order.id ? activeAction.action : null;
                                    const isSendingToCourier = activeOrderAction === 'send';
                                    const isSyncingStatus = activeOrderAction === 'sync';
                                    const isCheckingFraud = activeOrderAction === 'fraud';

                                    return (
                                        <tr key={order.id} className="group transition-colors hover:bg-slate-50/30">
                                            <td className="px-6 py-4">
                                                <Checkbox
                                                    checked={selectedIds.includes(order.id)}
                                                    onCheckedChange={() => toggleSelect(order.id)}
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-mono font-black text-slate-900 transition-colors group-hover:text-orange-600">
                                                    #{order.order_number}
                                                </div>
                                                <div className="mt-0.5 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                                                    {new Date(order.created_at).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-slate-900">{order.full_name}</div>
                                                <div className="text-xs text-slate-500 uppercase">{order.payment_method}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <StatusBadge status={order.status} />
                                            </td>

                                            <td className="px-6 py-4">
                                                {order.courier_consignment_id ? (
                                                    <div className="max-w-[200px] space-y-1.5">
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => handleSyncStatus(order.id)}
                                                                disabled={isSyncingStatus}
                                                                className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-950"
                                                                title="Synchronize Live Status"
                                                            >
                                                                <RefreshCw
                                                                    className={`h-3.5 w-3.5 ${isSyncingStatus ? 'animate-spin text-slate-600' : ''}`}
                                                                />
                                                            </button>
                                                            <StatusBadge status={order.courier_status || 'pending'} />
                                                        </div>
                                                        <div className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                                                            ID: {order.courier_consignment_id}
                                                        </div>
                                                        <div className="text-[10px] font-bold text-slate-400">
                                                            Track: {order.courier_tracking_code}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="max-w-[200px] space-y-1">
                                                        <button
                                                            onClick={() => handleSendToCourier(order.id)}
                                                            disabled={isSendingToCourier}
                                                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-950 bg-slate-950 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-slate-800 active:scale-[0.97] disabled:opacity-50"
                                                        >
                                                            {isSendingToCourier ? (
                                                                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                                                            ) : (
                                                                <Truck className="h-3.5 w-3.5" />
                                                            )}
                                                            Send to Courier
                                                        </button>
                                                        {order.courier_error && (
                                                            <p className="flex items-center gap-1 text-[10px] leading-snug font-bold text-red-600">
                                                                <AlertTriangle className="h-3 w-3 flex-shrink-0" />
                                                                {order.courier_error}
                                                            </p>
                                                        )}
                                                    </div>
                                                )}
                                            </td>

                                            <td className="px-6 py-4">
                                                <FraudCheckCell order={order} isLoading={isCheckingFraud} onCheckCourier={handleCheckCourier} />
                                            </td>
                                            <td className="px-6 py-4 font-bold text-slate-600">{order.items_count} items</td>
                                            <td className="px-6 py-4 font-black text-slate-900">৳{order.total.toLocaleString()}</td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1" ref={menuRef}>
                                                    <Link
                                                        href={route('admin.orders.show', order.id)}
                                                        className="p-2 text-slate-400 transition-colors hover:text-slate-950"
                                                        title="View details"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                    <div className="relative">
                                                        <button
                                                            onClick={() => setOpenMenuId(openMenuId === order.id ? null : order.id)}
                                                            className="p-2 text-slate-400 transition-colors hover:text-slate-950"
                                                            title="Options"
                                                        >
                                                            <MoreVertical className="h-4 w-4" />
                                                        </button>
                                                        {openMenuId === order.id && (
                                                            <div className="absolute right-0 top-full z-50 mt-1 w-40 rounded-lg border border-slate-200 bg-white shadow-lg">
                                                                <div className="overflow-hidden rounded-lg">
                                                                    <button
                                                                        onClick={() => {
                                                                            navigator.clipboard.writeText(order.order_number);
                                                                            setOpenMenuId(null);
                                                                        }}
                                                                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50"
                                                                    >
                                                                        <Copy className="h-4 w-4" />
                                                                        Copy Order ID
                                                                    </button>
                                                                    <Link
                                                                        href={route('admin.orders.show', order.id)}
                                                                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50"
                                                                    >
                                                                        <Eye className="h-4 w-4" />
                                                                        View Details
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {orders.data.length === 0 && (
                                    <tr>
                                        <td colSpan={9} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center gap-2">
                                                <Package className="h-8 w-8 text-slate-200" />
                                                <p className="text-sm font-bold text-slate-400">No orders found yet</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination */}
                    {orders.links.length > 3 && (
                        <div className="flex items-center justify-center p-4 border-t border-slate-100">
                            <div className="flex flex-wrap gap-1">
                                {orders.links.map((link, i) => (
                                    link.url ? (
                                        <Link
                                            key={i}
                                            href={link.url}
                                            className={`px-3 py-1 text-sm rounded-md transition-colors ${link.active ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ) : (
                                        <span
                                            key={i}
                                            className="px-3 py-1 text-sm text-slate-400 rounded-md"
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    )
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
