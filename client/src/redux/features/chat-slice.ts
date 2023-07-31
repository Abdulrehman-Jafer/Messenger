import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { User } from "./user-slice";

interface Contact {
  _id: string;
  contact: string;
  saved_as: string;
  saved_by: string;
}

export interface Message {
  _id: string;
  belongsTo: string;
  content: string;
  sender: User;
  receiver: string;
  status: number;
  deletedFor: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ChatSpace {
  sender: User;
  receiver: {
    connected_to: User;
    contact: Contact;
    isSaved: boolean;
  };
  messages: Message[];
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
