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

const fieldLabels: Record<string, string> = {
    full_name: 'Customer Name',
    phone: 'Phone Number',
    address: 'Address',
    payment_method: 'Payment Method',
    status: 'Status',
    shipping: 'Shipping Fee',
    subtotal: 'Subtotal',
    total: 'Total Amount',
};

const safeJsonParse = (str: any) => {
    if (typeof str !== 'string') return str;
    try {
        return JSON.parse(str);
    } catch {
        return null;
    }
};

const formatValue = (key: string, val: any) => {
    if (val === null || val === undefined) return 'N/A';
    if (['shipping', 'subtotal', 'total'].includes(key)) {
        return `৳${Number(val).toLocaleString()}`;
    }
    if (typeof val === 'string') {
        return val.replace(/_/g, ' ');
    }
    return String(val);
};

const renderActivityDetails = (oldVal: any, newVal: any) => {
    const oldObj = safeJsonParse(oldVal);
    const newObj = safeJsonParse(newVal);

    if (!oldObj || !newObj || typeof oldObj !== 'object' || typeof newObj !== 'object') {
        if (typeof newVal === 'string') {
            return <p className="mt-1 text-xs font-semibold text-slate-700">{newVal}</p>;
        }
        return null;
    }

    const addedItems: any[] = newObj.added_items || [];
    const removedItems: any[] = newObj.removed_items || [];
    const updatedItems: any[] = newObj.updated_items || [];

    const ignoreKeys = ['added_items', 'removed_items', 'updated_items', 'items_summary'];
    const changedKeys = Object.keys(newObj).filter(
        (key) => !ignoreKeys.includes(key) && oldObj[key] !== undefined && oldObj[key] !== newObj[key]
    );

    const hasChanges = changedKeys.length > 0 || addedItems.length > 0 || removedItems.length > 0 || updatedItems.length > 0;

    if (!hasChanges) {
        return <p className="mt-1 text-xs font-medium text-slate-500">Order saved with no changes.</p>;
    }

    return (
        <div className="mt-2 space-y-2 rounded-lg border border-slate-200 bg-slate-50/80 p-3.5 text-xs">
            {/* Added Items */}
            {addedItems.map((item, idx) => (
                <div key={`added-${idx}`} className="flex items-center gap-1.5 font-medium text-emerald-800">
                    <span className="font-bold text-emerald-600">➕ Added Product:</span>
                    <span className="font-bold text-slate-900">{item.name}</span>
                    <span className="text-slate-500">(Qty: {item.quantity}, ৳{Number(item.price).toLocaleString()})</span>
                </div>
            ))}

            {/* Removed Items */}
            {removedItems.map((item, idx) => (
                <div key={`removed-${idx}`} className="flex items-center gap-1.5 font-medium text-red-800">
                    <span className="font-bold text-red-600">➖ Removed Product:</span>
                    <span className="font-bold text-slate-900 line-through">{item.name}</span>
                </div>
            ))}

            {/* Updated Items */}
            {updatedItems.map((item, idx) => (
                <div key={`updated-${idx}`} className="flex flex-wrap items-center gap-1.5 font-medium text-slate-700">
                    <span className="font-bold text-blue-600">✏️ Updated Item ({item.name}):</span>
                    {item.old_quantity !== item.new_quantity && (
                        <span>
                            Qty: <span className="line-through text-slate-400">{item.old_quantity}</span> →{' '}
                            <span className="font-bold text-slate-900">{item.new_quantity}</span>
                        </span>
                    )}
                    {item.old_price !== item.new_price && (
                        <span>
                            Price: <span className="line-through text-slate-400">৳{Number(item.old_price).toLocaleString()}</span> →{' '}
                            <span className="font-bold text-slate-900">৳{Number(item.new_price).toLocaleString()}</span>
                        </span>
                    )}
                </div>
            ))}

            {/* Field Changes */}
            {changedKeys.map((key) => (
                <div key={key} className="flex flex-wrap items-center gap-1.5 font-medium text-slate-700">
                    <span className="font-bold text-slate-900">{fieldLabels[key] || key.replace(/_/g, ' ')}:</span>
                    <span className="line-through text-slate-400">{formatValue(key, oldObj[key])}</span>
                    <span className="text-slate-400">→</span>
                    <span className="font-bold text-emerald-700">{formatValue(key, newObj[key])}</span>
                </div>
            ))}
        </div>
    );
};

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
                                            {isActivity && renderActivityDetails(event.data.old_value, event.data.new_value)}
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
