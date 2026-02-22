import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface CounterState {
	value: number;
}

interface UserDetails {
	email?: string;
	password?: string;
}

interface GlobalFilters {
	globalSearch: string;
	globalDate: string;
}

type RootState = {
	value: number;
	currentUser: UserDetails | Record<string, unknown>;
	globalFilters: GlobalFilters;
};

const initialState: RootState = {
	value: 0,
	currentUser: {} as UserDetails,
	globalFilters: {
		globalSearch: "",
		globalDate: "",
	},
};

export const Reducers = createSlice({
	name: "Koa-ecomerce",
	initialState,
	reducers: {
		updateUserDetails: (state, action: PayloadAction<UserDetails>) => {
			state.currentUser = action.payload;
		},

		logoutUser: () => initialState,
		increment: (state) => {
			state.value += 1;
		},
		decrement: (state) => {
			state.value -= 1;
		},
		incrementByAmount: (state, action: PayloadAction<number>) => {
			state.value += action.payload;
		},
		setGlobalSearch: (state, action: PayloadAction<string>) => {
			state.globalFilters.globalSearch = action.payload;
		},
		setGlobalDate: (state, action: PayloadAction<string>) => {
			state.globalFilters.globalDate = action.payload;
		},
	},
});

export const {
	increment,
	decrement,
	incrementByAmount,
	updateUserDetails,
	logoutUser,
	setGlobalSearch,
	setGlobalDate,
} = Reducers.actions;

export default Reducers.reducer;
