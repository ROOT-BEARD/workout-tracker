
import './App.css'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import AccountPage from './pages/AccountPage'
import WorkoutPage from './pages/WorkoutPage';
import MenuDrawer from './components/MenuDrawer';
import DashBoard from './pages/DashBoard';

export default function App() {

  return(
    <BrowserRouter>
      <MenuDrawer/>
      <Routes>
          <Route path='/' element={<DashBoard/>}/>
          <Route path='/WorkoutPage' element={<WorkoutPage/>}/>
          <Route path='/AccountPage' element={<AccountPage/>}/>
      </Routes>
    </BrowserRouter>
  );
}
