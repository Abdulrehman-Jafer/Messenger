import { useEffect } from "react";
import { useAppDispatch } from "../redux/store";
import { UseQuery } from "@reduxjs/toolkit/dist/query/react/buildHooks";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

function useDispatchOnLoad<T, Y>(
  rtkFunction: UseQuery<any>,
  skip: boolean,
  requestBody: T,
  action: ActionCreatorWithPayload<Y>,
  successMessage: string
) {
  const dispatch = useAppDispatch();
  const { isError, isSuccess, isLoading, data } = rtkFunction(requestBody, {
    skip,
  });
  useEffect(() => {
    if (requestBody) {
      if (!isLoading && isSuccess) {
        dispatch(action((data as any).result));
        successMessage && toast.success(successMessage);
      }
      if (!isLoading && isError) {
        toast.error(`Error at useDispactch on Load`);
      }
    }
  }, [isLoading]);

  if (!requestBody) {
    return [false, null];
  }
  return [isLoading, data];
}

export default useDispatchOnLoad;
