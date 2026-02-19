<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        // 1. Input Validation
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        $username = trim($request->username);
        $password = $request->password;

        // 2. Query User joined with Roles
        $user = DB::table('users')
            ->join('roles', 'users.role_id', '=', 'roles.role_id')
            ->leftJoin('teachers', 'teachers.user_id', '=', 'users.user_id')
            ->select(
                'users.user_id',
                'users.username',
                DB::raw('COALESCE(teachers.name, users.username) AS display_name'),
                'users.password_hash',
                'users.status',
                'users.Accees_channel',
                'roles.role_name'
            )
            ->where('users.username', $username)
            ->first();

        // 3. Check if user exists
        if (!$user) {
            Log::info("Login Failed: User '{$username}' not found.");
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ], 404);
        }

        // 4. Check Password using SHA256
        $inputHash = hash('sha256', $password);
        $passwordMatches = ($user->password_hash === $inputHash);

        // --- DEBUG LOGGING (SAFE) ---
        Log::info("Login Attempt for '{$username}':", [
            'role' => $user->role_name,
            'status' => $user->status,
            'channel' => $user->Accees_channel,
            'pass_match' => $passwordMatches ? 'YES' : 'NO'
        ]);

        if (!$passwordMatches) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid password'
            ], 401);
        }

        // 5. Check Status
        if ($user->status !== 'Active') {
            return response()->json([
                'success' => false,
                'message' => 'Account inactive'
            ], 403);
        }

        // 6. Block APP-only users from Web Login
        if ($user->Accees_channel === 'APP') {
            return response()->json([
                'success' => false,
                'message' => 'This account is APP only'
            ], 403);
        }

        // 7. Login Success
        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'user' => [
                'user_id' => $user->user_id,
                'username' => $user->username,
                'display_name' => $user->display_name,
                'role_name' => $user->role_name,
                'status' => $user->status,
                'Accees_channel' => $user->Accees_channel
            ]
        ]);
    }
}
