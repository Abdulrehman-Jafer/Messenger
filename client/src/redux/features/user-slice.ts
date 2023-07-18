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
};

const userSlice = createSlice({
  name: "User",
  initialState,
  reducers: {
    initializeUser: function (state, action: PayloadAction<User>) {
      return (state = action.payload);
    },
    uninitializeUser: function () {
      return initialState;
    },
    updateUser: function (state, action: PayloadAction<User>) {
      return { ...state, ...action.payload };
    },
  },
});

export const { initializeUser, uninitializeUser, updateUser } =
  userSlice.actions;
export default userSlice.reducer;
