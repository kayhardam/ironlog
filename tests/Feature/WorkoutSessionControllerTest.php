<?php

use App\Models\Exercise;
use App\Models\SessionRow;
use App\Models\User;
use App\Models\WorkoutSession;

test('store creates session and rows in database', function () {
    $user = User::factory()->create();
    $exercise = Exercise::factory()->create();

    $this->actingAs($user)->post('/workout-sessions', [
        'name' => 'push day',
        'rows' => [
            [
                'exercise_id' => $exercise->id,
                'sets' => 3,
                'reps' => 10,
                'weight' => 100.00,
            ],
            [
                'exercise_id' => $exercise->id,
                'sets' => 4,
                'reps' => 8,
                'weight' => 80.00,
            ],
        ],
    ])->assertRedirect('/workout-sessions');

    $this->assertDatabaseHas('workout_sessions', [
        'user_id' => $user->id,
        'name' => 'PUSH DAY',
    ]);
    $this->assertDatabaseCount('session_rows', 2);
});

test('store validates required fields', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post('/workout-sessions', [])
        ->assertSessionHasErrors(['name', 'rows']);
});

test('store validates rows exercise_id exists', function () {
    $user = User::factory()->create();

    $this->actingAs($user)->post('/workout-sessions', [
        'name' => 'test',
        'rows' => [
            [
                'exercise_id' => 99999,
                'sets' => 3,
                'reps' => 10,
                'weight' => 100,
            ],
        ],
    ])->assertSessionHasErrors(['rows.0.exercise_id']);
});

test('destroy deletes own session', function () {
    $user = User::factory()->create();
    $session = WorkoutSession::factory()->create(['user_id' => $user->id]);
    SessionRow::factory()->create(['workout_session_id' => $session->id]);

    $this->actingAs($user)
        ->delete("/workout-sessions/{$session->id}")
        ->assertRedirect('/workout-sessions');

    $this->assertDatabaseMissing('workout_sessions', ['id' => $session->id]);
});

test('destroy rejects other users session', function () {
    $user = User::factory()->create();
    $other = User::factory()->create();
    $session = WorkoutSession::factory()->create(['user_id' => $other->id]);

    $this->actingAs($user)
        ->delete("/workout-sessions/{$session->id}")
        ->assertForbidden();

    $this->assertDatabaseHas('workout_sessions', ['id' => $session->id]);
});

test('index returns inertia page with sessions', function () {
    $user = User::factory()->create();
    $exercise = Exercise::factory()->create();
    $session = WorkoutSession::factory()->create(['user_id' => $user->id]);
    SessionRow::factory()->create([
        'workout_session_id' => $session->id,
        'exercise_id' => $exercise->id,
    ]);

    $this->actingAs($user)
        ->get('/workout-sessions')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Log')
            ->has('sessions', 1)
            ->has('exercises')
        );
});
