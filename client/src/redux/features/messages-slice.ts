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
      console.log({ ADDING_TO_MESSAGE: chatspace_index });
      state[chatspace_index].messages.push(action.payload.newMessage);
      return state;
    },

    updateChatspaceMessage: function (state, action: PayloadAction<any>) {
      const { chatspace_id, tempId, mongo_message_id, messageStatus } =
        action.payload;
      const chatspaceIndex = state.findIndex(
        (c) => c.chatspace_id == chatspace_id
      );
      const messageIndex = state[chatspaceIndex].messages.findIndex(
        (m) => m._id == tempId
      );
      state[chatspaceIndex].messages[messageIndex]._id = mongo_message_id;
      state[chatspaceIndex].messages[messageIndex].status = 1;
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
