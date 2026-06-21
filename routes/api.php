<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Webhooks
Route::get('/webhook/whatsapp', [App\Http\Controllers\WebhookController::class, 'verifyWhatsapp']);
Route::post('/webhook/whatsapp', [App\Http\Controllers\WebhookController::class, 'handleWhatsapp']);

Route::prefix('webhooks/courier')->group(function () {
    Route::post('/steadfast', [\App\Http\Controllers\Api\CourierWebhookController::class, 'steadfast']);
});
