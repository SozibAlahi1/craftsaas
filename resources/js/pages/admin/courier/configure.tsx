import { Head, useForm } from '@inertiajs/react';
import { Truck, Key, RefreshCw, AlertCircle, Wallet, CheckCircle2, XCircle } from 'lucide-react';
import { FormEventHandler } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CourierConfigureProps {
    apiKey: string;
    secretKey: string;
    bdCourierApiKey: string;
    balance: number | null;
    balanceError: string | null;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Courier Configure', href: '/admin/courier-configure' },
];

export default function CourierConfigure({ apiKey, secretKey, bdCourierApiKey, balance, balanceError }: CourierConfigureProps) {
    const { data, setData, post, processing, errors } = useForm({
        courier_api_key: apiKey,
        courier_secret_key: secretKey,
        bd_courier_api_key: bdCourierApiKey,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.courier.update'));
    };

    const isConfigured = apiKey && secretKey;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Courier Configuration" />

            <div className="mx-auto max-w-5xl p-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-black tracking-tight text-slate-950 uppercase">
                        Courier Configuration
                    </h1>
                    <p className="mt-1 text-sm font-medium text-slate-500">
                        Configure Steadfast for dispatching orders and store your BD Courier bearer token for the Ford Checker.
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                    <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white">
                                <Key className="h-5 w-5" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">API Credentials</h2>
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    Secure Connection Keys
                                </p>
                            </div>
                        </div>

                        <form onSubmit={submit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="courier_api_key" className="text-sm font-bold text-slate-700">
                                    Steadfast API Key
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="courier_api_key"
                                        type="password"
                                        required
                                        value={data.courier_api_key}
                                        onChange={(e) => setData('courier_api_key', e.target.value)}
                                        className="h-11 rounded-xl border border-slate-200 pl-4 pr-10 focus:border-slate-400 focus:ring-0 focus:outline-none"
                                        placeholder="Enter your Steadfast API Key"
                                    />
                                </div>
                                {errors.courier_api_key && (
                                    <p className="text-xs font-bold text-red-600 mt-1 flex items-center gap-1">
                                        <AlertCircle className="h-3.5 w-3.5" />
                                        {errors.courier_api_key}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="courier_secret_key" className="text-sm font-bold text-slate-700">
                                    Steadfast Secret Key
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="courier_secret_key"
                                        type="password"
                                        required
                                        value={data.courier_secret_key}
                                        onChange={(e) => setData('courier_secret_key', e.target.value)}
                                        className="h-11 rounded-xl border border-slate-200 pl-4 pr-10 focus:border-slate-400 focus:ring-0 focus:outline-none"
                                        placeholder="Enter your Steadfast Secret Key"
                                    />
                                </div>
                                {errors.courier_secret_key && (
                                    <p className="text-xs font-bold text-red-600 mt-1 flex items-center gap-1">
                                        <AlertCircle className="h-3.5 w-3.5" />
                                        {errors.courier_secret_key}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bd_courier_api_key" className="text-sm font-bold text-slate-700">
                                    BD Courier API Key
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="bd_courier_api_key"
                                        type="password"
                                        value={data.bd_courier_api_key}
                                        onChange={(e) => setData('bd_courier_api_key', e.target.value)}
                                        className="h-11 rounded-xl border border-slate-200 pl-4 pr-10 focus:border-slate-400 focus:ring-0 focus:outline-none"
                                        placeholder="Enter your BD Courier bearer token"
                                    />
                                </div>
                                {errors.bd_courier_api_key && (
                                    <p className="text-xs font-bold text-red-600 mt-1 flex items-center gap-1">
                                        <AlertCircle className="h-3.5 w-3.5" />
                                        {errors.bd_courier_api_key}
                                    </p>
                                )}
                                <p className="text-xs font-medium text-slate-500">
                                    This key is used by the Ford Checker to fetch delivery performance for each customer phone number.
                                </p>
                            </div>

                            <div className="flex items-center justify-between border-t border-slate-100 pt-6">
                                <p className="text-xs font-medium text-slate-400">
                                    Keys are securely stored in your local application database.
                                </p>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-xl h-11 px-6 font-bold bg-slate-950 text-white hover:bg-slate-800 transition-all active:scale-[0.98]"
                                >
                                    {processing && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
                                    Save Configuration
                                </Button>
                            </div>
                        </form>
                    </div>

                    <div className="space-y-6">
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm overflow-hidden relative group">
                            <div className="absolute top-0 right-0 p-3 text-slate-100 group-hover:text-slate-200 transition-colors pointer-events-none">
                                <Truck className="h-24 w-24 -rotate-12 transform translate-x-6 translate-y-2 opacity-10" />
                            </div>

                            <div className="flex items-center justify-between mb-6">
                                <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                                    Steadfast Status
                                </span>

                                {isConfigured ? (
                                    balanceError ? (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-black text-red-600 uppercase tracking-tighter">
                                            <XCircle className="h-3 w-3" /> Error
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-black text-emerald-600 uppercase tracking-tighter animate-pulse">
                                            <CheckCircle2 className="h-3 w-3" /> Connected
                                        </span>
                                    )
                                ) : (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-black text-amber-600 uppercase tracking-tighter">
                                        <AlertCircle className="h-3 w-3" /> Unconfigured
                                    </span>
                                )}
                            </div>

                            {isConfigured ? (
                                balanceError ? (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-red-600">
                                            <AlertCircle className="h-5 w-5 flex-shrink-0" />
                                            <span className="text-sm font-bold">Failed to connect</span>
                                        </div>
                                        <p className="text-xs text-slate-500 font-semibold max-w-[200px]">
                                            {balanceError}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1 mb-1">
                                                <Wallet className="h-3.5 w-3.5 text-slate-400" />
                                                Available Balance
                                            </p>
                                            <div className="flex items-baseline font-black tracking-tight">
                                                <span className="text-lg text-slate-900 mr-1">৳</span>
                                                <span className="text-4xl text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-500">
                                                    {balance?.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                                            Integration is active. You can now dispatch orders directly from the management console.
                                        </p>
                                    </div>
                                )
                            ) : (
                                <div className="py-4 space-y-3">
                                    <div className="h-8 bg-slate-100 rounded-lg animate-pulse w-3/4"></div>
                                    <p className="text-xs text-slate-400 font-semibold">
                                        Please enter your credentials to test connection and view your active courier account balance.
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="rounded-2xl border border-amber-200/60 bg-amber-50/50 p-5 shadow-sm space-y-3">
                            <h3 className="text-sm font-bold text-amber-900 flex items-center gap-2">
                                <AlertCircle className="h-4.5 w-4.5 text-amber-700" />
                                Where do I get my API keys?
                            </h3>
                            <p className="text-xs font-semibold text-amber-800 leading-relaxed">
                                Log in to your <strong>Steadfast Courier Portal</strong> account for your dispatch credentials, and paste your <strong>BD Courier bearer token</strong> here for the Ford Checker.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
