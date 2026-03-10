<?php

namespace App\Http\Controllers;

use App\Models\Exercise;
use App\Models\WorkoutSession;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class WorkoutSessionController extends Controller
{
    public function index(Request $request): Response
    {
        $sessions = WorkoutSession::where('user_id', $request->user()->id)
            ->with('rows.exercise')
            ->latest('performed_at')
            ->take(20)
            ->get();

        $exercises = Exercise::availableFor($request->user()->id)
            ->orderBy('name')
            ->get();

        return Inertia::render('Log', compact('sessions', 'exercises'));
    }

    public function history(Request $request): Response
    {
        $sessions = WorkoutSession::where('user_id', $request->user()->id)
            ->with('rows.exercise')
            ->latest('performed_at')
            ->get();

        return Inertia::render('History', compact('sessions'));
    }

    public function prs(Request $request): Response
    {
        $prs = $request->user()->personalRecords();

        return Inertia::render('Prs', compact('prs'));
    }

    public function progress(Request $request): Response
    {
        $sessions = WorkoutSession::where('user_id', $request->user()->id)
            ->with('rows.exercise')
            ->oldest('performed_at')
            ->get();

        $volumeData = [];
        foreach ($sessions as $session) {
            foreach ($session->rows as $row) {
                $name = $row->exercise->name;
                $volumeData[$name][] = [
                    'date' => $session->performed_at->toDateString(),
                    'volume' => $row->sets * $row->reps * (float) $row->weight,
                    'weight' => (float) $row->weight,
                ];
            }
        }

        return Inertia::render('Progress', compact('volumeData'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:60'],
            'performed_at' => ['nullable', 'date'],
            'rows' => ['required', 'array', 'min:1'],
            'rows.*.exercise_id' => ['required', 'exists:exercises,id'],
            'rows.*.sets' => ['required', 'integer', 'min:1', 'max:255'],
            'rows.*.reps' => ['required', 'integer', 'min:1', 'max:255'],
            'rows.*.weight' => ['required', 'numeric', 'min:0', 'max:9999.99'],
        ]);

        DB::transaction(function () use ($request, $validated) {
            $session = WorkoutSession::create([
                'user_id' => $request->user()->id,
                'name' => strtoupper($validated['name']),
                'performed_at' => $validated['performed_at'] ?? now(),
            ]);

            $session->rows()->createMany($validated['rows']);
        });

        return redirect()->route('workout-sessions.index');
    }

    public function destroy(Request $request, WorkoutSession $workoutSession)
    {
        $this->authorize('delete', $workoutSession);

        $workoutSession->delete();

        return redirect()->route('workout-sessions.index');
    }
}
