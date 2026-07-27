<?php

namespace App\Services;

use Illuminate\Support\Str;

class SlugService
{
    /**
     * Generate an English slug from any text (including Bengali).
     */
    public static function make(string $text): string
    {
        // If the text is already plain ASCII, just slugify it.
        if (! preg_match('/[^\x00-\x7F]/', $text)) {
            return Str::slug($text);
        }

        // Try PHP Intl Transliterator to convert to Latin characters.
        if (function_exists('transliterator_transliterate')) {
            try {
                // "Any-Latin; Latin-ASCII; Lower()" converts any script to Latin, then ASCII.
                $transliterated = transliterator_transliterate('Any-Latin; Latin-ASCII; Lower()', $text);
                if ($transliterated) {
                    return Str::slug($transliterated);
                }
            } catch (\Exception $e) {
                // If transliteration throws, fall back to Laravel's slug.
            }
        }

        // Final fallback – Laravel's slug which will strip unknown chars.
        return Str::slug($text);
    }
}
