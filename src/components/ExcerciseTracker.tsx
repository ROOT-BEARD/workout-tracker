import { Card, Button, Popover, ComboBox, Input, ListBox, ListBoxItem, ListBoxItemIndicator } from "@heroui/react";
import { useState } from "react";
import type { NewSet, Excercise } from "../types/database";
import SetPopup from "./SetPopup";
import "./ExcerciseTracker.css";
import CollaspableCard from "./CollaspableCard";

interface ExcerciseTrackerProps{
    availableExercises: string[];
    addedExercises: Excercise[];
    onAddExercise: (newExcercise: Excercise) => void;
    onRemoveExercise: (excerciseIndex: number) => void;
    onRemoveSet: (index: number, setIndex:number) => void;
    onAddset: (index: number, newSet: NewSet) => void;
    onEditSet: (exerciseIndex:number,setIndex:number,newSet:NewSet) => void;
};

export default function ExcerciseTracker({
    availableExercises,
    addedExercises,
    onAddExercise,
    onRemoveExercise,
    onAddset,
    onRemoveSet,
    onEditSet
    }:ExcerciseTrackerProps)
    {
    const [selectedExcercise, setExcercise] = useState<string>("");
    const [popoverOpen,setPopoverOpen] = useState<boolean>(false);


    const handleAdd = () => {
        const found = availableExercises.find(
            (e) => e.toLocaleLowerCase() === selectedExcercise.toLowerCase()
        );
        if(!found){
            console.log("error adding excercise to added list");
            return;
        }

        const newExcercise:Excercise = {
            name:found,
            sets:[]
        };

        onAddExercise(newExcercise);
        setPopoverOpen(false);
        setExcercise("");
    }

    const exerciseList = availableExercises.map(excercise => 
    <ListBoxItem textValue={excercise}>
        {excercise}
        <ListBoxItemIndicator />
    </ListBoxItem>);

    const defaultSet:NewSet={
        weight: 0,
        reps: 0,
        excercise: ''
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
                        <Button onClick={()=>onRemoveSet(exerciseIndex,index)}>Remove</Button>
                    </Card.Header>
                    <Card.Content style={{display:'flex', flexDirection:'row'}}>
                        <Card variant="secondary">Reps {set.reps}</Card>
                        <Card variant="secondary">Weight {set.weight}</Card>
                    </Card.Content>
                </Card>
            ):
            <></>}
            <div style={{display:'flex', justifyContent:'space-between'}}>
                <Button variant="danger" onClick={()=>onRemoveExercise(exerciseIndex)}>Remove Excercise</Button>
                <Button onClick={()=>onAddset(exerciseIndex,{...defaultSet, excercise: exercise.name})}>Add Set</Button>
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
                            <h1>This is the excercise pop up</h1>
                            <ComboBox inputValue={selectedExcercise}
                                      onInputChange={setExcercise}
                                    >
                                <ComboBox.InputGroup>
                                    <Input placeholder="Excercise Name"/>
                                </ComboBox.InputGroup>
                                <ListBox style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                    {exerciseList}
                                </ListBox>
                            </ComboBox>
                            <Button onClick={handleAdd}>ADD EXCERCISE</Button>
                        </Card>
                    </Popover.Content>
                </Popover>
            </div>
        </div>
    );
}