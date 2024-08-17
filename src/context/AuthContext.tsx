"use client"

import { auth } from "@/lib/firebase/firebaseClient";
import { UserInfo } from "firebase/auth";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface AuthContextState {
    currentUser: UserInfo | null
    userToken: string | null
}

export const AuthContext = createContext<AuthContextState | undefined>(undefined);

export const AuthContextProvider = ({children}: {children: ReactNode}) => {
    const[currentUser,setCurrentUser] = useState<UserInfo | null>(null);
    const[userToken,setUserToken] = useState<string | null>(null);
    const[isLoading,setIsLoading] = useState(true);
    useEffect(() => {
        const unsubscribe = auth.onIdTokenChanged(async(user) => {
            if(user) {
                setCurrentUser(user);
                const token = await user.getIdToken();
                setUserToken(token);
            } else {
                setCurrentUser(null);
                setUserToken(null);
            }
            setIsLoading(false);
        })
        return () => unsubscribe();
    },[]);

    return (
        <AuthContext.Provider value={{currentUser, userToken}}>
            {!isLoading && children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(context === undefined) {
        throw new Error("contextはAuthProvider内で取得する必要があります。");
    }
    return context;
}
