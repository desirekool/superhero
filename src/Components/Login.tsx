import { useState } from "react";
import Button from "./Button";
import Input from "./Input";
import { auth } from "../Backend/Firebase";
import { BE_signUp, BE_signIn } from "../Backend/Queries";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "../Redux/store";
import { useDispatch } from "react-redux";
import { authDataType } from "../Backend/Types";

const Login = () => {
  const [login, setLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [signInLoading, setSignInLoading] = useState(false);

  const goTo = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const handleSignup = () => {
    const data = { email, password, confirmPassword };
    auth(data, BE_signUp, setSignUpLoading);
  };
  const handleSignin = () => {
    const data = { email, password };
    auth(data, BE_signIn, setSignInLoading);
  };

  const auth = (
    data: authDataType,
    func: any,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    func(data, setLoading, reset, goTo, dispatch);
  };

  const reset = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };


    return (   
    <div className="width-full md:w-[450px]">
        <h1 className="text-white text-center font-bold text-4xl md:text-6xl mb-10">{login ? 'Login' : 'Register'}</h1>
        <div className="flex flex-col gap-3 bg-white width-full p-6 min-h-[150px] rounded-xl drop-shadow-xl">
          <Input name="email" type="email" value={email} onChange={(e) => {setEmail(e.target.value)}} />
          <Input name="Password" type="password" value={password} onChange={(e) => {setPassword(e.target.value)}} />
          {!login && <Input name="confirm-password" value={confirmPassword} type="password" onChange={(e) => {setConfirmPassword(e.target.value)}} />}
          {login ? <a href="#" className="text-myBlue text-right">Forgot Password?</a> : null}
          {login ? (
            <>
              <Button 
                text="Login" 
                onClick={handleSignin}
                loading={signInLoading}
              />
              <Button text="Register" secondary onClick={() => setLogin(false)}/>
            </>
          ) : (
            <>
              <Button 
                text="Register" 
                onClick={handleSignup}
                loading={signUpLoading}
              />
              <Button text="Login" secondary onClick={() => setLogin(true)}/>
            </>
          )}          
        </div>
    </div>
   
  );
};

export default Login;