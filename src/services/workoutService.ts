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
    async getWorkoutById(Id:number): Promise<Workout>{
        const{data, error} = await supabase
        .from("workouts")
        .select('*')
        .eq('id', Id)
        .single();        

        if(error) console.error("Error getting workout by ID", error.message);
        return data;
    },
    async createWorkout(NewWorkout:NewWorkout,excercises:Excercise[]): Promise<Workout>{
        const{data,error} = await supabase
        .from("workouts")
        .insert(NewWorkout)
        .select()
        .single();

        const workoutId = data.id;

        // nested for loop approach
        /*for(let i:number = 0; i < excercises.length; i++){
            for(let j:number = 0; j < excercises[i].sets.length; j++){
                const newSet:NewSet = {
                    excercise:excercises[i].name,
                    reps:excercises[i].sets[j].reps,
                    weight:excercises[i].sets[j].weight,
                    workout_id:workoutId
                };
                await setService.createSet(newSet);
            }
        }*/

        if(error) console.error("Error adding workout", error.message);
        return data;
    },
    async updateWorkout(updatedWorkout:NewWorkout,updatedExercises:Excercise[],date:CalendarDate): Promise<Workout>{
        const{data,error} = await supabase
        .from("workouts")
        .update(updatedWorkout)
        .eq('created_at',date)
        .select('*')
        .single();

        const flatSets:NewSet[] = updatedExercises.flatMap((excercise)=>
            excercise.sets.map((set)=> ({
                excercise: excercise.name,
                reps: set.reps,
                weight: set.weight,
                workout_id: data.id,
                created_at: data.crea
            }))
        );

        await setService.resetSetsByWorkoutId(data.id);

        if(flatSets.length > 0) {
            const {error:insertError} = await supabase
            .from("sets")
            .insert(flatSets);
        }

        if(error) console.error("Error updating workout", error.message);
        return data;
    }
};