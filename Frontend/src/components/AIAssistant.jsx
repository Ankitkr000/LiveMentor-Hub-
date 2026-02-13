import { useState, useRef, useEffect } from "react";
import axios from "axios";
import styles from "./css/AIAssistant.module.css";
import { Send, Sparkles, Code, BookOpen, X, Minimize2, Maximize2 } from "lucide-react";

const AIAssistant = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "👋 Hi! I'm your AI Learning Assistant. I can help you understand concepts, solve problems, review code, and guide your learning. What would you like to learn today?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("");
  const messagesEndRef = useRef(null);

  const subjects = ["DSA", "Web Dev", "AI-ML", "UI-UX", "DBMS", "System Design", "Networking", "Career"];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    
    // Add user message
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const conversationHistory = messages.slice(-10).map(msg => ({
        role: msg.role === "assistant" ? "model" : "user",
        content: msg.content
      }));

      const response = await axios.post(
        "http://localhost:5000/ai/chat",
        {
          message: userMessage,
          conversationHistory
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        setMessages(prev => [...prev, {
          role: "assistant",
          content: response.data.message
        }]);
      }
    } catch (error) {
      console.error("AI chat error:", error);
      let errorMessage = "Sorry, I encountered an error. Please try again.";
      
      if (error.response?.status === 401) {
        errorMessage = "⚠️ Please log in to use the AI Assistant.";
      } else if (error.response?.status === 500) {
        errorMessage = "⚠️ Server error. The AI service might be temporarily unavailable.";
      } else if (error.response?.data?.message) {
        errorMessage = `⚠️ ${error.response.data.message}`;
      } else if (!error.response) {
        errorMessage = "⚠️ Cannot connect to server. Make sure the backend is running.";
      }
      
      setMessages(prev => [...prev, {
        role: "assistant",
        content: errorMessage
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedQuestion = async (subject) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/ai/suggestions?subject=${subject}`,
        { withCredentials: true }
      );

      if (response.data.success && response.data.questions.length > 0) {
        const question = response.data.questions[0];
        setInput(question);
      }
    } catch (error) {
      console.error("Suggestions error:", error);
      if (error.response?.status === 401) {
        setMessages(prev => [...prev, {
          role: "assistant",
          content: "⚠️ Please log in to get suggestions."
        }]);
      }
    }
  };

  const quickActions = [
    { icon: <BookOpen size={18} />, label: "Explain Concept", action: () => setInput("Can you explain ") },
    { icon: <Code size={18} />, label: "Review My Code", action: () => setInput("Can you review this code:\n") },
    { icon: <Sparkles size={18} />, label: "Study Tips", action: () => setInput("What are some effective study tips for ") }
  ];

  if (!isOpen) return null;

  return (
    <div className={`${styles.container} ${isMinimized ? styles.minimized : ''}`}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Sparkles size={24} className={styles.sparkleIcon} />
          <div className={styles.headerText}>
            <h3>AI Learning Assistant</h3>
            <span className={styles.status}>
              <span className={styles.onlineDot}></span>
              Online
            </span>
          </div>
        </div>
        <div className={styles.headerActions}>
          <button 
            className={styles.iconBtn}
            onClick={() => setIsMinimized(!isMinimized)}
            title={isMinimized ? "Maximize" : "Minimize"}
          >
            {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
          </button>
          <button 
            className={styles.iconBtn}
            onClick={onClose}
            title="Close"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <div className={styles.messagesContainer}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`${styles.message} ${
                  msg.role === "user" ? styles.userMessage : styles.aiMessage
                }`}
              >
                {msg.role === "assistant" && (
                  <div className={styles.aiAvatar}>
                    <Sparkles size={16} />
                  </div>
                )}
                <div className={styles.messageContent}>
                  {msg.content.split('\n').map((line, i) => (
                    <p key={i}>{line || '\u00A0'}</p>
                  ))}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className={`${styles.message} ${styles.aiMessage}`}>
                <div className={styles.aiAvatar}>
                  <Sparkles size={16} />
                </div>
                <div className={styles.messageContent}>
                  <div className={styles.typingIndicator}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {messages.length === 1 && (
            <div className={styles.quickActionsContainer}>
              <p className={styles.quickActionsTitle}>Quick Actions:</p>
              <div className={styles.quickActions}>
                {quickActions.map((action, idx) => (
                  <button
                    key={idx}
                    className={styles.quickActionBtn}
                    onClick={action.action}
                  >
                    {action.icon}
                    {action.label}
                  </button>
                ))}
              </div>
              
              <p className={styles.quickActionsTitle}>Get questions about:</p>
              <div className={styles.subjectChips}>
                {subjects.map((subject, idx) => (
                  <button
                    key={idx}
                    className={styles.subjectChip}
                    onClick={() => handleSuggestedQuestion(subject)}
                  >
                    {subject}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className={styles.inputContainer}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Ask me anything about your studies..."
              rows={1}
              className={styles.input}
            />
            <button
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              className={styles.sendBtn}
              title="Send message"
            >
              <Send size={20} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AIAssistant;
