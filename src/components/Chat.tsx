"use client"
import React, { useState } from 'react'
import ChatMessage from '@/components/ChatMessage'
import ChatForm from '@/components/ChatForm'
import { ChatType } from '@/types'

interface ChatProps {
  // chatId?: string,
  initialChatId?: string,
  chatType: ChatType
  // chatType: ChatType
}

const Chat = ({initialChatId,chatType}: ChatProps) => {
  const[chatId, setChatId] = useState(initialChatId)
  return (
    <>
        <ChatMessage chatId={chatId} chatType={chatType}/>
        <ChatForm setChatId={setChatId} chatId={chatId} chatType={chatType} />
    </>
  )
}

export default Chat