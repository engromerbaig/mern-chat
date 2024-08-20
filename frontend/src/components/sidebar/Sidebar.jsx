import Conversations from "./Conversations";
import LogoutButton from "./LogoutButton";
import SearchInput from "./SearchInput";
import LoggedUser from "./LoggedUser";
const Sidebar = () => {


	return (
		<div className='border-r border-slate-500 p-2 flex flex-col overflow-hidden'>
			
			<LoggedUser />
			<SearchInput />
			<div className='divider px-3'></div>
			<Conversations />
			<LogoutButton />
		</div>
	);
};
export default Sidebar;

