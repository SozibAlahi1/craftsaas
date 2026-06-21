<?php

namespace App\Services\SMS;

interface SMSServiceInterface
{
    /**
     * Send an SMS message to a phone number.
     *
     * @param string $phone
     * @param string $message
     * @return array Returns an array with 'success' (bool) and 'response' (string|array)
     */
    public function send(string $phone, string $message): array;
}
