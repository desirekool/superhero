import React, { forwardRef, useState } from 'react'
import { MdDelete, MdEdit, MdSave } from 'react-icons/md';
import Icon from './Icon';
import { taskType } from '../Types';
import { collapseTask, taskSwitchEditMode } from '../Redux/taskListSlice';
import { AppDispatch } from '../Redux/store';
import { useDispatch } from 'react-redux';
import { BE_deleteTask, BE_saveTask } from '../Backend/Queries';

type TaskType = {
  task: taskType,
  listId: string
}

const  Task = forwardRef(
  ({task, listId}: TaskType,
    ref: React.LegacyRef<HTMLDivElement> | undefined
  ) => {
    const{ id, title, description, editMode, collapsed } = task;
    const [homeTitle, setHomeTitle] = useState(title);
    const [homeDescription, setHomeDescription] = useState(description);
    const [saveLoading, setSaveLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const dispatch = useDispatch<AppDispatch>();

    const handleSave = () => {
      const taskData: taskType = {
        id,
        title: homeTitle,
        description: homeDescription,
        editMode: false,
        collapsed
      }
      BE_saveTask(dispatch, setSaveLoading, listId, taskData)
    }

    const handleDelete = () => {
      if(id) BE_deleteTask(dispatch, listId, id, setDeleteLoading);
    }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
  return (
    <div
      ref={ref}
      className="p-2 mb-2 bg-white rounded-md drop-shadow-sm hover:drop-shadow-md "
    >
      <div>
        {editMode ? (
          <input
            value={homeTitle}
            onChange={(e) => setHomeTitle(e.target.value)}
            className="w-full border-2 px-2 border-myBlue rounded-sm mb-1"
            placeholder="Enter task title"
          />
        ) : (
          <p
            onClick={() => dispatch(collapseTask({ listId, taskId : id}))}
            className="cursor-pointer"
          >
            {title}
          </p>
        )}
      </div>
      {!collapsed && (
        <div>
          <hr className="my-2" />
          <div>
            {editMode ? (
              <textarea
                onChange={(e) => setHomeDescription(e.target.value)}
                value={homeDescription}
                className="w-full border-2 px-2 border-myBlue rounded-sm mb-1"
                placeholder="Enter task description"
              />
            ) : (
              <p>{homeDescription}</p>
            )}

            <div className="flex justify-end">
              <Icon 
                IconName={editMode ? MdSave : MdEdit} 
                onClick={() => editMode ? 
                  handleSave()
                  : dispatch(taskSwitchEditMode({listId, taskId: id}))
                }
                loading={editMode && saveLoading}
              />
              <Icon onClick={handleDelete} IconName={MdDelete} loading={deleteLoading} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default Task;