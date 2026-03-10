import AppLayout from '@/layouts/AppLayout';
import type { Exercise, WorkoutSession } from '@/types/models';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

type RowInput = {
    exercise_id: string;
    sets: string;
    reps: string;
    weight: string;
    showWarmup: boolean;
};

const emptyRow = (): RowInput => ({
    exercise_id: '',
    sets: '3',
    reps: '5',
    weight: '',
    showWarmup: false,
});

function epley(weight: number, reps: number): number {
    if (reps <= 0 || weight <= 0) return 0;
    return Math.round(weight * (1 + reps / 30) * 100) / 100;
}

function warmupSets(weight: number): { pct: number; weight: number; reps: number }[] {
    if (weight <= 0) return [];
    return [
        { pct: 40, weight: Math.round(weight * 0.4 * 100) / 100, reps: 10 },
        { pct: 60, weight: Math.round(weight * 0.6 * 100) / 100, reps: 8 },
        { pct: 80, weight: Math.round(weight * 0.8 * 100) / 100, reps: 5 },
        { pct: 90, weight: Math.round(weight * 0.9 * 100) / 100, reps: 3 },
    ];
}

type Props = {
    sessions: WorkoutSession[];
    exercises: Exercise[];
};

function Label({ children }: { children: React.ReactNode }) {
    return (
        <label className="font-[Share_Tech_Mono] text-[10px] uppercase tracking-widest text-[#7a7a65]">
            {children}
        </label>
    );
}

