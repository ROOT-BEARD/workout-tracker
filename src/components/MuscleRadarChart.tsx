import { useEffect, useState } from "react";
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip } from "recharts";
import { supabase } from "../supabase-client";
import { useUser } from "../contexts/UserContext";
import { addDays, startOfWeek, subDays } from "date-fns";
import { Button } from "@heroui/react";
import type { radarPoint } from "../types/charts";

export default function MuscleRadarChart(){
    const {user} = useUser();
    const start = startOfWeek(new Date(), {weekStartsOn: 0});
    const [week, setWeek] = useState<Date>(start);
    const [radarPoints, setRadarPoints] = useState<radarPoint[]>([]);


    const getRadarData = async() =>{
        if(!user || !user.id) return;
        const end = addDays(week, 7);

        const {data,error} = await supabase.rpc("get_range_volume",
            {
                userid : user?.id,
                start_date : week.toISOString(),
                end_date : end.toISOString(),
            }
        );
        if(error) console.error("ERROR GETTING RADAR POINTS", error.message);

        const points:radarPoint[] = (data || []).map((muscle:any)=>{
            console.log('this should work');
            return{
                muscleGroup:muscle.primary_muscle,
                volume: Number(muscle.total_volume)
            };
        });
        setRadarPoints(points);
    };

    useEffect(()=>{
        if(user?.id) getRadarData();
    },[user?.id, week]);
    
    return(
        <div style={{width:'100%', height:'750px', paddingBottom:'100px'}}>
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart 
                data={radarPoints}> 
                    <PolarGrid/>
                    <PolarAngleAxis dataKey='muscleGroup' />
                    <PolarRadiusAxis/>
                    <Tooltip/>
                    <Radar
                        dataKey='volume'
                        fill="rgb(1, 255, 255)"
                        fillOpacity={0.5}/>
                </RadarChart>
            </ResponsiveContainer>
            <h1 style={{justifySelf:'center'}}>DATES: {week.toDateString()}-{addDays(week, 7).toDateString()}</h1>
            <div style={{justifySelf:'center'}}>
                <Button onClick={()=>setWeek(subDays(week, 7))}>-</Button>
                <Button onClick={()=>setWeek(addDays(week, 7))}>+</Button>
            </div>
        </div>
    );
}
