import { Card, Input, Switch } from "@heroui/react";
import { useEffect, useState } from "react";
import { LineChart, CartesianGrid, Legend, XAxis, YAxis, ResponsiveContainer, Line, Tooltip } from "recharts";
import { supabase } from "../supabase-client";
import ExerciseComboBox from "../components/ExerciseSelectPopup";
import { useUser } from "../contexts/UserContext";
import type { NewMovement } from "../types/database";
import { movementService } from "../services/movementService";
import MuscleRadarChart from "../components/MuscleRadarChart";

interface Point{
    x:string,
    weight:number
    reps:number
};

export default function DashBoard(){
    const [points, setPoints] = useState<Point[]>([]);
    const [max, setMax] = useState<number>(0);
    const [maxRep, setMaxRep] = useState<number>(10);
    const [minRep, setMinRep] =useState<number>(0);
    const [showMaxWeight, setShowMaxWeight] = useState<boolean>(true);
    const [selectedExercise, setExercise] = useState<string>("");
    const [movements, setMovements] = useState<NewMovement[]>([]);
    const {user} = useUser();

    

    const handleSubmit = () => {
        getPoints();
    };

    const getJustDate = (date:string):string => {const parts:string[] = date.split('T'); return parts[0]};

    const getPoints = async() =>{
        if(!user?.id) return;

        const {data: pointData ,error: pointError} = showMaxWeight? await supabase.rpc
        ("exercise_max_name_date",
            {   exercise_name: selectedExercise,
                low:minRep,
                high:maxRep,
                userid:user.id
            }) :  await supabase.rpc
        ("get_workoutsets_for_exercise",
            {   exercise_name: selectedExercise,
                low:minRep, 
                high:maxRep,
                userid:user.id
            });
        
        const setCount:Record<string,number> = {};

        const points:Point[] = (pointData || []).map((item:any)=>{
            setCount[item.workout_date] = (setCount[item.workout_date] || 0) + 1;

            return {
            x: showMaxWeight?`${item.workout_date}`:`${item.workout_date} - set ${setCount[item.workout_date]}`,
            reps: item.set_reps,
            weight: showMaxWeight ? item.max_weight : item.set_weight,
            };
        });

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

    const getMovements = async()=>{
        const availableMovements = await movementService.getMovements();
        setMovements(availableMovements);
    }

    useEffect(()=>{
        getPoints();
        getMovements();
    },[maxRep, minRep, showMaxWeight]);


    return(
        <div>
            <Card variant='secondary'>
                <MuscleRadarChart userid={user?.id}/>
            </Card>
            <Card className="GraphCard" variant="secondary">
                <div style={{display:'flex', justifyContent:"space-between"}}>
                <ExerciseComboBox 
                    selectedExercise={selectedExercise}
                    setExercise={setExercise}
                    availableExercises={movements.map(movement=>movement.name)}
                    handleSubmit={handleSubmit}/>
                    <Switch isSelected={showMaxWeight} onChange={setShowMaxWeight}>
                        <Switch.Content>
                            <Switch.Control>
                            <Switch.Thumb />
                            </Switch.Control>
                            Only show max weight sets
                        </Switch.Content>
                    </Switch>
                    <div style={{display:'flex', flexDirection:"column"}}>
                        MIN<Input value={minRep} onChange={(e) => setMinRep(Number(e.target.value))}></Input>
                        MAX<Input value={maxRep} onChange={(e) => setMaxRep(Number(e.target.value))}></Input>
                    </div>
                </div>
                <h1>EXERCISE: {selectedExercise}</h1>
                <h1>MAX WEIGHT: {max}</h1>
                <ResponsiveContainer width="100%" height={400} minWidth={0}>
                    <LineChart data={points}>
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
        </div>
    );
}   