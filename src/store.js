import { configureStore } from '@reduxjs/toolkit';
import userSlice from './features/user/userSlice';
import jobSlice from './features/user/job/jobSlice';
import allJobsSlice from './features/allJobs/allJobsSlice';
import notificationsSlice from './features/notifications/notificationsSlice';
import messagesSlice from './features/messages/messagesSlice';


export const store = configureStore({ 
  reducer: {
    user: userSlice,
    job: jobSlice,
    allJobs: allJobsSlice,
    notifications: notificationsSlice,
    messages: messagesSlice,
  },
});
