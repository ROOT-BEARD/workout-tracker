import { Card } from "@heroui/react";
import type { NewSet } from "../types/database";

interface setCardProps {
    setIndex:number,
    set: NewSet
};

export default function SetCard({setIndex,set}:setCardProps){
    return(
        <div>
            <Card variant="secondary" className="SetCard">
                <Card.Content style={{display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
                    <div style={{display:'flex', flexDirection:'column', justifyContent:'space-between'}}>
                        <div>{setIndex + 1}</div>
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