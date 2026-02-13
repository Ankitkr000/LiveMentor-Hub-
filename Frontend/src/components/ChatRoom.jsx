// src/components/ChatRoom.jsx
import { useState, useEffect, useRef } from "react";
import socket from "../socket";
import styles from './css/ChatRoom.module.css';

const ChatRoom = ({ roomId }) => {
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const fileInputRef = useRef(null);
  const chatMessagesRef = useRef(null);

  const userName = localStorage.getItem("userName");

  useEffect(() => {
    socket.on("receive_message", ({ sender, message, fileData }) => {
      setChatLog((prev) => [...prev, { sender, message, fileData }]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [chatLog]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should be less than 5MB");
        return;
      }

      setSelectedFile(file);

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFilePreview(e.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
    }
  };

  const clearFileSelection = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const sendMessage = () => {
    if (selectedFile) {
      // Send file
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileData = {
          name: selectedFile.name,
          type: selectedFile.type,
          size: selectedFile.size,
          data: e.target.result,
        };

        socket.emit("send_message", {
          roomId,
          sender: userName,
          message: message.trim() || `Sent a file: ${selectedFile.name}`,
          fileData,
        });

        setMessage("");
        clearFileSelection();
      };
      reader.readAsDataURL(selectedFile);
    } else if (message.trim()) {
      // Send text message
      socket.emit("send_message", {
        roomId,
        sender: userName,
        message,
      });
      setMessage("");
    }
  };

  return (
    <div className={styles.chatroomContainer}>
      {/* Chat Header */}
      <div className={styles.chatHeader}>
        <div className={styles.chatHeaderContent}>
          <svg className={styles.chatLogoIcon} viewBox="0 0 24 24" fill="none">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className={styles.chatHeaderTitle}>Chat</span>
        </div>
      </div>

      <div className={styles.chatMessages} ref={chatMessagesRef}>
        {chatLog.map((msg, idx) => (
          <div key={idx} className={`${styles.chatMessage} ${msg.sender === userName ? styles.sent : styles.received}`}>
            <div className={styles.messageSender}>
              {msg.sender === userName ? "You" : msg.sender}
            </div>
            <div className={styles.messageBubble}>
              {msg.fileData ? (
                <div className={styles.fileMessage}>
                  {msg.fileData.type.startsWith('image/') ? (
                    <div className={styles.imageContainer}>
                      <img 
                        src={msg.fileData.data} 
                        alt={msg.fileData.name}
                        className={styles.chatImage}
                        onClick={() => window.open(msg.fileData.data, '_blank')}
                      />
                      <div className={styles.fileName}>{msg.fileData.name}</div>
                    </div>
                  ) : (
                    <div className={styles.fileContainer}>
                      <div className={styles.fileIcon}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M13 2v7h7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div className={styles.fileInfo}>
                        <div className={styles.fileName}>{msg.fileData.name}</div>
                        <div className={styles.fileSize}>
                          {(msg.fileData.size / 1024).toFixed(2)} KB
                        </div>
                      </div>
                      <a 
                        href={msg.fileData.data} 
                        download={msg.fileData.name}
                        className={styles.downloadBtn}
                        title="Download file"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </a>
                    </div>
                  )}
                  {msg.message && !msg.message.startsWith('Sent a file:') && (
                    <div className={styles.fileCaption}>{msg.message}</div>
                  )}
                </div>
              ) : (
                msg.message
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className={`${styles.chatMessage} ${styles.received}`}>
            <div className={styles.typingIndicator}>
              <span></span><span></span><span></span>
            </div>
          </div>
        )}
      </div>

      {/* File Preview */}
      {selectedFile && (
        <div className={styles.filePreview}>
          <div className={styles.previewContent}>
            {filePreview ? (
              <img src={filePreview} alt="Preview" className={styles.previewImage} />
            ) : (
              <div className={styles.previewFile}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M13 2v7h7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            )}
            <div className={styles.previewInfo}>
              <span className={styles.previewName}>{selectedFile.name}</span>
              <span className={styles.previewSize}>
                {(selectedFile.size / 1024).toFixed(2)} KB
              </span>
            </div>
            <button className={styles.removeFileBtn} onClick={clearFileSelection}>
              ✕
            </button>
          </div>
        </div>
      )}

      <div className={styles.chatInputArea}>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          style={{ display: 'none' }}
          accept="image/*,.pdf,.doc,.docx,.txt,.zip,.rar"
        />
        <button 
          className={styles.attachButton}
          onClick={() => fileInputRef.current?.click()}
          title="Attach file or image"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <input
          className={styles.chatInput}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={selectedFile ? "Add a caption (optional)..." : "Type message..."}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button className={styles.sendButton} onClick={sendMessage}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
