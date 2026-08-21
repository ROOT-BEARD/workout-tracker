import { Button, Card, Input, Label, TextField } from "@heroui/react";
import { accountService } from "../services/accountService";
import type { NewAccount } from "../types/database";
import { useState } from "react";
import { useUser } from "../contexts/UserContext";


export default function AccountPage(){
    const { user, isLoading } = useUser();
    const [signInInfo, setSignInInfo] = useState<NewAccount>({email:'',username:'',password:''});

    if(isLoading) return <p>LOADING</p>;

    const handleSignUp = async() =>{
        const newAccount:NewAccount={
            email:signInInfo.email,
            username:signInInfo.username,
            password:signInInfo.password
        };
        accountService.createAccount(newAccount);
    }

    const handleSignOut = async() =>{
        accountService.signOut();
    };

    const handleSignIn = async() =>{
        accountService.signIn(signInInfo.email,signInInfo.password);
    };

    return(
        <Card variant='secondary' style={{width:'500px'}}>
            <form style={{display:'flex',flexDirection:'column'}}>
                <TextField onChange={(val)=>
                setSignInInfo((prev)=>({...prev, email:val}))}>
                    <Label>EMAIL</Label>
                    <Input placeholder="email"
                    value={signInInfo.email}/>
                </TextField>
                <TextField onChange={(val)=>
                setSignInInfo((prev)=>({...prev, username:val}))}>
                    <Label>USERNAME</Label>
                    <Input placeholder="username"
                    value={signInInfo.username}/>
                </TextField>
                <TextField onChange={(val)=>
                setSignInInfo((prev)=>({...prev, password:val}))}>
                    <Label>PASSWORD</Label>
                    <Input
                    type='password' 
                    placeholder="password"
                    value={signInInfo.password}/>
                </TextField>
            </form>
            <Button onClick={handleSignUp}>SIGN UP</Button>
            {!user?<Button onClick={handleSignIn}>SIGN IN</Button>
            :<Button onClick={handleSignOut}>SIGN OUT</Button>}
        </Card>
    );
}