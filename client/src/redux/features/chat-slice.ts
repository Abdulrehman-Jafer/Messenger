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
    initializeChatSpace: function (_, action: PayloadAction) {
      return action.payload;
    },
    addMessage: function (state, action: PayloadAction<any>) {
      const chatspaceIndex = state.findIndex(
        (c) => c._id == action.payload.chatspace_id
      );
      state[chatspaceIndex].messages.push(action.payload.newMessage);
      return state;
    },
    updateMessageStatus: function (state, action: PayloadAction<any>) {
      const chatSpaceIndex = state.findIndex(
        (c) => c._id == action.payload.chatspace_id
      );
      const messageToBeReplace = state[chatSpaceIndex].messages.findIndex(
        (m) => m._id == action.payload.prevId
      );
      state[chatSpaceIndex].messages[messageToBeReplace] =
        action.payload.savedMessage;
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
      if (chat_space_related_to_user !== -1) {
        state[chat_space_related_to_user].receiver.connected_to.socketId =
          action.payload.socketId;
        return state;
      } else {
        return state;
      }
    },
  },
});

export const {
  initializeChatSpace,
  addMessage,
  updateMessageStatus,
  updateUserOnlineStatusInChatspace,
} = slice.actions;
export default slice.reducer;
