<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

try {
    // Helper to get ID by name/field
    function findId($table, $field, $values, $idField) {
        $rows = DB::table($table)->get();
        foreach ($rows as $row) {
            foreach ($values as $v) {
                if ($row->$field == $v) return $row->$idField;
            }
        }
        return null;
    }

    $fRoleId = findId('roles', 'role_name', ['Faculty'], 'role_id') ?: 4;
    $sRoleId = findId('roles', 'role_name', ['Student'], 'role_id') ?: 5;
    
    $dNo = findId('departments', 'name', ['Information Technology', 'IT'], 'dept_no');
    $cpNo = findId('campuses', 'name', ['Main Campus', 'Main'], 'camp_no');
    $smNo = findId('semesters', 'semister_name', ['Semester 1 2024', 'Sem 1 2024'], 'sem_no');
    $ayNo = findId('academics', 'active_year', ['2023-2024', '23-24'], 'acy_no');

    if (!$dNo || !$cpNo || !$smNo || !$ayNo) {
        throw new \Exception("Missing background data: d=$dNo, cp=$cpNo, sm=$smNo, ay=$ayNo");
    }

    $classNames = ['CS-Y1', 'CS-Y2', 'CS-Y3'];
    foreach ($classNames as $name) {
        DB::table('classes')->updateOrInsert(['cl_name' => $name], ['dept_no' => $dNo, 'camp_no' => $cpNo]);
        $clsNo = DB::table('classes')->where('cl_name', '=', $name)->first()->cls_no;
        
        for ($i = 1; $i <= 10; $i++) {
            $username = "std_" . $clsNo . "_" . $i;
            DB::table('users')->updateOrInsert(['username' => $username], [
                'role_id' => $sRoleId,
                'full_name' => "Student $name $i",
                'password_hash' => hash('sha256', 'password123'),
                'status' => 'Active',
                'created_at' => now()
            ]);
            $uId = DB::table('users')->where('username', '=', $username)->first()->user_id;
            
            DB::table('students')->updateOrInsert(['user_id' => $uId], [
                'student_id' => "STD_" . $clsNo . $i . rand(100, 999),
                'name' => "Student $name $i",
                'status' => 'Active',
                'created_at' => now()
            ]);
            $sId = DB::table('students')->where('user_id', '=', $uId)->first()->std_id;
            
            DB::table('studet_classes')->updateOrInsert(['cls_no' => $clsNo, 'std_id' => $sId], [
                'sem_no' => $smNo,
                'acy_no' => $ayNo,
                'created_at' => now()
            ]);
            
            if ($i === 1) {
                DB::table('leaders')->updateOrInsert(['cls_no' => $clsNo], ['std_id' => $sId]);
            }
        }
    }
    echo "SEED_SUCCESS";
} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage();
}
