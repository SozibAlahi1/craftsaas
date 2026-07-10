<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" data-theme="{{ str(request()->path())->startsWith(['admin', 'dashboard', 'settings', 'profile']) ? 'default' : ($active_theme ?? 'default') }}">
    <head>
        <!-- Google Tag Manager -->
        @if(\App\Models\SiteSetting::getValue('gtm_container_id'))
        <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','{{ \App\Models\SiteSetting::getValue('gtm_container_id') }}');</script>
        @endif
        <!-- End Google Tag Manager -->

        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ \App\Models\SiteSetting::getValue('site_name', 'Believers') }}</title>

        @if($favicon = \App\Models\SiteSetting::getValue('site_favicon'))
            @php
                $faviconUrl = str_starts_with($favicon, 'http') ? $favicon : '/storage/' . $favicon;
                $extension = pathinfo($favicon, PATHINFO_EXTENSION);
                $mimeType = match($extension) {
                    'png' => 'image/png',
                    'gif' => 'image/gif',
                    'ico' => 'image/x-icon',
                    'svg' => 'image/svg+xml',
                    default => 'image/png'
                };
            @endphp
            <link rel="icon" type="{{ $mimeType }}" href="{{ $faviconUrl }}">
            <link rel="shortcut icon" type="{{ $mimeType }}" href="{{ $faviconUrl }}">
        @else
            <link rel="icon" type="image/x-icon" href="/favicon.ico">
        @endif

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

        @routes
        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        <!-- Google Tag Manager (noscript) -->
        @if(\App\Models\SiteSetting::getValue('gtm_container_id'))
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id={{ \App\Models\SiteSetting::getValue('gtm_container_id') }}"
        height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
        @endif
        <!-- End Google Tag Manager (noscript) -->

        @inertia
    </body>
</html>
