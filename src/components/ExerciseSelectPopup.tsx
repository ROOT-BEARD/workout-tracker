import { Button, Card, ComboBox, Input, ListBox, ListBoxItem, ListBoxItemIndicator, Popover } from "@heroui/react";
import { useState } from "react";

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
    <ListBoxItem textValue={exercise}>
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
                        onInputChange={setExercise}
                    >
                        <ComboBox.InputGroup>
                            <Input placeholder="Exercise Name"/>
                        </ComboBox.InputGroup>
                        <ListBox style={{ maxHeight: '200px', overflowY: 'auto' }}>
                            {exerciseList}
                        </ListBox>
                        <Button onClick={() =>{
                            handleSubmit(),
                            setPopoverOpen(false)}}>ADD EXERCISE</Button>
                    </ComboBox>
                </Card>
            </Popover.Content>
        </Popover>
    );
}
