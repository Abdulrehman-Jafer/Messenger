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
  isBlockedByReceiver: boolean;
  _id: string;
}

const initialState: {
  isInitialized: boolean;
  chats: ChatSpace[];
} = {
  isInitialized: false,
  chats: [],
};

const slice = createSlice({
  initialState,
  name: "chats",
  reducers: {
    initializeChatSpace: function (state, action: PayloadAction<any>) {
      state.isInitialized = true;
      state.chats = action.payload;
      return state;
    },

    addNewChat: function (state, action: PayloadAction<any>) {
      state.chats.push(action.payload);
      return state;
    },

    updateArchiveStatus: function (state, action: PayloadAction<any>) {
      const { chatspace_id, archive_status } = action.payload;
      const chatspace_index = state.chats.findIndex((s) => {
        return s._id == chatspace_id;
      });
      console.log({ chatspace_index, archive_status });
      state.chats[chatspace_index].isArchived = archive_status;
      console.log({ Update: state.chats[chatspace_index] });
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
      const chatspace_index = state.chats.findIndex((s) => {
        return s._id == chatspace_id;
      });
      state.chats[chatspace_index].receiver.connected_to.isTyping =
        typingStatus;
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
      state.chats[
        chat_space_related_to_user
      ].receiver.connected_to.lastLogin = 0;
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
        "";
      state.chats[chat_space_related_to_user].receiver.connected_to.lastLogin =
        Date.now();
      return state;
    },

    userBlockedHandler: function (state, action: PayloadAction<string>) {
      const public_number = action.payload;
      const chat_space_related_to_user = state.chats.findIndex(
        (c) => c.receiver.connected_to.public_number == public_number
      );
      if (chat_space_related_to_user == -1) return state;
      state.chats[chat_space_related_to_user].isBlockedByReceiver = true;
      state.chats[chat_space_related_to_user].receiver.connected_to.image = "";
      state.chats[
        chat_space_related_to_user
      ].receiver.connected_to.lastLogin = 999;
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
  userBlockedHandler,
} = slice.actions;
export default slice.reducer;
