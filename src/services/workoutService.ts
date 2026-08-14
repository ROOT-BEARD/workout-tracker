import type { CalendarDate } from "@internationalized/date";
import { supabase } from "../supabase-client";
import type { Workout, NewWorkout, NewSet, Excercise } from "../types/database";
import { setService } from "./setService";

export const workoutService = {
    async getWorkout(): Promise<Workout>{
        const{data, error} = await supabase
        .from("workouts")
        .select()
        .single();        

        if(error) console.error("Error getting workout", error.message);
        return data;
    },
    async getWorkoutByDate(date:CalendarDate): Promise<Workout>{
        const{data, error} = await supabase
        .from("workouts")
        .select('*')
        .eq('created_at', date)
        .single();        

        if(error) console.error("Error getting workout", error.message);
        return data;
    },
    async createWorkout(NewWorkout:NewWorkout,excercises:Excercise[]): Promise<Workout>{
        const{data,error} = await supabase
        .from("workouts")
        .insert(NewWorkout)
        .select()
        .single();

        const workoutId = data.id;

        for(let i:number = 0; i < excercises.length; i++){
            for(let j:number = 0; j < excercises[i].sets.length; j++){
                const newSet:NewSet = {
                    excercise:excercises[i].name,
                    reps:excercises[i].sets[j].reps,
                    weight:excercises[i].sets[j].weight,
                    workout_id:workoutId
                };
                setService.createSet(newSet);
            }
        }

        if(error) console.error("Error adding workout", error.message);
        return data;
    }
};