import React, { useState } from "react";

type MessageInputProps = {
  onSendMessage: (message: string) => void;
};

export const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <div className="message-input flex p-2">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="flex-grow p-2 border rounded-l"
        placeholder="Type a message..."
      />
      <button
        onClick={handleSend}
        className="bg-blue-500 text-white px-4 rounded-r"
      >
        Send
      </button>
    </div>
  );
};
