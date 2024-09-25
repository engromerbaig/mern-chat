import React, { useState, useRef, useEffect } from "react";
import { BsSend, BsMicFill, BsStopFill, BsPlayFill, BsPauseFill } from "react-icons/bs";
import { FaPaperclip } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { ReactMic } from 'react-mic';
import useSendMessage from "../../hooks/useSendMessage";

const MessageInput = () => {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const { loading, sendMessage } = useSendMessage();
  const fileInputRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    const requestMicrophonePermission = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setHasPermission(true);
      } catch (error) {
        console.error("Microphone permission denied", error);
        setHasPermission(false);
      }
    };

    requestMicrophonePermission();
  }, []);

  useEffect(() => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [audioBlob]);

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
    setAudioUrl(null);
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
  };

  const stopRecording = (recordedBlob) => {
    setIsRecording(false);
    setAudioBlob(recordedBlob.blob);
  };

  const cancelAudio = () => {
    setAudioBlob(null);
    setAudioUrl(null);
  };

  const toggleAudioPlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
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
        ) : !isRecording && !audioUrl && (
          <button
            type="button"
            className="absolute inset-y-0 right-16 flex items-center pr-3 text-white"
            onClick={handleFileIconClick}
          >
            <FaPaperclip size={18} />
          </button>
        )}

        {/* Microphone Button */}
        {!file && !audioUrl && (
          <button
            type="button"
            className="absolute inset-y-0 right-10 flex items-center pr-3 text-white"
            onClick={isRecording ? stopRecording : startRecording}
          >
            {isRecording ? <BsStopFill size={18} /> : <BsMicFill size={18} />}
          </button>
        )}

        {/* Audio Preview */}
        {audioUrl && (
          <div className="absolute inset-y-0 right-10 flex items-center pr-3">
            <button
              type="button"
              className="text-white mr-2"
              onClick={toggleAudioPlayback}
            >
              {isPlaying ? <BsPauseFill size={18} /> : <BsPlayFill size={18} />}
            </button>
            <button
              type="button"
              className="text-red-500"
              onClick={cancelAudio}
              title="Cancel audio"
            >
              <MdCancel size={18} />
            </button>
            <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} />
          </div>
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
    </form>
  );
};

export default MessageInput;