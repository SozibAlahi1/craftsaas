<?php

use App\Models\SiteSetting;

/*
|--------------------------------------------------------------------------
| Fraud Checker BD Courier - Configuration
|--------------------------------------------------------------------------
| Credentials are stored in the SiteSetting database table to allow
| runtime updates from the admin panel without modifying .env files.
|
| Keys used in SiteSetting:
|   fraud_pathao_user, fraud_pathao_password
|   fraud_steadfast_user, fraud_steadfast_password
|   fraud_redx_phone, fraud_redx_password
|   fraud_paperfly_user, fraud_paperfly_password
|   fraud_carrybee_phone, fraud_carrybee_password
*/

$setting = fn(string $key, ?string $envFallback = null) => rescue(
    fn() => SiteSetting::getValue($key) ?: ($envFallback ? env($envFallback) : null),
    $envFallback ? env($envFallback) : null,
    false,
);

return [
    'pathao' => [
        'user'     => $setting('fraud_pathao_user', 'PATHAO_USER'),
        'password' => $setting('fraud_pathao_password', 'PATHAO_PASSWORD'),
    ],

    'redx' => [
        'phone'    => $setting('fraud_redx_phone', 'REDX_PHONE'),
        'password' => $setting('fraud_redx_password', 'REDX_PASSWORD'),
    ],

    'steadfast' => [
        'user'     => $setting('fraud_steadfast_user', 'STEADFAST_USER'),
        'password' => $setting('fraud_steadfast_password', 'STEADFAST_PASSWORD'),
    ],

    'paperfly' => [
        'user'     => $setting('fraud_paperfly_user', 'PAPERFLY_USER'),
        'password' => $setting('fraud_paperfly_password', 'PAPERFLY_PASSWORD'),
    ],

    'carrybee' => [
        'phone'    => $setting('fraud_carrybee_phone', 'CARRYBEE_PHONE'),
        'password' => $setting('fraud_carrybee_password', 'CARRYBEE_PASSWORD'),
    ],
];
