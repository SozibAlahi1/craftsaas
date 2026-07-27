<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class SlugService
{
    /**
     * Generate an English slug from any text (including Bengali).
     */
    public static function make(string $text): string
    {
        // If the text is already ASCII-only, just slug it directly
        if (! preg_match('/[^\x00-\x7F]/', $text)) {
            return Str::slug($text);
        }

        // Try translating using Google Translate API
        try {
            $response = Http::timeout(3)
                ->connectTimeout(2)
                ->get('https://translate.googleapis.com/translate_a/single', [
                    'client' => 'gtx',
                    'sl' => 'auto',
                    'tl' => 'en',
                    'dt' => 't',
                    'q' => $text,
                ]);

            if ($response->successful()) {
                $result = $response->json();
                $translatedText = $result[0][0][0] ?? null;

                if ($translatedText) {
                    return Str::slug($translatedText);
                }
            }
        } catch (\Exception $e) {
            // Log or ignore translation errors
        }

        // Fallback 1: Use PHP Intl Transliterator if available
        if (function_exists('transliterator_transliterate')) {
            try {
                $transliterated = transliterator_transliterate('Any-Latin; Latin-ASCII; Lower()', $text);
                if ($transliterated) {
                    return Str::slug($transliterated);
                }
            } catch (\Exception $e) {
                // Ignore transliteration errors
            }
        }

        // Fallback 2: Laravel standard slug
        return Str::slug($text);
    }
}