export default function Log({ sessions, exercises }: Props) {
    const [name, setName] = useState('');
    const [rows, setRows] = useState<RowInput[]>([emptyRow()]);
    const [saving, setSaving] = useState(false);

    const updateRow = (index: number, field: keyof RowInput, value: string | boolean) => {
        setRows((prev) => prev.map((r, i) => (i === index ? { ...r, [field]: value } : r)));
    };

    const removeRow = (index: number) => {
        setRows((prev) => prev.filter((_, i) => i !== index));
    };

    const addRow = () => setRows((prev) => [...prev, emptyRow()]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        router.post(
            '/workout-sessions',
            {
                name: name || 'SESSION',
                rows: rows
                    .filter((r) => r.exercise_id && r.weight)
                    .map((r) => ({
                        exercise_id: parseInt(r.exercise_id),
                        sets: parseInt(r.sets) || 3,
                        reps: parseInt(r.reps) || 5,
                        weight: parseFloat(r.weight) || 0,
                    })),
            },
            {
                onFinish: () => {
                    setSaving(false);
                    setName('');
                    setRows([emptyRow()]);
                },
            },
        );
    };

    return (
        <AppLayout>
            <Head title="Log" />
            <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
                {/* New Session Form */}
                <div className="rounded-sm border border-[#2a2a20] bg-[#141410] p-4">
                    <h2 className="mb-4 font-[Oswald] text-lg uppercase tracking-widest text-[#e8e8d8]">
                        NEW SESSION
                    </h2>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <Label>SESSION NAME</Label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value.toUpperCase())}
                                placeholder="SESSION"
                                className="mt-1 w-full rounded-sm border border-[#2a2a20] bg-[#0d0d0b] px-3 py-2 font-[Share_Tech_Mono] text-sm text-[#e8e8d8] placeholder-[#7a7a65] focus:border-[#7a8c40] focus:outline-none"
                            />
                        </div>

                        <div className="space-y-3">
                            {rows.map((row, i) => {
                                const w = parseFloat(row.weight) || 0;
                                const r = parseInt(row.reps) || 0;
                                const orm = epley(w, r);
                                const warmups = warmupSets(w);

                                return (
                                    <div
                                        key={i}
                                        className="rounded-sm border border-[#2a2a20] bg-[#0d0d0b] p-3"
                                    >
                                        <div className="grid grid-cols-[1fr_60px_60px_80px_auto] items-end gap-2">
                                            <div>
                                                <Label>EXERCISE</Label>
                                                <select
                                                    value={row.exercise_id}
                                                    onChange={(e) =>
                                                        updateRow(i, 'exercise_id', e.target.value)
                                                    }
                                                    className="mt-1 w-full rounded-sm border border-[#2a2a20] bg-[#141410] px-2 py-1.5 font-[Share_Tech_Mono] text-xs text-[#e8e8d8] focus:border-[#7a8c40] focus:outline-none"
                                                >
                                                    <option value="">Select...</option>
                                                    {exercises.map((ex) => (
                                                        <option key={ex.id} value={ex.id}>
                                                            {ex.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <Label>SETS</Label>
                                                <input
                                                    type="number"
                                                    value={row.sets}
                                                    onChange={(e) =>
                                                        updateRow(i, 'sets', e.target.value)
                                                    }
                                                    min={1}
                                                    className="mt-1 w-full rounded-sm border border-[#2a2a20] bg-[#141410] px-2 py-1.5 text-center font-[Share_Tech_Mono] text-xs text-[#e8e8d8] focus:border-[#7a8c40] focus:outline-none"
                                                />
                                            </div>
                                            <div>
                                                <Label>REPS</Label>
                                                <input
                                                    type="number"
                                                    value={row.reps}
                                                    onChange={(e) =>
                                                        updateRow(i, 'reps', e.target.value)
                                                    }
                                                    min={1}
                                                    className="mt-1 w-full rounded-sm border border-[#2a2a20] bg-[#141410] px-2 py-1.5 text-center font-[Share_Tech_Mono] text-xs text-[#e8e8d8] focus:border-[#7a8c40] focus:outline-none"
                                                />
                                            </div>
                                            <div>
                                                <Label>KG</Label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={row.weight}
                                                    onChange={(e) =>
                                                        updateRow(i, 'weight', e.target.value)
                                                    }
                                                    min={0}
                                                    className="mt-1 w-full rounded-sm border border-[#2a2a20] bg-[#141410] px-2 py-1.5 text-center font-[Share_Tech_Mono] text-xs text-[#e8e8d8] focus:border-[#7a8c40] focus:outline-none"
                                                />
                                            </div>
                                            <div className="flex gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        updateRow(
                                                            i,
                                                            'showWarmup',
                                                            !row.showWarmup,
                                                        )
                                                    }
                                                    className={`rounded-sm border px-2 py-1.5 font-[Oswald] text-[9px] uppercase tracking-widest transition ${
                                                        row.showWarmup
                                                            ? 'border-[#7a8c40] text-[#9aae52]'
                                                            : 'border-[#2a2a20] text-[#7a7a65] hover:border-[#7a8c40]'
                                                    }`}
                                                >
                                                    W
                                                </button>
                                                {rows.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeRow(i)}
                                                        className="rounded-sm border border-[#2a2a20] px-2 py-1.5 font-[Oswald] text-[9px] text-[#8B0000] transition hover:border-[#8B0000]"
                                                    >
                                                        X
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* 1RM display */}
                                        {orm > 0 && (
                                            <div className="mt-2 font-[Share_Tech_Mono] text-[10px] text-[#7a7a65]">
                                                EST 1RM:{' '}
                                                <span className="text-[#9aae52]">
                                                    {orm.toFixed(1)} KG
                                                </span>
                                            </div>
                                        )}

                                        {/* Warmup panel */}
                                        {row.showWarmup && warmups.length > 0 && (
                                            <div className="mt-2 rounded-sm border border-[#2a2a20] bg-[#141410] p-2">
                                                <div className="mb-1 font-[Oswald] text-[9px] uppercase tracking-widest text-[#7a7a65]">
                                                    WARMUP PROGRESSION
                                                </div>
                                                <div className="grid grid-cols-4 gap-1">
                                                    {warmups.map((wu) => (
                                                        <div
                                                            key={wu.pct}
                                                            className="rounded-sm border border-[#2a2a20] bg-[#0d0d0b] p-1.5 text-center"
                                                        >
                                                            <div className="font-[Oswald] text-[9px] text-[#7a8c40]">
                                                                {wu.pct}%
                                                            </div>
                                                            <div className="font-[Share_Tech_Mono] text-xs text-[#e8e8d8]">
                                                                {wu.weight}
                                                            </div>
                                                            <div className="font-[Share_Tech_Mono] text-[9px] text-[#7a7a65]">
                                                                x{wu.reps}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-4 flex gap-2">
                            <button
                                type="button"
                                onClick={addRow}
                                className="rounded-sm border border-[#2a2a20] px-4 py-2 font-[Oswald] text-[11px] uppercase tracking-widest text-[#7a7a65] transition hover:border-[#7a8c40] hover:text-[#9aae52]"
                            >
                                + ADD ROW
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="rounded-sm border border-[#8B0000] bg-[#8B0000]/20 px-6 py-2 font-[Oswald] text-[11px] uppercase tracking-widest text-[#e8e8d8] transition hover:bg-[#8B0000]/40 disabled:opacity-50"
                            >
                                {saving ? 'SAVING...' : 'SAVE SESSION'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Recent Sessions */}
                <div>
                    <h3 className="mb-3 font-[Oswald] text-sm uppercase tracking-widest text-[#7a7a65]">
                        RECENT SESSIONS
                    </h3>
                    <div className="space-y-2">
                        {sessions.length === 0 && (
                            <p className="font-[Share_Tech_Mono] text-xs text-[#7a7a65]">
                                No sessions yet. Log your first workout.
                            </p>
                        )}
                        {sessions.map((session) => (
                            <div
                                key={session.id}
                                className="rounded-sm border border-[#2a2a20] bg-[#141410] p-3"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-[Oswald] text-xs uppercase tracking-widest text-[#e8e8d8]">
                                        {session.name}
                                    </span>
                                    <span className="font-[Share_Tech_Mono] text-[10px] text-[#7a7a65]">
                                        {new Date(session.performed_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="mt-1 space-y-0.5">
                                    {session.rows.map((row) => (
                                        <div
                                            key={row.id}
                                            className="font-[Share_Tech_Mono] text-[10px] text-[#7a7a65]"
                                        >
                                            {row.exercise.name} — {row.sets}x{row.reps} @
                                            {row.weight}kg
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
