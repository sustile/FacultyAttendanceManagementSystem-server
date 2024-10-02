import { createSlice, configureStore } from "@reduxjs/toolkit";

const CONSTANTS = createSlice({
  name: "CONSTANTS",
  initialState: {
    // ip: "http://192.168.1.11:5001",
    ip: "http://26.206.91.243:5001",
  },
});

const USERDATA = createSlice({
  name: "USERDATA",
  initialState: {},
  reducers: {
    loadUserData(state, action) {
      return { ...action.payload };
    },
  },
});

const store = configureStore({
  reducer: {
    USERDATA: USERDATA.reducer,
    CONSTANTS: CONSTANTS.reducer,
  },
});

export const UserDataActions = USERDATA.actions;
export const ConstantsActions = CONSTANTS.actions;

export default store;
