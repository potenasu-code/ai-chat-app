import React from "react";
import MessageDisplay from "@/components/MessageDisplay";

const TextMessageComponent = ({ content }: { content: string }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow whitespace-pre-wrap break-all">
      <MessageDisplay content={content} />
    </div>
  );
};

export default TextMessageComponent;
