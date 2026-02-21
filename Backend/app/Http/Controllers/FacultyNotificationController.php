<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class FacultyNotificationController extends Controller
{
    /**
     * Get faculty notifications
     */
    public function index($user_id)
    {
        try {
            $notifications = DB::table('notifications')
                ->where('receiver_user_id', $user_id)
                ->where('status', 'Active')
                ->orderBy('created_at', 'DESC')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $notifications
            ]);
        } catch (\Exception $e) {
            Log::error("Error fetching notifications: " . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Failed to fetch notifications'], 500);
        }
    }

    /**
     * Mark notification as read
     */
    public function markAsRead($not_no)
    {
        try {
            DB::table('notifications')
                ->where('not_no', $not_no)
                ->update([
                    'is_read' => 1,
                    'read_at' => now(),
                    'updated_at' => now()
                ]);

            return response()->json([
                'success' => true,
                'message' => 'Notification marked as read'
            ]);
        } catch (\Exception $e) {
            Log::error("Error marking notification as read: " . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Failed to update notification'], 500);
        }
    }
}
