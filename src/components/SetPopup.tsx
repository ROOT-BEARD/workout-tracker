import { Popover, TextField, Label, Input, Button, Card } from "@heroui/react";
import { useState } from "react";
import type { NewSet } from "../types/database";

interface SetPopupProps{
    children: React.ReactNode;
    onAddSet: (newSet: NewSet) => void;
};

export default function SetPopup({children,onAddSet}:SetPopupProps){
    const [newSet, setSet] = useState<NewSet>({reps:0,weight:0,exercise:'',workout_id:0,user_id:''});
    
    const handleSubmit = () => {
        onAddSet(newSet);
    };

    return(
        <Popover>
            <Popover.Trigger>{children}</Popover.Trigger>
            <Popover.Content placement="right">
            <Card className='Card'>
                <TextField onChange={(val)=> setSet((prev)=>({...prev,weight:Number(val)}))} >
                <Label>WEIGHT</Label>
                <Input placeholder="enter weight..." type="number" inputMode="numeric"/>
                </TextField>
                <TextField onChange={(val)=> setSet((prev)=>({...prev,reps:Number(val)}))} >
                <Label>REPS</Label>
                <Input placeholder="enter reps..." type="number" inputMode="numeric"/>
                </TextField>
                <Button onClick={handleSubmit}>Submit</Button>
            </Card>
            </Popover.Content>
        </Popover>
    );
}