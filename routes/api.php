<?php

use App\Http\Controllers\Api\CourierWebhookController;
use App\Http\Controllers\WebhookController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Webhooks
Route::get('/webhook/whatsapp', [WebhookController::class, 'verifyWhatsapp']);
Route::post('/webhook/whatsapp', [WebhookController::class, 'handleWhatsapp']);

Route::prefix('webhooks/courier')->group(function () {
    Route::post('/steadfast', [CourierWebhookController::class, 'steadfast']);
});
