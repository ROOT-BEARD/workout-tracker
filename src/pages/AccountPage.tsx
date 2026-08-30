import { Button } from "@heroui/react";
import { accountService } from "../services/accountService";
import type { NewAccount } from "../types/database";
import { useState } from "react";
import { useUser } from "../contexts/UserContext";
import SigninLogin from "../components/SigninLogin";


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
        <div className="flex h-screen items-center justify-center">
            {!user?<SigninLogin
                    setSignInInfo={setSignInInfo}
                    signInInfo={signInInfo}
                    handleSignUp={handleSignUp}
                    handleSignIn={handleSignIn}
            />:
            <div>
                <h1>HELLO {user.user_metadata.username}</h1>
                <Button onClick={handleSignOut}>Sign Out</Button>
            </div>}
        </div>
    );
}