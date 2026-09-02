import { Card, Input, Switch } from "@heroui/react";
import { useEffect, useState } from "react";
import { supabase } from "../supabase-client";
import ExerciseComboBox from "../components/ExerciseComboBox";
import { useUser } from "../contexts/UserContext";
import type { NewMovement } from "../types/database";
import { movementService } from "../services/movementService";
import MuscleRadarChart from "../components/MuscleRadarChart";
import type { LineChartPoint } from "../types/charts";
import ExerciseLineChart from "../components/ExerciseLineChart";
import MovementAdder from "../components/MovementAdder";

export default function DashBoard(){
    const [lineChartPoints, setLineChartPoints] = useState<LineChartPoint[]>([]);
    const [max, setMax] = useState<number>(0);
    const [maxRep, setMaxRep] = useState<number>(10);
    const [minRep, setMinRep] =useState<number>(0);
    const [showMaxWeight, setShowMaxWeight] = useState<boolean>(false);
    const [selectedExercise, setExercise] = useState<string>("");
    const [oneRepMaxGuess, setOneRepMaxGuess] = useState<number>(0);
    const [movements, setMovements] = useState<NewMovement[]>([]);
    const [useRange, setUseRange] = useState<boolean>(false);
    const {user} = useUser();

    

    const handleSubmit = () => {
        getPoints();
    };

    //const getJustDate = (date:string):string => {const parts:string[] = date.split('T'); return parts[0]};

    const getPoints = async() =>{
        if(!user?.id) return;

        const {data: pointData ,error: pointError} = showMaxWeight? await supabase.rpc
        ("exercise_max_name_date",
            {   exercise_name: selectedExercise,
                low: useRange ? minRep : 0,
                high: useRange ? maxRep : 1000,
                userid:user.id
            }) :  await supabase.rpc
        ("get_workoutsets_for_exercise",
            {   exercise_name: selectedExercise,
                low: useRange ? minRep : 0,
                high: useRange ? maxRep : 1000,
                userid:user.id
            });
        
        if(pointError) console.error(pointError.message);

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
    },[maxRep, minRep, showMaxWeight, useRange]);


    return(
        <div className="flex flex-col w-full h-full px-6 pt-8 gap-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card variant='secondary' className="aspect-square">
                    <MuscleRadarChart/>
                </Card>
                <Card variant='secondary' className="aspect-square">
                    <MovementAdder userId={user? user.id : ''}/>
                </Card>
            </div>
            <Card className="flex h-screen w-full" variant="secondary">
                <div className="flex justify-between h-1/12">
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
                            Use Max Sets
                        </Switch.Content>
                    </Switch>
                    <div className="flex flex-col">
                        <Switch isSelected={useRange} onChange={setUseRange}>
                            <Switch.Content>
                                <Switch.Control>
                                <Switch.Thumb />
                                </Switch.Control>
                                Use Range
                            </Switch.Content>
                        </Switch>
                        MIN<Input className='w-25' disabled={!useRange} value={minRep} onChange={(e) => setMinRep(Number(e.target.value))}></Input>
                        MAX<Input className='w-25' disabled={!useRange} value={maxRep} onChange={(e) => setMaxRep(Number(e.target.value))}></Input>
                    </div>
                </div>
                <div className='w-1/2'>
                    {selectedExercise?<h1>{selectedExercise}</h1>:<h1>please pick exercise</h1>}
                </div>
                <h1>MAX WEIGHT: {max}lb</h1>
                <h1>ONE REP MAX GUESS: {Math.round(oneRepMaxGuess)}lb</h1>
                <div className="h-full w-full">
                    <ExerciseLineChart points={lineChartPoints}/>
                </div>
            </Card>
        </div>
    );
}   