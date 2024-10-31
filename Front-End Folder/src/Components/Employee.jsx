import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Employee = () => {
  const [employee, setEmployee] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [notification, setNotification] = useState(""); // State for notification
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [noResults, setNoResults] = useState(false); // State for no results message

  useEffect(() => {
    // Fetch all employees on component mount
    axios
      .get("http://localhost:3000/auth/employee")
      .then((result) => {
        if (result.data.Status) {
          setEmployee(result.data.Result);
          setFilteredEmployees(result.data.Result); // Initialize filtered employees
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleDelete = (id) => {
    setDeletingId(id);
    setShowModal(true);
  };

  const confirmDelete = () => {
    axios
      .delete("http://localhost:3000/auth/delete_employee/" + deletingId)
      .then((result) => {
        if (result.data.Status) {
          setNotification("Employee deleted successfully!"); // Set notification message
          setEmployee((prev) => prev.filter((emp) => emp.id !== deletingId));
          setFilteredEmployees((prev) =>
            prev.filter((emp) => emp.id !== deletingId)
          ); // Update filtered employees
          setShowModal(false);
          setTimeout(() => setNotification(""), 3000); // Clear notification after 3 seconds
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleSearch = async (event) => {
    const query = event.target.value; // Get the search query from the input
    setSearchQuery(query);

    if (query) {
      try {
        const response = await axios.get(
          `http://localhost:3000/auth/search_employee`,
          {
            params: { query },
          }
        );

        console.log("Search Query:", query);
        console.log("API Response:", response.data);

        setFilteredEmployees(response.data.Result); // Update the filtered employees based on the response
        setNoResults(response.data.Result.length === 0); // Set no results state
      } catch (error) {
        console.error("Error fetching search results:", error);
        setNoResults(true); // If there's an error, assume no results
      }
    } else {
      setFilteredEmployees(employee); // Reset if search query is empty
      setNoResults(false); // Reset no results state
    }
  };

  return (
    <div className="container mt-3">
      {/* Notification for successful deletion */}
      {notification && (
        <div className="alert alert-success" role="alert">
          {notification}
        </div>
      )}
      <div className="text-center mb-4">
        <h3>Employee List</h3>
      </div>

      {/* Search Input */}
      <div className="mb-3 d-flex justify-content-end">
        <div className="input-group" style={{ width: "300px" }}>
          <span className="input-group-text">
            <i className="fas fa-search" aria-hidden="true"></i>
          </span>
          <input
            type="text"
            placeholder="Search employees..."
            className="form-control"
            value={searchQuery}
            onChange={handleSearch} // Call handleSearch on input change
          />
        </div>
      </div>

      {/* No Results Message */}
      {noResults && (
        <div className="alert alert-warning">No results found.</div>
      )}

      <div className="table-responsive">
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>Image</th>
              <th>Email</th>
              <th>Address</th>
              <th>Salary</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((e) => (
              <tr key={e.id}>
                <td>{e.name}</td>
                <td>
                  <img
                    src={`http://localhost:3000/Images/` + e.image}
                    className="employee_image img-fluid" // Responsive image class
                    alt={e.name}
                    style={{ maxWidth: "100px" }} // Set a max width for images
                  />
                </td>
                <td>{e.email}</td>
                <td>{e.address}</td>
                <td>${e.salary}</td>
                <td>
                  <Link
                    to={`/dashboard/edit_employee/` + e.id}
                    className="btn btn-info btn-sm edit-button" // Add custom class
                    style={{ width: "70px" }}
                  >
                    Edit
                  </Link>
                  <button
                    className="btn btn-warning btn-sm delete-button" // Add custom class
                    style={{
                      width: "70px",
                      backgroundColor: "rgb(208, 28, 28)",
                    }}
                    onClick={() => handleDelete(e.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Employee Button at Bottom Left */}
      <div className="d-flex justify-content-start mb-3 mt-3">
        <Link to="/dashboard/add_employee" className="btn btn-success">
          Add Employee
        </Link>
      </div>

      {/* Confirmation Modal */}
      <div
        className={`modal ${showModal ? "show" : ""}`}
        style={{ display: showModal ? "block" : "none" }}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Confirm Deletion</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowModal(false)}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this employee?</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowModal(false)}
                style={{ backgroundColor: "gray" }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={confirmDelete}
                style={{ backgroundColor: "rgb(208, 28, 28)" }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Employee;
