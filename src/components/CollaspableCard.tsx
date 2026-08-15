import { Button, Card } from "@heroui/react";
import type React from "react";
import { useState } from "react";
import './CollaspableCard.css';

interface CollaspableCardProps{
    title:string;
    children: React.ReactNode;
};

export default function CollaspableCard({title, children}:CollaspableCardProps){
    const [show, setShow] = useState<boolean>(false);

    return(
        <Card className="CollaspableCard" onClick={()=>setShow(!show)}>
            <Card.Header style={{display:'flex', flexDirection:"row", justifyContent:"space-between"}}>
                <Card.Title>{title}</Card.Title>
            </Card.Header>
            {show == true ? <Card.Content onClick={(e)=>e.stopPropagation()}>{children}</Card.Content> : <></>}
        </Card>
    );
}