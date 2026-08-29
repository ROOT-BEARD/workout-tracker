import { Calendar } from "@heroui/react";
import type { CalendarDate } from "@internationalized/date";;

export default function WorkoutCalender({pickedDate, setDate, workoutDates} : {setDate:(date: CalendarDate)=>void, pickedDate:CalendarDate, workoutDates:string[]}){
    return(
        <div>
            <Calendar  className="w-full" onChange={(setDate)} value={pickedDate} style={{justifySelf:"center", minWidth:'15%'}}>
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
                            hasWorkout?<Calendar.Cell date={date} style={{backgroundColor:"rgba(4, 201, 255, 0.45)"}}/>
                            :<Calendar.Cell date={date}/>
                        );
                    }}
                </Calendar.GridBody>
                </Calendar.Grid>
            </Calendar>
        </div>
    );
}