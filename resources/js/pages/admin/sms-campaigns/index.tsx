import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function SmsCampaignsIndex({ campaigns }: { campaigns: any }) {
    const { data, setData, post, processing, reset, errors } = useForm({
        name: '',
        message_template: '',
        audience_type: 'all',
        scheduled_at: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/sms-campaigns', {
            onSuccess: () => reset(),
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Automation', href: '/admin/sms-campaigns' }, { title: 'SMS Campaigns', href: '/admin/sms-campaigns' }]}>
            <Head title="SMS Campaigns" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Create New SMS Campaign</CardTitle>
                            <CardDescription>Send bulk SMS to your customers</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="flex flex-col gap-4">
                                <div>
                                    <Input 
                                        placeholder="Campaign Name (e.g. Eid Promo 2026)" 
                                        value={data.name} 
                                        onChange={(e) => setData('name', e.target.value)} 
                                    />
                                    {errors.name && <span className="text-xs text-red-500">{errors.name}</span>}
                                </div>
                                
                                <div>
                                    <Textarea 
                                        placeholder="Message Template (You can use {name})" 
                                        value={data.message_template} 
                                        onChange={(e) => setData('message_template', e.target.value)} 
                                        rows={4}
                                    />
                                    {errors.message_template && <span className="text-xs text-red-500">{errors.message_template}</span>}
                                    <p className="text-xs text-muted-foreground mt-1">Characters: {data.message_template.length}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Select onValueChange={(val) => setData('audience_type', val)} defaultValue="all">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Audience" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Customers</SelectItem>
                                                <SelectItem value="segment">Specific Segment</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Input 
                                            type="datetime-local" 
                                            value={data.scheduled_at} 
                                            onChange={(e) => setData('scheduled_at', e.target.value)} 
                                        />
                                        <p className="text-xs text-muted-foreground mt-1">Leave empty to send now</p>
                                    </div>
                                </div>

                                <Button type="submit" disabled={processing}>Launch Campaign</Button>
                            </form>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Campaigns</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Campaign</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Sent</TableHead>
                                        <TableHead className="text-right">Failed</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {campaigns.data.map((camp: any) => (
                                        <TableRow key={camp.id}>
                                            <TableCell className="font-medium">
                                                {camp.name}
                                                <div className="text-xs text-muted-foreground">
                                                    {camp.scheduled_at ? new Date(camp.scheduled_at).toLocaleString() : 'Immediate'}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className={`px-2 py-1 rounded text-xs ${camp.status === 'sent' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                    {camp.status}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right text-green-600">{camp.sent_count} / {camp.total_recipients}</TableCell>
                                            <TableCell className="text-right text-red-600">{camp.failed_count}</TableCell>
                                        </TableRow>
                                    ))}
                                    {campaigns.data.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center text-muted-foreground py-4">No campaigns found.</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
