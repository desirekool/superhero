export type setLoadingType = React.Dispatch<React.SetStateAction<boolean>>;

export type authDataType = {
  email: string;
  password: string;
  confirmPassword?: string;
};

export type userType =  {
  id: string;
  username: string;
  email: string;
  isOnline: boolean;
  img: string;
  creationTime?: string;
  lastSeen?: string;
  bio?: string;
};

export type taskListType = {
  id?: string;
  title: string;
  editMode?: boolean;
  tasks?:taskType[];
  description?: string;
  isCompleted?: boolean;
  creationTime?: string;
  lastModified?: string;
  userId?: string;
};

export type taskType = {
  id?: string;
  title: string;
  description: string;
  editMode?: boolean;
  collapsed?: boolean;
  isCompleted?: boolean;
  creationTime?: string;
  lastModified?: string;
  userId?: string;
};
