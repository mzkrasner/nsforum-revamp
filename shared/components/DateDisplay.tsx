import { format } from "date-fns";
import { HTMLAttributes } from "react";

const DateDisplay = ({
  dateString,
  children,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { dateString: string }) => {
  if (!dateString) return null;
  const formattedDate = format(new Date(dateString), "do MMM yyyy");
  return <span {...props}>{formattedDate}</span>;
};
export default DateDisplay;
