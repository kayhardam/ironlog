<?php

use App\Models\Exercise;
use App\Models\User;

test('store uppercases exercise name', function () {
    $user = User::factory()->create();

    $this->actingAs($user)->post('/exercises', [
        'name' => 'cable flye',
    ])->assertRedirect();

    $this->assertDatabaseHas('exercises', [
        'user_id' => $user->id,
        'name' => 'CABLE FLYE',
        'is_standard' => false,
    ]);
});

test('store validates name max length', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post('/exercises', ['name' => str_repeat('a', 61)])
        ->assertSessionHasErrors(['name']);
});

test('store validates name is required', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post('/exercises', ['name' => ''])
        ->assertSessionHasErrors(['name']);
});

test('destroy deletes custom exercise owned by user', function () {
    $user = User::factory()->create();
    $exercise = Exercise::factory()->custom($user)->create();

    $this->actingAs($user)
        ->delete("/exercises/{$exercise->id}")
        ->assertRedirect();

    $this->assertDatabaseMissing('exercises', ['id' => $exercise->id]);
});

test('destroy blocks deleting standard exercises', function () {
    $user = User::factory()->create();
    $exercise = Exercise::factory()->standard()->create();

    $this->actingAs($user)
        ->delete("/exercises/{$exercise->id}")
        ->assertForbidden();

    $this->assertDatabaseHas('exercises', ['id' => $exercise->id]);
});

test('destroy blocks deleting other users exercises', function () {
    $user = User::factory()->create();
    $other = User::factory()->create();
    $exercise = Exercise::factory()->custom($other)->create();

    $this->actingAs($user)
        ->delete("/exercises/{$exercise->id}")
        ->assertForbidden();

    $this->assertDatabaseHas('exercises', ['id' => $exercise->id]);
});
