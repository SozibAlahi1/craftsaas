<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiteSetting extends Model
{
    protected $fillable = ['key', 'value'];

    /**
     * Get a setting value by key, with auto-decoding for JSON arrays/objects.
     */
    public static function getValue(string $key, mixed $default = null): mixed
    {
        try {
            $setting = self::where('key', $key)->first();
            if (! $setting) {
                return $default;
            }

            $value = $setting->value;

            if (is_string($value) && (str_starts_with($value, '[') || str_starts_with($value, '{'))) {
                $decoded = json_decode($value, true);
                if (json_last_error() === JSON_ERROR_NONE) {
                    return $decoded;
                }
            }

            return $value;
        } catch (\Throwable $e) {
            return $default;
        }
    }

    /**
     * Set a setting value by key, auto-encoding arrays/objects to JSON.
     */
    public static function setValue(string $key, mixed $value): void
    {
        $storeValue = is_array($value) || is_object($value) ? json_encode($value) : $value;
        self::updateOrCreate(['key' => $key], ['value' => $storeValue]);
    }
}
