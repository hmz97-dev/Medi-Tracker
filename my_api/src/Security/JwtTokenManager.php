<?php

namespace App\Security;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class JwtTokenManager
{
    public function __construct(
        private readonly string $jwtSecret,
        private readonly int $ttlSeconds = 86400,
    ) {
    }

    public function createToken(int $userId, string $email, array $roles = []): string
    {
        $now = time();
        $payload = [
            'sub' => $userId,
            'email' => $email,
            'roles' => $roles,
            'iat' => $now,
            'exp' => $now + $this->ttlSeconds,
        ];

        return JWT::encode($payload, $this->jwtSecret, 'HS256');
    }

    public function decodeToken(string $token): array
    {
        $decoded = JWT::decode($token, new Key($this->jwtSecret, 'HS256'));

        return (array) $decoded;
    }
}
