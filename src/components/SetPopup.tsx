import { Popover, Button, Card, NumberField, Typography } from "@heroui/react";
import { useState } from "react";
import type { NewSet } from "../types/database";
import {TrashBin, Check} from "@gravity-ui/icons"

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
            <Popover.Content className='max-w-3/4'>
            <Card className='Card'>
                <Typography type='h6'>REPS</Typography>
                <NumberField minValue={0} defaultValue={0} onChange={(val)=> setSet((prev)=>({...prev,reps:Number(val)}))} >
                    <NumberField.Group>
                        <NumberField.DecrementButton/>
                            <NumberField.Input/>
                        <NumberField.IncrementButton/>
                    </NumberField.Group>
                </NumberField>
                <Typography type='h6'>WEIGHT</Typography>
                <NumberField minValue={0} defaultValue={0} onChange={(val)=> setSet((prev)=>({...prev,weight:Number(val)}))} >
                    <NumberField.Group>
                        <NumberField.DecrementButton/>
                            <NumberField.Input/>
                        <NumberField.IncrementButton/>
                    </NumberField.Group>
                </NumberField>
                <div className="flex justify-between">
                    <Button variant='danger-soft' onClick={()=>{handleRemove(),setOpen(false)}}><TrashBin/></Button>
                    <Button onClick={()=>{handleSubmit(),setOpen(false)}}><Check/></Button>
                </div>
            </Card>
            </Popover.Content>
        </Popover>
    );
}