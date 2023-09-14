import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface User {
  _id: string;
  provider: "Google" | "Custom";
  name: string;
  email: string;
  image: string;
  blocked_user: string[];
  blocked_by: string[];
  lastLogin: number;
  userToken: string;
  socketId: string | undefined;
  public_number: string;
}

const initialState: User & { isInitiailized: boolean } = {
  _id: "",
  provider: "Google",
  name: "",
  email: "",
  image: "",
  blocked_user: [],
  blocked_by: [],
  lastLogin: 0,
  userToken: "",
  socketId: "",
  public_number: "",
  isInitiailized: false,
};

const userSlice = createSlice({
  name: "User",
  initialState,
  reducers: {
    initializeUser: function (_, action: PayloadAction<User>) {
      return { ...action.payload, isInitiailized: true };
    },

    updateUser: function (state, action: PayloadAction<User>) {
      return { ...state, ...action.payload };
    },

    setUserSocketId: function (state, action: PayloadAction<string>) {
      return { ...state, socketId: action.payload };
    },
    addToBlockedUser: function (state, action: PayloadAction<string>) {
      state.blocked_user.push(action.payload);
      return state;
    },
    removeFromBlockedUser: function (state, action: PayloadAction<string>) {
      state.blocked_user.forEach((pn, index) => {
        if (pn == action.payload) {
          state.blocked_user.splice(index, 1);
        }
      });
      return state;
    },
    addToBlockedBy: function (state, action: PayloadAction<string>) {
      state.blocked_by.push(action.payload);
      return state;
    },
    removeFromBlockedBy: function (state, action: PayloadAction<string>) {
      state.blocked_by.forEach((pn, index) => {
        if (pn == action.payload) {
          state.blocked_by.splice(index, 1);
        }
        return state;
      });
    },
    UninitializeUser: function () {
      return initialState;
    },
  },
});

export const {
  initializeUser,
  updateUser,
  setUserSocketId,
  UninitializeUser,
  addToBlockedBy,
  addToBlockedUser,
  removeFromBlockedBy,
  removeFromBlockedUser,
} = userSlice.actions;
export default userSlice.reducer;
