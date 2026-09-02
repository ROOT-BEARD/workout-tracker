import { Button } from "@heroui/react";
import { useState } from "react";
import type { NewSet, Exercise } from "../types/database";
import SetPopup from "./SetPopup";
import "./ExerciseTracker.css";
import CollaspableCard from "./CollaspableCard";
import ExerciseComboBox from "./ExerciseComboBox";
import SetCard from "./SetCard";
import { CirclePlus, TrashBin } from "@gravity-ui/icons";

interface ExerciseTrackerProps{
    availableExercises: string[];
    addedExercises: Exercise[];
    onAddExercise: (newExercise: Exercise) => void;
    onRemoveExercise: (exerciseIndex: number) => void;
    onRemoveSet: (index: number, setIndex:number) => void;
    onAddset: (index: number, newSet: NewSet) => void;
    onEditSet: (exerciseIndex:number,setIndex:number,newSet:NewSet) => void;
};

export default function ExerciseTracker({
    availableExercises,
    addedExercises,
    onAddExercise,
    onRemoveExercise,
    onAddset,
    onRemoveSet,
    onEditSet
    }:ExerciseTrackerProps)
    {
    const [selectedExercise, setExercise] = useState<string>("");


    const handleAdd = () => {
        const found = availableExercises.find(
            (e) => e.toLocaleLowerCase() === selectedExercise.toLowerCase()
        );
        if(!found){
            console.log("error adding exercise to added list");
            return;
        }

        const newExercise:Exercise = {
            name:found,
            sets:[]
        };

        onAddExercise(newExercise);
        setExercise("");
    }

    const emptySet:NewSet={
        weight: 0,
        reps: 0,
        exercise: '',
        workout_id: 0,
        user_id: ''
    };

    const addedExercisesList = addedExercises.map((exercise,exerciseIndex) => (
        <CollaspableCard title={exercise.name}>
            {exercise.sets.length > 0 
            ?exercise.sets.map((set,setIndex)=>
                <div className="flex flex-row">
                    <SetPopup
                    onAddSet={(newSet)=>onEditSet(exerciseIndex,setIndex,newSet)}
                    handleRemove={()=>onRemoveSet(exerciseIndex,setIndex)}>
                        <SetCard 
                            setIndex={setIndex}
                            set={set}
                        />
                    </SetPopup>
                </div>
            ):
            <></>}
            <div className="flex justify-between">
                <Button variant="danger-soft" onDoubleClick={()=>onRemoveExercise(exerciseIndex)}><TrashBin/></Button>
                <Button variant="outline" onClick={()=>onAddset(exerciseIndex,{...emptySet, exercise: exercise.name})}><CirclePlus/></Button>
            </div>
        </CollaspableCard>
    ));

    return(
        <div className="flex flex-col items-center gap-4">
            {addedExercisesList}
            <ExerciseComboBox 
            selectedExercise={selectedExercise}
            setExercise={setExercise}
            availableExercises={availableExercises}
            handleSubmit={handleAdd}/>
        </div>
    );
}