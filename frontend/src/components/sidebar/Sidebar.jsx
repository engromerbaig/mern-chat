import Conversations from "./Conversations";
import LogoutButton from "./LogoutButton";
import SearchInput from "./SearchInput";
import LoggedUser from "./LoggedUser";
const Sidebar = () => {


	return (
		<div className='border-r w-1/4 border-slate-500  flex flex-col overflow-hidden'>
			
			<LoggedUser />
			<SearchInput />
			<div className='divider px-3'></div>
			<Conversations />
			<LogoutButton />
		</div>
	);
};
export default Sidebar;

