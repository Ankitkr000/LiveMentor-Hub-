import { useState } from "react";
import axios from "axios";
import styles from "./css/CreateMeeting.module.css";

const CreateMeeting = ({ onClose, onMeetingCreated }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "",
    scheduledTime: "",
    duration: 60,
    maxParticipants: 50
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/meeting/create",
        formData,
        { withCredentials: true }
      );

      if (response.data.success) {
        alert("Meeting created successfully!");
        onMeetingCreated && onMeetingCreated(response.data.meeting);
        onClose();
      }
    } catch (err) {
      console.error("Error creating meeting:", err);
      setError(err.response?.data?.message || "Failed to create meeting");
    } finally {
      setLoading(false);
    }
  };

  // Get minimum datetime for scheduling (current time)
  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Create Group Meeting</h2>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Meeting Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., DSA Problem Solving Session"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief description of the meeting..."
              rows="3"
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="subject">Subject *</label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              >
                <option value="">Select Subject</option>
                <option value="DSA">DSA</option>
                <option value="System Design">System Design</option>
                <option value="AI-ML">AI-ML</option>
                <option value="Web Dev">Web Dev</option>
                <option value="Database">Database</option>
                <option value="DevOps">DevOps</option>
                <option value="UI-UX">UI-UX</option>
                <option value="Career">Career</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="scheduledTime">Scheduled Time *</label>
              <input
                type="datetime-local"
                id="scheduledTime"
                name="scheduledTime"
                value={formData.scheduledTime}
                onChange={handleChange}
                min={getMinDateTime()}
                required
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="duration">Duration (minutes)</label>
              <input
                type="number"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                min="15"
                max="240"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="maxParticipants">Max Participants</label>
              <input
                type="number"
                id="maxParticipants"
                name="maxParticipants"
                value={formData.maxParticipants}
                onChange={handleChange}
                min="2"
                max="100"
              />
            </div>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.formActions}>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>
              Cancel
            </button>
            <button type="submit" disabled={loading} className={styles.submitBtn}>
              {loading ? "Creating..." : "Create Meeting"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateMeeting;
