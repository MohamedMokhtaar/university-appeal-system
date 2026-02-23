<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AcademicStructureController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\FacultyClassController;
use App\Http\Controllers\FacultyIssueController;
use App\Http\Controllers\FacultyNotificationController;
use App\Http\Controllers\StudentManagementController;

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

Route::prefix('student-management')->group(function () {
    Route::get('/schools', [StudentManagementController::class, 'listSchools']);
    Route::post('/schools', [StudentManagementController::class, 'createSchool']);
    Route::put('/schools/{sch_no}', [StudentManagementController::class, 'updateSchool']);
    Route::delete('/schools/{sch_no}', [StudentManagementController::class, 'deleteSchool']);

    Route::get('/parents', [StudentManagementController::class, 'listParents']);
    Route::post('/parents', [StudentManagementController::class, 'createParent']);
    Route::put('/parents/{parent_no}', [StudentManagementController::class, 'updateParent']);
    Route::delete('/parents/{parent_no}', [StudentManagementController::class, 'deleteParent']);
});

Route::prefix('academic-structure')->group(function () {
    Route::get('/faculties', [AcademicStructureController::class, 'listFaculties']);
    Route::post('/faculties', [AcademicStructureController::class, 'createFaculty']);
    Route::put('/faculties/{faculty_no}', [AcademicStructureController::class, 'updateFaculty']);
    Route::delete('/faculties/{faculty_no}', [AcademicStructureController::class, 'deleteFaculty']);

    Route::get('/departments', [AcademicStructureController::class, 'listDepartments']);
    Route::post('/departments', [AcademicStructureController::class, 'createDepartment']);
    Route::put('/departments/{dept_no}', [AcademicStructureController::class, 'updateDepartment']);
    Route::delete('/departments/{dept_no}', [AcademicStructureController::class, 'deleteDepartment']);

    Route::get('/semesters', [AcademicStructureController::class, 'listSemesters']);
    Route::post('/semesters', [AcademicStructureController::class, 'createSemester']);
    Route::put('/semesters/{sem_no}', [AcademicStructureController::class, 'updateSemester']);
    Route::delete('/semesters/{sem_no}', [AcademicStructureController::class, 'deleteSemester']);

    Route::get('/academics', [AcademicStructureController::class, 'listAcademics']);
    Route::post('/academics', [AcademicStructureController::class, 'createAcademic']);
    Route::put('/academics/{acy_no}', [AcademicStructureController::class, 'updateAcademic']);
    Route::delete('/academics/{acy_no}', [AcademicStructureController::class, 'deleteAcademic']);

    Route::get('/subjects', [AcademicStructureController::class, 'listSubjects']);
    Route::post('/subjects', [AcademicStructureController::class, 'createSubject']);
    Route::put('/subjects/{sub_no}', [AcademicStructureController::class, 'updateSubject']);
    Route::delete('/subjects/{sub_no}', [AcademicStructureController::class, 'deleteSubject']);
});

Route::get('/profile/me', [ProfileController::class, 'me']);
