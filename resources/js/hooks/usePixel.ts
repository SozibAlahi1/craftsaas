import { usePage } from '@inertiajs/react';
import { useCallback, useEffect, useRef } from 'react';

// Extend window object to include fbq
declare global {
    interface Window {
        fbq: any;
        _fbq: any;
    }
}

interface Pixel {
    id: number;
    pixel_id: string;
}

export function usePixel() {
    const { pixels } = usePage().props as unknown as { pixels: Pixel[] };
    const initialized = useRef(false);

    // Initialize pixels
    useEffect(() => {
        if (!pixels || pixels.length === 0 || initialized.current) return;

        // Base Facebook Pixel Code
        !(function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
            if (f.fbq) return;
            n = f.fbq = function () {
                n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
            };
            if (!f._fbq) f._fbq = n;
            n.push = n;
            n.loaded = !0;
            n.version = '2.0';
            n.queue = [];
            t = b.createElement(e);
            t.async = !0;
            t.src = v;
            s = b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t, s);
        })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

        // Initialize each active pixel
        pixels.forEach((pixel) => {
            window.fbq('init', pixel.pixel_id);
        });

        initialized.current = true;
    }, [pixels]);

    /**
     * Track a standard or custom event
     */
    const trackEvent = useCallback((eventName: string, data: any = {}) => {
        if (typeof window !== 'undefined' && window.fbq) {
            window.fbq('track', eventName, data);
        }
    }, []);

    /**
     * Track custom event
     */
    const trackCustom = useCallback((eventName: string, data: any = {}) => {
        if (typeof window !== 'undefined' && window.fbq) {
            window.fbq('trackCustom', eventName, data);
        }
    }, []);

    return { trackEvent, trackCustom };
}
