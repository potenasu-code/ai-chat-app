"use client";

import { Button } from '@/components/ui/button'
import React, { useEffect } from 'react'
import {signInWithPopup} from "firebase/auth"
import {auth, provider} from "@/lib/firebase/firebaseClient"
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext';


const LoginPage = () => {
  const {currentUser} = useAuth();
  const router = useRouter();

  useEffect(() => {
    if(currentUser) {
      router.push("/conversation");
    }
  },[currentUser]);

  //ログイン処理
  const handleLogin = () => {
    provider.setCustomParameters({ prompt: 'select_account' }); // ユーザーにアカウント選択を促す
    signInWithPopup(auth,provider).then(() => {
      // router.push("/conversation");
    }).catch((error) => {
      console.log(error);
    })
  }

  return (
    <Button onClick={handleLogin}>login</Button>
  )
}

export default LoginPage