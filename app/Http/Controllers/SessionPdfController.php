<?php

namespace App\Http\Controllers;

use App\Models\WorkoutSession;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class SessionPdfController extends Controller
{
    public function __invoke(Request $request, WorkoutSession $session): Response
    {
        if ($session->user_id !== $request->user()->id) {
            abort(403);
        }

        $session->load('rows.exercise');

        $pdf = Pdf::loadView('pdf.session', compact('session'));

        return $pdf->download("session-{$session->id}.pdf");
    }
}
