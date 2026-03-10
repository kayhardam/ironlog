<?php

use App\Models\User;
use App\Models\WorkoutSession;

test('owner can view their session', function () {
    $user = User::factory()->create();
    $session = WorkoutSession::factory()->create(['user_id' => $user->id]);

    expect($user->can('view', $session))->toBeTrue();
});

test('other user cannot view session', function () {
    $owner = User::factory()->create();
    $other = User::factory()->create();
    $session = WorkoutSession::factory()->create(['user_id' => $owner->id]);

    expect($other->can('view', $session))->toBeFalse();
});

test('owner can delete their session', function () {
    $user = User::factory()->create();
    $session = WorkoutSession::factory()->create(['user_id' => $user->id]);

    expect($user->can('delete', $session))->toBeTrue();
});

test('other user cannot delete session', function () {
    $owner = User::factory()->create();
    $other = User::factory()->create();
    $session = WorkoutSession::factory()->create(['user_id' => $owner->id]);

    expect($other->can('delete', $session))->toBeFalse();
});

test('owner can update their session', function () {
    $user = User::factory()->create();
    $session = WorkoutSession::factory()->create(['user_id' => $user->id]);

    expect($user->can('update', $session))->toBeTrue();
});

test('other user cannot update session', function () {
    $owner = User::factory()->create();
    $other = User::factory()->create();
    $session = WorkoutSession::factory()->create(['user_id' => $owner->id]);

    expect($other->can('update', $session))->toBeFalse();
});

test('any user can create a session', function () {
    $user = User::factory()->create();

    expect($user->can('create', WorkoutSession::class))->toBeTrue();
});
