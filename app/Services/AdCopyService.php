<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Support\Facades\Http;

class AdCopyService
{
    /**
     * Generate Ad Copy using OpenAI API
     */
    public function generate(Product $product, string $audience, string $tone, string $language = 'en'): string
    {
        $apiKey = env('OPENAI_API_KEY');
        
        if (!$apiKey) {
            throw new \Exception('OPENAI_API_KEY is not configured in .env');
        }

        $prompt = "Write a Facebook/Instagram ad copy for the following product:\n" .
                  "Product Name: {$product->name}\n" .
                  "Description: " . strip_tags($product->description) . "\n" .
                  "Target Audience: {$audience}\n" .
                  "Tone: {$tone}\n" .
                  "Language: {$language}\n\n" .
                  "Please provide 3 distinct variations. Use relevant emojis and a strong Call to Action (CTA) in each.";

        $response = Http::timeout(30)->withHeaders([
            'Authorization' => 'Bearer ' . $apiKey,
            'Content-Type' => 'application/json',
        ])->post('https://api.openai.com/v1/chat/completions', [
            'model' => 'gpt-4o-mini',
            'messages' => [
                ['role' => 'system', 'content' => 'You are an expert digital marketing copywriter. Write highly engaging, conversion-focused ad copies.'],
                ['role' => 'user', 'content' => $prompt]
            ],
            'temperature' => 0.7,
        ]);

        if ($response->successful()) {
            return $response->json('choices.0.message.content') ?? 'No content generated.';
        }

        throw new \Exception('Failed to generate ad copy: ' . $response->body());
    }
}
