<?php

namespace Database\Factories;

use App\Models\Exercise;
use App\Models\SessionRow;
use App\Models\WorkoutSession;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<SessionRow> */
class SessionRowFactory extends Factory
{
    protected $model = SessionRow::class;

    private const WEIGHT_RANGES = [
        'Squat' => [60, 180],
        'Bench Press' => [40, 140],
        'Deadlift' => [80, 220],
        'Overhead Press' => [30, 80],
        'Barbell Row' => [40, 120],
        'Romanian Deadlift' => [60, 160],
        'Pull-Up' => [0, 40],
        'Dip' => [0, 50],
        'Barbell Curl' => [15, 50],
        'Tricep Pushdown' => [10, 45],
        'Leg Press' => [100, 300],
        'Lunges' => [20, 80],
        'Incline Bench Press' => [30, 110],
        'Close-Grip Bench Press' => [30, 100],
        'Sumo Deadlift' => [80, 220],
        'Front Squat' => [40, 140],
        'Hack Squat' => [60, 180],
        'Pendlay Row' => [40, 120],
        'Face Pull' => [10, 35],
        'Lateral Raise' => [5, 20],
    ];

    public function definition(): array
    {
        return [
            'workout_session_id' => WorkoutSession::factory(),
            'exercise_id' => Exercise::factory(),
            'sets' => fake()->numberBetween(3, 5),
            'reps' => fake()->randomElement([3, 5, 6, 8, 10, 12, 15]),
            'weight' => fake()->randomFloat(2, 20, 150),
        ];
    }

    public function forExercise(Exercise $exercise): static
    {
        $range = self::WEIGHT_RANGES[$exercise->name] ?? [20, 150];

        return $this->state(fn () => [
            'exercise_id' => $exercise->id,
            'weight' => fake()->randomFloat(2, $range[0], $range[1]),
        ]);
    }
}
