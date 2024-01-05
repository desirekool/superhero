import Task from './Task'
import { taskType } from '../Types'
import FlipMove from 'react-flip-move'

type TasksType = {
  tasks: taskType[],
  listId: string
}

const  Tasks = ({tasks, listId}: TasksType) => {
  return (
    <div className="p-3 pb-5 mb-2 rounded-md drop-shadow-sm hover:drop-shadow-md ">
      <FlipMove>
        {tasks.map((task) => <Task key={task.id} task={task} listId={listId} />)}      
      </FlipMove>
      {tasks.length === 0 && <p className="text-center text-gray-400">No tasks yet</p>}
    </div>
  );
};

export default Tasks;