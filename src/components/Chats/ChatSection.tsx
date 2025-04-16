import React, { useState } from "react";
import { ChatList } from "./ChatList";
import { ChatWindow } from "./ChatWindow";

type Chat = {
  id: string;
  name: string;
  profilePicture: string;
};

type Message = {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
};

const mockChats: Chat[] = [
    { id: "1", name: "John Doe", profilePicture: "https://picsum.photos/200/300" },
    { id: "2", name: "Jane Smith", profilePicture: "https://picsum.photos/200/300" },
  ];
  

const mockMessages: Message[] = [
  { id: "1", sender: "John Doe", text: "Hi!", timestamp: "10:00 AM" },
  { id: "2", sender: "Me", text: "Hello!", timestamp: "10:01 AM" },
];

export const ChatSection: React.FC = () => {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  const handleSelectChat = (chatId: string) => {
    setSelectedChatId(chatId);
  };



  return (
    <div className="chat-section grid grid-cols-3 gap-4 p-4 h-screen w-full">
      <div className="chat-list-container col-span-1">
        <ChatList chats={mockChats} onSelectChat={handleSelectChat} selectedChatId={null}/>
      </div>
      <div className="chat-window-container col-span-2 flex flex-col">
        {selectedChatId ? (
          <ChatWindow messages={mockMessages} />
        ) : (
          <p>Select a chat to start messaging</p>
        )}
      </div>
    </div>
  );
};
