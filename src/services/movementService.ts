import { supabase } from "../supabase-client";
import type { NewMovement } from "../types/database";

export const movementService = {
    async getMovements(): Promise<NewMovement[]>{
        const {data, error} = await supabase
        .from('movements')
        .select('*');

        if(error) console.log("ERROR GETTING MOVEMENTS: ", error.message);

        return data ?? [];
    },
    async addMovement(newMovement:NewMovement): Promise<NewMovement>{
        const {data, error} = await supabase
        .from("movements")
        .insert(newMovement)
        .select()
        .single();

        if(error) console.error("Error adding movement: ", error.message);

        return data;
    },
    async getAddedMovements(userId:string): Promise<NewMovement[]>{
        const {data, error} = await supabase
        .from("movements")
        .select('*')
        .eq('user_id', userId);

        if(error) console.error("error getting added movements", error.message);

        return data ?? [];
    },
    async deleteMovementByName(movementName:string) {
        const {error:deleteError} = await supabase
        .from("movements")
        .delete()
        .eq('name', movementName)

        if(deleteError) console.error("error deleting movement: ", deleteError.message);

        return;
    }
};