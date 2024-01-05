import { useState } from "react";
import { AppDispatch } from "../Redux/store";
import Button from "./Button";
import Icon from "./Icon";
import { MdAdd } from "react-icons/md";
import { useDispatch } from "react-redux";
import { addTaskList } from "../Redux/taskListSlice";
import { BE_addTaskList } from "../Backend/Queries";

const AddListBoard = () => {
  const [addLoading, setAddLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const handleAddTaskList = () => {
    BE_addTaskList(dispatch, setAddLoading);
  };

  return (
    <>
      <Button text="Add new ListBoard" secondary className="hidden md:flex" loading={addLoading} 
      onClick={handleAddTaskList}/>
      <Icon IconName={MdAdd}  className="block md:hidden" />

    </>
  );
};

export default AddListBoard;