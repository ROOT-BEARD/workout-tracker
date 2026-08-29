import { Calendar, Card } from '@heroui/react'

export default function WorkoutSection(){
    //const [date, setDate] = useState({date: 0});

    return(
    <Card variant='secondary'>
        <Calendar>
        <Calendar.Header>
            <Calendar.Heading>
            <Calendar.NavButton slot='previous'/>
            <Calendar.NavButton slot='next'/>
            </Calendar.Heading>
            <Calendar.Grid>
            <Calendar.GridHeader>
                {(day) => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}
            </Calendar.GridHeader>
            <Calendar.GridBody>{(date) => <Calendar.Cell date={date}/>}</Calendar.GridBody>
            </Calendar.Grid>
        </Calendar.Header>
        </Calendar>
        <h1></h1>
    </Card>
    );
}