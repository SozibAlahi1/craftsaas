import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    Activity,
    AlertCircle,
    Bot,
    CheckCircle,
    CheckCircle2,
    Globe,
    Key,
    LayoutGrid,
    Link2,
    Megaphone,
    Menu,
    Palette,
    PhoneCall,
    Plus,
    RefreshCw,
    Save,
    Settings,
    ShoppingCart,
    Target,
    Trash2,
    Truck,
    Wallet,
    XCircle,
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import React, { useState } from 'react';

interface LinkItem {
    label: string;
    url: string;
}

interface SettingsData {
    site_name: string;
    shipping_cost: string;
    footer_description: string;
    footer_facebook_url: string;
    footer_youtube_url: string;
    footer_phone: string;
    footer_email: string;
    footer_address: string;
    footer_copyright: string;
    footer_account_links: LinkItem[];
    footer_info_links: LinkItem[];
    site_theme: string;
    site_logo?: File | null;
    site_logo_url?: string;
    site_favicon?: File | null;
    site_favicon_url?: string;
    enable_ai_voice_confirmation: boolean;
    gtm_container_id?: string;
    marketing_purchase_trigger?: string;
}

interface Theme {
    slug: string;
    name: string;
    version: string;
    author: string;
    description: string;
    active: boolean;
}

interface AutomationSettings {
    sms_provider: string;
    mim_sms_api_key: string;
    mim_sms_sender_id: string;
    banglalink_sms_username: string;
    banglalink_sms_password: string;
    banglalink_sms_shortcode: string;
    whatsapp_token: string;
    whatsapp_phone_id: string;
    whatsapp_verify_token: string;
    google_drive_folder_id: string;
}

interface SiteSettingsProps {
    settings: SettingsData;
    courierApiKey: string;
    courierSecretKey: string;
    courierBalance: number | null;
    courierBalanceError: string | null;
    bdCourierApiKey: string;
    availableThemes: Theme[];
    automationSettings: AutomationSettings;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Site Settings', href: '/admin/settings' },
];

