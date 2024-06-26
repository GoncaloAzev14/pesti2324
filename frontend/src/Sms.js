import React from 'react';

const ChatComponent = ({ smsChat, messages, me, otherName }) => {
  if (!smsChat) return null;

  return (
    <div className="chat-box">
      {messages.map((message, index) => {
        const isSentMessage = message.sender === me;

        const messageStyle = {
          backgroundColor: isSentMessage ? "#bac7c8" : "#ebebeb",
          padding: "10px",
          borderRadius: "8px",
          marginBottom: "10px",
          alignSelf: isSentMessage ? "flex-end" : "flex-start",
          maxWidth: "100%",
          wordWrap: "break-word",
        };

        const senderName = isSentMessage ? "You" : otherName || "Friend";

        return (
          <div key={index} style={messageStyle}>
            <span>{senderName}: </span>
            {message.text}
          </div>
        );
      })}
    </div>
  );
};

export default ChatComponent;
