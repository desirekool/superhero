import Button from './Button'
import { AppDispatch, RootState } from '../Redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { BE_startChat } from '../Backend/Queries';
import { setAlertProps } from '../Redux/userSlice';
import { useState } from 'react';

const Alert = () => {
  const {
    open,
    receiverId: rId,
    recieverName: rName,
  } = useSelector((state: RootState) => state.user.alertProps);
  const dispatch = useDispatch<AppDispatch>();
  const [startChattingLoading, setStartChattingLoading] = useState(false);
  const handleStartChatting = () => {    
    if (rId && rName) BE_startChat(dispatch, setStartChattingLoading, rId, rName);        
  }

  return (
    <div
      className={`fixed top-0 z-50 h-full w-full block ${
        open ? "block" : "hidden"
      }`}
    >
      <div className="h-full w-full flex justify-center items-center">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border-8 min-w-[500px] rounded-[30px] z-30 p-10 flex flex-col">
          <div className="flex-1 mb-5">
            <p>Start Chatting with {rName}</p>
          </div>
          <div className="flex justify-end gap-5">
            <Button
              onClick={() => dispatch(setAlertProps({ open: false }))}
              text="Cancel"
              secondary
            />
            <Button
              onClick={handleStartChatting}
              loading={startChattingLoading}
              text="Sure"
            />
          </div>
        </div>
        <div className="bg-black backdrop-blur-[2px] bg-opacity-30 h-full w-full absolute z-20"></div>
      </div>
    </div>
  );
}

export default Alert;

