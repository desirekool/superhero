import { createSlice } from '@reduxjs/toolkit';
import { userType } from '../Types';

export const userStorageName = 'superhero_user';

export const defaultUser = {
  id: '',
  username: '',
  email: '',
  isOnline: false,
  img: '',
  creationTime: '',
  lastSeen: '',
  bio: '',
};
type userStateType = {
  currentUser: userType;
  users: userType[];
  alertProps: {
    open: boolean;
    receiverId: string;
    recieverName: string;
  };
};

export const initialState: userStateType = {  
  currentUser: defaultUser,
  users: [],
  alertProps: {
    open: false,
    receiverId: '',
    recieverName: '',
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      const user = action.payload;
      localStorage.setItem(userStorageName, JSON.stringify(user));
      state.currentUser = user;      
    },
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    setAlertProps: (state, action) => {
      const {open, receiverId, recieverName} = action.payload;
      state.alertProps = {
        open, 
        receiverId: receiverId || '',
        recieverName: recieverName || '',

      };
    }
  },
});

export const { setUser, setUsers, setAlertProps } = userSlice.actions;
export default userSlice.reducer;
