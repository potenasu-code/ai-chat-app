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

    const { prompt, chatId } = await req.json();
    console.log(prompt);
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

    // ユーザーメッセージfirestoreに保存
    await db.collection("chats").doc(chatId).collection("messages").add({
      content: prompt,
      created_at: FieldValue.serverTimestamp(),
      sender: "user",
      type: "text",
    });

    // openAI APIを呼び出してAIの回答を生成
    const audioResponse = await openai.audio.speech.create({
      model: "tts-1-hd",
      voice: "nova",
      input: prompt,
    });
    console.log("audioResponse",audioResponse);


    //バイナリデータに変換->保存パスを設定->ストレージにアップロードして参照URLを取得
        const arrayBuffer = await audioResponse.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const filePath = `${user.uid}/chatRoom/${chatId}`;
        const url = await fileUploadToStorage(buffer, filePath, "audio/mpeg");
        console.log("url",url)


    //AIの回答をfirestoreに保存
    await db.collection("chats").doc(chatId).collection("messages").add({
      content: url,
      created_at: FieldValue.serverTimestamp(),
      sender: "assistant",
      type: "audio",
    });

    return NextResponse.json({ success: "true" });
  } catch (error) {
    console.log("TEXT_TO_SPEECH _ERROR", error);
    return NextResponse.json({ error: "サーバー側でエラーが発生しました。" });
  }
}
