import React, { useState } from 'react';
import "./Bot.css";

const Bot = () => {
  const [conversationHistory, setConversationHistory] = useState([]);
  const [userInput, setUserInput] = useState('');

  const sendMessage = async () => {
    if (!userInput.trim()) {
      return;
    }

    try {
      // Backend endpoint URL (replace with your actual URL)
      const chatEndpoint = 'http://localhost:3001/chat';

      // Send user input to backend using Fetch API
      const response = await fetch(chatEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userInput })
      });

      console.log(response);

      // Check for successful response
      if (!response.ok) {
        throw new Error(`Error sending message: ${response.statusText}`);
      }

      const data = await response.json(); // Parse JSON response

      // Update conversation history with user input and AI response
      setConversationHistory([
        ...conversationHistory,
        { role: 'user', content: userInput },
        { role: 'assistant', content: data.message }
      ]);

      setUserInput('');
    } catch (error) {
      console.error('Error during chat interaction:', error);
    }
  };

  return (
    <div className="chat-container">
      <ul>
        {conversationHistory.map((message, index) => (
          <li key={index} className={message.role}>
            {message.role === 'user' ? 'Você: ' : 'Assistente: '}
            {message.content}
          </li>
        ))}
      </ul>
      <div style={{ display: 'flex', alignItems: 'center', padding: '8px' }}>
        <input
          type="text"
          className="chat-input"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={(e) => { if (e.key === 'Enter') { sendMessage(); }}}
          placeholder="Digite sua mensagem..."
        />
        <button className="send-button" onClick={sendMessage}>Enviar</button>
      </div>
    </div>
  );
};

export default Bot;
