import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../auth/Authentication";
import PostModal from "../components/PostModal";
import Button from "../components/Button";
import ModalMessage from "../components/ModalMessage";
import "../styles/Info.scss";
import baseURL from "../baseURL";

export const Info = () => {
  const { userRole } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [modal, setModal] = useState({ open: false, title: "", message: "", onClose: null });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${baseURL}/info/list_posts.php`);
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      } else {
        console.error("Failed to fetch posts. Status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const handlePostCreated = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  const handleDeletePost = async (postId) => {
    setModal({
      open: true,
      title: "Kustuta postitus",
      message: "Kas oled kindel, et soovid selle postituse kustutada?",
      onClose: () => setModal({ ...modal, open: false }),
      onConfirm: async () => {
        setModal({ ...modal, open: false });
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(`${baseURL}/info/delete_post.php`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ id: postId }),
          });

          if (response.ok) {
            setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
            setModal({
              open: true,
              title: "Kustutatud",
              message: "Postitus on edukalt kustutatud.",
              onClose: () => setModal({ ...modal, open: false })
            });
          } else {
            setModal({
              open: true,
              title: "Viga",
              message: "Postituse kustutamine ebaõnnestus.",
              onClose: () => setModal({ ...modal, open: false })
            });
          }
        } catch (error) {
          setModal({
            open: true,
            title: "Viga",
            message: "Tekkis viga postituse kustutamisel.",
            onClose: () => setModal({ ...modal, open: false })
          });
        }
      }
    });
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setIsPostModalOpen(true);
  };

  const handlePostUpdated = (updatedPost) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => (post.id === updatedPost.id ? updatedPost : post))
    );
    setEditingPost(null);
    setIsPostModalOpen(false);
  };

  return (
    <div className="info-container">
      <h1 className="page-title">Info</h1>
      
      {userRole === "owner" && (
        <div className="admin-controls">
          <button onClick={() => setIsPostModalOpen(true)} className="neutral">
            Loo postitus
          </button>
          {isPostModalOpen && (
            <PostModal
              onClose={() => setIsPostModalOpen(false)}
              onPostCreated={handlePostCreated}
              editingPost={editingPost}
              onPostUpdated={handlePostUpdated}
            />
          )}
        </div>
      )}
  
      <div className="posts-grid">
        {posts.length > 0 ? (
          posts.map((post, index) => (
            <div className="post-card" key={post.id}>
              {post.image_url && (
                <div className="post-image">
                  <img
                    src={`${baseURL}${post.image_url}`}
                    alt={post.title}
                    onError={(e) => {
                      console.error("Image failed to load:", `${baseURL}${post.image_url}`);
                      e.target.onerror = null;
                      e.target.className = 'placeholder-image';
                    }}
                  />
                </div>
              )}
              <h3 className="post-title">{post.title}</h3>
              <p className="post-date">{post.time ? new Date(post.time).toLocaleString() : "Kuupäev"}</p>
              <p className="post-content">{post.body}</p>
              
              {userRole === "owner" && (
                <div className="post-actions">
                  <button 
                    onClick={() => handleEditPost(post)} 
                    className="post-edit-button"
                  >
                    Muuda
                  </button>
                  <button 
                    onClick={() => handleDeletePost(post.id)} 
                    className="post-delete-button"
                  >
                    Kustuta
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>Postitusi hetkel pole.</p>
        )}
      </div>
      {modal.open && (
        <ModalMessage
          open={modal.open}
          title={modal.title}
          message={modal.message}
          onClose={modal.onClose}
          onConfirm={modal.onConfirm}
        />
      )}
    </div>
  );
}