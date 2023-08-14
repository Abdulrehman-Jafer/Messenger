import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { User } from "./user-slice";

export interface Contact {
  _id: string;
  contact: Partial<User>;
  saved_as: string;
  saved_by: string;
  public_number: string;
}
const initialState: Contact[] = [];

const Slice = createSlice({
  initialState,
  name: "Contact",
  reducers: {
    setGlobalContacts: (_, action) => {
      return action.payload;
    },

    addToContacts: (state, action: PayloadAction<any>) => {
      state.push(action.payload);
      return state;
    },

    updateContactOnlineStatus: (state, action: PayloadAction<any>) => {
      const contactIndex = state.findIndex((c) => {
        return c.contact._id == action.payload._id;
      });
      if (contactIndex > -1) {
        state[contactIndex].contact = action.payload;
      }
      return state;
    },

    updateContactOfflineStatus: (state, action: PayloadAction<any>) => {
      const contactIndex = state.findIndex((c) => {
        return c.contact.socketId == action.payload;
      });
      if (contactIndex > -1) {
        state[contactIndex].contact.lastLogin = Date.now();
        state[contactIndex].contact.socketId = "";
      }
      return state;
    },
  },
});

export const {
  setGlobalContacts,
  addToContacts,
  updateContactOnlineStatus,
  updateContactOfflineStatus,
} = Slice.actions;
export default Slice.reducer;
