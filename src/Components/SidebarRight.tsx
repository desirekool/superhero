import { useSelector } from "react-redux";
import Sidebar from "./Sidebar";
import { RootState } from "../Redux/store";


const SidebarRight = () => {

  const currentSelectedChat = useSelector((state: RootState) => state.chat.currentSelectedChat);
    const { id, email, img, isOnline, username, bio, lastSeen, creationTime } = currentSelectedChat;
  return (
    <Sidebar isRight>
      <div className="bg-gray-200 h-16 sticky top-10 flex items-center justify-center">
        {username && <p className="font-bold text-xl">{username}</p>}
      </div>
      {id ? (
        <div className="p-10 flex flex-col gap-10">
          <div className="relative self-center">
            <img
              src={img}
              alt={username}
              className="w-32 h-32 md:w-48 md:h-48 rounded-full p-[2px] ring-2 ring-gray-300 cursor-pointer hover:shadow-lg"
            />
            <span
              className={`absolute top-7 md:top-7 left-28  md:left-40 w-5 h-5 border-2 border-gray-800 rounded-full ${
                isOnline ? "bg-green-400" : "bg-gray-400"
              }`}
            ></span>
          </div>
          <div className="flex flex-col gap-5">
            <p className="text-gray-400">
              UserName: <span className="text-gray-900">{username}</span>
            </p>
            <hr />
            <p className="text-gray-400">
              Email: <span className="text-gray-900">{email}</span>
            </p>
            <hr />
            <p className="text-gray-400">
              Joined: <span className="text-gray-900">{creationTime}</span>
            </p>
            <hr />
            <p className="text-gray-400">
              Last Seen: <span className="text-gray-900">{lastSeen}</span>
            </p>
            <hr />

            <p className="text-gray-400 text-sm">
              Bio:{" "}
              <span className="text-gray-900">{bio ? bio : "No bio yet"}</span>
            </p>
          </div>
        </div>
      ) : (
        <div className="p-10">
          No chat selected yet, select a chat to see user details
        </div>
      )}
    </Sidebar>
  );
}

export default SidebarRight;