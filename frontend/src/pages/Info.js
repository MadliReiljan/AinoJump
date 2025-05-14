import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../auth/Authentication";
import PostModal from "../components/PostModal";
import Button from "../components/Button";
import "../styles/Info.scss";
import baseURL from "../baseURL";

export const Info = () => {
  const { userRole } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

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
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;

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
        alert("Post deleted successfully!");
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("An error occurred while deleting the post.");
    }
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
          <Button onClick={() => setIsPostModalOpen(true)} className="neutral">
            Loo postitus
          </Button>
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
                    src={`${baseURL}/backend${post.image_url}`}
                    alt={post.title}
                    onError={(e) => {
                      console.error("Image failed to load:", `${baseURL}/backend${post.image_url}`);
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
                  <Button onClick={() => handleEditPost(post)} className="neutral">
                    Edit
                  </Button>
                  <Button onClick={() => handleDeletePost(post.id)} className="danger">
                    Delete
                  </Button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>Postitusi hetkel pole.</p>
        )}
      </div>
    </div>
  );
}