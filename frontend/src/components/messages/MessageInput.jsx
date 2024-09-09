// frontend/src/components/messages/MessageInput.jsx
import { useState } from "react";
import { BsSend } from "react-icons/bs";
import useSendMessage from "../../hooks/useSendMessage";

const MessageInput = () => {
  const [message, setMessage] = useState("");  // Message state
  const [file, setFile] = useState(null);      // File state
  const { loading, sendMessage } = useSendMessage();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message && !file) return;  // Ensure at least one is present

    await sendMessage(message, file);  // Send message and file
    setMessage("");                    // Clear message input
    setFile(null);                     // Clear file input
  };

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);  // Set selected file in state
  };

  return (
    <form className='px-4 my-3' onSubmit={handleSubmit}>
      <div className='w-full relative'>
        <input
          type='text'
          className='border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 text-white'
          placeholder='Send a message'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        {/* File Input for uploading files */}
        <input 
          type="file"
          className="block w-full mt-2"
          onChange={handleFileChange}
        />

        {/* Display selected file name (optional) */}
        {file && <div className="text-white text-sm mt-2">Selected file: {file.name}</div>}

        {/* Send Button */}
        <button type='submit' className='absolute inset-y-0 end-0 flex items-center pe-3'>
          {loading ? (
            <div className='loading loading-spinner'></div>
          ) : (
            <BsSend className="text-white" />
          )}
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
