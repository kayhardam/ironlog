<?php

namespace App\Policies;

use App\Models\User;
use App\Models\WorkoutSession;

class WorkoutSessionPolicy
{
    public function view(User $user, WorkoutSession $session): bool
    {
        return $user->id === $session->user_id;
    }

    public function update(User $user, WorkoutSession $session): bool
    {
        return $user->id === $session->user_id;
    }

    public function delete(User $user, WorkoutSession $session): bool
    {
        return $user->id === $session->user_id;
    }

    public function create(User $user): bool
    {
        return true;
    }
}
