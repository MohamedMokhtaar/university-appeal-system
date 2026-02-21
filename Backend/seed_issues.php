<?php

use Illuminate\Support\Facades\DB;

$classes = DB::table('classes')->get();
$issueTypes = DB::table('class_issues')->get();

if ($issueTypes->isEmpty()) {
    echo "No issue types found in class_issues table. Please seed them first.\n";
    exit(1);
}

foreach ($classes as $cls) {
    // Each class must have a leader
    $leader = DB::table('leaders')->where('cls_no', $cls->cls_no)->first();
    
    if (!$leader) {
        // Find a student in this class and make them a leader
        $student = DB::table('studet_classes')->where('cls_no', $cls->cls_no)->first();
        if ($student) {
            $lead_id = DB::table('leaders')->insertGetId([
                'cls_no' => $cls->cls_no,
                'std_id' => $student->std_id,
                'created_at' => now(),
                'updated_at' => now()
            ]);
            $leader = (object)['lead_id' => $lead_id];
        }
    }

    if ($leader) {
        // Seed 2 issues for this class
        for ($i = 0; $i < 2; $i++) {
            $issueType = $issueTypes->random();
            $complaintId = DB::table('class_issues_complaints')->insertGetId([
                'cl_issue_id' => $issueType->cl_issue_id,
                'lead_id' => $leader->lead_id,
                'description' => "Sample issue description {$i} for class {$cls->cl_name}",
                'created_at' => now()->subDays(rand(1, 10)),
                'updated_at' => now()
            ]);

            // Assign status for some
            $statuses = ['Pending', 'In Review', 'Resolved', 'Completed'];
            $status = $statuses[array_rand($statuses)];
            
            DB::table('class_issue_assign')->insert([
                'cl_is_co_no' => $complaintId,
                'assigned_to_user_id' => 1, // Faculty
                'assigned_status' => $status,
                'assigned_date' => now(),
                'created_at' => now(),
                'updated_at' => now()
            ]);

            // Add some tracking
            DB::table('class_issue_tracking')->insert([
                'cl_is_co_no' => $complaintId,
                'old_status' => 'Pending',
                'new_status' => $status,
                'changed_by_user_id' => 1,
                'note' => 'Initial setup',
                'changed_date' => now(),
                'created_at' => now(),
                'updated_at' => now()
            ]);
        }
    }
}

echo "Seeded issues for all classes.\n";
