import React, { useState, useEffect, useRef } from "react";
import { firestore } from "@/lib/firebase";
import { collection, doc, addDoc, Timestamp, onSnapshot, query, orderBy } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { IoMdPerson } from "react-icons/io";

// Define Message type
type Message = {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
};

export const ChatWindow: React.FC = () => {
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const params = useParams();

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch messages from Firebase in real-time
  useEffect(() => {
    if (!params.id) return;

    const eventsCol = collection(firestore, "events");
    const eventDoc = doc(eventsCol, params.id);
    const announcementsCol = collection(eventDoc, "announcements");

    // Create a query that orders by timestamp
    const announcementsQuery = query(announcementsCol, orderBy("timestamp", "asc"));

    // Subscribe to real-time updates
    const unsubscribe = onSnapshot(announcementsQuery, (snapshot) => {
      const data = snapshot.docs.map((d) => {
        const announcement = d.data();
        return {
          id: d.id,
          sender: announcement.sender,
          text: announcement.text,
          timestamp:
            announcement.timestamp instanceof Timestamp
              ? new Date(announcement.timestamp.seconds * 1000).toLocaleString()
              : "Unknown time",
        };
      });

      setMessages(data); // Update state with the received messages
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [params.id]);

  // Handle sending a new message
  const handleSend = async () => {
    if (messageText.trim()) {
      const newMessage: Message = {
        id: `${messages.length + 1}`,  // Unique ID for the message
        sender: "Admin", // Since it's only the admin panel
        text: messageText,
        timestamp: new Date().toLocaleTimeString(),
      };

      try {
        const eventsCol = collection(firestore, "events");
        const eventDoc = doc(eventsCol, params.id);
        const announcementsCol = collection(eventDoc, "announcements");

        // Add new message to Firestore
        await addDoc(announcementsCol, {
          sender: newMessage.sender,
          text: newMessage.text,
          timestamp: Timestamp.fromDate(new Date()),
        });

        setMessageText("");  // Clear the input field
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent the default action (new line in input)
      handleSend();
    }
  };

  return (
    <div className="chat-window flex flex-col h-full  w-[70%] ">
      {/* Messages List */}
      <div className="messages flex-grow flex-col p-2 sm:p-4 overflow-y-auto max-h-[calc(100vh-100px)] no-scrollbar">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message-item text-xs sm:text-base mb-2 flex ${message.sender === "Admin" ? "justify-end" : "justify-start"}`}
          >
            {message.sender !== "Admin" && (
              <div className="text-lg sm:text-3xl mr-3 self-end bg-gray-100 p-2 rounded-full">
                <IoMdPerson />
              </div>
            )}

            <div
              className={`message p-3 rounded-2xl w-[40%] break-words flex flex-col ${message.sender === "Admin" ? "ml-auto bg-blue-500 text-white" : "mr-auto bg-gray-200 text-black"}`}
            >
              <p className="text-sm font-semibold">{message.sender}</p>
              <p className="text-md">{message.text}</p>
              <p className="text-xs text-gray-400">{message.timestamp}</p>
            </div>

            {message.sender === "Admin" && (
              <div className="text-lg sm:text-3xl ml-3 self-end bg-blue-300 p-2 rounded-full">
                <IoMdPerson />
              </div>
            )}
          </div>
        ))}

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
            onKeyDown={handleKeyDown}
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