export default function SiteSettings({
    settings,
    courierApiKey,
    courierSecretKey,
    courierBalance,
    courierBalanceError,
    bdCourierApiKey,
    availableThemes,
    automationSettings,
}: SiteSettingsProps) {
    const [activeTab, setActiveTab] = useState<
        'general' | 'footer' | 'contact' | 'shop' | 'courier' | 'fraud' | 'themes' | 'content' | 'automation' | 'ads'
    >('general');
    const [activatingTheme, setActivatingTheme] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [logoPreview, setLogoPreview] = useState<string>(settings.site_logo_url || '');
    const [faviconPreview, setFaviconPreview] = useState<string>(settings.site_favicon_url || '');

    const { data, setData, post, processing, errors } = useForm<SettingsData>({
        site_name: settings.site_name || 'Believers',
        shipping_cost: settings.shipping_cost || '60',
        footer_description: settings.footer_description || '',
        footer_facebook_url: settings.footer_facebook_url || '',
        footer_youtube_url: settings.footer_youtube_url || '',
        footer_phone: settings.footer_phone || '',
        footer_email: settings.footer_email || '',
        footer_address: settings.footer_address || '',
        footer_copyright: settings.footer_copyright || '',
        footer_account_links: settings.footer_account_links || [],
        footer_info_links: settings.footer_info_links || [],
        site_theme: settings.site_theme || 'classic',
        site_logo: null,
        site_logo_url: settings.site_logo_url || '',
        site_favicon: null,
        site_favicon_url: settings.site_favicon_url || '',
        enable_ai_voice_confirmation: settings.enable_ai_voice_confirmation || false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.settings.update'), {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                setSuccessMessage('Site configurations updated successfully!');
                setTimeout(() => setSuccessMessage(null), 4000);
            },
        });
    };

    // Link dynamic list operations
    const addLink = (column: 'footer_account_links' | 'footer_info_links') => {
        setData(column, [...data[column], { label: '', url: '' }]);
    };

    const removeLink = (column: 'footer_account_links' | 'footer_info_links', index: number) => {
        const updated = [...data[column]];
        updated.splice(index, 1);
        setData(column, updated);
    };

    const updateLink = (column: 'footer_account_links' | 'footer_info_links', index: number, field: 'label' | 'url', value: string) => {
        const updated = [...data[column]];
        updated[index] = { ...updated[index], [field]: value };
        setData(column, updated);
    };

    // Courier form (separate from main settings form)
    const courierForm = useForm({
        courier_api_key: courierApiKey,
        courier_secret_key: courierSecretKey,
    });

    const handleCourierSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        courierForm.post(route('admin.courier.update'), {
            preserveScroll: true,
            onSuccess: () => {
                setSuccessMessage('Steadfast Courier configuration updated successfully!');
                setTimeout(() => setSuccessMessage(null), 4000);
            },
        });
    };

    const isCourierConfigured = courierApiKey && courierSecretKey;
    const isFraudConfigured = Boolean(bdCourierApiKey);

    // Fraud Checking form
    const fraudForm = useForm({
        courier_api_key: courierApiKey,
        courier_secret_key: courierSecretKey,
        bd_courier_api_key: bdCourierApiKey,
    });

    const handleFraudSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        fraudForm.post(route('admin.courier.update'), {
            preserveScroll: true,
            onSuccess: () => {
                setSuccessMessage('BD Courier API key updated successfully!');
                setTimeout(() => setSuccessMessage(null), 4000);
            },
        });
    };

    const automationForm = useForm({
        ...automationSettings,
    });

    const handleAutomationSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        automationForm.post('/admin/settings/automation', {
            preserveScroll: true,
            onSuccess: () => {
                setSuccessMessage('Automation configurations updated successfully!');
                setTimeout(() => setSuccessMessage(null), 4000);
            },
        });
    };

    const gtmForm = useForm({
        gtm_container_id: settings.gtm_container_id || '',
    });

    const handleGtmSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        gtmForm.post(route('admin.settings.gtm.update'), {
            preserveScroll: true,
            onSuccess: () => {
                setSuccessMessage('Google Tag Manager settings updated successfully!');
                setTimeout(() => setSuccessMessage(null), 4000);
            },
        });
    };

    const marketingForm = useForm({
        marketing_purchase_trigger: settings.marketing_purchase_trigger || 'confirmed',
    });

    const handleMarketingSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        marketingForm.post(route('admin.settings.marketing.update'), {
            preserveScroll: true,
            onSuccess: () => {
                setSuccessMessage('Marketing trigger settings updated successfully!');
                setTimeout(() => setSuccessMessage(null), 4000);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Site Configurations & Settings" />

            <div className="flex w-full max-w-full flex-col gap-6 p-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="flex items-center gap-2 text-2xl font-black tracking-tight text-slate-950 uppercase">
                            <Settings className="animate-spin-slow h-6 w-6 text-orange-600" />
                            Site & Store Settings
                        </h1>
                        <p className="text-sm font-medium text-slate-500">
                            Configure global parameters, brand identities, custom links, contact hotlines, and dynamic storefront settings.
                        </p>
                    </div>
                </div>

                {successMessage && (
                    <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-green-800 shadow-sm transition-all duration-300">
                        <CheckCircle className="h-5 w-5 shrink-0 text-green-600" />
                        <span className="text-sm font-bold">{successMessage}</span>
                    </div>
                )}

                <div className="flex w-full flex-col items-start gap-6">
                    {/* Reorganized Navigation Tabs Grid */}
                    <div className="grid w-full shrink-0 grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8">
                        <button
                            type="button"
                            onClick={() => setActiveTab('general')}
                            className={`flex flex-col items-center justify-center gap-3 rounded-2xl border-2 p-4 text-center text-xs font-black tracking-wider uppercase transition-all ${
                                activeTab === 'general'
                                    ? 'border-slate-950 bg-slate-950 text-white shadow-md'
                                    : 'border-slate-100 bg-white text-slate-600 hover:border-slate-300 hover:shadow-sm'
                            }`}
                        >
                            <Globe className={`h-6 w-6 ${activeTab === 'general' ? 'text-white' : 'text-slate-400'}`} />
                            <span>
                                General
                                <br />
                                Identity
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab('footer')}
                            className={`flex flex-col items-center justify-center gap-3 rounded-2xl border-2 p-4 text-center text-xs font-black tracking-wider uppercase transition-all ${
                                activeTab === 'footer'
                                    ? 'border-slate-950 bg-slate-950 text-white shadow-md'
                                    : 'border-slate-100 bg-white text-slate-600 hover:border-slate-300 hover:shadow-sm'
                            }`}
                        >
                            <Link2 className={`h-6 w-6 ${activeTab === 'footer' ? 'text-white' : 'text-slate-400'}`} />
                            <span>
                                Footer
                                <br />
                                Links
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab('contact')}
                            className={`flex flex-col items-center justify-center gap-3 rounded-2xl border-2 p-4 text-center text-xs font-black tracking-wider uppercase transition-all ${
                                activeTab === 'contact'
                                    ? 'border-slate-950 bg-slate-950 text-white shadow-md'
                                    : 'border-slate-100 bg-white text-slate-600 hover:border-slate-300 hover:shadow-sm'
                            }`}
                        >
                            <PhoneCall className={`h-6 w-6 ${activeTab === 'contact' ? 'text-white' : 'text-slate-400'}`} />
                            <span>
                                Contacts
                                <br />& Socials
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab('shop')}
                            className={`flex flex-col items-center justify-center gap-3 rounded-2xl border-2 p-4 text-center text-xs font-black tracking-wider uppercase transition-all ${
                                activeTab === 'shop'
                                    ? 'border-slate-950 bg-slate-950 text-white shadow-md'
                                    : 'border-slate-100 bg-white text-slate-600 hover:border-slate-300 hover:shadow-sm'
                            }`}
                        >
                            <ShoppingCart className={`h-6 w-6 ${activeTab === 'shop' ? 'text-white' : 'text-slate-400'}`} />
                            <span>
                                Store
                                <br />& Shipping
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab('courier')}
                            className={`flex flex-col items-center justify-center gap-3 rounded-2xl border-2 p-4 text-center text-xs font-black tracking-wider uppercase transition-all ${
                                activeTab === 'courier'
                                    ? 'border-slate-950 bg-slate-950 text-white shadow-md'
                                    : 'border-slate-100 bg-white text-slate-600 hover:border-slate-300 hover:shadow-sm'
                            }`}
                        >
                            <Truck className={`h-6 w-6 ${activeTab === 'courier' ? 'text-white' : 'text-slate-400'}`} />
                            <span>
                                Courier
                                <br />
                                Integration
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab('fraud')}
                            className={`flex flex-col items-center justify-center gap-3 rounded-2xl border-2 p-4 text-center text-xs font-black tracking-wider uppercase transition-all ${
                                activeTab === 'fraud'
                                    ? 'border-slate-950 bg-slate-950 text-white shadow-md'
                                    : 'border-slate-100 bg-white text-slate-600 hover:border-slate-300 hover:shadow-sm'
                            }`}
                        >
                            <Key className={`h-6 w-6 ${activeTab === 'fraud' ? 'text-white' : 'text-slate-400'}`} />
                            <span>
                                Fraud
                                <br />
                                Checking
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab('themes')}
                            className={`flex flex-col items-center justify-center gap-3 rounded-2xl border-2 p-4 text-center text-xs font-black tracking-wider uppercase transition-all ${
                                activeTab === 'themes'
                                    ? 'border-slate-950 bg-slate-950 text-white shadow-md'
                                    : 'border-slate-100 bg-white text-slate-600 hover:border-slate-300 hover:shadow-sm'
                            }`}
                        >
                            <Palette className={`h-6 w-6 ${activeTab === 'themes' ? 'text-white' : 'text-slate-400'}`} />
                            <span>
                                Themes
                                <br />
                                Manager
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab('content')}
                            className={`flex flex-col items-center justify-center gap-3 rounded-2xl border-2 p-4 text-center text-xs font-black tracking-wider uppercase transition-all ${
                                activeTab === 'content'
                                    ? 'border-slate-950 bg-slate-950 text-white shadow-md'
                                    : 'border-slate-100 bg-white text-slate-600 hover:border-slate-300 hover:shadow-sm'
                            }`}
                        >
                            <LayoutGrid className={`h-6 w-6 ${activeTab === 'content' ? 'text-white' : 'text-slate-400'}`} />
                            <span>
                                Store
                                <br />
                                Content
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab('automation')}
                            className={`flex flex-col items-center justify-center gap-3 rounded-2xl border-2 p-4 text-center text-xs font-black tracking-wider uppercase transition-all ${
                                activeTab === 'automation'
                                    ? 'border-slate-950 bg-slate-950 text-white shadow-md'
                                    : 'border-slate-100 bg-white text-slate-600 hover:border-slate-300 hover:shadow-sm'
                            }`}
                        >
                            <Bot className={`h-6 w-6 ${activeTab === 'automation' ? 'text-white' : 'text-slate-400'}`} />
                            <span>
                                API &<br />
                                Automation
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab('ads')}
                            className={`flex flex-col items-center justify-center gap-3 rounded-2xl border-2 p-4 text-center text-xs font-black tracking-wider uppercase transition-all ${
                                activeTab === 'ads'
                                    ? 'border-slate-950 bg-slate-950 text-white shadow-md'
                                    : 'border-slate-100 bg-white text-slate-600 hover:border-slate-300 hover:shadow-sm'
                            }`}
                        >
                            <Target className={`h-6 w-6 ${activeTab === 'ads' ? 'text-white' : 'text-slate-400'}`} />
                            <span>
                                Ads &<br />
                                Tracking
                            </span>
                        </button>
                    </div>

                    {/* Settings Form Container */}
                    {activeTab !== 'courier' &&
                        activeTab !== 'fraud' &&
                        activeTab !== 'themes' &&
                        activeTab !== 'content' &&
                        activeTab !== 'automation' &&
                        activeTab !== 'ads' && (
                            <form onSubmit={handleSubmit} className="w-full flex-1 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                {/* TAB 1: GENERAL IDENTITY */}
                                {activeTab === 'general' && (
                                    <div className="animate-fade-in space-y-6">
                                        <div>
                                            <h3 className="border-b border-slate-100 pb-2 text-lg font-black tracking-wider text-slate-900 uppercase">
                                                General Identity
                                            </h3>
                                            <p className="mt-1 text-xs font-medium text-slate-400">Configure basic website branding settings.</p>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <label
                                                    htmlFor="site_name"
                                                    className="mb-2 block text-xs font-black tracking-wider text-slate-700 uppercase"
                                                >
                                                    Site Name
                                                </label>
                                                <input
                                                    id="site_name"
                                                    type="text"
                                                    value={data.site_name}
                                                    onChange={(e) => setData('site_name', e.target.value)}
                                                    placeholder="e.g. Believers"
                                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-950 placeholder-slate-400 shadow-sm transition-all focus:border-slate-950 focus:ring-1 focus:ring-slate-950 focus:outline-none"
                                                />
                                                {errors.site_name && (
                                                    <p className="mt-1.5 text-xs font-bold tracking-tight text-red-600 uppercase">
                                                        {errors.site_name}
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <label
                                                    htmlFor="site_theme"
                                                    className="mb-2 block text-xs font-black tracking-wider text-slate-700 uppercase"
                                                >
                                                    Storefront Theme
                                                </label>
                                                <select
                                                    id="site_theme"
                                                    value={data.site_theme}
                                                    onChange={(e) => setData('site_theme', e.target.value)}
                                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-950 shadow-sm transition-all focus:border-slate-950 focus:ring-1 focus:ring-slate-950 focus:outline-none"
                                                >
                                                    {availableThemes.length > 0 ? (
                                                        availableThemes.map((theme) => (
                                                            <option key={theme.slug} value={theme.slug}>
                                                                {theme.name}
                                                            </option>
                                                        ))
                                                    ) : (
                                                        <option value="">No themes found</option>
                                                    )}
                                                </select>
                                                {errors.site_theme && (
                                                    <p className="mt-1.5 text-xs font-bold tracking-tight text-red-600 uppercase">
                                                        {errors.site_theme}
                                                    </p>
                                                )}
                                                <p className="mt-2 text-xs text-slate-500">
                                                    Choose the active storefront theme. The selected theme changes the public storefront styling
                                                    instantly.
                                                </p>
                                            </div>

                                            <div>
                                                <label
                                                    htmlFor="site_logo"
                                                    className="mb-2 block text-xs font-black tracking-wider text-slate-700 uppercase"
                                                >
                                                    Header Logo
                                                </label>
                                                <input
                                                    id="site_logo"
                                                    type="file"
                                                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0] ?? null;
                                                        setData('site_logo', file);
                                                        if (file) {
                                                            setLogoPreview(URL.createObjectURL(file));
                                                        }
                                                    }}
                                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-950 placeholder-slate-400 shadow-sm transition-all focus:border-slate-950 focus:ring-1 focus:ring-slate-950 focus:outline-none"
                                                />
                                                {errors.site_logo && (
                                                    <p className="mt-1.5 text-xs font-bold tracking-tight text-red-600 uppercase">
                                                        {errors.site_logo}
                                                    </p>
                                                )}
                                                {logoPreview && (
                                                    <div className="mt-3 max-w-[180px] overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-2">
                                                        <img src={logoPreview} alt="Header logo preview" className="h-20 w-full object-contain" />
                                                    </div>
                                                )}
                                                <p className="mt-2 text-xs text-slate-500">
                                                    Upload a website logo for the storefront header. SVG, PNG, JPG, and WebP are supported.
                                                </p>
                                            </div>

                                            <div>
                                                <label
                                                    htmlFor="site_favicon"
                                                    className="mb-2 block text-xs font-black tracking-wider text-slate-700 uppercase"
                                                >
                                                    Site Favicon
                                                </label>
                                                <input
                                                    id="site_favicon"
                                                    type="file"
                                                    accept="image/x-icon,image/png,image/jpeg,image/webp,image/svg+xml"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0] ?? null;
                                                        setData('site_favicon', file);
                                                        if (file) {
                                                            setFaviconPreview(URL.createObjectURL(file));
                                                        }
                                                    }}
                                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-950 placeholder-slate-400 shadow-sm transition-all focus:border-slate-950 focus:ring-1 focus:ring-slate-950 focus:outline-none"
                                                />
                                                {errors.site_favicon && (
                                                    <p className="mt-1.5 text-xs font-bold tracking-tight text-red-600 uppercase">
                                                        {errors.site_favicon}
                                                    </p>
                                                )}
                                                {faviconPreview && (
                                                    <div className="mt-3 max-w-[80px] overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-2">
                                                        <img
                                                            src={faviconPreview}
                                                            alt="Favicon preview"
                                                            className="mx-auto h-10 w-10 object-contain"
                                                        />
                                                    </div>
                                                )}
                                                <p className="mt-2 text-xs text-slate-500">
                                                    Upload a browser tab icon (favicon). ICO, PNG, JPG, and SVG are supported.
                                                </p>
                                            </div>

                                            <div>
                                                <label
                                                    htmlFor="footer_copyright"
                                                    className="mb-2 block text-xs font-black tracking-wider text-slate-700 uppercase"
                                                >
                                                    Copyright Notice (Footer)
                                                </label>
                                                <input
                                                    id="footer_copyright"
                                                    type="text"
                                                    value={data.footer_copyright}
                                                    onChange={(e) => setData('footer_copyright', e.target.value)}
                                                    placeholder="e.g. © 2026 Believers. All Rights Reserved"
                                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-950 placeholder-slate-400 shadow-sm transition-all focus:border-slate-950 focus:ring-1 focus:ring-slate-950 focus:outline-none"
                                                />
                                                {errors.footer_copyright && (
                                                    <p className="mt-1.5 text-xs font-bold tracking-tight text-red-600 uppercase">
                                                        {errors.footer_copyright}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* TAB 2: FOOTER COLUMNS & IDENTITY */}
                                {activeTab === 'footer' && (
                                    <div className="animate-fade-in space-y-8">
                                        <div>
                                            <h3 className="border-b border-slate-100 pb-2 text-lg font-black tracking-wider text-slate-900 uppercase">
                                                Footer Identity & Columns
                                            </h3>
                                            <p className="mt-1 text-xs font-medium text-slate-400">
                                                Manage e-commerce footer brand description and custom link blocks.
                                            </p>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <label
                                                    htmlFor="footer_description"
                                                    className="mb-2 block text-xs font-black tracking-wider text-slate-700 uppercase"
                                                >
                                                    Footer Brand Description
                                                </label>
                                                <textarea
                                                    id="footer_description"
                                                    rows={3}
                                                    value={data.footer_description}
                                                    onChange={(e) => setData('footer_description', e.target.value)}
                                                    placeholder="Introduce your brand..."
                                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-950 placeholder-slate-400 shadow-sm transition-all focus:border-slate-950 focus:ring-1 focus:ring-slate-950 focus:outline-none"
                                                />
                                                {errors.footer_description && (
                                                    <p className="mt-1.5 text-xs font-bold tracking-tight text-red-600 uppercase">
                                                        {errors.footer_description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Account Links Column */}
                                        <div>
                                            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                                                <div>
                                                    <h4 className="text-sm font-black tracking-wider text-slate-900 uppercase">
                                                        Column 1: Account Links
                                                    </h4>
                                                    <p className="mt-0.5 text-xs font-medium text-slate-400">
                                                        Manage navigation elements appearing under the "Account" section.
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => addLink('footer_account_links')}
                                                    className="inline-flex items-center gap-1 rounded-lg bg-orange-50 px-3 py-2 text-[11px] font-black tracking-wider text-orange-600 uppercase transition-colors hover:bg-orange-100"
                                                >
                                                    <Plus className="h-3.5 w-3.5" />
                                                    Add Link Row
                                                </button>
                                            </div>

                                            <div className="mt-4 space-y-3">
                                                {data.footer_account_links.map((link, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3"
                                                    >
                                                        <input
                                                            type="text"
                                                            value={link.label}
                                                            onChange={(e) => updateLink('footer_account_links', idx, 'label', e.target.value)}
                                                            placeholder="Link Label (e.g. My Account)"
                                                            className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-950 placeholder-slate-400 shadow-sm transition-all focus:border-slate-950 focus:outline-none"
                                                            required
                                                        />
                                                        <input
                                                            type="text"
                                                            value={link.url}
                                                            onChange={(e) => updateLink('footer_account_links', idx, 'url', e.target.value)}
                                                            placeholder="Link URL (e.g. /profile or #)"
                                                            className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-950 placeholder-slate-400 shadow-sm transition-all focus:border-slate-950 focus:outline-none"
                                                            required
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeLink('footer_account_links', idx)}
                                                            className="rounded-lg border border-transparent p-2 text-slate-400 transition-colors hover:border-red-100 hover:bg-red-50 hover:text-red-600"
                                                            title="Delete row"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                ))}

                                                {data.footer_account_links.length === 0 && (
                                                    <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-6 text-center text-xs font-bold tracking-widest text-slate-400 uppercase">
                                                        No account links. Click "Add Link Row" to begin.
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Information Links Column */}
                                        <div>
                                            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                                                <div>
                                                    <h4 className="text-sm font-black tracking-wider text-slate-900 uppercase">
                                                        Column 2: Information Links
                                                    </h4>
                                                    <p className="mt-0.5 text-xs font-medium text-slate-400">
                                                        Manage navigation elements appearing under the "Information" section.
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => addLink('footer_info_links')}
                                                    className="inline-flex items-center gap-1 rounded-lg bg-orange-50 px-3 py-2 text-[11px] font-black tracking-wider text-orange-600 uppercase transition-colors hover:bg-orange-100"
                                                >
                                                    <Plus className="h-3.5 w-3.5" />
                                                    Add Link Row
                                                </button>
                                            </div>

                                            <div className="mt-4 space-y-3">
                                                {data.footer_info_links.map((link, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3"
                                                    >
                                                        <input
                                                            type="text"
                                                            value={link.label}
                                                            onChange={(e) => updateLink('footer_info_links', idx, 'label', e.target.value)}
                                                            placeholder="Link Label (e.g. Return Policy)"
                                                            className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-950 placeholder-slate-400 shadow-sm transition-all focus:border-slate-950 focus:outline-none"
                                                            required
                                                        />
                                                        <input
                                                            type="text"
                                                            value={link.url}
                                                            onChange={(e) => updateLink('footer_info_links', idx, 'url', e.target.value)}
                                                            placeholder="Link URL (e.g. /refunds or #)"
                                                            className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-950 placeholder-slate-400 shadow-sm transition-all focus:border-slate-950 focus:outline-none"
                                                            required
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeLink('footer_info_links', idx)}
                                                            className="rounded-lg border border-transparent p-2 text-slate-400 transition-colors hover:border-red-100 hover:bg-red-50 hover:text-red-600"
                                                            title="Delete row"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                ))}

                                                {data.footer_info_links.length === 0 && (
                                                    <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-6 text-center text-xs font-bold tracking-widest text-slate-400 uppercase">
                                                        No information links. Click "Add Link Row" to begin.
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* TAB 3: CONTACTS & SOCIALS */}
                                {activeTab === 'contact' && (
                                    <div className="animate-fade-in space-y-6">
                                        <div>
                                            <h3 className="border-b border-slate-100 pb-2 text-lg font-black tracking-wider text-slate-900 uppercase">
                                                Contacts & Social Channels
                                            </h3>
                                            <p className="mt-1 text-xs font-medium text-slate-400">
                                                Display your e-commerce help coordinates, hotlines, and official media pages.
                                            </p>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                <div>
                                                    <label
                                                        htmlFor="footer_phone"
                                                        className="mb-2 block text-xs font-black tracking-wider text-slate-700 uppercase"
                                                    >
                                                        Support Hotline Phone
                                                    </label>
                                                    <input
                                                        id="footer_phone"
                                                        type="text"
                                                        value={data.footer_phone}
                                                        onChange={(e) => setData('footer_phone', e.target.value)}
                                                        placeholder="09638090000"
                                                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-950 placeholder-slate-400 shadow-sm transition-all focus:border-slate-950 focus:ring-1 focus:ring-slate-950 focus:outline-none"
                                                    />
                                                    {errors.footer_phone && (
                                                        <p className="mt-1.5 text-xs font-bold tracking-tight text-red-600 uppercase">
                                                            {errors.footer_phone}
                                                        </p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label
                                                        htmlFor="footer_email"
                                                        className="mb-2 block text-xs font-black tracking-wider text-slate-700 uppercase"
                                                    >
                                                        Support Email Address
                                                    </label>
                                                    <input
                                                        id="footer_email"
                                                        type="email"
                                                        value={data.footer_email}
                                                        onChange={(e) => setData('footer_email', e.target.value)}
                                                        placeholder="cc.believerssign@gmail.com"
                                                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-950 placeholder-slate-400 shadow-sm transition-all focus:border-slate-950 focus:ring-1 focus:ring-slate-950 focus:outline-none"
                                                    />
                                                    {errors.footer_email && (
                                                        <p className="mt-1.5 text-xs font-bold tracking-tight text-red-600 uppercase">
                                                            {errors.footer_email}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div>
                                                <label
                                                    htmlFor="footer_address"
                                                    className="mb-2 block text-xs font-black tracking-wider text-slate-700 uppercase"
                                                >
                                                    Physical Showroom Address
                                                </label>
                                                <textarea
                                                    id="footer_address"
                                                    rows={3}
                                                    value={data.footer_address}
                                                    onChange={(e) => setData('footer_address', e.target.value)}
                                                    placeholder="Showroom 12, Eastern Plaza..."
                                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-950 placeholder-slate-400 shadow-sm transition-all focus:border-slate-950 focus:ring-1 focus:ring-slate-950 focus:outline-none"
                                                />
                                                {errors.footer_address && (
                                                    <p className="mt-1.5 text-xs font-bold tracking-tight text-red-600 uppercase">
                                                        {errors.footer_address}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                <div>
                                                    <label
                                                        htmlFor="footer_facebook_url"
                                                        className="mb-2 block text-xs font-black tracking-wider text-slate-700 uppercase"
                                                    >
                                                        Facebook Page URL
                                                    </label>
                                                    <input
                                                        id="footer_facebook_url"
                                                        type="url"
                                                        value={data.footer_facebook_url}
                                                        onChange={(e) => setData('footer_facebook_url', e.target.value)}
                                                        placeholder="https://facebook.com/yourpage"
                                                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-950 placeholder-slate-400 shadow-sm transition-all focus:border-slate-950 focus:ring-1 focus:ring-slate-950 focus:outline-none"
                                                    />
                                                    {errors.footer_facebook_url && (
                                                        <p className="mt-1.5 text-xs font-bold tracking-tight text-red-600 uppercase">
                                                            {errors.footer_facebook_url}
                                                        </p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label
                                                        htmlFor="footer_youtube_url"
                                                        className="mb-2 block text-xs font-black tracking-wider text-slate-700 uppercase"
                                                    >
                                                        YouTube Channel URL
                                                    </label>
                                                    <input
                                                        id="footer_youtube_url"
                                                        type="url"
                                                        value={data.footer_youtube_url}
                                                        onChange={(e) => setData('footer_youtube_url', e.target.value)}
                                                        placeholder="https://youtube.com/@yourchannel"
                                                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-950 placeholder-slate-400 shadow-sm transition-all focus:border-slate-950 focus:ring-1 focus:ring-slate-950 focus:outline-none"
                                                    />
                                                    {errors.footer_youtube_url && (
                                                        <p className="mt-1.5 text-xs font-bold tracking-tight text-red-600 uppercase">
                                                            {errors.footer_youtube_url}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* TAB 4: STORE & SHIPPING (Extensible for more future configs) */}
                                {activeTab === 'shop' && (
                                    <div className="animate-fade-in space-y-6">
                                        <div>
                                            <h3 className="border-b border-slate-100 pb-2 text-lg font-black tracking-wider text-slate-900 uppercase">
                                                Store & Shipping Policies
                                            </h3>
                                            <p className="mt-1 text-xs font-medium text-slate-400">
                                                Configure checkout rules, dynamic shipping rates, and delivery charges.
                                            </p>
                                        </div>

                                        <div className="space-y-6">
                                            <div>
                                                <label
                                                    htmlFor="shipping_cost"
                                                    className="mb-2 block text-xs font-black tracking-wider text-slate-700 uppercase"
                                                >
                                                    Flat Rate Shipping Cost (৳)
                                                </label>
                                                <input
                                                    id="shipping_cost"
                                                    type="number"
                                                    min="0"
                                                    value={data.shipping_cost}
                                                    onChange={(e) => setData('shipping_cost', e.target.value)}
                                                    placeholder="60"
                                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-950 placeholder-slate-400 shadow-sm transition-all focus:border-slate-950 focus:ring-1 focus:ring-slate-950 focus:outline-none"
                                                />
                                                {errors.shipping_cost && (
                                                    <p className="mt-1.5 text-xs font-bold tracking-tight text-red-600 uppercase">
                                                        {errors.shipping_cost}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4">
                                                <div>
                                                    <label className="text-sm font-black text-slate-900">Enable AI Voice Confirmation</label>
                                                    <p className="mt-1 text-xs text-slate-500">
                                                        Automatically call customers after checkout to confirm their order using AI Voice.
                                                    </p>
                                                </div>
                                                <label className="relative inline-flex cursor-pointer items-center">
                                                    <input
                                                        type="checkbox"
                                                        className="peer sr-only"
                                                        checked={data.enable_ai_voice_confirmation}
                                                        onChange={(e) => setData('enable_ai_voice_confirmation', e.target.checked)}
                                                    />
                                                    <div className="peer h-6 w-11 rounded-full bg-slate-200 peer-checked:bg-slate-950 peer-focus:ring-2 peer-focus:ring-slate-950 peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                                                </label>
                                            </div>

                                            {/* Sleek Placeholder cards showcasing future extensibility */}
                                            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-5">
                                                <h4 className="text-xs font-black tracking-wider text-slate-400 uppercase">
                                                    🛠️ Future Expansion Port
                                                </h4>
                                                <p className="mt-1 text-xs leading-relaxed font-medium text-slate-400">
                                                    This shop settings tab is fully designed to accept future switches for{' '}
                                                    <strong>Cash on Delivery (ON/OFF)</strong>,<strong>SMS API keys</strong>,{' '}
                                                    <strong>SSLCommerz credentials</strong>, and location-based dynamic shipping rates inside/outside
                                                    Dhaka.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Submit Button Row */}
                                <div className="mt-8 flex items-center justify-end border-t border-slate-100 pt-4">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-6 py-3.5 text-xs font-black tracking-widest text-white uppercase shadow-lg transition-all hover:bg-slate-800 active:scale-98 disabled:pointer-events-none disabled:opacity-50"
                                    >
                                        <Save className="h-4 w-4" />
                                        {processing ? 'Saving...' : 'Save Settings'}
                                    </button>
                                </div>
                            </form>
                        )}

                    {/* TAB 5: COURIER INTEGRATION (separate form) */}
                    {activeTab === 'courier' && (
                        <div className="animate-fade-in w-full flex-1 space-y-6">
                            <div className="grid gap-6 md:grid-cols-3">
                                {/* Credential Form */}
                                <form
                                    onSubmit={handleCourierSubmit}
                                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:col-span-2"
                                >
                                    <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white">
                                            <Key className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-black tracking-wider text-slate-900 uppercase">Steadfast API Credentials</h3>
                                            <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Secure Connection Keys</p>
                                        </div>
                                    </div>

                                    <div className="space-y-5">
                                        <div>
                                            <label
                                                htmlFor="courier_api_key"
                                                className="mb-2 block text-xs font-black tracking-wider text-slate-700 uppercase"
                                            >
                                                Steadfast API Key
                                            </label>
                                            <input
                                                id="courier_api_key"
                                                type="password"
                                                required
                                                value={courierForm.data.courier_api_key}
                                                onChange={(e) => courierForm.setData('courier_api_key', e.target.value)}
                                                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-950 placeholder-slate-400 shadow-sm transition-all focus:border-slate-950 focus:ring-1 focus:ring-slate-950 focus:outline-none"
                                                placeholder="Enter your Steadfast API Key"
                                            />
                                            {courierForm.errors.courier_api_key && (
                                                <p className="mt-1.5 flex items-center gap-1 text-xs font-bold text-red-600">
                                                    <AlertCircle className="h-3.5 w-3.5" />
                                                    {courierForm.errors.courier_api_key}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="courier_secret_key"
                                                className="mb-2 block text-xs font-black tracking-wider text-slate-700 uppercase"
                                            >
                                                Steadfast Secret Key
                                            </label>
                                            <input
                                                id="courier_secret_key"
                                                type="password"
                                                required
                                                value={courierForm.data.courier_secret_key}
                                                onChange={(e) => courierForm.setData('courier_secret_key', e.target.value)}
                                                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-950 placeholder-slate-400 shadow-sm transition-all focus:border-slate-950 focus:ring-1 focus:ring-slate-950 focus:outline-none"
                                                placeholder="Enter your Steadfast Secret Key"
                                            />
                                            {courierForm.errors.courier_secret_key && (
                                                <p className="mt-1.5 flex items-center gap-1 text-xs font-bold text-red-600">
                                                    <AlertCircle className="h-3.5 w-3.5" />
                                                    {courierForm.errors.courier_secret_key}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
                                        <p className="text-xs font-medium text-slate-400">Keys are securely stored in your application database.</p>
                                        <button
                                            type="submit"
                                            disabled={courierForm.processing}
                                            className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-6 py-3 text-xs font-black tracking-widest text-white uppercase shadow-lg transition-all hover:bg-slate-800 active:scale-98 disabled:opacity-50"
                                        >
                                            {courierForm.processing && <RefreshCw className="h-4 w-4 animate-spin" />}
                                            <Save className="h-4 w-4" />
                                            Save Courier Keys
                                        </button>
                                    </div>
                                </form>

                                {/* Status & Balance Card */}
                                <div className="space-y-6">
                                    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                        <div className="pointer-events-none absolute top-0 right-0 p-3 text-slate-100 transition-colors group-hover:text-slate-200">
                                            <Truck className="h-24 w-24 translate-x-6 translate-y-2 -rotate-12 transform opacity-10" />
                                        </div>

                                        <div className="mb-6 flex items-center justify-between">
                                            <span className="text-xs font-black tracking-widest text-slate-400 uppercase">Steadfast Status</span>
                                            {isCourierConfigured ? (
                                                courierBalanceError ? (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-black tracking-tighter text-red-600 uppercase">
                                                        <XCircle className="h-3 w-3" /> Error
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex animate-pulse items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-black tracking-tighter text-emerald-600 uppercase">
                                                        <CheckCircle2 className="h-3 w-3" /> Connected
                                                    </span>
                                                )
                                            ) : (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-black tracking-tighter text-amber-600 uppercase">
                                                    <AlertCircle className="h-3 w-3" /> Unconfigured
                                                </span>
                                            )}
                                        </div>

                                        {isCourierConfigured ? (
                                            courierBalanceError ? (
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-2 text-red-600">
                                                        <AlertCircle className="h-5 w-5 flex-shrink-0" />
                                                        <span className="text-sm font-bold">Failed to connect</span>
                                                    </div>
                                                    <p className="max-w-[200px] text-xs font-semibold text-slate-500">{courierBalanceError}</p>
                                                </div>
                                            ) : (
                                                <div className="space-y-4">
                                                    <div>
                                                        <p className="mb-1 flex items-center gap-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                                                            <Wallet className="h-3.5 w-3.5 text-slate-400" />
                                                            Available Balance
                                                        </p>
                                                        <div className="flex items-baseline font-black tracking-tight">
                                                            <span className="mr-1 text-lg text-slate-900">৳</span>
                                                            <span className="bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-4xl text-transparent">
                                                                {courierBalance?.toLocaleString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <p className="text-xs leading-relaxed font-semibold text-slate-500">
                                                        Integration is active. You can now dispatch orders directly from the Orders page.
                                                    </p>
                                                </div>
                                            )
                                        ) : (
                                            <div className="space-y-3 py-4">
                                                <div className="h-8 w-3/4 animate-pulse rounded-lg bg-slate-100"></div>
                                                <p className="text-xs font-semibold text-slate-400">
                                                    Enter your credentials to test connection and view your courier account balance.
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Help Alert */}
                                    <div className="space-y-3 rounded-2xl border border-amber-200/60 bg-amber-50/50 p-5 shadow-sm">
                                        <h3 className="flex items-center gap-2 text-sm font-bold text-amber-900">
                                            <AlertCircle className="h-4 w-4 text-amber-700" />
                                            Where do I get my API keys?
                                        </h3>
                                        <p className="text-xs leading-relaxed font-semibold text-amber-800">
                                            Log in to your <strong>Steadfast Courier Portal</strong> account, navigate to the{' '}
                                            <strong>API Settings</strong> menu, and copy the <strong>Api-Key</strong> and <strong>Secret-Key</strong>{' '}
                                            credentials.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 6: FRAUD CHECKING (BD Courier) */}
                    {activeTab === 'fraud' && (
                        <div className="animate-fade-in w-full flex-1 space-y-6">
                            <div className="grid gap-6 md:grid-cols-3">
                                <form
                                    onSubmit={handleFraudSubmit}
                                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:col-span-2"
                                >
                                    <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white">
                                            <Key className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-black tracking-wider text-slate-900 uppercase">BD Courier Configuration</h3>
                                            <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Ford Checker</p>
                                        </div>
                                    </div>

                                    <div className="space-y-5">
                                        <div>
                                            <label
                                                htmlFor="bd_courier_api_key"
                                                className="mb-2 block text-xs font-black tracking-wider text-slate-700 uppercase"
                                            >
                                                BD Courier API Key
                                            </label>
                                            <input
                                                id="bd_courier_api_key"
                                                type="password"
                                                required
                                                value={fraudForm.data.bd_courier_api_key}
                                                onChange={(e) => fraudForm.setData('bd_courier_api_key', e.target.value)}
                                                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-950 placeholder-slate-400 shadow-sm transition-all focus:border-slate-950 focus:ring-1 focus:ring-slate-950 focus:outline-none"
                                                placeholder="Enter your BD Courier bearer token"
                                            />
                                            {fraudForm.errors.bd_courier_api_key && (
                                                <p className="mt-1.5 flex items-center gap-1 text-xs font-bold text-red-600">
                                                    <AlertCircle className="h-3.5 w-3.5" />
                                                    {fraudForm.errors.bd_courier_api_key}
                                                </p>
                                            )}
                                            <p className="mt-2 text-xs text-slate-500">
                                                This bearer token is used by the Ford Checker to fetch delivery performance for each customer phone
                                                number.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
                                        <p className="text-xs font-medium text-slate-400">
                                            The BD Courier API key is securely stored in your application database.
                                        </p>
                                        <button
                                            type="submit"
                                            disabled={fraudForm.processing}
                                            className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-6 py-3 text-xs font-black tracking-widest text-white uppercase shadow-lg transition-all hover:bg-slate-800 active:scale-98 disabled:opacity-50"
                                        >
                                            {fraudForm.processing && <RefreshCw className="h-4 w-4 animate-spin" />}
                                            <Save className="h-4 w-4" />
                                            Save Configuration
                                        </button>
                                    </div>
                                </form>

                                <div className="space-y-6">
                                    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                        <div className="pointer-events-none absolute top-0 right-0 p-3 text-slate-100 transition-colors group-hover:text-slate-200">
                                            <Key className="h-24 w-24 translate-x-6 translate-y-2 -rotate-12 transform opacity-10" />
                                        </div>

                                        <div className="mb-6 flex items-center justify-between">
                                            <span className="text-xs font-black tracking-widest text-slate-400 uppercase">BD Courier Status</span>
                                            {isFraudConfigured ? (
                                                <span className="inline-flex animate-pulse items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-black tracking-tighter text-emerald-600 uppercase">
                                                    <CheckCircle2 className="h-3 w-3" /> Connected
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-black tracking-tighter text-amber-600 uppercase">
                                                    <AlertCircle className="h-3 w-3" /> Unconfigured
                                                </span>
                                            )}
                                        </div>

                                        <div className="space-y-3">
                                            <p className="text-xs leading-relaxed font-semibold text-slate-500">
                                                {isFraudConfigured
                                                    ? 'Your BD Courier token is saved and ready for the Ford Checker.'
                                                    : 'Add your BD Courier bearer token to enable fraud checking for orders.'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                        <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                                            <AlertCircle className="h-4 w-4 text-slate-700" />
                                            Need help?
                                        </h3>
                                        <p className="text-xs leading-relaxed font-semibold text-slate-600">
                                            Paste your <strong>BD Courier bearer token</strong> here to enable the Ford Checker for order fraud
                                            review.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* THEMES TAB */}
                    {activeTab === 'themes' && (
                        <div className="animate-fade-in w-full flex-1 space-y-6">
                            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                <div className="mb-6 border-b border-slate-100 pb-4">
                                    <h3 className="flex items-center gap-2 text-lg font-black tracking-wider text-slate-900 uppercase">
                                        <Palette className="h-5 w-5 text-purple-600" />
                                        Theme Manager
                                    </h3>
                                    <p className="mt-1 text-xs font-medium text-slate-400">
                                        Create a folder in{' '}
                                        <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] text-slate-700">
                                            resources/themes/your-theme/
                                        </code>{' '}
                                        with a{' '}
                                        <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] text-slate-700">theme.json</code>{' '}
                                        file to register a new theme.
                                    </p>
                                </div>

                                {availableThemes.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-400">
                                        <Palette className="h-12 w-12 opacity-20" />
                                        <p className="text-sm font-bold tracking-widest uppercase">No Themes Found</p>
                                        <p className="max-w-xs text-center text-xs">
                                            Add a theme folder under <code className="font-mono">resources/themes/</code> with a{' '}
                                            <code className="font-mono">theme.json</code> to get started.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                        {availableThemes.map((theme) => (
                                            <div
                                                key={theme.slug}
                                                className={`relative flex flex-col gap-3 rounded-xl border-2 p-5 transition-all duration-200 ${
                                                    theme.active
                                                        ? 'border-purple-500 bg-purple-50 shadow-md shadow-purple-100'
                                                        : 'border-slate-200 bg-white hover:border-slate-400 hover:shadow-sm'
                                                }`}
                                            >
                                                {theme.active && (
                                                    <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-purple-600 px-2.5 py-0.5 text-[10px] font-black tracking-widest text-white uppercase">
                                                        <CheckCircle2 className="h-3 w-3" />
                                                        Active
                                                    </span>
                                                )}

                                                {/* Theme Icon placeholder */}
                                                <div
                                                    className={`flex h-24 items-center justify-center rounded-lg ${theme.active ? 'bg-purple-100' : 'bg-slate-100'}`}
                                                >
                                                    <Palette className={`h-10 w-10 ${theme.active ? 'text-purple-400' : 'text-slate-300'}`} />
                                                </div>

                                                <div className="flex-1">
                                                    <h4 className="text-sm leading-tight font-black text-slate-900">{theme.name}</h4>
                                                    <p className="mt-0.5 font-mono text-[10px] text-slate-400">slug: {theme.slug}</p>
                                                    {theme.description && (
                                                        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed font-medium text-slate-500">
                                                            {theme.description}
                                                        </p>
                                                    )}
                                                    <div className="mt-2 flex items-center gap-3">
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase">v{theme.version}</span>
                                                        <span className="text-[10px] text-slate-400">by {theme.author}</span>
                                                    </div>
                                                </div>

                                                {!theme.active && (
                                                    <button
                                                        type="button"
                                                        disabled={activatingTheme === theme.slug}
                                                        onClick={() => {
                                                            setActivatingTheme(theme.slug);
                                                            router.post(
                                                                route('admin.settings.theme.activate'),
                                                                { slug: theme.slug },
                                                                {
                                                                    preserveScroll: true,
                                                                    onFinish: () => setActivatingTheme(null),
                                                                    onSuccess: () => {
                                                                        setSuccessMessage(`Theme "${theme.name}" activated successfully!`);
                                                                        setTimeout(() => setSuccessMessage(null), 4000);
                                                                    },
                                                                },
                                                            );
                                                        }}
                                                        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-2.5 text-xs font-black tracking-widest text-white uppercase transition-all hover:bg-slate-700 active:scale-95 disabled:opacity-50"
                                                    >
                                                        {activatingTheme === theme.slug ? (
                                                            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                                                        ) : (
                                                            <CheckCircle className="h-3.5 w-3.5" />
                                                        )}
                                                        {activatingTheme === theme.slug ? 'Activating…' : 'Activate Theme'}
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* How to create a theme guide */}
                            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                <h4 className="mb-3 text-sm font-black tracking-wider text-slate-900 uppercase">📁 How to Create a Theme</h4>
                                <ol className="list-inside list-decimal space-y-2 text-xs font-medium text-slate-600">
                                    <li>
                                        Create a folder:{' '}
                                        <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-slate-700">
                                            resources/themes/my-theme/
                                        </code>
                                    </li>
                                    <li>
                                        Add a <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-slate-700">theme.json</code> file
                                        with name, slug, version, author
                                    </li>
                                    <li>
                                        Optionally add{' '}
                                        <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-slate-700">views/app.blade.php</code> to
                                        override the root layout
                                    </li>
                                    <li>Refresh this page — your theme will appear above automatically</li>
                                    <li>
                                        Click <strong>Activate Theme</strong>
                                    </li>
                                </ol>
                                <div className="mt-4 rounded-lg bg-slate-950 p-4">
                                    <p className="mb-2 text-[10px] font-black tracking-widest text-slate-400 uppercase">theme.json example</p>
                                    <pre className="font-mono text-xs leading-relaxed text-emerald-400">{`{
  "name": "My Theme",
  "slug": "my-theme",
  "version": "1.0.0",
  "author": "Your Name",
  "description": "A beautiful custom theme."
}`}</pre>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* CONTENT TAB */}
                    {activeTab === 'content' && (
                        <div className="animate-fade-in w-full flex-1 space-y-6">
                            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                <h3 className="mb-6 border-b border-slate-100 pb-2 text-lg font-black tracking-wider text-slate-900 uppercase">
                                    Store Content & Layout
                                </h3>
                                <p className="mt-1 mb-6 text-xs font-medium text-slate-400">
                                    Manage your storefront's dynamic content, promotions, and menus.
                                </p>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <Link
                                        href="/admin/featured-tiles"
                                        className="group flex cursor-pointer items-center rounded-xl border border-slate-200 bg-slate-50 p-4 transition-all hover:border-slate-950 hover:bg-white hover:shadow-md"
                                    >
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-200 text-slate-600 transition-colors group-hover:bg-slate-950 group-hover:text-white">
                                            <LayoutGrid className="h-5 w-5" />
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="text-sm font-black tracking-wider text-slate-900 uppercase">Featured Tiles</h4>
                                            <p className="mt-0.5 text-[10px] font-bold tracking-widest text-slate-500 uppercase">Manage Home Tiles</p>
                                        </div>
                                    </Link>

                                    <Link
                                        href="/admin/video-reels"
                                        className="group flex cursor-pointer items-center rounded-xl border border-slate-200 bg-slate-50 p-4 transition-all hover:border-slate-950 hover:bg-white hover:shadow-md"
                                    >
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-200 text-slate-600 transition-colors group-hover:bg-slate-950 group-hover:text-white">
                                            <LayoutGrid className="h-5 w-5" />
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="text-sm font-black tracking-wider text-slate-900 uppercase">Video Reels</h4>
                                            <p className="mt-0.5 text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                                                Manage Video Section
                                            </p>
                                        </div>
                                    </Link>

                                    <Link
                                        href="/admin/banners"
                                        className="group flex cursor-pointer items-center rounded-xl border border-slate-200 bg-slate-50 p-4 transition-all hover:border-slate-950 hover:bg-white hover:shadow-md"
                                    >
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-200 text-slate-600 transition-colors group-hover:bg-slate-950 group-hover:text-white">
                                            <LayoutGrid className="h-5 w-5" />
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="text-sm font-black tracking-wider text-slate-900 uppercase">Banners</h4>
                                            <p className="mt-0.5 text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                                                Manage Promo Banners
                                            </p>
                                        </div>
                                    </Link>

                                    <Link
                                        href="/admin/menu-items"
                                        className="group flex cursor-pointer items-center rounded-xl border border-slate-200 bg-slate-50 p-4 transition-all hover:border-slate-950 hover:bg-white hover:shadow-md"
                                    >
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-200 text-slate-600 transition-colors group-hover:bg-slate-950 group-hover:text-white">
                                            <Menu className="h-5 w-5" />
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="text-sm font-black tracking-wider text-slate-900 uppercase">Header Menus</h4>
                                            <p className="mt-0.5 text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                                                Manage Top Navigation
                                            </p>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* TAB 9: AUTOMATION */}
                    {activeTab === 'automation' && (
                        <form onSubmit={handleAutomationSubmit} className="w-full flex-1 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="animate-fade-in space-y-8">
                                <div>
                                    <h3 className="border-b border-slate-100 pb-2 text-lg font-black tracking-wider text-slate-900 uppercase">
                                        API & Automation Settings
                                    </h3>
                                    <p className="mt-1 text-xs font-medium text-slate-400">
                                        Configure SMS Providers, WhatsApp API, and Database Backup parameters.
                                    </p>
                                </div>

                                {/* SMS Settings */}
                                <div className="space-y-4">
                                    <h4 className="text-sm font-black tracking-wider text-slate-900 uppercase">SMS Integration</h4>

                                    <div>
                                        <label className="mb-2 block text-xs font-black tracking-wider text-slate-700 uppercase">
                                            Active SMS Provider
                                        </label>
                                        <select
                                            value={automationForm.data.sms_provider}
                                            onChange={(e) => automationForm.setData('sms_provider', e.target.value)}
                                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-950 shadow-sm transition-all focus:border-slate-950 focus:ring-1 focus:ring-slate-950 focus:outline-none"
                                        >
                                            <option value="mim_sms">MimSMS</option>
                                            <option value="banglalink_sms">Banglalink SMS</option>
                                        </select>
                                    </div>

                                    {automationForm.data.sms_provider === 'mim_sms' && (
                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                            <div>
                                                <label className="mb-2 block text-xs font-black tracking-wider text-slate-700 uppercase">
                                                    MimSMS API Key
                                                </label>
                                                <input
                                                    type="text"
                                                    value={automationForm.data.mim_sms_api_key}
                                                    onChange={(e) => automationForm.setData('mim_sms_api_key', e.target.value)}
                                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-950 placeholder-slate-400 shadow-sm transition-all focus:border-slate-950 focus:ring-1 focus:ring-slate-950 focus:outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="mb-2 block text-xs font-black tracking-wider text-slate-700 uppercase">
                                                    MimSMS Sender ID
                                                </label>
                                                <input
                                                    type="text"
                                                    value={automationForm.data.mim_sms_sender_id}
                                                    onChange={(e) => automationForm.setData('mim_sms_sender_id', e.target.value)}
                                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-950 placeholder-slate-400 shadow-sm transition-all focus:border-slate-950 focus:ring-1 focus:ring-slate-950 focus:outline-none"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {automationForm.data.sms_provider === 'banglalink_sms' && (
                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                            <div>
                                                <label className="mb-2 block text-xs font-black tracking-wider text-slate-700 uppercase">
                                                    Banglalink Username
                                                </label>
                                                <input
                                                    type="text"
                                                    value={automationForm.data.banglalink_sms_username}
                                                    onChange={(e) => automationForm.setData('banglalink_sms_username', e.target.value)}
                                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-950 placeholder-slate-400 shadow-sm transition-all focus:border-slate-950 focus:ring-1 focus:ring-slate-950 focus:outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="mb-2 block text-xs font-black tracking-wider text-slate-700 uppercase">
                                                    Banglalink Password
                                                </label>
                                                <input
                                                    type="password"
                                                    value={automationForm.data.banglalink_sms_password}
                                                    onChange={(e) => automationForm.setData('banglalink_sms_password', e.target.value)}
                                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-950 placeholder-slate-400 shadow-sm transition-all focus:border-slate-950 focus:ring-1 focus:ring-slate-950 focus:outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="mb-2 block text-xs font-black tracking-wider text-slate-700 uppercase">
                                                    Banglalink Shortcode
                                                </label>
                                                <input
                                                    type="text"
                                                    value={automationForm.data.banglalink_sms_shortcode}
                                                    onChange={(e) => automationForm.setData('banglalink_sms_shortcode', e.target.value)}
                                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-950 placeholder-slate-400 shadow-sm transition-all focus:border-slate-950 focus:ring-1 focus:ring-slate-950 focus:outline-none"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* WhatsApp Settings */}
                                <div className="space-y-4 border-t border-slate-100 pt-6">
                                    <h4 className="text-sm font-black tracking-wider text-slate-900 uppercase">Meta WhatsApp Cloud API</h4>

                                    <div>
                                        <label className="mb-2 block text-xs font-black tracking-wider text-slate-700 uppercase">Access Token</label>
                                        <input
                                            type="text"
                                            value={automationForm.data.whatsapp_token}
                                            onChange={(e) => automationForm.setData('whatsapp_token', e.target.value)}
                                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-950 placeholder-slate-400 shadow-sm transition-all focus:border-slate-950 focus:ring-1 focus:ring-slate-950 focus:outline-none"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div>
                                            <label className="mb-2 block text-xs font-black tracking-wider text-slate-700 uppercase">
                                                Phone Number ID
                                            </label>
                                            <input
                                                type="text"
                                                value={automationForm.data.whatsapp_phone_id}
                                                onChange={(e) => automationForm.setData('whatsapp_phone_id', e.target.value)}
                                                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-950 placeholder-slate-400 shadow-sm transition-all focus:border-slate-950 focus:ring-1 focus:ring-slate-950 focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-2 block text-xs font-black tracking-wider text-slate-700 uppercase">
                                                Webhook Verify Token
                                            </label>
                                            <input
                                                type="text"
                                                value={automationForm.data.whatsapp_verify_token}
                                                onChange={(e) => automationForm.setData('whatsapp_verify_token', e.target.value)}
                                                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-950 placeholder-slate-400 shadow-sm transition-all focus:border-slate-950 focus:ring-1 focus:ring-slate-950 focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Backup Settings */}
                                <div className="space-y-4 border-t border-slate-100 pt-6">
                                    <h4 className="text-sm font-black tracking-wider text-slate-900 uppercase">Google Drive Backups</h4>

                                    <div>
                                        <label className="mb-2 block text-xs font-black tracking-wider text-slate-700 uppercase">Folder ID</label>
                                        <input
                                            type="text"
                                            value={automationForm.data.google_drive_folder_id}
                                            onChange={(e) => automationForm.setData('google_drive_folder_id', e.target.value)}
                                            placeholder="Leave empty for root folder"
                                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-950 placeholder-slate-400 shadow-sm transition-all focus:border-slate-950 focus:ring-1 focus:ring-slate-950 focus:outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end border-t border-slate-100 pt-6">
                                    <button
                                        type="submit"
                                        disabled={automationForm.processing}
                                        className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-6 py-3.5 text-sm font-black tracking-wider text-white uppercase shadow-md transition-all hover:bg-slate-800 focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 focus:outline-none disabled:opacity-70"
                                    >
                                        {automationForm.processing ? <RefreshCw className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                                        Save Automation Settings
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}

                    {/* TAB 10: ADS & TRACKING */}
                    {activeTab === 'ads' && (
                        <div className="w-full flex-1 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="animate-fade-in space-y-8">
                                <div>
                                    <h3 className="border-b border-slate-100 pb-2 text-lg font-black tracking-wider text-slate-900 uppercase">
                                        Ads & Tracking Modules
                                    </h3>
                                    <p className="mt-1 text-xs font-medium text-slate-400">
                                        Manage your Meta Ads integration and Facebook Pixels/CAPI setups.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    <div className="flex flex-col justify-between rounded-xl border border-slate-200 p-6 shadow-sm transition-all hover:shadow-md">
                                        <div>
                                            <div className="mb-4 flex items-center gap-4">
                                                <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
                                                    <Target className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-900">Meta Ads Integration</h4>
                                                    <p className="text-xs text-slate-500">Connect FB Ad accounts and sync spend</p>
                                                </div>
                                            </div>
                                            <p className="mb-6 text-sm text-slate-600">
                                                Track your ad campaign performance, sync daily ad spend into the finance dashboard, and manage active ad
                                                accounts directly from the Meta Ads management panel.
                                            </p>
                                        </div>
                                        <Link
                                            href="/admin/meta-ads"
                                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-black tracking-wider text-white uppercase transition-all hover:bg-slate-800"
                                        >
                                            Manage Meta Ads
                                        </Link>
                                    </div>

                                    <div className="flex flex-col justify-between rounded-xl border border-slate-200 p-6 shadow-sm transition-all hover:shadow-md">
                                        <div>
                                            <div className="mb-4 flex items-center gap-4">
                                                <div className="rounded-lg bg-indigo-50 p-3 text-indigo-600">
                                                    <Activity className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-900">Facebook Pixels & CAPI</h4>
                                                    <p className="text-xs text-slate-500">Manage browser and server-side tracking</p>
                                                </div>
                                            </div>
                                            <p className="mb-6 text-sm text-slate-600">
                                                Configure multiple Facebook Pixels, enable Conversions API (CAPI) for highly accurate server-side event
                                                tracking, and test events in real-time.
                                            </p>
                                        </div>
                                        <Link
                                            href="/admin/pixels"
                                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-slate-950 px-4 py-2.5 text-sm font-black tracking-wider text-slate-950 uppercase transition-all hover:bg-slate-50"
                                        >
                                            Manage Pixels
                                        </Link>
                                    </div>

                                    <div className="flex flex-col justify-between rounded-xl border border-slate-200 p-6 shadow-sm transition-all hover:shadow-md">
                                        <div>
                                            <div className="mb-4 flex items-center gap-4">
                                                <div className="rounded-lg bg-orange-50 p-3 text-orange-600">
                                                    <Settings className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-900">Google Tag Manager</h4>
                                                    <p className="text-xs text-slate-500">Track client-side events via GTM dataLayer</p>
                                                </div>
                                            </div>
                                            <p className="mb-4 text-sm text-slate-600">
                                                Connect Google Tag Manager (GTM) to dynamically fire page views, cart activities, checkout initiations, and purchase events.
                                            </p>
                                        </div>
                                        <form onSubmit={handleGtmSubmit} className="mt-2 space-y-4">
                                            <div>
                                                <label className="block text-[10px] font-black tracking-wider text-slate-500 uppercase mb-1">
                                                    GTM Container ID
                                                </label>
                                                <input
                                                    type="text"
                                                    value={gtmForm.data.gtm_container_id}
                                                    onChange={(e) => gtmForm.setData('gtm_container_id', e.target.value)}
                                                    placeholder="GTM-XXXXXXX"
                                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-slate-950 focus:outline-none"
                                                />
                                                {gtmForm.errors.gtm_container_id && (
                                                    <p className="mt-1 text-xs font-bold text-red-600">{gtmForm.errors.gtm_container_id}</p>
                                                )}
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={gtmForm.processing}
                                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-black tracking-wider text-white uppercase transition-all hover:bg-slate-800 disabled:opacity-50"
                                            >
                                                {gtmForm.processing ? (
                                                    <RefreshCw className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <Save className="h-4 w-4" />
                                                )}
                                                Save GTM Container
                                            </button>
                                        </form>
                                    </div>

                                    <div className="flex flex-col justify-between rounded-xl border border-slate-200 p-6 shadow-sm transition-all hover:shadow-md">
                                        <div>
                                            <div className="mb-4 flex items-center gap-4">
                                                <div className="rounded-lg bg-emerald-50 p-3 text-emerald-600">
                                                    <Megaphone className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-900">Marketing Settings</h4>
                                                    <p className="text-xs text-slate-500">Configure purchase conversion trigger</p>
                                                </div>
                                            </div>
                                            <p className="mb-4 text-sm text-slate-600">
                                                Select the order status that triggers the sending of Purchase events to Meta and other platforms.
                                            </p>
                                        </div>
                                        <form onSubmit={handleMarketingSubmit} className="mt-2 space-y-4">
                                            <div>
                                                <label className="block text-[10px] font-black tracking-wider text-slate-500 uppercase mb-2">
                                                    Purchase Trigger Status
                                                </label>
                                                <Select
                                                    value={marketingForm.data.marketing_purchase_trigger}
                                                    onValueChange={(val) => marketingForm.setData('marketing_purchase_trigger', val)}
                                                >
                                                    <SelectTrigger className="w-full bg-white rounded-lg border border-slate-200 text-sm">
                                                        <SelectValue placeholder="Select Trigger" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="created">Order Created</SelectItem>
                                                        <SelectItem value="confirmed">Order Confirmed</SelectItem>
                                                        <SelectItem value="packed">Packed</SelectItem>
                                                        <SelectItem value="shipped">Shipped</SelectItem>
                                                        <SelectItem value="delivered">Delivered</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                {marketingForm.errors.marketing_purchase_trigger && (
                                                    <p className="mt-1 text-xs font-bold text-red-600">{marketingForm.errors.marketing_purchase_trigger}</p>
                                                )}
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={marketingForm.processing}
                                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-black tracking-wider text-white uppercase transition-all hover:bg-slate-800 disabled:opacity-50"
                                            >
                                                {marketingForm.processing ? (
                                                    <RefreshCw className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <Save className="h-4 w-4" />
                                                )}
                                                Save Settings
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
