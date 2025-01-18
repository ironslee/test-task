import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Tokens } from "../../types/User";

interface SignInState {
  tokens: Tokens;
}

const initialState: SignInState = {
  tokens: {
    access_token: "",
  },
};

export const signInSlice = createSlice({
  name: "signIn",
  initialState,
  reducers: {
    setTokens: (state, data: PayloadAction<Tokens>) => {
      state.tokens = data.payload;
    },
    clearStore: (state) => {
      state.tokens.access_token = "";

      return state;
    },
  },
});

export const { clearStore, setTokens } = signInSlice.actions;

export default signInSlice.reducer;
