import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import {
  AtSign,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CircleUserRound,
  Ellipsis,
  Mail,
  MapPin,
  MessageCircle,
  Paperclip,
  Search,
  Send,
  Smile,
  X,
} from "lucide-react";
import useChat from "../../hooks/useChat";

const getInitials = (contact) =>
  `${contact?.firstName?.[0] || ""}${contact?.lastName?.[0] || ""}`.toUpperCase() || "U";

const getFullName = (contact) =>
  [contact?.firstName, contact?.lastName].filter(Boolean).join(" ") || contact?.userName || "Unknown User";

const formatTime = (dateValue) => {
  if (!dateValue) return "";

  return new Date(dateValue).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDate = (dateValue) => {
  if (!dateValue) return "Not available";

  return new Date(dateValue).toLocaleDateString([], {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

const palette = ["#ede9fe", "#ddd6fe", "#f3e8ff", "#e9d5ff", "#f5d0fe", "#c4b5fd"];

const ContactItem = ({ contact, isSelected, onClick }) => {
  const name = getFullName(contact);
  const lastMessage = contact.lastMessage || contact.jobTitle || "Start a conversation";
  const color = palette[(contact.id?.toString().charCodeAt(0) || 0) % palette.length];

  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: "100%",
        display: "grid",
        gridTemplateColumns: "36px minmax(0, 1fr) auto",
        alignItems: "center",
        gap: "10px",
        padding: "10px",
        border: isSelected ? "1px solid #c4b5fd" : "1px solid transparent",
        borderRadius: "4px",
        backgroundColor: isSelected ? "#f5f3ff" : "#fff",
        cursor: "pointer",
        textAlign: "left",
      }}
    >
      <span
        style={{
          width: "34px",
          height: "34px",
          borderRadius: "50%",
          background: color,
          color: "#5b21b6",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "12px",
          fontWeight: 700,
          flexShrink: 0,
        }}
      >
        {getInitials(contact)}
      </span>

      <span style={{ minWidth: 0 }}>
        <span
          style={{
            display: "block",
            color: "#21133f",
            fontSize: "13px",
            fontWeight: 700,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {name}
        </span>
        <span
          style={{
            display: "block",
            marginTop: "3px",
            color: "#7c6b95",
            fontSize: "12px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {lastMessage}
        </span>
      </span>

      <span style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
        <span style={{ color: "#a78bfa", fontSize: "11px", whiteSpace: "nowrap" }}>
          {formatTime(contact.lastMessageAt || contact.updatedAt)}
        </span>
        {contact.unreadCount > 0 && (
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#7c3aed",
            }}
          />
        )}
      </span>
    </button>
  );
};

const MessageBubble = ({ message, isOwn, contact }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    style={{
      display: "grid",
      gridTemplateColumns: "28px minmax(0, 1fr)",
      gap: "8px",
      marginBottom: "18px",
    }}
  >
    <span
      style={{
        width: "24px",
        height: "24px",
        borderRadius: "50%",
        background: isOwn ? "#c4b5fd" : "#ede9fe",
        color: "#4c1d95",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "9px",
        fontWeight: 700,
      }}
    >
      {isOwn ? "ME" : getInitials(contact)}
    </span>

    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
        <span style={{ color: "#6d28d9", fontSize: "12px", fontWeight: 600 }}>
          {isOwn ? "You" : getFullName(contact)}
        </span>
        <span style={{ color: "#a78bfa", fontSize: "11px" }}>{formatTime(message.sentAt)}</span>
      </div>
      <p style={{ color: "#21133f", fontSize: "13px", lineHeight: 1.45, margin: 0 }}>{message.content}</p>
    </div>
  </motion.div>
);

const ProfileRow = ({ icon: Icon, label, value }) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "1fr auto",
      alignItems: "center",
      gap: "12px",
      padding: "11px 0",
      borderBottom: "1px solid #ede9fe",
    }}
  >
    <span style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "#8b5cf6", fontSize: "12px" }}>
      <Icon size={14} strokeWidth={1.8} />
      {label}
    </span>
    <span style={{ color: "#21133f", fontSize: "12px", fontWeight: 700, textAlign: "right" }}>{value}</span>
  </div>
);

