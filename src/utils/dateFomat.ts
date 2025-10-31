import { format } from "date-fns";

export const newDateFormatDate = (date: string | Date | undefined): string => {
  if (!date) return "";
  return format(new Date(date), "MMMM d, yyyy");
};
