import { cn } from "../../../utils/tailwind";

const ToolbarButton = ({ children, active, className = '', ...props }) => {
	return (
    <button 
      className={cn(
        "h-7 w-7 inline-flex items-center justify-center rounded-md hover:bg-gray-500/30",
        {
          'bg-gray-500/30': active
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
export default ToolbarButton;