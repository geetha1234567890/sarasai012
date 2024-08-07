<?php

namespace Modules\Admin\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CorsMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
       
        // Allow from any origin
        // if (isset($_SERVER['HTTP_ORIGIN'])) {
        //     // Set the Access-Control-Allow-Origin header to the request's origin
        //     header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
        //     header('Access-Control-Allow-Credentials: true');
        //     header('Access-Control-Max-Age: 86400'); // Cache for 1 day
        // }

        // // Handle OPTIONS requests for preflight checks
        // if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        //     if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'])) {
        //         // Allow specific HTTP methods
        //         header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
        //     }

        //     if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])) {
        //         // Allow specific headers
        //         header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
        //     }

        //     exit(0);
        // }

        // return $next($request);
        return $next($request)
        ->header('Access-Control-Allow-Origin', '*')
        ->header('Access-Control-Allow-Methods', '*')
        ->header('Access-Control-Allow-Credentials', true)
        ->header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,X-Token-Auth,Authorization')
        ->header('Accept', 'application/json');
    }


}
