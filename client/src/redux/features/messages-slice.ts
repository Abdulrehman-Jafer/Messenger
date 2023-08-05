import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Message } from "./chat-slice";

interface ChatspacesMessages {
  chatspace_id: string;
  messages: Message[];
}

const initialState: ChatspacesMessages[] = [];

const slice = createSlice({
  initialState,
  name: "Chatspace_Messages",
  reducers: {
    setAllChatSpaceMessage: function (state, action: PayloadAction<any>) {
      state = action.payload;
      return state;
    },

    addMessagesInChatspace: function (state, action: PayloadAction<any>) {
      const chatspace_index = state.findIndex(
        (c) => c.chatspace_id == action.payload.chatspace_id
      );
      state[chatspace_index].messages.push(action.payload.newMessage);
      return state;
    },

    updateChatspaceMessage: function (state, action: PayloadAction<any>) {
      const { chatspace_id, messageId, message } = action.payload;
      const chatspaceIndex = state.findIndex(
        (c) => c.chatspace_id == chatspace_id
      );
      const messageIndex = state[chatspaceIndex].messages.findIndex(
        (m) => m._id == messageId
      );
      state[chatspaceIndex].messages[messageIndex] = message;
      return state;
    },
  },
});

export const {
  setAllChatSpaceMessage,
  addMessagesInChatspace,
  updateChatspaceMessage,
} = slice.actions;

export default slice.reducer;
