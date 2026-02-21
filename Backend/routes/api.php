<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\FacultyClassController;
use App\Http\Controllers\FacultyIssueController;
use App\Http\Controllers\FacultyNotificationController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::get('/test', function() {
        return response()->json(['success' => true, 'message' => 'API is working']);
    });
});

Route::prefix('faculty')->group(function () {
    // Class Management
    Route::get('/classes', [FacultyClassController::class, 'index']);
    Route::get('/students', [FacultyClassController::class, 'getAllStudents']);
    Route::put('/classes/{cls_no}/leader', [FacultyClassController::class, 'updateLeader']);
    Route::post('/students/migrate', [FacultyClassController::class, 'migrateStudent']);
    Route::get('/classes/{cls_no}/students', [FacultyClassController::class, 'getClassStudents']);

    // Issue Management
    Route::get('/issues', [FacultyIssueController::class, 'index']);
    Route::get('/issues/stats', [FacultyIssueController::class, 'getDashboardStats']);
    Route::get('/issues/{id}', [FacultyIssueController::class, 'show']);
    Route::put('/issues/{id}/status', [FacultyIssueController::class, 'updateStatus']);

    // Notifications
    Route::get('/notifications/{user_id}', [FacultyNotificationController::class, 'index']);
    Route::put('/notifications/{not_no}/read', [FacultyNotificationController::class, 'markAsRead']);
});

Route::get('/profile/me', [ProfileController::class, 'me']);
