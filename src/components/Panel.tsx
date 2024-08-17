import Image from "next/image";
import React from "react";

const Panel = ({ chatType }: { chatType: string }) => {
  // console.log(chatType);

  const getChatConfig = () => {
    let imageUrl = "";
    let message = "";

    switch (chatType) {
      case "conversation":
        imageUrl = "/conversation_panel.svg";
        message = "会話を始めよう";
        break;

      case "image_generation":
        imageUrl = "/image_generation_panel.svg";
        message = "画像を生成しよう";
        break;

      case "text_to_speech":
        imageUrl = "/text_to_speech_panel.svg";
        message = "テキストを音声に変換しよう";
        break;

      case "speech_to_text":
        imageUrl = "/speech_to_text_panel.svg";
        message = "音声をテキストに変換しよう";
        break;

      case "image_analysis":
        imageUrl = "/image_analysis_panel.svg";
        message = "画像を解析しよう";
        break;
    }

    return { imageUrl, message };
  };

  const { imageUrl, message } = getChatConfig();

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <div className="relative h-72 w-72">
        <Image alt="Empty" fill src={imageUrl} priority />
      </div>
      <p className="text-muted-foreground text-sm text-center">{message}</p>
    </div>
  );
};

export default Panel;
