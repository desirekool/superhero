import React, { forwardRef, useEffect, useState } from 'react';
import Icon from './Icon';
import { MdAdd, MdEdit, MdDelete, MdKeyboardArrowDown, MdSave } from 'react-icons/md';
import Tasks from './Tasks';
import { taskListType } from '../Types';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../Redux/store';
import { BE_addTask, BE_deleteTaskList, BE_saveTaskList, getTasksForTaskList } from '../Backend/Queries';
import { taskListSwitchEditMode, collapseAllTask } from '../Redux/taskListSlice';
import { TaskListTasksLoader } from './Loaders';

type SingleTaskListTypes = {
  singleTaskList: taskListType;  
}

const SingleTaskList = forwardRef(
  (
    { singleTaskList }: SingleTaskListTypes, 
    ref: React.LegacyRef<HTMLDivElement> | undefined
  ) => {
  const { id, editMode, tasks, title } = singleTaskList;
  const [homeTitle, setHomeTitle] = useState(title);
  const [saveLoading, setSaveLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [allCollapsed, setAllCollapsed] = useState(false);
  const [addTaskLoading, setAddTaskLoading] = useState(false);
  const [taskLoading, setTaskLoading] = useState(false);
  
  const dispatch = useDispatch<AppDispatch>();

      useEffect(() => {
        // get tasks here
        if (id) getTasksForTaskList(dispatch, id, setTaskLoading);
      }, [dispatch, id]);

      useEffect(() => {
        const checkAllCollapsed = () => {
          if(tasks && tasks.length) {
            for (let i = 0; i < tasks.length; i++) {
              const task = tasks[i];
              if (!task.collapsed) return setAllCollapsed(false);
            }
          }
          return setAllCollapsed(true);
        };
        checkAllCollapsed();
      }, [tasks]);

  const handleSaveTaskListTitle = () => {
    if(id) BE_saveTaskList(dispatch, setSaveLoading, id, homeTitle);    
  };

  const handleDelete = () => {
    if(id && tasks) BE_deleteTaskList(dispatch, id, tasks, setDeleteLoading);
  }

  const handleAddTask = () => {
    if(id) BE_addTask(dispatch, setAddTaskLoading, id);
  }

  const checkEnterKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSaveTaskListTitle();
  };

  const handleCollapseClick = () => {
    if(allCollapsed) {
      return dispatch(collapseAllTask({listId: id, value: false}));
    }
    return dispatch(collapseAllTask({listId: id}));
  }

  return (
    <div ref={ref} className="relative">
      <div className="bg-[#d3f0f9] w-full md:w-[400px] drop-shadow-md rounded-md min-h-[50px] overflow-hidden">
        <div className={`flex ${!editMode &&  'flex-wrap'} items-center justify-between md:gap-10 bg-gradient-to-r from-myBlue to-myPink bg-opacity-70 p-3 text-white text-center`}>
          {editMode ? (
            <input
              value={homeTitle}
              onKeyDown={(e) => checkEnterKey(e)}
              onChange={(e) => setHomeTitle(e.target.value)}
              placeholder="Enter task list title"
              className="flex-1 bg-transparent placeholder:-gray-300 px-3 py-1 border-[1px] border-white rounded-md"
            />
          ) : (
            <p className="flex-1">{title}</p>
          )}
          <div className="flex">
            <Icon
              IconName={editMode ? MdSave : MdEdit}
              onClick={() => (editMode
                  ? handleSaveTaskListTitle()
                  : dispatch(taskListSwitchEditMode({ id }))
              )}
              loading={editMode && saveLoading}
            />
            <Icon 
              IconName={MdDelete} 
              onClick={handleDelete}
              loading={deleteLoading}
            />
            <Icon 
              IconName={MdKeyboardArrowDown} 
              onClick={handleCollapseClick}
              className={`${allCollapsed ? 'rotate-180' : 'rotate-0'} transition-all`}
            />
          </div>
        </div>
        {taskLoading ? (<TaskListTasksLoader />) : (id && <Tasks tasks={tasks || []} listId={id} />)}
      </div>
      <Icon
        IconName={MdAdd}
        onClick={handleAddTask}
        className="absolute -mt-6 -ml-4 p-2 drop-shadow-lg hover:bg-myPink"
        reduceOpacityOnHover={false}
        loading={addTaskLoading}
      />
    </div>
  );
});

export default SingleTaskList;
