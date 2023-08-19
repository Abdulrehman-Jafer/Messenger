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
      if (chatspace_index < 0) return alert("Chat space not found!");
      console.log({ payload: action.payload });
      console.log({ ADDING_TO_MESSAGE: chatspace_index });
      state[chatspace_index].messages.push(action.payload.newMessage);
      return state;
    },

    updateChatspaceMessage: function (state, action: PayloadAction<any>) {
      const { chatspace_id, tempId, modifiedMessage } = action.payload;
      const chatspaceIndex = state.findIndex(
        (c) => c.chatspace_id == chatspace_id
      );
      const messageIndex = state[chatspaceIndex].messages.findIndex(
        (m) => m._id == tempId
      );
      console.log({ messageIndex, chatspaceIndex, modifiedMessage });
      state[chatspaceIndex].messages[messageIndex] = modifiedMessage;
      return state;
    },

    deleteMessage: function (state, action: PayloadAction<any>) {
      const chatspaceIndex = state.findIndex(
        (s) => s.chatspace_id == action.payload.chatspace_id
      );
      const messageIndex = state[chatspaceIndex].messages.findIndex(
        (m) => m._id == action.payload.message_id
      );
      if (action.payload.deletedForEveryone) {
        state[chatspaceIndex].messages[messageIndex].content = "";
        state[chatspaceIndex].messages[messageIndex].deletedForEveryone = true;
        return state;
      }
      state[chatspaceIndex].messages.splice(messageIndex, 1);
      return state;
    },
  },
});

export const {
  setAllChatSpaceMessage,
  addMessagesInChatspace,
  updateChatspaceMessage,
  deleteMessage,
} = slice.actions;

export default slice.reducer;
