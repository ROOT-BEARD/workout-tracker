import {Button, Card } from "@heroui/react";
import { CalendarDate } from "@internationalized/date";
import type { Set } from "../types/database";
import { useState } from "react";
import { LineChart, CartesianGrid, Legend, XAxis, YAxis, ResponsiveContainer, Line } from "recharts";
import { setService } from "../services/setService";

interface point{
    x:string,
    y:number
};

export default function DashBoard(){
    const [points, setPoints] = useState<point[]>([]);


    const getPoints = async() =>{
        const sets:Set[] = await setService.getSetsByExcercise("Bench Press");
        
        setPoints((sets||[]).map(set=> ({
            x: set.created_at ?? '',
            y: set.weight
            }))
        );
    };


    return(
        <Card style={{height:"500px", width:'500px'}} variant="secondary">
            <Button onClick={getPoints}>get bench press</Button>
            <ResponsiveContainer>
                <LineChart data={points}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey='x' stroke="var(--color-text-3)"/>
                    <YAxis domain={['dataMin - 10', 'dataMax + 10']} />
                    <Legend/>
                    <Line dataKey='y'
                    stroke="#6366f1" 
                    strokeWidth={5}
                    />
                </LineChart>
            </ResponsiveContainer>
        </Card>
    );
}   