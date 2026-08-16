import WorkoutCalender from "./WorkoutCalender";
import "./WorkoutPage.css";
import { useState } from "react";
import { today, getLocalTimeZone, CalendarDate } from "@internationalized/date";
import ExcerciseTracker from "./ExcerciseTracker";
import type { NewSet, Excercise } from "../types/database";
import { Button, Card } from "@heroui/react";
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
        if(!pickedWorkout){
            console.log("there is no workout for this day");
            setAddedExercises([]);
            return;
        }
        const workoutId = pickedWorkout.id;
        const newSets = await setService.getSetsById(workoutId);
        const updatedExercises: Excercise[] = [];
        for(let i:number = 0; i < newSets.length; i++){
            const currentSet = newSets[i];
            const matchedExercise = updatedExercises.find(
                (excercise)=>excercise.name === currentSet.excercise
            );
            if(matchedExercise){
                matchedExercise.sets.push(currentSet);
            }
            else {
                updatedExercises.push({
                    name: currentSet.excercise,
                    sets: [currentSet]
                });
            }
        }
        console.log("there is a workout on this day!");
        setAddedExercises(updatedExercises);
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

    const handleRemoveExercise = (excerciseIndex:number) => {
        const updatedExercises = [...addedExercises];
        updatedExercises.splice(excerciseIndex, 1); 
        setAddedExercises(updatedExercises);
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
        const newWorkoutData = {
            created_at: pickedDate.toString(), // e.g., "2026-08-13"
        };
        if(!await workoutService.getWorkoutByDate(pickedDate)){
            await workoutService.createWorkout(newWorkoutData,addedExercises);
        } else{
            await workoutService.updateWorkout(newWorkoutData, addedExercises, pickedDate);
        }
    };
    
    return(
        <div>
            <div className="CalenderContainer">
                <WorkoutCalender setDate={(date)=>handleNewDate(date)} pickedDate={pickedDate}/>
            </div>
            <Card variant="tertiary" className="ExcerciseTrackerCard">
                <ExcerciseTracker
                onEditSet={handleEditSet}
                onRemoveSet={handleRemoveSet}
                availableExercises={MOCK_EXERCISES}
                addedExercises={addedExercises}
                onAddExercise={handleAddExercise}
                onRemoveExercise={handleRemoveExercise}
                onAddset={handleAddSet}
                />
            </Card>
            <Button onClick={handleSubmit}>SAVE TO DATABASE</Button>
        </div>
    );
}