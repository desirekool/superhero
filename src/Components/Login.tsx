import { useState } from "react";
import Button from "./Button";
import Input from "./Input"

const Login = () => {
  const [login, setLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignin = () => {
    const data = {email, password, confirmPassword};
    console.log(data);
  }

  const handleSignup = () => {
    const data = {email, password, confirmPassword};
    console.log(data);
  }

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
              <Button text="Login" onClick={handleSignin}/>
              <Button text="Register" secondary onClick={() => setLogin(false)}/>
            </>
          ) : (
            <>
              <Button text="Register" onClick={handleSignup}/>
              <Button text="Login" secondary onClick={() => setLogin(true)}/>
            </>
          )}          
        </div>
    </div>
   
  );
};

export default Login;