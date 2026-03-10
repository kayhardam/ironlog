import AppLayout from '@/layouts/AppLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

const PLATES = [
    { weight: 25, color: '#8B0000' },
    { weight: 20, color: '#2563eb' },
    { weight: 15, color: '#ca8a04' },
    { weight: 10, color: '#16a34a' },
    { weight: 5, color: '#e8e8d8' },
    { weight: 2.5, color: '#7a7a65' },
    { weight: 1.25, color: '#4a4a40' },
] as const;

function PlateCalculator() {
    const [target, setTarget] = useState('');
    const [barWeight, setBarWeight] = useState('20');

    const targetNum = parseFloat(target) || 0;
    const barNum = parseFloat(barWeight) || 20;
    let perSide = (targetNum - barNum) / 2;

    const plates: { weight: number; color: string }[] = [];
    if (perSide > 0) {
        for (const plate of PLATES) {
            while (perSide >= plate.weight) {
                plates.push(plate);
                perSide -= plate.weight;
            }
        }
    }

    return (
        <div className="rounded-sm border border-[#2a2a20] bg-[#141410] p-4">
            <h3 className="mb-3 font-[Oswald] text-sm uppercase tracking-widest text-[#e8e8d8]">
                PLATE CALCULATOR
            </h3>
            <div className="mb-3 grid grid-cols-2 gap-2">
                <div>
                    <label className="font-[Share_Tech_Mono] text-[10px] uppercase tracking-widest text-[#7a7a65]">
                        TARGET (KG)
                    </label>
                    <input
                        type="number"
                        value={target}
                        onChange={(e) => setTarget(e.target.value)}
                        step="0.5"
                        className="mt-1 w-full rounded-sm border border-[#2a2a20] bg-[#0d0d0b] px-3 py-2 font-[Share_Tech_Mono] text-sm text-[#e8e8d8] focus:border-[#7a8c40] focus:outline-none"
                    />
                </div>
                <div>
                    <label className="font-[Share_Tech_Mono] text-[10px] uppercase tracking-widest text-[#7a7a65]">
                        BAR (KG)
                    </label>
                    <input
                        type="number"
                        value={barWeight}
                        onChange={(e) => setBarWeight(e.target.value)}
                        className="mt-1 w-full rounded-sm border border-[#2a2a20] bg-[#0d0d0b] px-3 py-2 font-[Share_Tech_Mono] text-sm text-[#e8e8d8] focus:border-[#7a8c40] focus:outline-none"
                    />
                </div>
            </div>

            {plates.length > 0 && (
                <div>
                    <div className="mb-2 font-[Oswald] text-[10px] uppercase tracking-widest text-[#7a7a65]">
                        PER SIDE
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                        {plates.map((p, i) => (
                            <div
                                key={i}
                                className="flex h-10 w-10 items-center justify-center rounded-sm border border-[#2a2a20] font-[Share_Tech_Mono] text-[10px] font-bold"
                                style={{
                                    backgroundColor: p.color + '20',
                                    borderColor: p.color,
                                    color: p.color,
                                }}
                            >
                                {p.weight}
                            </div>
                        ))}
                    </div>
                    {perSide > 0.01 && (
                        <p className="mt-2 font-[Share_Tech_Mono] text-[10px] text-[#8B0000]">
                            Remainder: {perSide.toFixed(2)}kg cannot be loaded
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}

function OneRmEstimator() {
    const [weight, setWeight] = useState('');
    const [reps, setReps] = useState('');

    const w = parseFloat(weight) || 0;
    const r = parseInt(reps) || 0;
    const orm = w > 0 && r > 0 ? w * (1 + r / 30) : 0;

    return (
        <div className="rounded-sm border border-[#2a2a20] bg-[#141410] p-4">
            <h3 className="mb-3 font-[Oswald] text-sm uppercase tracking-widest text-[#e8e8d8]">
                1RM ESTIMATOR
            </h3>
            <div className="mb-3 grid grid-cols-2 gap-2">
                <div>
                    <label className="font-[Share_Tech_Mono] text-[10px] uppercase tracking-widest text-[#7a7a65]">
                        WEIGHT (KG)
                    </label>
                    <input
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        step="0.5"
                        className="mt-1 w-full rounded-sm border border-[#2a2a20] bg-[#0d0d0b] px-3 py-2 font-[Share_Tech_Mono] text-sm text-[#e8e8d8] focus:border-[#7a8c40] focus:outline-none"
                    />
                </div>
                <div>
                    <label className="font-[Share_Tech_Mono] text-[10px] uppercase tracking-widest text-[#7a7a65]">
                        REPS
                    </label>
                    <input
                        type="number"
                        value={reps}
                        onChange={(e) => setReps(e.target.value)}
                        min={1}
                        className="mt-1 w-full rounded-sm border border-[#2a2a20] bg-[#0d0d0b] px-3 py-2 font-[Share_Tech_Mono] text-sm text-[#e8e8d8] focus:border-[#7a8c40] focus:outline-none"
                    />
                </div>
            </div>

            {orm > 0 && (
                <div className="rounded-sm border border-[#2a2a20] bg-[#0d0d0b] p-3 text-center">
                    <div className="font-[Oswald] text-[10px] uppercase tracking-widest text-[#7a7a65]">
                        ESTIMATED 1RM
                    </div>
                    <div className="font-[Share_Tech_Mono] text-3xl text-[#8B0000]">
                        {orm.toFixed(1)}
                        <span className="text-base text-[#7a7a65]">kg</span>
                    </div>
                </div>
            )}
        </div>
    );
}

function WarmupGenerator() {
    const [weight, setWeight] = useState('');
    const w = parseFloat(weight) || 0;

    const warmups =
        w > 0
            ? [
                  { pct: 40, weight: (w * 0.4).toFixed(1), reps: 10 },
                  { pct: 60, weight: (w * 0.6).toFixed(1), reps: 8 },
                  { pct: 80, weight: (w * 0.8).toFixed(1), reps: 5 },
                  { pct: 90, weight: (w * 0.9).toFixed(1), reps: 3 },
              ]
            : [];

    return (
        <div className="rounded-sm border border-[#2a2a20] bg-[#141410] p-4">
            <h3 className="mb-3 font-[Oswald] text-sm uppercase tracking-widest text-[#e8e8d8]">
                WARMUP GENERATOR
            </h3>
            <div className="mb-3">
                <label className="font-[Share_Tech_Mono] text-[10px] uppercase tracking-widest text-[#7a7a65]">
                    WORKING WEIGHT (KG)
                </label>
                <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    step="0.5"
                    className="mt-1 w-full rounded-sm border border-[#2a2a20] bg-[#0d0d0b] px-3 py-2 font-[Share_Tech_Mono] text-sm text-[#e8e8d8] focus:border-[#7a8c40] focus:outline-none"
                />
            </div>

            {warmups.length > 0 && (
                <div className="space-y-1">
                    {warmups.map((wu) => (
                        <div
                            key={wu.pct}
                            className="flex items-center justify-between rounded-sm border border-[#2a2a20] bg-[#0d0d0b] px-3 py-2"
                        >
                            <span className="font-[Oswald] text-xs text-[#7a8c40]">
                                {wu.pct}%
                            </span>
                            <span className="font-[Share_Tech_Mono] text-sm text-[#e8e8d8]">
                                {wu.weight}kg
                            </span>
                            <span className="font-[Share_Tech_Mono] text-xs text-[#7a7a65]">
                                x{wu.reps}
                            </span>
                        </div>
                    ))}
                    <div className="flex items-center justify-between rounded-sm border border-[#8B0000]/30 bg-[#8B0000]/10 px-3 py-2">
                        <span className="font-[Oswald] text-xs text-[#8B0000]">
                            100%
                        </span>
                        <span className="font-[Share_Tech_Mono] text-sm font-bold text-[#e8e8d8]">
                            {w.toFixed(1)}kg
                        </span>
                        <span className="font-[Share_Tech_Mono] text-xs text-[#7a7a65]">
                            WORK
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function Tools() {
    return (
        <AppLayout>
            <Head title="Tools" />
            <h2 className="mb-4 font-[Oswald] text-lg uppercase tracking-widest">
                TOOLS
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <PlateCalculator />
                <OneRmEstimator />
                <WarmupGenerator />
            </div>
        </AppLayout>
    );
}
