import logo from './../Assets/logo.png';
import Button from './Button';

export default function Header() {
  return (
    <div className='flex flex-wrap sm:flex-row gap-5 items-center justify-between bg-gradient-to-r from-myBlue to-myPink py-5 px-5 md:py-2 text-white'>
      <img className='w-[70px] drop-shadow-md cursor-pointer' src={logo} alt="logo" />
      <div className='flex gap-2'>
        <Button text="Add new ListBoard" secondary/>
      </div>
    </div>
  )
}