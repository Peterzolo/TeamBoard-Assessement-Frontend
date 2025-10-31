import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";

interface UseDeleteItemOptions {
  deleteAction: (id: string) => any; // Redux action creator
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

function useDeleteItem(options: UseDeleteItemOptions) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<any>(null);
  const dispatch = useDispatch();

  const deleteItem = useCallback(
    async (id: string) => {
      setIsDeleting(true);
      setDeleteError(null);
      try {
        await dispatch(options.deleteAction(id));
        setIsDeleting(false);
        if (options.onSuccess) {
          options.onSuccess();
        }
      } catch (error: any) {
        setIsDeleting(false);
        setDeleteError(error);
        if (options.onError) {
          options.onError(error);
        }
      }
    },
    [dispatch, options.deleteAction, options.onSuccess, options.onError]
  );

  return {
    isDeleting,
    deleteError,
    deleteItem,
  };
}

export default useDeleteItem;
