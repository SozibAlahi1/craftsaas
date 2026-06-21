import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function WhatsAppCampaignsIndex({ campaigns }: { campaigns: any }) {
    const { data, setData, post, processing, reset, errors } = useForm({
        name: '',
        template_name: '',
        scheduled_at: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/whatsapp-campaigns', {
            onSuccess: () => reset(),
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Automation', href: '/admin/whatsapp-campaigns' }, { title: 'WhatsApp Campaigns', href: '/admin/whatsapp-campaigns' }]}>
            <Head title="WhatsApp Campaigns" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Create New WhatsApp Campaign</CardTitle>
                            <CardDescription>Send pre-approved Meta template messages</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="flex flex-col gap-4">
                                <div>
                                    <Input 
                                        placeholder="Campaign Name" 
                                        value={data.name} 
                                        onChange={(e) => setData('name', e.target.value)} 
                                    />
                                    {errors.name && <span className="text-xs text-red-500">{errors.name}</span>}
                                </div>
                                
                                <div>
                                    <Input 
                                        placeholder="Exact Template Name (from Meta Business Manager)" 
                                        value={data.template_name} 
                                        onChange={(e) => setData('template_name', e.target.value)} 
                                    />
                                    {errors.template_name && <span className="text-xs text-red-500">{errors.template_name}</span>}
                                </div>

                                <div>
                                    <Input 
                                        type="datetime-local" 
                                        value={data.scheduled_at} 
                                        onChange={(e) => setData('scheduled_at', e.target.value)} 
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">Leave empty to send now</p>
                                </div>

                                <Button type="submit" disabled={processing}>Launch WhatsApp Campaign</Button>
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
                                        <TableHead>Template</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Sent</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {campaigns.data.map((camp: any) => (
                                        <TableRow key={camp.id}>
                                            <TableCell className="font-medium">{camp.name}</TableCell>
                                            <TableCell>{camp.template_name}</TableCell>
                                            <TableCell>
                                                <span className={`px-2 py-1 rounded text-xs ${camp.status === 'sent' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                    {camp.status}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right text-green-600">{camp.sent_count} / {camp.total_recipients}</TableCell>
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
