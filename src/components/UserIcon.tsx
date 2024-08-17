"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/context/AuthContext"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/firebaseClient";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const UserIcon = () => {
    const router = useRouter();
    const {currentUser} = useAuth();
    const photoURL = currentUser?.photoURL ? currentUser.photoURL : undefined;

    
    useEffect(() => {
        if(!currentUser) {
            router.push("/login");
        }
    },[currentUser]);
    
    const handleLogout = () => {    
        signOut(auth).then(() => {
            // router.push("/login");
        }).catch((error) => {
            console.log(error);
        })

    }
    return (
    <DropdownMenu>
        <DropdownMenuTrigger>
            <Avatar className="h-8 w-8">
                <AvatarImage src={photoURL} />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
            <DropdownMenuLabel>{currentUser?.displayName}</DropdownMenuLabel>
            <DropdownMenuItem onClick={handleLogout}>ログアウト</DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserIcon


