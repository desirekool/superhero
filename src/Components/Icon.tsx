import { IconType } from "react-icons";
import Spinner from "./Spinner";
type IconProps = {
    IconName: IconType;
    size?: number;
    className?:string;
    loading?:boolean;
    ping?:boolean;
    reduceOpacityOnHover?:boolean;
    onClick?:()=>void;
};
  
const Icon = ({ IconName, size = 20, className, loading, onClick, ping, reduceOpacityOnHover = true }: IconProps) => {
    return (
        <button onClick={onClick} disabled={loading} 
          className={`
            relative flex p-3 rounded-full cursor-pointer  transition-all hover:bg-myBlue
            ${reduceOpacityOnHover ? 'hover:opacity-30' : 'bg-myBlue hover:bg-myPink text-white border-2 border-white hover:drop-shadow-lg'} ${loading && 'cursor-wait'} ${className}` }>
          {loading ? <Spinner /> : <IconName size={size} />}
          {ping && (
            <>
              <span className="absolute -top-1 left-7 w-3 h-3 border-2 border-gray-800 rounded-full bg-myPink"></span>
              <span className="animate-ping absolute -top-1 left-7 w-3 h-3 border-gray-800 rounded-full bg-myPink"></span>
            </>
          )}
        </button>
    );
};

export default Icon;