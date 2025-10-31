/**
 * Utility functions for handling service request status
 */

export const normalizeStatus = (status: string | undefined | null): string => {
  if (!status) return "Pending";
  return status;
};

export const isStatusCompleted = (status: string | undefined | null): boolean => {
  return status === "Completed";
};

export const isStatusCancelled = (status: string | undefined | null): boolean => {
  return status === "Cancelled";
};

export const isStatusEditable = (status: string | undefined | null): boolean => {
  return status === "Pending" || status === "On hold";
};
