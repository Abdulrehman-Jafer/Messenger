import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { User } from "./user-slice";

export interface Contact {
  _id: string;
  contact: Partial<User>;
  saved_as: string;
  saved_by: string;
  public_number: string;
}
const initialState: {
  isInitialized: boolean,
  contacts:Contact[]
} = {
  isInitialized: false,
  contacts:[]
};

const Slice = createSlice({
  initialState,
  name: "Contact",
  reducers: {
    initializeContacts: (state, action) => {
      state.isInitialized = true;
      state.contacts = action.payload
      return state;
    },

    addToContacts: (state, action: PayloadAction<any>) => {
      state.contacts.push(action.payload);
      return state;
    },

    updateContactOnlineStatus: (state, action: PayloadAction<any>) => {
      const contactIndex = state.contacts.findIndex((c) => {
        return c.contact._id == action.payload._id;
      });
      if (contactIndex > -1) {
        state.contacts[contactIndex].contact = action.payload;
      }
      return state;
    },

    updateContactOfflineStatus: (state, action: PayloadAction<any>) => {
      const contactIndex = state.contacts.findIndex((c) => {
        return c.contact.socketId == action.payload;
      });
      if (contactIndex > -1) {
        state.contacts[contactIndex].contact.lastLogin = Date.now();
        state.contacts[contactIndex].contact.socketId = "";
      }
      return state;
    },
  },
});

export const {
  initializeContacts,
  addToContacts,
  updateContactOnlineStatus,
  updateContactOfflineStatus,
} = Slice.actions;
export default Slice.reducer;
