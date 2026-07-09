import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { Bot, Copy, Trash2, Wand2 } from 'lucide-react';
import React from 'react';

interface Product {
    id: number;
    name: string;
    price: string;
}

interface AdCopy {
    id: number;
    product: { id: number; name: string };
    tone: string;
    language: string;
    content: string;
    created_at: string;
}

interface AdCopyIndexProps {
    products: Product[];
    copies: { data: AdCopy[] };
}

export default function AdCopyIndex({ products, copies }: AdCopyIndexProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        product_id: '',
        audience: 'People looking for premium leather goods',
        tone: 'emotional',
        language: 'bn',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.ad-copies.generate'), {
            onSuccess: () => reset('audience'),
        });
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('Copied to clipboard!');
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this ad copy?')) {
            router.delete(route('admin.ad-copies.destroy', id));
        }
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/dashboard' },
                { title: 'AI Ad Copies', href: '/admin/ad-copies' },
            ]}
        >
            <Head title="AI Ad Copy Generator" />

            <div className="mx-auto max-w-7xl space-y-6 p-6">
                <div>
                    <h1 className="flex items-center gap-2 text-2xl font-black tracking-tight text-slate-950 uppercase">
                        <Bot className="h-6 w-6 text-indigo-600" />
                        AI Ad Copy Generator
                    </h1>
                    <p className="text-sm font-medium text-slate-500">Generate high-converting Facebook and Instagram ad copies using AI.</p>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-1">
                        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                            <h3 className="mb-4 text-sm font-black tracking-wider text-slate-900 uppercase">Generate New Copy</h3>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="mb-1 block text-xs font-bold tracking-wider text-slate-500 uppercase">Select Product</label>
                                    <select
                                        value={data.product_id}
                                        onChange={(e) => setData('product_id', e.target.value)}
                                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-slate-950 focus:ring-1 focus:ring-slate-950"
                                        required
                                    >
                                        <option value="">Select a product...</option>
                                        {products.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {p.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.product_id && <p className="mt-1 text-xs text-red-600">{errors.product_id}</p>}
                                </div>

                                <div>
                                    <label className="mb-1 block text-xs font-bold tracking-wider text-slate-500 uppercase">Target Audience</label>
                                    <Input
                                        value={data.audience}
                                        onChange={(e) => setData('audience', e.target.value)}
                                        placeholder="e.g. Young professionals"
                                        required
                                    />
                                    {errors.audience && <p className="mt-1 text-xs text-red-600">{errors.audience}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="mb-1 block text-xs font-bold tracking-wider text-slate-500 uppercase">Tone</label>
                                        <select
                                            value={data.tone}
                                            onChange={(e) => setData('tone', e.target.value)}
                                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-slate-950 focus:ring-1 focus:ring-slate-950"
                                        >
                                            <option value="emotional">Emotional</option>
                                            <option value="urgent">Urgent</option>
                                            <option value="casual">Casual</option>
                                            <option value="formal">Formal</option>
                                            <option value="humorous">Humorous</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-xs font-bold tracking-wider text-slate-500 uppercase">Language</label>
                                        <select
                                            value={data.language}
                                            onChange={(e) => setData('language', e.target.value)}
                                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-slate-950 focus:ring-1 focus:ring-slate-950"
                                        >
                                            <option value="bn">Bangla</option>
                                            <option value="en">English</option>
                                        </select>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full gap-2 bg-indigo-600 font-bold text-white hover:bg-indigo-700"
                                >
                                    <Wand2 className="h-4 w-4" />
                                    {processing ? 'Generating...' : 'Generate with AI'}
                                </Button>
                            </form>
                        </div>
                    </div>

                    <div className="space-y-4 lg:col-span-2">
                        <h3 className="text-sm font-black tracking-wider text-slate-900 uppercase">Generated History</h3>

                        {copies.data.length === 0 && (
                            <div className="rounded-xl border border-dashed border-slate-300 p-12 text-center text-slate-500">
                                No ad copies generated yet.
                            </div>
                        )}

                        {copies.data.map((copy) => (
                            <div key={copy.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                                <div className="mb-3 flex items-start justify-between">
                                    <div>
                                        <h4 className="font-bold text-slate-900">{copy.product.name}</h4>
                                        <div className="mt-1 flex gap-2">
                                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 uppercase">
                                                {copy.tone}
                                            </span>
                                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 uppercase">
                                                {copy.language}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" onClick={() => copyToClipboard(copy.content)}>
                                            <Copy className="mr-1 h-4 w-4" /> Copy
                                        </Button>
                                        <Button variant="ghost" size="sm" onClick={() => handleDelete(copy.id)}>
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="rounded-lg border border-slate-100 bg-slate-50 p-4 text-sm font-medium whitespace-pre-wrap text-slate-700">
                                    {copy.content}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
