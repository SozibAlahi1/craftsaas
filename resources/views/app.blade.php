<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" data-theme="{{ str(request()->path())->startsWith(['admin', 'dashboard', 'settings', 'profile']) ? 'default' : ($active_theme ?? 'default') }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ \App\Models\SiteSetting::getValue('site_name', 'Believers') }}</title>

        @if(\App\Models\SiteSetting::getValue('site_favicon'))
            <link rel="icon" href="{{ \Illuminate\Support\Facades\Storage::disk('public')->url(\App\Models\SiteSetting::getValue('site_favicon')) }}">
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
        @inertia
    </body>
</html>
