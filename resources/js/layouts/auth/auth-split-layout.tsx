import AppLogoIcon from '@/components/app-logo-icon';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Check, Sparkles } from 'lucide-react';

interface AuthLayoutProps {
    children: React.ReactNode;
    title?: string;
    description?: string;
}

export function AuthSplitLayout({ children, title, description }: AuthLayoutProps) {
    const { name, quote } = usePage<SharedData>().props;

    return (
        <div className="relative grid min-h-screen grid-cols-1 overflow-hidden lg:grid-cols-2">
            {/* Left side panel: Premium aesthetic mesh gradients and highlights */}
            <div className="relative hidden flex-col items-center justify-center border-r border-white/5 bg-[#09090b] p-12 text-white select-none lg:flex">
                {/* Glow/Mesh gradients */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute top-[-10%] left-[-10%] h-[50%] w-[50%] animate-pulse rounded-full bg-violet-600/15 blur-[120px] duration-[8000ms]" />
                    <div className="absolute right-[-10%] bottom-[-10%] h-[60%] w-[60%] animate-pulse rounded-full bg-emerald-500/10 blur-[140px] duration-[10000ms]" />
                    <div className="absolute top-[30%] right-[10%] h-[350px] w-[350px] rounded-full bg-indigo-500/10 blur-[100px]" />
                </div>

                {/* Subtle Grid overlay */}
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)]" />

                {/* Top logo */}
                <div className="absolute top-10 left-10 z-20">
                    <Link href={route('home')} className="group flex items-center gap-3 transition-transform duration-300 hover:scale-[1.02]">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 shadow-[0_0_20px_rgba(124,58,237,0.3)] ring-1 ring-white/20">
                            <AppLogoIcon className="size-6 fill-current text-white" />
                        </div>
                        <span className="bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-xl font-bold tracking-tight text-transparent">
                            {name}
                        </span>
                    </Link>
                </div>

                {/* Main Content Info Card */}
                <div className="relative z-20 my-auto flex w-full max-w-md flex-col gap-8">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-400">
                            <Sparkles className="h-3 w-3" />
                            Premium E-Commerce Platform
                        </div>
                        <h2 className="text-4xl leading-tight font-extrabold tracking-tight text-white">
                            Discover & Experience the{' '}
                            <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">
                                Finest Selection
                            </span>
                        </h2>
                        <p className="text-base leading-relaxed text-neutral-400">
                            Log in to access your customized orders, exclusive benefits, and track your shopping experience seamlessly.
                        </p>
                    </div>

                    {/* Features list */}
                    <div className="flex flex-col gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-6 shadow-2xl backdrop-blur-xl">
                        {[
                            { title: 'Curated Premium Collections', desc: 'Handcrafted products made with materials of the highest order.' },
                            { title: 'Instant Processing & Support', desc: 'Your orders are processed quickly with 24/7 dedicated support.' },
                            { title: 'Secure Transactions & Tracking', desc: 'Shop safely with end-to-end security and real-time live updates.' },
                        ].map((item, index) => (
                            <div key={index} className="flex gap-4">
                                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20">
                                    <Check className="h-4 w-4" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-sm font-semibold text-neutral-100">{item.title}</h4>
                                    <p className="text-xs leading-relaxed text-neutral-400">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Dynamic Quote at Bottom */}
                {quote && (
                    <div className="absolute right-10 bottom-10 left-10 z-20 hidden xl:block">
                        <div className="relative rounded-xl border border-white/5 bg-white/[0.01] p-5 backdrop-blur-lg">
                            <span className="absolute top-2 left-3 font-serif text-5xl leading-none text-violet-500/20 select-none">“</span>
                            <blockquote className="space-y-2 pl-6">
                                <p className="text-sm leading-relaxed font-medium text-neutral-300 italic">&ldquo;{quote.message}&rdquo;</p>
                                <footer className="text-xs font-semibold text-violet-400/80">— {quote.author}</footer>
                            </blockquote>
                        </div>
                    </div>
                )}
            </div>

            {/* Right side form panel */}
            <div className="bg-background flex items-center justify-center px-6 py-12 md:p-12 lg:px-16">
                <div className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[380px]">
                    {/* Mobile Logo View */}
                    <div className="flex flex-col items-center justify-center gap-4 lg:hidden">
                        <Link href={route('home')} className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 shadow-[0_0_20px_rgba(124,58,237,0.3)] ring-1 ring-white/20">
                                <AppLogoIcon className="size-7 fill-current text-white" />
                            </div>
                            <span className="text-foreground text-2xl font-bold tracking-tight">{name}</span>
                        </Link>
                    </div>

                    {/* Header info */}
                    <div className="flex flex-col gap-2 text-center lg:text-left">
                        <h1 className="text-foreground text-3xl font-extrabold tracking-tight">{title}</h1>
                        <p className="text-muted-foreground text-sm leading-relaxed text-balance">{description}</p>
                    </div>

                    {/* Form children wrapper */}
                    <div className="relative">{children}</div>
                </div>
            </div>
        </div>
    );
}
