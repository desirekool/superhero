import { PropsWithChildren } from "react";

type SideBarTypes = {
  // children: JSX.Element;
  isRight?: boolean;
  className?: string;
}

const Sidebar = ({children, isRight, className} : PropsWithChildren<SideBarTypes>) => {
  return (
    <div className={`lg:flex-[0.3] duration-75 bg-white shadow-md border-2 overflow-auto ${isRight ? 'rounded-tr-3xl rounded-br-3xl': 'rounded-tr-3xl rounded-bl-3xl'} ${className}`}>
      {children}
    </div>
  )
}

export default Sidebar;