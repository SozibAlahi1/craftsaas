import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';

export default function MetaAdsIndex({ accounts, campaigns }: { accounts: any; campaigns: any }) {
    const { data, setData, post, processing, reset, errors } = useForm({
        name: '',
        account_id: '',
        access_token: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/meta-ads/accounts', {
            onSuccess: () => reset(),
        });
    };

    const syncData = () => {
        router.post('/admin/meta-ads/sync');
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Finance', href: '/admin/finance' },
                { title: 'Meta Ads', href: '/admin/meta-ads' },
            ]}
        >
            <Head title="Meta Ads Management" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tight">Meta Ads Integration</h2>
                    <Button onClick={syncData} variant="outline">
                        Sync Spend Data Now
                    </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Connected Facebook Accounts</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Account ID</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {accounts.map((acc: any) => (
                                        <TableRow key={acc.id}>
                                            <TableCell>{acc.name}</TableCell>
                                            <TableCell>{acc.account_id}</TableCell>
                                            <TableCell>
                                                <span
                                                    className={`rounded px-2 py-1 text-xs ${acc.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                                                >
                                                    {acc.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {accounts.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={3} className="text-muted-foreground py-4 text-center">
                                                No accounts connected.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Connect New Account</CardTitle>
                            <CardDescription>Enter your Meta App Long-lived Access Token</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="flex flex-col gap-4">
                                <div>
                                    <Input
                                        placeholder="Internal Name (e.g. Primary BM)"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                    />
                                    {errors.name && <span className="text-xs text-red-500">{errors.name}</span>}
                                </div>

                                <div>
                                    <Input
                                        placeholder="Facebook Profile / BM ID"
                                        value={data.account_id}
                                        onChange={(e) => setData('account_id', e.target.value)}
                                    />
                                    {errors.account_id && <span className="text-xs text-red-500">{errors.account_id}</span>}
                                </div>

                                <div>
                                    <Input
                                        type="password"
                                        placeholder="Access Token"
                                        value={data.access_token}
                                        onChange={(e) => setData('access_token', e.target.value)}
                                    />
                                    {errors.access_token && <span className="text-xs text-red-500">{errors.access_token}</span>}
                                </div>

                                <Button type="submit" disabled={processing}>
                                    Connect Account
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Active Campaigns (Last 30 Days)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Campaign Name</TableHead>
                                    <TableHead>Ad Account</TableHead>
                                    <TableHead className="text-right">Total Spend</TableHead>
                                    <TableHead className="text-right">Clicks</TableHead>
                                    <TableHead className="text-right">CPC</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {campaigns.map((camp: any) => (
                                    <TableRow key={camp.id}>
                                        <TableCell className="font-medium">{camp.name}</TableCell>
                                        <TableCell>{camp.account}</TableCell>
                                        <TableCell className="text-right font-bold text-red-600">৳{camp.total_spend}</TableCell>
                                        <TableCell className="text-right">{camp.clicks}</TableCell>
                                        <TableCell className="text-right">৳{camp.cpc}</TableCell>
                                    </TableRow>
                                ))}
                                {campaigns.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-muted-foreground py-8 text-center">
                                            No active campaigns found. Try syncing spend data.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
