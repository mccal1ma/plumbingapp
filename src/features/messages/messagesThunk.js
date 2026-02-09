import customFetch from "../../utils/axios";

export const sendMessageThunk = async (messageData, thunkAPI) => {
  try {
    const resp = await customFetch.post("/messages", messageData);
    return resp.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.msg);
  }
};

export const getJobMessagesThunk = async (jobId, thunkAPI) => {
  try {
    const resp = await customFetch.get(`/messages/job/${jobId}`);
    return resp.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.msg);
  }
};

export const getDirectMessagesThunk = async (_, thunkAPI) => {
  try {
    const resp = await customFetch.get("/messages/direct");
    return resp.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.msg);
  }
};

export const getConversationThunk = async (userId, thunkAPI) => {
  try {
    const resp = await customFetch.get(`/messages/conversation/${userId}`);
    return resp.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.msg);
  }
};

export const getEmployeesForMessagingThunk = async (_, thunkAPI) => {
  try {
    const resp = await customFetch.get("/employees/messaging");
    return resp.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.msg);
  }
};

export const deleteMessageThunk = async (messageId, thunkAPI) => {
  try {
    const resp = await customFetch.delete(`/messages/${messageId}`);
    return resp.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.msg);
  }
};
