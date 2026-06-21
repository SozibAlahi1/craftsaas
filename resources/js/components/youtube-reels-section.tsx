import { useCallback, useEffect, useId, useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from '@inertiajs/react';
import type { Swiper as SwiperType } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';

type YouTubePlayer = {
    destroy?: () => void;
    getCurrentTime?: () => number;
    mute?: () => void;
    playVideo?: () => void;
    seekTo?: (seconds: number, allowSeekAhead?: boolean) => void;
};

type YouTubePlayerEvent = {
    target: YouTubePlayer;
};

let youtubeApiPromise: Promise<void> | null = null;

function loadYouTubeApi(): Promise<void> {
    if (window.YT?.Player) {
        return Promise.resolve();
    }

    if (!youtubeApiPromise) {
        youtubeApiPromise = new Promise((resolve) => {
            const scriptId = 'youtube-iframe-api';
            const existingScript = document.getElementById(scriptId) as HTMLScriptElement | null;

            const onReady = () => {
                resolve();
            };

            if (!existingScript) {
                const script = document.createElement('script');
                script.id = scriptId;
                script.src = 'https://www.youtube.com/iframe_api';
                document.head.appendChild(script);
            }

            window.onYouTubeIframeAPIReady = onReady;
        });
    }

    return youtubeApiPromise;
}

export function YouTubeReelsSection({ reels = [] }: { reels?: any[] }) {
    if (!reels || reels.length === 0) return null;

    const playersRef = useRef<Record<string, YouTubePlayer>>({});
    const destroyedRef = useRef<Record<string, boolean>>({});
    const swiperRef = useRef<SwiperType | null>(null);
    const instanceId = useId().replace(/:/g, '');
    const reelElementId = useCallback((reelId: string, suffix: string): string => `${instanceId}-${reelId}-${suffix}`, [instanceId]);

    useEffect(() => {
        const players: Record<string, YouTubePlayer> = {};
        const intervals: number[] = [];

        const initializePlayers = () => {
            if (!window.YT?.Player) {
                return;
            }

            const allReels = [
                ...reels.map(r => ({ ...r, suffix: 'mobile' })),
                ...reels.map(r => ({ ...r, suffix: 'desktop' }))
            ];

            allReels.forEach((reel) => {
                const elementId = reelElementId(reel.id, reel.suffix);
                if (players[elementId] || !document.getElementById(elementId)) {
                    return;
                }

                const player = new window.YT.Player(elementId, {
                    videoId: reel.youtube_id,
                    playerVars: {
                        autoplay: 1,
                        controls: 0,
                        disablekb: 1,
                        fs: 0,
                        iv_load_policy: 3,
                        loop: 1,
                        mute: 1,
                        playsinline: 1,
                        rel: 0,
                        modestbranding: 1,
                        playlist: reel.youtube_id, // Needed for loop
                    },
                    events: {
                        onReady: (event: YouTubePlayerEvent) => {
                            event.target.mute();
                            event.target.playVideo();
                        },
                        onStateChange: (event: any) => {
                            // Ensure it keeps playing if it stops
                            if (event.data === window.YT.PlayerState.ENDED) {
                                event.target.playVideo();
                            }
                        }
                    },
                });

                players[elementId] = player;

                const intervalId = window.setInterval(() => {
                    if (typeof player.getCurrentTime !== 'function' || typeof player.seekTo !== 'function') {
                        return;
                    }

                    try {
                        if (player.getCurrentTime() >= 10) {
                            player.seekTo(0, true);
                            player.playVideo();
                        }
                    } catch (e) {
                        // Ignore errors if player is not ready
                    }
                }, 1000);

                intervals.push(intervalId);
            });
        };

        loadYouTubeApi().then(() => {
            // Small delay to ensure DOM is ready
            setTimeout(initializePlayers, 100);
        });

        return () => {
            intervals.forEach(window.clearInterval);
            Object.values(players).forEach((player) => {
                try {
                    player?.destroy?.();
                } catch (e) {}
            });
        };
    }, [reelElementId]);

    return (
        <section className="bg-gradient-to-b from-[#f3f4f6] via-[#eef2ff] to-[#f3f4f6] py-4 sm:py-6 lg:py-8">
            <div className="mx-auto max-w-[1440px]">
                <div className="relative sm:hidden">
                    <Swiper
                        className="pb-2"
                        slidesPerView={1.08}
                        spaceBetween={16}
                        onSwiper={(swiper) => {
                            swiperRef.current = swiper;
                        }}
                    >
                        {reels.map((reel) => (
                            <SwiperSlide key={reel.id} className="!h-auto">
                                <div className="group relative overflow-hidden rounded-lg border border-white/40 bg-white/10 shadow-lg backdrop-blur-xl">
                                    <div className="relative aspect-[9/16] w-full">
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10" />
                                        <div className="absolute inset-0">
                                            <div id={reelElementId(reel.id, 'mobile')} className="h-full w-full" title={reel.title} />
                                        </div>

                                        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/25 via-black/10 to-transparent" />

                                        <div className="absolute inset-x-3 bottom-3 rounded-lg border border-white/35 bg-white/70 p-3 shadow-md backdrop-blur-2xl">
                                            <div className="flex items-center gap-3">
                                                {reel.product && (
                                                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md border border-white/50 bg-white/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
                                                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-amber-600 via-amber-300 to-orange-200 text-xs font-bold text-white">
                                                            {reel.product.name.slice(0, 1)}
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate text-sm font-bold uppercase tracking-wide text-slate-950">{reel.product ? reel.product.name : reel.title}</p>
                                                    {reel.product && <p className="text-sm font-semibold text-emerald-700">{reel.product.price}</p>}
                                                </div>

                                                {reel.product && (
                                                    <Link
                                                        href={route('products.show', reel.product.slug)}
                                                        className="inline-flex items-center gap-2 rounded-md border border-slate-950 bg-slate-950 px-4 py-2 text-sm font-bold text-white shadow-md transition-colors hover:bg-slate-900"
                                                    >
                                                        <ArrowRight className="h-4 w-4" />
                                                        View More
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    <button
                        type="button"
                        onClick={() => swiperRef.current?.slidePrev()}
                        className="absolute left-2 top-1/2 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-[0_12px_28px_rgba(15,23,42,0.18)] backdrop-blur-md transition-transform hover:-translate-y-1/2 hover:scale-105"
                        aria-label="Previous reel"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>

                    <button
                        type="button"
                        onClick={() => swiperRef.current?.slideNext()}
                        className="absolute right-2 top-1/2 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-[0_12px_28px_rgba(15,23,42,0.18)] backdrop-blur-md transition-transform hover:-translate-y-1/2 hover:scale-105"
                        aria-label="Next reel"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </div>

                <div className="hidden sm:grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    {reels.map((reel) => (
                        <div
                            key={reel.id}
                            className="group relative overflow-hidden rounded-lg border border-white/40 bg-white/10 shadow-lg backdrop-blur-xl"
                        >
                            <div className="relative aspect-[9/16] w-full">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10" />
                                <div className="absolute inset-0">
                                    <div id={reelElementId(reel.id, 'desktop')} className="h-full w-full" title={reel.title} />
                                </div>

                                <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/25 via-black/10 to-transparent" />

                                <div className="absolute inset-x-3 bottom-3 rounded-lg border border-white/35 bg-white/70 p-3 shadow-md backdrop-blur-2xl">
                                    <div className="flex items-center gap-3">
                                        {reel.product && (
                                            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md border border-white/50 bg-white/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
                                                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-amber-600 via-amber-300 to-orange-200 text-xs font-bold text-white">
                                                    {reel.product.name.slice(0, 1)}
                                                </div>
                                            </div>
                                        )}

                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-bold uppercase tracking-wide text-slate-950">{reel.product ? reel.product.name : reel.title}</p>
                                            {reel.product && <p className="text-sm font-semibold text-emerald-700">{reel.product.price}</p>}
                                        </div>

                                        {reel.product && (
                                            <Link
                                                href={route('products.show', reel.product.slug)}
                                                className="inline-flex items-center gap-2 rounded-md border border-slate-950 bg-slate-950 px-4 py-2 text-sm font-bold text-white shadow-md transition-colors hover:bg-slate-900"
                                            >
                                                <ArrowRight className="h-4 w-4" />
                                                View More
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
