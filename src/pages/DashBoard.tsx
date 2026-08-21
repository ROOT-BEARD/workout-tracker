import { Card, Input } from "@heroui/react";
import { useEffect, useState } from "react";
import { LineChart, CartesianGrid, Legend, XAxis, YAxis, ResponsiveContainer, Line, Tooltip, DefaultTooltipContent } from "recharts";
import { supabase } from "../supabase-client";
import ExerciseComboBox from "../components/ExerciseSelectPopup";
import { useUser } from "../contexts/UserContext";

interface Point{
    x:string,
    weight:number
    reps:number
};

const MOCK_EXERCISES: string[] = [
    "Bench Press",
    "Incline Dumbbell Press",
    "Squat",
    "Romanian Deadlift",
    "Barbell Deadlift",
    "Lat Pulldown",
    "Overhead Shoulder Press",
    "Tricep Pushdown",
    "Bicep Curl"
];  

export default function DashBoard(){
    const [points, setPoints] = useState<Point[]>([]);
    const [max, setMax] = useState<number>(0);
    const [maxRep, setMaxRep] = useState<number>(10);
    const [minRep, setMinRep] =useState<number>(0);
    const [selectedExercise, setExercise] = useState<string>("");
    const {user} = useUser();

    

    const handleSubmit = () => {
        getPoints();
    };

    const getJustDate = (date:string):string => {const parts:string[] = date.split('T'); return parts[0]};

    const getPoints = async() =>{
        if(!user?.id) return;
        const {data: pointData ,error: pointError} = await supabase.rpc
        ("exercise_max_name_date",
            {   exercise_name: selectedExercise,
                low:minRep,
                high:maxRep,
                userid:user.id
            });

        const points:Point[] = (pointData || []).map((item:any)=>({
            x: item.workout_date,
            weight: item.max_weight,
            reps: item.set_reps,
        }));

        setPoints(points);

        const {data, error} = await supabase.rpc("get_exercise_max",
            {
                exercise_name : selectedExercise,
                userid : user?.id
            }
        );
        if(error)console.error("FAILURE TO FETCH DATA", error.message);
        setMax(data ?? 0);
    };

    useEffect(()=>{
        getPoints();
    },[maxRep, minRep]);


    return(
        <Card style={{height:'auto', width:'1500px'}} variant="secondary">
            <div style={{display:'flex', justifyContent:"space-between"}}>
            <ExerciseComboBox 
                selectedExercise={selectedExercise}
                setExercise={setExercise}
                availableExercises={MOCK_EXERCISES}
                handleSubmit={handleSubmit}/>
            <div style={{display:'flex', flexDirection:"column"}}>
                MIN<Input value={minRep} onChange={(e) => setMinRep(Number(e.target.value))}></Input>
                MAX<Input value={maxRep} onChange={(e) => setMaxRep(Number(e.target.value))}></Input>
            </div>
            </div>
            <h1>EXERCISE: {selectedExercise}</h1>
            <h1>MAX WEIGHT: {max}</h1>
            <ResponsiveContainer width="100%" height={400} minWidth={0}>
                <LineChart data={points} margin={{ top: 20, right: 20, left: 20, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey='x' stroke="var(--color-text-3)" domain={['auto', 'auto']} />
                    <YAxis yAxisId='leftY' stroke="var(--color-text-3)" domain={[0, 'auto']} />
                    <YAxis yAxisId='rightY' orientation='right' stroke="var(--color-text-3)" domain={[0, 'auto']}/>
                    <Tooltip
                        cursor={{stroke: 'var(--color-border-2)'}}
                    />
                    <Legend/>
                    <Line 
                    type='monotone'
                    dataKey='reps'
                    yAxisId="rightY"
                    stroke="#f16363" 
                    strokeWidth={5}
                    dot={{
                    r: 5, 
                    fill: 'var(--color-surface-base)',
                    }}
                    activeDot={{ r: 8, stroke: 'var(--color-surface-base)' }}
                    />
                    <Line 
                    type='monotone'
                    dataKey='weight'
                    stroke="#6366f1" 
                    strokeWidth={5}
                    yAxisId="leftY"
                    dot={{
                    r: 5, 
                    fill: 'var(--color-surface-base)',
                    }}
                    activeDot={{ r: 8, stroke: 'var(--color-surface-base)' }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </Card>
    );
}   