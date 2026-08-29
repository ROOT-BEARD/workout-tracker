import { ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line, LineChart } from "recharts";
import type { LineChartPoint } from "../types/charts";

interface LineChartProps {
    points:LineChartPoint[]
};

export default function ExerciseLineChart({points}:LineChartProps){
    return(
        <ResponsiveContainer width="100%" height="100%" minHeight='600px'>
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
    );
}