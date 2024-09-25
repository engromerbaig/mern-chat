import React, { useState, useRef, useEffect } from "react";
import { BsSend, BsMicFill, BsStopFill } from "react-icons/bs";
import { FaPaperclip } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
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

  const cancelAudio = () => {
    setAudioBlob(null);
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

        {/* File Attachment */}
        {file ? (
          <div className="absolute inset-y-0 right-16 flex items-center">
            <div className="bg-blue-500 text-white text-xs w-5 h-5 rounded-full flex justify-center items-center">
              1
            </div>
          </div>
        ) : !isRecording && (
          <button
            type="button"
            className="absolute inset-y-0 right-16 flex items-center pr-3 text-white"
            onClick={handleFileIconClick}
          >
            <FaPaperclip size={18} />
          </button>
        )}

        {/* Microphone Button */}
        {!file && !audioBlob && (
          <button
            type="button"
            className="absolute inset-y-0 right-10 flex items-center pr-3 text-white"
            onClick={isRecording ? stopRecording : startRecording}
          >
            {isRecording ? <BsStopFill size={18} /> : <BsMicFill size={18} />}
          </button>
        )}

        {/* Cancel Audio Button */}
        {audioBlob && (
          <button
            type="button"
            className="absolute inset-y-0 right-10 flex items-center pr-3 text-red-500"
            onClick={cancelAudio}
            title="Cancel audio"
          >
            <MdCancel size={18} />
          </button>
        )}

        <ReactMic
          record={isRecording}
          className="hidden"
          onStop={stopRecording}
          mimeType="audio/webm"
          strokeColor="#FF0000"
          backgroundColor="#000000"
        />

        {/* Send Button */}
        <button type='submit' className='absolute inset-y-0 right-0 flex items-center pr-3'>
          {loading ? (
            <div className='loading loading-spinner'></div>
          ) : (
            <BsSend className="text-white" />
          )}
        </button>
      </div>

      {/* Conditional Messages */}
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
