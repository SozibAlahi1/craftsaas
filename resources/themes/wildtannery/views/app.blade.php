<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" data-theme="wildtannery">
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
        <meta name="description" content="Premium Leather Accessories. Where Craft Meets Innovation.">

        <title inertia>{{ config('app.name', 'Wildtannery') }}</title>

        {{-- Google Fonts: Inter and Outfit for a modern, sleek look --}}
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">

        <style>
            /* Wildtannery Theme — Typography overrides */
            html[data-theme='wildtannery'] {
                font-family: 'Inter', system-ui, sans-serif;
            }

            html[data-theme='wildtannery'] h1,
            html[data-theme='wildtannery'] h2,
            html[data-theme='wildtannery'] h3,
            html[data-theme='wildtannery'] .font-serif-display {
                font-family: 'Outfit', 'Inter', sans-serif;
            }

            /* Dark premium background */
            html[data-theme='wildtannery'] body {
                background-color: #000000;
                color: #ffffff;
            }

            /* Scrollbar styling */
            html[data-theme='wildtannery'] ::-webkit-scrollbar {
                width: 8px;
            }
            html[data-theme='wildtannery'] ::-webkit-scrollbar-track {
                background: #111111;
            }
            html[data-theme='wildtannery'] ::-webkit-scrollbar-thumb {
                background: #333333;
                border-radius: 4px;
            }
            html[data-theme='wildtannery'] ::-webkit-scrollbar-thumb:hover {
                background: #555555;
            }

            /* Selection color */
            html[data-theme='wildtannery'] ::selection {
                background: #cba876; /* Gold/Leather Accent */
                color: #000000;
            }

            /* Smooth page transitions */
            html[data-theme='wildtannery'] main {
                animation: wildtannery-fadein 0.5s ease;
            }

            @keyframes wildtannery-fadein {
                from { opacity: 0; }
                to   { opacity: 1; }
            }
        </style>

        @routes
        @viteReactRefresh
        @php
            $themeComponent = "resources/js/themes/wildtannery/pages/{$page['component']}.tsx";
            $viteFiles = ['resources/js/app.tsx'];
            if (file_exists(base_path($themeComponent))) {
                $viteFiles[] = $themeComponent;
            } else {
                $viteFiles[] = "resources/js/pages/{$page['component']}.tsx";
            }
        @endphp
        @vite($viteFiles)
        @inertiaHead
    </head>
    <body class="font-sans antialiased text-white bg-black">
        <!-- Google Tag Manager (noscript) -->
        @if(\App\Models\SiteSetting::getValue('gtm_container_id'))
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id={{ \App\Models\SiteSetting::getValue('gtm_container_id') }}"
        height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
        @endif
        <!-- End Google Tag Manager (noscript) -->

        {{-- Theme: Wildtannery — Premium Leather Brand --}}
        @inertia
    </body>
</html>
