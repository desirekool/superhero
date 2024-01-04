import { userType } from "../Types";

type UserHeaderProfileProps = {
  user: userType;
  handleClick?: () => void;
}

const UserHeaderProfile = ({user, handleClick}: UserHeaderProfileProps) => {

  // const { user } = useAuth();
  // const { logout } = useAuthActions();

  return (
    <div onClick={handleClick} className="flex items-center space-x-4 cursor-pointer">
      <div className="relative">
        <img src={"https://api.multiavatar.com/obendesmond.png"} alt="user profile" className="w-11 h-11 rounded-full ring-2 ring-white p-[2px]" />
        <span className="-top-1 left-7 absolute w-4 h-4 border-2 border-gray-800 rounded-full bg-green-400"></span>
      </div>
      <div className="hidden md:block">
        <div className="-mb-1">{user.username}</div>
        <div className="tetxt-sm text-gray-300 ">Joined in {user.creationTime}</div>
      </div>
    </div>
  );
};

export default UserHeaderProfile;