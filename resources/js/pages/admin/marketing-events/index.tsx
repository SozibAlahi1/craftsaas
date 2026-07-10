import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import {
    Activity,
    AlertCircle,
    CheckCircle,
    ChevronDown,
    ChevronUp,
    Database,
    Megaphone,
    RefreshCw,
    Search,
    Send,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Marketing Events', href: '/admin/marketing-events' },
];

interface Order {
    id: number;
    order_number: string;
    total: number;
    full_name: string;
}

interface MarketingEvent {
    id: number;
    order_id: number;
    platform: string;
    event_name: string;
    trigger_status: string;
    event_id: string | null;
    payload: any;
    response: any;
    sent: boolean;
    sent_at: string | null;
    retry_count: number;
    created_at: string;
    order?: Order;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationProps {
    data: MarketingEvent[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    total: number;
}

interface MarketingEventIndexProps {
    events: PaginationProps;
    filters: {
        search?: string;
        platform?: string;
        status?: string;
    };
}

export default function MarketingEventsIndex({ events, filters }: MarketingEventIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [platform, setPlatform] = useState(filters.platform || 'all');
    const [status, setStatus] = useState(filters.status || 'all');
    const [expandedRow, setExpandedRow] = useState<number | null>(null);
    const [actionLoading, setActionLoading] = useState<number | null>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            route('admin.marketing-events.index'),
            { search, platform, status },
            { preserveState: true, replace: true }
        );
    };

    const handleFilterChange = (key: string, value: string) => {
        const queryParams: any = { search, platform, status };
        queryParams[key] = value;

        if (key === 'platform') setPlatform(value);
        if (key === 'status') setStatus(value);

        router.get(route('admin.marketing-events.index'), queryParams, { preserveState: true });
    };

    const handleRetry = (id: number) => {
        setActionLoading(id);
        router.post(
            route('admin.marketing-events.retry', id),
            {},
            {
                onFinish: () => setActionLoading(null),
                preserveScroll: true,
            }
        );
    };

    const handleResend = (id: number) => {
        setActionLoading(id);
        router.post(
            route('admin.marketing-events.resend', id),
            {},
            {
                onFinish: () => setActionLoading(null),
                preserveScroll: true,
            }
        );
    };

    const toggleRow = (id: number) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Marketing Event Logs" />

            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="flex items-center gap-2 text-2xl font-black tracking-tight text-slate-950 uppercase">
                            <Megaphone className="h-6 w-6 text-indigo-600" />
                            Marketing Event Logs
                        </h1>
                        <p className="text-sm font-medium text-slate-500">
                            Monitor and manage conversions sent to Meta Pixel, GTM, and other integrations.
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <form onSubmit={handleSearch} className="flex flex-col gap-4 md:flex-row md:items-center">
                        <div className="relative flex-1">
                            <Search className="absolute top-2.5 left-3 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by Order Number..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full rounded-lg border border-slate-200 py-2 pr-4 pl-10 text-sm text-slate-900 focus:border-slate-950 focus:outline-none"
                            />
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <select
                                value={platform}
                                onChange={(e) => handleFilterChange('platform', e.target.value)}
                                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-slate-950 focus:outline-none"
                            >
                                <option value="all">All Platforms</option>
                                <option value="meta">Meta (Facebook)</option>
                                <option value="google_ads">Google Ads</option>
                                <option value="google_analytics">GA4</option>
                                <option value="tiktok">TikTok</option>
                                <option value="snapchat">Snapchat</option>
                                <option value="webhook">Webhook</option>
                            </select>

                            <select
                                value={status}
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-slate-950 focus:outline-none"
                            >
                                <option value="all">All Statuses</option>
                                <option value="sent">Sent</option>
                                <option value="failed">Failed / Pending</option>
                            </select>

