import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Clock, Edit3, Globe, LayoutGrid, Plus, Trash2 } from 'lucide-react';
import React from 'react';

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
        <AppLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/dashboard' },
                { title: 'Landing Pages', href: '/admin/landing-pages' },
            ]}
        >
            <Head title="Landing Pages" />

            <div className="w-full space-y-6 p-6">
                <div>
                    <h1 className="flex items-center gap-2 text-2xl font-black tracking-tight text-slate-950 uppercase">
                        <LayoutGrid className="h-6 w-6 text-indigo-600" />
                        Landing Pages
                    </h1>
                    <p className="text-sm font-medium text-slate-500">Build and manage your sales funnels and product landing pages.</p>
                </div>

                <div className="space-y-6">
                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <form onSubmit={handleSubmit} className="flex flex-col items-end gap-4 sm:flex-row">
                            <div className="w-full flex-1">
                                <label className="mb-1 block text-xs font-bold tracking-wider text-slate-500 uppercase">Create New Page</label>
                                <Input
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="Enter page title (e.g. Summer Sale 2026)"
                                    required
                                />
                                {errors.title && <p className="absolute mt-1 text-xs text-red-600">{errors.title}</p>}
                            </div>

                            <Button
                                type="submit"
                                disabled={processing}
                                className="h-10 w-full gap-2 bg-indigo-600 font-bold text-white hover:bg-indigo-700 sm:w-auto"
                            >
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
                                <div
                                    key={page.id}
                                    className="flex flex-col items-start justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-center"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h4 className="text-lg font-bold text-slate-900">{page.title}</h4>
                                            {page.status === 'published' ? (
                                                <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 uppercase">
                                                    <Globe className="h-3 w-3" /> Published
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700 uppercase">
                                                    <Clock className="h-3 w-3" /> Draft
                                                </span>
                                            )}
                                        </div>
                                        <div className="mt-1 flex items-center gap-3 text-sm text-slate-500">
                                            <span>/lp/{page.slug}</span>
                                        </div>
                                    </div>
                                    <div className="flex w-full items-center gap-2 sm:w-auto">
                                        {page.status === 'published' && (
                                            <Button variant="outline" size="sm" asChild className="flex-1 sm:flex-none">
                                                <a href={`/lp/${page.slug}`} target="_blank" rel="noopener noreferrer">
                                                    <Globe className="mr-1 h-4 w-4" /> View
                                                </a>
                                            </Button>
                                        )}
                                        <Button size="sm" asChild className="flex-1 bg-indigo-600 text-white hover:bg-indigo-700 sm:flex-none">
                                            <Link href={route('admin.landing-pages.builder', page.id)}>
                                                <Edit3 className="mr-1 h-4 w-4" /> Edit Builder
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
