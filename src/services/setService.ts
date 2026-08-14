import { supabase } from "../supabase-client";
import type { Set, NewSet } from "../types/database";

export const setService = {
    async getSetsForWorkout(workoutId: number): Promise<Set[]>{
        const {data, error} = await supabase
            .from("sets")
            .select("*")
            .eq("workoutId", workoutId);

        if(error) console.error("Error getting sets: ", error.message);
        return data ?? [];
    },
    
    async createSet(NewSet: NewSet): Promise<Set>{
        const {data, error} = await supabase
            .from("sets")
            .insert(NewSet)
            .select()
            .single();
        if(error) console.error("Error adding sets: ", error.message)
        return data;
    }
};