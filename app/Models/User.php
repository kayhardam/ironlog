<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\DB;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    public function workoutSessions(): HasMany
    {
        return $this->hasMany(WorkoutSession::class);
    }

    public function exercises(): HasMany
    {
        return $this->hasMany(Exercise::class);
    }

    public function sessionRows(): HasManyThrough
    {
        return $this->hasManyThrough(SessionRow::class, WorkoutSession::class);
    }

    /** @return array<int, array{exercise_id: int, exercise_name: string, weight: string, date: string, sets: int, reps: int}> */
    public function personalRecords(): array
    {
        return SessionRow::query()
            ->join('workout_sessions', 'session_rows.workout_session_id', '=', 'workout_sessions.id')
            ->join('exercises', 'session_rows.exercise_id', '=', 'exercises.id')
            ->where('workout_sessions.user_id', $this->id)
            ->select(
                'session_rows.exercise_id',
                'exercises.name as exercise_name',
                DB::raw('MAX(session_rows.weight) as weight'),
            )
            ->groupBy('session_rows.exercise_id', 'exercises.name')
            ->get()
            ->map(function ($record) {
                $best = SessionRow::query()
                    ->join('workout_sessions', 'session_rows.workout_session_id', '=', 'workout_sessions.id')
                    ->where('workout_sessions.user_id', $this->id)
                    ->where('session_rows.exercise_id', $record->exercise_id)
                    ->where('session_rows.weight', $record->weight)
                    ->orderByDesc('workout_sessions.performed_at')
                    ->select('session_rows.*', 'workout_sessions.performed_at')
                    ->first();

                return [
                    'exercise_id' => $record->exercise_id,
                    'exercise_name' => $record->exercise_name,
                    'weight' => $best->weight,
                    'date' => \Carbon\Carbon::parse($best->performed_at)->toDateString(),
                    'sets' => $best->sets,
                    'reps' => $best->reps,
                ];
            })
            ->all();
    }
}
