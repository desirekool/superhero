import logo from './../Assets/logo.jpg';
import AddListBoard from './AddListBoard';
import { BsFillChatFill } from "react-icons/bs";
import Icon from './Icon';
import {FiList} from 'react-icons/fi';
import UserHeaderProfile from './UserHeaderProfile';
import { useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../Redux/store';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { BE_getChats, BE_signOut, getStorageUser} from '../Backend/Queries'
import { useState, useEffect } from 'react';
import Spinner from './Spinner';
import { setUser } from '../Redux/userSlice';

export default function Header() {
  const [logoutLoading, setLogoutLoading] = useState(false);
  const goTo = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const handleSignOut = async () => {
    BE_signOut(dispatch, goTo, setLogoutLoading);
  };

  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  const usr = getStorageUser();

  useEffect(() => {
    if (usr?.id) {
      dispatch(setUser(usr));
    } else {
      goTo("/auth");
    }
  }, [dispatch, goTo]);

  useEffect(() => {
    const page = getCurrentPage();
    if (page) goTo("/dashboard/" + page);

    const get = async () => {
      if (usr?.id) await BE_getChats(dispatch);
    };
    get();
  }, [goTo]);

  const handleGoToPage = (page: string) => {
    goTo("/dashboard/" + page);
    setCurrentPage(page);
  };

  const setCurrentPage = (page: string) => {
    localStorage.setItem("superhero-page", page);
  };

  const getCurrentPage = () => {
    return localStorage.getItem("superhero-page");
  };

  const showChat = getCurrentPage() !== "chat";
  const showFiList = getCurrentPage() === "chat" || getCurrentPage() === "profile";
  const showAddListBoard = getCurrentPage() !== "chat" && getCurrentPage() !== "profile";
  
    
  return (
    <div className="flex flex-wrap z-10 sm:flex-row gap-5 items-center justify-between drop-shadow-md bg-gradient-to-r from-myBlue to-myPink py-5 px-5 md:py-2 text-white">
      <img
        className="w-[70px] drop-shadow-md cursor-pointer"
        src={logo}
        alt="logo"
      />
      <div className="flex flex-row-reverse md:flex-row items-center justify-center gap-5 flex-wrap">
        {showAddListBoard && <AddListBoard />}
        {showChat && (
          <Icon
            IconName={BsFillChatFill}
            ping={true}
            onClick={() => handleGoToPage("chat")}
            reduceOpacityOnHover={false}
          />
        )}
        {showFiList && (
          <Icon
            IconName={FiList}
            onClick={() => handleGoToPage("")}
            reduceOpacityOnHover={false}
          />
        )}
        <div className="group relative">
          <UserHeaderProfile user={currentUser} />
          <div className="absolute pt-5 hidden group-hover:block w-full min-w-max">
            <ul className="w-full bg-white overflow-hidden rounded-md shadow-md text-gray-700 pt-1">
              <p
                onClick={() => handleGoToPage("profile")}
                className="hover:bg-gray-200 py-2 px-4 block cursor-pointer"
              >
                Profile
              </p>
              <button
                onClick={() => !logoutLoading && handleSignOut()}
                className={`hover:bg-gray-200 w-full py-2 px-4 cursor-pointer flex items-center gap-4`}
              >
                Logout
                {logoutLoading && <Spinner />}
              </button>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}