import { Popover, TextField, Label, Input, Button, Card } from "@heroui/react";
import { useState } from "react";
import type { NewSet } from "../types/database";

interface SetPopupProps{
    children: React.ReactNode;
    onAddSet: (newSet: NewSet) => void;
    handleRemove: () => void;
};

export default function SetPopup({children,onAddSet,handleRemove}:SetPopupProps){
    const [newSet, setSet] = useState<NewSet>({reps:0,weight:0,exercise:'',workout_id:0,user_id:''});
    const [open, setOpen] = useState<boolean>(false);

    const handleSubmit = () => {
        onAddSet(newSet);
    };

    return(
        <Popover isOpen={open} onOpenChange={(open)=> setOpen(open)}>
            <Popover.Trigger onClick={()=>setOpen(true)}>{children}</Popover.Trigger>
            <Popover.Content>
            <Card className='Card'>
                <TextField onChange={(val)=> setSet((prev)=>({...prev,weight:Number(val)}))} >
                <Label>WEIGHT</Label>
                <Input placeholder="enter weight..." type="number" inputMode="numeric"/>
                </TextField>
                <TextField onChange={(val)=> setSet((prev)=>({...prev,reps:Number(val)}))} >
                <Label>REPS</Label>
                <Input placeholder="enter reps..." type="number" inputMode="numeric"/>
                </TextField>
                <div className="flex justify-between">
                    <Button variant='danger' onClick={()=>{handleRemove(),setOpen(false)}}>X</Button>
                    <Button onClick={()=>{handleSubmit(),setOpen(false)}}>Submit</Button>
                </div>
            </Card>
            </Popover.Content>
        </Popover>
    );
}