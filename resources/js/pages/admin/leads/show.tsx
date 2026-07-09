import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, FileText, PhoneCall, RefreshCw, Send } from 'lucide-react';

export default function LeadShow({ lead, users }: any) {
    const {
        data: statusData,
        setData: setStatusData,
        patch,
        processing: statusProcessing,
    } = useForm({
        status: lead.status,
        assigned_to: lead.assigned_to || '',
    });

    const {
        data: activityData,
        setData: setActivityData,
        post,
        processing: activityProcessing,
        reset,
    } = useForm({
        action: 'Note Added',
        note: '',
    });

    const handleStatusUpdate = (e: any) => {
        e.preventDefault();
        patch(route('admin.leads.update', lead.id));
    };

    const handleActivitySubmit = (e: any) => {
        e.preventDefault();
        post(route('admin.leads.activities.store', lead.id), {
            onSuccess: () => reset(),
        });
    };

    const statusColors: any = {
        new: 'bg-blue-100 text-blue-800',
        contacted: 'bg-yellow-100 text-yellow-800',
        interested: 'bg-purple-100 text-purple-800',
        converted: 'bg-green-100 text-green-800',
        lost: 'bg-red-100 text-red-800',
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Leads', href: '/admin/leads' },
                { title: lead.name || lead.phone, href: `/admin/leads/${lead.id}` },
            ]}
        >
            <Head title={`Lead - ${lead.name || lead.phone}`} />

            <div className="flex flex-col gap-6 p-6">
                <div className="mb-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center space-x-4">
                        <h1 className="text-2xl font-black tracking-tight text-slate-950 uppercase">{lead.name || 'Unnamed Lead'}</h1>
                        <span className={`rounded-full px-3 py-1 text-xs font-bold tracking-wider uppercase ${statusColors[lead.status]}`}>
                            {lead.status}
                        </span>
                    </div>
                    <Link href={route('admin.leads.index')}>
                        <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-900">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Leads
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Left Column: Details & Edit */}
                    <div className="space-y-6 lg:col-span-1">
                        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                            <h2 className="mb-4 text-sm font-black tracking-widest text-slate-900 uppercase">Lead Details</h2>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between border-b border-slate-100 pb-2">
                                    <span className="font-medium text-slate-500">Phone</span>
                                    <span className="font-bold text-slate-900">{lead.phone}</span>
                                </div>
                                <div className="flex justify-between border-b border-slate-100 pb-2">
                                    <span className="font-medium text-slate-500">Email</span>
                                    <span className="font-medium text-slate-900">{lead.email || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between border-b border-slate-100 pb-2">
                                    <span className="font-medium text-slate-500">Source</span>
                                    <span className="font-medium text-slate-900">{lead.source || 'Direct'}</span>
                                </div>
                                <div className="flex justify-between border-b border-slate-100 pb-2">
                                    <span className="font-medium text-slate-500">Created</span>
                                    <span className="font-medium text-slate-900">{new Date(lead.created_at).toLocaleString()}</span>
                                </div>
                            </div>

                            <form onSubmit={handleStatusUpdate} className="mt-6 space-y-4">
                                <div>
                                    <label className="mb-1.5 block text-xs font-bold text-slate-700 uppercase">Status</label>
                                    <select
                                        value={statusData.status}
                                        onChange={(e) => setStatusData('status', e.target.value)}
                                        className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 focus-visible:outline-none"
                                    >
                                        <option value="new">New</option>
                                        <option value="contacted">Contacted</option>
                                        <option value="interested">Interested</option>
                                        <option value="converted">Converted</option>
                                        <option value="lost">Lost</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-xs font-bold text-slate-700 uppercase">Assigned To</label>
                                    <select
                                        value={statusData.assigned_to}
                                        onChange={(e) => setStatusData('assigned_to', e.target.value)}
                                        className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 focus-visible:outline-none"
                                    >
                                        <option value="">Unassigned</option>
                                        {users.map((user: any) => (
                                            <option key={user.id} value={user.id}>
                                                {user.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <Button type="submit" disabled={statusProcessing} className="w-full bg-slate-900 hover:bg-slate-800">
                                    Update Lead
                                </Button>
                            </form>
                        </div>
                    </div>

                    {/* Right Column: Timeline */}
                    <div className="lg:col-span-2">
                        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                            <h2 className="mb-6 text-sm font-black tracking-widest text-slate-900 uppercase">Activity Timeline</h2>

                            <form onSubmit={handleActivitySubmit} className="mb-8 rounded-lg border border-slate-200 bg-slate-50 p-4">
                                <textarea
                                    rows={3}
                                    placeholder="Write a note about this lead..."
                                    value={activityData.note}
                                    onChange={(e) => setActivityData('note', e.target.value)}
                                    className="mb-3 flex w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 focus-visible:outline-none"
                                    required
                                />
                                <div className="flex items-center justify-between">
                                    <select
                                        value={activityData.action}
                                        onChange={(e) => setActivityData('action', e.target.value)}
                                        className="h-9 rounded-md border border-slate-200 bg-white px-3 py-1 text-sm ring-offset-white focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:outline-none"
                                    >
                                        <option value="Note Added">Note Added</option>
                                        <option value="Call Attempted">Call Attempted</option>
                                        <option value="Call Completed">Call Completed</option>
                                        <option value="Email Sent">Email Sent</option>
                                        <option value="Meeting Scheduled">Meeting Scheduled</option>
                                    </select>
                                    <Button type="submit" disabled={activityProcessing || !activityData.note}>
                                        <Send className="mr-2 h-4 w-4" /> Log Activity
                                    </Button>
                                </div>
                            </form>

                            <div className="relative space-y-6 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:-translate-x-px before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent md:before:mx-auto md:before:translate-x-0">
                                {lead.activities.length === 0 ? (
                                    <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 py-8 text-center text-sm font-medium text-slate-500">
                                        No activities logged yet.
                                    </div>
                                ) : (
                                    lead.activities.map((activity: any) => (
                                        <div
                                            key={activity.id}
                                            className="group is-active relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse"
                                        >
                                            {/* Marker */}
                                            <div className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-slate-500 shadow-sm md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                                {activity.action.includes('Call') ? (
                                                    <PhoneCall className="h-4 w-4" />
                                                ) : activity.action.includes('Status') ? (
                                                    <RefreshCw className="h-4 w-4" />
                                                ) : (
                                                    <FileText className="h-4 w-4" />
                                                )}
                                            </div>
                                            {/* Card */}
                                            <div className="w-[calc(100%-4rem)] rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md md:w-[calc(50%-2.5rem)]">
                                                <div className="mb-2 flex items-start justify-between">
                                                    <div className="text-sm font-bold text-slate-900">{activity.action}</div>
                                                    <div className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                                                        {new Date(activity.created_at).toLocaleString()}
                                                    </div>
                                                </div>
                                                <div className="text-sm leading-relaxed font-medium text-slate-700">{activity.note}</div>
                                                {activity.user && (
                                                    <div className="mt-3 border-t border-slate-100 pt-2 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                                                        Logged by {activity.user.name}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
