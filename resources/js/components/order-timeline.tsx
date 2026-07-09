import { Activity, Clock, MessageSquare, Package, User } from 'lucide-react';

interface User {
    id: number;
    name: string;
}

interface Activity {
    id: number;
    action: string;
    old_value: any;
    new_value: any;
    created_at: string;
    user?: User;
}

interface StatusLog {
    id: number;
    status: string;
    created_at: string;
    changer?: User;
}

interface Note {
    id: number;
    note: string;
    type: string;
    created_at: string;
    user?: User;
}

interface OrderTimelineProps {
    activities: Activity[];
    statusLogs: StatusLog[];
    notes: Note[];
}

export function OrderTimeline({ activities, statusLogs, notes }: OrderTimelineProps) {
    // Combine all events into a single array and sort by created_at descending
    const events: any[] = [
        ...activities.map((a) => ({ type: 'activity', date: new Date(a.created_at), data: a })),
        ...statusLogs.map((s) => ({ type: 'status_log', date: new Date(s.created_at), data: s })),
        ...notes.map((n) => ({ type: 'note', date: new Date(n.created_at), data: n })),
    ].sort((a, b) => b.date.getTime() - a.date.getTime());

    return (
        <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-4">
                <Clock className="h-5 w-5 text-slate-400" />
                <h2 className="text-lg font-black tracking-widest text-slate-900 uppercase">Order Timeline</h2>
            </div>

            <div className="space-y-6">
                {events.length === 0 ? (
                    <p className="text-sm text-slate-500">No activity recorded yet.</p>
                ) : (
                    <div className="relative space-y-6 border-l-2 border-slate-100 pl-6">
                        {events.map((event, index) => {
                            const isActivity = event.type === 'activity';
                            const isStatus = event.type === 'status_log';
                            const isNote = event.type === 'note';

                            return (
                                <div key={index} className="relative">
                                    <div
                                        className={`absolute -left-[35px] flex h-7 w-7 items-center justify-center rounded-full border-2 border-white ${isActivity ? 'bg-blue-100 text-blue-600' : isStatus ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}
                                    >
                                        {isActivity && <Activity className="h-3 w-3" />}
                                        {isStatus && <Package className="h-3 w-3" />}
                                        {isNote && <MessageSquare className="h-3 w-3" />}
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold text-slate-900">
                                                {isActivity && event.data.action}
                                                {isStatus && `Status changed to ${event.data.status.replace(/_/g, ' ').toUpperCase()}`}
                                                {isNote && `Added a note (${event.data.type})`}
                                            </span>
                                            <span className="text-xs text-slate-400">{event.date.toLocaleString()}</span>
                                        </div>

                                        <div className="text-sm text-slate-600">
                                            {isActivity && (
                                                <span className="text-xs text-slate-500">
                                                    {event.data.old_value ? `From: ${JSON.stringify(event.data.old_value)} ` : ''}
                                                    {event.data.new_value ? `To: ${JSON.stringify(event.data.new_value)}` : ''}
                                                </span>
                                            )}
                                            {isNote && (
                                                <div className="mt-1 rounded-md bg-slate-50 p-3 text-sm text-slate-700">{event.data.note}</div>
                                            )}
                                        </div>

                                        <div className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                                            <User className="h-3 w-3" />
                                            {event.data.user?.name || event.data.changer?.name || 'System'}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}
