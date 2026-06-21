import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import {
    Area, AreaChart, Cell, Legend, Pie, PieChart,
    ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import {
    AlertCircle, ArrowUpRight, Box, CalendarDays, CheckCircle2,
    LayoutGrid, Package, PackageX, RotateCcw, ShoppingCart, Tag, Truck, XCircle,
} from 'lucide-react';
import { useState } from 'react';

/* ── Types ── */
interface Stat {
    today_orders: number;
    confirmed_orders: number;
    pending_orders: number;
    delivered_orders: number;
    cancelled_orders: number;
    return_orders: number;
    courier_orders: number;
    total_orders: number;
    total_products: number;
    total_categories: number;
    total_revenue: number;
}

interface ChartRow { day: string; date: string; revenue: number; profit: number; }
interface CategorySale { name: string; total: number; }
interface RecentOrder {
    id: number; order_number: string; full_name: string; phone: string;
    total: number; status: string; payment_method: string; created_at: string;
}
interface TopProduct {
    id: number; name: string; image: string; qty_sold: number; revenue: number;
}

interface Props {
    stats: Stat;
    weeklyData: ChartRow[];
    monthlyData: ChartRow[];
    salesByCategory: CategorySale[];
    recentOrders: RecentOrder[];
    topProducts: TopProduct[];
}

/* ── Constants ── */
const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/dashboard' }];

/* Each stat card has its own accent color & decorative circle color */
const STAT_CARDS = (s: Stat) => [
    { label: 'Today Orders',     value: s.today_orders,      icon: ShoppingCart, accent: '#f97316', circle: '#fed7aa', iconBg: '#fff7ed',  noTaka: false },
    { label: 'Courier Orders',   value: s.courier_orders,    icon: Truck,        accent: '#a855f7', circle: '#e9d5ff', iconBg: '#faf5ff',  noTaka: false },
    { label: 'Confirmed',        value: s.confirmed_orders,  icon: CheckCircle2, accent: '#22c55e', circle: '#bbf7d0', iconBg: '#f0fdf4',  noTaka: false },
    { label: 'Pending',          value: s.pending_orders,    icon: AlertCircle,  accent: '#f59e0b', circle: '#fde68a', iconBg: '#fffbeb',  noTaka: false },
    { label: 'Delivered',        value: s.delivered_orders,  icon: Package,      accent: '#ef4444', circle: '#fecaca', iconBg: '#fef2f2',  noTaka: false },
    { label: 'Cancelled',        value: s.cancelled_orders,  icon: XCircle,      accent: '#06b6d4', circle: '#a5f3fc', iconBg: '#ecfeff',  noTaka: false },
    { label: 'Return Orders',    value: s.return_orders,     icon: RotateCcw,    accent: '#6366f1', circle: '#c7d2fe', iconBg: '#eef2ff',  noTaka: false },
    { label: 'Total Orders',     value: s.total_orders,      icon: PackageX,     accent: '#d97706', circle: '#fde68a', iconBg: '#fffbeb',  noTaka: false },
    { label: 'Total Products',   value: s.total_products,    icon: Box,          accent: '#6b7280', circle: '#e5e7eb', iconBg: '#f9fafb',  noTaka: true  },
    { label: 'Total Categories', value: s.total_categories,  icon: Tag,          accent: '#0ea5e9', circle: '#bae6fd', iconBg: '#f0f9ff',  noTaka: true  },
];

const PIE_COLORS = ['#4ade80','#60a5fa','#f59e0b','#f472b6','#a78bfa','#34d399'];

const STATUS_BADGE: Record<string, string> = {
    pending:   'bg-amber-50 text-amber-700 border border-amber-200',
    confirmed: 'bg-green-50 text-green-700 border border-green-200',
    delivered: 'bg-blue-50 text-blue-700 border border-blue-200',
    cancelled: 'bg-red-50 text-red-700 border border-red-200',
    returned:  'bg-purple-50 text-purple-700 border border-purple-200',
};

/* ── Component ── */
export default function Dashboard({ stats, weeklyData, monthlyData, salesByCategory, recentOrders, topProducts }: Props) {
    const [chartMode, setChartMode] = useState<'weekly' | 'monthly'>('weekly');
    const [orderFilter, setOrderFilter] = useState('All');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');

    const chartData = chartMode === 'weekly' ? weeklyData : monthlyData;

    const handleDateFilter = () => {
        router.get(route('dashboard'), { date_from: dateFrom, date_to: dateTo }, { preserveScroll: true });
    };

    const handleTodayFilter = () => {
        const today = new Date().toISOString().split('T')[0];
        setDateFrom(today);
        setDateTo(today);
        router.get(route('dashboard'), { date_from: today, date_to: today }, { preserveScroll: true });
    };

    const filteredOrders = orderFilter === 'All'
        ? recentOrders
        : recentOrders.filter(o => o.status === orderFilter.toLowerCase());

    const statCards = STAT_CARDS(stats);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex flex-col gap-5 p-4 sm:p-6">

                {/* ── Page title + date filter ── */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-slate-900">Dashboard</h1>
                        <p className="mt-0.5 text-sm text-slate-500">Welcome back! Here's what's happening.</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1.5 shadow-sm">
                            <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
                                className="border-0 bg-transparent text-xs text-slate-600 outline-none" />
                            <span className="text-xs text-slate-400">→</span>
                            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
                                className="border-0 bg-transparent text-xs text-slate-600 outline-none" />
                            <button onClick={handleDateFilter}
                                className="ml-1 rounded-md bg-slate-900 px-2.5 py-1 text-[10px] font-bold text-white transition hover:bg-slate-700">
                                Filter
                            </button>
                        </div>
                        <button onClick={handleTodayFilter}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50">
                            <CalendarDays className="h-3.5 w-3.5" /> Today
                        </button>
                    </div>
                </div>

                {/* ── Stat Cards ── */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
                    {statCards.map((card) => {
                        const Icon = card.icon;
                        return (
                            <div key={card.label}
                                className="relative overflow-hidden rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition hover:shadow-md">
                                {/* Decorative semicircle */}
                                <div className="absolute -right-5 -top-5 h-20 w-20 rounded-full opacity-60"
                                    style={{ background: card.circle }} />
                                <div className="absolute -right-2 -top-8 h-16 w-16 rounded-full opacity-40"
                                    style={{ background: card.circle }} />

                                <div className="relative flex flex-col gap-3">
                                    {/* Icon */}
                                    <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg"
                                        style={{ background: card.iconBg }}>
                                        <Icon className="h-4 w-4" style={{ color: card.accent }} strokeWidth={2.5} />
                                    </div>

                                    {/* Label */}
                                    <div>
                                        <p className="text-xs font-medium text-slate-500">{card.label}</p>
                                        <div className="mt-1 flex items-baseline gap-1">
                                            <span className="text-2xl font-black text-slate-900">
                                                {card.noTaka ? card.value.toLocaleString() : `৳${card.value.toLocaleString()}`}
                                            </span>
                                            <span className="flex items-center text-xs font-semibold" style={{ color: card.accent }}>
                                                <ArrowUpRight className="h-3 w-3" />
                                            </span>
                                        </div>
                                        <p className="text-[10px] text-slate-400 mt-0.5">{card.noTaka ? 'total count' : 'total amount'}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* ── Charts Row ── */}
                <div className="grid gap-4 lg:grid-cols-3">

                    {/* Revenue Chart */}
                    <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm lg:col-span-2">
                        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                            <h2 className="text-sm font-bold text-slate-800">Revenue Overview</h2>
                            <div className="flex items-center gap-1 rounded-lg border border-slate-200 p-1">
                                {(['weekly', 'monthly'] as const).map((mode) => (
                                    <button key={mode} onClick={() => setChartMode(mode)}
                                        className={`rounded-md px-3 py-1 text-xs font-semibold transition-all ${chartMode === mode ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}>
                                        {mode === 'weekly' ? 'Last Week' : 'Monthly'}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="p-4">
                            <ResponsiveContainer width="100%" height={220}>
                                <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
                                            <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', fontSize: 12 }}
                                        formatter={(val: number, name: string) => [`৳${val.toLocaleString()}`, name === 'revenue' ? 'Revenue' : 'Profit']}
                                    />
                                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
                                    <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} fill="url(#colorRevenue)" dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
                                    <Area type="monotone" dataKey="profit" stroke="#22c55e" strokeWidth={2} fill="url(#colorProfit)" dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Sales by Category */}
                    <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
                        <div className="border-b border-slate-100 px-5 py-4">
                            <h2 className="text-sm font-bold text-slate-800">Sales by Category</h2>
                        </div>
                        <div className="flex flex-col items-center p-4">
                            {salesByCategory.length > 0 ? (
                                <>
                                    <ResponsiveContainer width="100%" height={160}>
                                        <PieChart>
                                            <Pie data={salesByCategory} cx="50%" cy="50%" outerRadius={70} innerRadius={40}
                                                dataKey="total" paddingAngle={3}>
                                                {salesByCategory.map((_, i) => (
                                                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(val: number) => `৳${val.toLocaleString()}`}
                                                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: 12 }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="mt-2 w-full space-y-1.5">
                                        {salesByCategory.map((cat, i) => (
                                            <div key={i} className="flex items-center justify-between text-xs">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="inline-block h-2.5 w-2.5 rounded-full"
                                                        style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                                                    <span className="font-medium text-slate-600 truncate max-w-[100px]">{cat.name}</span>
                                                </div>
                                                <span className="font-bold text-slate-800">৳{Number(cat.total).toLocaleString()}</span>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="mb-2 h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center">
                                        <Box className="h-6 w-6 text-slate-400" />
                                    </div>
                                    <p className="text-xs text-slate-500">No sales data yet</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── Bottom Row ── */}
                <div className="grid gap-4 lg:grid-cols-2">

                    {/* Recent Orders */}
                    <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
                        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                            <h2 className="text-sm font-bold text-slate-800">Recent Orders</h2>
                            <div className="flex items-center gap-1 rounded-lg border border-slate-200 p-1">
                                {['All', 'Pending', 'Confirmed', 'Delivered', 'Cancelled'].map((f) => (
                                    <button key={f} onClick={() => setOrderFilter(f)}
                                        className={`rounded-md px-2.5 py-1 text-[11px] font-semibold transition-all ${orderFilter === f ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'}`}>
                                        {f}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {filteredOrders.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <ShoppingCart className="h-8 w-8 text-slate-300 mb-2" />
                                <p className="text-xs text-slate-500">No orders found</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-50">
                                {filteredOrders.map((order) => (
                                    <Link key={order.id} href={route('admin.orders.show', order.id)}
                                        className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-slate-50">
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-black text-slate-600">
                                            {order.full_name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="text-xs font-bold text-slate-800 truncate">{order.full_name}</p>
                                                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold capitalize ${STATUS_BADGE[order.status] || 'bg-slate-100 text-slate-600'}`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                            <p className="text-[11px] text-slate-400">#{order.order_number} · {order.phone}</p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="text-xs font-black text-slate-900">৳{Number(order.total).toLocaleString()}</p>
                                            <p className="text-[10px] text-slate-400">{new Date(order.created_at).toLocaleDateString('en-BD', { day:'2-digit', month:'short' })}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}

                        <div className="border-t border-slate-100 px-5 py-3 text-center">
                            <Link href={route('admin.orders.index')} className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors">
                                View all orders →
                            </Link>
                        </div>
                    </div>

                    {/* Top Products */}
                    <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
                        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                            <h2 className="text-sm font-bold text-slate-800">Top Products</h2>
                            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-600">
                                by quantity
                            </span>
                        </div>

                        {topProducts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <Package className="h-8 w-8 text-slate-300 mb-2" />
                                <p className="text-xs text-slate-500">No sales data yet</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-50 p-2">
                                {topProducts.map((product, idx) => (
                                    <div key={product.id} className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-slate-50">
                                        {/* Rank */}
                                        <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-black text-white ${idx === 0 ? 'bg-amber-400' : idx === 1 ? 'bg-slate-400' : idx === 2 ? 'bg-orange-400' : 'bg-slate-200 text-slate-600'}`}>
                                            {idx + 1}
                                        </div>
                                        {/* Image */}
                                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-slate-100">
                                            {product.image ? (
                                                <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center bg-slate-100">
                                                    <Package className="h-4 w-4 text-slate-400" />
                                                </div>
                                            )}
                                        </div>
                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold text-slate-800 truncate">{product.name}</p>
                                            <p className="text-[11px] text-slate-400">{product.qty_sold} sold</p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="text-xs font-black text-slate-900">৳{Number(product.revenue).toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </AppLayout>
    );
}
