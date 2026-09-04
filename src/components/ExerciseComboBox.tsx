import { Button, Card, ComboBox, FieldError, Input, ListBox, ListBoxItem, ListBoxItemIndicator, Popover } from "@heroui/react";
import { useState } from "react";
import { Plus, CirclePlus } from "@gravity-ui/icons";

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

    const exerciseList = availableExercises.map((exercise, index) => ({
        id: `${exercise.toLowerCase()}-${index}`,
        exercise
    }));

    return(
        <Popover isOpen={popoverOpen} onOpenChange={setPopoverOpen}>
            <Popover.Trigger>
                <Button variant="ghost" size="lg">
                    <Plus/>
                </Button>
            </Popover.Trigger>
            <Popover.Content placement="bottom">
                <Card>
                    <ComboBox inputValue={selectedExercise}
                        onInputChange={(setExercise)}>
                        <ComboBox.InputGroup>
                            <Input placeholder="Search for exercise..."/>
                            <ComboBox.Trigger />
                        </ComboBox.InputGroup>
                        <ComboBox.Popover>
                            <ListBox
                            items={exerciseList}
                            style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                {(item) => (
                                    <ListBoxItem key={item.id} id={item.id} textValue={item.exercise}>
                                        {item.exercise}
                                        <ListBoxItemIndicator />
                                    </ListBoxItem>
                                )}
                            </ListBox>
                        </ComboBox.Popover>
                        <FieldError/>
                    </ComboBox>
                    <Button
                        className='w-full'
                        variant='outline'
                        onClick={() =>{
                        handleSubmit(),
                        setPopoverOpen(false)}}
                    >
                        <CirclePlus/>
                    </Button>
                </Card>
            </Popover.Content>
        </Popover>
    );
}
