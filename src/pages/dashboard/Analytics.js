import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import customFetch from "../../utils/axios";
import Wrapper from "../../assets/wrappers/DashboardFormPage";

const Analytics = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [jobStatusBreakdown, setJobStatusBreakdown] = useState([]);
  const [contractorWorkload, setContractorWorkload] = useState([]);
  const [assignmentStatus, setAssignmentStatus] = useState([]);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const [statusResp, workloadResp, assignmentResp] = await Promise.all([
        customFetch.get("/analytics/job-status"),
        customFetch.get("/analytics/contractor-workload"),
        customFetch.get("/analytics/assignment-status"),
      ]);

      setJobStatusBreakdown(statusResp.data.breakdown);
      setContractorWorkload(workloadResp.data.workload);
      setAssignmentStatus(assignmentResp.data.breakdown);
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Failed to fetch analytics");
    }
    setIsLoading(false);
  };

  return (
    <Wrapper>
      <div className="form">
        <h3>Analytics Dashboard</h3>

        {isLoading && <p>Loading analytics...</p>}

        {!isLoading && (
          <>
            {/* Job Status Breakdown */}
            <div style={{ marginBottom: "2rem" }}>
              <h4>Job Status Breakdown</h4>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid var(--grey-300)" }}>
                      <th style={{ padding: "0.5rem", textAlign: "left" }}>Status</th>
                      <th style={{ padding: "0.5rem", textAlign: "left" }}>Count</th>
                      <th style={{ padding: "0.5rem", textAlign: "left" }}>Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobStatusBreakdown.map((item, index) => (
                      <tr key={index} style={{ borderBottom: "1px solid var(--grey-200)" }}>
                        <td style={{ padding: "0.5rem", textTransform: "capitalize" }}>
                          {item.status}
                        </td>
                        <td style={{ padding: "0.5rem" }}>{item.count}</td>
                        <td style={{ padding: "0.5rem" }}>{item.percentage}%</td>
                      </tr>
                    ))}
                    {jobStatusBreakdown.length === 0 && (
                      <tr>
                        <td colSpan="3" style={{ padding: "1rem", textAlign: "center" }}>
                          No data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Assignment Status Breakdown */}
            <div style={{ marginBottom: "2rem" }}>
              <h4>Assignment Status Breakdown</h4>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid var(--grey-300)" }}>
                      <th style={{ padding: "0.5rem", textAlign: "left" }}>Assignment Status</th>
                      <th style={{ padding: "0.5rem", textAlign: "left" }}>Count</th>
                      <th style={{ padding: "0.5rem", textAlign: "left" }}>Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignmentStatus.map((item, index) => (
                      <tr key={index} style={{ borderBottom: "1px solid var(--grey-200)" }}>
                        <td style={{ padding: "0.5rem", textTransform: "capitalize" }}>
                          {item.assignmentStatus}
                        </td>
                        <td style={{ padding: "0.5rem" }}>{item.count}</td>
                        <td style={{ padding: "0.5rem" }}>{item.percentage}%</td>
                      </tr>
                    ))}
                    {assignmentStatus.length === 0 && (
                      <tr>
                        <td colSpan="3" style={{ padding: "1rem", textAlign: "center" }}>
                          No data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Contractor Workload */}
            <div style={{ marginBottom: "2rem" }}>
              <h4>Contractor Workload</h4>
              <p style={{ color: "var(--grey-500)", marginBottom: "1rem" }}>
                Sorted by total jobs (highest to lowest)
              </p>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid var(--grey-300)" }}>
                      <th style={{ padding: "0.5rem", textAlign: "left" }}>Contractor Name</th>
                      <th style={{ padding: "0.5rem", textAlign: "left" }}>Email</th>
                      <th style={{ padding: "0.5rem", textAlign: "center" }}>Total Jobs</th>
                      <th style={{ padding: "0.5rem", textAlign: "center" }}>Accepted</th>
                      <th style={{ padding: "0.5rem", textAlign: "center" }}>Pending</th>
                      <th style={{ padding: "0.5rem", textAlign: "center" }}>Rejected</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contractorWorkload.map((contractor, index) => (
                      <tr key={index} style={{ borderBottom: "1px solid var(--grey-200)" }}>
                        <td style={{ padding: "0.5rem" }}>{contractor.contractorName}</td>
                        <td style={{ padding: "0.5rem" }}>{contractor.contractorEmail}</td>
                        <td
                          style={{
                            padding: "0.5rem",
                            textAlign: "center",
                            fontWeight: "bold",
                          }}
                        >
                          {contractor.totalJobs}
                        </td>
                        <td
                          style={{
                            padding: "0.5rem",
                            textAlign: "center",
                            color: "var(--green-dark)",
                          }}
                        >
                          {contractor.accepted}
                        </td>
                        <td
                          style={{
                            padding: "0.5rem",
                            textAlign: "center",
                            color: "var(--primary-500)",
                          }}
                        >
                          {contractor.pending}
                        </td>
                        <td
                          style={{
                            padding: "0.5rem",
                            textAlign: "center",
                            color: "var(--red-dark)",
                          }}
                        >
                          {contractor.rejected}
                        </td>
                      </tr>
                    ))}
                    {contractorWorkload.length === 0 && (
                      <tr>
                        <td colSpan="6" style={{ padding: "1rem", textAlign: "center" }}>
                          No contractors found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <button
              className="btn"
              onClick={fetchAnalytics}
              style={{ marginTop: "1rem" }}
            >
              Refresh Data
            </button>
          </>
        )}
      </div>
    </Wrapper>
  );
};

export default Analytics;
