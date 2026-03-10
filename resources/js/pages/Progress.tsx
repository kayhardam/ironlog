import AppLayout from '@/layouts/AppLayout';
import type { VolumeData } from '@/types/models';
import { Head } from '@inertiajs/react';
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

type Props = {
    volumeData: VolumeData;
};

function VolumeDelta({ data }: { data: { volume: number }[] }) {
    if (data.length < 2) return null;
    const prev = data[data.length - 2].volume;
    const curr = data[data.length - 1].volume;
    const delta = curr - prev;
    const pct = prev > 0 ? ((delta / prev) * 100).toFixed(1) : '0';
    const isUp = delta >= 0;

    return (
        <span
            className={`ml-2 rounded-sm px-1.5 py-0.5 font-[Share_Tech_Mono] text-[10px] ${
                isUp
                    ? 'bg-[#7a8c40]/20 text-[#9aae52]'
                    : 'bg-[#8B0000]/20 text-[#8B0000]'
            }`}
        >
            {isUp ? '\u25B2' : '\u25BC'} {Math.abs(parseFloat(pct))}%
        </span>
    );
}

export default function Progress({ volumeData }: Props) {
    const exercises = Object.keys(volumeData);

    return (
        <AppLayout>
            <Head title="Progress" />
            <h2 className="mb-4 font-[Oswald] text-lg uppercase tracking-widest">
                PROGRESS
            </h2>

            {exercises.length === 0 && (
                <p className="font-[Share_Tech_Mono] text-sm text-[#7a7a65]">
                    No data yet. Log sessions to see progress charts.
                </p>
            )}

            <div className="grid gap-4 lg:grid-cols-2">
                {exercises.map((name) => {
                    const data = volumeData[name];
                    return (
                        <div
                            key={name}
                            className="rounded-sm border border-[#2a2a20] bg-[#141410] p-4"
                        >
                            <div className="mb-3 flex items-center">
                                <h3 className="font-[Oswald] text-xs uppercase tracking-widest text-[#e8e8d8]">
                                    {name}
                                </h3>
                                <VolumeDelta data={data} />
                            </div>
                            <ResponsiveContainer width="100%" height={200}>
                                <LineChart data={data}>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="#2a2a20"
                                    />
                                    <XAxis
                                        dataKey="date"
                                        tick={{
                                            fontSize: 9,
                                            fill: '#7a7a65',
                                            fontFamily: 'Share Tech Mono',
                                        }}
                                        stroke="#2a2a20"
                                    />
                                    <YAxis
                                        tick={{
                                            fontSize: 9,
                                            fill: '#7a7a65',
                                            fontFamily: 'Share Tech Mono',
                                        }}
                                        stroke="#2a2a20"
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#141410',
                                            border: '1px solid #2a2a20',
                                            borderRadius: '2px',
                                            fontFamily: 'Share Tech Mono',
                                            fontSize: 11,
                                            color: '#e8e8d8',
                                        }}
                                    />
                                    <Legend
                                        wrapperStyle={{
                                            fontFamily: 'Oswald',
                                            fontSize: 10,
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.1em',
                                        }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="volume"
                                        stroke="#8B0000"
                                        strokeWidth={2}
                                        dot={{
                                            fill: '#8B0000',
                                            r: 3,
                                            stroke: '#8B0000',
                                        }}
                                        name="Volume (kg)"
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="weight"
                                        stroke="#7a8c40"
                                        strokeWidth={2}
                                        dot={{
                                            fill: '#7a8c40',
                                            r: 3,
                                            stroke: '#7a8c40',
                                        }}
                                        name="Weight (kg)"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    );
                })}
            </div>
        </AppLayout>
    );
}
