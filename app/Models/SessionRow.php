<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SessionRow extends Model
{
    use HasFactory;

    protected $fillable = [
        'workout_session_id',
        'exercise_id',
        'sets',
        'reps',
        'weight',
    ];

    protected function casts(): array
    {
        return [
            'sets' => 'integer',
            'reps' => 'integer',
            'weight' => 'decimal:2',
        ];
    }

    public function workoutSession(): BelongsTo
    {
        return $this->belongsTo(WorkoutSession::class);
    }

    public function exercise(): BelongsTo
    {
        return $this->belongsTo(Exercise::class);
    }

    protected function volume(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->sets * $this->reps * (float) $this->weight,
        );
    }

    protected function oneRepMax(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->reps > 0
                ? round((float) $this->weight * (1 + $this->reps / 30), 2)
                : 0,
        );
    }

    protected function warmupSets(): Attribute
    {
        return Attribute::make(
            get: function () {
                $max = (float) $this->weight;

                if ($max <= 0) {
                    return [];
                }

                return [
                    ['weight' => round($max * 0.5, 2), 'reps' => 10],
                    ['weight' => round($max * 0.7, 2), 'reps' => 5],
                    ['weight' => round($max * 0.85, 2), 'reps' => 3],
                ];
            },
        );
    }
}
