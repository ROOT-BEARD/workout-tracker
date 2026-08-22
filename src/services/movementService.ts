import { supabase } from "../supabase-client";
import type { NewMovement } from "../types/database";

export const movementService = {
    async getMovements(): Promise<NewMovement[]>{
        const {data, error} = await supabase
        .from('movements')
        .select('*');

        if(error) console.log("ERROR GETTING MOVEMENTS: ", error.message);

        return data ?? [];
    }
};