import Spinner from "./Spinner";

type ButtonProps = {
  text?: string;
  className?: string;
  secondary?: boolean;
  onClick?: () => void;
  loading?: boolean;
}

export default function Button({
  className,
  secondary,
  text = "Button",
  onClick,
  loading = false,
}: ButtonProps) {
  return (
    <button 
      className={`py-2 px-9 flex items-center justify-center gap-3 rounded-full text-white border-2 border-white hover:bg-myPink transition-all hover:drop-shadow-lg 
        ${secondary ? 'bg-myPink' : 'bg-myBlue'} ${className}`} 
        onClick={onClick}
        disabled={loading}
      >
      {loading && <Spinner />}
      {text}
    </button>
  )
}