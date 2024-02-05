import { configureStore } from "@reduxjs/toolkit";
import AllReducer from "@/services/reducers";

export const store = configureStore({
	reducer: AllReducer,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
