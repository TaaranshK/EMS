import { API_BASE_URL } from "../config/api";

const BASE_URL = `${API_BASE_URL}/message`;


const getToken = () => localStorage.getItem("token");

//Get All Contacts
export const getContacts = async ()=> {
    const res = await fetch(`${BASE_URL}/contacts`, {
        headers: {Authorization: `Bearer ${getToken()}`},
    });
    return res.json();
};

//GET Conversation with a Specific USer
export const getConversation = async (otherUserId) => {
    const res = await fetch(`${BASE_URL}/conversation/${otherUserId}`,  {
        headers: {Authorization: `Bearer ${getToken()}`},
    });
    return res.json();
};

// Send a message
export const sendMessage = async (receiverId, content) => {
  const res = await fetch(`${BASE_URL}/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ receiverId, content }),
  });
  return res.json();
};