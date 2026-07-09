import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#ffc658'];

export default function FinanceIndex({ data, days }: { data: any; days: number }) {
    const { summary, trend, expenses, snapshots } = data;

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/dashboard' },
                { title: 'Finance', href: '/admin/finance' },
            ]}
        >
            <Head title="Finance Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tight">Finance Overview</h2>
                    <div className="flex gap-2">
                        <Link href={`/admin/finance?days=7`}>
                            <Button variant={days === 7 ? 'default' : 'outline'} size="sm">
                                Last 7 Days
                            </Button>
                        </Link>
                        <Link href={`/admin/finance?days=30`}>
                            <Button variant={days === 30 ? 'default' : 'outline'} size="sm">
                                Last 30 Days
                            </Button>
                        </Link>
                        <Link href={`/admin/finance?days=90`}>
                            <Button variant={days === 90 ? 'default' : 'outline'} size="sm">
                                Last 90 Days
                            </Button>
                        </Link>
                        <a href={`/admin/finance/export?days=${days}`}>
                            <Button variant="secondary" size="sm">
                                Export CSV
                            </Button>
                        </a>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">৳{summary.revenue.toLocaleString()}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">COGS</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-orange-500">৳{summary.product_cost.toLocaleString()}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Ad Spend</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-500">৳{summary.ad_spend.toLocaleString()}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className={`text-2xl font-bold ${summary.net_profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                ৳{summary.net_profit.toLocaleString()}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">ROAS</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{summary.roas}x</div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    {/* Profit Trend Chart */}
                    <Card className="col-span-4">
                        <CardHeader>
                            <CardTitle>Daily Net Profit Trend</CardTitle>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={trend}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis
                                            dataKey="date"
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={(value) =>
                                                new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
                                            }
                                        />
                                        <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `৳${value}`} />
                                        <Tooltip
                                            formatter={(value) => [`৳${value}`, 'Net Profit']}
                                            labelFormatter={(label) => new Date(label).toLocaleDateString()}
                                        />
                                        <Line type="monotone" dataKey="daily_profit" stroke="#10b981" strokeWidth={2} dot={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Expense Breakdown */}
                    <Card className="col-span-3">
                        <CardHeader>
                            <CardTitle>Expense Breakdown</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px]">
                                {expenses && expenses.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={expenses}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={100}
                                                paddingAngle={5}
                                                dataKey="total"
                                                nameKey="category"
                                            >
                                                {expenses.map((entry: any, index: number) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(value) => `৳${value}`} />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="text-muted-foreground flex h-full items-center justify-center">
                                        No expense data for this period
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Delivered Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Order #</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">Revenue</TableHead>
                                    <TableHead className="text-right">COGS</TableHead>
                                    <TableHead className="text-right">Ad Spend</TableHead>
                                    <TableHead className="text-right">Net Profit</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {snapshots.map((snap: any) => (
                                    <TableRow key={snap.id}>
                                        <TableCell className="font-medium">{snap.order?.order_number || snap.order_id}</TableCell>
                                        <TableCell>{new Date(snap.calculated_at).toLocaleDateString()}</TableCell>
                                        <TableCell className="text-right">৳{snap.revenue}</TableCell>
                                        <TableCell className="text-right text-orange-600">৳{snap.product_cost}</TableCell>
                                        <TableCell className="text-right text-red-600">৳{snap.ad_spend}</TableCell>
                                        <TableCell className={`text-right font-bold ${snap.net_profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            ৳{snap.net_profit}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
