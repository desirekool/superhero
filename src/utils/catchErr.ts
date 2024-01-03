import { toastError } from "./toast";

const CatchErr = (error: {code?:string}) => {
  const {code} = error;
  if(code === 'auth/email-already-in-use') {
    toastError('Email already in use');
  } else if(code === 'auth/invalid-email') {
    toastError('Invalid email');
  } else if(code === 'auth/weak-password') {
    toastError('Weak password');
  } else if(code === 'auth/user-not-found') {
    toastError('User not found');
  } else if(code === 'auth/wrong-password') {
    toastError('Wrong password');
  } else if(code === 'auth/too-many-requests') {
     toastError('Too many requests');
  } else if(code === 'auth/network-request-failed') {
    toastError('Network request failed');
  } else if(code === 'auth/user-disabled') {
    toastError('User disabled');
  } else if(code === 'auth/operation-not-allowed') {
    toastError('Operation not allowed');
  } else if(code === 'auth/invalid-credential') {
    toastError( 'Invalid credential');
  } else if(code === 'auth/requires-recent-login') {
    toastError('Requires recent login');
  } else if(code === 'auth/invalid-login-credential') {
    toastError('Invalid login credential');
  } else {
    toastError('Something went wrong');
  }
};

export default CatchErr;