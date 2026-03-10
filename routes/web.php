<?php

use App\Http\Controllers\ExerciseController;
use App\Http\Controllers\SessionPdfController;
use App\Http\Controllers\WorkoutSessionController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::resource('workout-sessions', WorkoutSessionController::class)
        ->only(['index', 'store', 'destroy']);

    Route::get('history', [WorkoutSessionController::class, 'history'])->name('history');
    Route::get('prs', [WorkoutSessionController::class, 'prs'])->name('prs');
    Route::get('progress', [WorkoutSessionController::class, 'progress'])->name('progress');
    Route::inertia('tools', 'Tools')->name('tools');

    Route::get('library', [ExerciseController::class, 'library'])->name('library');

    Route::resource('exercises', ExerciseController::class)
        ->only(['index', 'store', 'destroy']);

    Route::get('sessions/{session}/pdf', SessionPdfController::class)
        ->name('sessions.pdf');
});

require __DIR__.'/settings.php';
