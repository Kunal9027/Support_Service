import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isChatMode, setIsChatMode] = useState(false);
  const [serverStatus, setServerStatus] = useState('checking'); // 'checking', 'online', 'offline'
  const [lastRequestTime, setLastRequestTime] = useState(0);
  const [canSendRequest, setCanSendRequest] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Ping backend on component mount
  useEffect(() => {
    const pingBackend = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/ping', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok && response.status === 200) {
          setServerStatus('online');
        } else {
          setServerStatus('offline');
        }
      } catch (error) {
        console.error('Backend ping failed:', error);
        setServerStatus('offline');
      }
    };

    pingBackend();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    // Check if server is offline
    if (serverStatus === 'offline') {
      const errorMsg = { sender: 'bot', text: 'Sorry, the server is currently offline. Please try again later.' };
      setMessages((prev) => [...prev, errorMsg]);
      setInput('');
      return;
    }

    // Check if user can send request (3 second throttle)
    const now = Date.now();
    if (now - lastRequestTime < 3000) {
      const timeLeft = Math.ceil((3000 - (now - lastRequestTime)) / 1000);
      const errorMsg = { sender: 'bot', text: `Please wait ${timeLeft} more second(s) before sending another message.` };
      setMessages((prev) => [...prev, errorMsg]);
      return;
    }

    const userMsg = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);
    setCanSendRequest(false);
    setLastRequestTime(now);

    try {
      const res = await fetch('http://127.0.0.1:8000/chat/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          session_id: 'kunal-001' // use UUID or user ID later when adding authentication or google login to save different chat sessions
        })
      });

      const data = await res.json();
      const botMsg = { sender: 'bot', text: data.response };
      setMessages((prev) => [...prev, botMsg]);
      setServerStatus('online'); // Update status on successful request
    } catch (err) {
      console.error('API error:', err);
      setServerStatus('offline'); // Update status if request fails
      const errorMsg = { sender: 'bot', text: 'Sorry, I encountered an error. The server might be offline. Please try again later.' };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
      // Re-enable sending after 3 seconds
      setTimeout(() => {
        setCanSendRequest(true);
      }, 3000);
    }

    setInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSearchClick = () => {
    setIsChatMode(true);
  };

  const handleFAQClick = (question) => {
    setIsChatMode(true);
    setInput(question);
    // Auto-send the FAQ question
    setTimeout(() => {
      const userMsg = { sender: 'user', text: question };
      setMessages([userMsg]);
      setIsTyping(true);
      
      // Simulate API call for FAQ
      setTimeout(async () => {
        try {
          const res = await fetch('http://127.0.0.1:8000/chat/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: question,
              session_id: 'kunal-001'
            })
          });

          const data = await res.json();
          const botMsg = { sender: 'bot', text: data.response };
          setMessages((prev) => [...prev, botMsg]);
        } catch (err) {
          console.error('API error:', err);
          setServerStatus('offline'); // Update status if request fails
          const errorMsg = { sender: 'bot', text: 'Sorry, I encountered an error. The server might be offline. Please try again later.' };
          setMessages((prev) => [...prev, errorMsg]);
        } finally {
          setIsTyping(false);
        }
      }, 500);
    }, 100);
  };

  const handleBackToHome = () => {
    setIsChatMode(false);
    setMessages([]);
    setInput('');
  };

  const faqQuestions = [
    "How can I contact customer support?",
    "How can I create an account?",
    "What payment methods do you accept?",
    "What is return policy?",
    "How long does shipping take?",
    "Do you offer international shipping?",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar - Always visible */}
      <nav className="bg-white shadow-sm border-b-2 border-red-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <button 
                  onClick={handleBackToHome}
                  className="text-2xl font-bold text-red-600 hover:text-red-700 transition-colors"
                >
                  AI Support Service
                </button>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  {/* <a href="#" className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    Support
                  </a>
                  <a href="#" className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    Help Center
                  </a>
                  <a href="#" className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    Contact
                  </a> */}
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                {isChatMode && (
                  <button
                    onClick={handleBackToHome}
                    className="mr-4 text-gray-600 hover:text-red-600 text-sm font-medium transition-colors"
                  >
                    ← Back to Home
                  </button>
                )}
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 font-semibold text-sm">AI</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {!isChatMode ? (
          // Home View with Search and FAQs
          <div>
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                How can we help you today?
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Get instant support for your account and services
              </p>
              
              {/* Search Bar */}
              <div className="max-w-2xl mx-auto mb-8">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search for help or ask a question..."
                    onClick={handleSearchClick}
                    className="w-full px-6 py-4 pr-16 text-lg border-2 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 cursor-pointer hover:border-red-300"
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.418 8-9.847 8-.42 0-.84-.038-1.252-.111L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.418-8 9.847-8" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Chat</h3>
                <p className="text-gray-600 text-sm">Get instant help from our AI assistant</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Cashback Help</h3>
                <p className="text-gray-600 text-sm">Track and manage your cashback rewards</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Account Support</h3>
                <p className="text-gray-600 text-sm">Manage your account settings and profile</p>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h2>
                <p className="text-gray-600">Quick answers to common questions</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                {faqQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleFAQClick(question)}
                    className="text-left p-4 rounded-lg border border-gray-200 hover:border-red-300 hover:bg-red-50 transition-all duration-200 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-gray-900 font-medium group-hover:text-red-700">
                        {question}
                      </span>
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (

          
          // Chat Interface
          <div>

              {/* Chat Header */}
              <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                AI Support Assistant
              </h1>
             
            </div>
            {/* Chat Container */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden h-[calc(100vh-180px)] flex flex-col">
          
              {/* Chat Header - Show server status */}
              <div className="bg-red-600 px-4 sm:px-6 py-3 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-3">
                      <div className="w-4 h-4 bg-red-600 rounded-full"></div>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-sm">Support Assistant</h3>
                      <p className="text-red-100 text-xs">
                        {serverStatus === 'checking' ? 'Connecting...' :
                         serverStatus === 'online' ? 'Online now' : 'Currently offline'}
                      </p>
                    </div>
                  </div>
                  {/* Server Status Indicator */}
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${
                      serverStatus === 'checking' ? 'bg-yellow-300 animate-pulse' :
                      serverStatus === 'online' ? 'bg-green-300' : 'bg-red-300'
                    }`}></div>
                    <span className="text-white text-xs font-medium">
                      {serverStatus === 'checking' ? 'Checking' :
                       serverStatus === 'online' ? 'Online' : 'Offline'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 mt-20">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.418 8-9.847 8-.42 0-.84-.038-1.252-.111L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.418-8 9.847-8 2.717 0 5.135 1.11 6.915 2.893C21.09 8.175 21 10.051 21 12z" />
                      </svg>
                    </div>
                    <p className="text-lg font-medium mb-2">Ready to help!</p>
                    <p className="text-sm">Ask me anything realted to product  & service issue</p>
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {messages.map((msg, i) => (
                      <div
                        key={i}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[85%] sm:max-w-xs lg:max-w-md px-3 sm:px-4 py-2 rounded-2xl ${
                            msg.sender === 'user'
                              ? 'bg-red-600 text-white rounded-br-sm'
                              : 'bg-white text-gray-800 rounded-bl-sm shadow-sm border'
                          }`}
                        >
                          <div className="text-sm leading-relaxed">
                            {msg.sender === 'bot' ? (
                              <ReactMarkdown 
                                remarkPlugins={[remarkGfm]} 
                                rehypePlugins={[rehypeSanitize]} 
                                components={{
                                  a: ({ href, children }) => (
                                    <a
                                      href={href}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:text-blue-800 underline"
                                    >
                                      {children}
                                    </a>
                                  ),
                                  p: ({ children }) => (
                                    <p className="mb-2 last:mb-0">{children}</p>
                                  ),
                                  ul: ({ children }) => (
                                    <ul className="list-disc list-inside mb-2 last:mb-0">{children}</ul>
                                  ),
                                  ol: ({ children }) => (
                                    <ol className="list-decimal list-inside mb-2 last:mb-0">{children}</ol>
                                  ),
                                  li: ({ children }) => (
                                    <li className="mb-1">{children}</li>
                                  ),
                                  strong: ({ children }) => (
                                    <strong className="font-semibold">{children}</strong>
                                  ),
                                  em: ({ children }) => (
                                    <em className="italic">{children}</em>
                                  ),
                                  code: ({ children }) => (
                                    <code className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono">{children}</code>
                                  ),
                                  pre: ({ children }) => (
                                    <pre className="bg-gray-100 p-2 rounded text-xs font-mono overflow-x-auto mb-2 last:mb-0">{children}</pre>
                                  )
                                }}
                              >
                                {msg.text}
                              </ReactMarkdown>
                            ) : (
                              msg.text
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-white text-gray-800 rounded-2xl rounded-bl-sm shadow-sm border px-3 sm:px-4 py-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Input Area - Fixed at bottom */}
              <div className="bg-white border-t border-gray-200 p-4 sm:p-6 flex-shrink-0">
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      className="w-full px-4 py-2 sm:py-3 pr-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                    />
                    <button
                      onClick={handleSend}
                      disabled={!input.trim() || isTyping || !canSendRequest}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500 text-center">
                  Press Enter to send • Shift + Enter for new line
                 
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Powered by Kunal Chaudhary👍</p>
          {/* Mobile Server Status */}
          <div className="flex items-center justify-center mt-2 md:hidden">
            <div className={`w-2 h-2 rounded-full mr-2 ${
              serverStatus === 'checking' ? 'bg-yellow-400 animate-pulse' :
              serverStatus === 'online' ? 'bg-green-400' : 'bg-red-400'
            }`}></div>
            <span className={`text-xs ${
              serverStatus === 'checking' ? 'text-yellow-600' :
              serverStatus === 'online' ? 'text-green-600' : 'text-red-600'
            }`}>
              Server: {serverStatus === 'checking' ? 'Checking...' :
                       serverStatus === 'online' ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;