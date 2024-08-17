import React from 'react'
import  Markdown  from  'react-markdown' 
import  remarkGfm  from  'remark-gfm' 

const MessageDisplay = ({ content }: {content: string}) => {
  return (
    <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown> 
  )
}

export default MessageDisplay