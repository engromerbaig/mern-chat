import { useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import MessageContainer from "../../components/messages/MessageContainer";
import Sidebar from "../../components/sidebar/Sidebar";
import useConversation from "../../zustand/useConversation";

const Home = () => {
	const { selectedConversation, setSelectedConversation } = useConversation();
	const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

	// Debugging: Check when a conversation is selected
	// useEffect(() => {
	// 	console.log("Selected Conversation:", selectedConversation);
	// }, [selectedConversation]);

	return (
		<div className='flex flex-col w-full md:w-1/2 md:flex-row h-screen sm:h-[450px] md:h-[550px] rounded-lg overflow-hidden bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0'>
			{isMobile ? (
				<MessageContainer showSidebar={!selectedConversation} />
			) : (
				<>
					<Sidebar />
					<MessageContainer />
				</>
			)}
		</div>
	);
};

export default Home;