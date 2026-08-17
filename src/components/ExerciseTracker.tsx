import { Card, Button, Popover, ComboBox, Input, ListBox, ListBoxItem, ListBoxItemIndicator } from "@heroui/react";
import { useState } from "react";
import type { NewSet, Exercise } from "../types/database";
import SetPopup from "./SetPopup";
import "./ExerciseTracker.css";
import CollaspableCard from "./CollaspableCard";

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
    const [popoverOpen,setPopoverOpen] = useState<boolean>(false);


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
        setPopoverOpen(false);
        setExercise("");
    }

    const exerciseList = availableExercises.map(exercise => 
    <ListBoxItem textValue={exercise}>
        {exercise}
        <ListBoxItemIndicator />
    </ListBoxItem>);

    const defaultSet:NewSet={
        weight: 0,
        reps: 0,
        exercise: ''
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
                <Popover isOpen={popoverOpen} onOpenChange={setPopoverOpen}>
                    <Popover.Trigger>
                        <Button>+</Button>
                    </Popover.Trigger>
                    <Popover.Content placement="top">
                        <Card>
                            <h1>This is the exercise pop up</h1>
                            <ComboBox inputValue={selectedExercise}
                                      onInputChange={setExercise}
                                    >
                                <ComboBox.InputGroup>
                                    <Input placeholder="Exercise Name"/>
                                </ComboBox.InputGroup>
                                <ListBox style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                    {exerciseList}
                                </ListBox>
                            </ComboBox>
                            <Button onClick={handleAdd}>ADD EXERCISE</Button>
                        </Card>
                    </Popover.Content>
                </Popover>
            </div>
        </div>
    );
}