import {Card } from "@heroui/react";
import { LineChart, CartesianGrid, Legend, XAxis, YAxis, ResponsiveContainer, Line } from "recharts";

export default function DashBoard(){
    const data = [
        {date: 1, weight:200},
        {date: 2, weight:210},
        {date: 3, weight:215},
        {date: 4, weight:225},
        {date: 5, weight:220},
        {date: 6, weight:220},
        {date: 7, weight:225},
        {date: 8, weight:230},
        {date: 9, weight:225},
        {date: 10, weight:235},
    ]
    return(
        <Card style={{height:"250px"}} variant="secondary">
            <ResponsiveContainer>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey='date' stroke="var(--color-text-3)"/>
                    <YAxis domain={['dataMin - 10', 'dataMax + 10']} />
                    <Legend/>
                    <Line dataKey='weight'
                    stroke="#6366f1" 
                    strokeWidth={3}
                    />
                </LineChart>
            </ResponsiveContainer>
        </Card>
    );
}   