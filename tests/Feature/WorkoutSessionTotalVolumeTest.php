<?php

use App\Models\Exercise;
use App\Models\SessionRow;
use App\Models\User;
use App\Models\WorkoutSession;

test('totalVolume sums all row volumes', function () {
    $user = User::factory()->create();
    $exercise = Exercise::factory()->create();
    $session = WorkoutSession::factory()->create(['user_id' => $user->id]);

    SessionRow::factory()->create([
        'workout_session_id' => $session->id,
        'exercise_id' => $exercise->id,
        'sets' => 3,
        'reps' => 10,
        'weight' => 100.00,
    ]);
    SessionRow::factory()->create([
        'workout_session_id' => $session->id,
        'exercise_id' => $exercise->id,
        'sets' => 4,
        'reps' => 8,
        'weight' => 80.00,
    ]);

    $session->load('rows');

    // 3×10×100 + 4×8×80 = 3000 + 2560 = 5560
    expect($session->total_volume)->toBe(5560.0);
});

test('totalVolume is 0 when no rows', function () {
    $session = WorkoutSession::factory()->create();
    $session->load('rows');

    expect($session->total_volume)->toEqual(0);
});
