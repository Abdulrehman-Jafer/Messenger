import { createSlice } from "@reduxjs/toolkit";
import { User } from "./user-slice";

interface Contact {
  _id: string;
  contact: Partial<User>;
  saved_as: string;
  saved_by: string;
}
const initialState: Contact[] = [];

const Slice = createSlice({
  initialState,
  name: "Contact",
  reducers: {
    setGlobalContacts: (_, action) => {
      return action.payload;
    },
  },
});

export const { setGlobalContacts } = Slice.actions;
export default Slice.reducer;