                            <Button type="submit" size="sm" className="font-bold">
                                Apply Filter
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Events Table */}
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left text-sm text-slate-600">
                            <thead className="border-b border-slate-100 bg-slate-50/75 text-xs font-black tracking-wider text-slate-500 uppercase">
                                <tr>
                                    <th className="py-3 px-5">ID</th>
                                    <th className="py-3 px-5">Event</th>
                                    <th className="py-3 px-5">Order</th>
                                    <th className="py-3 px-5">Platform</th>
                                    <th className="py-3 px-5">Status</th>
                                    <th className="py-3 px-5">Date & Time</th>
                                    <th className="py-3 px-5">Attempts</th>
                                    <th className="py-3 px-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-medium">
                                {events.data.map((event) => {
                                    const isExpanded = expandedRow === event.id;
                                    const isLoading = actionLoading === event.id;

                                    return (
                                        <React.Fragment key={event.id}>
                                            <tr className="hover:bg-slate-50/50">
                                                <td className="py-4 px-5 font-mono text-xs text-slate-400">
                                                    #{event.id}
                                                </td>
                                                <td className="py-4 px-5">
                                                    <span className="font-black text-slate-900">{event.event_name}</span>
                                                    <div className="text-[10px] font-bold text-slate-400">
                                                        Trigger: {event.trigger_status}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-5">
                                                    {event.order ? (
                                                        <Link
                                                            href={route('admin.orders.show', event.order_id)}
                                                            className="font-bold text-blue-600 hover:underline"
                                                        >
                                                            #{event.order.order_number}
                                                        </Link>
                                                    ) : (
                                                        <span className="text-slate-400">Deleted Order</span>
                                                    )}
                                                    <div className="text-[10px] font-bold text-slate-500">
                                                        Value: ৳{event.order?.total || 0}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-5">
                                                    <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 text-xs font-bold capitalize text-slate-700">
                                                        {event.platform.replace('_', ' ')}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-5">
                                                    {event.sent ? (
                                                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-black tracking-tighter text-emerald-700 uppercase">
                                                            <CheckCircle className="h-3 w-3" /> Sent
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-black tracking-tighter text-rose-700 uppercase">
                                                            <XCircle className="h-3 w-3" /> Failed
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-4 px-5 text-xs text-slate-500">
                                                    {event.sent_at
                                                        ? new Date(event.sent_at).toLocaleString()
                                                        : new Date(event.created_at).toLocaleString()}
                                                </td>
                                                <td className="py-4 px-5 font-mono text-xs">
                                                    {event.retry_count}
                                                </td>
                                                <td className="py-4 px-5 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => toggleRow(event.id)}
                                                            className="text-slate-500 hover:text-slate-900"
                                                        >
                                                            {isExpanded ? (
                                                                <ChevronUp className="h-4 w-4" />
                                                            ) : (
                                                                <ChevronDown className="h-4 w-4" />
                                                            )}
                                                        </Button>

                                                        {!event.sent ? (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                disabled={isLoading}
                                                                onClick={() => handleRetry(event.id)}
                                                                className="text-amber-600 hover:bg-amber-50 hover:text-amber-700 border-amber-200"
                                                            >
                                                                {isLoading ? (
                                                                    <RefreshCw className="h-3 w-3 animate-spin" />
                                                                ) : (
                                                                    <RefreshCw className="h-3 w-3" />
                                                                )}
                                                                <span className="ml-1 hidden sm:inline">Retry</span>
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                disabled={isLoading}
                                                                onClick={() => handleResend(event.id)}
                                                                className="text-blue-600 hover:bg-blue-50 hover:text-blue-700 border-blue-200"
                                                            >
                                                                {isLoading ? (
                                                                    <RefreshCw className="h-3 w-3 animate-spin" />
                                                                ) : (
                                                                    <Send className="h-3 w-3" />
                                                                )}
                                                                <span className="ml-1 hidden sm:inline">Resend</span>
                                                            </Button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>

                                            {/* Expanded row with JSON payload and response details */}
                                            {isExpanded && (
                                                <tr className="bg-slate-50/50">
                                                    <td colSpan={8} className="py-4 px-5">
                                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-inner">
                                                                <div className="mb-2 flex items-center gap-1.5 text-xs font-black tracking-widest text-slate-400 uppercase">
                                                                    <Database className="h-3.5 w-3.5" /> Payload Sent
                                                                </div>
                                                                <pre className="overflow-x-auto rounded bg-slate-950 p-3 font-mono text-xs text-emerald-400 shadow-sm leading-relaxed max-h-60">
                                                                    {JSON.stringify(event.payload, null, 2)}
                                                                </pre>
                                                            </div>

                                                            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-inner">
                                                                <div className="mb-2 flex items-center gap-1.5 text-xs font-black tracking-widest text-slate-400 uppercase">
                                                                    <AlertCircle className="h-3.5 w-3.5" /> Response Payload
                                                                </div>
                                                                <pre className="overflow-x-auto rounded bg-slate-950 p-3 font-mono text-xs text-amber-400 shadow-sm leading-relaxed max-h-60">
                                                                    {event.response
                                                                        ? JSON.stringify(event.response, null, 2)
                                                                        : '// No response received yet.'}
                                                                </pre>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    );
                                })}

                                {events.data.length === 0 && (
                                    <tr>
                                        <td colSpan={8} className="py-12 text-center text-slate-400">
                                            No marketing events logged.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {events.links.length > 3 && (
                        <div className="flex items-center justify-center border-t border-slate-100 p-4">
                            <div className="flex flex-wrap gap-1">
                                {events.links.map((link, i) =>
                                    link.url ? (
                                        <Link
                                            key={i}
                                            href={link.url}
                                            className={`rounded-md px-3 py-1 text-sm transition-colors ${
                                                link.active ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ) : (
                                        <span
                                            key={i}
                                            className="rounded-md px-3 py-1 text-sm text-slate-400"
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ),
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
