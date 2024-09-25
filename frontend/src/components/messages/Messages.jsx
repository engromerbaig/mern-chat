import { useEffect, useRef } from "react";
import useGetMessages from "../../hooks/useGetMessages";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import Message from "./Message";
import useListenMessages from "../../hooks/useListenMessages";
import { format } from "date-fns"; // For formatting dates

const Messages = () => {
	const { messages, loading } = useGetMessages();
	useListenMessages();
	const lastMessageRef = useRef();

	useEffect(() => {
		setTimeout(() => {
			lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
		}, 100);
	}, [messages]);

	// Helper function to check if two messages are from different days
	const isNewDay = (currentMessageDate, previousMessageDate) => {
		return format(currentMessageDate, "yyyy-MM-dd") !== format(previousMessageDate, "yyyy-MM-dd");
	};

	return (
		<div className='px-4 flex-1 overflow-auto'>
			{/* Loop through the messages */}
			{!loading &&
				messages.length > 0 &&
				messages.map((message, index) => {
					const currentMessageDate = new Date(message.createdAt);
					const previousMessageDate = index > 0 ? new Date(messages[index - 1].createdAt) : null;
					const showDate = !previousMessageDate || isNewDay(currentMessageDate, previousMessageDate);

					return (
						<div key={message._id} ref={index === messages.length - 1 ? lastMessageRef : null}>
							{/* Show date divider if it's a new day */}
							{showDate && (
								<div className='text-center text-white my-4'>
									{format(currentMessageDate, "EEEE, MMMM d, yyyy")} {/* Example: Monday, January 1, 2024 */}
								</div>
							)}
							<Message message={message} />
						</div>
					);
				})}

			{loading && [...Array(3)].map((_, idx) => <MessageSkeleton key={idx} />)}
			{!loading && messages.length === 0 && (
				<p className='text-center'>Send a message to start the conversation</p>
			)}
		</div>
	);
};

export default Messages;
