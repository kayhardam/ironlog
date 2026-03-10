<?php

namespace App\Http\Controllers;

use App\Models\Exercise;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ExerciseController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $exercises = Exercise::availableFor($request->user()->id)
            ->orderBy('name')
            ->get();

        return response()->json($exercises);
    }

    public function library(Request $request): Response
    {
        $exercises = Exercise::availableFor($request->user()->id)
            ->orderBy('is_standard', 'desc')
            ->orderBy('name')
            ->get();

        return Inertia::render('Library', compact('exercises'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:60'],
        ]);

        Exercise::create([
            'user_id' => $request->user()->id,
            'name' => strtoupper($validated['name']),
            'is_standard' => false,
        ]);

        return redirect()->back();
    }

    public function destroy(Request $request, Exercise $exercise)
    {
        if ($exercise->is_standard || $exercise->user_id !== $request->user()->id) {
            abort(403);
        }

        $exercise->delete();

        return redirect()->back();
    }
}
