# IRON LOG — Project Context for Claude Code

## Stack
Laravel 12, Inertia.js, React 18, TypeScript, Tailwind CSS, PostgreSQL, Pest

## Design Tokens
- bg: #0d0d0b | panel: #141410 | border: #2a2a20
- accent-red: #8B0000 | olive: #7a8c40 | olive-light: #9aae52
- Font headings: Oswald | Font data/mono: Share Tech Mono
- All UI labels: UPPERCASE font-mono tracking-widest
- Cards: bg-[#141410] border border-[#2a2a20] rounded-sm

## Conventions
- Controllers in app/Http/Controllers/ — thin, delegate to models
- React pages in resources/js/pages/
- Shared components in resources/js/components/ui/
- Weight always stored in kg as decimal(6,2)
- Session names always stored UPPERCASE
- All user-scoped queries use Auth::id() or auth()->id()
- Use Epley formula for 1RM: weight × (1 + reps/30)
- Pest for all tests — no PHPUnit style
- TypeScript strict mode — no any types

## Key Models
- Exercise (id, user_id nullable, name, is_standard)
- WorkoutSession (id, user_id, name, performed_at)
- SessionRow (id, workout_session_id, exercise_id, sets, reps, weight decimal(6,2))

## Routes Pattern
- All app routes under auth middleware
- Resource controllers where possible
- Inertia::render('PageName', compact('data'))

## Status
- [x] Laravel 12 + React + TypeScript + Inertia installed
- [x] Auth scaffolding (register/login)
- [x] PostgreSQL connected
- [x] Base migrations done
- [x] Exercise, WorkoutSession, SessionRow migrations
- [x] Models + relationships + accessors
- [x] Factories + Seeder
- [x] WorkoutSessionPolicy
- [x] Controllers
- [x] React pages (Log, History, Prs, Progress, Tools, Library)
- [x] Tactical dark theme (AppLayout + design tokens)
- [x] Charts (Recharts on Progress page)
- [x] PDF (dompdf on History page)
- [x] CI (GitHub Actions: tests + build)
- [ ] Deploy
