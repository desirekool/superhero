import { useEffect, useState } from "react";
import { chatType, userType } from "../Types";
import { useDispatch, useSelector } from "react-redux";
import { defaultUser } from "../Redux/userSlice";
import { AppDispatch, RootState } from "../Redux/store";
import {getUserInfo, iCreatedChat } from "../Backend/Queries";
import UserHeaderProfile from "./UserHeaderProfile";
import { setCurrentSelectedChat, setRightSidebarOpen } from "../Redux/chatSlice";
import { toastError } from "../utils/toast";


type ChatsProfileType = {
  userId?:string;
  chat:chatType;
}

const ChatsProfile = ({userId, chat} : ChatsProfileType) => {
  const [userLoading, setUserLoading] = useState(false);
  const [user, setUser] = useState<userType>(defaultUser);
  const dispatch = useDispatch<AppDispatch>();
  const currentSelectedChat = useSelector((state: RootState) => state.chat.currentSelectedChat);  

  const {
    id:chatId,
    senderId,
    lastMsg,
    senderToRecieverMsgCount,
    recieverToSenderMsgCount,
  } = chat;

  useEffect(() => {
    const get = async () => {
      if (userId) {
        const usr = await getUserInfo(userId, setUserLoading);
        setUser(usr);
      } else toastError("Chats:Profile: user not found");
    };
    get();
  }, [userId]);

  const handleSelectedChat = () => {
    dispatch(setCurrentSelectedChat(
      {
        ...user,
        chatId,
        senderToRecieverMsgCount,
        recieverToSenderMsgCount,
      }
    ));
    
    dispatch(setRightSidebarOpen());
  }

  return (
    <UserHeaderProfile
      handleClick={handleSelectedChat}
      user={user}
      otherUser
      loading={userLoading}
      lastMsg= {lastMsg || "last message"}
      isSelected={userId === currentSelectedChat.id}
      newMsgCount={iCreatedChat(senderId) ? recieverToSenderMsgCount : senderToRecieverMsgCount}      
    />

  );
};

export default ChatsProfile;