import WorkoutCalender from "../components/WorkoutCalender";
import "./WorkoutPage.css";
import { useEffect, useState } from "react";
import { today, getLocalTimeZone, CalendarDate } from "@internationalized/date";
import ExerciseTracker from "../components/ExerciseTracker";
import type { NewSet, Exercise, Workout, NewMovement } from "../types/database";
import { Button, Card } from "@heroui/react";
import { workoutService } from "../services/workoutService";
import { setService } from "../services/setService";
import { useUser } from "../contexts/UserContext";              
import { movementService } from "../services/movementService";

export default function WorkoutPage(){
    const { user, isLoading } = useUser();
    const [pickedDate, setDate] = useState<CalendarDate>(today(getLocalTimeZone()));
    const [addedExercises, setAddedExercises] = useState<Exercise[]>([]);
    const [workoutDates, setWorkoutDates] = useState<string[]>([]);
    const [movements, setMovements] = useState<NewMovement[]>([]);

    const handleAddExercise = (newExercise:Exercise) => {
        setAddedExercises(prev => [...prev, newExercise]);
    };

    const getJustDate = (date:string):string => {const parts:string[] = date.split('T'); return parts[0]};

    const getMovements = async() => {
        const availableMovements = await movementService.getMovements();
        setMovements(availableMovements);
    }

    const getWorkoutDates = async() =>{
        if(!user?.id) return;
        const workouts:Workout[] = await workoutService.getWorkouts(user.id);
        setWorkoutDates(workouts.map(curWorkout=>getJustDate(curWorkout.created_at)));
    }

    const handleNewDate = async(date:CalendarDate)=>{
        setDate(date);
        if(!user?.id) return;
        const pickedWorkout = await workoutService.getWorkoutByDate(date, user.id);
        if(!pickedWorkout){
            console.log("there is no workout for this day");
            setAddedExercises([]);
            return;
        }
        const workoutId = pickedWorkout.id;
        const userId = user.id;
        const newSets = await setService.getSetsById(workoutId, userId);
        const updatedExercises: Exercise[] = [];
        for(let i:number = 0; i < newSets.length; i++){
            const currentSet = newSets[i];
            const matchedExercise = updatedExercises.find(
                (exercise)=>exercise.name === currentSet.exercise
            );
            if(matchedExercise){
                matchedExercise.sets.push(currentSet);
            }
            else {
                updatedExercises.push({
                    name: currentSet.exercise,
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

    const handleRemoveExercise = (exerciseIndex:number) => {
        const updatedExercises = [...addedExercises];
        updatedExercises.splice(exerciseIndex, 1); 
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
        if(!user){
            console.log("can't");
            return;
        }
        const newWorkoutData = {
            created_at: pickedDate.toString(), // e.g., "2026-08-13"
            user_id:user.id
        };
        if(!await workoutService.getWorkoutByDate(pickedDate,user.id)){
            await workoutService.createWorkout(newWorkoutData,addedExercises);
        } else{
            await workoutService.updateWorkout(newWorkoutData, addedExercises, pickedDate);
        }
    };

    useEffect(()=> {
        handleNewDate(today(getLocalTimeZone()));
        getWorkoutDates();
        getMovements();
    }, [user?.id]);

    return(
        <div>
            <div className="CalenderContainer">
                <WorkoutCalender workoutDates={workoutDates} setDate={(date)=>handleNewDate(date)} pickedDate={pickedDate}/>
            </div>
            <Card variant="tertiary" className="ExerciseTrackerCard">
                <ExerciseTracker
                onEditSet={handleEditSet}
                onRemoveSet={handleRemoveSet}
                availableExercises={movements.map(movement=>movement.name)}
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