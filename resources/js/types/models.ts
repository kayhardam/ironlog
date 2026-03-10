export type Exercise = {
    id: number;
    user_id: number | null;
    name: string;
    is_standard: boolean;
    created_at: string;
    updated_at: string;
};

export type SessionRow = {
    id: number;
    workout_session_id: number;
    exercise_id: number;
    sets: number;
    reps: number;
    weight: string;
    exercise: Exercise;
    created_at: string;
    updated_at: string;
};

export type WorkoutSession = {
    id: number;
    user_id: number;
    name: string;
    performed_at: string;
    rows: SessionRow[];
    created_at: string;
    updated_at: string;
};

export type PersonalRecord = {
    exercise_id: number;
    exercise_name: string;
    weight: string;
    date: string;
    sets: number;
    reps: number;
};

export type VolumeDataPoint = {
    date: string;
    volume: number;
    weight: number;
};

export type VolumeData = Record<string, VolumeDataPoint[]>;
