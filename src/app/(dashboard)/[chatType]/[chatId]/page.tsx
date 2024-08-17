import React from 'react'
import { notFound } from 'next/navigation';
import Chat from '@/components/Chat';
import { ChatType } from '@/types';

const ChatRoomPage = ({params}: {params: {chatType: string, chatId: string}}) => {
  console.log(params);
  const { chatId,chatType } = params;
  
   //型ガード関数
   const isChatTypeKey = (key: string): key is ChatType => 
    [
      "conversation",
      "image_generation",
      "text_to_speech",
      "speech_to_text",
      "image_analysis",
    ].includes(key);

    if(!isChatTypeKey(chatType)) {
      return notFound()
  }

  return (
    <Chat initialChatId={chatId} chatType={chatType}/>
  )
}

export default ChatRoomPage