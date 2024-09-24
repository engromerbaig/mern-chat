import { useState, useRef, useEffect } from "react";
import { BsSend, BsMicFill, BsMicMuteFill } from "react-icons/bs";
import { FaPaperclip } from "react-icons/fa";
import { ReactMic } from 'react-mic'; // Import ReactMic for recording
import useSendMessage from "../../hooks/useSendMessage";

const MessageInput = () => {
  const [message, setMessage] = useState(""); // Message state
  const [file, setFile] = useState(null); // File state
  const [isRecording, setIsRecording] = useState(false); // Recording state
  const [recordedBlob, setRecordedBlob] = useState(null); // Blob for recorded audio
  const [hasPermission, setHasPermission] = useState(false); // Permission state
  const { loading, sendMessage } = useSendMessage();

  // Reference for the hidden file input
  const fileInputRef = useRef(null);

  // Request microphone permissions when the component mounts
  useEffect(() => {
    // Check for microphone permissions
    const requestMicrophonePermission = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setHasPermission(true);
        console.log("Microphone permission granted");
      } catch (error) {
        console.error("Microphone permission denied", error);
        setHasPermission(false);
      }
    };

    requestMicrophonePermission();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure either message, file, or recorded audio is provided
    if (!message && !file && !recordedBlob) {
      console.log("Nothing to send");
      return;
    }

    // Send the recorded audio blob or file
    await sendMessage(message, file || recordedBlob);
    setMessage(""); // Clear message input
    setFile(null); // Clear file input
    setRecordedBlob(null); // Clear recorded audio
  };

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Set selected file in state
  };

  // Trigger file input when the file icon is clicked
  const handleFileIconClick = () => {
    fileInputRef.current.click(); // Programmatically click the hidden file input
  };

  // Start recording with mic
  const startRecording = () => {
    if (!hasPermission) {
      alert("Please enable microphone permissions to record audio.");
      return;
    }
    setIsRecording(true);
    console.log("Recording started");
  };

  // Stop recording and store the blob for sending
  const stopRecording = (recordedBlob) => {
    setIsRecording(false);
    setRecordedBlob(recordedBlob.blob); // Save recorded audio
    console.log("Recording stopped, blob saved:", recordedBlob.blob); // Log the blob for debugging
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
          ref={fileInputRef} // Reference to the file input
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Display file count or paperclip icon */}
        {file ? (
          <div className="absolute inset-y-0 right-16 flex items-center">
            <div className="bg-blue-500 text-white text-xs w-5 h-5 rounded-full flex justify-center items-center">
              1 {/* One file is selected */}
            </div>
          </div>
        ) : (
          <button
            type="button"
            className="absolute inset-y-0 right-16 flex items-center pr-3 text-white"
            onClick={handleFileIconClick} // Trigger file input click
          >
            <FaPaperclip size={18} />
          </button>
        )}

        {/* Mic Button */}
        <button
          type="button"
          className="absolute inset-y-0 right-10 flex items-center pr-3 text-white"
          onClick={isRecording ? () => setIsRecording(false) : startRecording} // Toggle recording
        >
          {isRecording ? <BsMicMuteFill size={18} /> : <BsMicFill size={18} />}
        </button>

        {/* Voice Recorder */}
        {isRecording && (
          <ReactMic
            record={isRecording}
            className="mic-visualizer" // Add a class for visual feedback (optional)
            onStop={stopRecording} // When recording stops, capture the audio
            mimeType="audio/webm" // Specify the MIME type for audio
            strokeColor="#FF0000" // Visual feedback (optional)
            backgroundColor="#000000"
          />
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

      {/* Display recording status */}
      {isRecording && (
        <p className="text-red-500 text-sm mt-2">Recording in progress...</p>
      )}

      {/* Display recorded blob (for debugging or user feedback) */}
      {recordedBlob && (
        <p className="text-green-500 text-sm mt-2">Audio ready to send</p>
      )}
    </form>
  );
};

export default MessageInput;
