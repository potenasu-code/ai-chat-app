"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/firebaseClient";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { LoaderCircle, Paperclip, Send, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  amountOptions,
  getFormConfig,
  getRequestData,
  selectFirstMessage,
  sizeOptions,
} from "@/lib/formConfigurations";
import { ChatFormData, ChatType } from "@/types";
import { Input } from "./ui/input";
import Image from "next/image";

interface ChatFormProps {
  chatId?: string;
  chatType: ChatType;
  setChatId: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const ChatForm = ({ chatId, chatType, setChatId }: ChatFormProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [audio, setAudio] = useState<File | null>(null);
  const[imageUrls, setImageUrls] = useState<string[]>([]);
  const[imageFiles, setImageFiles] = useState<File[]>([]);
  const { currentUser, userToken } = useAuth();
  const { schema, defaultValue } = getFormConfig(chatType);
  // console.log("schema", schema)
  // console.log("defaultValue", defaultValue);

  useEffect(() => {
      return () => {
        imageUrls.forEach((url) => URL.revokeObjectURL(url));
      }
  },[])


  const form = useForm<ChatFormData>({
    defaultValues: defaultValue,
    resolver: zodResolver(schema),
  });

  const isSubmitting = form.formState.isSubmitting;
  console.log("エラー内容", form.formState.errors);

  const handleFileChange = (files: FileList | null) => {
    console.log(files);
    if (!files || files.length === 0) return;

    if(chatType === "speech_to_text") {

      const file = files[0];
      form.setValue("file", file);
      setAudio(file);

    } else if(chatType === "image_analysis") {

      const newFiles = Array.from(files)
      console.log("newFiles",newFiles);

      const imageUrls = newFiles.map((file) => {
        return URL.createObjectURL(file);
      })

      setImageUrls((prevImageUrls) => [...prevImageUrls, ...imageUrls]);

      const updatedFiles = form.getValues("files") || [];
      form.setValue("files", [...updatedFiles, ...newFiles]);
    }
  }

  const onSubmit = async (values: ChatFormData) => {
    console.log(values);
    try {
      let chatRef;
      let isNewChat = false;
      if (!chatId) {
        //初めてメッセージを送信した場合にチャットルームを作成
        const newChatDocRef = await addDoc(collection(db, "chats"), {
          first_message: selectFirstMessage(values, chatType),
          last_updated: serverTimestamp(),
          type: chatType,
          user_id: currentUser?.uid,
        });
        chatRef = doc(db, "chats", newChatDocRef.id);
        isNewChat = true;
        setChatId(newChatDocRef.id);
      } else {
        chatRef = doc(db, "chats", chatId);
      }

      const { apiUrl, apiData } = getRequestData(values, chatRef.id, chatType);
      // console.log("apiUrl", apiUrl);
      // console.log("apiData", apiData);

      const response = await axios.post(apiUrl, apiData,
        {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        }
      );
      console.log(response);

      if (isNewChat) {
        //初めてメッセージを送信した場合
        // router.push(`/${chatType}/${chatRef.id}`)
        window.history.pushState(null, "", `/${chatType}/${chatRef.id}`);
      } else {
        //すでにチャットルームにアクセスしている場合
        await updateDoc(chatRef, {
          last_updated: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      if(fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      if(chatType === "speech_to_text") {
        setAudio(null);
      } else {
        imageUrls.forEach((url) => URL.revokeObjectURL(url));
        setImageUrls([]);
      }
      form.reset();
    }
  };

  const files = form.watch("files");
  // console.log("ReactHookFormで管理している値",files)

  const handleFileRemove = (index: number) => {
    if(fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    
    URL.revokeObjectURL(imageUrls[index]);
    setImageUrls((prevImageUrls) => prevImageUrls.filter((_,idx) => idx !== index));    
    if(files) {
      const updatedFiles = files.filter((_,idx) => idx !== index)
      console.log(updatedFiles)
      form.setValue("files", updatedFiles);
    }
  }


  const FilePreview = () => (
    <div className="flex flex-wrap gap-2 mb-4">
      {/* speech_to_textの場合 */}
      {audio && (
        <div className="flex items-center gap-2 p-4 rounded-lg">
          <div className="relative h-10 w-10">
            <Image src={"/audio_file.svg"} fill alt="audio_file" />
          </div>
          <p>{audio.name}</p>
        </div>
      )}
      {/* image_analysisの場合 */}
      {imageUrls.length > 0 &&
        imageUrls.map((imageUrl, index) => (
          <div key={index} className="relative group w-12 h-12">
            <Image
              src={imageUrl}
              alt="File preview"
              fill
              className="rounded object-cover"
            />
            {!isSubmitting && (
              <button
                onClick={() => handleFileRemove(index)}
                className="absolute -top-2 -right-2 p-1 text-white bg-black bg-opacity-75 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={12} />
              </button>
            )}
          </div>
        ))}
    </div>
  );





  return (
    <div className="bg-white p-3">
      {(audio || imageUrls.length > 0) && <FilePreview />}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col space-y-4"
        >
          {chatType === "image_generation" && (
            <div className="flex items-center space-x-2">
              {/* amount */}
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <Select
                      disabled={isSubmitting}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a verified email to display" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {amountOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              {/* size */}
              <FormField
                control={form.control}
                name="size"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <Select
                      disabled={isSubmitting}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a verified email to display" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sizeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
          )}

          <div className="flex items-center space-x-2">
            {(chatType === "speech_to_text" || chatType === "image_analysis") && (
              // ファイル
              <FormField
                control={form.control}
                name={chatType === "speech_to_text" ? "file" : "files"}
                render={({ field: { value, ref, onChange, ...fieldProps } }) => {
                  // console.log(value);
                  return (
                    <FormItem>
                      <FormLabel>
                        <Paperclip />
                      </FormLabel>
                      <FormControl>
                        <Input
                        multiple={chatType === "image_analysis"}
                        ref={(e) => {
                          fileInputRef.current = e;
                          ref(e);
                        }}
                          // ref={fileInputRef}
                          className="hidden"
                          type="file"
                          onChange={(event) => {
                            const files = event.target.files;
                            console.log(files);
                            handleFileChange(files);
                          }}
                          {...fieldProps}
                        />
                      </FormControl>
                    </FormItem>
                  );
                }}
              />
            )}

            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem className="w-full flex-1">
                  <FormControl>
                    <Textarea
                      disabled={isSubmitting || chatType === "speech_to_text"}
                      {...field}
                      className="bg-slate-200"
                      rows={1}
                      placeholder={
                        chatType === "speech_to_text"
                          ? "入力できません"
                          : "チャットを始めよう"
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button disabled={isSubmitting} variant={"ghost"}>
              {isSubmitting ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                <Send />
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ChatForm;
