
// this is the old version of the rakuten website this is before using claud

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await fetch('http://127.0.0.1:8000/chat/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          session_id: 'kunal-001' // use UUID or user ID later when adding authentication or googlr loginto save different chat sessions
        })
      });

      const data = await res.json();
      const botMsg = { sender: 'bot', text: data.response };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('API error:', err);
    }

    setInput('');
  };

  return (
    <div style={{ width: '800px', margin: 'auto' }}>
      <h2>Rakuten Support Chat</h2>
      <div style={{ height: '300px', overflowY: 'scroll', border: '1px solid #ccc', padding: '10px' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
           {msg.sender === 'bot' ? (<ReactMarkdown  remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]} components={{a: ({ href, children }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'blue', textDecoration: 'underline' }}
              >
                {children}
              </a>
            )
          }}>{msg.text}</ReactMarkdown>) : (msg.text)}

          </div>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ width: '80%' }}
        placeholder="Ask a question..."
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default ChatBox;

