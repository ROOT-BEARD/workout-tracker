export interface Set {
    id?: number;
    created_at: string;
    reps:number;
    weight:number;
    exercise:string;
    workout_id:number;
    user_id:string;
}

export interface Workout{
    id: number;
    created_at: string;
    user_id: string;
}

export interface Exercise {
    name:string;
    sets:NewSet[];
}

export interface Movement {
    id:number;
    created_at:string;
    name:string;
    muscle_groups:string[];
    primary_muscle:string;
}

export interface Account {
    email:string;
    username:string;
    created_at?: string;
    password:string;
}

export type NewMovement = Omit<Movement, "id"|"created_at">;
export type NewAccount = Omit<Account, "created_at">;
export type NewSet = Omit<Set, "id"|"created_at">;
export type NewWorkout = Omit<Workout, "id">;