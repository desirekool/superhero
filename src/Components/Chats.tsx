import { RootState } from '../Redux/store';
import { useSelector } from 'react-redux';
import ChatsProfile from './ChatsProfile';
import { iCreatedChat } from '../Backend/Queries';
import { chatType } from '../Types';

const Chats = () => {
  const chats = useSelector((state: RootState) => state.chat.chats);
  
  return chats.length === 0 ? (
    <div className="p-10">
      No chats yet for you, chose a user and start chatting!
    </div>
  ) : (
    <>    
      {chats.map((chat: chatType) => (
        <ChatsProfile
          key={chat.id}
          chat={chat}
          userId={iCreatedChat(chat.senderId) ? chat.receiverId : chat.senderId}        
        />
      ))}
    </>    
    
  );  
}

export default Chats;