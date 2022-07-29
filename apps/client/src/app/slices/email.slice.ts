import {
  createSlice,
} from '@reduxjs/toolkit';
import { act } from '@testing-library/react-native';

export const EMAIL = 'email';

export const emailSlice = createSlice({
  name: EMAIL,
  initialState: {email:"John@test"},
  reducers: {
    setEmail: (state,action) => {state.email = action.payload;return state}
  },
});

export const {actions, reducer} = emailSlice

export const {setEmail} = actions

//export default reducer

export const selectEmail = (state: {email: string;}) => state.email