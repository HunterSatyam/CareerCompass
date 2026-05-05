import { createSlice } from "@reduxjs/toolkit";

const sysAdminSlice = createSlice({
    name: "sysadmin",
    initialState: {
        adminUser: null,
    },
    reducers: {
        setAdminUser: (state, action) => {
            state.adminUser = action.payload;
        }
    }
});
export const { setAdminUser } = sysAdminSlice.actions;
export default sysAdminSlice.reducer;
