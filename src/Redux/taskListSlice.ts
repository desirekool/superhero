import { createSlice } from "@reduxjs/toolkit";
import { taskListType, taskType } from "../Types";

export const defaultTaskList:taskListType = {  
  title: "Sample Task List",
  editMode: false,
  tasks: [],
  description: "",
  isCompleted: false,
  creationTime: "",
  lastModified: "",
  userId: "",
};

export const defaultTask:taskType = {
  title: "Sample Task",
  description: "This is what Is required in order to finish this task",
  editMode: false,
  collapsed: false,
  isCompleted: false,
  creationTime: "",
  lastModified: "",
  userId: "",
};

export const initialState: {
  taskList?: taskListType[];
  currentTaskList: taskListType[],
} = {
  taskList: [],
  currentTaskList: [],
};

const taskListSlice = createSlice({
  name: "taskList",
  initialState,
  reducers: {
    setTaskList: (state, action) => {
      state.currentTaskList = action.payload;
    },
    addTaskList: (state, action) => {
      const newTaskList = action.payload;
      newTaskList.editMode = true;
      newTaskList.tasks = [];
      state.currentTaskList.unshift(newTaskList);
    },
    saveTaskListTitle: (state, action) => {
      const { id, title } = action.payload;
      state.currentTaskList = state.currentTaskList.map((tL) => {
        if (tL.id === id) {
          tL.title = title;
          tL.editMode = false;
        }
        return tL;
      });
    },
    collapseAllTask: (state, action) => {
      const { listId, value } = action.payload;
      const taskList = state.currentTaskList.find((tL) => tL.id === listId);
      const listIdx = state.currentTaskList.findIndex((tL) => tL.id === listId);

      console.log(action);

      taskList?.tasks?.map((t) => {
        t.collapsed = value !== undefined ? value : true;
        t.editMode = false;
        return t;
      });

      if (taskList) state.currentTaskList[listIdx] = taskList;
    },
    taskListSwitchEditMode: (state, action) => {
      const { id, value } = action.payload;
      state.currentTaskList = state.currentTaskList.map((tL) => {
        if (tL.id === id) {
          tL.editMode = value !== undefined ? value : true;
        }
        return tL;
      });
    },
    deleteTaskList: (state, action) => {
      const listId = action.payload;
      state.currentTaskList = state.currentTaskList.filter(
        (tL) => tL.id !== listId
      );
    },
    deleteTask: (state, action) => {
      const { listId, id } = action.payload;

      const updatedTaskList = state.currentTaskList.map((tL) => {
        if (tL.id === listId) {
          tL.tasks = tL.tasks?.filter((t) => t.id !== id);
        }
        return tL;
      });

      state.currentTaskList = updatedTaskList;
    },
    addTask: (state, action) => {
      const { listId, task } = action.payload;
      const updatedTaskList = state.currentTaskList.map((tL) => {
        if (tL.id === listId) {
          tL.editMode = false;
          const tasks = tL.tasks?.map(t => {
            t.editMode = false;
            t.collapsed = false;
            return t;
          });
          tasks?.push({...task, editMode: true, collapsed: false});
          tL.tasks = tasks;
          // tL.tasks?.unshift(task);
        }
        return tL;
      });

      state.currentTaskList = updatedTaskList;
    },
    collapseTask: (state, action) => {
      const { listId, taskId } = action.payload;

      const updatedTaskList = state.currentTaskList.map((tL) => {
        if (tL.id === listId) {
          tL.tasks = tL.tasks?.map((t) => {
            if (t.id === taskId) {
              t.collapsed = !t.collapsed;
            }
            return t;
          });
        }
        return tL;
      });

      state.currentTaskList = updatedTaskList;
    },
    taskSwitchEditMode: (state, action) => {
      const { listId, taskId, value } = action.payload;

      const updatedTaskList = state.currentTaskList.map((tL) => {
        if (tL.id === listId) {
          tL.tasks = tL.tasks?.map((t) => {
            if (t.id === taskId) {
              t.editMode = value !== undefined ? value : true;
            }
            return t;
          });
        }
        return tL;
      });

      state.currentTaskList = updatedTaskList;
    },
    saveTask: (state, action) => {
      const { listId, taskId, title, description } = action.payload;

      const updatedTaskList = state.currentTaskList.map((tL) => {
        if (tL.id === listId) {
          tL.tasks = tL.tasks?.map((t) => {
            if (t.id === taskId) {
              t.title = title;
              t.description = description;
              t.editMode = false;
            }
            return t;
          });
        }
        return tL;
      });

      state.currentTaskList = updatedTaskList;
    },
    setTaskListTasks: (state, action) => {
      const { listId, tasks } = action.payload;

      const updatedTaskList = state.currentTaskList.map((tL) => {
        if (tL.id === listId) {
          tL.tasks = tasks;
        }
        return tL;
      });

      state.currentTaskList = updatedTaskList;
    },
  },
});

export const { setTaskList, addTaskList, deleteTaskList, saveTaskListTitle, taskListSwitchEditMode, deleteTask, addTask, saveTask, collapseTask, collapseAllTask, taskSwitchEditMode, setTaskListTasks } = taskListSlice.actions;

export default taskListSlice.reducer;