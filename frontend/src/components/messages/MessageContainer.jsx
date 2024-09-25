import { useEffect } from "react";
import useConversation from "../../zustand/useConversation";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
import { TiMessages } from "react-icons/ti";
import { useAuthContext } from "../../context/AuthContext";
import Sidebar from "../sidebar/Sidebar";
import { IoArrowBack } from "react-icons/io5"; // Import the back arrow icon

const MessageContainer = ({ showSidebar }) => {
	const { selectedConversation, setSelectedConversation } = useConversation();
	const isMobile = window.innerWidth <= 768; // Simple mobile check

	useEffect(() => {
		// cleanup function (unmounts)
		return () => setSelectedConversation(null);
	}, [setSelectedConversation]);

	const handleBackClick = () => {
		setSelectedConversation(null);
	};

	if (showSidebar) {
		return <Sidebar />;
	}

	return (
		<div className='w-full  flex flex-col h-full'>
			{!selectedConversation ? (
				<NoChatSelected />
			) : (
				<>
					{/* Header with Back Button for Mobile */}
					<div className='bg-slate-500 px-4 py-2 mb-2 flex   items-center'>
						{isMobile && (
							<button onClick={handleBackClick} className="mr-2">
								<IoArrowBack size={24} />
							</button>
						)}
						<div>
							<span className='text-gray-900 font-bold capitalize	'>{selectedConversation.fullName}</span>
						</div>
					</div>
					<div className='flex-grow overflow-y-auto'>
						<Messages />
					</div>
					<MessageInput />
				</>
			)}
		</div>
	);
};

export default MessageContainer;

const NoChatSelected = () => {
	const { authUser } = useAuthContext();
	return (
		<div className='hidden md:flex items-center justify-center w-full h-full'>
			<div className='px-4 text-center sm:text-lg md:text-xl text-gray-200 font-semibold flex flex-col items-center gap-2'>
				<p>Welcome 👋 {authUser.fullName} ❄</p>
				<p>Select a chat to start messaging</p>
				<TiMessages className='text-3xl md:text-6xl text-center' />
			</div>
		</div>
	);
};