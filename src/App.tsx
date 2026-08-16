
import './App.css'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import { Card} from '@heroui/react';
import WorkoutPage from './components/WorkoutPage';
import MenuDrawer from './components/MenuDrawer';
import DashBoard from './components/DashBoard';

export default function App() {

  return(
    <BrowserRouter>
      <MenuDrawer/>
      <Routes>
          <Route path='/' element={<DashBoard/>}/>
          <Route path='/WorkoutPage' element={<WorkoutPage/>}/>
      </Routes>
    </BrowserRouter>
  );
}
