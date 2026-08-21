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
        <Card variant="secondary" className="SetCard">
            <Card.Header style={{display:'flex', justifyContent:'space-between', flexDirection:'row'}}>
                <div>
                    Set {setIndex + 1}
                </div>
                <SetPopup onAddSet={(newSet)=>onEditSet(exerciseIndex,setIndex,newSet)}>
                    <Button>Edit</Button>
                </SetPopup>
                <Button variant="danger" onClick={()=>onRemoveSet(exerciseIndex,setIndex)}>X</Button>
            </Card.Header>
            <Card.Content style={{display:'flex', flexDirection:'row'}}>
                <Card variant="secondary">Reps {set.reps}</Card>
                <Card variant="secondary">Weight {set.weight}</Card>
            </Card.Content>
        </Card>
    );
}