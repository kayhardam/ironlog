import AppLayout from '@/layouts/AppLayout';
import type { Exercise } from '@/types/models';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

type Props = {
    exercises: Exercise[];
};

export default function Library({ exercises }: Props) {
    const [name, setName] = useState('');
    const [saving, setSaving] = useState(false);

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        setSaving(true);
        router.post(
            '/exercises',
            { name },
            {
                onFinish: () => {
                    setSaving(false);
                    setName('');
                },
            },
        );
    };

    const handleDelete = (id: number) => {
        if (confirm('Delete this custom exercise?')) {
            router.delete(`/exercises/${id}`);
        }
    };

    const standard = exercises.filter((e) => e.is_standard);
    const custom = exercises.filter((e) => !e.is_standard);

    return (
        <AppLayout>
            <Head title="Library" />
            <h2 className="mb-4 font-[Oswald] text-lg uppercase tracking-widest">
                EXERCISE LIBRARY
            </h2>

            {/* Add Custom Exercise */}
            <div className="mb-6 rounded-sm border border-[#2a2a20] bg-[#141410] p-4">
                <h3 className="mb-3 font-[Oswald] text-sm uppercase tracking-widest text-[#e8e8d8]">
                    ADD CUSTOM EXERCISE
                </h3>
                <form onSubmit={handleAdd} className="flex gap-2">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Exercise name..."
                        maxLength={60}
                        className="flex-1 rounded-sm border border-[#2a2a20] bg-[#0d0d0b] px-3 py-2 font-[Share_Tech_Mono] text-sm text-[#e8e8d8] placeholder-[#7a7a65] focus:border-[#7a8c40] focus:outline-none"
                    />
                    <button
                        type="submit"
                        disabled={saving || !name.trim()}
                        className="rounded-sm border border-[#7a8c40] bg-[#7a8c40]/20 px-4 py-2 font-[Oswald] text-[11px] uppercase tracking-widest text-[#9aae52] transition hover:bg-[#7a8c40]/40 disabled:opacity-50"
                    >
                        {saving ? 'ADDING...' : 'ADD'}
                    </button>
                </form>
            </div>

            {/* Custom Exercises */}
            {custom.length > 0 && (
                <div className="mb-6">
                    <h3 className="mb-3 font-[Oswald] text-sm uppercase tracking-widest text-[#7a7a65]">
                        CUSTOM EXERCISES
                    </h3>
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                        {custom.map((ex) => (
                            <div
                                key={ex.id}
                                className="flex items-center justify-between rounded-sm border border-[#2a2a20] bg-[#141410] p-3"
                            >
                                <span className="font-[Share_Tech_Mono] text-xs text-[#e8e8d8]">
                                    {ex.name}
                                </span>
                                <button
                                    onClick={() => handleDelete(ex.id)}
                                    className="font-[Oswald] text-[9px] uppercase tracking-widest text-[#8B0000] transition hover:text-red-500"
                                >
                                    DELETE
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Standard Exercises */}
            <div>
                <h3 className="mb-3 font-[Oswald] text-sm uppercase tracking-widest text-[#7a7a65]">
                    STANDARD EXERCISES
                </h3>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                    {standard.map((ex) => (
                        <div
                            key={ex.id}
                            className="flex items-center justify-between rounded-sm border border-[#2a2a20] bg-[#141410] p-3"
                        >
                            <span className="font-[Share_Tech_Mono] text-xs text-[#e8e8d8]">
                                {ex.name}
                            </span>
                            <span className="rounded-sm border border-[#7a8c40]/30 bg-[#7a8c40]/10 px-1.5 py-0.5 font-[Oswald] text-[8px] uppercase tracking-widest text-[#7a8c40]">
                                STD
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
