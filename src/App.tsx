
import './App.css'
import { Card} from '@heroui/react';
import WorkoutPage from './components/WorkoutPage';

export default function App() {

  return(
    <div className='AppContainer'>
      <Card variant='tertiary' style={{width:'750px', height:'1250px', alignItems:'center'}}>
        <WorkoutPage/>
      </Card>
    </div>
  );
}
