import React, { useState, useRef, useEffect } from "react";
import { BsSend, BsMicFill, BsMicMuteFill } from "react-icons/bs";
import { FaPaperclip } from "react-icons/fa";
import { ReactMic } from 'react-mic';
import useSendMessage from "../../hooks/useSendMessage";

const MessageInput = () => {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [hasPermission, setHasPermission] = useState(false);
  const { loading, sendMessage } = useSendMessage();
  const fileInputRef = useRef(null);

  useEffect(() => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message && !file && !audioBlob) {
      console.log("Nothing to send");
      return;
    }

    let fileToSend = file;
    if (audioBlob) {
      // Create a File object from the audio blob
      fileToSend = new File([audioBlob], "voice_message.webm", { type: "audio/webm" });
    }

    await sendMessage(message, fileToSend);
    setMessage("");
    setFile(null);
    setAudioBlob(null);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileIconClick = () => {
    fileInputRef.current.click();
  };

  const startRecording = () => {
    if (!hasPermission) {
      alert("Please enable microphone permissions to record audio.");
      return;
    }
    setIsRecording(true);
    console.log("Recording started");
  };

  const stopRecording = (recordedBlob) => {
    setIsRecording(false);
    setAudioBlob(recordedBlob.blob);
    console.log("Recording stopped, blob saved:", recordedBlob.blob);
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

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />

        {(file || audioBlob) ? (
          <div className="absolute inset-y-0 right-16 flex items-center">
            <div className="bg-blue-500 text-white text-xs w-5 h-5 rounded-full flex justify-center items-center">
              1
            </div>
          </div>
        ) : (
          <button
            type="button"
            className="absolute inset-y-0 right-16 flex items-center pr-3 text-white"
            onClick={handleFileIconClick}
          >
            <FaPaperclip size={18} />
          </button>
        )}

        <button
          type="button"
          className="absolute inset-y-0 right-10 flex items-center pr-3 text-white"
          onClick={isRecording ? () => setIsRecording(false) : startRecording}
        >
          {isRecording ? <BsMicMuteFill size={18} /> : <BsMicFill size={18} />}
        </button>

        <ReactMic
          record={isRecording}
          className="hidden"
          onStop={stopRecording}
          mimeType="audio/webm"
          strokeColor="#FF0000"
          backgroundColor="#000000"
        />

        <button type='submit' className='absolute inset-y-0 right-0 flex items-center pr-3'>
          {loading ? (
            <div className='loading loading-spinner'></div>
          ) : (
            <BsSend className="text-white" />
          )}
        </button>
      </div>

      {isRecording && (
        <p className="text-red-500 text-sm mt-2">Recording in progress...</p>
      )}

      {audioBlob && (
        <p className="text-green-500 text-sm mt-2">Audio ready to send</p>
      )}
    </form>
  );
};

export default MessageInput;