import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { User } from "./user-slice";

interface Contact {
  _id: string;
  contact: string;
  saved_as: string;
  saved_by: string;
}

export interface ChatSpace {
  sender: User;
  receiver: {
    connected_to: User;
    contact: Contact;
    isSaved: boolean;
  };
  messages: any[]; // Assuming that messages is an array of any type
  _id: string;
}

const initialState: ChatSpace[] = [];

const slice = createSlice({
  initialState,
  name: "chats",
  reducers: {
    initializeChatSpace: (_, action: PayloadAction) => {
      return action.payload;
    },
  },
});

export const { initializeChatSpace } = slice.actions;
export default slice.reducer;
