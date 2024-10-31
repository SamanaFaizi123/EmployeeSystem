import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const EmployeeDetail = () => {
  const [employee, setEmployee] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3000/employee/detail/" + id)
      .then((result) => {
        setEmployee(result.data[0]);
      })
      .catch((err) => console.log(err));
  }, [id]);

  const handleLogout = () => {
    axios
      .get("http://localhost:3000/employee/logout")
      .then((result) => {
        if (result.data.Status) {
          localStorage.removeItem("valid");
          navigate("/");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="container d-flex flex-column" style={{ minHeight: "80vh" }}>
      <div className="text-center mt-4 header">
        <h4>Employee Management System</h4>
      </div>

      <div
        className="card  mx-auto mt-auto mb-5 shadow"
        style={{ maxWidth: "600px", width: "100%" }}
      >
        <div className="row g-0 align-items-center">
          {/* Left Column: Image */}
          <div className="col-md-6 d-flex align-items-center justify-content-center">
            <img
              src={`http://localhost:3000/Images/` + employee.image}
              className="img-fluid rounded-circle"
              alt={employee.name}
              style={{ width: "230px", height: "200px", objectFit: "cover" }}
            />
          </div>
          {/* Right Column: Details */}
          <div className="col-md-6">
            <div className="card-body text-center text-md-start">
              <h5 className="card-title">{employee.name}</h5>
              <p className="card-text">Email: {employee.email}</p>
              <p className="card-text">Salary: ${employee.salary}</p>
              <p className="card-text">Address: {employee.address}</p>
              <div className="d-flex justify-content-center justify-content-md-start">
                <button
                  className="btn btn-danger"
                  style={{
                    width: "100px",
                    backgroundColor: "rgb(208, 28, 28)",
                  }}
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>
        {`
          /* Default spacing */
          .header {
            margin-bottom: 20px;
          }

          /* Adjust spacing on small screens */
          @media (max-width: 576px) {
            .header {
              margin-bottom: 40px;
            }
          }
        `}
      </style>
    </div>
  );
};

export default EmployeeDetail;
