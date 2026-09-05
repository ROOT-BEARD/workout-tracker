import { ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line, LineChart } from "recharts";
import type { LineChartPoint } from "../types/charts";

interface LineChartProps {
    points:LineChartPoint[]
};

export default function ExerciseLineChart({points}:LineChartProps){
    return(
        <div className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                data={points}
                margin={{top:0,right:0,left:0,bottom:0}}
                >
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis
                    dataKey='x'
                    stroke="var(--color-text-3)"
                    domain={['auto', 'auto']}
                    padding={{left:0,right:0}}
                    interval="preserveStartEnd"
                    />
                    <YAxis
                    yAxisId='leftY'
                    stroke="var(--color-text-3)"
                    domain={[0, 'auto']}
                    width={40}
                    padding={{top:30}}
                    />
                    <YAxis
                    yAxisId='rightY'
                    orientation='right'
                    stroke="var(--color-text-3)"
                    domain={[0, 'auto']}
                    width={40}
                    padding={{top:30}}
                    />
                    <Tooltip
                        cursor={{stroke: 'var(--color-border-2)'}}
                        wrapperStyle={{ pointerEvents: "none" }}
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
                    activeDot={{
                        r: 8,
                        stroke: 'var(--color-surface-base)',
                        style: { pointerEvents: "none"} }}
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
        </div>
    );
}