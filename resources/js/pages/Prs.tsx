import AppLayout from '@/layouts/AppLayout';
import type { PersonalRecord } from '@/types/models';
import { Head } from '@inertiajs/react';

type Props = {
    prs: PersonalRecord[];
};

export default function Prs({ prs }: Props) {
    return (
        <AppLayout>
            <Head title="Personal Records" />
            <h2 className="mb-4 font-[Oswald] text-lg uppercase tracking-widest">
                PERSONAL RECORDS
            </h2>

            {prs.length === 0 && (
                <p className="font-[Share_Tech_Mono] text-sm text-[#7a7a65]">
                    No records yet. Start logging workouts to track PRs.
                </p>
            )}

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {prs.map((pr) => (
                    <div
                        key={pr.exercise_id}
                        className="rounded-sm border border-[#2a2a20] bg-[#141410] p-4"
                    >
                        <div className="mb-1 font-[Oswald] text-[10px] uppercase tracking-widest text-[#7a7a65]">
                            {pr.exercise_name}
                        </div>
                        <div className="font-[Share_Tech_Mono] text-3xl font-bold text-[#8B0000]">
                            {parseFloat(pr.weight).toFixed(1)}
                            <span className="text-base text-[#7a7a65]">kg</span>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                            <span className="font-[Share_Tech_Mono] text-[10px] text-[#7a7a65]">
                                {pr.sets}x{pr.reps}
                            </span>
                            <span className="font-[Share_Tech_Mono] text-[10px] text-[#7a8c40]">
                                {new Date(pr.date).toLocaleDateString('en-GB', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric',
                                })}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </AppLayout>
    );
}
