import '../css/app.css';

import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { route as routeFn } from 'ziggy-js';
import { initializeTheme } from './hooks/use-appearance';

declare global {
    const route: typeof routeFn;
    interface Window {
        dataLayer: any[];
    }
}

const getSiteName = () => {
    try {
        if (router.page?.props?.settings?.site_name) {
            return router.page.props.settings.site_name;
        }
        const el = document.getElementById('app');
        const page = el?.dataset.page ? JSON.parse(el.dataset.page) : null;
        if (page?.props?.settings?.site_name) {
            return page.props.settings.site_name;
        }
    } catch (e) {
        // ignore
    }
    return import.meta.env.VITE_APP_NAME || 'Shutki Valley';
};

// Pre-glob all theme pages and default pages at build time
const themePageModules = import.meta.glob('./themes/*/pages/**/*.tsx');
const defaultPageModules = import.meta.glob('./pages/**/*.tsx');

createInertiaApp({
    title: (title) => (title ? `${title} - ${getSiteName()}` : getSiteName()),

    resolve: (name) => {
        // Read the active theme from the initial Inertia page data
        // embedded in the root element before React renders.
        const el = document.getElementById('app');
        const initialPage = el?.dataset.page ? JSON.parse(el.dataset.page) : {};
        const theme: string | undefined = initialPage?.props?.settings?.site_theme;

        // Only override storefront pages — never admin/auth/dashboard pages
        const isStorefrontPage = !name.startsWith('admin/') && !name.startsWith('auth/') && !name.startsWith('settings/') && name !== 'dashboard';

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
let previousCart: any = null;

router.on('navigate', (event) => {
    if (typeof window !== 'undefined') {
        const page = event.detail.page;

        // Dynamically set HTML data-theme attribute on navigation
        const name = page.component;
        const isStorefrontPage = !name.startsWith('admin/') && !name.startsWith('auth/') && !name.startsWith('settings/') && name !== 'dashboard';
        const theme = (page.props as any)?.settings?.site_theme ?? 'default';

        console.log('[Theme Debug] Component Name:', name, 'isStorefrontPage:', isStorefrontPage, 'theme:', theme);

        if (isStorefrontPage) {
            document.documentElement.setAttribute('data-theme', theme);
        } else {
            document.documentElement.setAttribute('data-theme', 'default');
        }

        const pixels = (page.props.pixels as any[]) || [];

        if (pixels.length > 0 && !isPixelInitialized) {
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

            pixels.forEach((pixel) => {
                window.fbq('init', pixel.pixel_id);
            });
            isPixelInitialized = true;
        }

        if (window.fbq) {
            window.fbq('track', 'PageView');
        }

        // --- GOOGLE TAG MANAGER (GTM) EVENT TRACKING ---
        const gtmContainerId = (page.props.settings as any)?.gtm_container_id;

        if (gtmContainerId) {
            window.dataLayer = window.dataLayer || [];

            // 1. page_view Event
            window.dataLayer.push({
                event: 'page_view',
                page_path: window.location.pathname,
                page_title: document.title,
                page_location: window.location.href,
            });

            // 2. view_item Event (Product details page)
            const product = page.props.product as any;
            if (product && (name === 'products/show' || name.endsWith('products/show'))) {
                const productPrice = parseFloat(String(product.price).replace(/[^\d]/g, ''));
                window.dataLayer.push({ ecommerce: null });
                window.dataLayer.push({
                    event: 'view_item',
                    ecommerce: {
                        currency: 'BDT',
                        value: productPrice,
                        items: [
                            {
                                item_id: String(product.id),
                                item_name: product.name,
                                price: productPrice,
                                item_category: product.category?.name || 'General',
                            }
                        ]
                    }
                });
            }

            // 3. begin_checkout Event (Checkout index page)
            if (name === 'checkout/index') {
                const cart = page.props.cart || {};
                const cartItems = Object.values(cart).map((item: any) => {
                    const price = parseFloat(String(item.price).replace(/[^\d]/g, ''));
                    return {
                        item_id: item.product_id ? String(item.product_id) : item.slug,
                        item_name: item.name,
                        price: price,
                        quantity: parseInt(item.quantity || 1),
                        item_variant: (item.color || item.size) ? `${item.color || ''} ${item.size || ''}`.trim() : undefined
                    };
                });
                const totalValue = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

                window.dataLayer.push({ ecommerce: null });
                window.dataLayer.push({
                    event: 'begin_checkout',
                    ecommerce: {
                        currency: 'BDT',
                        value: totalValue,
                        items: cartItems
                    }
                });
            }



            // 5. add_to_cart / remove_from_cart Events (by comparing carts)
            const currentCart = page.props.cart || {};

            const normalizeCart = (cartData: any) => {
                if (!cartData) return {};
                if (Array.isArray(cartData)) return {}; // Empty cart is returned as [] from PHP
                return cartData;
            };

            if (previousCart !== null) {
                const prevNormalized = normalizeCart(previousCart);
                const currNormalized = normalizeCart(currentCart);

                const addedItems: any[] = [];
                const removedItems: any[] = [];

                // Compare to find additions
                Object.keys(currNormalized).forEach(key => {
                    const currItem = currNormalized[key];
                    const prevItem = prevNormalized[key];
                    const price = parseFloat(String(currItem.price).replace(/[^\d]/g, ''));

                    if (!prevItem) {
                        addedItems.push({
                            item_id: currItem.product_id ? String(currItem.product_id) : currItem.slug,
                            item_name: currItem.name,
                            price: price,
                            quantity: parseInt(currItem.quantity || 1),
                            item_variant: (currItem.color || currItem.size) ? `${currItem.color || ''} ${currItem.size || ''}`.trim() : undefined
                        });
                    } else if (currItem.quantity > prevItem.quantity) {
                        addedItems.push({
                            item_id: currItem.product_id ? String(currItem.product_id) : currItem.slug,
                            item_name: currItem.name,
                            price: price,
                            quantity: parseInt(currItem.quantity) - parseInt(prevItem.quantity),
                            item_variant: (currItem.color || currItem.size) ? `${currItem.color || ''} ${currItem.size || ''}`.trim() : undefined
                        });
                    }
                });

                // Compare to find removals
                Object.keys(prevNormalized).forEach(key => {
                    const prevItem = prevNormalized[key];
                    const currItem = currNormalized[key];
                    const price = parseFloat(String(prevItem.price).replace(/[^\d]/g, ''));

                    if (!currItem) {
                        removedItems.push({
                            item_id: prevItem.product_id ? String(prevItem.product_id) : prevItem.slug,
                            item_name: prevItem.name,
                            price: price,
                            quantity: parseInt(prevItem.quantity || 1),
                            item_variant: (prevItem.color || prevItem.size) ? `${prevItem.color || ''} ${prevItem.size || ''}`.trim() : undefined
                        });
                    } else if (currItem.quantity < prevItem.quantity) {
                        removedItems.push({
                            item_id: prevItem.product_id ? String(prevItem.product_id) : prevItem.slug,
                            item_name: prevItem.name,
                            price: price,
                            quantity: parseInt(prevItem.quantity) - parseInt(currItem.quantity),
                            item_variant: (prevItem.color || prevItem.size) ? `${prevItem.color || ''} ${prevItem.size || ''}`.trim() : undefined
                        });
                    }
                });

                if (addedItems.length > 0) {
                    const addedValue = addedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                    window.dataLayer.push({ ecommerce: null });
                    window.dataLayer.push({
                        event: 'add_to_cart',
                        ecommerce: {
                            currency: 'BDT',
                            value: addedValue,
                            items: addedItems
                        }
                    });
                }

                if (removedItems.length > 0) {
                    const removedValue = removedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                    window.dataLayer.push({ ecommerce: null });
                    window.dataLayer.push({
                        event: 'remove_from_cart',
                        ecommerce: {
                            currency: 'BDT',
                            value: removedValue,
                            items: removedItems
                        }
                    });
                }
            }

            // Sync previousCart for the next navigation
            previousCart = JSON.parse(JSON.stringify(currentCart));
        }
    }
});
