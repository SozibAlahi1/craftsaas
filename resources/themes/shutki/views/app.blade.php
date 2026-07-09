<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" data-theme="shutki">
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
        <meta name="description" content="বাংলাদেশের সেরা শুকটি মাছের অনলাইন বাজার। তাজা ও মানসম্পন্ন শুকটি মাছ সরাসরি আপনার দরজায়।">

        <title inertia>{{ config('app.name', 'শুকটি বাজার') }}</title>

        {{-- Google Fonts: Hind Siliguri for Bengali, Lora for headings --}}
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Lora:ital,wght@0,600;0,700;1,600&family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">

        <style>
            /* শুকটি থিম — Typography overrides */
            html[data-theme='shutki'] {
                font-family: 'Inter', 'Hind Siliguri', system-ui, sans-serif;
            }

            html[data-theme='shutki'] h1,
            html[data-theme='shutki'] h2,
            html[data-theme='shutki'] .font-serif-display {
                font-family: 'Lora', 'Hind Siliguri', Georgia, serif;
            }

            /* Warm parchment texture effect on body */
            html[data-theme='shutki'] body {
                background-color: hsl(36, 28%, 96%);
                background-image:
                    radial-gradient(ellipse at 20% 0%, hsl(43, 92%, 88%, 0.25) 0%, transparent 50%),
                    radial-gradient(ellipse at 80% 100%, hsl(195, 55%, 82%, 0.18) 0%, transparent 50%);
            }

            /* Scrollbar styling */
            html[data-theme='shutki'] ::-webkit-scrollbar {
                width: 8px;
            }
            html[data-theme='shutki'] ::-webkit-scrollbar-track {
                background: hsl(36, 22%, 90%);
            }
            html[data-theme='shutki'] ::-webkit-scrollbar-thumb {
                background: hsl(25, 45%, 50%);
                border-radius: 4px;
            }
            html[data-theme='shutki'] ::-webkit-scrollbar-thumb:hover {
                background: hsl(25, 55%, 38%);
            }

            /* Selection color */
            html[data-theme='shutki'] ::selection {
                background: hsl(43, 92%, 52%, 0.35);
                color: hsl(25, 35%, 14%);
            }

            /* Smooth page transitions */
            html[data-theme='shutki'] main {
                animation: shutki-fadein 0.4s ease;
            }

            @keyframes shutki-fadein {
                from { opacity: 0; transform: translateY(8px); }
                to   { opacity: 1; transform: translateY(0); }
            }

            /* "নতুন" / "সেরা" badge color override */
            html[data-theme='shutki'] .badge-new {
                background: hsl(43, 92%, 52%);
                color: hsl(25, 35%, 12%);
            }

            /* Price tag styling */
            html[data-theme='shutki'] .price-tag,
            html[data-theme='shutki'] [class*="font-black"][class*="text-slate-9"] {
                color: hsl(25, 72%, 30%);
            }
        </style>

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

        {{-- Theme: শুকটি বাজার — traditional Bangladeshi dried fish market --}}
        @inertia
    </body>
</html>
