
import './App.css'
import { Card} from '@heroui/react';
import WorkoutPage from './components/WorkoutPage';

export default function App() {

  return(
    <div className='AppContainer'>
        <div style={{width:'1000px'}}>
          <WorkoutPage/>
        </div>
    </div>
  );
}
