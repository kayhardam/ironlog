<?php

use App\Models\Exercise;
use App\Models\SessionRow;
use App\Models\User;
use App\Models\WorkoutSession;

test('personalRecords returns highest weight per exercise', function () {
    $user = User::factory()->create();
    $squat = Exercise::factory()->create(['name' => 'Squat']);
    $bench = Exercise::factory()->create(['name' => 'Bench Press']);

    $session = WorkoutSession::factory()->create([
        'user_id' => $user->id,
        'performed_at' => '2026-02-15',
    ]);

    SessionRow::factory()->create([
        'workout_session_id' => $session->id,
        'exercise_id' => $squat->id,
        'sets' => 5,
        'reps' => 5,
        'weight' => 140.00,
    ]);
    SessionRow::factory()->create([
        'workout_session_id' => $session->id,
        'exercise_id' => $squat->id,
        'sets' => 3,
        'reps' => 3,
        'weight' => 160.00,
    ]);
    SessionRow::factory()->create([
        'workout_session_id' => $session->id,
        'exercise_id' => $bench->id,
        'sets' => 4,
        'reps' => 8,
        'weight' => 100.00,
    ]);

    $prs = $user->personalRecords();

    expect($prs)->toHaveCount(2);

    $squatPr = collect($prs)->firstWhere('exercise_name', 'Squat');
    expect($squatPr['weight'])->toBe('160.00');
    expect($squatPr['sets'])->toBe(3);
    expect($squatPr['reps'])->toBe(3);
    expect($squatPr['date'])->toBe('2026-02-15');

    $benchPr = collect($prs)->firstWhere('exercise_name', 'Bench Press');
    expect($benchPr['weight'])->toBe('100.00');
});

test('personalRecords returns empty array when no sessions', function () {
    $user = User::factory()->create();

    expect($user->personalRecords())->toBeEmpty();
});

test('personalRecords does not include other users sessions', function () {
    $user = User::factory()->create();
    $other = User::factory()->create();
    $exercise = Exercise::factory()->create(['name' => 'Deadlift']);

    $otherSession = WorkoutSession::factory()->create(['user_id' => $other->id]);
    SessionRow::factory()->create([
        'workout_session_id' => $otherSession->id,
        'exercise_id' => $exercise->id,
        'sets' => 5,
        'reps' => 5,
        'weight' => 200.00,
    ]);

    expect($user->personalRecords())->toBeEmpty();
});
