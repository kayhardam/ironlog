<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\WorkoutSession;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<WorkoutSession> */
class WorkoutSessionFactory extends Factory
{
    protected $model = WorkoutSession::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'name' => fake()->randomElement([
                'PUSH DAY', 'PULL DAY', 'LEG DAY', 'UPPER BODY',
                'LOWER BODY', 'FULL BODY', 'CHEST & TRICEPS',
                'BACK & BICEPS', 'SHOULDERS', 'ARMS',
            ]),
            'performed_at' => fake()->dateTimeBetween('-6 months', 'now'),
        ];
    }
}
