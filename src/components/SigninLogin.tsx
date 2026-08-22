import { Card, TextField, Input, Button, Label } from "@heroui/react";
import type { NewAccount } from "../types/database";
import { useState, type Dispatch, type SetStateAction } from "react";
import { Link } from "react-router-dom";

interface SigninLoginProps{
    setSignInInfo:Dispatch<SetStateAction<NewAccount>>,
    signInInfo:NewAccount,
    handleSignUp:()=>void,
    handleSignIn:()=>void
}

export default function SigninLogin({setSignInInfo,signInInfo,handleSignUp,handleSignIn}:SigninLoginProps){
    const[SignUp, setSignUp] = useState<boolean>(true);

    return(
        <Card variant='secondary' style={{width:'500px', justifySelf:'center',}}>
            <Card.Title>{SignUp?'SIGN UP':'LOG IN'}</Card.Title>
            <form style={{display:'flex',flexDirection:'column'}}>
                <TextField onChange={(val)=>
                setSignInInfo((prev)=>({...prev, email:val}))}>
                    <Label>EMAIL</Label>
                    <Input placeholder="email"
                    value={signInInfo.email}/>
                </TextField>
                <TextField onChange={(val)=>
                setSignInInfo((prev:NewAccount)=>({...prev, username:val}))}>
                    <Label>USERNAME</Label>
                    <Input placeholder="username"
                    value={signInInfo.username}/>
                </TextField>
                <TextField onChange={(val)=>
                setSignInInfo((prev:NewAccount)=>({...prev, password:val}))}>
                    <Label>PASSWORD</Label>
                    <Input
                    type='password' 
                    placeholder="password"
                    value={signInInfo.password}/>
                </TextField>
            </form>
            <div style={{display:'flex', justifyContent:'row'}}>
                <h6>{SignUp?'already have an account? ':'no account? '}</h6>
                <Button variant='ghost' onClick={()=>setSignUp(!SignUp)}>{SignUp ? " LOG IN" : " SIGN UP"}</Button>
            </div>
            <Button onClick={SignUp?handleSignUp:handleSignIn}>{SignUp?'SIGN UP':'LOG IN'}</Button>
        </Card>
    );
}