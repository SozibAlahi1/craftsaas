import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PhoneCall, FileText, RefreshCw, ArrowLeft, Send } from 'lucide-react';

export default function LeadShow({ lead, users }: any) {
    const { data: statusData, setData: setStatusData, patch, processing: statusProcessing } = useForm({
        status: lead.status,
        assigned_to: lead.assigned_to || '',
    });

    const { data: activityData, setData: setActivityData, post, processing: activityProcessing, reset } = useForm({
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
        <AppLayout breadcrumbs={[{ title: 'Leads', href: '/admin/leads' }, { title: lead.name || lead.phone, href: `/admin/leads/${lead.id}` }]}>
            <Head title={`Lead - ${lead.name || lead.phone}`} />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-2">
                    <div className="flex items-center space-x-4">
                        <h1 className="text-2xl font-black tracking-tight text-slate-950 uppercase">{lead.name || 'Unnamed Lead'}</h1>
                        <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${statusColors[lead.status]}`}>
                            {lead.status}
                        </span>
                    </div>
                    <Link href={route('admin.leads.index')}>
                        <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-900">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Leads
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Left Column: Details & Edit */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                            <h2 className="mb-4 text-sm font-black tracking-widest text-slate-900 uppercase">Lead Details</h2>
                            
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between border-b border-slate-100 pb-2">
                                    <span className="text-slate-500 font-medium">Phone</span>
                                    <span className="font-bold text-slate-900">{lead.phone}</span>
                                </div>
                                <div className="flex justify-between border-b border-slate-100 pb-2">
                                    <span className="text-slate-500 font-medium">Email</span>
                                    <span className="font-medium text-slate-900">{lead.email || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between border-b border-slate-100 pb-2">
                                    <span className="text-slate-500 font-medium">Source</span>
                                    <span className="font-medium text-slate-900">{lead.source || 'Direct'}</span>
                                </div>
                                <div className="flex justify-between border-b border-slate-100 pb-2">
                                    <span className="text-slate-500 font-medium">Created</span>
                                    <span className="font-medium text-slate-900">{new Date(lead.created_at).toLocaleString()}</span>
                                </div>
                            </div>

                            <form onSubmit={handleStatusUpdate} className="mt-6 space-y-4">
                                <div>
                                    <label className="mb-1.5 block text-xs font-bold text-slate-700 uppercase">Status</label>
                                    <select 
                                        value={statusData.status} 
                                        onChange={e => setStatusData('status', e.target.value)}
                                        className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
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
                                        onChange={e => setStatusData('assigned_to', e.target.value)}
                                        className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
                                    >
                                        <option value="">Unassigned</option>
                                        {users.map((user: any) => (
                                            <option key={user.id} value={user.id}>{user.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <Button 
                                    type="submit" 
                                    disabled={statusProcessing}
                                    className="w-full bg-slate-900 hover:bg-slate-800"
                                >
                                    Update Lead
                                </Button>
                            </form>
                        </div>
                    </div>

                    {/* Right Column: Timeline */}
                    <div className="lg:col-span-2">
                        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                            <h2 className="mb-6 text-sm font-black tracking-widest text-slate-900 uppercase">Activity Timeline</h2>

                            <form onSubmit={handleActivitySubmit} className="mb-8 bg-slate-50 p-4 rounded-lg border border-slate-200">
                                <textarea 
                                    rows={3}
                                    placeholder="Write a note about this lead..."
                                    value={activityData.note}
                                    onChange={e => setActivityData('note', e.target.value)}
                                    className="flex w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 mb-3"
                                    required
                                />
                                <div className="flex justify-between items-center">
                                    <select 
                                        value={activityData.action} 
                                        onChange={e => setActivityData('action', e.target.value)}
                                        className="h-9 rounded-md border border-slate-200 bg-white px-3 py-1 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950"
                                    >
                                        <option value="Note Added">Note Added</option>
                                        <option value="Call Attempted">Call Attempted</option>
                                        <option value="Call Completed">Call Completed</option>
                                        <option value="Email Sent">Email Sent</option>
                                        <option value="Meeting Scheduled">Meeting Scheduled</option>
                                    </select>
                                    <Button 
                                        type="submit" 
                                        disabled={activityProcessing || !activityData.note}
                                    >
                                        <Send className="w-4 h-4 mr-2" /> Log Activity
                                    </Button>
                                </div>
                            </form>

                            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                                {lead.activities.length === 0 ? (
                                    <div className="text-center text-sm font-medium text-slate-500 py-8 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                                        No activities logged yet.
                                    </div>
                                ) : (
                                    lead.activities.map((activity: any) => (
                                        <div key={activity.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                            {/* Marker */}
                                            <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-white bg-slate-100 text-slate-500 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                                                {activity.action.includes('Call') ? <PhoneCall className="w-4 h-4" /> : activity.action.includes('Status') ? <RefreshCw className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                                            </div>
                                            {/* Card */}
                                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-lg border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="font-bold text-slate-900 text-sm">{activity.action}</div>
                                                    <div className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">{new Date(activity.created_at).toLocaleString()}</div>
                                                </div>
                                                <div className="text-sm text-slate-700 leading-relaxed font-medium">
                                                    {activity.note}
                                                </div>
                                                {activity.user && (
                                                    <div className="mt-3 text-[11px] text-slate-400 font-bold uppercase tracking-wider border-t border-slate-100 pt-2">
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
