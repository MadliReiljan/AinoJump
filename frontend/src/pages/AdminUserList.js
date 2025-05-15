import React, { useEffect, useState } from "react";
import "../styles/User.scss";
import "../styles/AdminUserList.scss";
import baseURL from "../baseURL";
import ModalMessage from "../components/ModalMessage";

const AdminUserList = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [modal, setModal] = useState({ open: false, title: '', message: '', onClose: null, onConfirm: null, onCancel: null });

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

     const fetchCurrentUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const response = await fetch(`${baseURL}/accounts/user.php`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          if (data && (data.id || data.user_id)) setCurrentUserId(data.id || data.user_id);
        }
      } catch (e) {}
    };

    fetchUsers();
    fetchCurrentUser();
  }, []);

  const handleDeleteUser = async (userId) => {
    setModal({
      open: true,
      title: 'Kinnitus',
      message: 'Kas oled kindel, et soovid selle kasutaja kustutada?',
      onConfirm: async () => {
        setModal(m => ({ ...m, open: false }));
        try {
          const response = await fetch(`${baseURL}/accounts/delete_user.php`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ id: userId }),
          });
          if (response.ok) {
            setUsers((prev) => prev.filter((u) => u.id !== userId));
            setModal({ open: true, title: 'Õnnestus', message: 'Kasutaja kustutati edukalt.', onClose: () => setModal(m => ({ ...m, open: false })) });
          } else {
            const errorData = await response.json();
            setModal({ open: true, title: 'Viga', message: errorData.message || 'Kasutaja kustutamine ebaõnnestus.', onClose: () => setModal(m => ({ ...m, open: false })) });
          }
        } catch (err) {
          setModal({ open: true, title: 'Viga', message: 'Kasutaja kustutamisel tekkis viga.', onClose: () => setModal(m => ({ ...m, open: false })) });
        }
      },
      onCancel: () => setModal(m => ({ ...m, open: false })),
    });
  };

  if (isLoading) {
    return <div className="loading-container">Laadimine...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!Array.isArray(users) || users.length === 0) {
    return <div className="error-message">Kasutajaid ei leitud.</div>;
  }

  return (
    <div className="admin-user-list-container">
      <ModalMessage
        open={modal.open}
        title={modal.title}
        message={modal.message}
        onClose={modal.onClose}
        onConfirm={modal.onConfirm}
        onCancel={modal.onCancel}
      />
      <button className="back-button" onClick={() => window.history.back()} style={{marginBottom: '1rem'}}>Tagasi</button>
      <h1>Kõik Kasutajad</h1>
      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Eesnimi</th>
            <th>Perekonnanimi</th>
            <th>E-post</th>
            <th>Telefon</th>
            <th>Tegevus</th>
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
              <td>
                {user.role !== 'owner' && (
                  <button
                    className="delete-user-btn"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    Kustuta
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUserList;
