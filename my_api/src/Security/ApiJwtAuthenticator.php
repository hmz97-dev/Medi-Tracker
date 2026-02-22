<?php

namespace App\Security;

use App\Entity\User;
use App\Repository\UserRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Http\Authenticator\AbstractAuthenticator;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\SelfValidatingPassport;

class ApiJwtAuthenticator extends AbstractAuthenticator
{
    public function __construct(
        private readonly JwtTokenManager $jwtTokenManager,
        private readonly UserRepository $userRepository,
    ) {
    }

    public function supports(Request $request): ?bool
    {
        if ($request->getMethod() === Request::METHOD_OPTIONS) {
            return false;
        }

        $path = $request->getPathInfo();

        if ($path === '/api/auth/login' || $path === '/api/auth/register') {
            return false;
        }

        return str_starts_with($path, '/api');
    }

    public function authenticate(Request $request): SelfValidatingPassport
    {
        $header = $request->headers->get('Authorization', '');

        if (!preg_match('/^Bearer\s+(.+)$/i', $header, $matches)) {
            throw new AuthenticationException('Token manquant.');
        }

        $token = trim($matches[1]);

        try {
            $payload = $this->jwtTokenManager->decodeToken($token);
        } catch (\Throwable) {
            throw new AuthenticationException('Token invalide ou expiré.');
        }

        $userId = isset($payload['sub']) ? (int) $payload['sub'] : 0;
        if ($userId <= 0) {
            throw new AuthenticationException('Token invalide.');
        }

        return new SelfValidatingPassport(
            new UserBadge((string) $userId, function (string $identifier): ?User {
                return $this->userRepository->find((int) $identifier);
            })
        );
    }

    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $firewallName): ?Response
    {
        return null;
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): ?Response
    {
        return new JsonResponse([
            'error' => 'Non autorisé',
            'message' => $exception->getMessageKey(),
        ], Response::HTTP_UNAUTHORIZED);
    }

    public function start(Request $request, ?AuthenticationException $authException = null): Response
    {
        return new JsonResponse([
            'error' => 'Authentification requise',
        ], Response::HTTP_UNAUTHORIZED);
    }
}
