import type { CalendarDate } from "@internationalized/date";
import { supabase } from "../supabase-client";
import type { Workout, NewWorkout, NewSet, Exercise } from "../types/database";
import { setService } from "./setService";

export const workoutService = {
    async getWorkouts(user_id:string): Promise<Workout[]>{
        const{data, error} = await supabase
        .from("workouts")
        .select('*')
        .eq("user_id", user_id);        

        if(error) console.error("Error getting workouts", error.message);
        return data??[];
    },
    async deleteWorkout(workout_id:number){
        await setService.resetSetsByWorkoutId(workout_id);

        const{error:deleteError} = await supabase
        .from('workouts')
        .delete()
        .eq('id', workout_id);

        if(deleteError) console.error("error deleting workout: ", deleteError.message);
    },
    async getWorkoutByDate(date:CalendarDate,user_id:string): Promise<Workout>{
        const{data, error} = await supabase
        .from("workouts")
        .select('*')
        .eq('created_at', date)
        .eq('user_id',user_id)
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
    async createWorkout(NewWorkout:NewWorkout,exercises:Exercise[]): Promise<Workout>{
        const{data,error} = await supabase
        .from("workouts")
        .insert(NewWorkout)
        .select()
        .single();

        const workoutId = data.id;

        // nested for loop approach
        for(let i:number = 0; i < exercises.length; i++){
            for(let j:number = 0; j < exercises[i].sets.length; j++){
                const newSet:NewSet = {
                    exercise:exercises[i].name,
                    reps:exercises[i].sets[j].reps,
                    weight:exercises[i].sets[j].weight,
                    workout_id:workoutId,
                    user_id:data.user_id
                };
                await setService.createSet(newSet);
            }
        }

        if(error) console.error("Error adding workout", error.message);
        return data;
    },
    async updateWorkout(updatedWorkout:NewWorkout,updatedExercises:Exercise[],date:CalendarDate): Promise<Workout>{
        const{data,error} = await supabase
        .from("workouts")
        .update(updatedWorkout)
        .eq('created_at',date)
        .select('*')
        .single();

        const flatSets:NewSet[] = updatedExercises.flatMap((exercise)=>
            exercise.sets.map((set)=> ({
                exercise: exercise.name,
                reps: set.reps,
                weight: set.weight,
                workout_id: data.id,
                user_id: data.user_id
            }))
        );

        await setService.resetSetsByWorkoutId(data.id);

        if(flatSets.length > 0) {
            const {error:insertError} = await supabase
            .from("sets")
            .insert(flatSets);
            if(insertError) console.error("ERROR UPDATING SETS", insertError.message);
        }

        if(error) console.error("Error updating workout", error.message);
        return data;
    }
};