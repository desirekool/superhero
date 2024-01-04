import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "./Firebase";
import { authDataType, setLoadingType, userType } from "../Types";
import { NavigateFunction } from "react-router-dom";
import { LoremIpsum } from "lorem-ipsum";
import {
  addDoc,
  and,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  or,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "@firebase/firestore";

import { AppDispatch } from "../Redux/store";
import {
  defaultUser,  
  setUser,
  userStorageName,  
} from "../Redux/userSlice";
import { toastError } from "../utils/toast";
import CatchErr from "../utils/catchErr";
import ConvertTime from "../utils/ConvertTime";
import AvatarGenerator from "../utils/AvatarGenerator";

// collection names
const usersColl = "users";
const tasksColl = "tasks";
const taskListColl = "taskList";
const chatsColl = "chats";
const messagesColl = "messages";

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4
  },
  wordsPerSentence: {
    max: 16,
    min: 4
  }
});

export const BE_signUp = (
  data: authDataType, 
  setLoading: setLoadingType,
  reset: () => void, 
  goTo: NavigateFunction,
  dispatch: AppDispatch
  ) => {
  const { email, password, confirmPassword } = data;
    setLoading(true);
    if(email && password ) {
      if(password === confirmPassword) {
        createUserWithEmailAndPassword(auth, email, password)
        .then(async ({user}) => {
          const imgLink = AvatarGenerator(user.email?.split("@")[0]);
          const userInfo =await  addUserToCollection(user.uid, user.email || "", user.email?.split('@')[0] || "", imgLink);
          dispatch(setUser(userInfo));
          setLoading(false);
          reset();
          goTo('/dashboard');
        })
        .catch(error => {
          CatchErr(error.code);          
          setLoading(false);
        });        
      } else {
        toastError('Passwords must match', setLoading);
      }      
    } else {
      
      toastError("Fields shouldn't be left empty", setLoading);
    }

}; // end of BE_signUp  function

export const BE_signIn = (data: authDataType, setLoading: setLoadingType, reset: () => void, goTo: NavigateFunction, dispatch: AppDispatch) => {
  const { email, password } = data;
  setLoading(true);
  if(email && password) {
    signInWithEmailAndPassword(auth, email, password)
    .then(async ({user}) => {
      // Signed in 
      // todo: set user online to true
      await updateUserInfo({id: user.uid, isOnline: true});      
      const userInfo = await getUserInfo(user.uid);
      dispatch(setUser(userInfo));

      // console.log(user);
      setLoading(false);
      reset();
      goTo('/dashboard');
    })
    .catch(error => {
      // console.log(error);
      CatchErr(error.code);
      setLoading(false);
    });
  } else {
    toastError("Fields shouldn't be left empty");
  }
}; // end of BE_signIn function

const addUserToCollection = async (id:string, email:string, username:string, img:string) => {
  await setDoc(doc(db, usersColl, id), {
    isOnline: true,
    img,
    username,
    email,
    creationTime: serverTimestamp(),
    lastSeen: serverTimestamp(),
    bio: lorem.generateParagraphs(1),
  });

  // return user info; 
  return getUserInfo(id);
};

const getUserInfo = async (id:string): Promise< userType> => {
  
  const userRef = doc(db, usersColl, id);
  const userSnap = await getDoc(userRef);
  if(userSnap.exists()) {
    const {img, isOnline, username, email, creationTime, lastSeen, bio} = userSnap.data();
    return {
      id: userSnap.id,
      username,
      email,
      isOnline,
      img,
      creationTime: creationTime ? ConvertTime(creationTime.toDate().toString()) : 'no date yet: userinfo',
      lastSeen: lastSeen ? ConvertTime(lastSeen.toDate().toString()) : 'no date yet: userinfo',
      bio,
    };
  } else {
    toastError('getUserInfo: User not found');
    return defaultUser;
  }
};

// update user info
const updateUserInfo = async ({
  id,
  username,
  img,
  isOnline,
  isOffline,
}: {
  id?: string;
  username?: string;
  img?: string;
  isOnline?: boolean;
  isOffline?: boolean;
}) => {
  if (!id) {
    id = getStorageUser().id;
  }

  if (id) {
    await updateDoc(doc(db, usersColl, id), {
      ...(username && { username }),
      ...(isOnline && { isOnline }),
      ...(isOffline && { isOnline: false }),
      ...(img && { img }), // img:"someimage"
      lastSeen: serverTimestamp(),
    });
  }
};

export const getStorageUser = (): userType => {
  const user = localStorage.getItem(userStorageName);
  if (user) {
    return JSON.parse(user);
  } else {
    return defaultUser;
  }
};

export const BE_signOut = (
  dispatch: AppDispatch,
  goTo: NavigateFunction,
  setLoading: setLoadingType,
  deleteAcc?: boolean
) => {
  setLoading(true);  
  signOut(auth)
    .then(async () => {
      if (!deleteAcc) await updateUserInfo({ isOffline: true });
      dispatch(setUser(defaultUser));
      localStorage.removeItem(userStorageName);
      goTo("/auth");
      setLoading(false);
    })
    .catch((err) => CatchErr(err));
};
