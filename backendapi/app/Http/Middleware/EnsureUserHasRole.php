<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Auth;

class EnsureUserHasRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $roles): Response
    {
        $user = Auth::guard('admin-api')->user();
        $user->load('roles');
        if (!$user->roles->pluck('role_name')->intersect($roles)->count()) {
            return response()->json(['error' => 'Access denied. You do not have the required permissions.'], 403);
        }
        return $next($request);

    }
}
