import { bucket, db } from "@/lib/firebase/firebaseAdmin";
import { NextResponse } from "next/server";
import { headers } from 'next/headers'
import { checkUserPermission, verifyToken } from "@/lib/firebase/auth";
export async function DELETE(req:Request, {params}: {params: {chatId: string}}) {
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


        //firestoreのデータを操作してよいユーザか？
        const hasPermission = await checkUserPermission(user.uid, params.chatId)
        console.log("hasPermission",hasPermission)
        if(!hasPermission) {
            return NextResponse.json(
                {error: "操作が許可されていないか、リソースが存在しません。"},
                {status: 403}
            )
        }

        console.log("deleteメソッドが呼ばれました。")
        const {chatId} = params
        //firestoreからデータを削除する処理
        const chatRef = db.collection("chats").doc(chatId);
        await db.recursiveDelete(chatRef);
        
        //storageからデータを削除する処理
        const prefix = `${user.uid}/chatRoom/${chatId}`;
        const [files] = await bucket.getFiles({prefix: prefix});
        // [
        //     [file1, file2]
        // ]
        if(files) {
            console.log(`${files.length}枚の削除対象のファイルがありました。`)
            const deletePromises = files.map((file) => file.delete());
            await Promise.all(deletePromises);
            console.log(`${files.length}枚のファイルを削除しました。`)
        } else {
            console.log(`削除対象のファイルはありませんでした。`)
        }
        return NextResponse.json(
            {message: "チャットルームとそのサブコレクションが削除されました。"},
            {status: 200}
        )
    } catch(error) {
        console.log("削除処理中のエラー",error)
        return NextResponse.json({error: "削除処理中にエラーが発生しました。"},{status: 500});
    }
}