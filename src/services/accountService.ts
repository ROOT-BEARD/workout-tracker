import type { NewAccount } from "../types/database";
import { supabase } from "../supabase-client";

export const accountService = {
    async createAccount(newAccount:NewAccount) {
        const {data, error} = await supabase.auth.signUp({
            email:newAccount.email,
            password:newAccount.password,
            options: {
                data:{
                    username: newAccount.username
                }
            }
        });
        if(error) console.error("error adding account", error.message);
        return data;
    },
    async signOut(){
        const { error } = await supabase.auth.signOut();
        if(error) console.error("ERROR SIGNING OUT", error.message);
    },
    async signIn(email:string,password:string){
        const { error } = await supabase.auth.signInWithPassword({
            email:email,
            password:password
        });
        if(error) console.error("ERROR SIGNING IN", error.message);
    }
};