import React from "react";
import { ChatWindow } from "./ChatWindow";

export const ChatSection: React.FC = () => {
  return (
    <div className="chat-section p-4 h-screen w-full flex flex-col justify-center items-center">
      <ChatWindow />
    </div>
  );
};
