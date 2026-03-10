<?php

namespace Database\Factories;

use App\Models\Exercise;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Exercise> */
class ExerciseFactory extends Factory
{
    protected $model = Exercise::class;

    public function definition(): array
    {
        return [
            'user_id' => null,
            'name' => fake()->unique()->words(2, true),
            'is_standard' => true,
        ];
    }

    public function standard(): static
    {
        return $this->state(fn () => [
            'user_id' => null,
            'is_standard' => true,
        ]);
    }

    public function custom(?User $user = null): static
    {
        return $this->state(fn () => [
            'user_id' => $user?->id ?? User::factory(),
            'is_standard' => false,
        ]);
    }
}
