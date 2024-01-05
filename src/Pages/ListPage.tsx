import { useEffect, useState } from "react";
import SingleTaskList from "../Components/SingleTaskList";
import { BE_getTaskLists } from "../Backend/Queries";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../Redux/store";
import { ListLoader } from "../Components/Loaders";
import FlipMove from "react-flip-move";


const ListPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const taskLists = useSelector((state: RootState) => state.taskList.currentTaskList)    

  useEffect(() => {
    BE_getTaskLists(dispatch, setLoading);
  }, [dispatch]);
  
  return (
    <div className="p-10">
      {loading ? (
        <ListLoader />
      ) : (
        taskLists.length === 0 ? <h1 className="text-3xl text-center text-gray-500 mt-1">No task list added, add some</h1> : (
          <FlipMove className="flex flex-wrap justify-center gap-10">
            {taskLists.map((taskList) => (
              <SingleTaskList key={taskList.id} singleTaskList={taskList} />
            ))}
          </FlipMove>
        )
      )}
    </div>
  );
};

export default ListPage;
