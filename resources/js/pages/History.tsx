import AppLayout from '@/layouts/AppLayout';
import type { WorkoutSession } from '@/types/models';
import { Head, router } from '@inertiajs/react';
import { useCallback } from 'react';

type Props = {
    sessions: WorkoutSession[];
};

function sessionVolume(session: WorkoutSession): number {
    return session.rows.reduce(
        (sum, r) => sum + r.sets * r.reps * parseFloat(r.weight),
        0,
    );
}

function copySession(session: WorkoutSession) {
    const lines = [
        `${session.name} — ${new Date(session.performed_at).toLocaleDateString()}`,
        '',
        ...session.rows.map(
            (r) => `${r.exercise.name}: ${r.sets}x${r.reps} @${r.weight}kg`,
        ),
        '',
        `Total Volume: ${sessionVolume(session).toFixed(0)}kg`,
    ];
    navigator.clipboard.writeText(lines.join('\n'));
}

export default function History({ sessions }: Props) {
    const handleDelete = useCallback((id: number) => {
        if (confirm('Delete this session?')) {
            router.delete(`/workout-sessions/${id}`);
        }
    }, []);

    return (
        <AppLayout>
            <Head title="History" />
            <h2 className="mb-4 font-[Oswald] text-lg uppercase tracking-widest">
                SESSION HISTORY
            </h2>

            {sessions.length === 0 && (
                <p className="font-[Share_Tech_Mono] text-sm text-[#7a7a65]">
                    No sessions recorded yet.
                </p>
            )}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {sessions.map((session) => {
                    const vol = sessionVolume(session);
                    return (
                        <div
                            key={session.id}
                            className="rounded-sm border border-[#2a2a20] bg-[#141410] p-4"
                        >
                            <div className="mb-2 flex items-start justify-between">
                                <div>
                                    <h3 className="font-[Oswald] text-sm uppercase tracking-widest text-[#e8e8d8]">
                                        {session.name}
                                    </h3>
                                    <p className="font-[Share_Tech_Mono] text-[10px] text-[#7a7a65]">
                                        {new Date(session.performed_at).toLocaleDateString(
                                            'en-GB',
                                            { day: '2-digit', month: 'short', year: 'numeric' },
                                        )}
                                    </p>
                                </div>
                                <div className="font-[Share_Tech_Mono] text-xs text-[#7a8c40]">
                                    {vol.toFixed(0)}kg
                                </div>
                            </div>

                            <div className="space-y-1">
                                {session.rows.map((row) => (
                                    <div
                                        key={row.id}
                                        className="flex justify-between font-[Share_Tech_Mono] text-[11px]"
                                    >
                                        <span className="text-[#e8e8d8]">
                                            {row.exercise.name}
                                        </span>
                                        <span className="text-[#7a7a65]">
                                            {row.sets}x{row.reps} @{row.weight}kg
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-3 flex gap-2 border-t border-[#2a2a20] pt-2">
                                <button
                                    onClick={() => copySession(session)}
                                    className="rounded-sm border border-[#2a2a20] px-2 py-1 font-[Oswald] text-[9px] uppercase tracking-widest text-[#7a7a65] transition hover:border-[#7a8c40] hover:text-[#9aae52]"
                                >
                                    COPY
                                </button>
                                <a
                                    href={`/sessions/${session.id}/pdf`}
                                    className="rounded-sm border border-[#2a2a20] px-2 py-1 font-[Oswald] text-[9px] uppercase tracking-widest text-[#7a7a65] transition hover:border-[#7a8c40] hover:text-[#9aae52]"
                                >
                                    PDF
                                </a>
                                <button
                                    onClick={() => handleDelete(session.id)}
                                    className="ml-auto rounded-sm border border-[#2a2a20] px-2 py-1 font-[Oswald] text-[9px] uppercase tracking-widest text-[#8B0000] transition hover:border-[#8B0000]"
                                >
                                    DELETE
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </AppLayout>
    );
}
