import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import customFetch from "../../utils/axios";
import { FormRow, FormRowSelect } from "../../components";
import { formatPhoneNumber, formatPhoneInput, stripPhoneFormatting } from "../../utils/phoneFormatter";
import Wrapper from "../../assets/wrappers/DashboardFormPage";

const ManageEmployees = () => {
  const { user } = useSelector((store) => store.user);
  const [isLoading, setIsLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    password: "",
    role: "receptionist",
    lastName: "",
    location: "",
    phone: "",
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const { data } = await customFetch.get("/employees");
      setEmployees(data.employees);
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Failed to fetch employees");
    }
    setIsLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Format phone number as user types
    if (name === 'phone') {
      setFormData({ ...formData, [name]: formatPhoneInput(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (editingEmployee) {
        const submitData = { ...formData, phone: stripPhoneFormatting(formData.phone) };
        await customFetch.patch(`/employees/${editingEmployee._id}`, submitData);
        toast.success("Employee updated successfully");
      } else {
        if (!formData.firstName || !formData.email || !formData.password || !formData.role) {
          toast.error("Please fill in all required fields");
          setIsLoading(false);
          return;
        }
        const submitData = { ...formData, phone: stripPhoneFormatting(formData.phone) };
        await customFetch.post("/employees", submitData);
        toast.success("Employee created successfully");
      }
      fetchEmployees();
      resetForm();
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Operation failed");
    }
    setIsLoading(false);
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setFormData({
      firstName: employee.firstName,
      email: employee.email,
      password: "",
      role: employee.role,
      lastName: employee.lastName || "",
      location: employee.location || "",
      phone: formatPhoneNumber(employee.phone) || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;

    setIsLoading(true);
    try {
      await customFetch.delete(`/employees/${id}`);
      toast.success("Employee deleted successfully");
      fetchEmployees();
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Failed to delete employee");
    }
    setIsLoading(false);
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      email: "",
      password: "",
      role: "receptionist",
      lastName: "",
      location: "",
      phone: "",
    });
    setEditingEmployee(null);
    setShowForm(false);
  };

  return (
    <Wrapper>
      <div className="form">
        <h3>Manage Employees</h3>

        {!showForm && (
          <button
            className="btn btn-block"
            onClick={() => setShowForm(true)}
            disabled={isLoading}
          >
            Add New Employee
          </button>
        )}

        {showForm && (
          <form onSubmit={handleSubmit}>
            <h4>{editingEmployee ? "Edit Employee" : "Create New Employee"}</h4>

            <div className="form-center">
              <FormRow
                type="text"
                name="firstName"
                value={formData.firstName}
                handleChange={handleChange}
                labelText="First Name"
              />
              <FormRow
                type="text"
                name="lastName"
                value={formData.lastName}
                handleChange={handleChange}
                labelText="Last Name"
              />
              <FormRow
                type="email"
                name="email"
                value={formData.email}
                handleChange={handleChange}
              />
              <FormRow
                type="password"
                name="password"
                value={formData.password}
                handleChange={handleChange}
                labelText={editingEmployee ? "Password (leave blank to keep current)" : "Password"}
              />
              <FormRowSelect
                name="role"
                value={formData.role}
                handleChange={handleChange}
                list={["admin", "receptionist", "contractor"]}
              />
              <FormRow
                type="text"
                name="location"
                value={formData.location}
                handleChange={handleChange}
              />
              <FormRow
                type="tel"
                name="phone"
                value={formData.phone}
                handleChange={handleChange}
                labelText="Phone Number"
              />

              <div className="btn-container">
                <button type="submit" className="btn btn-block" disabled={isLoading}>
                  {isLoading ? "Loading..." : editingEmployee ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  className="btn btn-block clear-btn"
                  onClick={resetForm}
                  disabled={isLoading}
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        )}

        <div style={{ marginTop: "2rem" }}>
          <h4>Employees ({employees.length})</h4>
          {isLoading && <p>Loading...</p>}
          {!isLoading && employees.length === 0 && <p>No employees found</p>}
          
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--grey-300)" }}>
                  <th style={{ padding: "0.5rem", textAlign: "left" }}>Name</th>
                  <th style={{ padding: "0.5rem", textAlign: "left" }}>Email</th>
                  <th style={{ padding: "0.5rem", textAlign: "left" }}>Phone</th>
                  <th style={{ padding: "0.5rem", textAlign: "left" }}>Role</th>
                  <th style={{ padding: "0.5rem", textAlign: "left" }}>Location</th>
                  <th style={{ padding: "0.5rem", textAlign: "left" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <tr key={employee._id} style={{ borderBottom: "1px solid var(--grey-200)" }}>
                    <td style={{ padding: "0.5rem" }}>
                      {employee.firstName} {employee.lastName}
                    </td>
                    <td style={{ padding: "0.5rem" }}>{employee.email}</td>
                    <td style={{ padding: "0.5rem" }}>
                      {employee.phone ? (
                        <a href={`tel:${employee.phone}`} style={{ color: "var(--primary-500)", textDecoration: "none" }}>
                          {formatPhoneNumber(employee.phone)}
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td style={{ padding: "0.5rem" }}>
                      <span
                        style={{
                          padding: "0.25rem 0.5rem",
                          borderRadius: "4px",
                          backgroundColor:
                            employee.role === "admin"
                              ? "#f0ad4e"
                              : employee.role === "receptionist"
                              ? "#5bc0de"
                              : "#5cb85c",
                          color: "white",
                          fontSize: "0.85rem",
                        }}
                      >
                        {employee.role}
                      </span>
                    </td>
                    <td style={{ padding: "0.5rem" }}>{employee.location || "-"}</td>
                    <td style={{ padding: "0.5rem" }}>
                      <button
                        onClick={() => handleEdit(employee)}
                        style={{
                          marginRight: "0.5rem",
                          padding: "0.25rem 0.5rem",
                          background: "var(--primary-500)",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                        disabled={isLoading}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(employee._id)}
                        style={{
                          padding: "0.25rem 0.5rem",
                          background: "var(--red-dark)",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                        disabled={isLoading || employee._id === user._id}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default ManageEmployees;
