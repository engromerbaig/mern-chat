import { useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import useConversation from "../../zustand/useConversation";
import useGetConversations from "../../hooks/useGetConversations";
import toast from "react-hot-toast";

const SearchInput = () => {
	const [search, setSearch] = useState("");
	const { setSelectedConversation } = useConversation();
	const { conversations } = useGetConversations();

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!search) return;
		if (search.length < 3) {
			return toast.error("Search term must be at least 3 characters long");
		}

		const conversation = conversations.find((c) =>
			c.fullName.toLowerCase().includes(search.toLowerCase())
		);

		if (conversation) {
			setSelectedConversation(conversation);
			setSearch("");
		} else toast.error("No such user found!");
	};

	return (
		<form onSubmit={handleSubmit} className='flex items-center py-4 gap-2'>
			<div className='relative w-full'>
				<input
					type='text'
					placeholder='Search'
					className='input input-bordered rounded-lg bg-gray-200 h-3/4 pl-10 w-full'
					value={search}
					onChange={(e) => setSearch(e.target.value)}
				/>
				<IoSearchSharp className='absolute left-3 top-1/2 transform -translate-y-1/2 text-md text-gray-700' />
			</div>
		</form>
	);
};

export default SearchInput;
