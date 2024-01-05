import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "./Firebase";
import { authDataType, setLoadingType, taskListType, taskType, userType } from "../Types";
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

import { NavigateFunction } from "react-router-dom";
import { AppDispatch } from "../Redux/store";
import { addTaskList, defaultTask, defaultTaskList, setTaskList, saveTaskListTitle, deleteTaskList, deleteTask, addTask } from "../Redux/taskListSlice";
import { defaultUser, setUser, userStorageName } from "../Redux/userSlice";
import { toastError } from "../utils/toast";
import CatchErr from "../utils/catchErr";
import ConvertTime from "../utils/ConvertTime";
import AvatarGenerator from "../utils/AvatarGenerator";
import { LoremIpsum } from "lorem-ipsum";

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
    bio: `Hi! my name is ${username}, I'm confortable working with React and Typescript. I can also build beautiful user interfaces`,
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

// TaskList Querries
export const BE_addTaskList = async (dispatch:AppDispatch, setLoading: setLoadingType) => {
  setLoading(true);
  const { title } = defaultTaskList;
  const taskListRef = collection(db, taskListColl);
  const list = await addDoc(taskListRef, {
    title,    
    userId: getStorageUser().id,    
  });
  const newDocSnap = await getDoc(doc(db, list.path));
  if(newDocSnap.exists()) {
    const newlyAddedDoc: taskListType = {
      id: newDocSnap.id,
      title: newDocSnap.data().title,
    };
  
    dispatch(addTaskList(newlyAddedDoc));
    setLoading(false);
  } else {
    toastError('BE_addTaskList: doc not found', setLoading);
  }

  setLoading(false);
  console.log(list.path);
};

export const BE_getTaskLists = async (dispatch:AppDispatch, setLoading: setLoadingType) => {
  setLoading(true);
  const tasksList = await getAllTasksList();
  dispatch(setTaskList(tasksList));
  setLoading(false);
};

const getAllTasksList = async () => {
  const taskListRef = collection(db, taskListColl);
  const q = query(taskListRef, where("userId", "==", getStorageUser().id));
  const querySnapshot = await getDocs(q);
  const taskLists:taskListType[] = [];
  querySnapshot.forEach((doc) => {
    taskLists.push({
      id: doc.id,
      title: doc.data().title,
      editMode: false,
      tasks: [],
    });
  });
  return taskLists;
};

export const BE_saveTaskList = async (dispatch: AppDispatch, setLoading: setLoadingType, listId: string, title: string) => {
  setLoading(true);
  const taskListRef = doc(db, taskListColl, listId);
  await updateDoc(taskListRef, {
    title,
  });
  const updatedTaskList = await getDoc(taskListRef);
  setLoading(false);
  dispatch(saveTaskListTitle({id: updatedTaskList.id, ...updatedTaskList.data()}));
};

export const BE_deleteTaskList = async (dispatch: AppDispatch, listId: string, tasks: taskType[], setLoading?: setLoadingType) => {
  if(setLoading) setLoading(true);
  if(tasks.length > 0) {
    for (let i = 0; i < tasks.length; i++) {
      const {id} = tasks[i];
      if(id) BE_deleteTask(dispatch, id, listId);
    }
  }
  const taskListRef = doc(db, taskListColl, listId);
  await deleteDoc(taskListRef);
  const deletedTaskList = await getDoc(taskListRef);
  if(!deletedTaskList.exists()) {
    if(setLoading) setLoading(false);
    dispatch(deleteTaskList(listId));
  }
};


// -------------------------------- FOR TASK -------------------------------
export const BE_deleteTask = async (dispatch: AppDispatch, taskId: string, listId: string, setLoading?: setLoadingType) => {
  if(setLoading) setLoading(true);
  const taskRef = doc(db, taskListColl, listId, tasksColl, taskId);
  await deleteDoc(taskRef);
  const deletedTask = await getDoc(taskRef);
  if (!deletedTask.exists()) {
    if (setLoading) setLoading(false);
    dispatch(deleteTask({ listId, taskId }));
  }
};

export const BE_addTask = async (dispatch: AppDispatch, setLoading: setLoadingType, listId: string) => {
  setLoading(true);
  const taskRef = collection(db, taskListColl, listId, tasksColl);
  const newTask = await addDoc(taskRef, {
    ...defaultTask,
    userId: getStorageUser().id,
  });
  const newTaskSnap = await getDoc(doc(db, taskListColl, listId, tasksColl, newTask.id));
  if (newTaskSnap.exists()) {
    const {title, description} = newTaskSnap.data();
    const newlyAddedTask: taskType = {
      id: newTaskSnap.id,
      title: title,      
      description: description,      
    };
    dispatch(addTask({ listId, task: newlyAddedTask }));
    setLoading(false);
  } else {
    toastError("BE_addTask: doc not found", setLoading);
  }
  setLoading(false);
};

