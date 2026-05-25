import { useEffect, useState, useRef } from "react"
import * as signalR from "@microsoft/signalr"
import { getContacts, getConversation, sendMessage } from "../services/messageService"

const useChat = () => {
    const [contacts , setContacts] = useState([]);
    const [selectedContact , setSelectedContact] = useState(null);
    const [messages , setMessages] = useState([]);
    const [newMessage , setNewMessage] = useState("");
    const [isLoading , setIsLoading] = useState(false);
    const connectionRef = useRef(null);

    // Define functions first
    const fetchContacts = async () => {
      try {
        const data = await getContacts();
        setContacts(data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchConversation = async () => {
      setIsLoading(true);
      try {
        const data = await getConversation(selectedContact.id);
        setMessages(data);

        // Reset unread count for selected contact
        setContacts((prev) =>
          prev.map((c) =>
            c.id === selectedContact.id ? { ...c, unreadCount: 0 } : c
          )
        );
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    const handleSend = async () => {
      if (!newMessage.trim() || !selectedContact) return;

      try {
        const sent = await sendMessage(selectedContact.id, newMessage.trim());
        setMessages((prev) => [...prev, sent]);
        setNewMessage("");

        // Update last message in contacts
        setContacts((prev) =>
          prev.map((c) =>
            c.id === selectedContact.id
              ? { ...c, lastMessage: newMessage.trim() }
              : c
          )
        );
      } catch (err) {
        console.error(err);
      }
    };

    //Setup SignalR Connection
    useEffect(() => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          console.warn("No token found for SignalR connection");
          return;
        }

        const connection = new signalR.HubConnectionBuilder()
          .withUrl("http://localhost:5261/hubs/chat", {
            accessTokenFactory: () => token,
          })
          .withAutomaticReconnect()
          .build(); 

        //Listen For Incoming Messages
        connection.on("ReceiveMessage" , (message) => {
         // Update last message in contacts list
        setContacts((prev) =>
          prev.map((c) =>
            c.id === message.senderId
              ? { ...c, lastMessage: message.content, unreadCount: c.unreadCount + 1 }
              : c
          )
        );
      }); 
        
        connection.start().catch((err) => console.error("SignalR error:", err));
        connectionRef.current = connection;

        return () => {
          if (connectionRef.current) {
            connectionRef.current.stop().catch(e => console.error("Error stopping SignalR:", e));
          }
        };
      } catch (error) {
        console.error("SignalR setup error:", error);
        return () => {};
      }
    }, []);

  //Load Contacts on Mount
  useEffect(() => {
    fetchContacts();
  }, []);

  // Load conversation when contact selected
  useEffect(() => {
    if (!selectedContact) return;
    fetchConversation();
  }, [selectedContact]);

  return {
    contacts,
    selectedContact,
    setSelectedContact,
    messages,
    newMessage,
    setNewMessage,
    isLoading,
    handleSend,
  };
};

export default useChat;
