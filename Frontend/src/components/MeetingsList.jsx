import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./css/MeetingsList.module.css";
import { Video, Users, Calendar, Clock, Trash2, Copy, Check } from "lucide-react";

const MeetingsList = ({ userRole }) => {
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [copiedLink, setCopiedLink] = useState(null);

  useEffect(() => {
    fetchMeetings();
  }, [userRole]);

  const fetchMeetings = async () => {
    try {
      const endpoint = userRole === "teacher" 
        ? "http://localhost:5000/meeting/teacher/meetings"
        : "http://localhost:5000/meeting/available";
      
      const response = await axios.get(endpoint, { withCredentials: true });
      
      if (response.data.success) {
        setMeetings(response.data.meetings);
      }
    } catch (error) {
      console.error("Error fetching meetings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinMeeting = async (meetingLink) => {
    try {
      if (userRole === "student") {
        await axios.post(
          `http://localhost:5000/meeting/join/${meetingLink}`,
          {},
          { withCredentials: true }
        );
      }
      navigate(`/group-meeting/${meetingLink}`);
    } catch (error) {
      console.error("Error joining meeting:", error);
      alert(error.response?.data?.message || "Failed to join meeting");
    }
  };

  const handleDeleteMeeting = async (meetingId) => {
    if (!window.confirm("Are you sure you want to delete this meeting?")) return;

    try {
      await axios.delete(
        `http://localhost:5000/meeting/${meetingId}`,
        { withCredentials: true }
      );
      setMeetings(prev => prev.filter(m => m._id !== meetingId));
      alert("Meeting deleted successfully");
    } catch (error) {
      console.error("Error deleting meeting:", error);
      alert("Failed to delete meeting");
    }
  };

  const copyMeetingLink = (meetingLink) => {
    const fullLink = `${window.location.origin}/group-meeting/${meetingLink}`;
    navigator.clipboard.writeText(fullLink);
    setCopiedLink(meetingLink);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = date - now;
    
    if (diff < 0) {
      return "Started";
    } else if (diff < 3600000) {
      return `Starting in ${Math.floor(diff / 60000)} min`;
    } else if (diff < 86400000) {
      return `Today at ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
  };

  const getStatusBadge = (meeting) => {
    const now = new Date();
    const scheduledTime = new Date(meeting.scheduledTime);
    const endTime = new Date(scheduledTime.getTime() + meeting.duration * 60000);

    if (meeting.status === "cancelled") {
      return <span className={`${styles.badge} ${styles.cancelled}`}>Cancelled</span>;
    } else if (meeting.status === "completed") {
      return <span className={`${styles.badge} ${styles.completed}`}>Completed</span>;
    } else if (now >= scheduledTime && now <= endTime) {
      return <span className={`${styles.badge} ${styles.ongoing}`}>🔴 Live</span>;
    } else if (now < scheduledTime) {
      return <span className={`${styles.badge} ${styles.scheduled}`}>Scheduled</span>;
    } else {
      return <span className={`${styles.badge} ${styles.completed}`}>Ended</span>;
    }
  };

  const filteredMeetings = meetings.filter(meeting => {
    if (filter === "all") return true;
    if (filter === "upcoming") {
      const now = new Date();
      return new Date(meeting.scheduledTime) > now && meeting.status === "scheduled";
    }
    if (filter === "ongoing") {
      const now = new Date();
      const scheduledTime = new Date(meeting.scheduledTime);
      const endTime = new Date(scheduledTime.getTime() + meeting.duration * 60000);
      return now >= scheduledTime && now <= endTime;
    }
    return meeting.status === filter;
  });

  if (loading) {
    return <div className={styles.loading}>Loading meetings...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          <Video size={28} />
          {userRole === "teacher" ? "My Meetings" : "Available Meetings"}
        </h2>
        
        <div className={styles.filters}>
          <button 
            className={filter === "all" ? styles.activeFilter : styles.filterBtn}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button 
            className={filter === "upcoming" ? styles.activeFilter : styles.filterBtn}
            onClick={() => setFilter("upcoming")}
          >
            Upcoming
          </button>
          <button 
            className={filter === "ongoing" ? styles.activeFilter : styles.filterBtn}
            onClick={() => setFilter("ongoing")}
          >
            Live
          </button>
        </div>
      </div>

      {filteredMeetings.length === 0 ? (
        <div className={styles.emptyState}>
          <Video size={64} />
          <p>No meetings found</p>
          {userRole === "teacher" && (
            <p className={styles.emptyHint}>Create your first group meeting to get started!</p>
          )}
        </div>
      ) : (
        <div className={styles.meetingsGrid}>
          {filteredMeetings.map((meeting) => (
            <div key={meeting._id} className={styles.meetingCard}>
              <div className={styles.cardHeader}>
                <div className={styles.cardTitle}>
                  <h3>{meeting.title}</h3>
                  {getStatusBadge(meeting)}
                </div>
                <span className={styles.subject}>{meeting.subject}</span>
              </div>

              {meeting.description && (
                <p className={styles.description}>{meeting.description}</p>
              )}

              <div className={styles.meetingInfo}>
                <div className={styles.infoItem}>
                  <Calendar size={18} />
                  <span>{formatDate(meeting.scheduledTime)}</span>
                </div>
                <div className={styles.infoItem}>
                  <Clock size={18} />
                  <span>{meeting.duration} minutes</span>
                </div>
                <div className={styles.infoItem}>
                  <Users size={18} />
                  <span>{meeting.participants.length}/{meeting.maxParticipants}</span>
                </div>
              </div>

              {userRole === "student" && (
                <div className={styles.teacherInfo}>
                  <span>Host: {meeting.teacherName}</span>
                </div>
              )}

              <div className={styles.cardActions}>
                {userRole === "teacher" && (
                  <>
                    <button
                      className={styles.copyBtn}
                      onClick={() => copyMeetingLink(meeting.meetingLink)}
                      title="Copy meeting link"
                    >
                      {copiedLink === meeting.meetingLink ? (
                        <><Check size={18} /> Copied</>
                      ) : (
                        <><Copy size={18} /> Copy Link</>
                      )}
                    </button>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDeleteMeeting(meeting._id)}
                      title="Delete meeting"
                    >
                      <Trash2 size={18} />
                    </button>
                  </>
                )}
                <button
                  className={styles.joinBtn}
                  onClick={() => handleJoinMeeting(meeting.meetingLink)}
                >
                  {userRole === "teacher" ? "Start Meeting" : "Join Meeting"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MeetingsList;
