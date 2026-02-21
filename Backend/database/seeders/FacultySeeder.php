<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class FacultySeeder extends Seeder
{
    public function run(): void
    {
        DB::table('roles')->updateOrInsert(array('role_name' => 'Faculty'), array('status' => 'Active'));
        DB::table('roles')->updateOrInsert(array('role_name' => 'Student'), array('status' => 'Active'));
        $facultyRoleId = DB::table('roles')->where('role_name', 'Faculty')->value('role_id');
        $studentRoleId = DB::table('roles')->where('role_name', 'Student')->value('role_id');

        DB::table('faculties')->updateOrInsert(array('name' => 'Faculty of CS'), array());
        $fNo = DB::table('faculties')->where('name', 'Faculty of CS')->value('faculty_no');

        DB::table('departments')->updateOrInsert(array('name' => 'IT', 'faculty_no' => $fNo), array());
        $dNo = DB::table('departments')->where('name', 'IT')->value('dept_no');

        DB::table('campuses')->updateOrInsert(array('name' => 'Main'), array());
        $cpNo = DB::table('campuses')->where('name', 'Main')->value('camp_no');

        DB::table('semesters')->updateOrInsert(array('semister_name' => 'Sem 1 2024'), array());
        $smNo = DB::table('semesters')->where('semister_name', 'Sem 1 2024')->value('sem_no');

        DB::table('academics')->updateOrInsert(array('active_year' => '23-24'), array('start_date' => '2023-09-01', 'end_date' => '2024-06-30'));
        $ayNo = DB::table('academics')->where('active_year' => '23-24')->value('acy_no');

        DB::table('categories')->updateOrInsert(array('cat_name' => 'Tech'), array());
        $ctNo = DB::table('categories')->where('cat_name' => 'Tech')->value('cat_no');

        $classNames = array('CS-Y1', 'CS-Y2', 'CS-Y3');
        foreach ($classNames as $name) {
            DB::table('classes')->updateOrInsert(array('cl_name' => $name), array('dept_no' => $dNo, 'camp_no' => $cpNo));
        }
        $clsNos = DB::table('classes')->whereIn('cl_name', $classNames)->pluck('cls_no')->toArray();

        $issueNames = array('Broken Projector', 'AC Issue', 'Board Markers', 'Broken chairs');
        foreach ($issueNames as $name) {
            DB::table('class_issues')->updateOrInsert(array('issue_name' => $name), array('cat_no' => $ctNo));
        }
        $tplIds = DB::table('class_issues')->pluck('cl_issue_id')->toArray();

        $fUserId = DB::table('users')->where('username', 'faculty')->value('user_id');
        if (!$fUserId) {
            $fUserId = DB::table('users')->insertGetId(array('role_id' => $facultyRoleId, 'full_name' => 'Dr. Jane Smith', 'username' => 'faculty', 'password_hash' => hash('sha256', 'password123'), 'status' => 'Active', 'created_at' => now()));
        }

        $stts = array('Pending', 'In Review', 'Resolved', 'Completed');

        foreach ($clsNos as $clsNo) {
            for ($i = 1; $i <= 10; $i++) {
                $user = "std_{$clsNo}_{$i}";
                $uId = DB::table('users')->where('username', $user)->value('user_id');
                if (!$uId) {
                    $uId = DB::table('users')->insertGetId(array('role_id' => $studentRoleId, 'full_name' => "Student {$clsNo} {$i}", 'username' => $user, 'password_hash' => hash('sha256', 'password123'), 'status' => 'Active', 'created_at' => now()));
                }
                $sId = DB::table('students')->where('user_id', $uId)->value('std_id');
                if (!$sId) {
                    $sId = DB::table('students')->insertGetId(array('user_id' => $uId, 'student_id' => "STD_" . rand(1000, 9999), 'name' => "Student {$clsNo} {$i}", 'status' => 'Active', 'created_at' => now()));
                }
                if (!DB::table('studet_classes')->where(array('cls_no' => $clsNo, 'std_id' => $sId))->exists()) {
                    DB::table('studet_classes')->insert(array('cls_no' => $clsNo, 'std_id' => $sId, 'sem_no' => $smNo, 'acy_no' => $ayNo, 'created_at' => now()));
                }
                if ($i === 1) {
                    DB::table('leaders')->updateOrInsert(array('cls_no' => $clsNo), array('std_id' => $sId));
                }
            }

            $lId = DB::table('leaders')->where('cls_no', $clsNo)->value('lead_id');

            for ($j = 1; $j <= 10; $j++) {
                $cid = DB::table('class_issues_complaints')->insertGetId(array('cl_issue_id' => $tplIds[array_rand($tplIds)], 'description' => "Report #{$j} for class {$clsNo}", 'lead_id' => $lId, 'created_at' => Carbon::now()->subDays(rand(1, 10))));
                $s = $stts[array_rand($stts)];
                DB::table('class_issue_assign')->updateOrInsert(array('cl_is_co_no' => $cid), array('assigned_to_user_id' => $fUserId, 'assigned_status' => $s, 'assigned_date' => now(), 'created_at' => now()));
            }
        }
        $this->command->info('Faculty Seeder Finished Successfully');
    }
}
