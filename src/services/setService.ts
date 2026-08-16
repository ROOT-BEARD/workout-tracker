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
    },
    async getSetsById(id:number): Promise<Set[]>{
        const {data,error} = await supabase
        .from("sets")
        .select("*")
        .eq('workout_id', id);
        if(error) console.error("Error fecthing sets for workout", error.message);
        return data ?? [];
    },
    async getSetsByExcercise(excercise:string): Promise<Set[]>{
        const {data,error} = await supabase
        .from("sets")
        .select("*")
        .eq('excercise', excercise);
        if(error) console.error("Error fecthing sets for excercise", error.message);
        return data ?? [];
    },
    async resetSetsByWorkoutId(id:number) {
        const {error:insertError} = await supabase
        .from("sets")
        .delete()
        .eq("workout_id", id);
        if(insertError) console.error("Error deleting set: ", insertError.message);

        return;
    },
    async getSetsWithDate() {
        
    }
};