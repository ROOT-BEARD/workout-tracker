import { Calendar} from "@heroui/react";
import type { CalendarDate } from "@internationalized/date";

export default function WorkoutCalender({pickedDate, setDate} : {setDate:(date: CalendarDate)=>void, pickedDate:CalendarDate}){
    return(
        <div>
            <Calendar onChange={setDate} value={pickedDate}>
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
                    {(date)=>(
                    <Calendar.Cell date={date}/>
                    )}
                </Calendar.GridBody>
                </Calendar.Grid>
            </Calendar>
        </div>
    );
}