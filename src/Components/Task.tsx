import React, { forwardRef } from 'react'
import { MdDelete, MdEdit } from 'react-icons/md';
import Icon from './Icon';

type taskType = {
  task: taskType,
  listId: string
}

const  Task = forwardRef(
  ({task, listId}: taskType,
    ref: React.LegacyRef<HTMLDivElement> | undefined
  ) => {
    const{ id, title, description, editMode, collapsed } = task;
  return (
    <div ref={ref} className='p-2 mb-2 bg-white rounded-md drop-shadow-sm hover:drop-shadow-md '>
      <div>
        <p className="cursor-pointer">{title}</p>
      </div>
      <div>
        <hr className="my-2" />
        <div>
          <p>{description}</p>
          <div className="flex justify-end">
            <Icon IconName={MdEdit} />
            <Icon IconName={MdDelete} />
          </div>
        </div>
      </div>
    </div>
  )
});

export default Task;