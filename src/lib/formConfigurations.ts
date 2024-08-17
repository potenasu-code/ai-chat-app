import { ChatFormData, ChatType } from "@/types";
import { conversationSchema, imageAnalysisSchema, imageGenerationSchema, speechToTextSchema, textToSpeechSchema } from "./validationSchema";

export const amountOptions = [
    {
        value: "1",
        label: "1枚",
    },
    {
        value: "2",
        label: "2枚",
    },
    {
        value: "3",
        label: "3枚",
    },
    {
        value: "4",
        label: "4枚",
    },
];


export const sizeOptions = [
    {
        value: "256x256",
        label: "256x256",
    },
    {
        value: "512x512",
        label: "512x512",
    },
    {
        value: "1024x1024",
        label: "1024x1024",
    },
];

const formConfig = {
    conversation: {schema: conversationSchema, defaultValue: {prompt: ""}},
    image_generation:  {schema: imageGenerationSchema, defaultValue: {prompt: "", amount: "1",size: "256x256"}},
    
    // 以下は仮
    text_to_speech: {schema: textToSpeechSchema, defaultValue: {prompt: ""}},
    speech_to_text: {schema: speechToTextSchema, defaultValue: {file: undefined}},
    image_analysis: {schema: imageAnalysisSchema, defaultValue: {prompt: "", files: undefined}},
}

export const getFormConfig = (chatType:ChatType) => {
    return formConfig[chatType]
}

  //どのAPIエンドポイントに何を送るか指定する関数
  export const getRequestData = (values: ChatFormData, chatId: string, chatType: ChatType) => {
    let apiUrl = "";
    let apiData = {};

    switch (chatType) {
      case "conversation":
        apiUrl = "/api/conversation";
        apiData = {
          prompt: values.prompt,
          chatId: chatId,
        };
        break;

      case "image_generation":
        apiUrl = "/api/image_generation";
        apiData = {
          prompt: values.prompt,
          amount: values.amount,
          size: values.size,
          chatId: chatId,
        };
        break;

      case "text_to_speech":
        apiUrl = "/api/text_to_speech";
        apiData = {
          prompt: values.prompt,
          chatId: chatId,
        };
        break;

      case "speech_to_text":
        apiUrl = "/api/speech_to_text";
        const formDataSTT = new FormData();
        formDataSTT.append("file",values.file);
        formDataSTT.append("chatId",chatId);
        apiData = formDataSTT;
        break;

      case "image_analysis":
        apiUrl = "/api/image_analysis";
        const formDataIA = new FormData();
        formDataIA.append("prompt", values.prompt || "ファイルを解析してください。");
        if(values.files) {
          values.files.forEach((file) => {
            formDataIA.append("files",file);
          })
        }
        formDataIA.append("chatId",chatId);
        apiData = formDataIA;
        break;
    }

    return { apiUrl, apiData };
  };

  export const selectFirstMessage = (values: ChatFormData, chatType: ChatType) => {
    switch (chatType) {
      case "speech_to_text":
        return values.file.name;

      case "image_analysis":
        return values.prompt ? values.prompt : "ファイルを解析してください。";

      default:
        return values.prompt;
    }
  };