export default function MessagesPage() {
  const {
    contacts,
    selectedContact,
    setSelectedContact,
    messages,
    newMessage,
    setNewMessage,
    isLoading,
    handleSend,
  } = useChat();

  const [searchTerm, setSearchTerm] = useState("");
  const messagesEndRef = useRef(null);

  let currentUserId = null;
  try {
    const token = localStorage.getItem("token");
    if (token) {
      currentUserId = JSON.parse(atob(token.split(".")[1])).nameid;
    }
  } catch (error) {
    console.warn("Could not parse token for currentUserId:", error);
  }

  const filteredContacts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return contacts;

    return contacts.filter((contact) => {
      const searchable = `${getFullName(contact)} ${contact.email || ""} ${contact.jobTitle || ""} ${
        contact.department || ""
      }`.toLowerCase();
      return searchable.includes(query);
    });
  }, [contacts, searchTerm]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <Helmet>
        <title>Messages | Employee Management System</title>
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          minHeight: "calc(100vh - 80px)",
          padding: "24px",
          background: "#f7f2ff",
          display: "flex",
          flexDirection: "column",
          gap: "18px",
        }}
      >
        <h1 style={{ color: "#2e1065", fontSize: "21px", fontWeight: 800, margin: 0 }}>Message center</h1>

        <div
          style={{
            minHeight: 0,
            height: "calc(100vh - 150px)",
            display: "grid",
            gridTemplateColumns: "300px minmax(360px, 1fr) 250px",
            background: "#fff",
            border: "1px solid #ddd6fe",
            borderRadius: "4px",
            overflow: "hidden",
          }}
        >
          <aside
            style={{
              borderRight: "1px solid #ddd6fe",
              padding: "18px 14px",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            <div
              style={{
                position: "relative",
                height: "44px",
                border: "2px solid #c4b5fd",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                background: "#fff",
              }}
            >
              <Search size={18} color="#7c3aed" style={{ marginLeft: "12px", flexShrink: 0 }} />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search message"
                style={{
                  width: "100%",
                  minWidth: 0,
                  border: 0,
                  outline: 0,
                  padding: "0 34px 0 10px",
                  color: "#21133f",
                  fontSize: "13px",
                }}
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  aria-label="Clear search"
                  style={{
                    position: "absolute",
                    right: "10px",
                    width: "18px",
                    height: "18px",
                    border: 0,
                    borderRadius: "50%",
                    background: "#a78bfa",
                    color: "#fff",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  <X size={12} />
                </button>
              )}
            </div>

            <div style={{ overflowY: "auto", display: "flex", flexDirection: "column", gap: "6px", paddingRight: "2px" }}>
              {filteredContacts.length === 0 ? (
                <p style={{ color: "#7c6b95", fontSize: "13px", margin: "24px 0", textAlign: "center" }}>
                  No messages found
                </p>
              ) : (
                filteredContacts.map((contact) => (
                  <ContactItem
                    key={contact.id}
                    contact={contact}
                    isSelected={selectedContact?.id === contact.id}
                    onClick={() => setSelectedContact(contact)}
                  />
                ))
              )}
            </div>
          </aside>

          <main style={{ minWidth: 0, display: "flex", flexDirection: "column", background: "#fbf8ff" }}>
            {selectedContact ? (
              <>
                <header
                  style={{
                    height: "86px",
                    padding: "18px 22px",
                    borderBottom: "1px solid #ddd6fe",
                    background: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "16px",
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <h2 style={{ color: "#2e1065", fontSize: "16px", fontWeight: 800, margin: 0 }}>
                      {getFullName(selectedContact)}
                    </h2>
                    <p style={{ color: "#7c6b95", fontSize: "12px", margin: "5px 0 0" }}>
                      Job: <strong style={{ color: "#4c1d95" }}>{selectedContact.jobTitle || "Employee"}</strong>
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label="More message options"
                    style={{
                      width: "34px",
                      height: "34px",
                      border: 0,
                      background: "transparent",
                      color: "#6d28d9",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                  >
                    <Ellipsis size={22} />
                  </button>
                </header>

                <section style={{ flex: 1, overflowY: "auto", padding: "18px 22px" }}>
                  {isLoading ? (
                    <p style={{ color: "#7c6b95", fontSize: "13px", textAlign: "center", marginTop: "48px" }}>
                      Loading messages...
                    </p>
                  ) : messages.length === 0 ? (
                    <div style={{ height: "100%", display: "grid", placeItems: "center", color: "#7c6b95" }}>
                      <div style={{ textAlign: "center" }}>
                        <MessageCircle size={36} strokeWidth={1.5} />
                        <p style={{ fontSize: "13px", margin: "10px 0 0" }}>
                          Start a conversation with {selectedContact.firstName || "this contact"}.
                        </p>
                      </div>
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <MessageBubble
                        key={msg.id}
                        message={msg}
                        contact={selectedContact}
                        isOwn={String(msg.senderId) === String(currentUserId)}
                      />
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </section>

                <footer
                  style={{
                    padding: "12px 22px 16px",
                    background: "#fbf8ff",
                    borderTop: "1px solid #ede9fe",
                  }}
                >
                  <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                    {["😀", "😮", "🤝", "😎", "😍", "🙂", "😇", "😁"].map((reaction) => (
                      <button
                        key={reaction}
                        type="button"
                        onClick={() => setNewMessage(`${newMessage}${reaction}`)}
                        aria-label={`Add ${reaction}`}
                        style={{
                          width: "25px",
                          height: "25px",
                          border: 0,
                          borderRadius: "50%",
                          background: "#fff",
                          boxShadow: "0 2px 8px rgba(124,58,237,0.12)",
                          cursor: "pointer",
                          fontSize: "14px",
                          lineHeight: 1,
                        }}
                      >
                        {reaction}
                      </button>
                    ))}
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "30px 30px minmax(0, 1fr) 58px",
                      alignItems: "center",
                      gap: "7px",
                    }}
                  >
                    <button type="button" aria-label="Attach file" style={iconButtonStyle}>
                      <Paperclip size={16} />
                    </button>
                    <button type="button" aria-label="Choose emoji" style={iconButtonStyle}>
                      <Smile size={16} />
                    </button>
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Write a message"
                      style={{
                        height: "36px",
                        minWidth: 0,
                        border: "1px solid #ddd6fe",
                        borderRadius: "3px",
                        background: "#fff",
                        padding: "0 12px",
                        color: "#21133f",
                        fontSize: "12px",
                        outline: "none",
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleSend}
                      disabled={!newMessage.trim()}
                      style={{
                        height: "36px",
                        border: 0,
                        borderRadius: "6px",
                        background: newMessage.trim() ? "#7c3aed" : "#ddd6fe",
                        color: "#fff",
                        fontSize: "12px",
                        fontWeight: 700,
                        cursor: newMessage.trim() ? "pointer" : "not-allowed",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "5px",
                      }}
                    >
                      <Send size={13} />
                      Send
                    </button>
                  </div>
                </footer>
              </>
            ) : (
              <div style={{ height: "100%", display: "grid", placeItems: "center", color: "#7c6b95" }}>
                <div style={{ textAlign: "center" }}>
                  <MessageCircle size={40} strokeWidth={1.5} />
                  <p style={{ color: "#2e1065", fontSize: "14px", fontWeight: 700, margin: "12px 0 4px" }}>
                    Select a message
                  </p>
                  <p style={{ fontSize: "12px", margin: 0 }}>Choose a contact from the left panel.</p>
                </div>
              </div>
            )}
          </main>

          <aside
            style={{
              borderLeft: "1px solid #ddd6fe",
              background: "#fff",
              padding: "18px",
              overflowY: "auto",
            }}
          >
            {selectedContact ? (
              <>
                <div
                  style={{
                    minHeight: "132px",
                    border: "1px solid #ddd6fe",
                    borderRadius: "4px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    marginBottom: "14px",
                  }}
                >
                  <span
                    style={{
                      width: "54px",
                      height: "54px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #ddd6fe, #a78bfa)",
                      color: "#4c1d95",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                    }}
                  >
                    {getInitials(selectedContact)}
                  </span>
                  <strong style={{ color: "#2e1065", fontSize: "14px" }}>{getFullName(selectedContact)}</strong>
                  <div style={{ display: "flex", gap: "8px", color: "#6d28d9" }}>
                    <CircleUserRound size={16} />
                    <AtSign size={16} />
                    <Building2 size={16} />
                  </div>
                </div>

                <p style={{ color: "#8b77a8", fontSize: "12px", lineHeight: 1.5, margin: "0 0 12px" }}>
                  {selectedContact.jobTitle || "Employee"} in {selectedContact.department || "the organization"}.
                  Connect here for updates, questions, and daily team communication.
                </p>

                <div style={{ display: "grid", gap: "7px", marginBottom: "18px" }}>
                  <span style={{ display: "inline-flex", gap: "8px", alignItems: "center", color: "#21133f", fontSize: "12px" }}>
                    <Mail size={15} color="#7c3aed" />
                    {selectedContact.email || "Email not available"}
                  </span>
                </div>

                <ProfileRow icon={MapPin} label="Location" value={selectedContact.location || "Not available"} />
                <ProfileRow icon={BriefcaseBusiness} label="Department" value={selectedContact.department || "General"} />
                <ProfileRow icon={BriefcaseBusiness} label="Role" value={selectedContact.jobTitle || "Employee"} />
                <ProfileRow icon={Building2} label="Company" value={selectedContact.company || "EMS"} />
                <ProfileRow icon={CalendarDays} label="Joined" value={formatDate(selectedContact.createdAt || selectedContact.joinedAt)} />
              </>
            ) : (
              <div style={{ height: "100%", display: "grid", placeItems: "center", color: "#a78bfa", textAlign: "center" }}>
                <p style={{ fontSize: "12px", margin: 0 }}>Contact details appear here.</p>
              </div>
            )}
          </aside>
        </div>
      </motion.div>
    </>
  );
}

const iconButtonStyle = {
  width: "30px",
  height: "30px",
  border: "1px solid #ddd6fe",
  borderRadius: "3px",
  background: "#fff",
  color: "#7c3aed",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  padding: 0,
};
