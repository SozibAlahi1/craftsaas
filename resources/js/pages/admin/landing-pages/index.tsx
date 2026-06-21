import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm, router, Link } from '@inertiajs/react';
import { LayoutGrid, Plus, Trash2, Edit3, Globe, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface LandingPage {
    id: number;
    title: string;
    slug: string;
    status: string;
    published_at: string | null;
    created_at: string;
}

interface LandingPageIndexProps {
    pages: { data: LandingPage[] };
}

export default function LandingPageIndex({ pages }: LandingPageIndexProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.landing-pages.store'), {
            onSuccess: () => reset(),
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this landing page?')) {
            router.delete(route('admin.landing-pages.destroy', id));
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }, { title: 'Landing Pages', href: '/admin/landing-pages' }]}>
            <Head title="Landing Pages" />

            <div className="p-6 w-full space-y-6">
                <div>
                    <h1 className="flex items-center gap-2 text-2xl font-black uppercase tracking-tight text-slate-950">
                        <LayoutGrid className="h-6 w-6 text-indigo-600" />
                        Landing Pages
                    </h1>
                    <p className="text-sm font-medium text-slate-500">Build and manage your sales funnels and product landing pages.</p>
                </div>

                <div className="space-y-6">
                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-end gap-4">
                            <div className="flex-1 w-full">
                                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">Create New Page</label>
                                <Input
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="Enter page title (e.g. Summer Sale 2026)"
                                    required
                                />
                                {errors.title && <p className="mt-1 text-xs text-red-600 absolute">{errors.title}</p>}
                            </div>

                            <Button type="submit" disabled={processing} className="w-full sm:w-auto gap-2 font-bold bg-indigo-600 hover:bg-indigo-700 text-white h-10">
                                <Plus className="h-4 w-4" />
                                {processing ? 'Creating...' : 'Create & Open Builder'}
                            </Button>
                        </form>
                    </div>

                    <div className="space-y-4">
                        <div className="grid gap-4">
                            {pages.data.length === 0 && (
                                <div className="rounded-xl border border-dashed border-slate-300 p-12 text-center text-slate-500">
                                    No landing pages created yet.
                                </div>
                            )}

                            {pages.data.map((page) => (
                                <div key={page.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm gap-4 hover:shadow-md transition-shadow">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-slate-900 text-lg">{page.title}</h4>
                                            {page.status === 'published' ? (
                                                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-[10px] font-bold uppercase text-emerald-700 flex items-center gap-1">
                                                    <Globe className="h-3 w-3" /> Published
                                                </span>
                                            ) : (
                                                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-[10px] font-bold uppercase text-amber-700 flex items-center gap-1">
                                                    <Clock className="h-3 w-3" /> Draft
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-sm text-slate-500 mt-1 flex items-center gap-3">
                                            <span>/lp/{page.slug}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 w-full sm:w-auto">
                                        {page.status === 'published' && (
                                            <Button variant="outline" size="sm" asChild className="flex-1 sm:flex-none">
                                                <a href={`/lp/${page.slug}`} target="_blank" rel="noopener noreferrer">
                                                    <Globe className="h-4 w-4 mr-1" /> View
                                                </a>
                                            </Button>
                                        )}
                                        <Button size="sm" asChild className="flex-1 sm:flex-none bg-indigo-600 hover:bg-indigo-700 text-white">
                                            <Link href={route('admin.landing-pages.builder', page.id)}>
                                                <Edit3 className="h-4 w-4 mr-1" /> Edit Builder
                                            </Link>
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(page.id)}>
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
