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
    add_to_blocked_User: function (state, action: PayloadAction<string>) {
      state.blocked_user = [...state.blocked_user, action.payload];
      return state;
    },
    add_to_blocked_By: function (state, action: PayloadAction<string>) {
      state.blocked_by = [...state.blocked_by, action.payload];
      return state;
    },
    remove_from_blocked_User: function (state, action: PayloadAction<string>) {
      const filtered_block_user_list = state.blocked_user.filter(
        (pn) => pn !== action.payload
      );
      console.log({ filtered_block_user_list });
      state.blocked_user = filtered_block_user_list;
      return state;
    },
    remove_from_blocked_By: function (state, action: PayloadAction<string>) {
      const filtered_block_by_list = state.blocked_by.filter(
        (pn) => pn !== action.payload
      );
      console.log({ filtered_block_by_list });
      state.blocked_by = filtered_block_by_list;
      return state;
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
  add_to_blocked_By,
  add_to_blocked_User,
  remove_from_blocked_User,
  remove_from_blocked_By,
} = userSlice.actions;
export default userSlice.reducer;
