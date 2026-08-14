import WorkoutCalender from "./WorkoutCalender";
import { useState } from "react";
import { today, getLocalTimeZone, CalendarDate } from "@internationalized/date";
import ExcerciseTracker from "./ExcerciseTracker";
import type { NewSet, Excercise, Workout } from "../types/database";
import { Button } from "@heroui/react";
import { workoutService } from "../services/workoutService";
import { setService } from "../services/setService";

const MOCK_EXERCISES: string[] = [
    "Bench Press",
    "Incline Dumbbell Press",
    "Squat",
    "Romanian Deadlift",
    "Barbell Deadlift",
    "Lat Pulldown",
    "Overhead Shoulder Press",
    "Tricep Pushdown",
    "Bicep Curl"
];                      

export default function WorkoutPage(){
    
    const [pickedDate, setDate] = useState<CalendarDate>(today(getLocalTimeZone()));
    const [addedExercises, setAddedExercises] = useState<Excercise[]>([]);

    const handleAddExercise = (newExcercise:Excercise) => {
        setAddedExercises(prev => [...prev, newExcercise]);
    };

    const handleNewDate = async(date:CalendarDate)=>{
        setDate(date);
        const pickedWorkout = await workoutService.getWorkoutByDate(date);
        const workoutId = pickedWorkout.id;
        const newSets = await setService.getSetsById(workoutId);
        //const () => setAddedExercises[0].sets = newSets;
    };

    const handleAddSet = (index:number, newSet:NewSet) => {
        setAddedExercises(prev =>
                prev.map((ex, idx) => {
                    if (idx === index) {
                        return {
                            ...ex,
                            sets: [...ex.sets, newSet]
                        };
                    }
                    return ex;
                })
            );
        };

    const handleRemoveExercise = () => {
        setAddedExercises(prev => prev.slice(0, -1));
    };

    const handleEditSet = (exerciseIndex:number,setIndex:number,newSet:NewSet) => {
        setAddedExercises(prev =>
            prev.map((ex,idx) =>{
                if(idx === exerciseIndex){
                    const updatedSets = [...ex.sets];
                    updatedSets[setIndex] = newSet;
                    return{
                        ...ex,
                        sets: updatedSets
                    };
                }
                return ex;
            })
        );
    };

    const handleRemoveSet = (exerciseIndex:number,setIndex:number) => {
        setAddedExercises(prev =>
            prev.map((ex,idx) => {
                if(idx === exerciseIndex){
                    const updatedSets = [...ex.sets];
                    updatedSets.splice(setIndex, 1);
                    return{
                        ...ex,
                        sets: updatedSets
                    };
                }
                return ex;
            })
        );
    };

    const handleSubmit = async () => {
        if(!await workoutService.getWorkoutByDate(pickedDate)){
            const newWorkoutData = {
                created_at: pickedDate.toString(), // e.g., "2026-08-13"
            };
            await workoutService.createWorkout(newWorkoutData,addedExercises);
        }
    };
    
    return(
        <div>
            <WorkoutCalender setDate={(date)=>handleNewDate(date)} pickedDate={pickedDate}/>
            <h1>Date picked: {pickedDate.toString()}</h1>

            <ExcerciseTracker
            onEditSet={handleEditSet}
            onRemoveSet={handleRemoveSet}
            availableExercises={MOCK_EXERCISES}
            addedExercises={addedExercises}
            onAddExercise={handleAddExercise}
            onRemoveExercise={handleRemoveExercise}
            onAddset={handleAddSet}
            />
            <Button onClick={handleSubmit}>SAVE TO DATABASE</Button>
        </div>
    );
}