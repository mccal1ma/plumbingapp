import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import {
  sendMessageThunk,
  getJobMessagesThunk,
  getDirectMessagesThunk,
  getConversationThunk,
  getEmployeesForMessagingThunk,
  deleteMessageThunk,
} from "./messagesThunk";

const initialState = {
  isLoading: false,
  messages: [],
  directMessages: [],
  employees: [],
  activeConversationUserId: null,
  showMessageModal: false,
};

export const sendMessage = createAsyncThunk(
  "messages/sendMessage",
  sendMessageThunk
);

export const getJobMessages = createAsyncThunk(
  "messages/getJobMessages",
  getJobMessagesThunk
);

export const getDirectMessages = createAsyncThunk(
  "messages/getDirectMessages",
  getDirectMessagesThunk
);

export const getConversation = createAsyncThunk(
  "messages/getConversation",
  getConversationThunk
);

export const getEmployeesForMessaging = createAsyncThunk(
  "messages/getEmployeesForMessaging",
  getEmployeesForMessagingThunk
);

export const deleteMessage = createAsyncThunk(
  "messages/deleteMessage",
  deleteMessageThunk
);

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.messages = [];
    },
    setActiveConversation: (state, { payload }) => {
      state.activeConversationUserId = payload;
    },
    toggleMessageModal: (state) => {
      state.showMessageModal = !state.showMessageModal;
    },
  },
  extraReducers: (builder) => {
    builder
      // Send Message
      .addCase(sendMessage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(sendMessage.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        toast.success("Message sent successfully!");
      })
      .addCase(sendMessage.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(payload || "Error sending message");
      })
      // Get Job Messages
      .addCase(getJobMessages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getJobMessages.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.messages = payload.messages;
      })
      .addCase(getJobMessages.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(payload || "Error fetching messages");
      })
      // Get Direct Messages
      .addCase(getDirectMessages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getDirectMessages.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.directMessages = payload.messages;
      })
      .addCase(getDirectMessages.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(payload || "Error fetching direct messages");
      })
      // Get Conversation
      .addCase(getConversation.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getConversation.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.messages = payload.messages;
      })
      .addCase(getConversation.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(payload || "Error fetching conversation");
      })
      // Get Employees For Messaging
      .addCase(getEmployeesForMessaging.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getEmployeesForMessaging.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.employees = payload.employees;
      })
      .addCase(getEmployeesForMessaging.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(payload || "Error fetching employees");
      })
      // Delete Message
      .addCase(deleteMessage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteMessage.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        toast.success("Message deleted successfully!");
      })
      .addCase(deleteMessage.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error(payload || "Error deleting message");
      });
  },
});

export const { clearMessages, setActiveConversation, toggleMessageModal } = messagesSlice.actions;

export default messagesSlice.reducer;
