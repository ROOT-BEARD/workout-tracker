export interface Set {
    id?: number;
    created_at?: string;
    reps:number;
    weight:number;
    excercise?:string;
    workout_id?:number;
}

export interface Workout{
    id: number;
    created_at: string;
}

export interface Excercise {
    name:string;
    sets:NewSet[];
}

export type NewSet = Omit<Set, "id"|"created_at">;
export type NewWorkout = Omit<Workout, "id">