import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Activity, ShoppingBag, TrendingUp, Users } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface AnalyticsIndexProps {
    days: number;
    revenueData: any[];
    topProducts: any[];
    trafficSources: any[];
    funnelData: any[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Analytics', href: '/admin/analytics' },
];

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function AnalyticsIndex({ days, revenueData, topProducts, trafficSources, funnelData }: AnalyticsIndexProps) {
    const handleDaysChange = (value: string) => {
        router.get(route('admin.analytics.index'), { days: value }, { preserveState: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Analytics Dashboard" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="flex items-center gap-2 text-2xl font-black tracking-tight text-slate-950 uppercase">
                            <Activity className="h-6 w-6 text-purple-600" />
                            Analytics & Reporting
                        </h1>
                        <p className="text-sm font-medium text-slate-500">Track store performance, traffic, and sales trends.</p>
                    </div>

                    <div className="w-48">
                        <Select value={days.toString()} onValueChange={handleDaysChange}>
                            <SelectTrigger className="font-bold">
                                <SelectValue placeholder="Select timeframe" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="7">Last 7 Days</SelectItem>
                                <SelectItem value="30">Last 30 Days</SelectItem>
                                <SelectItem value="90">Last 90 Days</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Conversion Funnel */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="mb-6 flex items-center gap-2 text-sm font-black tracking-widest text-slate-900 uppercase">
                        <TrendingUp className="h-4 w-4 text-emerald-500" /> Conversion Funnel
                    </h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                        {funnelData.map((step, index) => (
                            <div key={step.name} className="relative rounded-lg border border-slate-100 bg-slate-50 p-4 text-center">
                                <div className="text-3xl font-black text-slate-900">{step.value}</div>
                                <div className="mt-1 text-xs font-bold tracking-widest text-slate-500 uppercase">{step.name}</div>
                                {index < funnelData.length - 1 && (
                                    <div className="absolute top-1/2 -right-3 z-10 -mt-3 flex hidden h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 sm:block">
                                        &rarr;
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Revenue Line Chart */}
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h3 className="mb-4 text-sm font-black tracking-widest text-slate-900 uppercase">Revenue Trend</h3>
                        <div className="h-72 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={revenueData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                    <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#64748b' }} />
                                    <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontWeight: 'bold' }} />
                                    <Line
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#10b981"
                                        strokeWidth={3}
                                        dot={{ r: 4, strokeWidth: 2 }}
                                        activeDot={{ r: 6 }}
                                        name="Revenue (BDT)"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Orders Bar Chart */}
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h3 className="mb-4 text-sm font-black tracking-widest text-slate-900 uppercase">Orders Trend</h3>
                        <div className="h-72 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={revenueData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                    <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#64748b' }} />
                                    <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontWeight: 'bold' }} />
                                    <Bar dataKey="orders" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Orders" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Top Products */}
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h3 className="mb-4 flex items-center gap-2 text-sm font-black tracking-widest text-slate-900 uppercase">
                            <ShoppingBag className="h-4 w-4 text-amber-500" /> Top Selling Products
                        </h3>
                        <div className="overflow-hidden rounded-lg border border-slate-100">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-4 py-3 text-xs font-bold tracking-wider text-slate-500 uppercase">Product</th>
                                        <th className="px-4 py-3 text-right text-xs font-bold tracking-wider text-slate-500 uppercase">Sold</th>
                                        <th className="px-4 py-3 text-right text-xs font-bold tracking-wider text-slate-500 uppercase">Revenue</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {topProducts.map((product, i) => (
                                        <tr key={i} className="hover:bg-slate-50/50">
                                            <td className="px-4 py-3 font-bold text-slate-900">{product.product_name}</td>
                                            <td className="px-4 py-3 text-right font-bold text-slate-600">{product.total_sold}</td>
                                            <td className="px-4 py-3 text-right font-bold text-emerald-600">
                                                ৳{Number(product.total_revenue).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                    {topProducts.length === 0 && (
                                        <tr>
                                            <td colSpan={3} className="px-4 py-8 text-center font-medium text-slate-500">
                                                No sales data found for this period.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Traffic Sources Pie Chart */}
                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h3 className="mb-4 flex items-center gap-2 text-sm font-black tracking-widest text-slate-900 uppercase">
                            <Users className="h-4 w-4 text-blue-500" /> Traffic Sources
                        </h3>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={trafficSources} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                        {trafficSources.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontWeight: 'bold' }} />
                                    <Legend wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
