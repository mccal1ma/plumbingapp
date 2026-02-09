import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import customFetch from "../../utils/axios";

const initialState = {
  isLoading: false,
  notifications: [],
  unreadCount: 0,
};

export const getNotifications = createAsyncThunk(
  "notifications/getNotifications",
  async (_, thunkAPI) => {
    try {
      const resp = await customFetch.get("/notifications");
      return resp.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

export const getUnreadCount = createAsyncThunk(
  "notifications/getUnreadCount",
  async (_, thunkAPI) => {
    try {
      const resp = await customFetch.get("/notifications/unread-count");
      return resp.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

export const markAsRead = createAsyncThunk(
  "notifications/markAsRead",
  async (id, thunkAPI) => {
    try {
      const resp = await customFetch.patch(`/notifications/${id}`);
      thunkAPI.dispatch(getUnreadCount());
      return resp.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

export const markAllAsRead = createAsyncThunk(
  "notifications/markAllAsRead",
  async (_, thunkAPI) => {
    try {
      await customFetch.patch("/notifications/mark-all-read");
      thunkAPI.dispatch(getNotifications());
      thunkAPI.dispatch(getUnreadCount());
      return;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

export const deleteNotification = createAsyncThunk(
  "notifications/deleteNotification",
  async (id, thunkAPI) => {
    try {
      await customFetch.delete(`/notifications/${id}`);
      toast.success("Notification deleted");
      thunkAPI.dispatch(getNotifications());
      thunkAPI.dispatch(getUnreadCount());
      return;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg);
    }
  }
);

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getNotifications.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getNotifications.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.notifications = payload.notifications;
      })
      .addCase(getNotifications.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(payload);
      })
      .addCase(getUnreadCount.fulfilled, (state, { payload }) => {
        state.unreadCount = payload.count;
      })
      .addCase(markAsRead.fulfilled, (state, { payload }) => {
        const index = state.notifications.findIndex(
          (notif) => notif._id === payload.notification._id
        );
        if (index !== -1) {
          state.notifications[index] = payload.notification;
        }
      })
      .addCase(deleteNotification.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteNotification.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteNotification.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(payload);
      });
  },
});

export const { clearNotifications } = notificationsSlice.actions;
export default notificationsSlice.reducer;
