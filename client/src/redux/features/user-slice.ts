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
  public_number: string;
}

const initialState: User = {
  _id: "",
  provider: "Google",
  name: "",
  email: "",
  image: "",
  blockedContacts: [""],
  lastLogin: 100,
  userToken: "",
  socketId: "",
  public_number: "",
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
    UninitilizeUser: function () {
      return initialState;
    },
  },
});

export const {
  initializeUser,
  uninitializeUser,
  updateUser,
  setUserSocketId,
  UninitilizeUser,
} = userSlice.actions;
export default userSlice.reducer;
