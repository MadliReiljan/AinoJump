import React, { useEffect, useState } from "react";
import "../styles/User.scss";
import "../styles/AdminUserList.scss";
import baseURL from "../baseURL";

const AdminUserList = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${baseURL}/accounts/get_all_users.php`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch users.");
        }

        const data = await response.json();
        console.log('Fetched users:', data);
        if (Array.isArray(data)) {
          setUsers(data);
        } else if (data.message) {
          setError(data.message);
        } else {
          setError('Unknown error fetching users.');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (isLoading) {
    return <div className="loading-container">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!Array.isArray(users) || users.length === 0) {
    return <div className="error-message">No users found.</div>;
  }

  return (
    <div className="admin-user-list-container">
      <h1>All Users</h1>
      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Eesnimi</th>
            <th>Perekonnanimi</th>
            <th>Email</th>
            <th>Telefon</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.firstName || user.fullName || '-'}</td>
              <td>{user.lastName || '-'}</td>
              <td>{user.email || '-'}</td>
              <td>{user.phone || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUserList;
