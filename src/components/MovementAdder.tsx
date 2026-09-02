import { Button, Card, ComboBox, Input, ListBox, ListBoxItem, ListBoxItemIndicator, Popover, Typography } from "@heroui/react";
import { movementService } from "../services/movementService";
import type { NewMovement } from "../types/database";
import { useEffect, useState } from "react";

const mainMuscleGroups = [
  "Chest",
  "Lower Back",
  "Lats",
  "Rhomboids",
  "Anterior Deltoids",
  "Lateral Deltoids",
  "Rear Deltoids",
  "Quadriceps",
  "Hamstrings",
  "Glutes",
  "Calves",
  "Biceps",
  "Triceps",
  "Abs",
  "Obliques",
  "Forearm"
];

const MuscleGroupList = mainMuscleGroups.map((group)=>
    <ListBoxItem id={group.toLowerCase()} textValue={group}>
        {group}
        <ListBoxItemIndicator/>
    </ListBoxItem>
);

export default function MovementAdder({userId}:{userId:string}){
    const [movementName, setMovementName] = useState<string>('');
    const [primaryGroup, setPrimaryGroup] = useState<string>('');
    const [addedMovements, setAddedMovements] = useState<NewMovement[]>([]);

    const handleAdd = async() => {
        const newMovement:NewMovement = {
            name:movementName,
            primary_muscle: primaryGroup,
            user_id:userId
        }
        movementService.addMovement(newMovement);
    };

    const getAddedMovements = async() => {
        if(userId == '') return;

        const data = await movementService.getAddedMovements(userId);
        setAddedMovements(data);
    };

    const handleDelete = (movementName:string) => {
        if(userId == '') return;

        movementService.deleteMovementByName(movementName);

    };

    useEffect(()=>{
        if(userId != ''){
            getAddedMovements();
        }
    },[userId, handleAdd, handleDelete])

    return(
        <div className="flex flex-row justify-center gap-3 h-full w-full">
            <Card className="w-1/2">
                <Typography type='h3'>Movement Adder</Typography>
                <Input value={movementName} onChange={(e) => setMovementName(e.target.value)}  placeholder="name..."></Input>
                <ComboBox
                inputValue={primaryGroup}
                onInputChange={setPrimaryGroup}
                >
                    <ComboBox.InputGroup>
                        <Input placeholder="group..."/>
                        <ComboBox.Trigger />
                    </ComboBox.InputGroup>
                    <ComboBox.Popover>
                        <ListBox>
                            {MuscleGroupList}
                        </ListBox>
                    </ComboBox.Popover>
                </ComboBox>
                <Button onClick={handleAdd}>SUBMIT</Button>
            </Card>
            <Card className="w-1/2">
                <Typography type='h3'>Added Movements</Typography>
                <Card className="h-full overflow-y-auto overflow-x-hidden" variant='secondary'>
                    {addedMovements.map((movement)=>
                    <Popover>
                        <Popover.Trigger><Card>{movement.name}</Card></Popover.Trigger>
                        <Popover.Content>
                            <Card className="flex-row">
                                <Button variant='danger-soft' onDoubleClick={()=>handleDelete(movement.name)}>DELETE</Button>
                            </Card>
                        </Popover.Content>
                    </Popover>)}
                </Card>
            </Card>
        </div>
    );
}