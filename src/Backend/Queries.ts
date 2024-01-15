import { createUserWithEmailAndPassword, deleteUser, signInWithEmailAndPassword, signOut, updateEmail, updatePassword } from "firebase/auth";
import { auth, db } from "./Firebase";
import { authDataType, chatType, messageType, setLoadingType, taskListType, taskType, userType } from "../Types";
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
import { addTaskList, defaultTask, defaultTaskList, setTaskList, saveTaskListTitle, deleteTaskList, deleteTask, addTask, saveTask, setTaskListTasks } from "../Redux/taskListSlice";
import { defaultUser, setAlertProps, setUser, setUsers, userStorageName } from "../Redux/userSlice";
import { toastError, toastSuccess } from "../utils/toast";
import CatchErr from "../utils/catchErr";
import ConvertTime from "../utils/ConvertTime";
import AvatarGenerator from "../utils/AvatarGenerator";
import { setChats, setCurrentMessages } from "../Redux/chatSlice";
// import { set } from "firebase/database";


// collection names
const usersColl = "users";
const tasksColl = "tasks";
const taskListColl = "taskList";
const chatsColl = "chats";
const messagesColl = "messages";

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
      
      setLoading(false);
      reset();
      goTo('/dashboard');
    })
    .catch(error => {  
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

export const getUserInfo = async (id:string, setLoading?: setLoadingType): Promise< userType> => {
  if(setLoading) setLoading(true);
  const userRef = doc(db, usersColl, id);
  const userSnap = await getDoc(userRef);
  if(userSnap.exists()) {
    const {img, isOnline, username, email, creationTime, lastSeen, bio} = userSnap.data();
    if(setLoading) setLoading(false);
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
    if(setLoading) setLoading(false);
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
      ...(img && { img }),
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

export const BE_saveProfile = async (dispatch: AppDispatch, setLoading: setLoadingType, data: {
  email: string,
  username: string,
  password: string,
  img: string,
}) => {
  setLoading(true);
  const { email, username, password, img } = data;
  const id = getStorageUser().id;
  if (id && auth.currentUser) {
    if(email) {
      updateEmail(auth.currentUser, email)
      .then(() => {
        toastSuccess("Email updated successfully");
      })
      .catch((err) => CatchErr(err));
    }

    if(password) {
      updatePassword(auth.currentUser, password)
      .then(() => {
        toastSuccess("Password updated successfully");
      })
      .catch((err) => CatchErr(err));
    }

    if(username || img) {
      updateUserInfo({username, img});
      toastSuccess("Profile updated successfully");
    }

    const userInfo = await getUserInfo(id);
    dispatch(setUser(userInfo));
    setLoading(false);

  } else {
    toastError("BE_saveProfile: id not found", setLoading);
  }
};

export const BE_deleteAccount = async (dispatch: AppDispatch, setLoading: setLoadingType, goTo: NavigateFunction, ) => {
  setLoading(true);
  const id = getStorageUser().id;
  if(id) {
    const userTaskList = await getAllTasksList();

    if(userTaskList.length > 0) { 
      userTaskList.forEach(async (list: taskListType) => {        
        if(list.id && list.tasks) await BE_deleteTaskList(dispatch, list.id, list.tasks);
      });
    }

    await deleteDoc(doc(db, usersColl, id));
    const user = auth.currentUser;
    console.log("USER To BE DELETED: ", user);
    if(user) {
      deleteUser(user)
      .then(async () => {
        BE_signOut(dispatch, goTo, setLoading, true);
      })
      .catch((err) => CatchErr(err));      
    }
  } else {
    toastError("BE_deleteAccount: id not found", setLoading);
  }
}

export const BE_getAllUsers = async (dispatch: AppDispatch, setLoading: setLoadingType) => {
  setLoading(true);
  const usersRef = collection(db, usersColl);
  const q = query(usersRef, orderBy("isOnline", "desc"));

  onSnapshot(q, (snapshot) => {
    const users: userType[] = [];
    snapshot.forEach((doc) => {
      users.push({
        id: doc.id,
        username: doc.data().username,
        email: doc.data().email,
        img: doc.data().img,
        isOnline: doc.data().isOnline,
        bio: doc.data().bio,
        creationTime: doc.data().creationTime
          ? ConvertTime(doc.data().creationTime.toDate())
          : "no date yet: all users creation time",
        lastSeen: doc.data().lastSeen
          ? ConvertTime(doc.data().lastSeen.toDate())
          : "no date yet: all users last seen",
      });
    });
    const id = getStorageUser().id;
    if (id) {
      dispatch(setUsers(users.filter((u) => u.id !== id)));
    }
    setLoading(false);
  });
};

// --------------------------For TaskList -------------------------------------
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

export const BE_saveTask = async (dispatch: AppDispatch, setLoading: setLoadingType, listId: string, data: taskType) => {
  setLoading(true);
  const { id, title, description } = data;
  if(id) {
    const taskRef = doc(db, taskListColl, listId, tasksColl, id);
    await updateDoc(taskRef, {
      title,
      description,
    });
    const updatedTask = await getDoc(taskRef);
    if(updatedTask.exists()) {
      setLoading(false);
      dispatch(saveTask({listId, task: {...updatedTask.data(), id: updatedTask.id}}));
    } else toastError("BE_saveTask: updated task not found", setLoading);
  } else toastError("BE_saveTask: id not found", setLoading);
}

export const getTasksForTaskList = async (dispatch:AppDispatch, listId: string, setLoading: setLoadingType) => {
  setLoading(true);
  const taskRef = collection(db, taskListColl, listId, tasksColl);
  const querySnapshot = await getDocs(taskRef);
  const tasks:taskType[] = [];
  querySnapshot.forEach((task) => {
    const { title, description } = task.data();
    tasks.push({
      id: task.id,
      title,
      description,
      editMode: false,
      collapsed: true
    });
  });
  dispatch(setTaskListTasks({listId, tasks}));
  setLoading(false);
}

//----------------------------- For Chat -----------------------------------

export const BE_startChat = async (dispatch: AppDispatch, setLoading: setLoadingType, rId: string, rName: string) => {
  setLoading(true);
  const sId = getStorageUser().id;
  const chatRef = collection(db, chatsColl);
  const q = query(chatRef, or(
            and(where("senderId", "==", sId), where("receiverId", "==", rId)),
            and(where("senderId", "==", rId), where("receiverId", "==", sId)))
  );
  const querySnapshot = await getDocs(q);

  if(querySnapshot.empty) {
    const newChat = await addDoc(chatRef, {
      senderId: sId,
      receiverId: rId,
      lastMsg: "",
      senderToRecieverMsgCount: 0,
      recieverToSenderMsgCount: 0,
      updatedAt: serverTimestamp(),
    });
    const newChatSnap = await getDoc(doc(db, chatsColl, newChat.id));
    if(!newChatSnap.exists()) {
      toastError("BE_startChat: new chat not found");
    } 
    setLoading(false);
    dispatch(setAlertProps({open: false}));
  } else {
    toastError("You already started chatting with " + rName, setLoading);    
    dispatch(setAlertProps({ open: false }));
  }  
}

export const BE_getChats = async (dispatch: AppDispatch) => {
  
  const sId = getStorageUser().id;
  const chatRef = collection(db, chatsColl);
  const q = query(chatRef, or(
            where("senderId", "==", sId), where("receiverId", "==", sId))
  );
  onSnapshot(q, (snapshot) => {
    const chats: chatType[] = [];  
    snapshot.forEach((chat) => {
      const { senderId, receiverId, lastMsg, senderToRecieverMsgCount, recieverToSenderMsgCount, updatedAt } = chat.data();
      chats.push({
        id: chat.id,
        senderId,
        receiverId,
        lastMsg,
        senderToRecieverMsgCount,
        recieverToSenderMsgCount,
        updatedAt: updatedAt ? ConvertTime(updatedAt.toDate().toString()) : "no date yet: chat updatedAt",
      });
    });
    dispatch(setChats(chats));
  });
}
export const BE_getMsgs = async (dispatch: AppDispatch, setLoading: setLoadingType, chatId: string) => {
  setLoading(true);
  const msgRef = collection(db, chatsColl, chatId, messagesColl);
  const q = query(msgRef, orderBy("createdAt", "asc"));
  onSnapshot(q, (snapshot) => {
    const msgs: messageType[] = [];
    snapshot.forEach((msg) => {
      const { senderId, content, createdAt } = msg.data();
      msgs.push({
        id: msg.id,
        senderId,        
        content,
        createdAt: createdAt ? ConvertTime(createdAt.toDate().toString()) : "no date yet: All messages",
      });
    });
    setLoading(false);
    dispatch(setCurrentMessages(msgs));    
  });  
}
export const iCreatedChat = (sId: string) => {  
  return sId === getStorageUser().id;
}

export const BE_sendMsgs = async (chatId:string, data: messageType, setLoading: setLoadingType) => {
  setLoading(true);  
  const msgRef = collection(db, chatsColl, chatId, messagesColl);
  const res = await addDoc(msgRef, {
    ...data,
    createdAt: serverTimestamp(),
  });
  const newMsgSnap = await getDoc(doc(db, res.path));
  if(newMsgSnap.exists()) {
    await updateNewMsgCount(chatId, true);
    await updateLastMsg(chatId, newMsgSnap.data().content);
    await updateUserInfo({});
    setLoading(false);
  }   
}

export const updateNewMsgCount = async(chatId:string, reset?:boolean) => {
  const chatRef = doc(db, chatsColl, chatId);
  const chatSnap = await getDoc(chatRef);
  let senderToRecieverMsgCount = chatSnap.data()?.senderToRecieverMsgCount;
  let recieverToSenderMsgCount = chatSnap.data()?.recieverToSenderMsgCount;
  if (iCreatedChat(chatSnap.data()?.senderId)) {
    if(reset) recieverToSenderMsgCount = 0;
    else senderToRecieverMsgCount++;
  } else {
    if(reset) senderToRecieverMsgCount = 0;
    else recieverToSenderMsgCount++;
  }

  await updateDoc(chatRef, {
    updatedAt: serverTimestamp(),
    senderToRecieverMsgCount,
    recieverToSenderMsgCount,
  });  
}

const updateLastMsg = async (chatId: string, lastMsg: string) => {
  await updateNewMsgCount(chatId);
  // await message count here
  await updateDoc(doc(db, chatsColl, chatId), {
    lastMsg,
    updatedAt: serverTimestamp(),
  });
};
  