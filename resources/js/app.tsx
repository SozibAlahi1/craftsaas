import '../css/app.css';

import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { route as routeFn } from 'ziggy-js';
import { initializeTheme } from './hooks/use-appearance';

declare global {
    const route: typeof routeFn;
}

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// Pre-glob all theme pages and default pages at build time
const themePageModules = import.meta.glob('./themes/*/pages/**/*.tsx');
const defaultPageModules = import.meta.glob('./pages/**/*.tsx');

createInertiaApp({
    title: (title) => `${title} - ${appName}`,

    resolve: (name) => {
        // Read the active theme from the initial Inertia page data
        // embedded in the root element before React renders.
        const el = document.getElementById('app');
        const initialPage = el?.dataset.page ? JSON.parse(el.dataset.page) : {};
        const theme: string | undefined = initialPage?.props?.settings?.site_theme;

        // Only override storefront pages — never admin/auth/dashboard pages
        const isStorefrontPage =
            !name.startsWith('admin/') &&
            !name.startsWith('auth/') &&
            !name.startsWith('settings/') &&
            name !== 'dashboard';

        if (theme && isStorefrontPage) {
            const themePath = `./themes/${theme}/pages/${name}.tsx`;
            if (themePageModules[themePath]) {
                return themePageModules[themePath]() as any;
            }
        }

        // Fall back to default pages
        return resolvePageComponent(`./pages/${name}.tsx`, defaultPageModules);
    },

    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(<App {...props} />);
    },

    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();

// Initialize Tracking and Pixels
let isPixelInitialized = false;

router.on('navigate', (event) => {
    if (typeof window !== 'undefined') {
        const page = event.detail.page;
        const pixels = (page.props.pixels as any[]) || [];
        
        if (pixels.length > 0 && !isPixelInitialized) {
            !function(f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
                if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                
            pixels.forEach((pixel) => {
                window.fbq('init', pixel.pixel_id);
            });
            isPixelInitialized = true;
        }
        
        if (window.fbq) {
            window.fbq('track', 'PageView');
        }
    }
});
