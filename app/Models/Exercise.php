<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Exercise extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'is_standard',
    ];

    protected function casts(): array
    {
        return [
            'is_standard' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function sessionRows(): HasMany
    {
        return $this->hasMany(SessionRow::class);
    }

    public function scopeAvailableFor(Builder $query, int $userId): Builder
    {
        return $query->where('is_standard', true)
            ->orWhere('user_id', $userId);
    }
}
