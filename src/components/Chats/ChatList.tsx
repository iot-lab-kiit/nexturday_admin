import React, { useState } from "react";
import { MdGroups } from "react-icons/md";
import { IoMdPerson } from "react-icons/io";

type Chat = {
  id: string;
  name: string;
  profilePicture: string;
};

type ChatListProps = {
  chats: Chat[];
  selectedChatId: string | null;
  onSelectChat: (chatId: string) => void;
};

export const ChatList: React.FC<ChatListProps> = ({
  chats,
  selectedChatId,
  onSelectChat,
}) => {
  return (
    <div className="chat-list rounded-2xl h-full px-1 sm:px-5 flex flex-col space-y-2">
      <div className="flex items-center justify-between p-1">
        {/* Chats text */}
        <div className="text-xl sm:text-4xl text-black font-semibold">Chats</div>

        {/* MdGroups icon */}
        <div className="text-xl sm:text-4xl">
          <MdGroups />
        </div>
      </div>

      <input
        placeholder="Search Username"
        className="text-xs sm:text-sm p-1 sm:p-2 rounded-lg bg-gray-200"
      ></input>

      {chats.map((chat) => {
        // Generate a unique color for each user based on their ID
        const userColor = `hsl(${(chat.id.length * 37) % 360}, 70%, 60%)`; // HSL for unique colors

        return (
          <div
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className={`chat-item cursor-pointer flex items-center gap-4 p-2 rounded-lg ${
              selectedChatId === chat.id ? "bg-gray-200" : "hover:bg-gray-200"
            }`}
          >
            {/* Icon with dynamic color */}
            <div
              className="text-2xl sm:text-5xl"
              style={{ color: userColor }} // Apply the color to the icon
            >
              <IoMdPerson />
            </div>
            {/* Chat name with truncation */}
            <span className="text-sm sm:text-lg truncate max-w-[8rem] sm:max-w-none">
              {chat.name}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const ParentComponent: React.FC = () => {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  const chats: Chat[] = [
    {
      id: "1",
      name: "Johnathan Doe with a really long name",
      profilePicture: "https://via.placeholder.com/150",
    },
    {
      id: "2",
      name: "Jane Smith",
      profilePicture: "https://via.placeholder.com/150",
    },
    // Add more chats here
  ];

  const handleSelectChat = (chatId: string) => {
    // If the same chat is clicked again, deselect it
    setSelectedChatId(chatId === selectedChatId ? null : chatId);
  };

  return (
    <ChatList
      chats={chats}
      selectedChatId={selectedChatId} // Pass selectedChatId
      onSelectChat={handleSelectChat} // Pass function to update selectedChatId
    />
  );
};

export default ParentComponent;
