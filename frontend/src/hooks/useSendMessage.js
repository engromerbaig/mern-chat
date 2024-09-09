import { useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";

const useSendMessage = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();

  // Modified sendMessage to accept both text and file
  const sendMessage = async (message, file = null) => {
	setLoading(true);
	try {
	  const formData = new FormData();
	  formData.append('message', message); // Append the text message
	  if (file) {
		formData.append('file', file); // Append the file (if exists)
	  }
  
	  const res = await fetch(`/api/messages/send/${selectedConversation._id}`, {
		method: 'POST',
		body: formData, // No need for 'Content-Type', fetch will handle it
	  });
  
	  // Ensure the response is parsed as JSON
	  const data = await res.json();
	  if (data.error) throw new Error(data.error);
  
	  setMessages([...messages, data]);
	} catch (error) {
	  toast.error(error.message);
	} finally {
	  setLoading(false);
	}
  };
  

  return { sendMessage, loading };
};

export default useSendMessage;
