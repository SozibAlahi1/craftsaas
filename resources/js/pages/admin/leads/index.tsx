import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Search, Upload, Users, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function LeadsIndex({ leads, filters }: any) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');

    // Debounce search
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (search !== (filters.search || '') || status !== (filters.status || 'all')) {
                router.get(
                    route('admin.leads.index'),
                    { search, status },
                    { preserveState: true, preserveScroll: true, replace: true }
                );
            }
        }, 300);
        return () => clearTimeout(timeout);
    }, [search, status]);

    const statusColors: any = {
        new: 'bg-blue-100 text-blue-800',
        contacted: 'bg-yellow-100 text-yellow-800',
        interested: 'bg-purple-100 text-purple-800',
        converted: 'bg-green-100 text-green-800',
        lost: 'bg-red-100 text-red-800',
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/admin/dashboard' }, { title: 'Leads', href: '/admin/leads' }]}>
            <Head title="Leads Management" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-slate-950 uppercase">Leads CRM</h1>
                        <p className="text-sm font-medium text-slate-500">Manage your potential customers and sales pipeline.</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-lg border border-slate-200 shadow-sm gap-4">
                        <div className="flex w-full max-w-md items-center gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <Input
                                    type="search"
                                    placeholder="Search name, phone, email..."
                                    className="pl-9"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <select
                                className="h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option value="all">All Statuses</option>
                                <option value="new">New</option>
                                <option value="contacted">Contacted</option>
                                <option value="interested">Interested</option>
                                <option value="converted">Converted</option>
                                <option value="lost">Lost</option>
                            </select>
                        </div>
                        <div className="flex items-center space-x-2 w-full sm:w-auto">
                            <input
                                type="file"
                                id="csv_upload"
                                className="hidden"
                                accept=".csv"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        const formData = new FormData();
                                        formData.append('csv_file', e.target.files[0]);
                                        router.post(route('admin.leads.import'), formData, {
                                            forceFormData: true,
                                            onSuccess: () => alert('Leads imported successfully!'),
                                        });
                                    }
                                }}
                            />
                            <Button 
                                onClick={() => document.getElementById('csv_upload')?.click()}
                                variant="outline"
                            >
                                <Upload className="mr-2 h-4 w-4" />
                                Import CSV
                            </Button>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                        {leads.data.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-12 text-center">
                                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-50">
                                    <Users className="h-8 w-8 text-slate-300" />
                                </div>
                                <h3 className="mb-1 text-lg font-black tracking-tight text-slate-900 uppercase">No Leads Found</h3>
                                <p className="text-sm text-slate-500">There are no leads matching your filters.</p>
                            </div>
                        ) : (
                            <table className="w-full text-left text-sm whitespace-nowrap">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-4 py-3 font-bold text-slate-600">Lead</th>
                                        <th className="px-4 py-3 font-bold text-slate-600">Contact</th>
                                        <th className="px-4 py-3 font-bold text-slate-600">Source</th>
                                        <th className="px-4 py-3 font-bold text-slate-600">Status</th>
                                        <th className="px-4 py-3 text-right font-bold text-slate-600">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {leads.data.map((lead: any) => (
                                        <tr key={lead.id} className="hover:bg-slate-50">
                                            <td className="px-4 py-3">
                                                <div className="font-medium text-slate-900">{lead.name || 'Unknown'}</div>
                                                <div className="text-xs text-slate-500">Added {new Date(lead.created_at).toLocaleDateString()}</div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="font-medium text-slate-900">{lead.phone}</div>
                                                {lead.email && <div className="text-xs text-slate-500">{lead.email}</div>}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-slate-600 bg-slate-100 px-2 py-1 rounded text-xs font-medium">
                                                    {lead.source || 'Direct'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2.5 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${statusColors[lead.status] || 'bg-slate-100 text-slate-800'}`}>
                                                    {lead.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <Link href={route('admin.leads.show', lead.id)}>
                                                    <Button variant="ghost" size="sm">
                                                        View
                                                    </Button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                    
                    <div className="flex justify-between items-center text-sm text-slate-600">
                        <div>
                            Showing {leads.from || 0} to {leads.to || 0} of {leads.total} entries
                        </div>
                        <div className="flex gap-2">
                            {leads.links.map((link: any, idx: number) => (
                                <Link
                                    key={idx}
                                    href={link.url || '#'}
                                    className={`px-3 py-1 rounded-md ${link.active ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 hover:bg-slate-50'} ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
