import { Card, Button} from "@heroui/react";
import { useState } from "react";
import type { NewSet, Exercise } from "../types/database";
import SetPopup from "./SetPopup";
import "./ExerciseTracker.css";
import CollaspableCard from "./CollaspableCard";
import ExerciseComboBox from "./ExerciseSelectPopup";

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

    const defaultSet:NewSet={
        weight: 0,
        reps: 0,
        exercise: '',
        workout_id: 0
    };

    const addedExercisesList = addedExercises.map((exercise,exerciseIndex) => (
        <CollaspableCard title={exercise.name}>
            {exercise.sets.length > 0 
            ?exercise.sets.map((set,index)=>
                <Card variant="secondary" className="SetCard">
                    <Card.Header style={{display:'flex', justifyContent:'space-between', flexDirection:'row'}}>
                        <div>
                            Set {index + 1}
                        </div>
                        <SetPopup onAddSet={(newSet)=>onEditSet(exerciseIndex,index,newSet)}>
                            <Button>Edit</Button>
                        </SetPopup>
                        <Button variant="danger" onClick={()=>onRemoveSet(exerciseIndex,index)}>X</Button>
                    </Card.Header>
                    <Card.Content style={{display:'flex', flexDirection:'row'}}>
                        <Card variant="secondary">Reps {set.reps}</Card>
                        <Card variant="secondary">Weight {set.weight}</Card>
                    </Card.Content>
                </Card>
            ):
            <></>}
            <div style={{display:'flex', justifyContent:'space-between'}}>
                <Button variant="danger" onClick={()=>onRemoveExercise(exerciseIndex)}>Remove Exercise</Button>
                <Button onClick={()=>onAddset(exerciseIndex,{...defaultSet, exercise: exercise.name})}>Add Set</Button>
            </div>
        </CollaspableCard>
    ));

    return(
        <div style={{display:'flex', alignItems:'center', flexDirection:'column'}}>
            <div>
                {addedExercisesList}
                <ExerciseComboBox 
                selectedExercise={selectedExercise}
                setExercise={setExercise}
                availableExercises={availableExercises}
                handleSubmit={handleAdd}/>
            </div>
        </div>
    );
}