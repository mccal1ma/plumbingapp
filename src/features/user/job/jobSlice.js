import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import {createJobThunk, deleteJobThunk, editJobThunk} from "./jobThunk";

const initialState = {
  isLoading: false,
  customerName: "",
  status: "active",
  jobType: "standard",
  statusOptions: [
    "active",
    "in progress",
    "completed",
    "payment pending",
    "declined",
  ],
  jobTypeOptions: ["emergency", "standard", "preventive"],
  location: "",
  date: "",
  description: "",
  employeeAssigned: "",
  isEditing: false,
  editJobId: "",
};

export const createJob = createAsyncThunk(
  "job/createJob",
  createJobThunk
);

export const editJob = createAsyncThunk(
  "job/editJob",
  editJobThunk
);

export const deleteJob = createAsyncThunk(
  "job/deleteJob",
  deleteJobThunk
);

const jobSlice = createSlice({
  name: "job",
  initialState,
  reducers: {
    handleChange: (state, { payload: { name, value } }) => {
      state[name] = value;
    },
    clearValues: (state) => {
      return {
        ...initialState,
      };
    },
    setEditJob: (state, { payload }) => {
      return { ...state, isEditing: true, ...payload };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createJob.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createJob.fulfilled, (state) => {
        state.isLoading = false;
        toast.success("Job Created Successfully!");
      })
      .addCase(createJob.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error("Error: " + payload);
      })
      .addCase(deleteJob.fulfilled, (state) => {
        toast.success("Job Deleted Successfully!");
      })
      .addCase(deleteJob.rejected, (state, { payload }) => {
        toast.error("Error: " + payload);
      }).addCase(editJob.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(editJob.fulfilled, (state) => {
        state.isLoading = false;
        toast.success("Job Modified Successfully!");
      })
      .addCase(editJob.rejected, (state, { payload }) => {
        state.isLoading = false;
        toast.error("Error: " + payload);
      });
  },
});

export const { handleChange, clearValues, setEditJob } = jobSlice.actions;

export default jobSlice.reducer;
