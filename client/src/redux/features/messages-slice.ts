import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Message } from "./chat-slice";
import notificatioSound from "../../assets/whatssapp_web.mp3";
import { store } from "../store";

interface ChatspacesMessages {
  chatspace_id: string;
  messages: Message[];
}

const initialState: {
  isInitialized: boolean;
  chatspacesMessages: ChatspacesMessages[];
} = {
  isInitialized: false,
  chatspacesMessages: [],
};

const slice = createSlice({
  initialState,
  name: "Chatspace_Messages",
  reducers: {
    initializeChatspaceMessages: function (state, action: PayloadAction<any>) {
      state.isInitialized = true;
      state.chatspacesMessages = action.payload;
      return state;
    },

    addMessagesInChatspace: function (state, action: PayloadAction<any>) {
      if (action.payload.creatingNewChatspace) {
        const newChatspaceMessage = {
          chatspace_id: action.payload.chatspace_id,
          messages: [action.payload.newMessage],
        };
        state.chatspacesMessages.push(newChatspaceMessage);
        return state;
      } else {
        const chatspace_index = state.chatspacesMessages.findIndex((c) => {
          return c.chatspace_id == action.payload.chatspace_id;
        });
        if (chatspace_index < 0) return alert("Chat space not found!");
        state.chatspacesMessages[chatspace_index].messages.push(
          action.payload.newMessage
        );
        return state;
      }
    },

    removeChatspaceMessages: function (state, action: PayloadAction<string>) {
      const chatspace_id = action.payload;
      const chatspace_index = state.chatspacesMessages.findIndex(
        (s) => s.chatspace_id == chatspace_id
      );
      console.log({ chatspace_index, chatspace_id });
      state.chatspacesMessages[chatspace_index].messages = [];
      return state;
    },

    updateChatspaceMessage: function (state, action: PayloadAction<any>) {
      const { chatspace_id, tempId, modifiedMessage } = action.payload;
      const chatspaceIndex = state.chatspacesMessages.findIndex(
        (c) => c.chatspace_id == chatspace_id
      );
      const messageIndex = state.chatspacesMessages[
        chatspaceIndex
      ].messages.findIndex((m) => m._id == tempId);
      console.log({ messageIndex, chatspaceIndex, modifiedMessage });
      state.chatspacesMessages[chatspaceIndex].messages[messageIndex] =
        modifiedMessage;
      return state;
    },

    deleteMessage: function (state, action: PayloadAction<any>) {
      const chatspaceIndex = state.chatspacesMessages.findIndex(
        (s) => s.chatspace_id == action.payload.chatspace_id
      );
      const messageIndex = state.chatspacesMessages[
        chatspaceIndex
      ].messages.findIndex((m) => m._id == action.payload.message_id);
      if (action.payload.deletedForEveryone) {
        state.chatspacesMessages[chatspaceIndex].messages[
          messageIndex
        ].content = "";
        state.chatspacesMessages[chatspaceIndex].messages[
          messageIndex
        ].deletedForEveryone = true;
        return state;
      }
      state.chatspacesMessages[chatspaceIndex].messages.splice(messageIndex, 1);
      return state;
    },
  },
});

export const {
  initializeChatspaceMessages,
  addMessagesInChatspace,
  updateChatspaceMessage,
  deleteMessage,
  removeChatspaceMessages,
} = slice.actions;

export default slice.reducer;
