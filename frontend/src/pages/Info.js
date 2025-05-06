import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../auth/Authentication";
import PostModal from "../components/PostModal";
import "../styles/GlobalContainer.scss";
import Button from "../components/Button";
import "../styles/Info.scss";

export const Info = () => {
  const { userRole } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch("http://localhost:8000/info/list_posts.php");
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched posts:", data); 
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

  return (
    <div className="container">
      {userRole === "owner" && (
        <div>
          <Button onClick={() => setIsPostModalOpen(true)} className="neutral">Loo postitus</Button>
          {isPostModalOpen && (
            <PostModal
              onClose={() => setIsPostModalOpen(false)}
              onPostCreated={handlePostCreated}
            />
          )}
        </div>
      )}

      <div>
        <h2>Postitused</h2>
        {posts.length > 0 ? (
          posts.map((post, index) => (
            <div key={post.id || index} className="post"> 
              <h3>{post.title}</h3>
              <p>{post.body}</p>
              <p>
                <strong>Aeg:</strong>{" "}
                {post.time ? new Date(post.time).toLocaleString() : "Aeg puudub"}
              </p>
            </div>
          ))
        ) : (
          <p>Postitusi hetkel pole.</p>
        )}
        {console.log("Rendered posts:", posts)} 
      </div>
    </div>
  );
};