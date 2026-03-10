import { Link, router, usePage } from '@inertiajs/react';
import { useCallback, useEffect, useRef, useState } from 'react';

const TABS = [
    { label: 'LOG', href: '/workout-sessions' },
    { label: 'HISTORY', href: '/history' },
    { label: 'PRs', href: '/prs' },
    { label: 'PROGRESS', href: '/progress' },
    { label: 'TOOLS', href: '/tools' },
    { label: 'LIBRARY', href: '/library' },
] as const;

const TIMER_OPTIONS = [60, 90, 120, 180, 240] as const;

function RestTimer() {
    const [isOpen, setIsOpen] = useState(false);
    const [duration, setDuration] = useState(90);
    const [remaining, setRemaining] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const audioRef = useRef<AudioContext | null>(null);

    const stop = useCallback(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = null;
        setIsRunning(false);
        setRemaining(0);
    }, []);

    const beep = useCallback(() => {
        try {
            const ctx = audioRef.current ?? new AudioContext();
            audioRef.current = ctx;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.value = 880;
            gain.gain.value = 0.3;
            osc.start();
            osc.stop(ctx.currentTime + 0.3);
        } catch {
            // audio not available
        }
    }, []);

    const start = useCallback(
        (secs: number) => {
            stop();
            setDuration(secs);
            setRemaining(secs);
            setIsRunning(true);
        },
        [stop],
    );

    useEffect(() => {
        if (!isRunning) return;
        intervalRef.current = setInterval(() => {
            setRemaining((prev) => {
                if (prev <= 1) {
                    stop();
                    beep();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isRunning, stop, beep]);

    const progress = duration > 0 ? remaining / duration : 0;
    const circumference = 2 * Math.PI * 42;
    const offset = circumference * (1 - progress);
    const mins = Math.floor(remaining / 60);
    const secs = remaining % 60;

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 rounded-sm border border-[#2a2a20] bg-[#141410] px-3 py-1.5 font-[Oswald] text-[10px] uppercase tracking-widest text-[#e8e8d8] transition hover:border-[#7a8c40]"
            >
                {isRunning ? (
                    <span className="text-[#9aae52]">
                        {mins}:{secs.toString().padStart(2, '0')}
                    </span>
                ) : (
                    'REST TIMER'
                )}
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 z-50 mt-2 w-64 rounded-sm border border-[#2a2a20] bg-[#141410] p-4 shadow-lg">
                    <div className="mb-3 flex justify-center">
                        <svg width="100" height="100" viewBox="0 0 100 100">
                            <circle
                                cx="50"
                                cy="50"
                                r="42"
                                fill="none"
                                stroke="#2a2a20"
                                strokeWidth="4"
                            />
                            <circle
                                cx="50"
                                cy="50"
                                r="42"
                                fill="none"
                                stroke="#8B0000"
                                strokeWidth="4"
                                strokeDasharray={circumference}
                                strokeDashoffset={offset}
                                strokeLinecap="round"
                                transform="rotate(-90 50 50)"
                                className="transition-all duration-1000 ease-linear"
                            />
                            <text
                                x="50"
                                y="54"
                                textAnchor="middle"
                                fill="#e8e8d8"
                                fontFamily="Share Tech Mono"
                                fontSize="20"
                            >
                                {mins}:{secs.toString().padStart(2, '0')}
                            </text>
                        </svg>
                    </div>

                    <div className="grid grid-cols-5 gap-1">
                        {TIMER_OPTIONS.map((t) => (
                            <button
                                key={t}
                                onClick={() => start(t)}
                                className={`rounded-sm border py-1 font-[Share_Tech_Mono] text-[10px] transition ${
                                    duration === t && isRunning
                                        ? 'border-[#8B0000] bg-[#8B0000]/20 text-[#e8e8d8]'
                                        : 'border-[#2a2a20] text-[#7a7a65] hover:border-[#7a8c40] hover:text-[#e8e8d8]'
                                }`}
                            >
                                {t}s
                            </button>
                        ))}
                    </div>

                    {isRunning && (
                        <button
                            onClick={stop}
                            className="mt-2 w-full rounded-sm border border-[#8B0000] py-1 font-[Oswald] text-[10px] uppercase tracking-widest text-[#8B0000] transition hover:bg-[#8B0000]/20"
                        >
                            STOP
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const { url } = usePage();
    const { auth } = usePage().props;

    const handleLogout = (e: React.MouseEvent) => {
        e.preventDefault();
        router.post('/logout');
    };

    return (
        <div
            className="min-h-screen text-[#e8e8d8]"
            style={{
                backgroundColor: '#0d0d0b',
                backgroundImage:
                    'repeating-linear-gradient(0deg, transparent, transparent 27px, #1c1c16 27px, #1c1c16 28px)',
            }}
        >
            {/* Header */}
            <header className="border-b border-[#2a2a20] bg-[#0d0d0b]/90 backdrop-blur">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
                    <div>
                        <h1 className="font-[Oswald] text-2xl font-bold tracking-widest">
                            IRON<span className="text-[#8B0000]">|</span>
                            <span className="text-[#8B0000]">LOG</span>
                        </h1>
                        <p className="font-[Share_Tech_Mono] text-[10px] tracking-widest text-[#7a7a65]">
                            // TACTICAL STRENGTH TRACKER
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <RestTimer />
                        <span className="font-[Share_Tech_Mono] text-xs text-[#7a7a65]">
                            {auth.user.name}
                        </span>
                        <button
                            onClick={handleLogout}
                            className="font-[Oswald] text-[10px] uppercase tracking-widest text-[#7a7a65] transition hover:text-[#8B0000]"
                        >
                            LOGOUT
                        </button>
                    </div>
                </div>
            </header>

            {/* Tab Navigation */}
            <nav className="border-b border-[#2a2a20] bg-[#0d0d0b]/80">
                <div className="mx-auto flex max-w-7xl gap-0 px-4">
                    {TABS.map((tab) => {
                        const isActive =
                            url === tab.href || url.startsWith(tab.href + '/');
                        return (
                            <Link
                                key={tab.href}
                                href={tab.href}
                                className={`border-b-2 px-4 py-2.5 font-[Oswald] text-[11px] tracking-widest transition ${
                                    isActive
                                        ? 'border-[#8B0000] text-[#e8e8d8]'
                                        : 'border-transparent text-[#7a7a65] hover:border-[#2a2a20] hover:text-[#e8e8d8]'
                                }`}
                            >
                                {tab.label}
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* Content */}
            <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
        </div>
    );
}
