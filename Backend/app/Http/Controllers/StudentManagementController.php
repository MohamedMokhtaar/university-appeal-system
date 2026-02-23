<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class StudentManagementController extends Controller
{
    public function listSchools()
    {
        $schools = DB::table('school')
            ->select('sch_no', 'name', 'addres', 'created_at', 'updated_at')
            ->orderBy('sch_no', 'DESC')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $schools
        ]);
    }

    public function createSchool(Request $request)
    {
        $payload = $request->validate([
            'name' => ['required', 'string', 'max:150', 'unique:school,name'],
            'addres' => ['nullable', 'string', 'max:255']
        ]);

        $schNo = DB::table('school')->insertGetId([
            'name' => trim($payload['name']),
            'addres' => $payload['addres'] ?? null,
            'created_at' => now(),
            'updated_at' => now()
        ]);

        $created = DB::table('school')
            ->where('sch_no', $schNo)
            ->select('sch_no', 'name', 'addres', 'created_at', 'updated_at')
            ->first();

        return response()->json([
            'success' => true,
            'message' => 'School created successfully.',
            'data' => $created
        ], 201);
    }

    public function updateSchool(Request $request, $sch_no)
    {
        $existing = DB::table('school')->where('sch_no', $sch_no)->first();
        if (!$existing) {
            return response()->json([
                'success' => false,
                'message' => 'School not found.'
            ], 404);
        }

        $payload = $request->validate([
            'name' => ['required', 'string', 'max:150', Rule::unique('school', 'name')->ignore($sch_no, 'sch_no')],
            'addres' => ['nullable', 'string', 'max:255']
        ]);

        DB::table('school')
            ->where('sch_no', $sch_no)
            ->update([
                'name' => trim($payload['name']),
                'addres' => $payload['addres'] ?? null,
                'updated_at' => now()
            ]);

        $updated = DB::table('school')
            ->where('sch_no', $sch_no)
            ->select('sch_no', 'name', 'addres', 'created_at', 'updated_at')
            ->first();

        return response()->json([
            'success' => true,
            'message' => 'School updated successfully.',
            'data' => $updated
        ]);
    }

    public function deleteSchool($sch_no)
    {
        $existing = DB::table('school')->where('sch_no', $sch_no)->first();
        if (!$existing) {
            return response()->json([
                'success' => false,
                'message' => 'School not found.'
            ], 404);
        }

        DB::table('school')->where('sch_no', $sch_no)->delete();

        return response()->json([
            'success' => true,
            'message' => 'School deleted successfully.'
        ]);
    }

    public function listParents()
    {
        $parents = DB::table('parents')
            ->select('parent_no', 'name', 'tell1', 'tell2', 'created_at', 'updated_at')
            ->orderBy('parent_no', 'DESC')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $parents
        ]);
    }

    public function createParent(Request $request)
    {
        $payload = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'tell1' => ['nullable', 'string', 'max:30'],
            'tell2' => ['nullable', 'string', 'max:30']
        ]);

        $parentNo = DB::table('parents')->insertGetId([
            'name' => trim($payload['name']),
            'tell1' => $payload['tell1'] ?? null,
            'tell2' => $payload['tell2'] ?? null,
            'created_at' => now(),
            'updated_at' => now()
        ]);

        $created = DB::table('parents')
            ->where('parent_no', $parentNo)
            ->select('parent_no', 'name', 'tell1', 'tell2', 'created_at', 'updated_at')
            ->first();

        return response()->json([
            'success' => true,
            'message' => 'Parent created successfully.',
            'data' => $created
        ], 201);
    }

    public function updateParent(Request $request, $parent_no)
    {
        $existing = DB::table('parents')->where('parent_no', $parent_no)->first();
        if (!$existing) {
            return response()->json([
                'success' => false,
                'message' => 'Parent not found.'
            ], 404);
        }

        $payload = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'tell1' => ['nullable', 'string', 'max:30'],
            'tell2' => ['nullable', 'string', 'max:30']
        ]);

        DB::table('parents')
            ->where('parent_no', $parent_no)
            ->update([
                'name' => trim($payload['name']),
                'tell1' => $payload['tell1'] ?? null,
                'tell2' => $payload['tell2'] ?? null,
                'updated_at' => now()
            ]);

        $updated = DB::table('parents')
            ->where('parent_no', $parent_no)
            ->select('parent_no', 'name', 'tell1', 'tell2', 'created_at', 'updated_at')
            ->first();

        return response()->json([
            'success' => true,
            'message' => 'Parent updated successfully.',
            'data' => $updated
        ]);
    }

    public function deleteParent($parent_no)
    {
        $existing = DB::table('parents')->where('parent_no', $parent_no)->first();
        if (!$existing) {
            return response()->json([
                'success' => false,
                'message' => 'Parent not found.'
            ], 404);
        }

        DB::table('parents')->where('parent_no', $parent_no)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Parent deleted successfully.'
        ]);
    }
}
