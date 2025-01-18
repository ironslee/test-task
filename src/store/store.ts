import { configureStore } from "@reduxjs/toolkit";
import { signInReducer } from "../components/SignIn";
import { nomenclatureReducer } from "../pages/Nomenclature";

const store = configureStore({
  reducer: {
    signInStore: signInReducer,
    nomenclatureStore: nomenclatureReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
