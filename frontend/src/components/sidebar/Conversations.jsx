import useGetConversations from "../../hooks/useGetConversations";
import Conversation from "./Conversation";
import { useSocketContext } from "../../context/SocketContext";

const Conversations = () => {
    const { loading, conversations } = useGetConversations();
    const { onlineUsers } = useSocketContext();

    // Function to sort conversations with online users first
    const sortedConversations = conversations.sort((a, b) => {
        const isAOnline = onlineUsers.includes(a._id);
        const isBOnline = onlineUsers.includes(b._id);

        if (isAOnline && !isBOnline) return -1; // a should come before b
        if (!isAOnline && isBOnline) return 1;  // b should come before a
        return 0; // maintain original order if both are either online or offline
    });

    return (
        <div className='py-2 flex flex-col overflow-auto'>
            {sortedConversations.map((conversation, idx) => (
                <Conversation
                    key={conversation._id}
                    conversation={conversation}
                    lastIdx={idx === sortedConversations.length - 1}
                />
            ))}

            {loading ? <span className='loading loading-spinner mx-auto'></span> : null}
        </div>
    );
};

export default Conversations;
