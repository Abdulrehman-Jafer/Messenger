import { configureStore, ConfigureStoreOptions } from "@reduxjs/toolkit";
import { TypedUseSelectorHook } from "react-redux/es/types";
import { useDispatch, useSelector } from "react-redux/es/exports";
import { api } from "./service/api";
import userReducer from "./features/user-slice";

export const store = configureStore({
  reducer: {
    userReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export const globalState = store.getState;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
