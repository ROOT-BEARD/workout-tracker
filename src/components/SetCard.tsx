import { Card, Button } from "@heroui/react";
import SetPopup from "./SetPopup";
import type { NewSet } from "../types/database";

interface setCardProps {
    setIndex:number,
    exerciseIndex:number,
    onEditSet: (exerciseIndex:number,setIndex:number,newSet:NewSet) => void,
    onRemoveSet: (index: number, setIndex:number) => void,
    set: NewSet
};

export default function SetCard({setIndex,exerciseIndex,onEditSet,onRemoveSet,set}:setCardProps){
    return(
        <div>
            <Card variant="secondary" className="SetCard">

                <Card.Content style={{display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
                    <div style={{display:'flex', flexDirection:'column', justifyContent:'space-between'}}>
                        <div>{setIndex + 1}</div>
                        <Button variant="danger" onClick={()=>onRemoveSet(exerciseIndex,setIndex)}>X</Button>
                    </div>
                    <div style={{display:'flex'}}>
                        <Card variant='tertiary'>Reps:  {set.reps}</Card>
                        <Card variant='tertiary'>Weight:  {set.weight}</Card>
                    </div>
                </Card.Content>
            </Card>
        </div>
    );
}