import { checkUserPermission, verifyToken } from "@/lib/firebase/auth";
import { db } from "@/lib/firebase/firebaseAdmin";
import { fileUploadToStorage } from "@/lib/firebase/storage";
import { FieldValue } from "firebase-admin/firestore";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {


    const headersList = headers()
    const authHeader = headersList.get('Authorization')

    //トークンが添付されているか？
    if(!authHeader) {
        return NextResponse.json(
            {error: "トークンが添付されていません。"},
            {status: 401}
        )
    }
    const token = authHeader.split("Bearer ")[1];

    //デコード
    const user = await verifyToken(token);
    if(!user) {
        return NextResponse.json(
            {error: "無効なトークンです。"},
            {status: 401}
        )
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const chatId = formData.get("chatId") as string;
    console.log(file);
    console.log(chatId);

    //firestoreのデータを操作してよいユーザか？
    const hasPermission = await checkUserPermission(user.uid, chatId)
    console.log("hasPermission",hasPermission)
    if(!hasPermission) {
        return NextResponse.json(
            {error: "操作が許可されていないか、リソースが存在しません。"},
            {status: 403}
        )
    }



    //バイナリデータに変換->保存パスを設定->ストレージにアップロードして参照URLを取得
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer .from(arrayBuffer);
    const filePath = `${user.uid}/chatRoom/${chatId}`;
    const url = await fileUploadToStorage(buffer, filePath, file.type);
    console.log("url",url)

    // ユーザーメッセージfirestoreに保存
    await db.collection("chats").doc(chatId).collection("messages").add({
      content: url,
      created_at: FieldValue.serverTimestamp(),
      sender: "user",
      type: "audio",
    });

    // openAI APIを呼び出してAIの回答を生成
    const transcription = await openai.audio.transcriptions.create({
      file: file,
      model: "whisper-1",
    });
    console.log("transcription",transcription);
    console.log("transcription.text",transcription.text);
    const aiResponse = transcription.text

    //AIの回答をfirestoreに保存
    await db.collection("chats").doc(chatId).collection("messages").add({
      content: aiResponse,
      created_at: FieldValue.serverTimestamp(),
      sender: "assistant",
      type: "text",
    });

    return NextResponse.json({ success: "true" });
  } catch (error) {
    console.log("SPEECH_TO_TEXT_ERROR", error);
    return NextResponse.json({ error: "サーバー側でエラーが発生しました。" });
  }
}
