import React from 'react'

const AudioMessageComponent = ({src}: {src: string}) => {
  return (
    <audio controls src={src}></audio>
  )
}

export default AudioMessageComponent