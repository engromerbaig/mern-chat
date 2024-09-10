import { useState, useRef } from "react";
import { BsSend } from "react-icons/bs";
import { FaPaperclip } from "react-icons/fa";  // Import file icon
import useSendMessage from "../../hooks/useSendMessage";

const MessageInput = () => {
  const [message, setMessage] = useState("");  // Message state
  const [file, setFile] = useState(null);      // File state
  const { loading, sendMessage } = useSendMessage();

  // Create a reference for the hidden file input
  const fileInputRef = useRef(null);

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

  // Trigger the hidden file input when the file icon is clicked
  const handleFileIconClick = () => {
    fileInputRef.current.click();  // Programmatically click the hidden file input
  };

  return (
    <form className='px-4 my-3' onSubmit={handleSubmit}>
      <div className='w-full relative flex items-center'>
        <input
          type='text'
          className='border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 text-white'
          placeholder='Send a message'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}  // Reference to the file input
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Conditionally display file count or paperclip icon */}
        {file ? (
          <div className="absolute inset-y-0 right-16 flex items-center">
            <div className="bg-blue-500 text-white text-xs w-5 h-5 rounded-full flex justify-center items-center">
              1  {/* Always 1 because only one file is allowed */}
            </div>
          </div>
        ) : (
          <button
            type="button"
            className="absolute inset-y-0 right-10 flex items-center pr-3 text-white"
            onClick={handleFileIconClick}  // Trigger file input click
          >
            <FaPaperclip size={18} />
          </button>
        )}

        {/* Send Button */}
        <button type='submit' className='absolute inset-y-0 right-0 flex items-center pr-3'>
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
