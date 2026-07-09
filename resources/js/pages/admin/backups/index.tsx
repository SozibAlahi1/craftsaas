import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Download, HardDrive } from 'lucide-react';

export default function BackupsIndex({ backups }: { backups: any }) {
    const { post, processing } = useForm();

    const triggerBackup = () => {
        post('/admin/backups');
    };

    const formatBytes = (bytes: number, decimals = 2) => {
        if (!+bytes) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Automation', href: '/admin/backups' },
                { title: 'Database Backups', href: '/admin/backups' },
            ]}
        >
            <Head title="Database Backups" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Database Backups</h2>
                        <p className="text-muted-foreground">Manage your Google Drive automated database backups.</p>
                    </div>
                    <Button onClick={triggerBackup} disabled={processing}>
                        <HardDrive className="mr-2 h-4 w-4" /> Trigger Manual Backup
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Backup History</CardTitle>
                        <CardDescription>Automated backups run daily at 3:00 AM.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Filename</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Size</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {backups.data.map((backup: any) => (
                                    <TableRow key={backup.id}>
                                        <TableCell className="font-medium">{backup.filename}</TableCell>
                                        <TableCell>{new Date(backup.created_at).toLocaleString()}</TableCell>
                                        <TableCell className="capitalize">{backup.type}</TableCell>
                                        <TableCell>{backup.size_bytes ? formatBytes(backup.size_bytes) : '-'}</TableCell>
                                        <TableCell>
                                            <span
                                                className={`rounded px-2 py-1 text-xs ${backup.status === 'success' ? 'bg-green-100 text-green-800' : backup.status === 'pending' || backup.status === 'running' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}
                                            >
                                                {backup.status}
                                            </span>
                                            {backup.error && (
                                                <p className="mt-1 max-w-xs truncate text-xs text-red-500" title={backup.error}>
                                                    {backup.error}
                                                </p>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {backup.status === 'success' && (
                                                <a href={`/admin/backups/${backup.id}/download`}>
                                                    <Button variant="outline" size="sm">
                                                        <Download className="mr-2 h-4 w-4" /> Download
                                                    </Button>
                                                </a>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {backups.data.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-muted-foreground py-8 text-center">
                                            No backups found yet.
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
