import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import socket from "../socket";
import axios from "axios";
import styles from "./css/GroupVideoChat.module.css";
import { Mic, MicOff, Video as VideoIcon, VideoOff, PhoneOff, Users, MessageSquare } from "lucide-react";

const GroupVideoChat = () => {
  const { meetingLink } = useParams();
  const navigate = useNavigate();

  const localVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const peersRef = useRef({});  // Store peer connections: { socketId: { pc, stream, info } }
  const pendingCandidatesRef = useRef({});  // Store ICE candidates for peers

  const [meeting, setMeeting] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");

  const userName = localStorage.getItem("userName");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchMeetingDetails();
    initializeMedia();

    return () => {
      cleanup();
    };
  }, [meetingLink]);

  const fetchMeetingDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/meeting/${meetingLink}`,
        { withCredentials: true }
      );
      if (response.data.success) {
        setMeeting(response.data.meeting);
      }
    } catch (error) {
      console.error("Error fetching meeting:", error);
      alert("Meeting not found");
      navigate(-1);
    }
  };

  const initializeMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      stream.getVideoTracks()[0].enabled = cameraOn;
      stream.getAudioTracks()[0].enabled = micOn;

      // Join the meeting room
      socket.emit("join_group_meeting", { meetingLink, userName, userId });

      setupSocketListeners();
    } catch (error) {
      console.error("Error accessing media devices:", error);
      alert("Could not access camera/microphone");
    }
  };

  const setupSocketListeners = () => {
    // When joining, get list of existing participants
    socket.on("existing_participants", ({ participants }) => {
      console.log("Existing participants:", participants);
      participants.forEach(socketId => {
        createPeerConnection(socketId, true);  // true = create offer
      });
    });

    // When a new participant joins
    socket.on("new_participant_joined", ({ socketId, userName: newUserName }) => {
      console.log("New participant joined:", newUserName, socketId);
      setParticipants(prev => [...prev, { socketId, userName: newUserName }]);
      createPeerConnection(socketId, false);  // false = wait for offer
    });

    // Receive offer from another peer
    socket.on("group_offer", async ({ offer, fromSocketId }) => {
      console.log("Received offer from:", fromSocketId);
      const peerData = peersRef.current[fromSocketId];
      
      if (peerData && peerData.pc) {
        try {
          await peerData.pc.setRemoteDescription(new RTCSessionDescription(offer));
          
          // Process pending ICE candidates
          if (pendingCandidatesRef.current[fromSocketId]) {
            pendingCandidatesRef.current[fromSocketId].forEach(candidate => {
              peerData.pc.addIceCandidate(new RTCIceCandidate(candidate));
            });
            delete pendingCandidatesRef.current[fromSocketId];
          }

          // Create and send answer
          const answer = await peerData.pc.createAnswer();
          await peerData.pc.setLocalDescription(answer);
          socket.emit("group_answer", {
            answer,
            targetSocketId: fromSocketId,
            meetingLink
          });
        } catch (error) {
          console.error("Error handling offer:", error);
        }
      }
    });

    // Receive answer from another peer
    socket.on("group_answer", async ({ answer, fromSocketId }) => {
      console.log("Received answer from:", fromSocketId);
      const peerData = peersRef.current[fromSocketId];
      
      if (peerData && peerData.pc) {
        try {
          await peerData.pc.setRemoteDescription(new RTCSessionDescription(answer));
          
          // Process pending ICE candidates
          if (pendingCandidatesRef.current[fromSocketId]) {
            pendingCandidatesRef.current[fromSocketId].forEach(candidate => {
              peerData.pc.addIceCandidate(new RTCIceCandidate(candidate));
            });
            delete pendingCandidatesRef.current[fromSocketId];
          }
        } catch (error) {
          console.error("Error handling answer:", error);
        }
      }
    });

    // Receive ICE candidate
    socket.on("group_ice_candidate", ({ candidate, fromSocketId }) => {
      const peerData = peersRef.current[fromSocketId];
      
      if (peerData && peerData.pc) {
        if (peerData.pc.remoteDescription) {
          peerData.pc.addIceCandidate(new RTCIceCandidate(candidate));
        } else {
          // Store candidate for later
          if (!pendingCandidatesRef.current[fromSocketId]) {
            pendingCandidatesRef.current[fromSocketId] = [];
          }
          pendingCandidatesRef.current[fromSocketId].push(candidate);
        }
      }
    });

    // When a participant leaves
    socket.on("participant_left", ({ socketId }) => {
      console.log("Participant left:", socketId);
      removePeer(socketId);
      setParticipants(prev => prev.filter(p => p.socketId !== socketId));
    });
  };

  const createPeerConnection = async (socketId, shouldCreateOffer) => {
    if (peersRef.current[socketId]) return;  // Already exists

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    // Add local stream tracks to peer connection
    localStreamRef.current.getTracks().forEach(track => {
      pc.addTrack(track, localStreamRef.current);
    });

    // Handle incoming stream
    pc.ontrack = (event) => {
      console.log("Received track from:", socketId);
      if (!peersRef.current[socketId]) {
        peersRef.current[socketId] = {};
      }
      peersRef.current[socketId].stream = event.streams[0];
      setParticipants(prev => [...prev]);  // Trigger re-render
    };

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("group_ice_candidate", {
          candidate: event.candidate,
          targetSocketId: socketId,
          meetingLink
        });
      }
    };

    peersRef.current[socketId] = { pc };

    // Create offer if needed
    if (shouldCreateOffer) {
      try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit("group_offer", {
          offer,
          targetSocketId: socketId,
          meetingLink
        });
      } catch (error) {
        console.error("Error creating offer:", error);
      }
    }
  };

  const removePeer = (socketId) => {
    const peerData = peersRef.current[socketId];
    if (peerData) {
      if (peerData.pc) {
        peerData.pc.close();
      }
      delete peersRef.current[socketId];
    }
  };

  const toggleCamera = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      setCameraOn(videoTrack.enabled);
    }
  };

  const toggleMic = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setMicOn(audioTrack.enabled);
    }
  };

  const leaveMeeting = () => {
    cleanup();
    navigate(-1);
  };

  const cleanup = () => {
    socket.emit("leave_group_meeting", { meetingLink });
    
    // Close all peer connections
    Object.keys(peersRef.current).forEach(socketId => {
      removePeer(socketId);
    });

    // Stop local stream
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }

    // Remove socket listeners
    socket.off("existing_participants");
    socket.off("new_participant_joined");
    socket.off("group_offer");
    socket.off("group_answer");
    socket.off("group_ice_candidate");
    socket.off("participant_left");
  };

  const sendMessage = () => {
    if (messageInput.trim()) {
      const msg = {
        sender: userName,
        text: messageInput,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, msg]);
      // TODO: Emit to other participants via socket
      setMessageInput("");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.meetingInfo}>
          <h2>{meeting?.title || "Group Meeting"}</h2>
          <span className={styles.participantCount}>
            <Users size={18} />
            {Object.keys(peersRef.current).length + 1} participants
          </span>
        </div>
        <button className={styles.chatToggle} onClick={() => setShowChat(!showChat)}>
          <MessageSquare size={24} />
        </button>
      </div>

      <div className={styles.videoGrid}>
        {/* Local video */}
        <div className={styles.videoContainer}>
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className={styles.videoElement}
          />
          <div className={styles.videoLabel}>You {!cameraOn && "(Camera Off)"}</div>
        </div>

        {/* Remote videos */}
        {Object.entries(peersRef.current).map(([socketId, peerData]) => (
          <RemoteVideo key={socketId} stream={peerData.stream} socketId={socketId} />
        ))}
      </div>

      {showChat && (
        <div className={styles.chatPanel}>
          <div className={styles.chatMessages}>
            {messages.map((msg, idx) => (
              <div key={idx} className={styles.message}>
                <strong>{msg.sender}</strong> <span>{msg.time}</span>
                <p>{msg.text}</p>
              </div>
            ))}
          </div>
          <div className={styles.chatInput}>
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}

      <div className={styles.controls}>
        <button
          className={`${styles.controlBtn} ${!micOn && styles.off}`}
          onClick={toggleMic}
          title={micOn ? "Mute" : "Unmute"}
        >
          {micOn ? <Mic size={24} /> : <MicOff size={24} />}
        </button>

        <button
          className={`${styles.controlBtn} ${!cameraOn && styles.off}`}
          onClick={toggleCamera}
          title={cameraOn ? "Turn off camera" : "Turn on camera"}
        >
          {cameraOn ? <VideoIcon size={24} /> : <VideoOff size={24} />}
        </button>

        <button
          className={`${styles.controlBtn} ${styles.endCall}`}
          onClick={leaveMeeting}
          title="Leave meeting"
        >
          <PhoneOff size={24} />
        </button>
      </div>
    </div>
  );
};

// Remote video component
const RemoteVideo = ({ stream, socketId }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className={styles.videoContainer}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className={styles.videoElement}
      />
      <div className={styles.videoLabel}>Participant</div>
    </div>
  );
};

export default GroupVideoChat;
