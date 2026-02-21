<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FacultySampleDataSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('roles')->updateOrInsert(array('role_name' => 'Faculty'), array(
            'description' => 'Faculty Member',
            'status' => 'Active'
        ));
        $facultyRoleId = DB::table('roles')->where('role_name', 'Faculty')->value('role_id');
        $this->command->info('Faculty Role ID: ' . $facultyRoleId);

        DB::table('roles')->updateOrInsert(array('role_name' => 'Student'), array(
            'description' => 'University Student',
            'status' => 'Active'
        ));
        $studentRoleId = DB::table('roles')->where('role_name', 'Student')->value('role_id');
        $this->command->info('Student Role ID: ' . $studentRoleId);

        // 2. Background Data
        DB::table('faculties')->updateOrInsert(array('name' => 'Faculty of Computer Science'), array());
        $facultyNo = DB::table('faculties')->where('name', 'Faculty of Computer Science')->value('faculty_no');

        DB::table('departments')->updateOrInsert(array('name' => 'Information Technology'), array('faculty_no' => $facultyNo));
        $deptNo = DB::table('departments')->where('name', 'Information Technology')->value('dept_no');

        DB::table('campuses')->updateOrInsert(array('name' => 'Main Campus'), array());
        $campNo = DB::table('campuses')->where('name', 'Main Campus')->value('camp_no');

        DB::table('semesters')->updateOrInsert(array('semister_name' => 'Semester 1 2024'), array());
        $semNo = DB::table('semesters')->where('semister_name', 'Semester 1 2024')->value('sem_no');

        DB::table('academics')->updateOrInsert(array('active_year' => '2023-2024'), array(
            'start_date' => '2023-09-01', 
            'end_date' => '2024-06-30'
        ));
        $acyNo = DB::table('academics')->where('active_year' => '2023-2024')->value('acy_no');

        DB::table('categories')->updateOrInsert(array('cat_name' => 'Technical'), array());
        $catNo = DB::table('categories')->where('cat_name' => 'Technical')->value('cat_no');

        $this->command->info('Background Data seeded.');

        // 3. Classes
        $classNames = array('CS-Year-1', 'CS-Year-2', 'CS-Year-3');
        foreach ($classNames as $name) {
            DB::table('classes')->updateOrInsert(array('cl_name' => $name), array(
                'dept_no' => $deptNo,
                'camp_no' => $campNo,
                'updated_at' => now()
            ));
        }
        $classIds = DB::table('classes')->whereIn('cl_name', $classNames)->pluck('cls_no')->toArray();

        // 4. Issue Types
        $issueNames = array(
            'Broken Projector', 'AC Maintenance', 'Unclean Classroom', 
            'Missing Board Markers', 'Broken Chairs', 'Software Installation Needed'
        );
        foreach ($issueNames as $name) {
            DB::table('class_issues')->updateOrInsert(array('issue_name' => $name), array('cat_no' => $catNo));
        }
        $issueTemplateIds = DB::table('class_issues')->pluck('cl_issue_id')->toArray();

        // 5. Faculty User
        $facultyUserId = DB::table('users')->where('username', 'faculty')->value('user_id');
        if (!$facultyUserId) {
            $facultyUserId = DB::table('users')->insertGetId(array(
                'role_id' => $facultyRoleId,
                'full_name' => 'Dr. Jane Smith',
                'username' => 'faculty',
                'password_hash' => hash('sha256', 'password123'),
                'status' => 'Active',
                'created_at' => now()
            ));
        }

        $statuses = array('Pending', 'In Review', 'Resolved', 'Completed');

        foreach ($classIds as $clsNo) {
            // Seed exactly 10 students per class
            for ($i = 1; $i <= 10; $i++) {
                $username = "student_{$clsNo}_{$i}";
                $stdUserId = DB::table('users')->where('username', $username)->value('user_id');
                if (!$stdUserId) {
                    $stdUserId = DB::table('users')->insertGetId(array(
                        'role_id' => $studentRoleId,
                        'full_name' => "Student {$clsNo} {$i}",
                        'username' => $username,
                        'password_hash' => hash('sha256', 'password123'),
                        'status' => 'Active',
                        'created_at' => now()
                    ));
                }

                $stdId = DB::table('students')->where('user_id', $stdUserId)->value('std_id');
                if (!$stdId) {
                    $stdId = DB::table('students')->insertGetId(array(
                        'user_id' => $stdUserId,
                        'student_id' => "STD_" . strtoupper(bin2hex(random_bytes(3))),
                        'name' => "Student {$clsNo} {$i}",
                        'status' => 'Active',
                        'created_at' => now()
                    ));
                }

                if (!DB::table('studet_classes')->where(array('cls_no' => $clsNo, 'std_id' => $stdId))->exists()) {
                    DB::table('studet_classes')->insert(array(
                        'cls_no' => $clsNo,
                        'std_id' => $stdId,
                        'sem_no' => $semNo,
                        'acy_no' => $acyNo,
                        'created_at' => now()
                    ));
                }

                // First student is leader
                if ($i === 1) {
                    DB::table('leaders')->updateOrInsert(array('cls_no' => $clsNo), array('std_id' => $stdId));
                }
            }

            $leadId = DB::table('leaders')->where('cls_no', $clsNo)->value('lead_id');

            // Seed 10 issues per class (Total 30)
            for ($j = 1; $j <= 10; $j++) {
                $complaintId = DB::table('class_issues_complaints')->insertGetId(array(
                    'cl_issue_id' => $issueTemplateIds[array_rand($issueTemplateIds)],
                    'description' => "Detailed report for issue #{$j} in class {$clsNo}",
                    'lead_id' => $leadId,
                    'created_at' => \Carbon\Carbon::now()->subDays(rand(1, 30))
                ));

                $status = $statuses[array_rand($statuses)];
                DB::table('class_issue_assign')->updateOrInsert(array('cl_is_co_no' => $complaintId), array(
                    'assigned_to_user_id' => $facultyUserId,
                    'assigned_status' => $status,
                    'assigned_date' => now(),
                    'created_at' => now(),
                    'updated_at' => now()
                ));

                DB::table('class_issue_tracking')->insert(array(
                    'cl_is_co_no' => $complaintId,
                    'new_status' => $status,
                    'changed_by_user_id' => $facultyUserId,
                    'changed_date' => now(),
                    'note' => 'Initial seeding',
                    'created_at' => now()
                ));
            }
        }
        $this->command->info('Full Faculty sample data seeded successfully!');
    }
}
