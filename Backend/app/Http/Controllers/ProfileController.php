<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProfileController extends Controller
{
    public function me(Request $request)
    {
        // For temporary auth, use X-USER-ID header
        $userId = $request->header('X-USER-ID');

        if (!$userId) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 401);
        }

        // 1. Get base user info joined with roles
        $user = DB::table('users')
            ->join('roles', 'users.role_id', '=', 'roles.role_id')
            ->select('users.*', 'roles.role_name')
            ->where('users.user_id', $userId)
            ->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ], 404);
        }

        $fullName = $user->username;
        $source = 'users';
        $teacherDetails = null;

        // 2. Try find in students
        $student = DB::table('students')->where('user_id', $userId)->first();
        if ($student) {
            $fullName = $student->name;
            $source = 'students';
        } else {
            // 3. Try find in teachers
            $teacher = DB::table('teachers')->where('user_id', $userId)->first();
            if ($teacher) {
                $fullName = $teacher->name;
                $source = 'teachers';
                $teacherDetails = [
                    'name'       => $teacher->name,
                    'tell'       => $teacher->tell,
                    'email'      => $teacher->email,
                    'teacher_id' => $teacher->teacher_id,
                    'gender'     => $teacher->gender,
                    'status'     => $teacher->status,
                ];
            }
        }

        return response()->json([
            'success' => true,
            'profile' => [
                'user_id'         => $user->user_id,
                'role_id'         => $user->role_id,
                'role_name'       => $user->role_name,
                'username'        => $user->username,
                'full_name'       => $fullName,
                'source'          => $source,
                'Accees_channel'  => $user->Accees_channel,
                'teacher_details' => $teacherDetails,
            ]
        ]);
    }
}
