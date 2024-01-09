import { useDispatch, useSelector } from 'react-redux';
import Sidebar from './Sidebar';
import { AppDispatch, RootState } from '../Redux/store';
import {setCurrentSelectedChat, setIsChatsTab} from '../Redux/chatSlice';
import Chats from './Chats';
import Users from './Users';
import { useEffect, useState } from 'react';
import { BE_getAllUsers } from '../Backend/Queries';
import { defaultUser } from '../Redux/userSlice';


const SidebarLeft = () => {

  const [usersLoading, setUsersLoading] = useState(false);
  const isChatsTab = useSelector ((state: RootState) => state.chat.isChatsTab);
  const rightSidebarOpen = useSelector((state: RootState) => state.chat.rightSidebarOpen);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {	
    const get = async () => {
      await BE_getAllUsers(dispatch, setUsersLoading);
    };
    get();
  }, []);

  const handleSelectUsersTab = () => {
    dispatch(setIsChatsTab(false));
    dispatch(setCurrentSelectedChat(defaultUser));
  }

  return (
    <Sidebar
      className={`flex-[0.8] absolute md:relative z-10 md:z-0 w-[80%] h-[80%] md:h-full md:w-full ${
        rightSidebarOpen
          ? "translate-x-0"
          : "-translate-x-full md:translate-x-0"
      }`}
    >
      <div className="flex flex-col">
        <div className="flex sticky top-0 z-10">
          <p
            onClick={() => dispatch(setIsChatsTab(true))}
            className={`p-5 flex-1 text-center font-bold cursor-pointer ${
              isChatsTab
                ? "bg-gradient-to-r from-myBlue to-myPink text-white"
                : "bg-gray-200 text-gray-900"
            }`}
          >
            Chats
          </p>
          <p
            onClick={handleSelectUsersTab}
            className={`p-5 flex-1 text-center font-bold cursor-pointer ${
              !isChatsTab
                ? "bg-gradient-to-r from-myBlue to-myPink text-white"
                : "bg-gray-200 text-gray-900"
            }`}
          >
            Users
          </p>
        </div>
        <div className="flex-1 flex flex-col py-2 max-h-full overflow-auto">
          {isChatsTab ? <Chats /> : <Users loading={usersLoading} />}
        </div>
      </div>
    </Sidebar>
  );
}

export default SidebarLeft;