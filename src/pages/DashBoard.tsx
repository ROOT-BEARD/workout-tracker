import { Card, Input, Switch } from "@heroui/react";
import { useEffect, useState } from "react";
import { supabase } from "../supabase-client";
import ExerciseComboBox from "../components/ExerciseSelectPopup";
import { useUser } from "../contexts/UserContext";
import type { NewMovement } from "../types/database";
import { movementService } from "../services/movementService";
import MuscleRadarChart from "../components/MuscleRadarChart";
import type { LineChartPoint } from "../types/charts";
import ExerciseLineChart from "../components/ExerciseLineChart";

export default function DashBoard(){
    const [lineChartPoints, setLineChartPoints] = useState<LineChartPoint[]>([]);
    const [max, setMax] = useState<number>(0);
    const [maxRep, setMaxRep] = useState<number>(10);
    const [minRep, setMinRep] =useState<number>(0);
    const [showMaxWeight, setShowMaxWeight] = useState<boolean>(true);
    const [selectedExercise, setExercise] = useState<string>("");
    const [oneRepMaxGuess, setOneRepMaxGuess] = useState<number>(0);
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

        const points:LineChartPoint[] = (pointData || []).map((item:any)=>{
            setCount[item.workout_date] = (setCount[item.workout_date] || 0) + 1;

            return {
            x: showMaxWeight?`${item.workout_date}`:`${item.workout_date} - set ${setCount[item.workout_date]}`,
            reps: item.set_reps,
            weight: showMaxWeight ? item.max_weight : item.set_weight,
            };
        });

        setLineChartPoints(points);

        const {data, error} = await supabase.rpc("get_exercise_max",
            {
                exercise_name : selectedExercise,
                userid : user?.id
            }
        );
        if(error)console.error("FAILURE TO FETCH DATA", error.message);
        setMax(data ?? 0);
        getMaxGuess();
    };

    const getMovements = async()=>{
        const availableMovements = await movementService.getMovements();
        setMovements(availableMovements);
    }

    const getMaxGuess = async() =>{
        const data = await supabase.rpc("calculate_one_rep_max",
            {
                movement_name: selectedExercise
            }
        );
        setOneRepMaxGuess(data.data)
    }

    useEffect(()=>{
        getPoints();
        getMovements();
    },[maxRep, minRep, showMaxWeight]);


    return(
        <div>
            <Card variant='secondary'>
                <MuscleRadarChart/>
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
                <h1>MAX WEIGHT: {max}lb</h1>
                <h1>ONE REP MAX GUESS: {Math.round(oneRepMaxGuess)}lb</h1>
                <ExerciseLineChart points={lineChartPoints}/>
            </Card>
        </div>
    );
}   