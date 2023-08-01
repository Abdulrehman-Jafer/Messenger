import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface User {
  _id: string;
  provider: "Google" | "Custom";
  name: string;
  email: string;
  image: string;
  blockedContacts: string[];
  lastLogin: number;
  userToken: string;
  socketId: string | undefined;
}

const initialState: User = {
  _id: "",
  provider: "Google",
  name: "",
  email: "",
  image: "",
  blockedContacts: [""],
  lastLogin: 0,
  userToken: "",
  socketId: "",
};

const userSlice = createSlice({
  name: "User",
  initialState,
  reducers: {
    initializeUser: function (_, action: PayloadAction<User>) {
      return { ...action.payload };
    },
    uninitializeUser: function () {
      return initialState;
    },
    updateUser: function (state, action: PayloadAction<User>) {
      return { ...state, ...action.payload };
    },
    setUserSocketId: function (state, action: PayloadAction<string>) {
      return { ...state, socketId: action.payload };
    },
  },
});

export const { initializeUser, uninitializeUser, updateUser, setUserSocketId } =
  userSlice.actions;
export default userSlice.reducer;
