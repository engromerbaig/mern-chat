import { useAuthContext } from "../../context/AuthContext";
import { extractTime } from "../../utils/extractTime";
import useConversation from "../../zustand/useConversation";

const Message = ({ message }) => {
  const { authUser } = useAuthContext();
  const { selectedConversation } = useConversation();
  const fromMe = message.senderId === authUser._id;
  const formattedTime = extractTime(message.createdAt);
  const chatClassName = fromMe ? "chat-end" : "chat-start";
  const profilePic = fromMe ? authUser.profilePic : selectedConversation?.profilePic;
  const bubbleBgColor = fromMe ? "bg-blue-500" : "";
  const shakeClass = message.shouldShake ? "shake" : "";

  return (
    <div className={`chat ${chatClassName}`}>
      {/* User profile picture */}
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img alt="User avatar" src={profilePic} />
        </div>
      </div>

      {/* Message bubble */}
      <div className={`chat-bubble text-white ${bubbleBgColor} ${shakeClass} pb-2 max-w-[80%] break-words`}>
        {/* Check if message contains a file */}
        {message.fileUrl ? (
          <a
            href={message.fileUrl}   // URL to the file stored in Cloudinary
            download={message.originalFileName}  // Set the original file name for download
            className="underline text-blue-300 hover:text-blue-100"
          >
            {message.originalFileName}  {/* Display the original file name */}
          </a>
        ) : (
          message.message  // Render the text message if no file
        )}
      </div>

      {/* Message footer (time) */}
      <div className="chat-footer text-white text-xs flex gap-1 items-center">
        {formattedTime}
      </div>
    </div>
  );
};

export default Message;
