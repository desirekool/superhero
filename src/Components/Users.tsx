import { UsersLoader } from './Loaders';
import FlipMove from 'react-flip-move';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../Redux/store';
import UserHeaderProfile from './UserHeaderProfile';
import { setAlertProps } from '../Redux/userSlice';

type Props = {
  loading: boolean;  
}

const Users = ({loading}: Props) => {
  const users = useSelector((state: RootState) => state.user.users);
  const dispatch = useDispatch<AppDispatch>();
  const handleStartChat = (rId: string, rName: string) => {
    dispatch(setAlertProps({open: true, receiverId: rId, recieverName: rName}));
  }
  
  return loading ? (
    <UsersLoader />
  ) : users.length === 0 ? (
    <div className="p-10">
      No user registered apart from you, tell others to register and start
      chatting
    </div>
  ) : (
    <FlipMove className="flex-1 overflow-y-auto">
      {users.map((u) => (
        <UserHeaderProfile
          handleClick={() => handleStartChat(u.id, u.username)}
          key={u.id}
          user={u}
          otherUser
        />
      ))}
    </FlipMove>
  );  
};

export default Users;