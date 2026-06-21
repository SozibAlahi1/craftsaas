import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Target, Activity, CheckCircle, XCircle, Trash2, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ConfirmModal } from '@/components/ui/confirm-modal';

interface Pixel {
    id: number;
    name: string;
    pixel_id: string;
    access_token: string | null;
    is_active: boolean;
    test_event_code: string | null;
}

interface PixelIndexProps {
    pixels: Pixel[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Facebook Pixels', href: '/admin/pixels' },
];

export default function PixelIndex({ pixels }: PixelIndexProps) {
    const [isEditing, setIsEditing] = useState<number | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        pixel_id: '',
        access_token: '',
        is_active: true,
        test_event_code: '',
    });

    const handleEdit = (pixel: Pixel) => {
        setIsEditing(pixel.id);
        setData({
            name: pixel.name,
            pixel_id: pixel.pixel_id,
            access_token: pixel.access_token || '',
            is_active: pixel.is_active,
            test_event_code: pixel.test_event_code || '',
        });
        clearErrors();
    };

    const handleCancel = () => {
        setIsEditing(null);
        reset();
        clearErrors();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing) {
            put(route('admin.pixels.update', isEditing), {
                onSuccess: () => {
                    setIsEditing(null);
                    reset();
                },
            });
        } else {
            post(route('admin.pixels.store'), {
                onSuccess: () => reset(),
            });
        }
    };

    const handleToggleStatus = (id: number) => {
        router.post(route('admin.pixels.toggle', id), {}, { preserveScroll: true });
    };

    const executeDelete = () => {
        if (deleteId !== null) {
            router.delete(route('admin.pixels.destroy', deleteId), {
                onSuccess: () => setDeleteId(null),
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Facebook Pixels" />

            <div className="flex flex-col gap-6 p-6">
                <div>
                    <h1 className="flex items-center gap-2 text-2xl font-black uppercase tracking-tight text-slate-950">
                        <Target className="h-6 w-6 text-blue-600" />
                        Facebook Pixels & CAPI
                    </h1>
                    <p className="text-sm font-medium text-slate-500">Manage Facebook Pixels and Conversions API configurations.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-4">
                        {pixels.map((pixel) => (
                            <div key={pixel.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-lg font-black text-slate-900">{pixel.name}</h3>
                                            {pixel.is_active ? (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-700">
                                                    <CheckCircle className="h-3 w-3" /> Active
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-slate-500">
                                                    <XCircle className="h-3 w-3" /> Inactive
                                                </span>
                                            )}
                                        </div>
                                        <div className="mt-2 text-sm font-medium text-slate-600">
                                            Pixel ID: <span className="font-mono font-bold text-slate-900">{pixel.pixel_id}</span>
                                        </div>
                                        {pixel.access_token && (
                                            <div className="mt-1 flex items-center gap-1.5 text-xs font-bold text-blue-600">
                                                <Activity className="h-3.5 w-3.5" /> Conversions API Enabled
                                            </div>
                                        )}
                                        {pixel.test_event_code && (
                                            <div className="mt-1 text-xs font-bold text-amber-600">
                                                Test Mode: {pixel.test_event_code}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleToggleStatus(pixel.id)}
                                            className={pixel.is_active ? 'text-amber-600 hover:text-amber-700 hover:bg-amber-50' : 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50'}
                                        >
                                            {pixel.is_active ? 'Disable' : 'Enable'}
                                        </Button>
                                        <Button variant="ghost" size="sm" onClick={() => handleEdit(pixel)}>
                                            <Edit2 className="h-4 w-4 text-slate-400 hover:text-blue-600" />
                                        </Button>
                                        <Button variant="ghost" size="sm" onClick={() => setDeleteId(pixel.id)}>
                                            <Trash2 className="h-4 w-4 text-slate-400 hover:text-red-600" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {pixels.length === 0 && (
                            <div className="rounded-xl border border-dashed border-slate-300 p-12 text-center text-slate-500 font-medium">
                                No pixels configured yet. Add your first pixel to start tracking.
                            </div>
                        )}
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-5 h-fit">
                        <h3 className="mb-4 text-sm font-black uppercase tracking-wider text-slate-900">
                            {isEditing ? 'Edit Pixel' : 'Add New Pixel'}
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">Name</label>
                                <Input
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="e.g. Main Store Pixel"
                                    required
                                />
                                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">Pixel ID</label>
                                <Input
                                    value={data.pixel_id}
                                    onChange={(e) => setData('pixel_id', e.target.value)}
                                    placeholder="123456789012345"
                                    required
                                />
                                {errors.pixel_id && <p className="mt-1 text-xs text-red-600">{errors.pixel_id}</p>}
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">CAPI Access Token (Optional)</label>
                                <Input
                                    value={data.access_token}
                                    onChange={(e) => setData('access_token', e.target.value)}
                                    placeholder="EAAGm0P..."
                                    type="password"
                                />
                                <p className="mt-1 text-[10px] font-medium text-slate-400">Required for server-side event tracking.</p>
                                {errors.access_token && <p className="mt-1 text-xs text-red-600">{errors.access_token}</p>}
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">Test Event Code (Optional)</label>
                                <Input
                                    value={data.test_event_code}
                                    onChange={(e) => setData('test_event_code', e.target.value)}
                                    placeholder="TEST12345"
                                />
                                {errors.test_event_code && <p className="mt-1 text-xs text-red-600">{errors.test_event_code}</p>}
                            </div>

                            <div className="flex gap-2 pt-2">
                                <Button type="submit" disabled={processing} className="flex-1 font-black uppercase tracking-widest">
                                    {isEditing ? 'Update' : 'Save'} Pixel
                                </Button>
                                {isEditing && (
                                    <Button type="button" variant="outline" onClick={handleCancel}>
                                        Cancel
                                    </Button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <ConfirmModal
                isOpen={deleteId !== null}
                onClose={() => setDeleteId(null)}
                onConfirm={executeDelete}
                title="Delete Pixel"
                description="Are you sure you want to delete this pixel? Tracking will stop immediately."
                confirmText="Delete"
            />
        </AppLayout>
    );
}
