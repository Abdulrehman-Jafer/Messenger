import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { User } from "./user-slice";
// import { toast } from "react-hot-toast";

interface Contact {
  _id: string;
  contact: Partial<User>;
  saved_as: string;
  saved_by: string;
}

export interface Message {
  _id: string;
  belongsTo: string;
  contentType: "text" | "video" | "image" | "uploading";
  content: string;
  sender: User;
  receiver: string;
  status: number;
  deletedFor: string[];
  deletedForEveryone: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChatSpace {
  sender: User;
  receiver: {
    connected_to: User & { isTyping?: boolean };
    contact: Contact;
    isSaved: boolean;
  };
  isArchived: boolean;
  _id: string;
}

const initialState: {
  isInitialized: boolean,
  chats:ChatSpace[]
} = {
isInitialized:false,
chats: []
};

const slice = createSlice({
  initialState,
  name: "chats",
  reducers: {
    initializeChatSpace: function (state, action: PayloadAction<any>) {
      state.isInitialized = true;
      state.chats = action.payload
      return state;
    },

    addNewChat: function (state, action: PayloadAction<any>) {
      state.chats.push(action.payload);
      return state;
    },

    updateArchiveStatus: function (state, action: PayloadAction<any>) {
      const { chatspace_id, isArchived } = action.payload;
      const chatspace_index = state.chats.findIndex((s) => {
        return s._id == chatspace_id;
      });
      state.chats[chatspace_index].isArchived = isArchived;
      return state;
    },

    updateContactInfo: function (state, action: PayloadAction<any>) {
      const { contact } = action.payload;
      const chatspace_index = state.chats.findIndex((s) => {
        return s.receiver.connected_to._id == contact._id;
      });

      state.chats[chatspace_index].receiver.isSaved = true;
      state.chats[chatspace_index].receiver.contact = action.payload;
      return state;
    },

    updateTypingStaus: function (state, action: PayloadAction<any>) {
      const { chatspace_id, typingStatus } = action.payload;
      console.log({ payload: action.payload });
      const chatspace_index = state.chats.findIndex((s) => {
        return s._id == chatspace_id;
      });
      state.chats[chatspace_index].receiver.connected_to.isTyping = typingStatus;
      return state;
    },

    updateUserOnlineStatusInChatspace: function (
      state,
      action: PayloadAction<any>
    ) {
      const onlineUser_id = action.payload.onlineUser_id;
      const chat_space_related_to_user = state.chats.findIndex(
        (c) => c.receiver.connected_to._id == onlineUser_id
      );
      if (chat_space_related_to_user == -1) return state;
      state.chats[chat_space_related_to_user].receiver.connected_to.socketId =
        action.payload.socketId;
      state.chats[chat_space_related_to_user].receiver.connected_to.lastLogin = 0;
      // toast(
      //   `${
      //     state.chats[chat_space_related_to_user].receiver.isSaved
      //       ? state.chats[chat_space_related_to_user].receiver.contact.saved_as
      //       : state.chats[chat_space_related_to_user].receiver.connected_to
      //           .public_number
      //   } is Online `
      // );
      return state;
    },

    updateUserOfflineStatusInChatspace: function (
      state,
      action: PayloadAction<string>
    ) {
      const socketId = action.payload;
      const chat_space_related_to_user = state.chats.findIndex(
        (c) => c.receiver.connected_to.socketId == socketId
      );
      console.log({ OFFLINE: "DISPATCHING", chat_space_related_to_user });
      if (chat_space_related_to_user == -1) return state;
      state.chats[chat_space_related_to_user].receiver.connected_to.socketId =
        action.payload;
      state.chats[chat_space_related_to_user].receiver.connected_to.lastLogin =
        Date.now();
      // toast(
      //   `${
      //     state.chats[chat_space_related_to_user].receiver.isSaved
      //       ? state.chats[chat_space_related_to_user].receiver.contact.saved_as
      //       : state.chats[chat_space_related_to_user].receiver.connected_to
      //           .public_number
      //   } is Offline`
      // );
      return state;
    },
  },
});

export const {
  initializeChatSpace,
  addNewChat,
  updateUserOnlineStatusInChatspace,
  updateUserOfflineStatusInChatspace,
  updateContactInfo,
  updateTypingStaus,
  updateArchiveStatus,
} = slice.actions;
export default slice.reducer;
