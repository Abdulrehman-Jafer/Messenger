import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { User } from "./user-slice";
import { toast } from "react-hot-toast";

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
  lastMessage: Message;
  _id: string;
}

const initialState: ChatSpace[] = [];

const slice = createSlice({
  initialState,
  name: "chats",
  reducers: {
    initializeChatSpace: function (_, action: PayloadAction) {
      return action.payload;
    },

    updateLastMessage: function (state, action: PayloadAction<any>) {
      const chatSpaceIndex = state.findIndex(
        (c) => c._id == action.payload.chatspace_id
      );
      state[chatSpaceIndex].lastMessage = action.payload.lastMessage;
      return state;
    },

    updateUserOnlineStatusInChatspace: function (
      state,
      action: PayloadAction<any>
    ) {
      const onlineUser_id = action.payload.onlineUser_id;
      const chat_space_related_to_user = state.findIndex(
        (c) => c.receiver.connected_to._id == onlineUser_id
      );
      console.log({ chat_space_related_to_user });
      if (chat_space_related_to_user == -1) return state;
      state[chat_space_related_to_user].receiver.connected_to.socketId =
        action.payload.socketId;
      state[chat_space_related_to_user].receiver.connected_to.lastLogin = 0;
      toast(
        `${
          state[chat_space_related_to_user].receiver.isSaved
            ? state[chat_space_related_to_user].receiver.contact.saved_as
            : state[chat_space_related_to_user].receiver.connected_to._id
        } is Online `
      );
      return state;
    },
    updateUserOfflineStatusInChatspace: function (
      state,
      action: PayloadAction<string>
    ) {
      const socketId = action.payload;
      const chat_space_related_to_user = state.findIndex(
        (c) => c.receiver.connected_to.socketId == socketId
      );
      console.log({ OFFLINE: "DISPATCHING", chat_space_related_to_user });
      if (chat_space_related_to_user == -1) return state;
      state[chat_space_related_to_user].receiver.connected_to.socketId =
        action.payload;
      state[chat_space_related_to_user].receiver.connected_to.lastLogin =
        Date.now();
      toast(
        `${
          state[chat_space_related_to_user].receiver.isSaved
            ? state[chat_space_related_to_user].receiver.contact.saved_as
            : state[chat_space_related_to_user].receiver.connected_to._id
        } is Offline`
      );
      return state;
    },
  },
});

export const {
  initializeChatSpace,
  updateLastMessage,
  updateUserOnlineStatusInChatspace,
  updateUserOfflineStatusInChatspace,
} = slice.actions;
export default slice.reducer;
