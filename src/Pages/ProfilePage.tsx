import { useEffect, useState } from "react";
import Button from "../Components/Button";
import Input from "../Components/Input";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AvatarGenerator from "../utils/AvatarGenerator";
import { AppDispatch, RootState } from "../Redux/store";
import { toastError, toastWarning } from "../utils/toast";
import { BE_saveProfile } from "../Backend/Queries";

const ProfilePage = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [avatar, setAvatar] = useState("")
  const [saveProfileLoading, setSaveProfileLoading] = useState(false);
  const [deleteAccLoading, setDeleteAccLoading] = useState(false);

  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const dispatch = useDispatch<AppDispatch>();
  const goTo = useNavigate();

  useEffect(() => {
    if(currentUser) {
      setEmail(currentUser.email);
      setUsername(currentUser.username);      
    }
  }, [currentUser]);

  const handleAvatarGenerate = () => {    
    setAvatar(AvatarGenerator());
  }

  const handleSaveProfile = async () => {
    // save profile here
    if(!email || !username) {
      toastError("Email and username are required");      
    }

    let tempPassword = password;
    if(tempPassword && tempPassword !== confirmPass) {
      toastError("Passwords do not match");
      tempPassword = "";      
    }

     let tempEmail = email;
     if (tempEmail === currentUser.email) tempEmail = "";

     // only update username if it was changed
     let tempUsername = username;
     if (tempUsername === currentUser.username) tempUsername = "";

     // only update avatar if it was changed
     let tempAvatar = avatar;
     if (tempAvatar === currentUser.img) tempAvatar = "";

     if (tempEmail || tempUsername || tempPassword || tempAvatar) {
       // save profile
       await BE_saveProfile(
         dispatch,
         setSaveProfileLoading,
         {
           email: tempEmail,
           username: tempUsername,
           password: tempPassword,
           img: tempAvatar,
         },         
       );
     } else toastWarning("Change details before saving!");
  }
  
  const handleDeleteAccount = () => {
    // delete account here
    if (currentUser) {
      if (window.confirm(`Are you sure you want to delete ${username}? this can't be reversed`)) {                
        
        // delete account
        BE_deleteAccount(dispatch, setDeleteAccLoading, goTo);   
      }
    }
  }

  return (
    <div className="bg-white flex flex-col gap-5 shadow-md max-w-2xl py-5 px-6 md:p-10 md:m-auto m-5 md:mt-10 ">
      <div className="relative self-center">
        <img
          onClick={handleAvatarGenerate}
          src={avatar || currentUser.img}
          alt={currentUser.username}
          className="w-32 h-32 m-auto md:w-48 md:h-48 rounded-full p-[2px] ring-2 ring-gray-300 cursor-pointer hover:shadow-lg"
        />
        <span className="absolute top-7 md:top-7 left-28 md:left-40 w-5 h-5 border-2 border-gray-800 rounded-full bg-green-400"></span>
      </div>
      <p className="text-gray-400 text-sm text-center">
        Note: Click on image to temporary change it, when you like it, then
        save profile. You can leave password and username as they are if you
        don't want to change them
      </p>
      <div className="flex flex-col gap-2">
        <Input
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value.trim())}
        />
        <Input
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value.trim())}
        />
        <Input
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Input
          name="confirmPassword"
          type="password"
          value={confirmPass}
          onChange={(e) => setConfirmPass(e.target.value.trim())}
        />
        <Button text="Update Profile" onClick={handleSaveProfile}loading={saveProfileLoading} />
        <Button text="Delete Account" secondary onClick={handleDeleteAccount} loading={deleteAccLoading} />
      </div>      
    </div>
  );
};

export default ProfilePage;
