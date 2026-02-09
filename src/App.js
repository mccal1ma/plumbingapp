import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Error, Landing, Register, ProtectedRoute } from "./pages";
import {
  SharedLayout,
  Stats,
  AllJobs,
  AddJob,
  Profile,
  Notifications,
} from "./pages/dashboard";
import ManageEmployees from "./pages/dashboard/ManageEmployees";
import Analytics from "./pages/dashboard/Analytics";
import Calendar from "./pages/dashboard/Calendar";
import ContractorDashboard from "./pages/dashboard/ContractorDashboard";
import Messages from "./pages/dashboard/Messages";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <SharedLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Stats />} />
          <Route path="all-jobs" element={<AllJobs />} />
          <Route path="add-job" element={<AddJob />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="profile" element={<Profile />} />
          <Route path="manage-employees" element={<ManageEmployees />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="contractor-dashboard" element={<ContractorDashboard />} />
          <Route path="messages" element={<Messages />} />
        </Route>
        <Route path="/landing" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Error />} />
      </Routes>
      <ToastContainer position="top-center" />
    </BrowserRouter>
  );
}

export default App;
