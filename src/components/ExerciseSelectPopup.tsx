import { Button, Card, ComboBox, FieldError, Input, ListBox, ListBoxItem, ListBoxItemIndicator, Popover } from "@heroui/react";
import { useEffect, useState } from "react";

interface ExerciseComboBoxProps{
    selectedExercise:string,
    setExercise:(exerciseName:string)=>void,
    availableExercises:string[],
    handleSubmit:()=>void;
};

export default function ExerciseComboBox({
    selectedExercise,
    setExercise,
    availableExercises,
    handleSubmit
}:ExerciseComboBoxProps){
    const [popoverOpen,setPopoverOpen] = useState<boolean>(false);

    const exerciseList = availableExercises.map(exercise => 
    <ListBoxItem id={exercise.toLowerCase()} textValue={exercise}>
        {exercise}
        <ListBoxItemIndicator />
    </ListBoxItem>
    );

    return(
        <Popover isOpen={popoverOpen} onOpenChange={setPopoverOpen}>
            <Popover.Trigger><Button>PICK EXERCISE</Button></Popover.Trigger>
            <Popover.Content placement="bottom">
                <Card>
                    <ComboBox inputValue={selectedExercise}
                        onInputChange={(setExercise)}>
                        <ComboBox.InputGroup>
                            <Input placeholder="Search for exercise..."/>
                            <ComboBox.Trigger />
                            </ComboBox.InputGroup>
                        <ComboBox.Popover>
                            <ListBox style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                {exerciseList}
                            </ListBox>
                        </ComboBox.Popover>
                        <FieldError/>
                    </ComboBox>
                    <Button onClick={() =>{
                        handleSubmit(),
                        setPopoverOpen(false)}}>ADD EXERCISE
                    </Button>
                </Card>
            </Popover.Content>
        </Popover>
    );
}
