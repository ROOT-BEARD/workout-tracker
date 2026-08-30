import { Calendar } from "@heroui/react";
import type { CalendarDate } from "@internationalized/date";;

export default function WorkoutCalender({pickedDate, setDate, workoutDates} : {setDate:(date: CalendarDate)=>void, pickedDate:CalendarDate, workoutDates:string[]}){
    return(
        <Calendar
        className='w-full max-w-sm '
        onChange={(setDate)}
        value={pickedDate}>
            <Calendar.Header>
            <Calendar.Heading/>
            <Calendar.NavButton slot='previous'/>   
            <Calendar.NavButton slot='next'/>
            </Calendar.Header>
            <Calendar.Grid>
            <Calendar.GridHeader>
                {(day)=>(
                <Calendar.HeaderCell>{day}</Calendar.HeaderCell>
                )}
            </Calendar.GridHeader>
            <Calendar.GridBody>
                {(date)=>{
                    const currDate:string = date.toString();
                    const hasWorkout:boolean = workoutDates.includes(currDate);
                    return(
                        hasWorkout?<Calendar.Cell date={date} style={{backgroundColor:"rgb(177, 185, 238)"}}/>
                        :<Calendar.Cell date={date}/>
                    );
                }}
            </Calendar.GridBody>
            </Calendar.Grid>
        </Calendar>
    );
}