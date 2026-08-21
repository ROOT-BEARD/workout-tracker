import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase-client";
import type { Session, User } from "@supabase/supabase-js";

type UserContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
};

type UserContextProps = {
  children: React.ReactNode;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: UserContextProps) => {
  
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, session, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};