import { firestore } from "@/lib/firebase";
import { collection, doc } from "firebase/firestore";
import React, { useState, useEffect, useRef } from "react";
import { IoMdPerson } from "react-icons/io";
import { useParams } from "react-router";
import { getDocs } from "firebase/firestore";

type Message = {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
};

type ChatWindowProps = {
  messages: Message[];
};

type Announcement = {
  id: string;
  sender: string;
  text: string;
  timestamp: string; 
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  messages: initialMessages,
}) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (messageText.trim()) {
      const newMessage: Message = {
        id: `${messages.length + 1}`,
        sender: "Me",
        text: messageText,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, newMessage]);
      setMessageText("");
    }
  };

   const params = useParams()
  // console.log( params.id)

  useEffect (()=>{
    const eventsCol = collection(firestore,"events");
    const eventDoc =  doc(eventsCol,params.id)
    const announcementsCol = collection(eventDoc,"announcements")
    getDocs(announcementsCol).then((snap)=>{
      setAnnouncements(snap.docs as unknown as Announcement[])
    })
  },[])

 

  return (
    <div className="chat-window flex flex-col h-full border-l border-gray-300">
      {/* Message List */}
      <div className="messages flex-grow p-2 sm:p-4 overflow-y-auto max-h-[calc(100vh-100px)] no-scrollbar">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message-item text-xs sm:text-base mb-2 flex ${
              message.sender === "Me" ? "justify-end" : "justify-start"
            }`}
          >
            {message.sender !== "Me" && (
              <div className="text-lg sm:text-3xl mr-3 self-end bg-gray-100 p-2 rounded-full">
                <IoMdPerson />
              </div>
            )}

            <div
              className={`message p-3 rounded-2xl w-1/2 break-words flex flex-col ${
                message.sender === "Me"
                  ? "ml-auto bg-blue-500 text-white"
                  : "mr-auto bg-gray-200 text-black"
              }`}
            >
              <p className="text-sm font-semibold">{message.sender}</p>
              <p className="text-md">{message.text}</p>
              <p className="text-xs text-gray-400">{message.timestamp}</p>
            </div>

            {message.sender === "Me" && (
              <div className="text-lg sm:text-3xl ml-3 self-end bg-blue-300 p-2 rounded-full">
                <IoMdPerson />
              </div>
            )}
          </div>
        ))}

        {/* Invisible div to scroll into view */}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="message-input bg-white p-2 sticky bottom-0">
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-grow p-2 border rounded-md"
            placeholder="Type a message..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
          />
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
            onClick={handleSend}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};
