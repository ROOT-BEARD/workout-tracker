import { useEffect, useState } from "react";
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart } from "recharts";
import { supabase } from "../supabase-client";
import { useUser } from "../contexts/UserContext";
import { addDays, startOfWeek } from "date-fns";


interface radarPoint {
    muscleGroup:string,
    volume:number
};

export default function MuscleRadarChart(){
    const {user} = useUser();
    const [selectedGroups, setGroups] = useState<string[]>([]);
    const [radarPoints, setRadarPoints] = useState<radarPoint[]>([]);

    const exampleData = [
        {muscleGroup:'back', volume: 50},
        {muscleGroup:'chest', volume: 75},
        {muscleGroup:'hamstring', volume: 60},
        {muscleGroup:'quad', volume: 40},
        {muscleGroup:'glutes', volume: 20},
    ]

    const getRadarData = async() =>{
        if(!user?.id) return;
        const start = startOfWeek(new Date(), {weekStartsOn: 0});
        const end = addDays(start, 7);

        const {data,error} = await supabase.rpc("get_range_volume",
            {
                userid : user?.id,
                start_date : start,
                end_date : end
            });
        if(error) console.error("ERROR GETTING RADAR POINTS", error.message);

        const points:radarPoint[] = (data || []).map((muscle:any)=>{
            return{
                muscleGroup:muscle.primary_muscle,
                volume: muscle.total_volume
            };
        });
        setRadarPoints(points);
    };

    useEffect(()=>{
        getRadarData();
    },[]);
    
    return(
        <RadarChart 
        style={{ width: '100%', height: '100%', maxWidth: '500px', maxHeight: '80vh', aspectRatio: 1 }}
        data={radarPoints}
        responsive
        > 
            <PolarGrid/>
            <PolarAngleAxis dataKey='muscleGroup' />
            <PolarRadiusAxis/>
            <Radar
                    dataKey='volume'
                    fill="rgb(16, 161, 14)"
                    fillOpacity={0.5}/>
        </RadarChart>
    );
}
