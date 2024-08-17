"use client";
import React, { useEffect, useRef, useState } from "react";
import BotAvatar from "@/components/BotAvatar";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase/firebaseClient";
import { Message } from "@/types";
import UserAvatar from "@/components/UserAvatar";
import Panel from "@/components/Panel";
import TextMessageComponent from "./TextMessageComponent";
import ImageMessageComponent from "./ImageMessageComponent";
import { cn } from "@/lib/utils";
import AudioMessageComponent from "./AudioMessageComponent";
import ImageAnalysisMessageComponent from "./ImageAnalysisMessageComponent";

interface ChatMessageProps {
  chatId?: string;
  chatType: string;
}

const ChatMessage = ({ chatId, chatType }: ChatMessageProps) => {
  const [messages, setMessages] = useState<Message[]>([]);

  const endRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length]);

  useEffect(() => {
    if (!chatId) return;

    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("created_at", "asc")
    );
    const unsubscribe = onSnapshot(q, (snapShot) => {
      const fetchMessages = snapShot.docs.map((doc) => ({
        id: doc.id,
        content: doc.data().content,
        type: doc.data().type,
        created_at: doc.data().created_at,
        sender: doc.data().sender,
        // ...doc.data(),
      }));
      // console.log(fetchMessages);
      setMessages(fetchMessages);
    });
    return () => unsubscribe();
  }, [chatId]);

  const getMessageComponent = (message: Message) => {
    switch (message.type) {
      case "text":
        return <TextMessageComponent content={message.content} />;

      case "image":
        return <ImageMessageComponent images={message.content} />;

      case "audio":
        return <AudioMessageComponent src={message.content} />;

      case "image_analysis":
        return <ImageAnalysisMessageComponent content={message.content} />;
    }
  };

  return (
    <>
      {!chatId ? (
        <Panel chatType={chatType} />
      ) : (
        <div className="flex-1 p-4 space-y-4 overflow-auto">
          {messages.map((message) => (
            <div key={message.id} className="flex space-x-4">
              {message.sender === "user" ? <UserAvatar /> : <BotAvatar />}
              <div className={cn(message.type === "image"  || message.type === "image_analysis"? "flex-1" : "")}>
                {/* メッセージのタイプによってタグを変える */}
                {getMessageComponent(message)}
              </div>
            </div>
          ))}
          <div ref={endRef}></div>
        </div>
      )}
    </>
  );
};

export default ChatMessage;
