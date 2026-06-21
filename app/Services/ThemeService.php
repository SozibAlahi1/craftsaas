<?php

namespace App\Services;

use App\Models\SiteSetting;

class ThemeService
{
    protected string $default = 'classic';

    public function getActiveTheme(): string
    {
        return (string) SiteSetting::getValue('site_theme', $this->default);
    }

    public function setActiveTheme(string $theme): void
    {
        SiteSetting::setValue('site_theme', $theme);
    }

    public function themePath(?string $theme = null): string
    {
        $theme = $theme ?? $this->getActiveTheme();

        return base_path('resources/themes/'.$theme);
    }

    public function themeViewPath(?string $theme = null): string
    {
        return $this->themePath($theme).DIRECTORY_SEPARATOR.'views';
    }

    public function manifestPath(?string $theme = null): string
    {
        return $this->themePath($theme).DIRECTORY_SEPARATOR.'theme.json';
    }

    public function themeExists(?string $theme = null): bool
    {
        return is_dir($this->themePath($theme));
    }

    public function loadManifest(?string $theme = null): array
    {
        $path = $this->manifestPath($theme);
        if (! file_exists($path)) {
            return [];
        }

        $json = file_get_contents($path);
        $data = json_decode($json, true);

        return is_array($data) ? $data : [];
    }

    /**
     * Scan the themes directory and return all discovered themes with their manifests.
     *
     * @return array<int, array{slug: string, name: string, version: string, author: string, description: string, active: bool}>
     */
    public function listThemes(): array
    {
        $themesRoot = base_path('resources/themes');

        if (! is_dir($themesRoot)) {
            return [];
        }

        $active = $this->getActiveTheme();
        $entries = scandir($themesRoot);
        $themes = [];

        foreach ($entries as $entry) {
            // Skip dot entries
            if ($entry === '.' || $entry === '..') {
                continue;
            }

            $fullPath = $themesRoot.DIRECTORY_SEPARATOR.$entry;

            // Only process directories
            if (! is_dir($fullPath)) {
                continue;
            }

            // Must have a theme.json to be considered a valid theme
            $manifestPath = $fullPath.DIRECTORY_SEPARATOR.'theme.json';
            if (! file_exists($manifestPath)) {
                continue;
            }

            $manifest = json_decode(file_get_contents($manifestPath), true);
            if (! is_array($manifest)) {
                continue;
            }

            $themes[] = [
                'slug' => $entry,
                'name' => $manifest['name'] ?? $entry,
                'version' => $manifest['version'] ?? '1.0.0',
                'author' => $manifest['author'] ?? 'Unknown',
                'description' => $manifest['description'] ?? '',
                'active' => $entry === $active,
            ];
        }

        return $themes;
    }
}
