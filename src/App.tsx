import { useState } from 'react';
import './App.css'
import { Popover, Button, Card, TextField, Label, Input } from '@heroui/react';
import { supabase } from './supabase-client';

export default function App() {
  const [newSet, setSet] = useState({reps: 0, weight: 0});

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const {error} = await supabase
    .from("exercises")
    .insert(newSet)
    .select()
    .single();

    if(error){
      console.error("Error adding excercise: ", error.message);
    }
    setSet({reps: 0, weight: 0});
  };

  return(
    <Card variant='tertiary' style={{width:'500px', height:'500px'}}>
      <Popover>
        <Popover.Trigger>
          <Button>+</Button>
        </Popover.Trigger>
        <Popover.Content>
          <Card className='Card'>
              <TextField onChange={(val)=> setSet((prev)=>({...prev,weight:Number(val)}))} >
              <Label>WEIGHT</Label>
              <Input value={newSet.weight}/>
            </TextField>
            <TextField onChange={(val)=> setSet((prev)=>({...prev,reps:Number(val)}))} >
              <Label>REPS</Label>
              <Input value={newSet.reps}/>
            </TextField>
            <Button onClick={handleSubmit}>Submit</Button>
          </Card>
        </Popover.Content>
      </Popover>
    </Card>
  );
}
