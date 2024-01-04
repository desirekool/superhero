import { createSlice } from '@reduxjs/toolkit';

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

export const initialState = {
  // user: [],
  currentUser: defaultUser,
  users: null
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
  },
});

export const { setUser, setUsers } = userSlice.actions;
export default userSlice.reducer;
