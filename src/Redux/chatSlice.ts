import { createSlice } from "@reduxjs/toolkit";
import { chatType, messageType, userType } from "../Types";
import { defaultUser } from "./userSlice";
import { iCreatedChat } from "../Backend/Queries";

type chatStateType = {
  chats: chatType[];
  isChatsTab: boolean;
  currentSelectedChat: userType & {
    chatId?: string;
    senderToRecieverMsgCount?: number;
    recieverToSenderMsgCount?: number;
  };
  rightSidebarOpen: boolean;
  currentMessages: messageType[];
  hasNewMessage: boolean;  
}

const initialState: chatStateType = {
  chats: [],
  isChatsTab: false,
  currentSelectedChat: defaultUser,
  rightSidebarOpen: true,
  currentMessages: [],
  hasNewMessage: false,
}

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setIsChatsTab:(state, action: {payload: boolean, type: string}) => {
      state.isChatsTab = action.payload;
    },
    setCurrentSelectedChat: (state, action) => {
      state.currentSelectedChat = action.payload;      
    },
    setChats: (state, action) => {
      const chats = action.payload;
      const newMsgCount = chats.reduce((acc: number, chat: chatType) => {
        if(iCreatedChat(chat.senderId)){
          return acc + (chat.recieverToSenderMsgCount || 0)
        } else return acc + (chat.senderToRecieverMsgCount || 0);
      }, 0);
      state.hasNewMessage = newMsgCount > 0;
      state.chats = chats;
    },
    setRightSidebarOpen: (state) => {
      state.rightSidebarOpen = !state.rightSidebarOpen;
    },
    setCurrentMessages: (state, action) => {
      state.currentMessages = action.payload;
    },
  },
});

export const { setIsChatsTab, setCurrentSelectedChat, setChats, setRightSidebarOpen, setCurrentMessages } = chatSlice.actions;
export default chatSlice.reducer;