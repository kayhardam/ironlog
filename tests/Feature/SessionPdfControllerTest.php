<?php

use App\Models\Exercise;
use App\Models\SessionRow;
use App\Models\User;
use App\Models\WorkoutSession;

test('owner can download session pdf', function () {
    $user = User::factory()->create();
    $exercise = Exercise::factory()->create();
    $session = WorkoutSession::factory()->create(['user_id' => $user->id]);
    SessionRow::factory()->create([
        'workout_session_id' => $session->id,
        'exercise_id' => $exercise->id,
    ]);

    $response = $this->actingAs($user)->get("/sessions/{$session->id}/pdf");

    $response->assertOk();
    $response->assertHeader('content-type', 'application/pdf');
});

test('non-owner gets 403 for session pdf', function () {
    $owner = User::factory()->create();
    $other = User::factory()->create();
    $session = WorkoutSession::factory()->create(['user_id' => $owner->id]);

    $this->actingAs($other)
        ->get("/sessions/{$session->id}/pdf")
        ->assertForbidden();
});

test('guest is redirected from session pdf', function () {
    $user = User::factory()->create();
    $session = WorkoutSession::factory()->create(['user_id' => $user->id]);

    $this->get("/sessions/{$session->id}/pdf")
        ->assertRedirect('/login');
});
