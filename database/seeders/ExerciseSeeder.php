<?php

namespace Database\Seeders;

use App\Models\Exercise;
use Illuminate\Database\Seeder;

class ExerciseSeeder extends Seeder
{
    public function run(): void
    {
        $exercises = [
            'Squat',
            'Bench Press',
            'Deadlift',
            'Overhead Press',
            'Barbell Row',
            'Romanian Deadlift',
            'Pull-Up',
            'Dip',
            'Barbell Curl',
            'Tricep Pushdown',
            'Leg Press',
            'Lunges',
            'Incline Bench Press',
            'Close-Grip Bench Press',
            'Sumo Deadlift',
            'Front Squat',
            'Hack Squat',
            'Pendlay Row',
            'Face Pull',
            'Lateral Raise',
        ];

        foreach ($exercises as $name) {
            Exercise::firstOrCreate(
                ['name' => $name, 'is_standard' => true],
                ['user_id' => null],
            );
        }
    }
}
